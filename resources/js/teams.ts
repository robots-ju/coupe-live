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
        key: 'jura1',
        name: 'Jur\'arc électrique',
        logo: 'ae.png',
    },
    {
        key: 'jura2',
        name: 'Ultra_powered.ju',
        logo: 'ultrapoweredju.jpg',
    },
    {
        key: 'jura3',
        name: 'Les Patates jurassiennes',
        logo: 'pj.png',
    },
    {
        key: 'robohunter',
        name: 'Robo-Hunter',
        logo: 'robohunter.jpg',
    },
    {
        key: 'juniorsmilebots',
        name: 'Junior Smilebots',
        logo: 'js.png',
    },
    {
        key: 'cfrsblok',
        name: 'CFR\'s Blok',
        logo: 'cfrsblok.jpg',
    },
    {
        key: 'phoenix',
        name: 'Phoenix',
        logo: 'phoenix.jpg',
    },
    {
        key: 'capricorns',
        name: 'Capricorns',
        logo: 'capricorns.png',
    },
    {
        key: 'backtotheblock',
        name: 'Back to the Block',
        logo: 'backtotheblock.png',
    },
];

export default teams;
