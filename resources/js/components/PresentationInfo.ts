import * as m from 'mithril';

export default class PresentationInfo implements m.ClassComponent {
    view() {
        return m('.presentation-info', [
            m('p', 'Retrouvez le live stream et vos scores sur'),
            m('p', 'live.robots-ju.ch'),
        ]);
    }
}
