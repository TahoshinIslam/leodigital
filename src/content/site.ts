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

export const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#industries", label: "Industries" },
  { href: "#playbook", label: "Playbook" },
  { href: "#studio", label: "Studio" },
  { href: "#contact", label: "Contact" },
];

export const contact = {
  phones: ["01730 594391", "01730 594393"],
  email: "info@leotechbd.com",
  address: ["House 69/J, Panthapath,", "Dhaka 1216"],
};
