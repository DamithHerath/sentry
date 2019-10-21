import React from 'react';
import styled from 'react-emotion';

import {IncidentRule, Trigger} from 'app/views/settings/incidentRules/types';
import {Organization} from 'app/types';
import {Panel, PanelBody, PanelItem, PanelHeader} from 'app/components/panels';
import {t} from 'app/locale';
import DropdownAutoComplete from 'app/components/dropdownAutoComplete';
import DropdownButton from 'app/components/dropdownButton';
import SelectControl from 'app/components/forms/selectControl';
import space from 'app/styles/space';
import EmptyMessage from 'app/views/settings/components/emptyMessage';

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
  targetIdentifier: string | null;
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

const ActionLabel = {
  [ActionType.EMAIL]: t('E-mail'),
  [ActionType.SLACK]: t('Slack'),
  [ActionType.PAGER_DUTY]: t('Pagerduty'),
};

const TargetLabel = {
  [TargetType.USER]: t('Member'),
  [TargetType.TEAM]: t('Team'),
};

class ActionsPanel extends React.Component<Props, State> {
  state = {
    actions: [],
  };

  handleSelect = value => {
    console.log('selected value', value);
    this.setState(state => ({
      ...state,
      actions: [
        ...state.actions,
        {
          type: value.value,
          targetType: TargetType.USER,
          targetIdentifier: null,
        },
      ],
    }));
  };

  render() {
    const {className} = this.props;
    const {actions} = this.state;

    const items = Object.entries(ActionLabel).map(([value, label]) => ({value, label}));

    return (
      <Panel className={className}>
        <PanelHeader hasButtons>
          <div>{t('Actions')}</div>
          <DropdownAutoComplete
            blendCorner
            hideInput
            onSelect={this.handleSelect}
            items={items}
          >
            {() => <DropdownButton size="small">{t('Add Action')}</DropdownButton>}
          </DropdownAutoComplete>
        </PanelHeader>
        <PanelBody>
          {!actions.length && (
            <EmptyMessage>{t('No Actions have been added')}</EmptyMessage>
          )}
          {actions.map((action: Action, i: number) => (
            <PanelItemGrid key={i}>
              {ActionLabel[action.type]}

              <SelectControl
                value={action.targetType}
                options={Object.entries(TargetLabel).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />

              {action.targetType === TargetType.USER && (
                <SelectControl
                  value={action.targetType}
                  options={Object.entries(TargetLabel).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                />
              )}
            </PanelItemGrid>
          ))}
        </PanelBody>
      </Panel>
    );
  }
}

const ActionsPanelWithSpace = styled(ActionsPanel)`
  margin-top: ${space(4)};
`;

const PanelItemGrid = styled(PanelItem)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  grid-gap: ${space(2)};
`;

export default ActionsPanelWithSpace;
