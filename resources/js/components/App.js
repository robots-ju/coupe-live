import m from 'mithril';
import YouTubeStream from "./YouTubeStream";
import Matches from "./Matches";
import SocialLinks from "./SocialLinks";

export default {
    oninit(vnode) {
        vnode.state.youtubeVideoId = vnode.attrs.youtubeVideoId || '';
        vnode.state.matches = vnode.attrs.matches || [];

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
        return m('.container-fluid', m('.row.mt-3', [
            m('.col-md-6', [
                m(YouTubeStream, {
                    youtubeVideoId: vnode.state.youtubeVideoId,
                }),
                m(SocialLinks),
            ]),
            m('.col-md-6', m(Matches, {
                matches: vnode.state.matches,
            })),
        ]));
    },
}
