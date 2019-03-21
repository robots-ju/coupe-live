import m from 'mithril';

const LINKS = [
    {
        name: 'Twitter',
        icon: 'fab fa-twitter',
        url: 'https://twitter.com/CoupeRobotsJU'
    },
    {
        name: 'Facebook',
        icon: 'fab fa-facebook',
        url: 'https://www.facebook.com/CoupeRobotsJU/'
    },
    {
        name: 'YouTube',
        icon: 'fab fa-youtube',
        url: 'https://www.youtube.com/user/robotsju'
    },
    {
        name: 'Flickr',
        icon: 'fab fa-flickr',
        url: 'https://www.flickr.com/photos/robots-ju/'
    },
];

const WEBSITES = [
    {
        name: 'Coupe.Robots-JU.ch',
        url: 'https://coupe.robots-ju.ch/',
    },
    {
        name: 'Robots-JU.ch',
        url: 'https://robots-ju.ch/',
    },
];

export default {
    view() {
        return [
            m('p.mt-5.text-center', 'Suivez la Coupe Robots-JU sur les réseaux sociaux !'),
            m('.row', LINKS.map(link => m('.col', m('a.btn.btn-block.btn-primary', {
                href: link.url,
                target: '_blank',
                rel: 'noopener',
            }, [
                m('span', {className: link.icon,}),
                ' ' + link.name
            ])))),
            m('.row.mt-3', WEBSITES.map(website => m('.col', m('a.btn.btn-block.btn-outline-dark', {
                href: website.url,
                target: '_blank',
                rel: 'noopener',
            }, website.name)))),
        ];
    },
}
