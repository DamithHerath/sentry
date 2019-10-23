import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

import {Member} from 'app/types';
import {PanelItem} from 'app/components/panels';
import {t, tct} from 'app/locale';
import Button from 'app/components/button';
import Confirm from 'app/components/confirm';
import Tag from 'app/views/settings/components/tag';
import Tooltip from 'app/components/tooltip';
import space from 'app/styles/space';

type Props = {
  inviteRequest: Member;
  inviteRequestBusy: Map<string, boolean>;
  onApprove: (id: string, email: string) => Promise<void>;
  onDeny: (id: string, email: string) => Promise<void>;
};

const InviteRequestRow = ({
  inviteRequest: {id, email, inviteStatus, inviterName},
  inviteRequestBusy,
  onApprove,
  onDeny,
}: Props) => {
  return (
    <StyledPanel>
      <div>
        <h5 style={{margin: '0 0 3px'}}>
          <UserName>{email}</UserName>
        </h5>
        {inviteStatus === 'requested_to_be_invited' ? (
          inviterName && (
            <Tooltip
              title={tct(
                '[inviterName] requested to invite [email] to your organization',
                {
                  inviterName,
                  email,
                }
              )}
            >
              <Description>
                {tct('Requested by [inviterName]', {inviterName})}
              </Description>
            </Tooltip>
          )
        ) : (
          <Tooltip title={tct('[email] requested to join your organization', {email})}>
            <Tag size="small">{t('external request')}</Tag>
          </Tooltip>
        )}
      </div>
      <ButtonGroup>
        <Confirm
          onConfirm={() => onApprove(id, email)}
          message={tct('Are you sure you want to invite [email] to your organization?', {
            email,
          })}
        >
          <Button priority="primary" size="small" busy={inviteRequestBusy.get(id)}>
            {t('Approve')}
          </Button>
        </Confirm>
        <Button
          size="small"
          busy={inviteRequestBusy.get(id)}
          onClick={() => onDeny(id, email)}
        >
          {t('Deny')}
        </Button>
      </ButtonGroup>
    </StyledPanel>
  );
};

InviteRequestRow.propTypes = {
  inviteRequest: PropTypes.shape({
    email: PropTypes.string,
    id: PropTypes.string,
    inviterName: PropTypes.string,
    inviteStatus: PropTypes.string,
  }),
  onApprove: PropTypes.func,
  onDeny: PropTypes.func,
  inviteRequestBusy: PropTypes.object,
};

const StyledPanel = styled(PanelItem)`
  display: grid;
  grid-template-columns: auto max-content;
  grid-gap: ${space(1)};
  align-items: center;
`;

const UserName = styled('div')`
  font-size: 16px;
`;

const Description = styled('div')`
  color: ${p => p.theme.gray3};
  font-size: 14px;
`;

const ButtonGroup = styled('div')`
  display: inline-grid;
  grid-template-columns: auto auto;
  grid-gap: ${space(0.5)};
`;

export default InviteRequestRow;
