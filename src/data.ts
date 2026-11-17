// Mock data for the Nightclub UI prototype. Replace with Laravel API calls later.

export type Tier = 'Strong fit' | 'Good fit' | 'Worth exploring';
export type IntroState = 'suggested' | 'requested' | 'accepted' | 'declined';
export type Proof = 'self-reported' | 'peer-acknowledged' | 'artifact-verified';

export interface Member {
  id: string;
  name: string;
  role: string;
  city: string;
  skills: string[];
  seeks: string[];
  goals: string[];
  availability: string;
  languages: string[];
  verified: number; // verified contributions
  bio: string;
  hue: number; // avatar colour
}

export const me = {
  id: 'u0',
  name: 'Vanjeti Raja Sekhar',
  role: 'Full-stack developer',
  skills: ['React', 'TypeScript', 'Laravel', 'MySQL'],
  seeks: ['UI/UX design', 'Growth marketing', 'AI/ML'],
  interests: ['AI agents', 'EdTech', 'Telugu creators'],
  availability: '10–15 hrs / week · evenings IST',
  languages: ['Telugu', 'English'],
};

export const members: Member[] = [
  { id: 'm1', name: 'Sai Kiran Reddy', role: 'Product designer', city: 'Hyderabad', skills: ['Figma', 'UX research', 'Design systems'], seeks: ['Frontend dev', 'Founder'], goals: ['Startup', 'Freelance'], availability: '12 hrs/week', languages: ['Telugu', 'English'], verified: 6, bio: 'Designed 3 shipped SaaS dashboards. Wants to co-build an AI product for local businesses.', hue: 150 },
  { id: 'm2', name: 'Arjun Varma', role: 'Growth marketer', city: 'Vijayawada', skills: ['SEO', 'Meta ads', 'Content'], seeks: ['Developer', 'Designer'], goals: ['Startup', 'Career'], availability: '8 hrs/week', languages: ['Telugu', 'English', 'Hindi'], verified: 3, bio: 'Grew a Telugu YouTube channel to 80k. Looking for builders to launch a creator tool.', hue: 30 },
  { id: 'm3', name: 'Rahul Naidu', role: 'ML engineer', city: 'Bengaluru', skills: ['Python', 'LLMs', 'RAG'], seeks: ['Full-stack dev', 'Product'], goals: ['Startup'], availability: '10 hrs/week', languages: ['Telugu', 'English'], verified: 9, bio: 'Builds retrieval pipelines at a fintech. Side-project energy, needs a shipping partner.', hue: 200 },
  { id: 'm4', name: 'Karthik Chowdary', role: 'Founder / operator', city: 'Guntur', skills: ['Sales', 'Ops', 'Pitching'], seeks: ['Tech cofounder'], goals: ['Startup'], availability: '20 hrs/week', languages: ['Telugu', 'English'], verified: 2, bio: 'Ran a 40-person coaching centre. Has 3 pilot schools ready for an AI tutor.', hue: 280 },
  { id: 'm5', name: 'Pranav Rao', role: 'Flutter developer', city: 'Warangal', skills: ['Flutter', 'Dart', 'Firebase'], seeks: ['Backend dev', 'Designer'], goals: ['Career', 'Freelance'], availability: '6 hrs/week', languages: ['Telugu', 'English'], verified: 4, bio: 'Final-year student, 2 apps on Play Store. Wants real team experience.', hue: 100 },
  { id: 'm6', name: 'Vamsi Krishna', role: 'Content creator', city: 'Tirupati', skills: ['Video', 'Scripting', 'Community'], seeks: ['Developer'], goals: ['Freelance', 'Learning'], availability: '5 hrs/week', languages: ['Telugu'], verified: 1, bio: 'Teaches AI tools in Telugu on Instagram. Wants a small app for his audience.', hue: 0 },
];

export interface FourPick { memberId: string; contribution: string; why: string[]; tier: Tier; state: IntroState }

export const findYourFour = {
  project: 'AI tutor for Telugu-medium schools',
  state: 'partially_accepted' as const,
  picks: [
    { memberId: 'm1', contribution: 'Owns product & UX design', why: ['Covers your top gap: UI/UX design', 'Both weight startup building highest', '6 hrs of shared evening overlap'], tier: 'Strong fit', state: 'accepted' },
    { memberId: 'm3', contribution: 'Builds the AI / RAG layer', why: ['Needs a full-stack partner — you need AI/ML', '9 artifact-verified contributions', 'Same language and time zone'], tier: 'Strong fit', state: 'requested' },
    { memberId: 'm4', contribution: 'Runs pilots, sales & ops', why: ['Has 3 pilot schools ready', 'Looking for a tech cofounder like you', 'Adds a non-technical perspective'], tier: 'Good fit', state: 'suggested' },
    { memberId: 'm2', contribution: 'Drives growth & content', why: ['Covers growth marketing gap', 'Audience in the Telugu creator space'], tier: 'Worth exploring', state: 'suggested' },
  ] as FourPick[],
};

export const goalPresets: Record<string, Record<string, number>> = {
  'Startup focus': { startup_building: 60, career_jobs: 15, freelance_clients: 15, learning_experiments: 10 },
  'Career focus': { startup_building: 15, career_jobs: 60, freelance_clients: 10, learning_experiments: 15 },
  Balanced: { startup_building: 25, career_jobs: 25, freelance_clients: 25, learning_experiments: 25 },
  Explorer: { startup_building: 10, career_jobs: 10, freelance_clients: 20, learning_experiments: 60 },
};

export const goalLabels: Record<string, string> = {
  startup_building: 'Startup building',
  career_jobs: 'Career & jobs',
  freelance_clients: 'Freelance clients',
  learning_experiments: 'Learning & experiments',
};

export const circles = [
  {
    id: 'c1', name: 'TeluguTutor AI', objective: 'Ship a WhatsApp-first AI tutor demo to 3 pilot schools',
    members: ['u0', 'm1', 'm3'], cadence: 'Tue & Fri · 9 PM IST', status: 'active',
    milestones: [
      { title: 'Problem interviews with 5 teachers', done: true },
      { title: 'Clickable prototype', done: true },
      { title: 'RAG over SCERT textbooks', done: false, owner: 'm3' },
      { title: 'Pilot demo at school #1', done: false, owner: 'u0' },
    ],
  },
  {
    id: 'c2', name: 'Creator Link Hub', objective: 'Link-in-bio tool for Telugu creators',
    members: ['u0', 'm6'], cadence: 'Sundays · 11 AM IST', status: 'forming',
    milestones: [{ title: 'Agree scope & roles', done: false }],
  },
];

export type TaskState = 'open' | 'claimed' | 'in_review' | 'verified';
export interface Task { id: string; circle: string; title: string; state: TaskState; owner?: string; artifact?: string; reviewer?: string }
export const missions: Task[] = [
  { id: 't1', circle: 'TeluguTutor AI', title: 'RAG answer endpoint with page citations', owner: 'm3', state: 'in_review', artifact: 'github.com/…/pull/18', reviewer: 'u0' },
  { id: 't2', circle: 'TeluguTutor AI', title: 'Chunk & embed Class 8 science textbook', owner: 'm3', state: 'claimed' },
  { id: 't3', circle: 'TeluguTutor AI', title: 'Onboarding flow designs', owner: 'm1', state: 'verified', artifact: 'figma.com/…/onboarding' },
  { id: 't4', circle: 'TeluguTutor AI', title: 'Teacher feedback form (Telugu)', state: 'open' },
  { id: 't5', circle: 'Creator Link Hub', title: 'Pick tech stack & hosting', state: 'open' },
];

export const sessions = [
  { id: 's1', title: 'Build an AI agent with tool calling', date: 'Tue, 18 Nov', time: '8:00 PM IST', host: 'Nitish', status: 'upcoming', rsvp: true, used: false },
  { id: 's2', title: 'Ship your MVP in a weekend', date: 'Sat, 22 Nov', time: '11:00 AM IST', host: 'Nitish', status: 'upcoming', rsvp: false, used: false },
  { id: 's3', title: 'Planning of the community Application', date: 'Thu, 13 Nov', time: '8:00 PM IST', host: 'Nitish', status: 'past', rsvp: true, used: true, followUp: 'Pick one Nightclub feature and draft its UI' },
  { id: 's4', title: 'The AI setup for the big leap', date: 'Mon, 10 Nov', time: '8:00 PM IST', host: 'Nitish', status: 'past', rsvp: true, used: true },
];

export type OppKind = 'Startup' | 'Job' | 'Freelance' | 'Pilot customer';
export const opportunities = [
  { id: 'o1', kind: 'Pilot customer' as OppKind, title: '3 schools want an AI homework helper', org: 'Via Karthik Chowdary', fit: ['Matches your startup goal (highest weight)', 'Uses your Laravel + React skills'], verified: true, posted: '2 days ago' },
  { id: 'o2', kind: 'Job' as OppKind, title: 'Full-stack engineer (React/Laravel)', org: 'Hyderabad EdTech · Series A', fit: ['Matches your career goal', 'Your verified API work is relevant'], verified: true, posted: '4 days ago' },
  { id: 'o3', kind: 'Freelance' as OppKind, title: 'Admin dashboard for a clinic chain', org: 'Vijayawada · ₹60k fixed', fit: ['Matches freelance goal', 'Short 3-week scope'], verified: true, posted: '1 week ago' },
  { id: 'o4', kind: 'Startup' as OppKind, title: 'Cofounder wanted: AgriTech voice assistant', org: 'Member post · Guntur', fit: ['Needs a technical cofounder', 'Telugu-first product'], verified: false, posted: '1 week ago' },
];

export const passport = [
  { id: 'p1', project: 'TeluguTutor AI', role: 'Backend lead', artifact: 'Lesson sessions API (PR #14)', outcome: 'Used in pilot prototype', proof: 'peer-acknowledged' as Proof, ack: ['m3'] },
  { id: 'p2', project: 'Nightclub Build Trail', role: 'Builder', artifact: 'HRMS attendance module', outcome: 'Live for 120 employees', proof: 'artifact-verified' as Proof, ack: [] as string[] },
  { id: 'p3', project: 'Personal', role: 'Solo', artifact: 'Event ERP prototype', outcome: 'Demoed to 1 client', proof: 'self-reported' as Proof, ack: [] as string[] },
];

export const feed = [
  { id: 'f1', who: 'm3', text: 'Got RAG working over the Class 8 science PDF — answers now cite page numbers. Need someone to test with Telugu questions.', tag: 'Build update', time: '3h' },
  { id: 'f2', who: 'm1', text: 'Sharing our onboarding flow — 4 screens, voice-first for teachers. Feedback welcome on the Telugu copy.', tag: 'Feedback request', time: '6h' },
  { id: 'f3', who: 'm5', text: 'Shipped offline caching in my Flutter app. Wrote up what worked with Hive vs Isar.', tag: 'Lesson', time: '1d' },
];

export interface Msg { from: string; text: string; time: string }
export const conversations: { id: string; with: string; context: string; unread: number; messages: Msg[] }[] = [
  { id: 'cv1', with: 'm1', context: 'Find Your Four · TeluguTutor AI', unread: 2, messages: [
    { from: 'm1', text: 'Hey! Accepted your intro. Loved that you already have the Laravel side mapped out.', time: '7:42 PM' },
    { from: 'u0', text: 'Thanks Sai! Can you own the onboarding screens? I can wire them up this week.', time: '7:50 PM' },
    { from: 'm1', text: 'Yes — uploaded v1 to the mission. Can you review by Friday?', time: '8:05 PM' },
    { from: 'm1', text: 'Also, are Tue/Fri 9 PM calls okay for you?', time: '8:06 PM' },
  ] },
  { id: 'cv2', with: 'm6', context: 'Member Search · Creator Link Hub', unread: 0, messages: [
    { from: 'u0', text: 'Hi Vamsi, saw your request — happy to scope the link tool together.', time: 'Yesterday' },
    { from: 'm6', text: 'Super! Sunday 11 AM works?', time: 'Yesterday' },
  ] },
];

export const notifications = [
  { id: 'n1', priority: 'High', text: 'Sai Kiran accepted your introduction', link: '/messages', time: '20m' },
  { id: 'n2', priority: 'High', text: 'Rahul requested your review on "RAG answer endpoint"', link: '/missions', time: '1h' },
  { id: 'n3', priority: 'Medium', text: 'Live session "Build an AI agent" on Tue, 8 PM', link: '/sessions', time: '3h' },
  { id: 'n4', priority: 'Low', text: '3 new build updates from people you follow (digest)', link: '/discover', time: '1d' },
];

export const membership = {
  plan: 'Nightclub Monthly', status: 'Active', price: '₹999 / month', renews: '13 Dec 2026',
  sessionsIncluded: 8, sessionsUsed: 2, method: 'Razorpay · UPI',
};

export const byId = (id: string) => members.find((m) => m.id === id);
