import * as m from 'mithril';

const LINKS: {
    name: string
    icon: string
    url: string
}[] = [
    {
        name: 'Facebook',
        icon: 'fab fa-facebook',
        url: 'https://www.facebook.com/RobotsJU/'
    },
    {
        name: 'Instagram',
        icon: 'fab fa-instagram',
        url: 'https://www.instagram.com/robotsju/'
    },
    {
        name: 'YouTube',
        icon: 'fab fa-youtube',
        url: 'https://www.youtube.com/user/robotsju'
    },
];

const WEBSITES: {
    name: string
    url: string
}[] = [
    {
        name: 'Coupe.Robots-JU.ch',
        url: 'https://coupe.robots-ju.ch/',
    },
    {
        name: 'Robots-JU.ch',
        url: 'https://robots-ju.ch/',
    },
];

export default class SocialLinks implements m.ClassComponent {
    view() {
        return [
            m('p.mt-5.text-center', 'Suivez la Coupe Robots-JU sur les réseaux sociaux !'),
            m('.row', LINKS.map(link => m('.col', m('a.btn.btn-primary.d-block', {
                href: link.url,
                target: '_blank',
                rel: 'noopener',
            }, [
                m('span', {className: link.icon,}),
                ' ' + link.name
            ])))),
            m('.row.mt-3', WEBSITES.map(website => m('.col', m('a.btn.btn-outline-dark.d-block', {
                href: website.url,
                target: '_blank',
                rel: 'noopener',
            }, website.name)))),
        ];
    }
}
