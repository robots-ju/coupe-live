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
    number: number
    name: string
    city: string
    canton: string
    lang: string
}

const teams: Team[] = [{
    number: 1062,
    name: 'E-Arts',
    city: 'Arnex sur Orbe',
    canton: 'VD',
    lang: 'fr',
}, {
    number: 1066,
    name: 'BUSSIREX',
    city: 'Bussigny',
    canton: 'VD',
    lang: 'fr',
}, {
    number: 1067,
    name: 'Spéléobots',
    city: 'Bussigny',
    canton: 'VD',
    lang: 'fr',
}, {
    number: 1068,
    name: 'Les poulets rôtis',
    city: 'Bussigny',
    canton: 'VD',
    lang: 'fr',
}, {
    number: 1084,
    name: 'Capricorns',
    city: 'Chur',
    canton: 'GR',
    lang: 'de',
}, {
    number: 1126,
    name: 'Legomeister',
    city: 'Auenstein',
    canton: 'AG',
    lang: 'de',
}, {
    number: 1136,
    name: 'InkaBot',
    city: 'Morges',
    canton: 'VD',
    lang: 'fr',
}, {
    number: 1137,
    name: 'Raptors.JU',
    city: 'Glovelier',
    canton: 'JU',
    lang: 'fr',
}, {
    number: 1145,
    name: 'Progy-Technos',
    city: 'Thun',
    canton: 'BE',
    lang: 'de',
}, {
    number: 1310,
    name: 'Electronic Machines Schiers 2.0',
    city: 'Schiers',
    canton: 'GR',
    lang: 'de',
}, {
    number: 1328,
    name: 'Saint-Roch\'n\'Roll',
    city: 'Lausanne',
    canton: 'VD',
    lang: 'fr',
}, {
    number: 1335,
    name: 'mindfactory',
    city: 'Baden',
    canton: 'AG',
    lang: 'de',
}, {
    number: 1370,
    name: 'RoboHunter',
    city: 'Roggwil',
    canton: 'BE',
    lang: 'de',
}, {
    number: 1503,
    name: 'Blockhedz',
    city: 'Oberentfelden',
    canton: 'AG',
    lang: 'de',
}, {
    number: 1532,
    name: 'Capricorns Juniors',
    city: 'Chur',
    canton: 'GR',
    lang: 'de',
}, {
    number: 1608,
    name: 'BIG-BOT',
    city: 'Fribourg',
    canton: 'FR',
    lang: 'fr',
}];

export default teams;
