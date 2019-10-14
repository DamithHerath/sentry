import React from 'react';

import {Panel, PanelBody, PanelItem, PanelHeader} from 'app/components/panels';
import {t} from 'app/locale';
import Button from 'app/components/button';
import Confirm from 'app/components/confirm';
import EmptyMessage from 'app/views/settings/components/emptyMessage';
import space from 'app/styles/space';

import {IncidentRule, Trigger} from '../types';

enum ActionType {
  EMAIL = 0,
  SLACK = 1,
  PAGER_DUTY = 2,
}

enum TargetType {
  // The name can be customized for each integration. Email for email, channel for slack, service for Pagerduty). We probably won't support this for email at first, since we need to be careful not to enable spam
  SPECIFIC = 0,

  // Just works with email for now, grabs given user's email address
  USER = 1,

  // Just works with email for now, grabs the emails for all team members
  TEAM = 2,
}

type Action = {
  id?: string;
  type: ActionType;

  targetType: TargetType;

  // How to identify the target. Can be email, slack channel, pagerduty service, user_id, team_id, etc
  targetIdentifier: string;
};

type Props = {
  organization: Organization;
  trigger: Trigger;
  rule: IncidentRule;
  actions: Action[];
};

export default class Actions extends React.Component<Props> {
  render() {
    return (
      <Panel>
        <PanelHeader>
          <div>{t('Actions')}</div>
        </PanelHeader>
        <PanelBody />
      </Panel>
    );
  }
}
