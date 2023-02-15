import m from 'mithril';

export default {
    view(vnode) {
        const {youtubeVideoId} = vnode.attrs;

        return [
            m('h2', 'Live Stream'),
            m('.ratio.ratio-16x9', youtubeVideoId ? [
                m('iframe.embed-responsive-item', {
                    key: youtubeVideoId, // Make sure the entire iframe is re-created if the video url changes
                    src: 'https://www.youtube-nocookie.com/embed/' + youtubeVideoId + '?rel=0',
                    allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
                    allowfullscreen: true,
                }),
            ] : [
                m('.stream-offline.progress-bar-striped', 'Live stream dès 12h30'),
            ]),
        ];
    },
}
