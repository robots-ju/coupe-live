import * as m from 'mithril';

interface MatchesAttrs {
    matches: any
    presentation: boolean
}

export default class Matches implements m.ClassComponent<MatchesAttrs> {
    team: string | null = null

    view(vnode: m.VnodeDOM<MatchesAttrs, this>) {
        const {matches, presentation} = vnode.attrs;

        // In this adaptation, the matches variable holds the sessions list
        const sessions = matches;

        return [
            presentation ? null : m('h2', 'Programme'),
            sessions.map(session => m('.session', {
                style: {
                    '--session-color': session.color,
                },
            }, [
                m('.session-name', session.name),
                session.tasks.map(task => m('.task', [
                    m('.task-time', task.time),
                    task.team ? this.teamName(task.team) : null,
                    task.teams ? task.teams.map(this.teamName) : null,
                    m('.task-location', [
                        m('i.fas.fa-location-dot'),
                        ' ',
                        task.location,
                    ]),
                ])),
            ])),
        ];
    }

    teamName(team) {
        return m('.task-team-entry', {
            className: team.number === '0' ? 'no-team' : '',
        }, [
            m('span.task-team-name', team.name),
            team.number && team.number !== '0' ? [
                ' ',
                m('span.task-team-number', '(' + team.number + ')'),
            ] : null,
            team.table ? [
                ' - ',
                m('span.task-table', team.table),
            ] : null,
        ])
    }
}
