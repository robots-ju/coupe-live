import * as m from 'mithril';
import YouTubeStream from './YouTubeStream';
import Matches from './Matches';
import PresentationInfo from './PresentationInfo';
import SocialLinks from './SocialLinks';
import {Match} from '../teams';

interface AppAttrs {
    youtubeVideoId?: string | null
    matches?: Match[]
    presentation: boolean
}

export default class App implements m.ClassComponent<AppAttrs> {
    youtubeVideoId: string
    matches: any[]
    year: number

    oninit(vnode: m.Vnode<AppAttrs, this>) {
        this.youtubeVideoId = vnode.attrs.youtubeVideoId || '';
        this.matches = vnode.attrs.matches || [];
        this.year = (new Date()).getFullYear();

        window.Echo.channel('live')
            .listen('StreamUpdated', event => {
                this.youtubeVideoId = event.youtubeVideoId;
                m.redraw();
            })
            .listen('MatchesUpdated', event => {
                this.matches = event.matches;
                m.redraw();
            });
    }

    view(vnode: m.Vnode<AppAttrs, this>) {
        const {presentation} = vnode.attrs;

        return m('.container-fluid', {
            className: presentation ? 'presentation-mode' : '',
        }, [
            m('.row.mt-3', [
                m('.col-lg-' + (presentation ? 4 : '6.mb-5'), [
                    m(YouTubeStream, {
                        youtubeVideoId: this.youtubeVideoId,
                        presentation,
                    }),
                    presentation ? m(PresentationInfo) : m(SocialLinks),
                ]),
                m('.col-lg-' + (presentation ? 8 : '6.mb-5') + '.panel-matches', m(Matches, {
                    matches: this.matches,
                    presentation,
                })),
            ]),
            presentation ? null : m('footer.text-center.text-muted.pb-1', [
                '© ',
                m('a', {
                    href: 'https://robots-ju.ch/',
                    target: '_blank',
                    rel: 'noopener',
                }, 'Robots-JU'),
                ' 2019-' + this.year + ' - Application réalisée par ',
                m('a', {
                    href: 'https://clarkwinkelmann.com/',
                    target: '_blank',
                    rel: 'noopener',
                }, 'Clark Winkelmann'),
            ]),
        ]);
    }
}
