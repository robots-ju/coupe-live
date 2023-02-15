require('./bootstrap');

import * as m from 'mithril';
import App from './components/App';

const root = document.getElementById('app');

m.mount(root, {
    view() {
        return m(App, {
            youtubeVideoId: JSON.parse(root.dataset.stream),
            matches: JSON.parse(root.dataset.matches),
        });
    },
});
