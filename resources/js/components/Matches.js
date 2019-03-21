import m from 'mithril';
import teams from "../teams";
import TeamLogo from "./TeamLogo";

export default {
    oninit(vnode) {
        vnode.state.team = null;
    },
    view(vnode) {
        const {matches} = vnode.attrs;

        if (!Array.isArray(matches)) {
            return m('p', 'Données de match invalides');
        }

        let lastGame = null;

        const selectedTeam = vnode.state.team ? teams.find(team => team.key === vnode.state.team) : null;

        return [
            m('.d-flex', [
                m('h2', 'Matches'),
                m('.dropdown.ml-auto', [
                    m('button[type=button][data-toggle=dropdown][aria-haspopup=true][aria-expanded=false].btn.btn-primary.dropdown-toggle', selectedTeam ? [
                        m(TeamLogo, {
                            team: selectedTeam,
                        }),
                        ' ' + selectedTeam.name,
                    ] : 'Afficher le programme d\'une équipe'),
                    m('.dropdown-menu.dropdown-menu-right', [
                        m('button[type=button].dropdown-item', {
                            onclick() {
                                vnode.state.team = null;
                            },
                        }, 'Toutes les équipes'),
                        teams.map(team => m('button[type=button].dropdown-item', {
                            className: vnode.state.team === team.key ? 'active' : '',
                            onclick() {
                                vnode.state.team = team.key;
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
                    m('th', '#'),
                    m('th', 'Heure'),
                    m('th', 'Table A'),
                    m('th', 'Table B'),
                    m('th', 'Table C'),
                    m('th', 'Table D'),
                ])),
                m('tbody', matches.map(match => {
                    let rowClasses = [];

                    const involvesSelectedTeam = match.tables.some(table => table.team === vnode.state.team);

                    if (vnode.state.team && !involvesSelectedTeam) {
                        rowClasses.push('text-muted');
                    }

                    if (involvesSelectedTeam) {
                        rowClasses.push('table-primary');
                    }

                    let rows = [
                        m('tr', {
                            className: rowClasses.join(' '),
                        }, [
                            m('td.text-right', {
                                className: match.current ? 'font-weight-bold text-primary' : '',
                            }, [
                                match.current ? [m('span.fas.fa-play', {
                                    title: 'Match en cours',
                                }), ' '] : null,
                                match.number,
                            ]),
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
                                    className: team.key === vnode.state.team ? 'font-weight-bold' : '',
                                }, [
                                    m(TeamLogo, {
                                        team,
                                    }),
                                    ' ' + team.name,
                                    table.score ? [
                                        ' ',
                                        m('a.btn.btn-sm.btn-outline-secondary', {
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
                            gameName = 'Semi-finales';
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
    },
}
