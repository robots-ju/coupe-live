import Echo from 'laravel-echo';

declare global {
    interface Window {
        Popper: any
        Pusher: any
        Echo: Echo
    }
}

export {}
