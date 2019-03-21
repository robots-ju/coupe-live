import m from 'mithril';

export default {
    view(vnode) {
        const {team} = vnode.attrs;

        return m('img.team-logo', {
            src: '/logos/' + team.logo,
            alt: 'Logo ' + team.name,
        });
    },
}
