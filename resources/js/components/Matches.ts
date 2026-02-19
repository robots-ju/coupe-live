import * as m from 'mithril';
import teams from '../teams';
import TeamLogo from './TeamLogo';
import Schedule from './Schedule';

interface MatchesAttrs {
    matches: any
    presentation: boolean
    moderatorToken?: string
    onlyRobotGame?: boolean
}

export default class Matches implements m.ClassComponent<MatchesAttrs> {
    team: number | null = null

    view(vnode: m.VnodeDOM<MatchesAttrs, this>) {
        const {matches, presentation, moderatorToken, onlyRobotGame} = vnode.attrs;

        // In this adaptation, the matches variable holds the sessions list
        const sessions = matches;

        const selectedTeam = this.team ? teams.find(team => team.number === this.team) : null;

        return [
            m('.d-flex.justify-content-between', [
                presentation ? null : m('h2', 'Programme / Zeitplan'),
                presentation ? null : m('.dropdown.ml-auto', [
                    m('button[type=button][data-bs-toggle=dropdown][aria-expanded=false].btn.btn-primary.dropdown-toggle', selectedTeam ? [
                        m(TeamLogo, {
                            team: selectedTeam,
                        }),
                        ' ' + selectedTeam.name,
                    ] : 'Choix équipe / Team wählen'),
                    m('.dropdown-menu.dropdown-menu-end', [
                        m('button[type=button].dropdown-item', {
                            onclick: () => {
                                this.team = null;
                            },
                        }, 'Toutes / Alle'),
                        teams.map(team => m('button[type=button].dropdown-item', {
                            className: this.team === team.number ? 'active' : '',
                            onclick: () => {
                                this.team = team.number;
                            },
                        }, [
                            team.number + ' ',
                            m(TeamLogo, {
                                team,
                            }),
                            ' ' + team.name,
                        ])),
                    ]),
                ]),
            ]),
            m(Schedule, {
                sessions,
                presentation,
                moderatorToken,
                team: this.team,
                lang: selectedTeam ? selectedTeam.lang : null,
                onlyRobotGame,
            }),
        ];
    }
}
