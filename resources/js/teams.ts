interface Table {
    table: 'A' | 'B' | 'C' | 'D'
    team?: string | null
    score?: number | null
    scoreboard?: string | null
}

export interface Match {
    number: number
    time: string
    tables: [Table, Table]
    current?: boolean
    game?: 'robotgame' | 'semifinals' | 'finals'
}

export interface Team {
    key: string
    name: string
    logo: string
}

const teams: Team[] = [
    {
        key: 'raptors',
        name: 'Raptors.JU',
        logo: 'robotsju.png',
    },
    {
        key: 'earts',
        name: 'E-Arts',
        logo: 'earts.jpg',
    },
    {
        key: 'patates',
        name: 'Les patatarchéologues',
        logo: 'robotsju.png',
    },
    {
        key: 'robohunter',
        name: 'RoboHunter',
        logo: 'robohunter.jpg',
    },
    {
        key: 'jurartefact',
        name: 'Jurartéfact',
        logo: 'robotsju.png',
    },
    {
        key: 'capricorns',
        name: 'Capricorns',
        logo: 'capricorns.png',
    },
    {
        key: 'jurarcheo',
        name: 'Jura’rchéo',
        logo: 'robotsju.png',
    },
    {
        key: 'capricornsjr',
        name: 'Capricorns Juniors',
        logo: 'capricorns.png',
    },
    {
        key: 'pioche',
        name: 'Les dinosaures robots têtes de pioche du Jura',
        logo: 'robotsju.png',
    },
    {
        key: 'lbj',
        name: 'Projet LBJ',
        logo: 'bussibot.jpg',
    },
];

export default teams;
