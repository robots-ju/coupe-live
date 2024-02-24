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
        key: 'phoenix',
        name: 'Phoenix',
        logo: 'phoenix.jpg',
    },
    {
        key: 'parechocs',
        name: 'Master Pare_chocs.JU',
        logo: 'mpc.png',
    },
    {
        key: 'roch1',
        name: 'Saint-Roch I',
        logo: 'roch.jpg',
    },
    {
        key: 'patatartiner',
        name: 'Patatartiner jurassiennes',
        logo: 'pj.png',
    },
    {
        key: 'cfrsbrik',
        name: 'CFR’s Brik',
        logo: 'cfrsblok.jpg',
    },
    {
        key: 'jurartiste',
        name: 'Jurartiste',
        logo: 'ja.png',
    },
    {
        key: 'backtotheblock',
        name: 'Back to the Block',
        logo: 'backtotheblock.png',
    },
];

export default teams;
