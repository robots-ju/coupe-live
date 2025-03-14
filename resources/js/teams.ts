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
        key: 'equipain',
        name: 'L’équi-pain jurassien',
        logo: 'ep.png',
    },
    {
        key: 'yellowsub',
        name: 'Yellow_Submarine.JU',
        logo: 'yellowsub.jpg',
    },
    {
        key: 'patataquatique',
        name: 'www.patataquatique.ju',
        logo: 'pa.png',
    },
    {
        key: 'jurabysses',
        name: 'Jurabysses',
        logo: 'ja.png',
    },
    {
        key: 'aquajura',
        name: 'AquaJura',
        logo: 'aj.png',
    },
    {
        key: 'poseidon',
        name: 'Poséidon.ju',
        logo: 'pj.png',
    },
    {
        key: 'brik',
        name: 'Brik’ception',
        logo: 'brik.png',
    },
    {
        key: 'robohunter',
        name: 'RoboHunter',
        logo: 'robohunter.jpg',
    },
    {
        key: 'letsgo',
        name: 'LET’S GO',
        logo: 'letsgo.jpg',
    },
    {
        key: 'roch',
        name: 'Saint Roch’n’Roll',
        logo: 'roch.jpg',
    },
];

export default teams;
