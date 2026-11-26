export type TopicId =
  | 'space'
  | 'body'
  | 'history'
  | 'psychology'
  | 'money'
  | 'physics'
  | 'coding'
  | 'nature'
  | 'geography'
  | 'art';

export interface Topic {
  id: TopicId;
  name: string;
  emoji: string;
  /** two-stop gradient used for card backgrounds */
  colors: [string, string];
  /** Wikipedia search queries used to generate endless content for this topic */
  queries: string[];
}

export interface FactCard {
  kind: 'fact';
  id: string;
  topic: TopicId;
  title: string;
  hook?: string;
  body: string;
  image?: string;
  url?: string;
  source?: string;
}

export interface QuizCard {
  kind: 'quiz';
  id: string;
  topic: TopicId;
  question: string;
  options: string[];
  answer: number;
  explain?: string;
}

export type Card = FactCard | QuizCard;

export const TOPICS: Topic[] = [
  {
    id: 'space',
    name: 'Space',
    emoji: '🪐',
    colors: ['#1b1464', '#6a11cb'],
    queries: ['planet', 'galaxy', 'nebula', 'space mission', 'exoplanet', 'black hole', 'moon of Jupiter', 'astronomer'],
  },
  {
    id: 'body',
    name: 'Human Body',
    emoji: '🫀',
    colors: ['#8e0e00', '#e94057'],
    queries: ['human anatomy organ', 'hormone', 'immune system', 'human brain region', 'bone human skeleton', 'vitamin'],
  },
  {
    id: 'history',
    name: 'History',
    emoji: '🏛️',
    colors: ['#5c3d0e', '#c79a3a'],
    queries: ['ancient civilization', 'empire history', 'medieval battle', 'archaeological site', 'revolution history', 'ancient city'],
  },
  {
    id: 'psychology',
    name: 'Psychology',
    emoji: '🧠',
    colors: ['#3a1c71', '#d76d77'],
    queries: ['cognitive bias', 'psychological effect', 'psychology experiment', 'memory psychology', 'social psychology phenomenon'],
  },
  {
    id: 'money',
    name: 'Money',
    emoji: '💸',
    colors: ['#0f5132', '#2bb673'],
    queries: ['economic concept', 'personal finance', 'stock market', 'financial crisis', 'currency history', 'investment strategy'],
  },
  {
    id: 'physics',
    name: 'Physics',
    emoji: '⚛️',
    colors: ['#003973', '#00a6c4'],
    queries: ['physics phenomenon', 'quantum mechanics', 'thermodynamics', 'physical law', 'particle physics', 'optics phenomenon'],
  },
  {
    id: 'coding',
    name: 'Coding',
    emoji: '💻',
    colors: ['#141e30', '#3a7bd5'],
    queries: ['programming language', 'algorithm', 'data structure', 'software design pattern', 'computer science concept'],
  },
  {
    id: 'nature',
    name: 'Animals & Nature',
    emoji: '🐙',
    colors: ['#134e5e', '#71b280'],
    queries: ['animal behavior', 'deep sea creature', 'endangered species', 'bird species', 'insect', 'rainforest plant'],
  },
  {
    id: 'geography',
    name: 'Geography',
    emoji: '🌍',
    colors: ['#0b486b', '#f56217'],
    queries: ['island nation', 'mountain range', 'river', 'desert', 'volcano', 'unusual border'],
  },
  {
    id: 'art',
    name: 'Art & Culture',
    emoji: '🎨',
    colors: ['#4a00e0', '#ff6a88'],
    queries: ['famous painting', 'art movement', 'sculpture', 'architect', 'renaissance artist', 'mythology'],
  },
];

export const topicById = (id: TopicId) => TOPICS.find((t) => t.id === id)!;

const f = (topic: TopicId, n: number, title: string, hook: string, body: string): FactCard => ({
  kind: 'fact',
  id: `c-${topic}-${n}`,
  topic,
  title,
  hook,
  body,
  source: 'EduScroll',
});

const q = (topic: TopicId, n: number, question: string, options: string[], answer: number, explain: string): QuizCard => ({
  kind: 'quiz',
  id: `q-${topic}-${n}`,
  topic,
  question,
  options,
  answer,
  explain,
});

/** Hand-written starter content. Endless content is pulled from Wikipedia on top of this. */
export const CURATED: Card[] = [
  // Space
  f('space', 1, 'A day on Venus is longer than its year', 'Venus spins painfully slowly.', 'Venus takes about 243 Earth days to rotate once, but only about 225 Earth days to orbit the Sun. It also spins backwards compared with most planets, so the Sun rises in the west.'),
  f('space', 2, 'Neutron stars are absurdly dense', 'A teaspoon would weigh billions of tonnes.', 'When a massive star collapses, its core can crush into a neutron star about 20 km across with more mass than the Sun. A sugar-cube-sized piece would weigh roughly as much as all of humanity.'),
  f('space', 3, 'You are looking at the past', 'Light takes time to reach you.', 'Sunlight is about 8 minutes old when it hits your eyes. Light from the Andromeda Galaxy left it about 2.5 million years ago — before modern humans existed.'),
  f('space', 4, 'Footprints on the Moon could last millions of years', 'No wind, no rain.', 'The Moon has almost no atmosphere, so there is no weather to erase the Apollo astronauts’ bootprints. Micrometeorite impacts will slowly wear them away, but only over enormous timescales.'),
  q('space', 1, 'Which planet has the most known moons (as of the mid-2020s)?', ['Jupiter', 'Saturn', 'Uranus', 'Neptune'], 1, 'Saturn overtook Jupiter after waves of new small moons were confirmed in 2023 and 2025 — it now has well over 200.'),
  q('space', 2, 'Roughly how long does sunlight take to reach Earth?', ['8 seconds', '8 minutes', '8 hours', '8 days'], 1, 'At ~150 million km away, light needs about 8 minutes 20 seconds.'),

  // Body
  f('body', 1, 'Your stomach lining renews itself every few days', 'Acid would digest it otherwise.', 'Stomach acid is strong enough to dissolve metal over time. A protective mucus layer and rapidly replaced cells keep your stomach from digesting itself.'),
  f('body', 2, 'You have more bacterial cells than you think', 'Roughly one-to-one.', 'The old claim was 10 bacteria for every human cell. Newer estimates put it closer to 1:1 — around 38 trillion bacteria alongside ~30 trillion human cells.'),
  f('body', 3, 'Your brain runs on about 20 watts', 'Less than a light bulb.', 'Despite being ~2% of body weight, the brain uses about 20% of your resting energy — yet that’s only around 20 watts of power.'),
  f('body', 4, 'Bones are stronger than steel — by weight', 'Light, flexible, self-repairing.', 'Pound for pound, bone can resist compression better than many steels, and unlike steel it constantly rebuilds itself. Your skeleton is largely replaced over roughly a decade.'),
  q('body', 1, 'Which is the largest organ of the human body?', ['Liver', 'Brain', 'Skin', 'Lungs'], 2, 'Skin covers about 2 square metres and makes up roughly 15% of body weight.'),
  q('body', 2, 'Which blood cells carry oxygen?', ['White blood cells', 'Red blood cells', 'Platelets', 'Plasma cells'], 1, 'Red blood cells are packed with haemoglobin, which binds oxygen.'),

  // History
  f('history', 1, 'Cleopatra lived closer to the Moon landing than to the Great Pyramid', 'Ancient Egypt was very long.', 'The Great Pyramid of Giza was built around 2560 BCE. Cleopatra lived around 69–30 BCE — about 2,500 years later. The Moon landing was ~2,000 years after her.'),
  f('history', 2, 'Oxford University is older than the Aztec Empire', 'Timelines overlap in surprising ways.', 'Teaching at Oxford existed by 1096. Tenochtitlan, the Aztec capital, was founded in 1325.'),
  f('history', 3, 'The shortest war lasted under an hour', 'The Anglo-Zanzibar War, 1896.', 'Britain and the Sultanate of Zanzibar fought a war that lasted roughly 38–45 minutes before Zanzibar surrendered.'),
  f('history', 4, 'Romans used concrete that heals itself', 'Lime clasts are the secret.', 'Roman concrete contains small lumps of lime. When cracks let in water, the lime dissolves and recrystallises, sealing the crack — part of why some structures have stood for 2,000 years.'),
  q('history', 1, 'Which empire built Machu Picchu?', ['Aztec', 'Maya', 'Inca', 'Olmec'], 2, 'The Inca built it in the 15th century, likely as an estate for emperor Pachacuti.'),
  q('history', 2, 'In which year did the Berlin Wall fall?', ['1961', '1979', '1989', '1991'], 2, 'It fell on 9 November 1989.'),

  // Psychology
  f('psychology', 1, 'The spotlight effect', 'People notice you far less than you think.', 'In a famous study, students wearing an embarrassing T-shirt guessed about half the room would notice. Only around a quarter actually did.'),
  f('psychology', 2, 'The Zeigarnik effect', 'Unfinished tasks stick in your head.', 'We tend to remember interrupted or incomplete tasks better than completed ones. Cliffhangers exploit this — and so can you: start a task for 2 minutes and your brain will nag you to finish it.'),
  f('psychology', 3, 'Spaced repetition beats cramming', 'Forgetting is part of learning.', 'Reviewing material at increasing intervals (1 day, 3 days, a week…) produces far stronger long-term memory than the same time spent in one session.'),
  f('psychology', 4, 'The Dunning–Kruger effect', 'Low skill can hide itself.', 'People with limited knowledge in a domain often overestimate their competence, partly because the skills needed to do something well are the same skills needed to judge it.'),
  q('psychology', 1, 'Tending to favour information that supports what you already believe is called…', ['Anchoring', 'Confirmation bias', 'Hindsight bias', 'Halo effect'], 1, 'Confirmation bias shapes what we search for, notice and remember.'),
  q('psychology', 2, 'Which learning technique is best supported for long-term retention?', ['Re-reading notes', 'Highlighting', 'Spaced retrieval practice', 'Cramming'], 2, 'Testing yourself, spaced over time, consistently outperforms passive review.'),

  // Money
  f('money', 1, 'Compound interest snowballs', 'Time matters more than amount.', 'At 7% a year, money doubles about every 10 years (the Rule of 72: 72 ÷ 7 ≈ 10). Investing early gives compounding more doubling periods to work.'),
  f('money', 2, 'Inflation quietly shrinks cash', '3% a year adds up.', 'At 3% inflation, prices roughly double in 24 years. Cash under a mattress loses about half its purchasing power over that time.'),
  f('money', 3, 'Index funds beat most stock pickers', 'Low fees, broad market.', 'Over 15-year periods, the large majority of actively managed US large-cap funds underperform the S&P 500 index after fees.'),
  f('money', 4, 'The 50/30/20 budget', 'A simple starting rule.', 'Spend ~50% of after-tax income on needs, ~30% on wants, and ~20% on saving and paying down debt. Tweak the ratios to fit your life.'),
  q('money', 1, 'Using the Rule of 72, how long to double money at 6% a year?', ['6 years', '12 years', '18 years', '72 years'], 1, '72 ÷ 6 = 12 years.'),
  q('money', 2, 'What does diversification mainly reduce?', ['Fees', 'Taxes', 'Risk from any single investment', 'Inflation'], 2, 'Spreading money across many assets limits the damage any one can do.'),

  // Physics
  f('physics', 1, 'Time runs faster on a mountain', 'Gravity slows clocks.', 'General relativity predicts — and atomic clocks confirm — that clocks closer to Earth’s mass tick more slowly. GPS satellites must correct for this or drift by kilometres a day.'),
  f('physics', 2, 'Atoms are almost entirely empty', 'If the nucleus were a marble…', '…the atom would be the size of a football stadium. Nearly all the mass sits in the tiny nucleus.'),
  f('physics', 3, 'Hot water can freeze faster than cold', 'The Mpemba effect.', 'Under some conditions, warmer water appears to freeze first. Evaporation, convection and dissolved gases have been proposed as causes, and it’s still debated.'),
  f('physics', 4, 'Why the sky is blue', 'Rayleigh scattering.', 'Air molecules scatter shorter (blue) wavelengths of sunlight much more than longer (red) ones, so blue light reaches your eyes from every direction of the sky.'),
  q('physics', 1, 'What is the approximate speed of light in a vacuum?', ['300 km/s', '300,000 km/s', '3,000,000 km/s', '30,000 km/s'], 1, 'About 299,792 km per second.'),
  q('physics', 2, 'Which force keeps planets in orbit around the Sun?', ['Magnetism', 'Friction', 'Gravity', 'The strong force'], 2, 'Gravity provides the centripetal pull for orbits.'),

  // Coding
  f('coding', 1, 'The first "computer bug" was a real moth', 'Harvard Mark II, 1947.', 'Engineers found a moth stuck in a relay and taped it into the log book: "First actual case of bug being found." The term "bug" for faults was already in use, but this made it famous.'),
  f('coding', 2, 'Binary search halves the problem', 'O(log n) is powerful.', 'To find an item in a sorted list of 1 billion entries, binary search needs at most about 30 comparisons, because each step cuts the remaining range in half.'),
  f('coding', 3, 'Hash maps trade memory for speed', 'Near-instant lookups.', 'A hash function turns a key into an array index, so lookups take roughly constant time on average no matter how many items you store.'),
  f('coding', 4, 'Git stores snapshots, not diffs', 'Every commit is a full picture.', 'Each Git commit points to a tree representing the whole project. Unchanged files are just references to existing blobs, so it stays compact.'),
  q('coding', 1, 'What does "HTML" stand for?', ['HyperText Markup Language', 'High Transfer Machine Language', 'Hyperlink Text Mode Layout', 'Home Tool Markup Language'], 0, 'HTML describes the structure of web pages.'),
  q('coding', 2, 'Which data structure is Last-In, First-Out?', ['Queue', 'Stack', 'Linked list', 'Heap'], 1, 'A stack — like a pile of plates.'),

  // Nature
  f('nature', 1, 'Octopuses have three hearts', 'And blue blood.', 'Two hearts pump blood through the gills, one pumps it to the body. Their blood uses copper-based haemocyanin, which turns it blue.'),
  f('nature', 2, 'Trees talk through fungi', 'The "wood wide web".', 'Mycorrhizal fungi connect tree roots underground, moving water, nutrients and chemical signals between plants. How much trees "help" each other this way is still actively researched.'),
  f('nature', 3, 'Tardigrades can survive space', 'Tiny, nearly indestructible.', 'These half-millimetre animals can dry out into a dormant "tun" state and survive extreme cold, radiation and even the vacuum of space.'),
  f('nature', 4, 'Crows recognise human faces', 'And they hold grudges.', 'In studies, crows remembered masks worn by researchers who trapped them and scolded those faces for years — even teaching other crows to do the same.'),
  q('nature', 1, 'Which is the largest animal ever known to have lived?', ['African elephant', 'Blue whale', 'Argentinosaurus', 'Megalodon'], 1, 'Blue whales reach ~30 m and up to ~190 tonnes.'),
  q('nature', 2, 'How do bees tell hive-mates where flowers are?', ['Scent trails only', 'A waggle dance', 'Buzzing pitch', 'They don’t'], 1, 'The angle and duration of the waggle dance encode direction and distance.'),

  // Geography
  f('geography', 1, 'Russia spans 11 time zones', 'Breakfast in the west, dinner in the east.', 'From Kaliningrad to Kamchatka, Russia stretches across 11 time zones — more than any other country’s contiguous territory.'),
  f('geography', 2, 'Most of Canada’s people live near the US border', 'A thin ribbon of population.', 'Roughly two-thirds of Canadians live within about 100 km of the US border, largely because of climate and history.'),
  f('geography', 3, 'Africa is enormous', 'Maps shrink it.', 'The Mercator projection inflates areas near the poles. Africa is about 30 million km² — big enough to fit the USA, China, India and much of Europe inside it.'),
  f('geography', 4, 'The Dead Sea is the lowest land on Earth', 'Over 430 m below sea level.', 'Its shoreline is the lowest exposed land on the planet, and its water is so salty you float effortlessly.'),
  q('geography', 1, 'Which is the longest river in South America?', ['Paraná', 'Orinoco', 'Amazon', 'Magdalena'], 2, 'The Amazon also carries more water than any other river on Earth.'),
  q('geography', 2, 'Which country has the most natural lakes?', ['Finland', 'Canada', 'Russia', 'USA'], 1, 'Canada has over half of the world’s natural lakes.'),

  // Art
  f('art', 1, 'The Mona Lisa became famous after being stolen', '1911 heist.', 'An Italian handyman walked out of the Louvre with it. The two-year search made headlines worldwide and turned the painting into a global icon.'),
  f('art', 2, 'Van Gogh sold very few paintings in his lifetime', 'Recognition came later.', 'Van Gogh produced around 900 paintings in about a decade but had little commercial success while alive; his fame grew after his death in 1890.'),
  f('art', 3, 'Michelangelo painted the Sistine ceiling standing up', 'Not lying on his back.', 'He worked on a scaffold he designed, standing and craning his neck for about four years (1508–1512), and wrote a comic poem about the pain.'),
  f('art', 4, 'Ultramarine was worth more than gold', 'Ground from lapis lazuli.', 'Renaissance blue pigment came from lapis mined in Afghanistan. It was so costly that contracts specified how much a painter could use — often reserved for the Virgin Mary’s robes.'),
  q('art', 1, 'Who painted "The Starry Night"?', ['Claude Monet', 'Vincent van Gogh', 'Salvador Dalí', 'Edvard Munch'], 1, 'Van Gogh painted it in 1889 at the asylum in Saint-Rémy.'),
  q('art', 2, 'Cubism was pioneered by Picasso and…', ['Georges Braque', 'Henri Matisse', 'Paul Cézanne', 'Joan Miró'], 0, 'Picasso and Braque developed Cubism around 1907–1914.'),
];
