import * as m from 'mithril';
import teams from '../teams';
import TeamLogo from './TeamLogo';

interface ScheduleAttrs {
    sessions: any
    presentation: boolean
    moderatorToken?: string
    team?: number | null
    lang?: string | null
    hideGeneralTasksForTeam?: boolean
    hideAllFinished?: boolean
    onlyRobotGame?: boolean
}

export default class Schedule implements m.ClassComponent<ScheduleAttrs> {
    view(vnode: m.VnodeDOM<ScheduleAttrs, this>) {
        const {
            sessions,
            presentation,
            moderatorToken,
            team,
            lang,
            hideGeneralTasksForTeam,
            hideAllFinished,
            onlyRobotGame,
        } = vnode.attrs;

        let taskIndex = 0;

        return sessions.map(session => {
            const tasksVnode = [];

            // Create nodes first as that's where we increment the task index
            session.tasks.forEach(task => {
                const taskAttrs: any = {};

                const thisTaskIndex = taskIndex++;

                if (team) {
                    if (task.team && task.team !== team) {
                        return;
                    }

                    if (task.teams && !task.teams.some(ref => {
                        const number = typeof ref === 'object' ? ref.team : ref;

                        return team === number;
                    })) {
                        return;
                    }

                    if (hideGeneralTasksForTeam && !task.team && !task.teams) {
                        return;
                    }

                }

                if (onlyRobotGame && !session.name.includes('Robot-Game')) {
                    return;
                }

                if (hideAllFinished && task.completed) {
                    return;
                }

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

                tasksVnode.push(m('.task', taskAttrs, [
                    m('.task-time', task.time),
                    task.team ? this.teamName(task.team) : null,
                    task.teams ? task.teams.map(this.teamName) : null,
                    m('.task-location', [
                        m('i.fas.fa-location-dot'),
                        ' ',
                        task.location,
                    ]),
                ]));
            });

            if (tasksVnode.length === 0) {
                return;
            }

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
                m('.session-name', this.translate(session.name, lang)),
                tasksVnode,
            ]);
        });
    }

    teamName(teamRef) {
        const number = typeof teamRef === 'object' ? teamRef.team : teamRef;
        const team = teams.find(team => team.number === number);

        return m('.task-team-entry', {
            className: team ? '' : 'no-team',
        }, [
            m(TeamLogo, {
                team,
            }),
            ' ',
            m('span.task-team-name', team.name),
            team ? [
                ' ',
                m('span.task-team-number', '(' + team.number + ')'),
            ] : null,
            typeof teamRef === 'object' && teamRef.table ? [
                ' - ',
                m('span.task-table', teamRef.table),
            ] : null,
        ])
    }

    translate(text: string, lang: string | null): string {
        if (lang === 'de') {
            return text;
        }

        if (!lang) {
            const combined_translations = {
                'Robot-Game Testrunde': 'Robot-Game Manche de test / Testrunde',
                'Robot-Game Vorrunde 1': 'Robot-Game Manche 1 / Vorrunde 1',
                'Robot-Game Vorrunde 2': 'Robot-Game Manche 2 / Vorrunde 2',
                'Robot-Game Vorrunde 3': 'Robot-Game Manche 3 / Vorrunde 3',
                'Robot-Game Halbfinale': 'Robot-Game Demi-finale / Halbfinale',
            }

            if (combined_translations.hasOwnProperty(text)) {
                return combined_translations[text];
            }
        }

        const simple_translations = {
            'Eröffnung': 'Ouverture',
            'Jurybewertung': 'Évaluation du jury',
            'Robot-Game Testrunde': 'Robot-Game Manche de test',
            'Robot-Game Vorrunde 1': 'Robot-Game Manche 1',
            'Robot-Game Vorrunde 2': 'Robot-Game Manche 2',
            'Robot-Game Vorrunde 3': 'Robot-Game Manche 3',
            'Robot-Game Halbfinale': 'Robot-Game Demi-finale',
            'Forschung auf der Bühne': 'Présentations sur scène',
            'Preisverleihung': 'Remise des prix',
        };

        if (simple_translations.hasOwnProperty(text)) {
            if (lang === 'fr') {
                return simple_translations[text];
            }

            return simple_translations[text] + ' / ' + text;
        }

        return text;
    }
}
