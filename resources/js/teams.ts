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
    number: 1264,
    name: 'MONTANA ROBO TITANS',
    city: 'Zugerberg',
    canton: 'ZG',
    lang: 'de',
}, {
    number: 1305,
    name: 'RoboHunter',
    city: 'Roggwil',
    canton: 'BE',
    lang: 'de',
}, {
    number: 1316,
    name: 'DarkTroglobies.JU',
    city: 'Glovelier',
    canton: 'JU',
    lang: 'fr',
}, {
    number: 1317,
    name: 'Les Patatamazoniennes.JU',
    city: 'Glovelier',
    canton: 'JU',
    lang: 'fr',
}, {
    number: 1318,
    name: 'Team Jura C3',
    city: 'Glovelier',
    canton: 'JU',
    lang: 'fr',
}, {
    number: 1319,
    name: 'Team Jura C4',
    city: 'Glovelier',
    canton: 'JU',
    lang: 'fr',
}, {
    number: 1320,
    name: 'Team Jura C5',
    city: 'Glovelier',
    canton: 'JU',
    lang: 'fr',
}, {
    number: 1484,
    name: 'Robo-Land',
    city: 'Schöftland',
    canton: 'AG',
    lang: 'de',
}, {
    number: 1515,
    name: 'Stockmar 1',
    city: 'Porrentruy',
    canton: 'JU',
    lang: 'fr',
}, {
    number: 1516,
    name: 'SODA',
    city: 'Porrentruy',
    canton: 'JU',
    lang: 'fr',
}, {
    number: 1521,
    name: 'Neurovolt',
    city: 'Vaduz',
    canton: 'Vaduz',
    lang: 'de',
}, {
    number: 1591,
    name: 'JFK',
    city: 'Saanen',
    canton: 'BE',
    lang: 'de',
}];

export default teams;
