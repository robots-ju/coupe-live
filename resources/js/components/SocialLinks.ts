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

const HOT_LINKS: {
    name: string
    icon: string
    url: string
}[] = [
    {
        name: 'Facebook',
        icon: 'fab fa-facebook',
        url: 'https://www.facebook.com/HANDSonTECHNOLOGY/'
    },
    {
        name: 'Instagram',
        icon: 'fab fa-instagram',
        url: 'https://www.instagram.com/handsontechnology_fll_dach/'
    },
    {
        name: 'YouTube',
        icon: 'fab fa-youtube',
        url: 'https://www.youtube.com/@HANDSonTECHNOLOGY'
    },
];

export default class SocialLinks implements m.ClassComponent {
    view() {
        return [
            m('p.mt-3.text-center', 'Suivez la FIRST LEGO League sur les réseaux sociaux !'),
            m('.row.text-center', [
                m('.col', [
                    'Robots-JU:',
                    LINKS.map(link => m('a.btn.btn-primary.d-block.mt-2', {
                        href: link.url,
                        target: '_blank',
                        rel: 'noopener',
                    }, [
                        m('span', {className: link.icon,}),
                        ' ' + link.name
                    ])),
                    m('a.btn.btn-outline-dark.d-block.mt-2', {
                        href: 'https://robots-ju.ch/',
                        target: '_blank',
                        rel: 'noopener',
                    }, 'Robots-JU.ch'),
                ]),
                m('.col', [
                    'HANDS on TECHNOLOGY:',
                    HOT_LINKS.map(link => m('a.btn.btn-primary.d-block.mt-2', {
                        href: link.url,
                        target: '_blank',
                        rel: 'noopener',
                    }, [
                        m('span', {className: link.icon,}),
                        ' ' + link.name
                    ])),
                    m('a.btn.btn-outline-dark.d-block.mt-2', {
                        href: 'https://www.first-lego-league.org/',
                        target: '_blank',
                        rel: 'noopener',
                    }, 'FIRST-LEGO-League.ch'),
                ]),
            ]),
        ];
    }
}
