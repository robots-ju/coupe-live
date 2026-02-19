import * as m from 'mithril';
import teams from '../teams';
import TeamLogo from './TeamLogo';

interface RobotGameOverlayAttrs {
    matches?: any
}

export default class RobotGameOverlay implements m.ClassComponent<RobotGameOverlayAttrs> {
    sessions: any[]

    oninit(vnode: m.Vnode<RobotGameOverlayAttrs, this>) {
        this.sessions = vnode.attrs.matches || [];

        window.Echo.channel('live')
            .listen('MatchesUpdated', event => {
                this.sessions = event.matches;
                m.redraw();
            });
    }

    view() {
        let currentMatch = null;

        this.sessions.forEach(session => {
            session.tasks.forEach(task => {
                if (currentMatch) {
                    return;
                }

                if (task.completed) {
                    return;
                }

                if (!task.teams) {
                    return;
                }

                currentMatch = task;
            });
        });

        return m('.robotgame-overlay', currentMatch ? [
            m('.robotgame-overlay-team.robotgame-overlay-team--left', this.teamName(currentMatch.teams[0])),
            m('.robotgame-overlay-team.robotgame-overlay-team--right', this.teamName(currentMatch.teams[1], true)),
        ] : null);
    }

    teamName(teamRef, right: boolean = false) {
        const number = typeof teamRef === 'object' ? teamRef.team : teamRef;
        const team = teams.find(team => team.number === number);

        return [
            right ? null : m(TeamLogo, {
                team,
            }),
            ' ',
            m('span.robotgame-overlay-team-name', team.name),
            ' ',
            right ? m(TeamLogo, {
                team,
            }) : null,
        ];
    }
}
