import React from 'react';
import styled from 'react-emotion';

import {IncidentRule, Trigger} from 'app/views/settings/incidentRules/types';
import {Organization} from 'app/types';
import {Panel, PanelBody, PanelItem, PanelHeader} from 'app/components/panels';
import {t} from 'app/locale';
import DropdownAutoCompleteMenu from 'app/components/dropdownAutoCompleteMenu';
import DropdownButton from 'app/components/dropdownButton';
import space from 'app/styles/space';

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
  actions?: Action[];
  className?: string;
  organization: Organization;
  rule: IncidentRule;
  trigger?: Trigger;
};

type State = {
  actions: Action[];
};

class ActionsPanel extends React.Component<Props, State> {
  render() {
    const {className} = this.props;

    return (
      <Panel className={className}>
        <PanelHeader hasButtons>
          <div>{t('Actions')}</div>
          <DropdownAutoCompleteMenu>
            {() => <DropdownButton size="small">{t('Add Action')}</DropdownButton>}
          </DropdownAutoCompleteMenu>
        </PanelHeader>
        <PanelBody>
          <PanelItem>Test</PanelItem>
        </PanelBody>
      </Panel>
    );
  }
}

const ActionsPanelWithSpace = styled(ActionsPanel)`
  margin-top: ${space(2)};
`;

export default ActionsPanelWithSpace;
