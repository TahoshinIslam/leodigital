export type Tile = { num: string; title: string; copy: string };
export type AccordionEntry = { title: string; content: string };

export const stats = [
  { value: "15", suffix: "+", label: "Years of experience" },
  { value: "50", suffix: "+", label: "Projects completed" },
  { value: "22", suffix: "", label: "Team members" },
  { value: "10", suffix: "", label: "Awards won" },
];

export const whyPoints = [
  {
    num: "01",
    title: "Reach further",
    copy: "Break past local limits and connect with potential customers anywhere, any time.",
  },
  {
    num: "02",
    title: "Target precisely",
    copy: "Put your budget on the people most likely to buy — and nothing on the rest.",
  },
  {
    num: "03",
    title: "Build real connections",
    copy: "Talk directly with your customers and earn trust and loyalty that lasts.",
  },
  {
    num: "04",
    title: "Measure everything",
    copy: "Track how customers behave, learn what works, and improve every cycle.",
  },
  {
    num: "05",
    title: "Stay ahead",
    copy: "Adapt as the online world evolves and keep your business competitive.",
  },
];

export const industries: Tile[] = [
  {
    num: "01",
    title: "Restaurant",
    copy: "Targeted social campaigns, review management, and email keep tables full — your menu in front of the people most likely to book.",
  },
  {
    num: "02",
    title: "Hotel & resort",
    copy: "Put rooms, dining, and experiences in front of travellers while they plan — campaigns built for direct bookings, not commissions.",
  },
  {
    num: "03",
    title: "Real estate",
    copy: "Strategic campaigns that build presence and pipeline in a trust-driven market — reaching serious buyers before your competitors do.",
  },
  {
    num: "04",
    title: "Apparel",
    copy: "Launch drops, engage communities, and stay ahead of a fast-moving industry — content that turns browsers into repeat buyers.",
  },
  {
    num: "05",
    title: "Healthcare",
    copy: "Patients search before they visit. Reviews, advice, and local search make you their first call — online and off.",
  },
  {
    num: "06",
    title: "Gym & salon",
    copy: "Build a vibrant community that keeps your brand front of mind — the obvious choice when they are ready to commit.",
  },
  {
    num: "07",
    title: "Tech & IT",
    copy: "Long buying journeys need full-funnel presence. We put your brand at every stage and maximize ROI on complex sales.",
  },
  {
    num: "08",
    title: "E-commerce",
    copy: "Targeted campaigns reach millions; data tells you what to scale. Growth decisions backed by your own numbers.",
  },
];

export const services: Tile[] = [
  { num: "01", title: "SEO", copy: "Own the results page before your competitors know it is a channel." },
  { num: "02", title: "Meta marketing", copy: "Facebook and Instagram with a thesis — reach, engagement, conversion." },
  { num: "03", title: "Google Ads", copy: "Data-driven PPC. Every taka accountable to blended ROAS." },
  { num: "04", title: "Email marketing", copy: "ROI-driven lists, segments, and automations that sell while you sleep." },
  { num: "05", title: "Influencer marketing", copy: "The right voices for your niche — trust, borrowed and then earned." },
  { num: "06", title: "Content & video", copy: "In-house studio: product stills, videos, and explainers that convert." },
  { num: "07", title: "Web & UI/UX", copy: "Sites engineered to convert — fast, seamless, unmistakably yours." },
  { num: "08", title: "Online PR & inbound", copy: "Reputation, publicity, and content that pulls customers to you." },
];

export const seoChips = [
  "Keyword research",
  "Competitor analysis",
  "Content optimization",
  "On-page SEO",
  "Technical SEO",
  "Backlink building",
  "Local SEO",
  "Global SEO",
];

export const seoItems: AccordionEntry[] = [
  {
    title: "Increased visibility and traffic",
    content:
      "Ranking on the first page puts you in front of buyers at the exact moment of intent. By optimizing your site for the keywords and phrases your customers actually use, we attract targeted organic traffic that converts into leads and sales — without paying for every click.",
  },
  {
    title: "Credibility and trust",
    content:
      "Websites that rank higher are perceived as more credible. Consistent, high-quality SEO establishes your authority in your industry, and that authority compounds: the longer you hold the position, the harder it is for competitors to displace you.",
  },
  {
    title: "Targeted traffic, higher conversions",
    content:
      "SEO lets you target the specific searches that signal buying intent. Visitors who arrive through them are far more likely to become customers, which is why organic traffic converts at rates paid channels struggle to match.",
  },
  {
    title: "Better user experience",
    content:
      "Search engines reward what users reward: fast pages, clear structure, and content that answers the question. The technical and content work of SEO makes your site better for the humans who use it — and rankings follow.",
  },
  {
    title: "Long-term, sustainable results",
    content:
      "Paid traffic stops the day the budget does. Rankings earned through disciplined SEO keep producing traffic and leads month after month, making it one of the most durable investments in the marketing stack.",
  },
  {
    title: "Competitive advantage",
    content:
      "Most of your competitors are not optimizing seriously. Outranking them in search results captures market share from businesses that are actively looking for exactly what you sell — before those buyers ever see a competitor.",
  },
];

export const metaItems: AccordionEntry[] = [
  {
    title: "Expanded reach and visibility",
    content:
      "We extend your reach far beyond traditional boundaries — Facebook, Instagram, LinkedIn, and more — so your message finds the right audience across demographics, interests, and geography.",
  },
  {
    title: "Engagement and interaction",
    content:
      "Compelling content tailored to each platform sparks conversations and builds a loyal community around your brand — polls, stories, live moments, and content people actually want to share.",
  },
  {
    title: "Targeted advertising",
    content:
      "Platform targeting by demographics, interests, and behavior means your ad spend lands on the people most likely to buy. We optimize continuously so every campaign gets sharper, not staler.",
  },
  {
    title: "Brand authority and thought leadership",
    content:
      "Consistent presence and genuinely useful content position you as the authoritative voice in your niche. Authority earns trust, and trust shortens every sales cycle that follows.",
  },
  {
    title: "Customer insights and market research",
    content:
      "Analytics and social listening reveal what your audience prefers, feels, and does. Those insights feed back into strategy — content, offers, and timing all get smarter with every cycle.",
  },
  {
    title: "Community and advocacy",
    content:
      "Two-way communication and user-generated content turn customers into advocates. Advocates amplify your message, drive word-of-mouth referrals, and lower your cost of growth.",
  },
];

export const adsItems: AccordionEntry[] = [
  {
    title: "How PPC works",
    content:
      "Your ad appears at the top of the results page for the searches you choose, and you pay only when someone clicks. Position is earned by relevance and quality, not just budget — which is where disciplined management pays off.",
  },
  {
    title: "The benefits",
    content:
      "Immediate visibility while SEO compounds, precise control over spend, and complete measurement from click to sale. PPC is the fastest lever for testing offers and filling the pipeline on demand.",
  },
  {
    title: "Our approach",
    content:
      "Keyword and competitor research set the map; tight ad groups, relevant copy, and landing-page alignment raise quality scores and lower cost per click. Then continuous testing reallocates budget toward what converts.",
  },
  {
    title: "Measurable ROI",
    content:
      "Every campaign reports to one number: return on ad spend. You see exactly what was spent, what came back, and what we changed — so advertising dollars are spent like investments, not hopes.",
  },
];

export const emailItems: AccordionEntry[] = [
  {
    title: "Building your list",
    content:
      "We grow a permission-based list of people who actually want to hear from you — lead magnets, site capture, and offline touchpoints — because a list you own beats an audience you rent.",
  },
  {
    title: "Creating engaging content",
    content:
      "Newsletters, offers, and lifecycle emails written to be opened. Subject lines earn the click; content earns the next open. No noise, no spam-bait.",
  },
  {
    title: "Segmenting your audience",
    content:
      "Not every customer is the same, so no one gets the same message. Segments by behavior, purchase history, and interest lift open rates and conversions in every send.",
  },
  {
    title: "Automating your campaigns",
    content:
      "Welcome series, abandoned-cart recovery, re-engagement flows — automations that sell around the clock and get better as the data accumulates.",
  },
  {
    title: "Analyzing and optimizing",
    content:
      "Opens, clicks, conversions, and revenue per send are reviewed on every campaign. What works gets scaled; what does not gets cut. The list gets more valuable every month.",
  },
];

export const influencerItems: AccordionEntry[] = [
  {
    title: "How it works",
    content:
      "We find creators whose audience matches your target customer — celebrities, niche experts, or micro-influencers — and manage the collaboration end to end: briefs, content, rights, and reporting.",
  },
  {
    title: "Engagement and sales",
    content:
      "When the right voice shares your product, their followers click, buy, and engage. We track the full path so you know the return on every partnership and can double down on what performs.",
  },
  {
    title: "Trust and credibility",
    content:
      "A recommendation from a trusted voice transfers credibility to your brand in a way an ad cannot. It is the closest thing to word-of-mouth that can be planned, briefed, and measured.",
  },
];

export const prItems: AccordionEntry[] = [
  {
    title: "Brand reputation management",
    content:
      "We monitor and shape how your business appears across the internet — reviews, mentions, forums, and press — addressing concerns before they become stories and amplifying the wins.",
  },
  {
    title: "Content creation and distribution",
    content:
      "Positive, useful information about your business placed where your audience already reads: online publications, blogs, and industry channels that carry weight.",
  },
  {
    title: "Credibility and trust",
    content:
      "Third-party coverage builds a kind of trust that advertising cannot buy. Consistent online PR compounds into an authority position competitors have to earn the slow way.",
  },
  {
    title: "Attracting with valuable content",
    content:
      "Inbound flips the funnel: instead of interrupting people, we publish content that answers their questions — blogs, guides, videos — and positions you as the helpful expert in the room.",
  },
  {
    title: "Converting leads into customers",
    content:
      "Visitors who engage with your content become leads through sign-ups, trials, and offers. Nurture sequences then move them from curious to customer at their pace, not ours.",
  },
  {
    title: "Measurable results and ROI",
    content:
      "Clear objectives and tracked KPIs mean you always know what reputation and content work is returning — and resources go where the outcomes are.",
  },
];

export const brandItems: AccordionEntry[] = [
  {
    title: "Brand identity",
    content:
      "Values, mission, and vision form the foundation; personality, messaging, and story make it human. We define the essence that sets you apart and carry it consistently through every touchpoint your customers meet.",
  },
  {
    title: "Logo design",
    content:
      "Your logo is the first visual element most customers encounter — it must capture attention, convey professionalism, and hold up everywhere from a business card to a billboard. We design marks that are distinctive, versatile, and built to become synonymous with your brand.",
  },
  {
    title: "UI/UX design",
    content:
      "A seamless experience keeps visitors engaged and moves them toward action. Intuitive navigation, clear layout, and interfaces optimized for every screen size — because first impressions are made in seconds and conversions are won in the details.",
  },
  {
    title: "Website development",
    content:
      "Your website is your digital storefront, open around the clock. We build fast, secure, SEO-friendly sites with clear calls to action and seamless journeys — the best sales asset your business will own.",
  },
  {
    title: "Mobile friendliness",
    content:
      "Most of Bangladesh browses on a phone. Responsive design that adapts to every device is not a feature, it is the baseline — and it directly affects both your search rankings and your conversion rate.",
  },
];

export const playbook = [
  {
    id: "seo",
    index: "04.1",
    eyebrow: "Search engine optimization",
    heading: "Be found first, and stay there.",
    copy: "Where online visibility makes or breaks a business, SEO is the pivotal strategy. We improve your visibility on the results page, drive organic traffic that you do not pay per click for, and turn search intent into revenue.",
    chips: seoChips,
    items: seoItems,
  },
  {
    id: "meta",
    index: "04.2",
    eyebrow: "Meta & social marketing",
    heading: "One toolbox. Every platform working together.",
    copy: "Meta marketing combines your channels — social, email, website, ads — into one machine instead of a set of disconnected tools. Facebook, Instagram, LinkedIn, and YouTube each get content built for how their audience actually behaves.",
    items: metaItems,
  },
  {
    id: "ads",
    index: "04.3",
    eyebrow: "Google Ads",
    heading: "Paid attention, precisely spent.",
    copy: "PPC puts you at the top of the page the moment someone searches for what you sell — and you pay only when they act. We run it as a data discipline, not a bidding lottery.",
    items: adsItems,
  },
  {
    id: "email",
    index: "04.4",
    eyebrow: "Email marketing",
    heading: "The channel you own outright.",
    copy: "No algorithm sits between you and your list. Done properly, email is the highest-ROI channel in the stack — a direct line to the people who already raised their hand.",
    items: emailItems,
  },
  {
    id: "influencer",
    index: "04.5",
    eyebrow: "Influencer marketing",
    heading: "Trust, at scale.",
    copy: "People trust recommendations from voices they follow. We match your brand with the right creators — fashion on Instagram, gaming on YouTube, everything between — and measure what their audience does next.",
    items: influencerItems,
  },
  {
    id: "pr",
    index: "04.6",
    eyebrow: "Online PR & inbound",
    heading: "Reputation that pulls, not pushes.",
    copy: "Online PR manages how the internet talks about you; inbound marketing gives people a reason to come to you. Together they build the authority that paid media alone cannot buy.",
    items: prItems,
  },
];

export const studioCards = [
  {
    title: "Product images",
    caption: "Product stills — studio",
    gradient:
      "radial-gradient(120% 90% at 78% 12%, #49DC7A 0%, #1E8F66 45%, #0B3B2A 75%, #040A0A 100%)",
    copy: "The face of your product online. High-resolution, well-lit, shot from every angle that matters — so customers decide in your favor before reading a word.",
  },
  {
    title: "Product videos",
    caption: "Product film — set",
    gradient:
      "radial-gradient(120% 90% at 20% 10%, #49DC7A 0%, #128055 48%, #093325 80%, #040A0A 100%)",
    copy: "Your product, in motion — features, benefits, and the moment of use, cut to hold attention and drive conversion on every platform.",
  },
  {
    title: "Explainer videos",
    caption: "Explainer — frame",
    gradient:
      "radial-gradient(120% 100% at 70% 0%, #2A5D4A 0%, #14382A 55%, #071A12 100%)",
    copy: "Complex offers made simple. Explainers that answer the questions your customers were about to ask — before they ask a competitor.",
  },
];

export const testimonials = [
  {
    quote:
      "Leotech rebuilt our funnel end to end. Bookings doubled in one season — and for the first time we know exactly which taka does what.",
    name: "Obaidul Karim",
    role: "Founder, Scenic Tours",
    featured: true,
  },
  {
    quote:
      "The new site and campaigns paid for themselves in two months. They operate like owners, not vendors.",
    name: "Kazi Delwar",
    role: "Managing Director, Delwar Group",
    featured: false,
  },
];

export type BillingPeriod = "monthly" | "annual";

/** `note` carries the yearly total, so an annual price can still be shown as a
 *  per-month figure — the comparable number — without hiding what is charged. */
export type Price = { amount: string; cadence: string; note?: string };

export type PricingTier = {
  name: string;
  monthly: Price;
  annual: Price;
  tagline: string;
  features: string[];
  cta: string;
  featured: boolean;
};

/** Annual plans bill 12 months up front at a 20% discount. */
export const annualDiscount = "-20%";

export const pricing: PricingTier[] = [
  {
    name: "Launch",
    monthly: { amount: "৳25,000", cadence: "/month" },
    annual: { amount: "৳20,000", cadence: "/month", note: "৳240,000 billed yearly" },
    tagline: "For local businesses getting serious about showing up online.",
    features: [
      "One channel, fully managed",
      "SEO foundation & local listings",
      "8 social posts a month",
      "Monthly performance report",
      "Email & chat support",
    ],
    cta: "Start with Launch",
    featured: false,
  },
  {
    name: "Growth",
    monthly: { amount: "৳60,000", cadence: "/month" },
    annual: { amount: "৳48,000", cadence: "/month", note: "৳576,000 billed yearly" },
    tagline: "A multi-channel growth engine for brands ready to compound.",
    features: [
      "Up to 3 channels managed",
      "Paid media — Meta & Google",
      "Content calendar & production",
      "Conversion-rate optimization",
      "Bi-weekly strategy calls",
      "Live results dashboard",
    ],
    cta: "Choose Growth",
    featured: true,
  },
  {
    name: "Scale",
    // Scoped per engagement, so there is no list price to discount either way.
    monthly: { amount: "Custom", cadence: "" },
    annual: { amount: "Custom", cadence: "" },
    tagline: "A full-funnel partnership for teams set on owning the market.",
    features: [
      "Everything in Growth",
      "Dedicated growth team",
      "In-house video studio",
      "Advanced attribution & data",
      "Priority same-day support",
    ],
    cta: "Talk to us",
    featured: false,
  },
];

export const navLinks = [
  { href: "/#services", key: "services", label: "Services" },
  { href: "/#industries", key: "industries", label: "Industries" },
  { href: "/#playbook", key: "playbook", label: "Playbook" },
  { href: "/#studio", key: "studio", label: "Studio" },
  { href: "/#pricing", key: "pricing", label: "Pricing" },
  { href: "/#contact", key: "contact", label: "Contact" },
];

export const socials = [
  { label: "Facebook", href: "https://www.facebook.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "YouTube", href: "https://www.youtube.com/" },
];

export const contact = {
  phones: ["01730 594391", "01730 594393"],
  email: "info@leotechbd.com",
  address: ["House 69/J, Panthapath,", "Dhaka 1216"],
};

// ── Section copy ────────────────────────────────────────────────────────
// Headings are [plain, accent] pairs: the second half renders in the italic
// accent style.
export type Heading = readonly [string, string];

export const home = {
  hero: {
    eyebrow: "Digital marketing agency · Dhaka",
    title: ["Marketing that creates", "market leaders."] as Heading,
    lede: "Leotech is the digital marketing partner behind Bangladesh’s ambitious brands. SEO, performance media, content, and web experiences — engineered to compound.",
    primary: "Book a free consultation",
    secondary: "View services",
    scroll: "Scroll to explore",
    watermark: "growth",
  },
  why: {
    eyebrow: "Why digital marketing",
    heading: ["Visibility is ", "no longer optional."] as Heading,
    lede: "Today, being found online is not a choice — it is the cost of entry for any business that intends to grow.",
    paragraphs: [
      "Your next customer is already searching, scrolling, and comparing — long before they walk through a door or pick up the phone. Digital marketing puts your brand in that moment, at a fraction of what traditional media costs, and with every taka accounted for.",
      "It is also the only channel that reports back. Every campaign returns data on how customers behave, what they respond to, and where the next opportunity sits. That feedback loop turns marketing from an expense into a compounding asset — and it is why the businesses winning online in Bangladesh treat it as core infrastructure, not decoration.",
    ],
  },
  industries: {
    eyebrow: "Who we serve",
    heading: ["Eight industries. One goal: ", "own your niche."] as Heading,
    lede: "Every market has its own buying journey. We have run it, measured it, and won it — in each of these.",
  },
  services: {
    eyebrow: "What we do",
    heading: ["Every channel. One number that matters: ", "yours."] as Heading,
    all: "Explore all services",
    watermark: "services",
  },
  playbook: {
    eyebrow: "The playbook",
    heading: ["How each channel ", "earns its keep."] as Heading,
    lede: "No black boxes. This is the work, in depth — what we do, why it compounds, and how it is measured.",
  },
  brand: {
    eyebrow: "Brand & web",
    heading: ["Identity, designed ", "to convert."] as Heading,
    paragraphs: [
      "Your brand identity is what sets you apart and resonates with your audience — values, mission, personality, and the visual system that carries them. We build it end to end, from the mark on your letterhead to the site that closes the sale.",
      "Every piece is held to the same standard: does it look like you, and does it move the number.",
    ],
  },
  studio: {
    eyebrow: "In-house studio",
    heading: ["Visuals that sell ", "before you speak."] as Heading,
    lede: "Our own video studio and editing team — so your product never waits on a third party to look its best.",
  },
  testimonials: {
    eyebrow: "Client words",
    heading: ["They said it ", "better."] as Heading,
  },
  pricing: {
    eyebrow: "Pricing",
    heading: ["Plans that scale ", "with your ambition."] as Heading,
    lede: "Transparent retainers — no lock-in, no surprises. Pay monthly, or commit to a year and keep 20%. Start where you are and move up the moment the numbers say so.",
    footnote: "Every plan starts with a free consultation. Prices in BDT, excluding ad spend and VAT.",
    monthly: "Monthly",
    annual: "Annual",
    period: "Billing period",
  },
  cta: {
    eyebrow: "Partnership",
    heading: ["Make Leotech your ", "growth partner."] as Heading,
    paragraphs: [
      "We are committed to results that speak for themselves. Rigorous tracking, analysis, and optimization keep every engagement aligned with your objectives — more traffic, higher conversion, stronger brand visibility. Outcomes you can point to in a board meeting.",
      "At the core is client satisfaction: we go beyond the brief to understand your business, exceed expectations, and build partnerships on trust, transparency, and integrity.",
    ],
    bandEyebrow: "Free consultation — Saturday to Thursday",
    bandHeading: ["Your competitors hope ", "you’ll wait."] as Heading,
    button: "Book a free consultation",
  },
  contact: {
    call: "Call",
    write: "Write",
    visit: "Visit",
    callNote: "We answer Saturday to Thursday, 10:00–18:00.",
    writeNote: "We reply within 8 hours on business days.",
    visitNote: "Come see us, Saturday to Thursday, 10:00–18:00.",
  },
};

// ── Interface strings ───────────────────────────────────────────────────
export const ui = {
  meta: {
    title: "Leotech — Marketing that creates market leaders",
    description:
      "Leotech is the digital marketing partner behind Bangladesh's ambitious brands. SEO, performance media, content, and web experiences — engineered to compound.",
    servicesTitle: "Digital marketing services",
    servicesDescription:
      "SEO, Meta and Google Ads, email, influencer marketing, content, web and online PR — Leotech's digital marketing services for ambitious Bangladeshi brands.",
    ogLocale: "en_US",
  },
  nav: {
    home: "Home",
    getStarted: "Get started",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skip: "Skip to content",
    homeLabel: "Leotech home",
    primary: "Primary",
  },
  menu: {
    tagline: "Digital marketing",
    back: "Back",
    exploreAll: "Explore all",
    motion: "Motion",
    on: "on",
    off: "off",
    dialog: "Site menu",
    book: "Book a free consultation",
    city: "Leotech · Dhaka",
    defaultCaption: "Marketing that creates market leaders.",
    previews: {
      home: "Marketing that creates market leaders.",
      services: "Every channel. One number that matters.",
      industries: "Built for the way your customers buy.",
      playbook: "How we plan, launch and optimise.",
      studio: "Product stills, films and explainers.",
      pricing: "Plans that scale with you.",
      contact: "Talk to a strategist this week.",
    },
  },
  language: { label: "Select language", name: "English" },
  footer: {
    tagline: "The digital marketing partner behind Bangladesh’s ambitious brands.",
    services: "Services",
    company: "Company",
    contact: "Contact",
    about: "About",
    studio: "Studio",
    clients: "Clients",
    playbook: "Playbook",
    allServices: "All services",
    address: "69/J Panthapath, Dhaka 1216",
  },
  services: {
    breadcrumbHome: "Home",
    breadcrumbServices: "Services",
    indexTitle: ["Every channel, ", "one plan."] as Heading,
    indexLede:
      "From search and social to content and web, each service is run against the one number that matters to your business. Pick a channel to see how we work.",
    empty: "Our services are being updated. Please check back shortly.",
    learnMore: "Learn more",
    defaultCta: "Book a free consultation",
    from: ["From ", ""] as Heading,
    whatYouGet: "What you get",
    howWeWork: ["How we ", "work."] as Heading,
    faq: ["Questions, ", "answered."] as Heading,
    related: "Pairs well with",
    allServices: "All services →",
    ctaHeading: ["Ready to grow with ", "?"] as Heading,
    ctaNote: "Free 30-minute strategy call. No obligation.",
  },
  notFound: {
    code: "Error 404",
    title: "This page wandered off.",
    body: "The link may be old, or the page may have moved. Try one of these instead.",
    home: "Home",
    services: "Services",
  },
};
