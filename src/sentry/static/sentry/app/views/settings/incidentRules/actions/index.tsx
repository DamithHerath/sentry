import React from 'react';
import styled, {css} from 'react-emotion';

import {Panel, PanelBody, PanelItem, PanelHeader} from 'app/components/panels';
import {t} from 'app/locale';
import Button from 'app/components/button';
import Confirm from 'app/components/confirm';
import EmptyMessage from 'app/views/settings/components/emptyMessage';
import space from 'app/styles/space';

import {Trigger} from '../types';
import getTriggerConditionDisplayName from '../utils/getTriggerConditionDisplayName';

type Props = {
  triggers: Trigger[];
  onDelete: (trigger: Trigger) => void;
  onEdit: (trigger: Trigger) => void;
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

const gridCss = css`
  display: grid;
  grid-template-columns: 1fr 2fr 3fr;
  grid-gap: ${space(1)};
  align-items: center;
`;

const PanelHeaderGrid = styled(PanelHeader)`
  ${gridCss};
`;

const Grid = styled(PanelItem)`
  ${gridCss};
`;

const Label = styled('div')`
  font-size: 1.2em;
`;

const Condition = styled('div')``;

const MainCondition = styled('div')``;
const SecondaryCondition = styled('div')`
  font-size: ${p => p.theme.fontSizeSmall};
  color: ${p => p.theme.gray2};
`;

const ButtonBar = styled('div')`
  display: grid;
  grid-gap: ${space(1)};
  grid-auto-flow: column;
`;
