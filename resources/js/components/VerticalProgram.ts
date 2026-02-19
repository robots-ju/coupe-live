import * as m from 'mithril';
import Clock from './Clock';
import Schedule from './Schedule';
import teams, {Team} from '../teams';
import TeamLogo from './TeamLogo';

interface VerticalProgramAttrs {
    matches?: any
}

export default class VerticalProgram implements m.ClassComponent<VerticalProgramAttrs> {
    sessions: any[]

    oninit(vnode: m.Vnode<VerticalProgramAttrs, this>) {
        this.sessions = vnode.attrs.matches || [];

        window.Echo.channel('live')
            .listen('MatchesUpdated', event => {
                this.sessions = event.matches;
                m.redraw();
            });
    }

    view() {

        return m('.container-fluid.vertical-presentation', [
            m(Clock),
            m('.vertical-promo', [
                'Live stream et programme sur ',
                m('i.fa-solid.fa-arrow-right'),
                m('span.vertical-promo-url', ' live.robots-ju.ch '),
                m('i.fa-solid.fa-arrow-left'),
                ' Live stream und Zeitplan auf',
            ]),
            m('.row', [
                m('.col-3.vertical-general-block', [
                    m('.vertical-header', 'General'),
                    m(Schedule, {
                        sessions: this.sessions,
                        presentation: true,
                    }),
                ]),
                m('.col-9', m('.row', teams.slice(0, 12).map(team => {
                    return this.teamBlock(team);
                }))),
            ]),
            m('.row', teams.slice(12).map(team => {
                return this.teamBlock(team, 3);
            })),
        ]);
    }

    teamBlock(team: Team, size: number = 4) {
        return m('.col-' + size + '.vertical-team-block', [
            m('.vertical-header', [
                m(TeamLogo, {
                    team,
                }),
                ' ' + team.name + ' ',
                m('span.vertical-team-number', '(' + team.number + ')'),
            ]),
            m(Schedule, {
                sessions: this.sessions,
                presentation: true,
                team: team.number,
                lang: team.lang,
                hideGeneralTasksForTeam: true,
                hideAllFinished: true,
            }),
        ]);
    }
}
