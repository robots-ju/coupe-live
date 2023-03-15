import * as m from 'mithril';
import teams, {Match} from '../teams';
import TeamLogo from './TeamLogo';

interface MatchesAttrs {
    matches: Match[]
    presentation: boolean
}

const PREVIOUS_MATCHES_VISIBLE_IN_PRESENTATION_MODE = 6;
// When reaching the end of the list, allow more old matches to remain visible
// Otherwise the page would be mostly blank
const MINIMUM_MATCHES_TO_SHOW = 12;

export default class Matches implements m.ClassComponent<MatchesAttrs> {
    team: string | null = null

    view(vnode: m.VnodeDOM<MatchesAttrs, this>) {
        const {matches, presentation} = vnode.attrs;

        const hasValidContent = Array.isArray(matches) && matches.length > 0;

        let lastGame = null;

        const selectedTeam = this.team ? teams.find(team => team.key === this.team) : null;

        const currentMatchIndex = matches.findIndex(match => match.current);
        // It's not a problem if this value is negative, the full list will be visible
        const showFromMatchIndex = Math.min(currentMatchIndex === -1 ? 0 : currentMatchIndex - PREVIOUS_MATCHES_VISIBLE_IN_PRESENTATION_MODE, matches.length - MINIMUM_MATCHES_TO_SHOW);

        return [
            m('.d-flex.justify-content-between', [
                presentation ? null : m('h2', 'Matches'),
                presentation ? null : m('.dropdown.ml-auto', [
                    m('button[type=button][data-bs-toggle=dropdown][aria-expanded=false].btn.btn-primary.dropdown-toggle', {
                        disabled: !hasValidContent,
                    }, selectedTeam ? [
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
            hasValidContent ? null : m('.program-soon', m('div', 'Programme définitif disponible prochainement')),
            m('table.table.table-sm', [
                m('thead', m('tr', [
                    m('th.text-right', '#'),
                    m('th', 'Heure'),
                    m('th', 'Table A'),
                    m('th', 'Table B'),
                    m('th', 'Table C'),
                    m('th', 'Table D'),
                ])),
                m('tbody', hasValidContent ? matches.map((match, matchIndex) => {
                    if (presentation && matchIndex < showFromMatchIndex) {
                        return null;
                    }

                    let rowClasses = [];

                    const involvesSelectedTeam = this.team && match.tables.some(table => table.team === this.team);

                    if (this.team && !involvesSelectedTeam) {
                        rowClasses.push('text-muted');
                    }

                    if (involvesSelectedTeam) {
                        rowClasses.push('table-primary');
                    }

                    if (presentation && match.current) {
                        rowClasses.push('table-secondary');
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
                                    ' ',
                                    m('span', {
                                        className: team.name && team.name.length >= 18 ? 'long-team-name' : '',
                                    }, team.name),
                                    table.score ? [
                                        ' ',
                                        m('a.btn.btn-very-small.btn-outline-secondary', {
                                            href: table.scoreboard ? 'https://fll-scoreboard.robots-ju.ch/super-powered#' + table.scoreboard : '#',
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
                }) : this.placeholder()),
            ]),
        ];
    }

    placeholder() {
        const dom = [];

        for (let i = 0; i < 14; i++) {
            dom.push(m('tr', [
                m('td', m('span.text-placeholder', {
                    style: {
                        '--length': 2,
                    },
                })),
                m('td', [
                    m('span.text-placeholder', {
                        style: {
                            '--length': 2,
                        },
                    }),
                    ':',
                    m('span.text-placeholder', {
                        style: {
                            '--length': 2,
                        },
                    }),
                ]),
                i % 2 === 0 ? null : [
                    m('td'),
                    m('td'),
                ],
                m('td', [
                    m('span.team-logo'),
                    ' ',
                    m('span.text-placeholder', {
                        style: {
                            '--length': 10,
                        },
                    }),
                ]),
                m('td', [
                    m('span.team-logo'),
                    ' ',
                    m('span.text-placeholder', {
                        style: {
                            '--length': 10,
                        },
                    }),
                ]),
                i % 2 === 0 ? [
                    m('td'),
                    m('td'),
                ] : null,
            ]));
        }

        return dom;
    }
}
