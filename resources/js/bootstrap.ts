import * as Popper from '@popperjs/core';

window.Popper = Popper;

require('bootstrap/js/dist/dropdown');

import Echo from 'laravel-echo';
import * as Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.MIX_PUSHER_APP_KEY,
    cluster: process.env.MIX_PUSHER_APP_CLUSTER,
    forceTLS: true
});
