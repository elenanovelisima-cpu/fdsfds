export interface DetailedBasketballCard {
  id: string;
  name: string;
  position: string;
  team: string;
  teamShort: string;
  number: string;
  image: string;
  season: string;
  cardStats: {
    ppg: string;
    rpg: string;
    apg: string;
    fgPct: string;
    threePct: string;
    ftPct: string;
  };
  seasonAverages: {
    gp: number | string;
    min: number | string;
    pts: number | string;
    reb: number | string;
    ast: number | string;
    stl: number | string;
    blk: number | string;
  };
  shooting: {
    fg: string;
    threeP: string;
    ft: string;
  };
  advanced: {
    per: string;
    tsPct: string;
    usgPct: string;
    bpm: string;
  };
}

export const NBA_STAR_CARDS: DetailedBasketballCard[] = [
  {
    id: 'luka-doncic',
    name: 'Luka Dončić',
    position: 'PG',
    team: 'Dallas Mavericks',
    teamShort: 'DAL',
    number: '#77',
    image: '/assets/images/hoopspulse_lucas_profile_full_1790614849568.jpg',
    season: '2023-24',
    cardStats: {
      ppg: '33.9',
      rpg: '9.2',
      apg: '9.8',
      fgPct: '48.7%',
      threePct: '38.2%',
      ftPct: '78.6%'
    },
    seasonAverages: {
      gp: 70,
      min: '37.5',
      pts: '33.9',
      reb: '9.2',
      ast: '9.8',
      stl: '1.4',
      blk: '0.5'
    },
    shooting: {
      fg: '48.7%',
      threeP: '38.2%',
      ft: '78.6%'
    },
    advanced: {
      per: '28.1',
      tsPct: '61.7%',
      usgPct: '36.0%',
      bpm: '+9.9'
    }
  },
  {
    id: 'nikola-jokic',
    name: 'Nikola Jokić',
    position: 'C',
    team: 'Denver Nuggets',
    teamShort: 'DEN',
    number: '#15',
    image: '/jugador_1.png',
    season: '2023-24',
    cardStats: {
      ppg: '26.4',
      rpg: '12.4',
      apg: '9.0',
      fgPct: '58.3%',
      threePct: '35.9%',
      ftPct: '81.7%'
    },
    seasonAverages: {
      gp: 79,
      min: '34.6',
      pts: '26.4',
      reb: '12.4',
      ast: '9.0',
      stl: '1.4',
      blk: '0.9'
    },
    shooting: {
      fg: '58.3%',
      threeP: '35.9%',
      ft: '81.7%'
    },
    advanced: {
      per: '31.0',
      tsPct: '65.0%',
      usgPct: '29.2%',
      bpm: '+13.2'
    }
  },
  {
    id: 'giannis-antetokounmpo',
    name: 'Giannis Antetokounmpo',
    position: 'PF',
    team: 'Milwaukee Bucks',
    teamShort: 'MIL',
    number: '#34',
    image: '/jugador_2.png',
    season: '2023-24',
    cardStats: {
      ppg: '30.4',
      rpg: '11.5',
      apg: '6.5',
      fgPct: '61.1%',
      threePct: '27.4%',
      ftPct: '65.7%'
    },
    seasonAverages: {
      gp: 73,
      min: '35.2',
      pts: '30.4',
      reb: '11.5',
      ast: '6.5',
      stl: '1.2',
      blk: '1.1'
    },
    shooting: {
      fg: '61.1%',
      threeP: '27.4%',
      ft: '65.7%'
    },
    advanced: {
      per: '29.9',
      tsPct: '64.9%',
      usgPct: '33.2%',
      bpm: '+9.0'
    }
  },
  {
    id: 'shai-gilgeous-alexander',
    name: 'Shai Gilgeous-Alexander',
    position: 'PG',
    team: 'Oklahoma City Thunder',
    teamShort: 'OKC',
    number: '#2',
    image: '/jugador_3.png',
    season: '2023-24',
    cardStats: {
      ppg: '30.1',
      rpg: '5.5',
      apg: '6.2',
      fgPct: '53.5%',
      threePct: '35.3%',
      ftPct: '87.4%'
    },
    seasonAverages: {
      gp: 75,
      min: '34.0',
      pts: '30.1',
      reb: '5.5',
      ast: '6.2',
      stl: '2.0',
      blk: '0.9'
    },
    shooting: {
      fg: '53.5%',
      threeP: '35.3%',
      ft: '87.4%'
    },
    advanced: {
      per: '29.3',
      tsPct: '63.6%',
      usgPct: '32.4%',
      bpm: '+9.8'
    }
  },
  {
    id: 'jayson-tatum',
    name: 'Jayson Tatum',
    position: 'SF',
    team: 'Boston Celtics',
    teamShort: 'BOS',
    number: '#0',
    image: '/jugador_4.png',
    season: '2023-24',
    cardStats: {
      ppg: '26.9',
      rpg: '8.1',
      apg: '4.9',
      fgPct: '47.1%',
      threePct: '37.6%',
      ftPct: '83.3%'
    },
    seasonAverages: {
      gp: 74,
      min: '35.7',
      pts: '26.9',
      reb: '8.1',
      ast: '4.9',
      stl: '1.0',
      blk: '0.6'
    },
    shooting: {
      fg: '47.1%',
      threeP: '37.6%',
      ft: '83.3%'
    },
    advanced: {
      per: '22.3',
      tsPct: '60.7%',
      usgPct: '29.8%',
      bpm: '+5.7'
    }
  }
];
