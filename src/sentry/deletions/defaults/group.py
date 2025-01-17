from __future__ import absolute_import, print_function

from sentry import eventstore, nodestore
from sentry.models import Event, EventAttachment, UserReport

from ..base import BaseDeletionTask, BaseRelation, ModelDeletionTask, ModelRelation


class EventDataDeletionTask(BaseDeletionTask):
    """
    Deletes nodestore data, EventAttachment and UserReports for group
    """

    DEFAULT_CHUNK_SIZE = 10000

    def __init__(self, manager, group_id, project_id, **kwargs):
        self.group_id = group_id
        self.project_id = project_id
        self.last_event = None
        super(EventDataDeletionTask, self).__init__(manager, **kwargs)

    def chunk(self):
        conditions = []
        if self.last_event is not None:
            conditions.extend(
                [
                    ["timestamp", "<=", self.last_event.timestamp],
                    [
                        ["timestamp", "<", self.last_event.timestamp],
                        ["event_id", "<", self.last_event.event_id],
                    ],
                ]
            )

        events = eventstore.get_events(
            filter=eventstore.Filter(
                conditions=conditions, project_ids=[self.project_id], group_ids=[self.group_id]
            ),
            limit=self.DEFAULT_CHUNK_SIZE,
            referrer="deletions.group",
            orderby=["-timestamp", "-event_id"],
        )

        if not events:
            return False

        self.last_event = events[-1]

        # Remove from nodestore
        node_ids = [Event.generate_node_id(self.project_id, event.event_id) for event in events]
        nodestore.delete_multi(node_ids)

        # Remove EventAttachment and UserReport
        EventAttachment.objects.filter(event_id=event.event_id, project_id=self.project_id).delete()
        UserReport.objects.filter(event_id=event.event_id, project_id=self.project_id).delete()

        return True


class GroupDeletionTask(ModelDeletionTask):
    def get_child_relations(self, instance):
        from sentry import models
        from sentry.incidents.models import IncidentGroup

        relations = []

        model_list = (
            # prioritize GroupHash
            models.GroupHash,
            models.GroupAssignee,
            models.GroupCommitResolution,
            models.GroupLink,
            models.GroupBookmark,
            models.GroupMeta,
            models.GroupEnvironment,
            models.GroupRelease,
            models.GroupRedirect,
            models.GroupResolution,
            models.GroupRuleStatus,
            models.GroupSeen,
            models.GroupShare,
            models.GroupSnooze,
            models.GroupEmailThread,
            models.GroupSubscription,
            models.UserReport,
            IncidentGroup,
            # Event is last as its the most time consuming
            models.Event,
        )

        relations.extend([ModelRelation(m, {"group_id": instance.id}) for m in model_list])

        relations.extend(
            [
                BaseRelation(
                    {"group_id": instance.id, "project_id": instance.project_id},
                    EventDataDeletionTask,
                )
            ]
        )

        return relations

    def delete_instance(self, instance):
        from sentry.similarity import features

        if not self.skip_models or features not in self.skip_models:
            features.delete(instance)

        return super(GroupDeletionTask, self).delete_instance(instance)

    def mark_deletion_in_progress(self, instance_list):
        from sentry.models import Group, GroupStatus

        Group.objects.filter(id__in=[i.id for i in instance_list]).exclude(
            status=GroupStatus.DELETION_IN_PROGRESS
        ).update(status=GroupStatus.DELETION_IN_PROGRESS)
