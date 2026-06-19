// ============================================================
// DATA
// ============================================================

const TEAMS = [
  { id:'ColbyF',    name:'Colby F',    teamName:'Moore Brown kids plz',   pick:1,  div:'Daddy', keeper:{prob:'Tucker Kraft', rd:16, alt:[{p:'Michael Pittman Jr.',rd:8}]} },
  { id:'Jake',      name:'Jake',       teamName:'Team Jacob M',           pick:2,  div:'Daddy', keeper:{prob:'Tetairoa McMillan', rd:6, alt:[{p:'Quinshon Judkins',rd:9}]} },
  { id:'Emmitt',    name:'Emmitt',     teamName:'For Skatt✊',             pick:3,  div:'Mommy', keeper:{prob:"DeVonta Smith", rd:5, alt:[{p:'Cam Skattebo',rd:9}]} },
  { id:'ColbyD',    name:'Colby D',    teamName:'backups',                pick:4,  div:'Mommy', keeper:{prob:'Emeka Egbuka', rd:8, alt:[{p:'Luther Burden III',rd:12},{p:'TreVeyon Henderson',rd:3}]} },
  { id:'Rourke',    name:'Rourke',     teamName:'Jicl Fraudle',           pick:5,  div:'Daddy', keeper:{prob:'George Pickens', rd:5, alt:[{p:'Rashee Rice',rd:5}]} },
  { id:'Christian', name:'Christian',  teamName:'Team IR pt2',            pick:6,  div:'Daddy', keeper:{prob:'Romeo Doubs', rd:16, alt:[]} },
  { id:'Asher',     name:'Asher',      teamName:'Morning Chubb',          pick:7,  div:'Mommy', keeper:{prob:'Travis Etienne Jr.', rd:8, alt:[]} },
  { id:'NickR',     name:'Nick R',     teamName:'Mr Nice Guy middies35',  pick:8,  div:'Mommy', keeper:{prob:'Jonathan Taylor', rd:2, alt:[]} },
  { id:'JOE',       name:'JOE',        teamName:'TEAM JOE',               pick:9,  div:'Daddy', keeper:{prob:'Jaxon Dart', rd:16, alt:[{p:"De'Von Achane",rd:2},{p:'Tyler Warren',rd:10}]} },
  { id:'NickG',     name:'Nick G',     teamName:'Team Nickg',             pick:10, div:'Mommy', keeper:{prob:'Javonte Williams', rd:8, alt:[{p:'Drake Maye',rd:11}]} },
  { id:'Reid',      name:'Reid',       teamName:'Rico Story',             pick:11, div:'Mommy', keeper:{prob:'Rico Dowdle', rd:16, alt:[]} },
  { id:'Nate',      name:'Nate',       teamName:'Muggy',                  pick:12, div:'Daddy', keeper:{prob:'RJ Harvey', rd:5, alt:[{p:'Josh Allen',rd:3},{p:'Puka Nacua',rd:1}]} },
];

const MY_TEAM = 'JOE';
const ROUNDS = 16;
const NUM_TEAMS = 12;

// Snake draft order: given pick index (0-based) returns team index (0-based)
function getTeamForPick(pickNum) { // 1-based pick
  const idx = pickNum - 1;
  const round = Math.floor(idx / NUM_TEAMS);
  const posInRound = idx % NUM_TEAMS;
  if (round % 2 === 0) return posInRound; // left to right
  else return NUM_TEAMS - 1 - posInRound; // right to left
}

function getPickLabel(pickNum) {
  const round = Math.floor((pickNum-1)/NUM_TEAMS) + 1;
  const pos = ((pickNum-1) % NUM_TEAMS) + 1;
  return `${round}.${String(pos).padStart(2,'0')}`;
}

// ============================================================
// COMPREHENSIVE PLAYER POOL  {n, pos, val}
// val = base ADP value (100 = 1st overall). Random noise applied
// each run so results differ every simulation like ESPN mock drafts.
// ============================================================
const PLAYER_POOL = [
  // ── ELITE RBs ──
  {n:'Jahmyr Gibbs',pos:'RB',val:100},{n:"Ja'Marr Chase",pos:'WR',val:99},
  {n:'Bijan Robinson',pos:'RB',val:98},{n:'CeeDee Lamb',pos:'WR',val:97},
  {n:'Christian McCaffrey',pos:'RB',val:97},{n:'Justin Jefferson',pos:'WR',val:96},
  {n:'Saquon Barkley',pos:'RB',val:96},{n:'Puka Nacua',pos:'WR',val:93},
  {n:'Jaxon Smith-Njigba',pos:'WR',val:92},{n:'Amon-Ra St. Brown',pos:'WR',val:91},
  {n:'Ashton Jeanty',pos:'RB',val:91},{n:'James Cook',pos:'RB',val:90},
  // ── ROUND 2 RBs/WRs ──
  {n:'Derrick Henry',pos:'RB',val:88},{n:'Jonathan Taylor',pos:'RB',val:87},
  {n:"De'Von Achane",pos:'RB',val:87},{n:'Omarion Hampton',pos:'RB',val:86},
  {n:'Breece Hall',pos:'RB',val:86},{n:'Jeremiyah Love',pos:'RB',val:85},
  {n:'Kenneth Walker III',pos:'RB',val:84},{n:"A.J. Brown",pos:'WR',val:84},
  {n:'Chase Brown',pos:'RB',val:83},{n:'Rashee Rice',pos:'WR',val:82},
  {n:'Drake London',pos:'WR',val:82},{n:'Nico Collins',pos:'WR',val:81},
  // ── ROUND 3 ──
  {n:'Trey McBride',pos:'TE',val:80},{n:'Brock Bowers',pos:'TE',val:79},
  {n:'Malik Nabers',pos:'WR',val:79},{n:'Josh Jacobs',pos:'RB',val:78},
  {n:'Kyren Williams',pos:'RB',val:78},{n:'Tee Higgins',pos:'WR',val:77},
  {n:'Garrett Wilson',pos:'WR',val:77},{n:'Ladd McConkey',pos:'WR',val:76},
  {n:'Luther Burden III',pos:'WR',val:75},{n:'Zay Flowers',pos:'WR',val:75},
  {n:'Cam Skattebo',pos:'RB',val:74},{n:'Chris Olave',pos:'WR',val:74},
  // ── ROUND 4 — elite QBs go here ──
  {n:'Lamar Jackson',pos:'QB',val:88},{n:'Josh Allen',pos:'QB',val:87},
  {n:'Davante Adams',pos:'WR',val:73},{n:'Terry McLaurin',pos:'WR',val:73},
  {n:'Jameson Williams',pos:'WR',val:72},{n:'Jaylen Waddle',pos:'WR',val:72},
  {n:"D'Andre Swift",pos:'RB',val:71},{n:'Colston Loveland',pos:'TE',val:71},
  {n:'David Montgomery',pos:'RB',val:70},{n:'TreVeyon Henderson',pos:'RB',val:70},
  {n:'Bucky Irving',pos:'RB',val:69},{n:'Quinshon Judkins',pos:'RB',val:69},
  // ── ROUND 5 ──
  {n:'Joe Burrow',pos:'QB',val:84},{n:'Jalen Hurts',pos:'QB',val:83},
  {n:'Patrick Mahomes',pos:'QB',val:82},{n:'Jayden Daniels',pos:'QB',val:80},
  {n:'DJ Moore',pos:'WR',val:68},{n:"DeVonta Smith",pos:'WR',val:68},
  {n:'George Pickens',pos:'WR',val:67},{n:'Christian Watson',pos:'WR',val:66},
  {n:'Mike Evans',pos:'WR',val:66},{n:'Rome Odunze',pos:'WR',val:65},
  {n:'Brian Thomas Jr.',pos:'WR',val:65},{n:'RJ Harvey',pos:'RB',val:64},
  // ── ROUND 6 ──
  {n:'Justin Herbert',pos:'QB',val:78},{n:'Drake Maye',pos:'QB',val:77},
  {n:'CJ Stroud',pos:'QB',val:76},{n:'Marvin Harrison Jr.',pos:'WR',val:64},
  {n:'Bhayshul Tuten',pos:'RB',val:63},{n:'Carnell Tate',pos:'WR',val:63},
  {n:'Jordan Addison',pos:'WR',val:62},{n:'DK Metcalf',pos:'WR',val:62},
  {n:'Tetairoa McMillan',pos:'WR',val:61},{n:'Emeka Egbuka',pos:'WR',val:60},
  {n:'Romeo Doubs',pos:'WR',val:60},{n:'Jordyn Tyson',pos:'WR',val:59},
  // ── ROUND 7 ──
  {n:'Travis Kelce',pos:'TE',val:72},{n:'Mark Andrews',pos:'TE',val:70},
  {n:'Sam LaPorta',pos:'TE',val:68},{n:'Harold Fannin Jr.',pos:'TE',val:65},
  {n:'Jaxon Dart',pos:'QB',val:74},{n:'Cam Ward',pos:'QB',val:72},
  {n:'Kyle Pitts',pos:'TE',val:62},{n:'Courtland Sutton',pos:'WR',val:58},
  {n:'Tony Pollard',pos:'RB',val:58},{n:'Jordan Mason',pos:'RB',val:57},
  {n:'Jadarian Price',pos:'RB',val:57},{n:'Rhamondre Stevenson',pos:'RB',val:56},
  // ── ROUND 8 ──
  {n:'Travis Etienne Jr.',pos:'RB',val:60},{n:'Javonte Williams',pos:'RB',val:59},
  {n:'Tyler Warren',pos:'TE',val:62},{n:'Dalton Kincaid',pos:'TE',val:60},
  {n:'Tyjae Spears',pos:'RB',val:55},{n:'Chuba Hubbard',pos:'RB',val:54},
  {n:'Blake Corum',pos:'RB',val:54},{n:'Kenneth Gainwell',pos:'RB',val:53},
  {n:'Jayden Higgins',pos:'WR',val:55},{n:'Tucker Kraft',pos:'TE',val:58},
  {n:'Jake Ferguson',pos:'TE',val:57},{n:'Isaiah Likely',pos:'TE',val:56},
  // ── ROUND 9 ──
  {n:'Bo Nix',pos:'QB',val:68},{n:'Kyler Murray',pos:'QB',val:67},
  {n:'Brock Purdy',pos:'QB',val:67},{n:'Dak Prescott',pos:'QB',val:66},
  {n:'Ricky Pearsall',pos:'WR',val:52},{n:'Xavier Worthy',pos:'WR',val:52},
  {n:'Rachaad White',pos:'RB',val:52},{n:"Wan'Dale Robinson",pos:'WR',val:51},
  {n:'Aaron Jones',pos:'RB',val:51},{n:'Jakobi Meyers',pos:'WR',val:50},
  {n:'Michael Pittman Jr.',pos:'WR',val:50},{n:'J.K. Dobbins',pos:'RB',val:50},
  // ── ROUND 10 ──
  {n:'Baker Mayfield',pos:'QB',val:64},{n:'Jordan Love',pos:'QB',val:63},
  {n:'Jared Goff',pos:'QB',val:63},{n:'Tyler Shough',pos:'QB',val:60},
  {n:'Josh Downs',pos:'WR',val:49},{n:'Alec Pierce',pos:'WR',val:48},
  {n:'Rico Dowdle',pos:'RB',val:48},{n:'Keaton Mitchell',pos:'RB',val:47},
  {n:'Tyler Allgeier',pos:'RB',val:47},{n:'Tre Tucker',pos:'WR',val:47},
  {n:'Woody Marks',pos:'RB',val:46},{n:'George Kittle',pos:'TE',val:55},
  // ── ROUND 11 ──
  {n:'Matthew Stafford',pos:'QB',val:60},{n:'Sam Darnold',pos:'QB',val:58},
  {n:'Stefon Diggs',pos:'WR',val:46},{n:'Isiah Pacheco',pos:'RB',val:45},
  {n:'Makai Lemon',pos:'WR',val:45},{n:'Antonio Williams',pos:'WR',val:44},
  {n:'Matthew Golden',pos:'WR',val:44},{n:'Jalen Nailor',pos:'WR',val:43},
  {n:'Deebo Samuel',pos:'WR',val:43},{n:'Jalen McMillan',pos:'WR',val:42},
  {n:'Oronde Gadsden II',pos:'TE',val:52},{n:'Dallas Goedert',pos:'TE',val:54},
  // ── ROUND 12 ──
  {n:'Kyler Murray',pos:'QB',val:57},{n:'Malik Willis',pos:'QB',val:52},
  {n:'Khalil Shakir',pos:'WR',val:42},{n:'Jaylen Wright',pos:'RB',val:42},
  {n:'Donovan Edwards',pos:'RB',val:41},{n:'Omar Cooper Jr.',pos:'WR',val:41},
  {n:'Brandon Aiyuk',pos:'WR',val:41},{n:'Zach Charbonnet',pos:'RB',val:41},
  {n:'KC Concepcion',pos:'WR',val:40},{n:'Tyrone Tracy Jr.',pos:'RB',val:40},
  {n:'Pat Freiermuth',pos:'TE',val:48},{n:'Chig Okonkwo',pos:'TE',val:46},
  // ── ROUND 13 ──
  {n:'Travis Hunter',pos:'WR',val:39},{n:'Alvin Kamara',pos:'RB',val:39},
  {n:'Brian Robinson Jr.',pos:'RB',val:38},{n:'Ryan Flournoy',pos:'WR',val:38},
  {n:"Tre' Harris",pos:'WR',val:37},{n:'Jalen Coker',pos:'WR',val:37},
  {n:'Sean Tucker',pos:'RB',val:36},{n:'Tank Bigsby',pos:'RB',val:36},
  {n:'Nicholas Singleton',pos:'RB',val:35},{n:'Jonah Coleman',pos:'WR',val:35},
  {n:'Noah Fant',pos:'TE',val:44},{n:'Evan Engram',pos:'TE',val:43},
  // ── ROUND 14 (K + bench) ──
  {n:'Brandon Aubrey',pos:'K',val:40},{n:'Jake Bates',pos:'K',val:38},
  {n:'Harrison Butker',pos:'K',val:37},{n:'Chris Boswell',pos:'K',val:36},
  {n:'Evan McPherson',pos:'K',val:35},{n:'Tyler Bass',pos:'K',val:34},
  {n:'Jake Elliott',pos:'K',val:33},{n:'Jason Myers',pos:'K',val:32},
  {n:"Ka'imi Fairbairn",pos:'K',val:31},{n:'Chase McLaughlin',pos:'K',val:30},
  {n:'Cameron Dicker',pos:'K',val:29},{n:'Will Reichard',pos:'K',val:28},
  // ── ROUND 15 (D/ST) ──
  {n:'Philadelphia Eagles D/ST',pos:'D/ST',val:42},{n:'Baltimore Ravens D/ST',pos:'D/ST',val:40},
  {n:'San Francisco 49ers D/ST',pos:'D/ST',val:39},{n:'Buffalo Bills D/ST',pos:'D/ST',val:38},
  {n:'Dallas Cowboys D/ST',pos:'D/ST',val:37},{n:'Kansas City Chiefs D/ST',pos:'D/ST',val:36},
  {n:'Los Angeles Chargers D/ST',pos:'D/ST',val:35},{n:'Cleveland Browns D/ST',pos:'D/ST',val:34},
  {n:'Seattle Seahawks D/ST',pos:'D/ST',val:33},{n:'Denver Broncos D/ST',pos:'D/ST',val:32},
  {n:'Minnesota Vikings D/ST',pos:'D/ST',val:31},{n:'Pittsburgh Steelers D/ST',pos:'D/ST',val:30},
  {n:'Washington Commanders D/ST',pos:'D/ST',val:29},{n:'Detroit Lions D/ST',pos:'D/ST',val:28},
  {n:'Green Bay Packers D/ST',pos:'D/ST',val:27},{n:'Houston Texans D/ST',pos:'D/ST',val:26},
  {n:'Indianapolis Colts D/ST',pos:'D/ST',val:25},{n:'Tampa Bay Buccaneers D/ST',pos:'D/ST',val:24},
  {n:'Los Angeles Rams D/ST',pos:'D/ST',val:23},{n:'New York Giants D/ST',pos:'D/ST',val:22},
  {n:'Jacksonville Jaguars D/ST',pos:'D/ST',val:21},{n:'Cincinnati Bengals D/ST',pos:'D/ST',val:20},
  {n:'Atlanta Falcons D/ST',pos:'D/ST',val:19},{n:'New York Jets D/ST',pos:'D/ST',val:18},
  // ── ROUND 16 (late bench stash) ──
  {n:'Joey Slye',pos:'K',val:27},{n:'Nick Folk',pos:'K',val:26},
  {n:'Tyler Loop',pos:'K',val:25},{n:'Tyler Bass',pos:'K',val:24},
  {n:'Elic Ayomanor',pos:'WR',val:28},{n:'David Sills V',pos:'WR',val:27},
  {n:'Michael Wilson',pos:'WR',val:26},{n:'Jalen McMillan',pos:'WR',val:25},
  {n:'Keaton Mitchell',pos:'RB',val:30},{n:'Jerome Ford',pos:'RB',val:29},
  {n:'Jacory Croskey-Merritt',pos:'RB',val:28},{n:'Braelon Allen',pos:'RB',val:27},
  {n:'Kaytron Allen',pos:'RB',val:26},{n:'MarShawn Lloyd',pos:'RB',val:25},
  {n:'Gunnar Helm',pos:'TE',val:30},{n:'Kenyon Sadiq',pos:'TE',val:29},
  {n:'Mason Taylor',pos:'TE',val:28},{n:'Tommy Tremble',pos:'TE',val:27},
  {n:'Darnell Washington',pos:'TE',val:26},{n:'Robert Tonyan',pos:'TE',val:25},
  {n:'Miami Dolphins D/ST',pos:'D/ST',val:17},{n:'Tennessee Titans D/ST',pos:'D/ST',val:16},
  {n:'Carolina Panthers D/ST',pos:'D/ST',val:15},{n:'New Orleans Saints D/ST',pos:'D/ST',val:14},
  {n:'Chicago Bears D/ST',pos:'D/ST',val:13},{n:'Arizona Cardinals D/ST',pos:'D/ST',val:12},
  {n:'Las Vegas Raiders D/ST',pos:'D/ST',val:11},{n:'New England Patriots D/ST',pos:'D/ST',val:10},
];

// ============================================================
// ACTUAL 2026–27 DRAFT DATA
// Draft column order (actual snake positions 1–12):
// 0=NickG  1=ColbyD  2=Emmitt  3=Jake   4=Rourke  5=Reid
// 6=Asher  7=Christian  8=Nate  9=ColbyF  10=JOE  11=NickR
// ============================================================
const ACTUAL_DRAFT_ORDER = ['NickG','ColbyD','Emmitt','Jake','Rourke','Reid','Asher','Christian','Nate','ColbyF','JOE','NickR'];

// 192 picks in snake order (index 0 = pick 1). Each round alternates direction.
const ACTUAL_PICKS = [
  // R1 left→right (cols 0–11)
  {player:"Ja'Marr Chase",pos:'WR'},{player:'Bijan Robinson',pos:'RB'},{player:'Justin Jefferson',pos:'WR'},
  {player:'CeeDee Lamb',pos:'WR'},{player:'Saquon Barkley',pos:'RB'},{player:'Christian McCaffrey',pos:'RB'},
  {player:'Jahmyr Gibbs',pos:'RB'},{player:'Amon-Ra St. Brown',pos:'WR'},{player:'Puka Nacua',pos:'WR'},
  {player:'Josh Jacobs',pos:'RB'},{player:'Drake London',pos:'WR'},{player:'Ashton Jeanty',pos:'RB'},
  // R2 right→left (cols 11–0)
  {player:'Jonathan Taylor',pos:'RB'},{player:"De'Von Achane",pos:'RB'},{player:'A.J. Brown',pos:'WR'},
  {player:'Derrick Henry',pos:'RB'},{player:'Chase Brown',pos:'RB'},{player:'Kyren Williams',pos:'RB'},
  {player:'Davante Adams',pos:'WR'},{player:'James Cook III',pos:'RB'},{player:'Garrett Wilson',pos:'WR'},
  {player:'Kenneth Walker III',pos:'RB'},{player:'Chuba Hubbard',pos:'RB'},{player:'Omarion Hampton',pos:'RB'},
  // R3 left→right
  {player:'Nico Collins',pos:'WR'},{player:'TreVeyon Henderson',pos:'RB'},{player:'Alvin Kamara',pos:'RB'},
  {player:'Jalen Hurts',pos:'QB'},{player:'Lamar Jackson',pos:'QB'},{player:'James Conner',pos:'RB'},
  {player:'Tyreek Hill',pos:'WR'},{player:'Mike Evans',pos:'WR'},{player:'Josh Allen',pos:'QB'},
  {player:"D'Andre Swift",pos:'RB'},{player:'Breece Hall',pos:'RB'},{player:'Tee Higgins',pos:'WR'},
  // R4 right→left
  {player:'Joe Burrow',pos:'QB'},{player:'Marvin Harrison Jr.',pos:'WR'},{player:'DJ Moore',pos:'WR'},
  {player:'George Kittle',pos:'TE'},{player:'Bo Nix',pos:'QB'},{player:'Terry McLaurin',pos:'WR'},
  {player:'Courtland Sutton',pos:'WR'},{player:'Zay Flowers',pos:'WR'},{player:'David Montgomery',pos:'RB'},
  {player:'Trey McBride',pos:'TE'},{player:'Calvin Ridley',pos:'WR'},{player:'Xavier Worthy',pos:'WR'},
  // R5 left→right
  {player:'Aaron Jones Sr.',pos:'RB'},{player:'DK Metcalf',pos:'WR'},{player:"DeVonta Smith",pos:'WR'},
  {player:'Isiah Pacheco',pos:'RB'},{player:'Rashee Rice',pos:'WR'},{player:'Dak Prescott',pos:'QB'},
  {player:'Jerry Jeudy',pos:'WR'},{player:'Stefon Diggs',pos:'WR'},{player:'RJ Harvey',pos:'RB'},
  {player:'Baker Mayfield',pos:'QB'},{player:'George Pickens',pos:'WR'},{player:'Malik Nabers',pos:'WR'},
  // R6 right→left
  {player:'Sam LaPorta',pos:'TE'},{player:'Tony Pollard',pos:'RB'},{player:'T.J. Hockenson',pos:'TE'},
  {player:'Tetairoa McMillan',pos:'WR'},{player:'Evan Engram',pos:'TE'},{player:'Jaylen Waddle',pos:'WR'},
  {player:'Colston Loveland',pos:'TE'},{player:'Travis Hunter',pos:'WR'},{player:'Travis Kelce',pos:'TE'},
  {player:'Patrick Mahomes',pos:'QB'},{player:'Kyle Pitts',pos:'TE'},{player:'Kyler Murray',pos:'QB'},
  // R7 left→right
  {player:'David Njoku',pos:'TE'},{player:'Cooper Kupp',pos:'WR'},{player:'Jakobi Meyers',pos:'WR'},
  {player:'Joe Mixon',pos:'RB'},{player:'Tyrone Tracy Jr.',pos:'RB'},{player:'Jaxon Smith-Njigba',pos:'WR'},
  {player:'Kaleb Johnson',pos:'RB'},{player:'Brian Robinson Jr.',pos:'RB'},{player:'Chris Godwin Jr.',pos:'WR'},
  {player:'Jaylen Warren',pos:'RB'},{player:'Brock Bowers',pos:'TE'},{player:'Matthew Golden',pos:'WR'},
  // R8 right→left
  {player:'Chris Olave',pos:'WR'},{player:'Jordan Addison',pos:'WR'},{player:'Michael Pittman Jr.',pos:'WR'},
  {player:'Rome Odunze',pos:'WR'},{player:'Deebo Samuel',pos:'WR'},{player:'Mark Andrews',pos:'TE'},
  {player:'J.K. Dobbins',pos:'RB'},{player:'Travis Etienne Jr.',pos:'RB'},{player:'Keon Coleman',pos:'WR'},
  {player:'Keenan Allen',pos:'WR'},{player:'Emeka Egbuka',pos:'WR'},{player:'Javonte Williams',pos:'RB'},
  // R9 left→right
  {player:'Jameson Williams',pos:'WR'},{player:'Ladd McConkey',pos:'WR'},{player:'Cam Skattebo',pos:'RB'},
  {player:'Quinshon Judkins',pos:'RB'},{player:'Zach Ertz',pos:'TE'},{player:'Ricky Pearsall',pos:'WR'},
  {player:'Khalil Shakir',pos:'WR'},{player:'Brock Purdy',pos:'QB'},{player:'Josh Downs',pos:'WR'},
  {player:'Jayden Reed',pos:'WR'},{player:'J.J. McCarthy',pos:'QB'},{player:'Darnell Mooney',pos:'WR'},
  // R10 right→left
  {player:'Jayden Higgins',pos:'WR'},{player:'Tyler Warren',pos:'TE'},{player:'Austin Ekeler',pos:'RB'},
  {player:'Jordan Mason',pos:'RB'},{player:'Cameron Dicker',pos:'K'},{player:'Rhamondre Stevenson',pos:'RB'},
  {player:'Tank Bigsby',pos:'RB'},{player:'Brandon Aiyuk',pos:'WR'},{player:'Jaydon Blue',pos:'RB'},
  {player:'Adam Thielen',pos:'WR'},{player:'Cam Ward',pos:'QB'},{player:'Rachaad White',pos:'RB'},
  // R11 left→right
  {player:'Drake Maye',pos:'QB'},{player:'Justin Fields',pos:'QB'},{player:'Tyjae Spears',pos:'RB'},
  {player:'Christian Kirk',pos:'WR'},{player:'Xavier Legette',pos:'WR'},{player:'Brandon Aubrey',pos:'K'},
  {player:'Jayden Daniels',pos:'QB'},{player:'Zach Charbonnet',pos:'RB'},{player:'Trey Benson',pos:'RB'},
  {player:'Tucker Kraft',pos:'TE'},{player:'Braelon Allen',pos:'RB'},{player:'Justin Herbert',pos:'QB'},
  // R12 right→left
  {player:'Dallas Goedert',pos:'TE'},{player:'Nick Chubb',pos:'RB'},{player:'Cedric Tillman',pos:'WR'},
  {player:'Bhayshul Tuten',pos:'RB'},{player:'Steelers D/ST',pos:'D/ST'},{player:'Hollywood Brown',pos:'WR'},
  {player:'Rashid Shaheed',pos:'WR'},{player:'Jordan Love',pos:'QB'},{player:'Caleb Williams',pos:'QB'},
  {player:'Jake Ferguson',pos:'TE'},{player:'Luther Burden III',pos:'WR'},{player:'Dalton Kincaid',pos:'TE'},
  // R13 left→right
  {player:'Tyler Allgeier',pos:'RB'},{player:'Isaac Guerendo',pos:'RB'},{player:'Jared Goff',pos:'QB'},
  {player:'Jaylen Wright',pos:'RB'},{player:'Jerome Ford',pos:'RB'},{player:'Vikings D/ST',pos:'D/ST'},
  {player:'Hunter Henry',pos:'TE'},{player:'Chig Okonkwo',pos:'TE'},{player:'Dylan Sampson',pos:'RB'},
  {player:'Jonnu Smith',pos:'TE'},{player:'Calvin Austin III',pos:'WR'},{player:'Chase McLaughlin',pos:'K'},
  // R14 right→left
  {player:'Texans D/ST',pos:'D/ST'},{player:'Seahawks D/ST',pos:'D/ST'},{player:'Broncos D/ST',pos:'D/ST'},
  {player:'Ravens D/ST',pos:'D/ST'},{player:"Wan'Dale Robinson",pos:'WR'},{player:"Tre' Harris",pos:'WR'},
  {player:'Marvin Mims Jr.',pos:'WR'},{player:'Cam Little',pos:'K'},{player:'Jake Bates',pos:'K'},
  {player:'Tyler Bass',pos:'K'},{player:'Trevor Etienne',pos:'RB'},{player:'Lions D/ST',pos:'D/ST'},
  // R15 left→right
  {player:'Jason Sanders',pos:'K'},{player:'Patriots D/ST',pos:'D/ST'},{player:'Eagles D/ST',pos:'D/ST'},
  {player:'Brian Thomas Jr.',pos:'WR'},{player:'Bills D/ST',pos:'D/ST'},{player:'DeMario Douglas',pos:'WR'},
  {player:'Colts D/ST',pos:'D/ST'},{player:'Bucky Irving',pos:'RB'},{player:'Jake Elliott',pos:'K'},
  {player:'Tyler Loop',pos:'K'},{player:'Tua Tagovailoa',pos:'QB'},{player:'Ray Davis',pos:'RB'},
  // R16 right→left
  {player:'Jalen McMillan',pos:'WR'},{player:'Justin Tucker',pos:'K'},{player:'Jauan Jennings',pos:'WR'},
  {player:'Mason Taylor',pos:'TE'},{player:'Tyler Lockett',pos:'WR'},{player:'Chris Boswell',pos:'K'},
  {player:"C.J. Stroud",pos:'QB'},{player:'Kyle Williams',pos:'WR'},{player:'Giants D/ST',pos:'D/ST'},
  {player:'DeAndre Hopkins',pos:'WR'},{player:'Younghoe Koo',pos:'K'},{player:'Mike Gesicki',pos:'TE'},
];

// Get pick for a given round (1-16) and column (0-11) in ACTUAL_DRAFT_ORDER
function getActualPickForCell(round, col) {
  const posInRound = (round % 2 === 1) ? col : (11 - col);
  const pickIdx = (round - 1) * 12 + posInRound;
  return { pick: ACTUAL_PICKS[pickIdx], pickNum: pickIdx + 1 };
}

// Build rosters from ACTUAL_PICKS
function buildActualRosters() {
  const rosters = {};
  ACTUAL_DRAFT_ORDER.forEach(id => { rosters[id] = []; });
  ACTUAL_PICKS.forEach((pick, idx) => {
    const round = Math.floor(idx / 12) + 1;
    const posInRound = idx % 12;
    const colIdx = (round % 2 === 1) ? posInRound : (11 - posInRound);
    const teamId = ACTUAL_DRAFT_ORDER[colIdx];
    rosters[teamId].push({ ...pick, round });
  });
  return rosters;
}

function renderActualDraftBoard() {
  const board = document.getElementById('actual-draft-board');
  let html = '<thead><tr><th style="width:50px;">Rd</th>';
  ACTUAL_DRAFT_ORDER.forEach(teamId => {
    const team = TEAMS.find(t => t.id === teamId);
    const isMe = teamId === MY_TEAM;
    html += `<th class="${isMe?'my-col':''}">${isMe?'⭐ ':''}${team.teamName}<br><span style="font-weight:400;opacity:0.7;font-size:0.65rem;">${team.name}</span></th>`;
  });
  html += '</tr></thead><tbody>';

  for (let r = 1; r <= 16; r++) {
    html += `<tr><td style="background:var(--card2);text-align:center;font-weight:700;color:var(--muted);font-size:0.8rem;">R${r}</td>`;
    for (let c = 0; c < 12; c++) {
      const teamId = ACTUAL_DRAFT_ORDER[c];
      const isMe = teamId === MY_TEAM;
      const { pick, pickNum } = getActualPickForCell(r, c);
      html += `<td>
        <div class="draft-cell ${isMe?'my-pick':''} filled" style="cursor:default;">
          <div class="pick-num">${getPickLabel(pickNum)}</div>
          <div class="pick-player">${pick.player}</div>
          <div class="pick-pos">${pick.pos}</div>
        </div>
      </td>`;
    }
    html += '</tr>';
  }
  html += '</tbody>';
  board.innerHTML = html;
}

function renderActualTeamRosters() {
  const grid = document.getElementById('actual-team-grid');
  const posOrder = ['QB','RB','WR','TE','D/ST','K'];
  const rosters = buildActualRosters();

  grid.innerHTML = ACTUAL_DRAFT_ORDER.map(teamId => {
    const team = TEAMS.find(t => t.id === teamId);
    const isMe = teamId === MY_TEAM;
    const sorted = [...rosters[teamId]].sort((a, b) => {
      const ai = posOrder.indexOf(a.pos); const bi = posOrder.indexOf(b.pos);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
    const wrCount = sorted.filter(p => p.pos === 'WR').length;
    const rbCount = sorted.filter(p => p.pos === 'RB').length;
    return `<div class="sim-team-card ${isMe?'my-team':''}">
      <h4 style="display:flex;justify-content:space-between;align-items:center;">
        <span>${isMe?'⭐ ':''}${team.teamName} <span style="font-size:0.7rem;font-weight:400;opacity:0.7;">${team.name}</span></span>
        <span style="font-size:0.68rem;color:var(--muted);white-space:nowrap;">WR:${wrCount} RB:${rbCount}</span>
      </h4>
      ${sorted.map(p => `<div class="sim-player"><span class="pos-badge ${p.pos.replace('/','')}">${p.pos}</span> ${p.player}<span style="color:var(--muted);font-size:0.62rem;margin-left:auto;">R${p.round}</span></div>`).join('')}
    </div>`;
  }).join('');
}

let actualDraftRendered = false;
function toggleActualDraft() {
  const wrap = document.getElementById('actual-draft-wrap');
  const toggle = document.getElementById('actual-draft-toggle');
  if (wrap.style.display === 'none') {
    wrap.style.display = 'block';
    toggle.textContent = '▲ Hide Results';
    if (!actualDraftRendered) {
      renderActualDraftBoard();
      renderActualTeamRosters();
      actualDraftRendered = true;
    }
  } else {
    wrap.style.display = 'none';
    toggle.textContent = '▼ Show Results';
  }
}

// ============================================================
// DRAFT BOARD STATE (stored in localStorage)
// ============================================================
const STORAGE_KEY = 'daddy_football_6_draft';
let draftState = {}; // { pickNum: {player, pos} }

function loadDraftState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) draftState = JSON.parse(saved);
  } catch(e) { draftState = {}; }
}

function saveDraftState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(draftState));
}

// ============================================================
// PAGE NAVIGATION
// ============================================================
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('nav button').forEach(b => {
    if (b.getAttribute('onclick').includes(id)) b.classList.add('active');
  });
  if (id === 'draft') renderDraftBoard();
  if (id === 'teams') renderTeams();
  if (id === 'keepers') renderKeepers();
  if (id === 'mock') renderMockConfig();
  if (id === 'depth') renderDepthCharts();
}

// ============================================================
// TEAMS PAGE
// ============================================================
function renderTeams() {
  const grid = document.getElementById('teams-grid');
  const slots = ['QB','RB','RB','WR','WR','TE','FLEX','D/ST','K','BE','BE','BE','BE','BE','BE','BE'];
  grid.innerHTML = TEAMS.map(t => {
    const isMe = t.id === MY_TEAM;
    const keeperNote = `<div style="padding:8px 14px;border-top:1px solid rgba(255,255,255,0.07);font-size:0.76rem;color:var(--orange);">🔒 Keeper: <strong>${t.keeper.prob}</strong> <span style="color:var(--muted);">(Rd ${t.keeper.rd})</span></div>`;
    return `
      <div class="team-card ${isMe?'my-team':''}">
        <div class="team-card-header">
          <div>
            <h3>${isMe?'⭐ ':''} ${t.teamName}</h3>
            <div style="font-size:0.72rem;color:rgba(255,255,255,0.6);margin-top:2px;">Manager: ${t.name}</div>
          </div>
          <span>Pick #${t.pick}</span>
        </div>
        <div class="roster-list">
          ${slots.map(s => `<div class="roster-slot"><span class="pos-badge ${s.replace('/','')}">${s}</span><span class="player-empty">TBD</span></div>`).join('')}
        </div>
        ${keeperNote}
      </div>`;
  }).join('');
}

// ============================================================
// KEEPERS PAGE
// ============================================================
function renderKeepers() {
  const valueLabel = (rd) => {
    if (rd >= 14) return '<span style="color:#4ade80;font-weight:700;">🔥 Elite Value</span>';
    if (rd >= 10) return '<span style="color:#a3e635;font-weight:700;">✅ Great Value</span>';
    if (rd >= 7) return '<span style="color:#facc15;font-weight:700;">👍 Good Value</span>';
    if (rd >= 4) return '<span style="color:#fb923c;">⚠️ OK Value</span>';
    return '<span style="color:#f87171;">❌ Expensive</span>';
  };
  const tbody = document.getElementById('keepers-table');
  tbody.innerHTML = TEAMS.map(t => {
    const alts = t.keeper.alt.length
      ? t.keeper.alt.map(a => `<span style="color:var(--text);">${a.p}</span> <span class="keeper-rd">Rd ${a.rd}</span>`).join('  •  ')
      : '<span class="text-muted">—</span>';
    return `<tr ${t.id===MY_TEAM?'style="background:rgba(249,115,22,0.05)"':''}>
      <td><strong style="color:var(--gold);">#${t.pick}</strong></td>
      <td><strong>${t.teamName}</strong><br><span style="font-size:0.78rem;color:var(--muted);">${t.name}</span>${t.id===MY_TEAM?' <span class="badge badge-gold">YOU</span>':''}</td>
      <td><strong class="keeper-star">${t.keeper.prob}</strong></td>
      <td><span class="keeper-rd">Rd ${t.keeper.rd}</span></td>
      <td>${valueLabel(t.keeper.rd)}</td>
      <td style="font-size:0.82rem;">${alts}</td>
    </tr>`;
  }).join('');
}

// ============================================================
// LIVE DRAFT BOARD
// ============================================================
let currentEditPick = null;

function buildSnakeOrder() {
  const order = [];
  for (let r = 0; r < ROUNDS; r++) {
    for (let c = 0; c < NUM_TEAMS; c++) {
      const teamIdx = r % 2 === 0 ? c : NUM_TEAMS - 1 - c;
      const pickNum = r * NUM_TEAMS + c + 1;
      order.push({ pickNum, round: r+1, posInRound: c+1, teamIdx });
    }
  }
  return order;
}

function renderDraftBoard() {
  loadDraftState();
  const picks = buildSnakeOrder();
  const board = document.getElementById('draft-board');

  // Headers
  let html = '<thead><tr><th style="width:50px;">Rd</th>';
  TEAMS.forEach(t => {
    const isMe = t.id === MY_TEAM;
    html += `<th class="${isMe?'my-col':''}">${isMe?'⭐ ':''} ${t.teamName}<br><span style="font-weight:400;opacity:0.7;font-size:0.65rem;">${t.name}</span></th>`;
  });
  html += '</tr></thead><tbody>';

  // Rows by round
  for (let r = 1; r <= ROUNDS; r++) {
    html += `<tr>`;
    html += `<td style="background:var(--card2);text-align:center;font-weight:700;color:var(--muted);font-size:0.8rem;">R${r}</td>`;
    const roundPicks = picks.filter(p => p.round === r);
    // Sort by teamIdx to always display teams in order
    const byTeam = new Array(NUM_TEAMS);
    roundPicks.forEach(p => byTeam[p.teamIdx] = p);
    byTeam.forEach((p, ti) => {
      const team = TEAMS[ti];
      const isMe = team.id === MY_TEAM;
      const state = draftState[p.pickNum];
      const label = getPickLabel(p.pickNum);
      const filled = !!state;
      html += `<td>
        <div class="draft-cell ${isMe?'my-pick':''} ${filled?'filled':''}" onclick="openDraftModal(${p.pickNum})">
          <div class="pick-num">${label}</div>
          ${state ? `<div class="pick-player">${state.player}</div><div class="pick-pos">${state.pos||''}</div>` : '<div class="player-empty">click to enter</div>'}
        </div>
      </td>`;
    });
    html += '</tr>';
  }

  html += '</tbody>';
  board.innerHTML = html;
  updateDraftProgress();
}

function updateDraftProgress() {
  const total = ROUNDS * NUM_TEAMS;
  const filled = Object.keys(draftState).length;
  const pct = Math.round(filled / total * 100);
  document.getElementById('draft-progress').style.width = pct + '%';
  document.getElementById('draft-count').textContent = `${filled} / ${total} picks entered`;
}

function openDraftModal(pickNum) {
  currentEditPick = pickNum;
  const label = getPickLabel(pickNum);
  const teamIdx = getTeamForPick(pickNum);
  const team = TEAMS[teamIdx];
  document.getElementById('modal-title').textContent = `Pick ${label} — ${team.name}`;
  const state = draftState[pickNum] || {};
  document.getElementById('modal-player').value = state.player || '';
  document.getElementById('modal-pos').value = state.pos || '';
  document.getElementById('draft-modal').classList.add('open');
  setTimeout(() => document.getElementById('modal-player').focus(), 50);
}

function closeModal() {
  document.getElementById('draft-modal').classList.remove('open');
  currentEditPick = null;
}

function saveModalPick() {
  if (!currentEditPick) return;
  const player = document.getElementById('modal-player').value.trim();
  const pos = document.getElementById('modal-pos').value;
  if (player) {
    draftState[currentEditPick] = { player, pos };
  } else {
    delete draftState[currentEditPick];
  }
  saveDraftState();
  closeModal();
  renderDraftBoard();
}

function clearModalPick() {
  if (!currentEditPick) return;
  delete draftState[currentEditPick];
  saveDraftState();
  closeModal();
  renderDraftBoard();
}

function clearDraft() {
  if (!confirm('Clear all draft picks?')) return;
  draftState = {};
  saveDraftState();
  renderDraftBoard();
}

function exportDraft() {
  let out = 'DADDY FOOTBALL 5.0 — DRAFT RESULTS\n';
  out += '='.repeat(50) + '\n';
  const picks = buildSnakeOrder();
  picks.forEach(p => {
    const label = getPickLabel(p.pickNum);
    const team = TEAMS[p.teamIdx];
    const state = draftState[p.pickNum];
    out += `${label}\t${team.name}\t${state ? state.player + (state.pos ? ' ('+state.pos+')' : '') : '(empty)'}\n`;
  });
  const blob = new Blob([out], {type:'text/plain'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'DaddyFootball5_Draft.txt';
  a.click();
}

// Enter key submits modal
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('draft-modal').classList.contains('open')) {
    saveModalPick();
  }
  if (e.key === 'Escape') closeModal();
});

// ============================================================
// MOCK DRAFT SIMULATOR
// ============================================================

// ── My Team Per-Round Strategy ────────────────────────────────
let myRoundStrategies = Array(16).fill('WR/RB');

const MY_STRATEGIES = {
  'WR':    { rbBonus:0,  wrBonus:45, qbBonus:0,  tePremium:false, teBonus:0,  qbEarly:false, dstEarly:false, kEarly:false },
  'RB':    { rbBonus:45, wrBonus:0,  qbBonus:0,  tePremium:false, teBonus:0,  qbEarly:false, dstEarly:false, kEarly:false },
  'WR/RB': { rbBonus:15, wrBonus:15, qbBonus:0,  tePremium:false, teBonus:0,  qbEarly:false, dstEarly:false, kEarly:false },
  'QB':    { rbBonus:0,  wrBonus:0,  qbBonus:50, tePremium:false, teBonus:0,  qbEarly:true,  dstEarly:false, kEarly:false },
  'TE':    { rbBonus:0,  wrBonus:5,  qbBonus:0,  tePremium:true,  teBonus:45, qbEarly:false, dstEarly:false, kEarly:false },
  'DST':   { rbBonus:5,  wrBonus:5,  qbBonus:0,  tePremium:false, teBonus:0,  qbEarly:false, dstEarly:true,  kEarly:false },
  'K':     { rbBonus:5,  wrBonus:5,  qbBonus:0,  tePremium:false, teBonus:0,  qbEarly:false, dstEarly:false, kEarly:true  },
};

const STRAT_LABELS = {
  'WR/RB':'WR/RB', 'WR':'WR', 'RB':'RB', 'QB':'QB', 'TE':'TE', 'DST':'DST', 'K':'K'
};

const STRAT_COLORS = {
  'WR/RB':'var(--gold)', 'WR':'#60a5fa', 'RB':'#4ade80',
  'QB':'#e879f9', 'TE':'#fb923c', 'DST':'#f87171', 'K':'#94a3b8'
};

function setRoundStrategy(round, val) {
  myRoundStrategies[round - 1] = val;
  // Update badge color on the card
  const badge = document.getElementById('strat-badge-' + round);
  if (badge) { badge.textContent = val; badge.style.color = STRAT_COLORS[val] || 'var(--gold)'; }
}

function fillAllRounds() {
  const val = document.getElementById('fill-all-select').value;
  myRoundStrategies = Array(16).fill(val);
  renderMyStrategy();
}

function renderMyStrategy() {
  const grid = document.getElementById('round-strategy-grid');
  if (!grid) return;
  const joeIdx = TEAMS.findIndex(t => t.id === MY_TEAM);
  const opts = ['WR/RB','WR','RB','QB','TE','DST','K'];

  let html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(195px,1fr));gap:8px;">';
  for (let r = 1; r <= 16; r++) {
    const posInRound = (r % 2 === 1) ? joeIdx : (NUM_TEAMS - 1 - joeIdx);
    const pickNum = (r - 1) * NUM_TEAMS + posInRound + 1;
    const label = getPickLabel(pickNum);
    const cur = myRoundStrategies[r - 1];
    html += `
    <div style="background:var(--card2);border:1px solid var(--border);border-radius:8px;padding:8px 10px;display:flex;align-items:center;gap:8px;">
      <div style="min-width:62px;">
        <div style="font-size:0.78rem;font-weight:700;color:var(--gold);">Round ${r}</div>
        <div style="font-size:0.62rem;color:var(--muted);">Pick ${label}</div>
      </div>
      <select onchange="setRoundStrategy(${r}, this.value)"
        style="flex:1;background:var(--card);border:1px solid var(--border);color:var(--text);padding:5px 6px;border-radius:6px;font-size:0.82rem;outline:none;cursor:pointer;">
        ${opts.map(o => `<option value="${o}" ${cur===o?'selected':''}>${o}</option>`).join('')}
      </select>
      <span id="strat-badge-${r}" style="font-size:0.68rem;font-weight:700;color:${STRAT_COLORS[cur]||'var(--gold)'};min-width:36px;text-align:right;">${cur}</span>
    </div>`;
  }
  html += '</div>';
  grid.innerHTML = html;
}

let mockKeeperChoices = {}; // teamId -> { player, pos, rd } or null

// ── Look up position for any player name ──────────────────────
function getProbPos(name) {
  const p = PLAYER_POOL.find(x => x.n.toLowerCase() === name.toLowerCase());
  if (p) return p.pos;
  if (/D\/ST/.test(name)) return 'D/ST';
  if (/Dart|Maye|Allen|Burrow|Herbert|Mahomes|Hurts|Jackson|Daniels|Stroud|Ward|Nix|Murray|Love|Goff|Stafford|Darnold|Shough|Willis/.test(name)) return 'QB';
  if (/Kelce|Kittle|Andrews|LaPorta|Warren|Bowers|Kraft|Kincaid|Pitts|Loveland|Otton|Goedert|Freiermuth|Okonkwo|Fant|Engram|Helm|Sadiq|Taylor|Tremble/.test(name)) return 'TE';
  if (/Aubrey|Bates|Butker|Boswell|McPherson|Bass|Elliott|Myers|Fairbairn|Dicker|Reichard|Folk|Loop|Slye|McLaughlin/.test(name)) return 'K';
  return 'WR';
}

// ── Called by radio buttons — clean, no inline JSON ───────────
function setKeeperChoice(teamId, key) {
  const team = TEAMS.find(t => t.id === teamId);
  if (!team) return;
  if (key === 'none') {
    mockKeeperChoices[teamId] = null;
  } else if (key === 'prob') {
    mockKeeperChoices[teamId] = {
      player: team.keeper.prob,
      pos: getProbPos(team.keeper.prob),
      rd: team.keeper.rd
    };
  } else {
    const idx = parseInt(key.replace('alt',''), 10);
    const alt = team.keeper.alt[idx];
    if (alt) {
      mockKeeperChoices[teamId] = {
        player: alt.p,
        pos: getProbPos(alt.p),
        rd: alt.rd
      };
    }
  }
}

function renderMockConfig() {
  const cfg = document.getElementById('keeper-config');
  cfg.innerHTML = TEAMS.map(t => {
    const isMe = t.id === MY_TEAM;
    const opts = [
      {key:'none',  label:'No Keeper', sub:''},
      {key:'prob',  label: t.keeper.prob, sub: `Rd ${t.keeper.rd}`},
      ...t.keeper.alt.map((a,i) => ({key:'alt'+i, label:a.p, sub:`Rd ${a.rd}`}))
    ];
    return `<div class="keeper-config-card ${isMe?'my-team':''}">
      <h4>${isMe?'⭐ ':''} ${t.teamName} ${isMe?'<span class="badge badge-gold" style="font-size:0.65rem;">YOU</span>':''}</h4>
      <div style="font-size:0.72rem;color:var(--muted);margin-bottom:6px;">Manager: ${t.name}</div>
      <div class="keeper-radio">
        ${opts.map((o,i) => `
          <label>
            <input type="radio" name="keeper_${t.id}" value="${o.key}" ${i===1?'checked':''}
              onchange="setKeeperChoice('${t.id}', '${o.key}')">
            ${o.label}${o.sub ? ` <span style="color:var(--muted);font-size:0.75rem;">(${o.sub})</span>` : ''}
          </label>`).join('')}
      </div>
    </div>`;
  }).join('');

  // Initialize defaults (prob keeper for every team)
  TEAMS.forEach(t => setKeeperChoice(t.id, 'prob'));
}

// ── ESPN-style randomized simulation ──────────────────────────
function runMockDraft() {
  const log = document.getElementById('sim-log');
  const progressBar = document.getElementById('sim-progress-bar');
  const progress = document.getElementById('sim-progress');
  log.style.display = 'block';
  progressBar.style.display = 'block';
  log.innerHTML = '<p style="color:var(--muted);font-style:italic;">Simulating…</p>';
  progress.style.width = '0%';

  // Small async yield so the UI updates before heavy work
  setTimeout(() => {
    const results = _simulate();
    _displayResults(results.log, results.rosters);
    progress.style.width = '100%';
  }, 30);
}

function _simulate() {
  // ── 1. Assign each team a random "DNA" personality ─────────
  const DNA_STYLES = [
    {name:'RB Heavy',    rbBonus:25, wrBonus:0,  qbBonus:0,  tePremium:false, qbEarly:false},
    {name:'WR Heavy',    rbBonus:0,  wrBonus:25, qbBonus:0,  tePremium:false, qbEarly:false},
    {name:'QB Early',    rbBonus:0,  wrBonus:0,  qbBonus:30, tePremium:false, qbEarly:true },
    {name:'TE Premium',  rbBonus:5,  wrBonus:5,  qbBonus:0,  tePremium:true,  qbEarly:false},
    {name:'BPA',         rbBonus:0,  wrBonus:0,  qbBonus:0,  tePremium:false, qbEarly:false},
    {name:'Balanced',    rbBonus:8,  wrBonus:8,  qbBonus:0,  tePremium:false, qbEarly:false},
  ];
  const dna = {};
  TEAMS.forEach(t => {
    dna[t.id] = DNA_STYLES[Math.floor(Math.random() * DNA_STYLES.length)];
  });
  // MY team strategy is applied per-pick inside the loop (see style override below)

  // ── 2. Apply ±20% random noise to every player's value ─────
  const noisyPool = buildPoolFromDepthCharts().map(pl => ({
    ...pl,
    // Gaussian-ish noise: average of 2 randoms shifted to ±0.2 range
    nVal: pl.val * (1 + (Math.random() + Math.random() - 1) * 0.20)
  }));

  // ── 3. Track positional scarcity (triggers "runs") ─────────
  const posDrafted = {QB:0, RB:0, WR:0, TE:0, 'D/ST':0, K:0};

  const rosterLimits = { QB:2, RB:5, WR:5, TE:2, 'D/ST':1, K:1 };
  const rosterMin    = { QB:2, RB:4, WR:4, TE:2, 'D/ST':1, K:1 };

  const rosters = {};
  TEAMS.forEach(t => { rosters[t.id] = []; rosters[t.id].pc = {}; });

  const used = new Set();

  // Place keepers into their round slots
  const keeperSlots = {};
  TEAMS.forEach(t => {
    const k = mockKeeperChoices[t.id];
    if (k) {
      if (!keeperSlots[k.rd]) keeperSlots[k.rd] = {};
      keeperSlots[k.rd][t.id] = k;
      used.add(k.player.toLowerCase());
    }
  });

  const picks = buildSnakeOrder();
  const logEntries = [];

  picks.forEach(p => {
    const team = TEAMS[p.teamIdx];
    const roster = rosters[team.id];
    const pc = roster.pc;

    // ── Keeper auto-pick ───────────────────────────────────────
    const kpr = keeperSlots[p.round] && keeperSlots[p.round][team.id];
    if (kpr) {
      pc[kpr.pos] = (pc[kpr.pos] || 0) + 1;
      posDrafted[kpr.pos] = (posDrafted[kpr.pos] || 0) + 1;
      roster.push({player:kpr.player, pos:kpr.pos, isKeeper:true});
      logEntries.push({pickNum:p.pickNum, team:team.id, player:kpr.player, pos:kpr.pos, isKeeper:true});
      return;
    }

    const remainingRounds = ROUNDS - p.round;
    // For MY team, use the per-round strategy; all others use their random DNA
    const style = (team.id === MY_TEAM)
      ? (MY_STRATEGIES[myRoundStrategies[p.round - 1]] || dna[team.id])
      : dna[team.id];

    // ── Score each available player ────────────────────────────
    let best = null, bestScore = -9999;

    for (const pl of noisyPool) {
      if (used.has(pl.n.toLowerCase())) continue;
      const posHave = pc[pl.pos] || 0;
      const posLimit = (team.id === MY_TEAM && pl.pos === 'QB') ? 1 : (rosterLimits[pl.pos] || 8);
      if (posHave >= posLimit) continue;

      let score = pl.nVal; // randomized base value

      // ── Team DNA bonuses ──────────────────────────────────────
      if (pl.pos === 'RB') score += style.rbBonus;
      if (pl.pos === 'WR') score += style.wrBonus;
      if (pl.pos === 'QB') score += style.qbBonus;
      if (pl.pos === 'TE' && style.tePremium) score += 20;
      if (pl.pos === 'TE' && style.teBonus) score += (style.teBonus || 0);
      if (pl.pos === 'D/ST' && style.dstEarly) score += 60;
      if (pl.pos === 'K'   && style.kEarly)   score += 60;

      // ── Positional scarcity anxiety ───────────────────────────
      // If elite TEs are drying up, bump remaining TEs
      if (pl.pos === 'TE' && posDrafted['TE'] >= 4) score += 12;
      // Late QB run simulation
      if (pl.pos === 'QB' && posDrafted['QB'] >= 6 && (pc['QB']||0) === 0) score += 18;
      // RB scarcity in rounds 3+
      if (pl.pos === 'RB' && posDrafted['RB'] >= 14 && (pc['RB']||0) < 2) score += 15;

      // ── Need-based urgency ────────────────────────────────────
      const have = posHave;
      const min = (team.id === MY_TEAM && pl.pos === 'QB') ? 1 : (rosterMin[pl.pos] || 0);
      if (have < min) score += 55;
      // Extra urgency to hit the 4-RB / 4-WR floor before the pool thins
      if ((pl.pos === 'RB' || pl.pos === 'WR') && have < 4) {
        const need = 4 - have;
        if (remainingRounds <= need + 5) score += 30 * need;
      }
      if (pl.pos === 'QB' && style.qbEarly && have === 0 && p.round >= 4) score += 35;
      if (pl.pos === 'QB' && have === 0 && remainingRounds < 5) score += 40;
      if (pl.pos === 'K'   && have === 0 && remainingRounds < 3) score += 25;
      if (pl.pos === 'D/ST'&& have === 0 && remainingRounds < 4) score += 25;

      // ── Hard penalties: K and DST waaay too early ─────────────
      // Relax penalty for MY team if they've selected a DST/K strategy
      const myStrat = (team.id === MY_TEAM) ? (MY_STRATEGIES[myRoundStrategies[p.round - 1]] || {}) : {};
      if (pl.pos === 'K'    && p.round < 13 && !myStrat.kEarly)   score -= 300;
      if (pl.pos === 'D/ST' && p.round < 12 && !myStrat.dstEarly) score -= 250;
      // Avoid stacking same position too early
      if (pl.pos === 'QB' && have >= 1 && p.round < 10) score -= 80;
      if (pl.pos === 'QB' && have >= 2 && p.round < 14) score -= 150;

      if (score > bestScore) { bestScore = score; best = pl; }
    }

    if (!best) best = {n:'(No player available)', pos:'—', nVal:0};
    used.add(best.n.toLowerCase());
    pc[best.pos] = (pc[best.pos] || 0) + 1;
    posDrafted[best.pos] = (posDrafted[best.pos] || 0) + 1;
    roster.push({player:best.n, pos:best.pos, isKeeper:false});
    logEntries.push({pickNum:p.pickNum, team:team.id, player:best.n, pos:best.pos, isKeeper:false});
  });

  return {log: logEntries, rosters};
}

function _displayResults(logEntries, rosters) {
  const log = document.getElementById('sim-log');
  log.innerHTML = logEntries.map(r => {
    const label = getPickLabel(r.pickNum);
    const isMe  = r.team === MY_TEAM;
    const teamObj = TEAMS.find(t => t.id === r.team);
    const teamName = teamObj ? teamObj.name : r.team;
    return `<p class="${isMe?'log-my':r.isKeeper?'log-keeper':'log-pick'}">${label} <strong>${teamName}</strong>${r.isKeeper?' 🔒':''}: ${r.player} <span style="color:var(--muted);">${r.pos}</span></p>`;
  }).join('');
  log.scrollTop = log.scrollHeight;
  renderSimResults(rosters);
}

function renderSimResults(rosters) {
  const posOrder = ['QB','RB','WR','TE','D/ST','K'];
  const grid = document.getElementById('sim-team-grid');
  grid.innerHTML = TEAMS.map(t => {
    const roster = rosters[t.id] || [];
    const isMe   = t.id === MY_TEAM;
    const sorted = [...roster].sort((a,b) => {
      const ai = posOrder.indexOf(a.pos); const bi = posOrder.indexOf(b.pos);
      return (ai===-1?99:ai) - (bi===-1?99:bi);
    });
    return `<div class="sim-team-card ${isMe?'my-team':''}">
      <h4>${isMe?'⭐ ':''} ${t.teamName}<span style="font-size:0.7rem;font-weight:400;opacity:0.7;margin-left:5px;">${t.name}</span></h4>
      ${sorted.map(p => `<div class="sim-player"><span class="pos-badge ${p.pos.replace('/','')}">${p.pos}</span> ${p.player}${p.isKeeper?' <span class="keeper-tag">KEEP</span>':''}</div>`).join('')}
    </div>`;
  }).join('');

  document.getElementById('sim-results').classList.add('show');
  document.getElementById('sim-results').scrollIntoView({behavior:'smooth', block:'start'});
}

function resetMockDraft() {
  document.getElementById('sim-log').style.display = 'none';
  document.getElementById('sim-progress-bar').style.display = 'none';
  document.getElementById('sim-results').classList.remove('show');
  document.getElementById('sim-progress').style.width = '0%';
  renderMockConfig();
  renderMyStrategy();
}

// ============================================================
// INIT
// ============================================================
loadDraftState();
renderTeams();
renderKeepers();
renderMockConfig();
renderMyStrategy();

// ============================================================
// NFL DEPTH CHARTS DATA
// ============================================================
const NFL_TEAM_META = [
  ['Arizona Cardinals',    'ARI','NFC','West',  '#a51e36','🔴'],
  ['Atlanta Falcons',      'ATL','NFC','South', '#a71930','🔴'],
  ['Carolina Panthers',    'CAR','NFC','South', '#0085ca','🔵'],
  ['Chicago Bears',        'CHI','NFC','North', '#0b162a','🐻'],
  ['Dallas Cowboys',       'DAL','NFC','East',  '#003594','⭐'],
  ['Detroit Lions',        'DET','NFC','North', '#0076b6','🦁'],
  ['Green Bay Packers',    'GB', 'NFC','North', '#203731','🧀'],
  ['Los Angeles Rams',     'LAR','NFC','West',  '#003594','🐏'],
  ['Minnesota Vikings',    'MIN','NFC','North', '#4f2683','🟣'],
  ['New Orleans Saints',   'NO', 'NFC','South', '#d3bc8d','⚜️'],
  ['New York Giants',      'NYG','NFC','East',  '#0b2265','🔵'],
  ['Philadelphia Eagles',  'PHI','NFC','East',  '#004c54','🦅'],
  ['San Francisco 49ers',  'SF', 'NFC','West',  '#aa0000','🔴'],
  ['Seattle Seahawks',     'SEA','NFC','West',  '#002244','🦅'],
  ['Tampa Bay Buccaneers', 'TB', 'NFC','South', '#d50a0a','🏴‍☠️'],
  ['Washington Commanders','WAS','NFC','East',  '#5a1414','🇺🇸'],
  ['Baltimore Ravens',     'BAL','AFC','North', '#241773','🐦‍⬛'],
  ['Buffalo Bills',        'BUF','AFC','East',  '#00338d','🦬'],
  ['Cincinnati Bengals',   'CIN','AFC','North', '#fb4f14','🐯'],
  ['Cleveland Browns',     'CLE','AFC','North', '#311d00','🟤'],
  ['Denver Broncos',       'DEN','AFC','West',  '#fb4f14','🐴'],
  ['Houston Texans',       'HOU','AFC','South', '#03202f','🤠'],
  ['Indianapolis Colts',   'IND','AFC','South', '#002c5f','🐎'],
  ['Jacksonville Jaguars', 'JAX','AFC','South', '#006778','🐆'],
  ['Kansas City Chiefs',   'KC', 'AFC','West',  '#e31837','🏹'],
  ['Las Vegas Raiders',    'LV', 'AFC','West',  '#000000','🏴'],
  ['Los Angeles Chargers', 'LAC','AFC','West',  '#0080c6','⚡'],
  ['Miami Dolphins',       'MIA','AFC','East',  '#008e97','🐬'],
  ['New England Patriots', 'NE', 'AFC','East',  '#002244','🦅'],
  ['New York Jets',        'NYJ','AFC','East',  '#125740','✈️'],
  ['Pittsburgh Steelers',  'PIT','AFC','North', '#ffb612','⚫'],
  ['Tennessee Titans',     'TEN','AFC','South', '#0c2340','⚔️'],
];

// Raw player data by position group (index = team column)
const DC_QB = [
  ['Jacoby Brissett','Gardner Minshew','Carson Beck'],
  ['Michael Penix','Tua Tagovailoa','Trevor Siemian'],
  ['Bryce Young','Kenny Pickett','Will Grier'],
  ['Caleb Williams','Tyson Bagent','Case Keenum'],
  ['Dak Prescott','Joe Milton','Sam Howell'],
  ['Jared Goff','Teddy Bridgewater','Luke Altmyer'],
  ['Jordan Love','Tyrod Taylor','Kyle McCord'],
  ['Matthew Stafford','Ty Simpson','Stetson Bennett'],
  ['Kyler Murray','J.J. McCarthy','Carson Wentz'],
  ['Tyler Shough','Spencer Rattler','Zach Wilson'],
  ['Jaxon Dart','Jameis Winston','Brandon Allen'],
  ['Jalen Hurts','Andy Dalton','Tanner McKee'],
  ['Brock Purdy','Mac Jones','Kurtis Rourke'],
  ['Sam Darnold','Drew Lock','Jalen Milroe'],
  ['Baker Mayfield','Jake Browning','Connor Bazelak'],
  ['Jayden Daniels','Marcus Mariota','Athan Kaliakmanis'],
  ['Lamar Jackson','Tyler Huntley','Joe Fagnano'],
  ['Josh Allen','Kyle Allen','Shane Buechele'],
  ['Joe Burrow','Joe Flacco','Josh Johnson'],
  ['Deshaun Watson','Shedeur Sanders','Dillon Gabriel'],
  ['Bo Nix','Jarrett Stidham','Sam Ehlinger'],
  ['C.J. Stroud','Davis Mills','Graham Mertz'],
  ['Daniel Jones','Anthony Richardson','Riley Leonard'],
  ['Trevor Lawrence','Nick Mullens','Carter Bradley'],
  ['Patrick Mahomes','Justin Fields','Garrett Nussmeier'],
  ['Kirk Cousins',"Aidan O'Connell",'Fernando Mendoza'],
  ['Justin Herbert','Trey Lance','DJ Uiagalelei'],
  ['Malik Willis','Quinn Ewers','Cam Miller'],
  ['Drake Maye','Tommy DeVito','Behren Morton'],
  ['Geno Smith','Cade Klubnik','Brady Cook'],
  ['Aaron Rodgers','Mason Rudolph','Will Howard'],
  ['Cam Ward','Mitchell Trubisky','Will Levis'],
];

const DC_RB = [
  ['Jeremiyah Love','Tyler Allgeier','James Conner','Trey Benson','Bam Knight'],
  ['Bijan Robinson','Brian Robinson','Tyler Goodson','Nathan Carter','Cash Jones'],
  ['Chuba Hubbard','Jonathon Brooks','Trevor Etienne','AJ Dillon','Anthony Tyus'],
  ["D'Andre Swift",'Kyle Monangai','Roschon Johnson','Brittain Brown','Salvon Ahmed'],
  ['Javonte Williams','Malik Davis','Jaydon Blue','Phil Mafah','Israel Abanikanda'],
  ['Jahmyr Gibbs','Isiah Pacheco','Sione Vaki','Jacob Saylors','Jabari Small'],
  ['Josh Jacobs','Chris Brooks','MarShawn Lloyd','Pierre Strong','Damien Martinez'],
  ['Kyren Williams','Blake Corum','Ronnie Rivers','Jarquez Hunter','Jordan Waters'],
  ['Aaron Jones','Jordan Mason','Demond Claiborne','Zavier Scott','Kejon Owens'],
  ['Travis Etienne','Alvin Kamara','Devin Neal','Kendre Miller','Ty Chandler'],
  ['Cam Skattebo','Tyrone Tracy','Devin Singletary','Eric Gray','Dante Miller'],
  ['Saquon Barkley','Tank Bigsby','Will Shipley','Dameon Pierce','Elijah Mitchell'],
  ['Christian McCaffrey','Jordan James','Kaelon Black','Isaac Guerendo','Patrick Taylor'],
  ['Zach Charbonnet','Jadarian Price','Emanuel Wilson','George Holani','Kenny McIntosh'],
  ['Bucky Irving','Kenneth Gainwell','Sean Tucker','Josh Williams','Kadarius Calloway'],
  ['Jacory Croskey-Merritt','Rachaad White','Kaytron Allen','Jerome Ford','Jeremy McNichols'],
  ['Derrick Henry','Justice Hill','Rasheen Ali','Adam Randall','Dontae McMillan'],
  ['James Cook','Ty Johnson','Ray Davis','Frank Gore','Desmond Reid'],
  ['Chase Brown','Samaje Perine','Tahj Brooks','Gary Brightwell','Kendall Milton'],
  ['Quinshon Judkins','Dylan Sampson','Raheim Sanders','Ahmani Marshall','Davon Booth'],
  ['J.K. Dobbins','RJ Harvey','Jonah Coleman','Jaleel McLaughlin','Tyler Badie'],
  ['David Montgomery','Woody Marks','Jawhar Jordan','British Brooks','Noah Whittington'],
  ['Jonathan Taylor','DJ Giddens','Seth McGowan','Ulysses Bentley','Lincoln Pare'],
  ['Bhayshul Tuten','Chris Rodriguez','LeQuint Allen','Ameer Abdullah','DeeJay Dallas'],
  ['Kenneth Walker','Emmett Johnson','Emari Demercado','Brashard Smith','Jaydn Ott'],
  ['Ashton Jeanty','Mike Washington','Dylan Laube','Chris Collier','Roman Hemby'],
  ['Omarion Hampton','Keaton Mitchell','Kimani Vidal','Jaret Patterson','Amar Johnson'],
  ["De'Von Achane",'Jaylen Wright','Ollie Gordon','Donovan Edwards','Carlos Washington'],
  ['Rhamondre Stevenson','TreVeyon Henderson','Jam Miller','Terrell Jennings','Lan Larison'],
  ['Breece Hall','Braelon Allen','Isaiah Davis','Kene Nwangwu','Sam Scott'],
  ['Jaylen Warren','Rico Dowdle','Kaleb Johnson','Eli Heidenreich','Travis Homer'],
  ['Tony Pollard','Tyjae Spears','Nicholas Singleton','Michael Carter','Kalel Mullings'],
];

const DC_WR = [
  ['Marvin Harrison','Michael Wilson','Kendrick Bourne','Xavier Weaver','Devin Duvernay','Reggie Virgil','Simi Fehoko'],
  ['Drake London','Jahan Dotson','Olamide Zaccheaus','Zachariah Branch','Casey Washington','Dylan Drummond','Vinny Anthony'],
  ['Tetairoa McMillan','Jalen Coker','Xavier Legette','Chris Brazzell','Jimmy Horn','John Metchie','Brycen Tremayne'],
  ['Rome Odunze','Luther Burden','Kalif Raymond','Zavion Thomas','Jahdae Walker','Scotty Miller','Maurice Alexander'],
  ['CeeDee Lamb','George Pickens','Ryan Flournoy','KaVontae Turpin','Marquez Valdes-Scantling','Jonathan Mingo','Tyler Johnson'],
  ['Amon-Ra St. Brown','Jameson Williams','Isaac TeSlaa','Greg Dortch','Cedrick Wilson','Tom Kennedy','Dominic Lovett'],
  ['Christian Watson','Jayden Reed','Matthew Golden','Savion Williams','Bo Melton','Skyy Moore','Will Sheppard'],
  ['Puka Nacua','Davante Adams','Jordan Whittington','Konata Mumpfield','CJ Daniels','Xavier Smith','Tyler Scott'],
  ['Justin Jefferson','Jordan Addison','Jauan Jennings','Tai Felton','Jeshaun Jones','Myles Price','Dontae Fleming'],
  ['Chris Olave','Jordyn Tyson','Devaughn Vele','Mason Tipton','Bryce Lance','Barion Brown','Bub Means'],
  ['Malik Nabers','Darius Slayton','Darnell Mooney','Calvin Austin','Malachi Fields','Isaiah Hodgins','Odell Beckham'],
  ["DeVonta Smith",'Makai Lemon','Dontayvion Wicks','Hollywood Brown',"De'Zhaun Stribling",'Darius Cooper','Johnny Wilson'],
  ['Mike Evans','Ricky Pearsall','Christian Kirk','Tory Horton','Demarcus Robinson','Jordan Watkins','Jacob Cowing'],
  ['Jaxon Smith-Njigba','Cooper Kupp','Rashid Shaheed','Tory Horton','Jake Bobo','Emmanuel Henderson','Cody White'],
  ['Chris Godwin','Emeka Egbuka','Jalen McMillan','Ted Hurst','Tez Johnson','Kameron Johnson','David Sills'],
  ['Terry McLaurin','Luke McCaffrey','Antonio Williams','Treylon Burks','Dyami Brown','Jaylin Lane','Van Jefferson'],
  ['Zay Flowers','Rashod Bateman','Devontez Walker',"Ja'Kobi Lane",'Elijah Sarratt','LaJohntay Wester','Dayton Wade'],
  ['DJ Moore','Khalil Shakir','Joshua Palmer','Keon Coleman','Skyler Bell','Tyrell Shavers','Mecole Hardman'],
  ["Ja'Marr Chase",'Tee Higgins','Andrei Iosivas','Colbie Young','Mitchell Tinsley','Charlie Jones',"Ke'Shawn Williams"],
  ['Jerry Jeudy','KC Concepcion','Denzel Boston','Cedric Tillman','Isaiah Bond','Tylan Wallace','Malachi Corley'],
  ['Courtland Sutton','Jaylen Waddle','Troy Franklin','Pat Bryant','Marvin Mims',"Lil'Jordan Humphrey",'Michael Bandy'],
  ['Nico Collins','Jayden Higgins','Tank Dell','Xavier Hutchinson','Jaylin Noel','Justin Watson','Lewis Bond'],
  ['Alec Pierce','Josh Downs','Nick Westbrook-Ikhine','Ashton Dulin','Deion Burks','Anthony Gould','Laquon Treadwell'],
  ['Brian Thomas','Jakobi Meyers','Parker Washington','Travis Hunter','Josh Cameron','C.J. Williams','Tim Jones'],
  ['Rashee Rice','Xavier Worthy','Tyquan Thornton','Jalen Royals','Cyrus Allen','Nikko Remigio','Jason Brownlee'],
  ['Tre Tucker','Jalen Nailor','Jack Bech',"Dont'e Thornton",'Malik Benson','Dareke Young','Shedrick Jackson'],
  ['Ladd McConkey','Quentin Johnston',"Tre' Harris",'Brenen Thompson','KeAndre Lambert-Smith','Derius Davis','Dalevon Campbell'],
  ['Malik Washington','Jalen Tolbert','Tutu Atwell','Caleb Douglas','Chris Bell','Kevin Coleman','Theo Wease'],
  ['A.J. Brown','Romeo Doubs','Kayshon Boutte','Mack Hollins','DeMario Douglas','Kyle Williams','Efton Chism'],
  ['Garrett Wilson','Adonai Mitchell','Omar Cooper','Tim Patrick','Isaiah Williams','Arian Smith','Jamaal Pritchett'],
  ['DK Metcalf','Michael Pittman',"Wan'Dale Robinson",'Germie Bernard','Roman Wilson','Ben Skowronek','A.T. Perry'],
  ['Carnell Tate','Calvin Ridley','Elic Ayomanor','Bryce Oliver','Chimere Dike','Mason Kinsey',''],
];

const DC_TE = [
  ['Trey McBride','Tip Reiman','Elijah Higgins'],
  ['Kyle Pitts','Austin Hooper','Charlie Woerner'],
  ['Tommy Tremble',"Ja'Tavion Sanders",'Mitchell Evans'],
  ['Colston Loveland','Cole Kmet','Sam Roush'],
  ['Jake Ferguson','Luke Schoonmaker','Brevyn Spann-Ford'],
  ['Sam LaPorta','Brock Wright','Tyler Conklin'],
  ['Tucker Kraft','Luke Musgrave','Josh Whyle'],
  ['Colby Parkinson','Tyler Higbee','Terrance Ferguson'],
  ['T.J. Hockenson','Josh Oliver','Ben Yurosek'],
  ['Juwan Johnson','Noah Fant','Oscar Delp'],
  ['Isaiah Likely','Theo Johnson','Chris Manhertz'],
  ['Dallas Goedert','Eli Stowers','Grant Calcaterra'],
  ['George Kittle','Jake Tonges','Luke Farrell'],
  ['AJ Barner','Elijah Arroyo','Eric Saubert'],
  ['Cade Otton','Payne Durham','Ko Kieft'],
  ['Chig Okonkwo','John Bates','Ben Sinnott'],
  ['Mark Andrews','Durham Smythe','Matthew Hibner'],
  ['Dalton Kincaid','Dawson Knox','Jackson Hawes'],
  ['Mike Gesicki','Drew Sample','Erick All'],
  ['Harold Fannin','Jack Stoll','Joe Royer'],
  ['Evan Engram','Adam Trautman','Justin Joly'],
  ['Dalton Schultz','Foster Moreau','Marlin Klein'],
  ['Tyler Warren','Mo Alie-Cox','Drew Ogletree'],
  ['Brenton Strange','Nate Boerkircher','Tanner Koziol'],
  ['Travis Kelce','Noah Gray','Jared Wiley'],
  ['Brock Bowers','Michael Mayer','Ian Thomas'],
  ['Oronde Gadsden','David Njoku','Charlie Kolar'],
  ['Greg Dulcich','Will Kacmarek','Seydou Traore'],
  ['Hunter Henry','Eli Raridon','CJ Dippre'],
  ['Kenyon Sadiq','Mason Taylor','Jeremy Ruckert'],
  ['Pat Freiermuth','Darnell Washington','Robert Tonyan'],
  ['Gunnar Helm','Daniel Bellinger','Kylen Granson'],
];

const DC_K = [
  'Chad Ryland','Nick Folk','Ryan Fitzgerald','Cairo Santos','Brandon Aubrey','Jake Bates',
  'Trey Smack','Harrison Mevis','Will Reichard','Charlie Smyth','Ben Sauls','Jake Elliott',
  'Eddy Pineiro','Jason Myers','Chase McLaughlin','Jake Moody','Tyler Loop','Tyler Bass',
  'Evan McPherson','Andre Szmyt','Wil Lutz',"Ka'imi Fairbairn",'Blake Grupe','Cam Little',
  'Harrison Butker','Matt Gay','Cameron Dicker','Riley Patterson','Andy Borregales',
  'Jason Sanders','Chris Boswell','Joey Slye',
];

const DC_FA = {
  QB:  ['Jimmy Garoppolo','Russell Wilson','Desmond Ridder'],
  RB:  ['Nick Chubb','Kareem Hunt','Najee Harris','Gus Edwards','Zack Moss'],
  WR:  ['Stefon Diggs','Tyreek Hill','Keenan Allen','Amari Cooper','Deebo Samuel','Diontae Johnson','Tyler Lockett'],
  TE:  ['Jonnu Smith','Darren Waller','Zach Ertz'],
  K:   ['Younghoe Koo'],
};

// Build structured team objects
const NFL_DEPTH = NFL_TEAM_META.map((meta, i) => ({
  name:   meta[0],
  abbr:   meta[1],
  conf:   meta[2],
  div:    meta[3],
  color:  meta[4],
  emoji:  meta[5],
  QBs:    DC_QB[i].filter(Boolean),
  RBs:    DC_RB[i].filter(Boolean),
  WRs:    DC_WR[i].filter(Boolean),
  TEs:    DC_TE[i].filter(Boolean),
  DST:    meta[0] + ' D/ST',
  K:      DC_K[i],
}));

// ============================================================
// Build draft pool from NFL depth charts
function buildPoolFromDepthCharts() {
  const pv = {};
  PLAYER_POOL.forEach(p => { pv[p.n.toLowerCase()] = p.val; });

  const rankVals = {
    QB: [72, 42, 18, 10],
    RB: [80, 58, 38, 22, 12, 6],
    WR: [75, 58, 42, 28, 16,  8, 4],
    TE: [65, 35, 15,  8],
  };

  const pool = [];
  const seen = new Set();

  NFL_DEPTH.forEach(team => {
    [['QBs','QB'],['RBs','RB'],['WRs','WR'],['TEs','TE']].forEach(([grp, pos]) => {
      team[grp].forEach((name, rank) => {
        if (!name) return;
        const key = name.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        const val = pv[key] !== undefined ? pv[key] : (rankVals[pos][rank] !== undefined ? rankVals[pos][rank] : 3);
        pool.push({ n: name, pos, val });
      });
    });
    if (!seen.has(team.DST.toLowerCase())) {
      seen.add(team.DST.toLowerCase());
      pool.push({ n: team.DST, pos: 'D/ST', val: pv[team.DST.toLowerCase()] !== undefined ? pv[team.DST.toLowerCase()] : 28 });
    }
    if (team.K && !seen.has(team.K.toLowerCase())) {
      seen.add(team.K.toLowerCase());
      pool.push({ n: team.K, pos: 'K', val: pv[team.K.toLowerCase()] !== undefined ? pv[team.K.toLowerCase()] : 28 });
    }
  });

  Object.entries(DC_FA).forEach(([pos, players]) => {
    players.forEach(name => {
      if (!name) return;
      const key = name.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      pool.push({ n: name, pos, val: pv[key] !== undefined ? pv[key] : 20 });
    });
  });

  return pool;
}


let depthFilter = 'all';
let depthSearch = '';

function setDepthFilter(f, btn) {
  depthFilter = f;
  document.querySelectorAll('.depth-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderDepthCharts();
}

function filterDepth() {
  depthSearch = document.getElementById('depth-search').value.trim().toLowerCase();
  renderDepthCharts();
}

function rankClass(i) {
  if (i === 0) return 'r1';
  if (i === 1) return 'r2';
  if (i === 2) return 'r3';
  return 'r4';
}

function renderDepthCharts() {
  const grid = document.getElementById('depth-grid');
  const search = depthSearch;

  // Filter teams
  const filtered = NFL_DEPTH.filter(t => {
    if (depthFilter === 'all') return true;
    if (depthFilter === 'FA') return false;
    if (depthFilter === 'NFC' || depthFilter === 'AFC') return t.conf === depthFilter;
    return (t.conf + ' ' + t.div) === depthFilter;
  });

  let matchCount = 0;

  const cards = filtered.map(t => {
    // Check if search matches this team
    const allPlayers = [...t.QBs, ...t.RBs, ...t.WRs, ...t.TEs, t.K, t.DST];
    const teamMatches = search ? allPlayers.some(p => p && p.toLowerCase().includes(search)) : true;
    if (!teamMatches && search) return `<div class="depth-card hidden" data-team="${t.abbr}"></div>`;

    function playerRow(player, idx) {
      if (!player) return '';
      const rc = rankClass(idx);
      const hl = search && player.toLowerCase().includes(search);
      if (hl) matchCount++;
      return `<div class="depth-player">
        <span class="depth-rank ${rc}">${idx+1}</span>
        <span class="depth-player-name ${rc}${hl?' highlight':''}">${player}</span>
      </div>`;
    }

    const kHl = search && t.K && t.K.toLowerCase().includes(search);
    const dstHl = search && t.DST.toLowerCase().includes(search);
    if (kHl) matchCount++;
    if (dstHl) matchCount++;

    return `
    <div class="depth-card" data-team="${t.abbr}" data-conf="${t.conf}" data-div="${t.conf} ${t.div}">
      <div class="depth-card-header" style="background:linear-gradient(135deg,${t.color}44,transparent);">
        <div class="team-logo-placeholder" style="background:${t.color}33;color:${t.color === '#000000' ? '#fff' : t.color};font-size:0.85rem;font-weight:900;">${t.abbr}</div>
        <div>
          <h3>${t.emoji} ${t.name}</h3>
          <div class="conf-badge">${t.conf} ${t.div}</div>
        </div>
      </div>
      <div class="depth-pos-section">
        <div class="depth-pos-label">QB</div>
        ${t.QBs.map((p,i) => playerRow(p,i)).join('')}
      </div>
      <div class="depth-pos-section">
        <div class="depth-pos-label">RB</div>
        ${t.RBs.map((p,i) => playerRow(p,i)).join('')}
      </div>
      <div class="depth-pos-section">
        <div class="depth-pos-label">WR</div>
        ${t.WRs.map((p,i) => playerRow(p,i)).join('')}
      </div>
      <div class="depth-pos-section">
        <div class="depth-pos-label">TE</div>
        ${t.TEs.map((p,i) => playerRow(p,i)).join('')}
      </div>
      <div class="depth-pos-section">
        <div class="depth-pos-label">K</div>
        <div class="depth-player">
          <span class="depth-rank r1">1</span>
          <span class="depth-player-name r1${kHl?' highlight':''}">${t.K}</span>
        </div>
      </div>
      <div class="depth-pos-section">
        <div class="depth-pos-label">D/ST</div>
        <div class="depth-player">
          <span class="depth-rank r1">1</span>
          <span class="depth-player-name r1${dstHl?' highlight':''}">${t.name} D/ST</span>
        </div>
      </div>
    </div>`;
  });

  // Free Agents section
  let faSection = '';
  if (depthFilter === 'all' || depthFilter === 'FA') {
    const faMatches = search ? Object.values(DC_FA).flat().some(p => p.toLowerCase().includes(search)) : true;
    if (faMatches || !search) {
      faSection = `<div class="fa-section" style="grid-column:1/-1;">
        <h3>🆓 Best Available Free Agents</h3>
        <div class="fa-grid">
          ${Object.entries(DC_FA).map(([pos, players]) => `
            <div class="fa-pos-group">
              <h4>${pos}</h4>
              ${players.map((p,i) => {
                const hl = search && p.toLowerCase().includes(search);
                if (hl) matchCount++;
                return `<div class="fa-player ${i===0?'r1':''}${hl?' highlight':''}">${i+1}. ${p}</div>`;
              }).join('')}
            </div>`).join('')}
        </div>
      </div>`;
    }
  }

  grid.innerHTML = cards.join('') + faSection;

  // Update match count
  const countEl = document.getElementById('depth-match-count');
  if (search) {
    countEl.textContent = `${matchCount} player match${matchCount !== 1 ? 'es' : ''} found for "${depthSearch}"`;
    countEl.style.color = matchCount > 0 ? '#4ade80' : '#f87171';
  } else {
    countEl.textContent = `Showing ${filtered.length} team${filtered.length !== 1 ? 's' : ''}`;
    countEl.style.color = 'var(--muted)';
  }
}

// ============================================================
// Responsive two-col
const twoCol = document.querySelector('.two-col');
if (twoCol) {
  const style = document.createElement('style');
  style.textContent = '@media(max-width:700px){.two-col{grid-template-columns:1fr!important}}';
  document.head.appendChild(style);}
