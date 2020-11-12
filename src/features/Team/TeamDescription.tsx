import * as React from 'react';

import { IMemberName, ITeam, TEAM_OVERVIEW } from '../../config';
import { H1 } from '../../shared/Elements';
import theme from '../../shared/Styles/theme';

interface ITeamDescriptionProps {
  team: ITeam;
  members: IMemberName[];
  onLeaveTeam: () => void;
  isLeavingTeam: boolean;
}

const TeamDescription: React.FC<ITeamDescriptionProps> = (
  props: ITeamDescriptionProps
) => {
  return (
    <div className="centered">
      <div className="team-box">
        <div className="title">
          <H1 marginBottom="8px">Your Team</H1>
          <div className="info-text">{TEAM_OVERVIEW}</div>
        </div>

        <div className="team-code-container">
          <div className="label">Team code</div>
          <div className="info-text">Share this code with your team members to let them join:</div>
          <div className="team-code">{props.team.name}</div>
        </div>

        <div className="team-members-container">
          <div className="label">Members</div>
          <div className="members">
            {props.members.map((member, index) => (
              <div className="member" key={index}>
                <div className="name">{member.firstName} {member.lastName}</div>
                <div className="school">{member.school}</div>
              </div>
            ))}
          </div>
        </div>

        {
          !props.isLeavingTeam ?
            <div className="text-button" onClick={props.onLeaveTeam}>
              Leave team
            </div> :
            <div>
              Leaving team...
            </div>
        }
      </div>

      <style jsx>{`
        .centered {
          /* Center vertically */
          flex: 1;
          padding-top: 24px;
          padding-bottom: 114px; /* Offset for navbar (90px) + 24px vertical padding */

          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .team-box {
          max-width: 400px;
          text-align: left;
        }

        .title {
          margin-bottom: 32px;
        }

        .title .info-text {
          border-left: 4px solid ${theme.colors.purpleLight};
          padding: 4px 16px;
          margin-left: -20px;
        }

        .label {
          font-family: ${theme.fonts.header};
          margin-bottom: 8px;
        }

        .info-text {
          color: ${theme.colors.black80};
          font-size: 14px;
        }

        .team-code {
          background: ${theme.colors.purpleLight};
          color: ${theme.colors.purple};
          font-family: ${theme.fonts.header};
          font-size: 24px;
          padding: 16px;
          border-radius: 8px;

          text-align: center;
          margin-top: 8px;
          margin-bottom: 48px;
        }

        .members {
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .member:first-child {
          border-top: 1px solid ${theme.colors.black10};
        }

        .member {
          border-bottom: 1px solid ${theme.colors.black10};
          padding: 16px 24px;
        }

        .member .school {
          font-size: 14px;
          color: ${theme.colors.black60};
        }

        .text-button {
          display: inline-block;
          color: ${theme.colors.black60};
          text-decoration: underline;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export { TeamDescription };
