import * as m from 'mithril';

export default class Clock implements m.ClassComponent {
    clock: string = '00:00'
    running: boolean = true

    oncreate() {
        this.animate();
    }

    animate() {
        if (!this.running) {
            return;
        }

        const now = new Date();
        const clock = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);

        if (clock !== this.clock) {
            this.clock = clock;
            m.redraw();
        }

        requestAnimationFrame(this.animate.bind(this));
    }

    onremove() {
        this.running = false;
    }

    view() {
        const timeParts = this.clock.split(':');

        return m('.clock', [
            m('span.clock-icon.far.fa-clock'),
            m('span.clock-hour', timeParts[0]),
            ':',
            m('span.clock-minute', timeParts[1]),
        ]);
    }
}
