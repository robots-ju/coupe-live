require('./bootstrap');

import * as m from 'mithril';
import App from './components/App';
import VerticalProgram from './components/VerticalProgram';
import RobotGameOverlay from './components/RobotGameOverlay';

const root = document.getElementById('app');

if (m.parseQueryString(window.location.search).presentation === 'vertical') {
    m.mount(root, {
        view() {
            return m(VerticalProgram, {
                matches: JSON.parse(root.dataset.matches),
            });
        },
    });
} else if (m.parseQueryString(window.location.search).overlay) {
    m.mount(root, {
        view() {
            return m(RobotGameOverlay, {
                matches: JSON.parse(root.dataset.matches),
            });
        },
    });
} else {
    m.mount(root, {
        view() {
            return m(App, {
                youtubeVideoId: JSON.parse(root.dataset.stream),
                matches: JSON.parse(root.dataset.matches),
                presentation: !!m.parseQueryString(window.location.search).presentation,
                programOnly: !!m.parseQueryString(window.location.search).pgm,
                programOnlyRobotGame: m.parseQueryString(window.location.search).pgm === 'rg',
                moderatorToken: m.parseQueryString(window.location.search).moderator as string,
            });
        },
    });
}
