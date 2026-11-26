export type TopicId = 'dsa' | 'sysdesign' | 'fullstack';

export interface Topic {
  id: TopicId;
  name: string;
  emoji: string;
  blurb: string;
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
  /** optional short code snippet shown in a monospace block */
  code?: string;
  image?: string;
  url?: string;
  source?: string;
}

export interface QuizCard {
  kind: 'quiz';
  id: string;
  topic: TopicId;
  question: string;
  /** optional code shown with the question */
  code?: string;
  options: string[];
  answer: number;
  explain?: string;
}

export type Card = FactCard | QuizCard;

export const TOPICS: Topic[] = [
  {
    id: 'dsa',
    name: 'DSA',
    emoji: '🧮',
    blurb: 'Data structures, algorithms, Big-O and interview patterns',
    colors: ['#1a2a6c', '#4361ee'],
    queries: [
      'sorting algorithm',
      'graph traversal algorithm',
      'tree data structure',
      'hash table',
      'dynamic programming problem',
      'string-searching algorithm',
      'shortest path algorithm',
      'heap data structure',
      'abstract data type',
    ],
  },
  {
    id: 'sysdesign',
    name: 'System Design',
    emoji: '🏗️',
    blurb: 'Scaling, caching, databases, queues and distributed systems',
    colors: ['#3a0b52', '#b5179e'],
    queries: [
      'distributed computing',
      'consistency model',
      'load balancing computing',
      'database replication',
      'cache computing',
      'message queue',
      'consensus algorithm distributed',
      'content delivery network',
      'database sharding partition',
    ],
  },
  {
    id: 'fullstack',
    name: 'Full-Stack Dev',
    emoji: '🌐',
    blurb: 'HTTP, APIs, frontend, backend, databases and web security',
    colors: ['#004d40', '#0f9d76'],
    queries: [
      'Hypertext Transfer Protocol',
      'web framework',
      'JavaScript library',
      'representational state transfer',
      'web application security vulnerability',
      'SQL database',
      'cascading style sheets',
      'authentication protocol web',
      'web browser engine',
    ],
  },
];

export const topicById = (id: TopicId) => TOPICS.find((t) => t.id === id)!;

let n = 0;
const f = (topic: TopicId, title: string, hook: string, body: string, code?: string): FactCard => ({
  kind: 'fact',
  id: `c-${topic}-${++n}`,
  topic,
  title,
  hook,
  body,
  code,
  source: 'EduScroll',
});

const q = (topic: TopicId, question: string, options: string[], answer: number, explain: string, code?: string): QuizCard => ({
  kind: 'quiz',
  id: `q-${topic}-${++n}`,
  topic,
  question,
  code,
  options,
  answer,
  explain,
});

/** Hand-written starter content. Endless content is pulled from Wikipedia on top of this. */
export const CURATED: Card[] = [
  // ───────────── DSA ─────────────
  f('dsa', 'Big-O is about growth, not speed', 'How cost scales as input grows.',
    'O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ). With a million items, an O(n log n) sort does ~20 million steps; an O(n²) one does ~a trillion. Drop constants and lower-order terms: O(3n + 5) is just O(n).'),
  f('dsa', 'Two pointers on a sorted array', 'Turn O(n²) pair search into O(n).',
    'Start one pointer at each end. If the sum is too small, move the left pointer right; too big, move the right pointer left. Each step discards a candidate, so you finish in one pass.',
    `def pair_sum(a, target):
    i, j = 0, len(a) - 1
    while i < j:
        s = a[i] + a[j]
        if s == target: return i, j
        if s < target: i += 1
        else: j -= 1`),
  f('dsa', 'Two Sum with a hash map', 'The classic O(n) trick.',
    'For each number, check whether its complement (target − x) was already seen. A hash map gives O(1) average lookups, so the whole scan is O(n) time and O(n) space.',
    `def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return seen[target - x], i
        seen[x] = i`),
  f('dsa', 'Sliding window', 'For "longest/shortest subarray or substring" problems.',
    'Keep a window [left, right]. Expand right to include new elements; shrink left while the window breaks the rule. Every element enters and leaves at most once, so it is O(n).',
    `def longest_unique(s):
    last, left, best = {}, 0, 0
    for right, ch in enumerate(s):
        if last.get(ch, -1) >= left:
            left = last[ch] + 1
        last[ch] = right
        best = max(best, right - left + 1)
    return best`),
  f('dsa', 'Binary search: get the boundaries right', 'Most bugs are off-by-one.',
    'Pick one convention and stick to it. With a half-open range [lo, hi), loop while lo < hi and set hi = mid when going left. You can also binary search on the answer itself: "smallest capacity that works" is a monotonic yes/no question.',
    `def lower_bound(a, x):
    lo, hi = 0, len(a)
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] < x: lo = mid + 1
        else: hi = mid
    return lo`),
  f('dsa', 'Monotonic stack', 'Next greater element in O(n).',
    'Keep a stack of indices whose values are decreasing. When a bigger value arrives, pop everything smaller: the new value is their "next greater". Each index is pushed and popped once.'),
  f('dsa', 'BFS finds shortest paths (unweighted)', 'Queue = level by level.',
    'Breadth-first search explores nodes in order of distance from the start, so the first time you reach a node is via a shortest path, as long as every edge has the same weight. DFS does not give you this guarantee.',
    `from collections import deque
def bfs(graph, start):
    dist = {start: 0}
    q = deque([start])
    while q:
        u = q.popleft()
        for v in graph[u]:
            if v not in dist:
                dist[v] = dist[u] + 1
                q.append(v)
    return dist`),
  f('dsa', 'Dijkstra needs non-negative weights', 'Greedy plus a priority queue.',
    'Dijkstra always expands the closest unvisited node. With a binary heap it runs in O((V + E) log V). Negative edge weights break the greedy assumption; use Bellman–Ford (O(V·E)) instead, which can also detect negative cycles.'),
  f('dsa', 'Dynamic programming = recursion + memory', 'Overlapping subproblems + optimal substructure.',
    'Naive recursive Fibonacci recomputes the same values and takes O(2ⁿ). Caching each result makes it O(n). Then you can turn it bottom-up and often keep just the last few values.',
    `from functools import cache
@cache
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)`),
  f('dsa', 'Top-K with a heap of size K', 'Don’t sort everything.',
    'To get the K largest items from n, keep a min-heap of size K. Push each item and pop the smallest when the heap grows past K. That is O(n log K), much better than O(n log n) when K is small.',
    `import heapq
def top_k(nums, k):
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k: heapq.heappop(h)
    return h`),
  f('dsa', 'Comparison sorts can’t beat n log n', 'A provable lower bound.',
    'Any sort that only compares elements needs Ω(n log n) comparisons in the worst case. Counting sort and radix sort avoid comparisons and can run in O(n + k) when keys are small integers.'),
  f('dsa', 'Tries make prefix search fast', 'Autocomplete’s favourite structure.',
    'A trie stores strings character by character along a tree. Looking up a word or any prefix costs O(L), where L is its length, no matter how many words are stored.'),
  f('dsa', 'Union-Find is nearly O(1)', 'Path compression + union by rank.',
    'Disjoint-set union tracks connected groups. With both optimisations, each operation runs in amortised O(α(n)), where α is the inverse Ackermann function, which is at most 4 for any realistic n. It is great for Kruskal’s MST and "number of islands" style problems.'),
  f('dsa', 'Topological sort orders dependencies', 'Only for DAGs.',
    'Kahn’s algorithm repeatedly removes nodes with no incoming edges. If some nodes are never removed, the graph has a cycle. Build systems, course schedules and package managers all use this idea.'),
  q('dsa', 'What is the time complexity of binary search on a sorted array?', ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], 1,
    'Each step halves the search space, so ~log₂ n steps.'),
  q('dsa', 'Which data structure does BFS use to decide what to visit next?', ['Stack', 'Queue', 'Heap', 'Trie'], 1,
    'A FIFO queue makes BFS explore level by level.'),
  q('dsa', 'What is quicksort’s worst-case time complexity?', ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], 2,
    'Consistently bad pivots (e.g. already-sorted input with first-element pivot) give O(n²). Random pivots make this very unlikely.'),
  q('dsa', 'How do you detect a cycle in a linked list in O(1) extra space?', ['Hash set of visited nodes', 'Sort the nodes', 'Fast and slow pointers', 'Recursion'], 2,
    'Floyd’s algorithm: if a fast pointer (2 steps) ever meets the slow pointer (1 step), there is a cycle.'),
  q('dsa', 'What does this print?', ['3', '4', '5', '6'], 2,
    'Memoised fib: fib(5) = 5.', `@cache
def fib(n):
    return n if n < 2 else fib(n-1) + fib(n-2)
print(fib(5))`),
  q('dsa', 'Average lookup time in a well-sized hash table is…', ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], 0,
    'Average O(1); worst case O(n) if many keys collide.'),

  // ───────────── System Design ─────────────
  f('sysdesign', 'Latency numbers to know', 'Orders of magnitude matter.',
    'Roughly: L1 cache ~1 ns · main memory ~100 ns · SSD random read ~100 µs · round trip in a datacenter ~0.5 ms · disk seek ~10 ms · California ↔ Europe round trip ~150 ms. Memory is ~1,000× faster than SSD, and the network is often the bottleneck.'),
  f('sysdesign', 'Back-of-the-envelope: requests per second', '1 million per day ≈ 12 per second.',
    'A day has 86,400 seconds. So 1M requests/day ≈ 12 req/s on average, and 100M/day ≈ 1,200 req/s. Peak traffic is often 2–10× the average, so size for the peak.'),
  f('sysdesign', 'The CAP theorem, precisely', 'It’s about partitions.',
    'When a network partition happens, a distributed system must choose between Consistency (every read sees the latest write) and Availability (every request gets a response). PACELC adds: Else, when there’s no partition, you trade Latency against Consistency.'),
  f('sysdesign', 'Scale up vs scale out', 'Vertical vs horizontal.',
    'Vertical scaling means a bigger machine: simple, but there is a ceiling and a single point of failure. Horizontal scaling means more machines: practically unlimited, but you need load balancing, stateless services and data partitioning.'),
  f('sysdesign', 'Load balancers: L4 vs L7', 'Packets or requests?',
    'L4 balancers route by IP/port and are fast and protocol-agnostic. L7 balancers understand HTTP, so they can route by path, header or cookie, terminate TLS and retry. Common algorithms: round robin, least connections, and hashing for stickiness.'),
  f('sysdesign', 'Caching patterns', 'Cache-aside is the default.',
    'Cache-aside: the app reads the cache and on a miss loads from the DB and fills the cache. Write-through: write the cache and the DB together. Write-back: write the cache and flush to the DB later (fast, but data can be lost). Always set a TTL and plan for invalidation.'),
  f('sysdesign', 'Consistent hashing', 'Add a node, move only ~1/n keys.',
    'With hash(key) % N, changing N remaps almost every key. Consistent hashing puts nodes and keys on a ring, and each key belongs to the next node clockwise. Adding or removing a node moves only its neighbours’ keys. Virtual nodes spread load evenly.'),
  f('sysdesign', 'Leader–follower replication', 'Scale reads, survive failures.',
    'Writes go to the leader and stream to followers, which serve reads. With asynchronous replication, followers lag, so a user might not see their own write. Fix this by reading your own recent writes from the leader.'),
  f('sysdesign', 'Sharding splits data across databases', 'Choose the shard key carefully.',
    'Partition rows by a key (user_id, region…). A good key spreads load evenly and keeps related data together. A bad key creates hot shards. Cross-shard joins and transactions become hard, and resharding later is painful.'),
  f('sysdesign', 'Queues decouple services', 'And smooth traffic spikes.',
    'Producers push messages and consumers process them at their own pace. Most queues give at-least-once delivery, so a message can arrive twice. Make consumers idempotent, for example by tracking processed message IDs.'),
  f('sysdesign', 'Rate limiting with a token bucket', 'Allows short bursts.',
    'A bucket holds up to B tokens and refills at R tokens per second. Each request spends one token, and when the bucket is empty, requests are rejected (HTTP 429). A leaky bucket instead drains at a constant rate for smoother output.',
    `def allow(bucket, now):
    elapsed = now - bucket.last
    bucket.tokens = min(bucket.cap,
                        bucket.tokens + elapsed * bucket.rate)
    bucket.last = now
    if bucket.tokens >= 1:
        bucket.tokens -= 1
        return True
    return False`),
  f('sysdesign', 'What the "nines" really mean', 'Downtime per year.',
    '99% ≈ 3.65 days · 99.9% ≈ 8.8 hours · 99.99% ≈ 53 minutes · 99.999% ≈ 5 minutes. Services that depend on each other in series multiply their availability: two 99.9% services in a chain give about 99.8%.'),
  f('sysdesign', 'Idempotency keys', 'Retry without double-charging.',
    'Networks fail after the server has done the work. The client sends a unique Idempotency-Key with the request. The server stores the result under that key and returns it again for any retry instead of repeating the action.'),
  f('sysdesign', 'URL shortener sizing', 'Base62 goes a long way.',
    'With [a-zA-Z0-9] you have 62 symbols. Seven characters give 62⁷ ≈ 3.5 trillion codes. Generate them from an auto-increment ID or a distributed ID generator, store code → URL, and put a cache in front, since reads far outnumber writes.'),
  f('sysdesign', 'CDNs bring content closer', 'Edge servers worldwide.',
    'A CDN caches static assets (and sometimes API responses) at edge locations near users. This cuts latency and offloads the origin. Use cache-busting filenames (app.3f9a.js) so you can cache for a long time safely.'),
  f('sysdesign', 'SQL or NoSQL?', 'Start from your access patterns.',
    'Relational DBs give joins, transactions and flexible queries, and they suit most apps. Key-value and wide-column stores scale writes horizontally and handle huge, simple access patterns. Document stores fit nested, schema-flexible data. Many systems use both.'),
  q('sysdesign', 'Roughly how much downtime per year does 99.99% availability allow?', ['~5 minutes', '~53 minutes', '~8.8 hours', '~3.6 days'], 1,
    '0.01% of 525,600 minutes ≈ 53 minutes.'),
  q('sysdesign', '1 million requests per day is about how many requests per second on average?', ['~1', '~12', '~120', '~1,000'], 1,
    '1,000,000 ÷ 86,400 ≈ 11.6.'),
  q('sysdesign', 'Your queue delivers at-least-once. What must consumers be?', ['Stateless', 'Idempotent', 'Synchronous', 'Single-threaded'], 1,
    'Processing the same message twice must have the same effect as once.'),
  q('sysdesign', 'What is the main benefit of consistent hashing?', ['Faster hash functions', 'Encrypts keys', 'Few keys move when nodes change', 'Guarantees strong consistency'], 2,
    'Only about 1/n of keys are remapped when a node joins or leaves.'),
  q('sysdesign', 'In CAP, a partition happens. A system that keeps answering with possibly stale data chose…', ['Consistency', 'Availability', 'Partition tolerance', 'Latency'], 1,
    'It stayed available at the cost of consistency (an AP system).'),
  q('sysdesign', 'Which rate limiter allows short bursts up to a cap?', ['Token bucket', 'Fixed window counter', 'Leaky bucket', 'Round robin'], 0,
    'Tokens accumulate up to the bucket size, so a burst can spend them all at once.'),

  // ───────────── Full-Stack ─────────────
  f('fullstack', '401 vs 403', 'Who are you vs you can’t do that.',
    '401 Unauthorized really means unauthenticated: send credentials. 403 Forbidden means the server knows who you are but you lack permission. Other families: 2xx success, 3xx redirect, 4xx client error, 5xx server error.'),
  f('fullstack', 'Which HTTP methods are idempotent?', 'Safe to retry.',
    'GET, PUT, DELETE, HEAD and OPTIONS are idempotent: repeating them leaves the server in the same state. POST is not, since two POSTs can create two orders. PATCH may or may not be, depending on how it is designed.'),
  f('fullstack', 'CORS is enforced by the browser', 'Not by your server.',
    'Browsers block JS from reading cross-origin responses unless the server allows it with Access-Control-Allow-Origin. Non-simple requests (custom headers, JSON bodies, PUT/DELETE) trigger an OPTIONS preflight first. curl and backends ignore CORS entirely.'),
  f('fullstack', 'The event loop: microtasks first', 'Why the logs come out in that order.',
    'After the current script finishes, JS drains all microtasks (Promise callbacks, queueMicrotask) before the next macrotask (setTimeout, I/O, events). This prints A, D, C, B.',
    `console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');`),
  f('fullstack', 'Keys in React lists', 'Don’t use the index for reorderable lists.',
    'React matches list items between renders by key. If you use the array index and the list is re-sorted or filtered, state and DOM get attached to the wrong item. Use a stable ID from your data.',
    `{todos.map(t => <Todo key={t.id} todo={t} />)}`),
  f('fullstack', 'Never build SQL with string concatenation', 'Parameterised queries stop SQL injection.',
    'User input like  \' OR 1=1 --  can rewrite your query. Placeholders send data separately from the SQL, so it is never executed as code.',
    `// ❌ db.query("SELECT * FROM users WHERE email = '" + email + "'")
// ✅
db.query('SELECT * FROM users WHERE email = $1', [email]);`),
  f('fullstack', 'Database indexes', 'Fast reads, slower writes.',
    'Most indexes are B-trees, which turn a full table scan into an O(log n) lookup. Each index adds work on every write. A composite index on (a, b) helps queries filtering on a, or a and b, but not on b alone (the leftmost-prefix rule).'),
  f('fullstack', 'The N+1 query problem', 'One query becomes a hundred.',
    'You fetch 100 posts, then loop and fetch each post’s author: that is 101 queries. Use a JOIN, a single WHERE id IN (…) query, or your ORM’s eager loading (include / select_related) to batch it.'),
  f('fullstack', 'Hash passwords with bcrypt or Argon2', 'Not SHA-256.',
    'Fast hashes let attackers try billions of guesses per second. Password hashing functions are deliberately slow and salted, so identical passwords hash differently. Never store plaintext or reversible encryption.'),
  f('fullstack', 'Cookie flags that matter', 'HttpOnly, Secure, SameSite.',
    'HttpOnly hides the cookie from JavaScript, which limits XSS token theft. Secure sends it only over HTTPS. SameSite=Lax or Strict stops it being sent on most cross-site requests, which blocks many CSRF attacks.'),
  f('fullstack', 'Anything in the frontend bundle is public', 'Including your API keys.',
    'Env vars like VITE_* or NEXT_PUBLIC_* are baked into the JS users download. Keep secrets on the server and call third-party APIs from a backend or serverless function.'),
  f('fullstack', 'Debounce vs throttle', 'Taming noisy events.',
    'Debounce waits until events stop for X ms, which suits search-as-you-type. Throttle runs at most once every X ms, which suits scroll and resize handlers.',
    `function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}`),
  f('fullstack', 'Polling, SSE or WebSockets?', 'Choosing real-time transport.',
    'Polling is simple but wasteful. Server-Sent Events give one-way server → client streaming over plain HTTP with auto-reconnect. WebSockets are full duplex, which suits chat, games and collaboration. Pick the simplest one that fits.'),
  f('fullstack', 'Core Web Vitals', 'What "fast" means to Google.',
    'Good targets: LCP (largest content visible) under 2.5 s, INP (responsiveness to input) under 200 ms, CLS (layout shift) under 0.1. Big wins: optimised images, less JS, reserved space for media and ads.'),
  f('fullstack', 'ACID transactions', 'All or nothing.',
    'Atomicity: every statement commits or none do. Consistency: constraints hold. Isolation: concurrent transactions don’t see each other’s partial work. Durability: committed data survives crashes. Wrap multi-step writes like transfers in a transaction.'),
  f('fullstack', 'Flexbox or Grid?', 'One axis or two.',
    'Flexbox lays items out along one axis, which suits navbars, toolbars and centering. Grid controls rows and columns together, which suits page layouts and card galleries. They combine well: Grid for the page, Flexbox inside components.'),
  q('fullstack', 'What does this log?', ['A B C D', 'A D B C', 'A D C B', 'A C D B'], 2,
    'Sync code first (A, D), then microtasks (C), then the timer (B).', `console.log('A');
setTimeout(() => console.log('B'));
Promise.resolve().then(() => console.log('C'));
console.log('D');`),
  q('fullstack', 'A logged-in user requests an admin-only page. Correct status?', ['400', '401', '403', '404'], 2,
    '403: authenticated, but not authorised.'),
  q('fullstack', 'Which HTTP method is NOT idempotent?', ['GET', 'PUT', 'DELETE', 'POST'], 3,
    'Repeating a POST can create duplicates.'),
  q('fullstack', 'Which cookie flag stops JavaScript from reading the cookie?', ['Secure', 'HttpOnly', 'SameSite', 'Domain'], 1,
    'HttpOnly cookies are invisible to document.cookie.'),
  q('fullstack', 'Who enforces CORS?', ['The web server', 'The browser', 'The database', 'DNS'], 1,
    'Servers only send headers; browsers decide whether JS may read the response.'),
  q('fullstack', 'Composite index on (country, city). Which query can NOT use it efficiently?', ['WHERE country = ?', 'WHERE country = ? AND city = ?', 'WHERE city = ?', 'ORDER BY country, city'], 2,
    'Leftmost-prefix rule: the index is sorted by country first.'),
];
