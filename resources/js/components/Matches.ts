import * as m from 'mithril';
import teams, {Match} from '../teams';
import TeamLogo from './TeamLogo';

interface MatchesAttrs {
    matches: Match[]
}

export default class Matches implements m.ClassComponent<MatchesAttrs> {
    team: string | null = null

    view(vnode: m.VnodeDOM<MatchesAttrs, this>) {
        const {matches} = vnode.attrs;

        if (!Array.isArray(matches)) {
            return m('p', 'Données de match invalides');
        }

        let lastGame = null;

        const selectedTeam = this.team ? teams.find(team => team.key === this.team) : null;

        return [
            m('.d-flex.justify-content-between', [
                m('h2', 'Matches'),
                m('.dropdown.ml-auto', [
                    m('button[type=button][data-bs-toggle=dropdown][aria-expanded=false].btn.btn-primary.dropdown-toggle', selectedTeam ? [
                        m(TeamLogo, {
                            team: selectedTeam,
                        }),
                        ' ' + selectedTeam.name,
                    ] : 'Afficher le programme d\'une équipe'),
                    m('.dropdown-menu.dropdown-menu-end', [
                        m('button[type=button].dropdown-item', {
                            onclick: () => {
                                this.team = null;
                            },
                        }, 'Toutes les équipes'),
                        teams.map(team => m('button[type=button].dropdown-item', {
                            className: this.team === team.key ? 'active' : '',
                            onclick: () => {
                                this.team = team.key;
                            },
                        }, [
                            m(TeamLogo, {
                                team,
                            }),
                            ' ' + team.name,
                        ])),
                    ]),
                ]),
            ]),
            m('table.table.table-sm', [
                m('thead', m('tr', [
                    m('th.text-right', '#'),
                    m('th', 'Heure'),
                    m('th', 'Table A'),
                    m('th', 'Table B'),
                    m('th', 'Table C'),
                    m('th', 'Table D'),
                ])),
                m('tbody', matches.map(match => {
                    let rowClasses = [];

                    const involvesSelectedTeam = this.team && match.tables.some(table => table.team === this.team);

                    if (this.team && !involvesSelectedTeam) {
                        rowClasses.push('text-muted');
                    }

                    if (involvesSelectedTeam) {
                        rowClasses.push('table-primary');
                    }

                    let rows = [
                        m('tr', {
                            className: rowClasses.join(' '),
                        }, [
                            m('td.text-right.text-muted', match.current ? m('span.fas.fa-play.text-primary', {
                                title: 'Match #' + match.number + ' en cours',
                            }) : match.number),
                            m('td', {
                                className: match.current ? 'font-weight-bold text-primary' : '',
                            }, match.time),
                            match.tables.length && match.tables[0].table !== 'A' ? [
                                m('td'),
                                m('td'),
                            ] : null,
                            match.tables.map(table => {
                                const team = teams.find(team => team.key === table.team);

                                if (!team) {
                                    return m('td.text-muted', '?');
                                }

                                return m('td', {
                                    className: team.key === this.team ? 'font-weight-bold' : '',
                                }, [
                                    m(TeamLogo, {
                                        team,
                                    }),
                                    ' ' + team.name,
                                    table.score ? [
                                        ' ',
                                        m('a.btn.btn-very-small.btn-outline-secondary', {
                                            href: table.scoreboard ? 'https://fll-scoreboard-2018.robots-ju.ch/#' + table.scoreboard : '#',
                                            target: '_blank',
                                            rel: 'noopener',
                                            title: table.scoreboard ? 'Cliquer pour voir le détail des missions sur le scoreboard' : 'Scoreboard non disponible',
                                            onclick(event) {
                                                if (!table.scoreboard) {
                                                    event.preventDefault();
                                                }
                                            },
                                        }, table.score),
                                    ] : null,
                                ]);
                            }),
                            match.tables.length && match.tables[0].table === 'A' ? [
                                m('td'),
                                m('td'),
                            ] : null,
                        ]),
                    ];

                    if (match.game !== lastGame) {
                        let gameName;

                        if (match.game === 'semifinals') {
                            gameName = 'Demi-finales';
                        } else if (match.game === 'finals') {
                            gameName = 'Finales';
                        } else {
                            gameName = 'Qualifications';
                        }

                        rows.unshift(m('tr', m('th.text-center', {
                            colspan: 6,
                        }, gameName)));

                        lastGame = match.game;
                    }

                    return rows;
                })),
            ]),
        ];
    }
}
