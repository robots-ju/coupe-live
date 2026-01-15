import * as m from 'mithril';

interface MatchesAttrs {
    matches: any
    presentation: boolean
    moderatorToken?: string
}

export default class Matches implements m.ClassComponent<MatchesAttrs> {
    team: string | null = null

    view(vnode: m.VnodeDOM<MatchesAttrs, this>) {
        const {matches, presentation, moderatorToken} = vnode.attrs;

        // In this adaptation, the matches variable holds the sessions list
        const sessions = matches;

        let taskIndex = 0;

        return [
            presentation ? null : m('h2', 'Programme'),
            sessions.map(session => {
                // In presentation mode, hide sessions that have all tasks completed
                if (presentation) {
                    const hasUncompletedTasks = session.tasks.some(task => !task.completed);

                    if (!hasUncompletedTasks) {
                        return null;
                    }
                }

                return m('.session', {
                    style: {
                        '--session-color': session.color,
                    },
                }, [
                    m('.session-name', session.name),
                    session.tasks.map(task => {
                        const taskAttrs: any = {};

                        const thisTaskIndex = taskIndex++;

                        if (moderatorToken) {
                            taskAttrs.onclick = () => {
                                m.request({
                                    url: '/toggle-task',
                                    method: 'POST',
                                    body: {
                                        moderator_token: moderatorToken,
                                        task: thisTaskIndex,
                                    },
                                });
                            };
                        }

                        if (task.completed) {
                            taskAttrs.className = 'task-completed';
                        }

                        return m('.task', taskAttrs, [
                            m('.task-time', task.time),
                            task.team ? this.teamName(task.team) : null,
                            task.teams ? task.teams.map(this.teamName) : null,
                            m('.task-location', [
                                m('i.fas.fa-location-dot'),
                                ' ',
                                task.location,
                            ]),
                        ]);
                    }),
                ]);
            }),
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
