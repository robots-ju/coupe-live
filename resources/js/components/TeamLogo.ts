import * as m from 'mithril';
import {Team} from '../teams';

interface TeamLogoAttrs {
    team: Team
}

export default class TeamLogo implements m.ClassComponent<TeamLogoAttrs> {
    view(vnode: m.VnodeDOM<TeamLogoAttrs, this>) {
        const {team} = vnode.attrs;

        return m('img.team-logo', {
            src: '/logos/' + team.logo,
            alt: 'Logo ' + team.name,
        });
    }
}
