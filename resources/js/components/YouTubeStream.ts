import * as m from 'mithril';

interface YouTubeStreamAttrs {
    youtubeVideoId: string
    presentation: boolean
}

export default class YouTubeStream implements m.ClassComponent<YouTubeStreamAttrs> {
    view(vnode: m.Vnode<YouTubeStreamAttrs, this>) {
        const {youtubeVideoId, presentation} = vnode.attrs;

        return [
            presentation ? null : m('h2', 'Live Stream'),
            m('.ratio.ratio-16x9', youtubeVideoId ? [
                m('iframe.embed-responsive-item', {
                    key: youtubeVideoId, // Make sure the entire iframe is re-created if the video url changes
                    src: 'https://www.youtube-nocookie.com/embed/' + youtubeVideoId + '?rel=0',
                    allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
                    allowfullscreen: true,
                }),
            ] : [
                m('.stream-offline.progress-bar-striped', 'Suivez la journée du 2 mars en direct sur cette page'),
            ]),
        ];
    }
}
