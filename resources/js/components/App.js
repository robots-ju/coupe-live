import m from 'mithril';
import YouTubeStream from "./YouTubeStream";
import Matches from "./Matches";
import SocialLinks from "./SocialLinks";

export default {
    oninit(vnode) {
        vnode.state.youtubeVideoId = vnode.attrs.youtubeVideoId || '';
        vnode.state.matches = vnode.attrs.matches || [];
        vnode.state.year = (new Date()).getFullYear();

        window.Echo.channel('live')
            .listen('StreamUpdated', event => {
                vnode.state.youtubeVideoId = event.youtubeVideoId;
                m.redraw();
            })
            .listen('MatchesUpdated', event => {
                vnode.state.matches = event.matches;
                m.redraw();
            });
    },
    view(vnode) {
        return m('.container-fluid', [
            m('.row.mt-3', [
                m('.col-lg-6.mb-5', [
                    m(YouTubeStream, {
                        youtubeVideoId: vnode.state.youtubeVideoId,
                    }),
                    m(SocialLinks),
                ]),
                m('.col-lg-6.mb-5.panel-matches', m(Matches, {
                    matches: vnode.state.matches,
                })),
            ]),
            m('footer.text-center.text-muted.pb-1', [
                '© ',
                m('a', {
                    href: 'https://robots-ju.ch/',
                    target: '_blank',
                    rel: 'noopener',
                }, 'Robots-JU'),
                ' 2019-' + vnode.state.year + ' - Application réalisée par ',
                m('a', {
                    href: 'https://clarkwinkelmann.com/',
                    target: '_blank',
                    rel: 'noopener',
                }, 'Clark Winkelmann'),
            ]),
        ]);
    },
}
