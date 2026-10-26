/* ---------- edit your content here ---------- */
export const ME = {
  name: "Marvelous Rose",
  full: "Akorede Rose Marvelous",
  handle: "@marvelousrose02",
  instagram: "https://instagram.com/marvelousrose02",
  github: "https://github.com/rhose1234",
  x: "https://x.com/RoseMarvelous4",
  linkedin: "https://www.linkedin.com/in/rose-marvelous/",
  facebook: "https://web.facebook.com/profile.php?id=100070538305621",
  tiktok: "https://www.tiktok.com/@marvelousrose02",
  email: "himarvelousrose@gmail.com",
  calendly: "https://calendly.com/marvelousrhose",
};

export type Stat = { n: number; s: string; l: string };
export type Role = { title: string; description: string };
export type Project = { title: string; description: string; link: string; image: string; category: 'websites' | 'java' };
export type UgcVideo = { src: string; cover: string; title?: string };
export type UgcBrand = { slug: string; name: string; description: string; code?: string; codeLink?: string; logo: string; logoBg: string; videos: UgcVideo[] };

export const STATS: Stat[] = [
  { n: 10, s: "+", l: "Client websites shipped" },
  { n: 200, s: "+", l: "Video Contents" },
  { n: 4, s: "", l: "Brands for UGC" },
];

export const TOOLS = ["Next.js", "React js", "Javascript", "TypeScript", "Tailwind", "Bootstrap", "HTML", "CSS", "Wordpress", "Shopify", "Java", "MSSQL", ];

export const UGC_SKILLS = ["Content Creator", "UGC Creator", "User-Generated Content"];

export const ROLES: Role[] = [
  { title: "Software Engineer", description: "Growing as a software engineer, building functional applications with JavaScript, Java, and MySQL." },
  { title: "Web Developer", description: "Helping business owners build functional websites and web apps for their businesses on the internet." },
  { title: "UGC Creator", description: "Creating relatable short-form video content that helps brands connect with their audiences." },
];

export const WORK: Project[] = [
  { title: "AdaTheVA HealthTech Academy", description: "A training academy preparing people for remote healthcare careers, from medical virtual assistance to telehealth.", link: "https://adathevahealthtech.com/", image: "/images/project3.png", category: "websites" },
  { title: "Fortomo International", description: "An online store for genuine tyres, batteries and automotive parts, with free delivery in Lagos.", link: "https://www.fortomointl.com/", image: "/images/Project1.png", category: "websites" },
  { title: "Emry Designs", description: "An interior design studio's website for showcasing their spaces and booking consultations.", link: "https://emrydesignstudio.com/", image: "/images/project2.png", category: "websites" },
  { title: "BrookSide Supports", description: "Concierge nursing and in-home healthcare support for individuals and families across Ottawa, Ontario.", link: "https://www.brooksidesupport.ca/", image: "/images/project4.png", category: "websites" },
  { title: "MESKTOMO Logistics", description: "Logistics, warehousing and supply chain solutions across Nigeria and international markets.", link: "https://mesktomolog.com/", image: "/images/project 5.png", category: "websites" },
];

/* Client reviews, shown one at a time in the "Feedbacks" section. Only real reviews from real clients, in their own words.
   Separate paragraphs in a quote with a blank line (\n\n). Add one like:
   { name: "Client name", company: "Their company", service: "Website", quote: "…", rating: 5, source: "Google" } */
export const GOOGLE_REVIEWS = "https://share.google/m1TjFz4xjgbHpVgRb";
export type Review = { name: string; company?: string; service: string; quote: string; rating?: number; date?: string; source?: string };
export const REVIEWS: Review[] = [
  {
    name: "Adaobi Iloduba",
    service: "Website",
    quote: "Huge thanks to Rose for bringing my vision to life! The website turned out clean, modern, and so intuitive for my students and visitors. From communication to execution, the delivery was smooth, professional and on point. I couldn't be happier with the outcome. I give a 10/10 recommendation!",
    rating: 5,
    source: "Google",
  },
  {
    name: "Olatunbosun Adebola",
    service: "Website",
    quote: "Her communication, professionalism, and commitment to delivering quality work really stood out. I would highly recommend her to anyone looking for a skilled and reliable website developer. She did an amazing job, and we truly appreciate her effort!",
    rating: 5,
    source: "Google",
  },
  {
    name: "Victor Opara",
    service: "Business website",
    quote: "While looking for a web designer to create my business website, I saw Marvelous and my first impression was that she will deliver and truly she did. From the start she was very responsive, knowledgeable and professional. The work was done highest standard and with precision. I have a website that is functional, appealing and presentable. Thanks to Marvelous.",
    rating: 5,
    source: "Google",
  },
  {
    name: "Ayodeji Akiwowo",
    service: "Portfolio",
    quote: "Marvelous delivered a 5* personal website! She was responsive and took time to identify my requirements for the website. She was also timely in responding to slight changes and updates as required.\n\nThank you very much Marvelous!",
    rating: 5,
    source: "Google",
  },
  {
    name: "Amaka Mercy",
    service: "Web design",
    quote: "Marvelous is so lovely to work with and she did an excellent job with my web design",
    rating: 5,
    source: "Google",
  },
];

/* Your UGC rate card, shown at /rate-card. While RATES is empty the page says rates are on request.
   Add a package like: { name: "Starter", price: "₦50,000", description: "One video to test the waters", includes: ["1 UGC video (up to 60s)", "1 revision"], featured: false } */
export type RatePackage = { name: string; price: string; description?: string; includes: string[]; featured?: boolean };
export const RATES: RatePackage[] = [
  { name: "Basic", price: "₦100,000", includes: ["1 video (15–60 sec)", "1 story upload"] },
  { name: "Standard", price: "₦200,000", includes: ["2 videos (15–60 sec)", "2 story uploads"] },
  { name: "Premium", price: "₦400,000", includes: ["3 videos (60–90 sec)", "2 photo posts", "3 story uploads"] },
];
/* Terms shown under the packages, added like: { title: "Turnaround", text: "5–7 working days from the brief." } */
export type RateNote = { title: string; text: string };
export const RATE_NOTES: RateNote[] = [
  { title: "Payment before production", text: "After our clarity call, full payment or a deposit is made before I start creating your videos." },
  { title: "Organic use only", text: "Videos in these packages are for organic posting and can't be used to run ads." },
  { title: "Ads are charged separately", text: "Want to run a video as an ad? Ad usage is a separate cost, based on how long you'll run it for." },
  { title: "Posted on all my socials", text: "When I post on my page, it goes out on X, Instagram, Facebook and TikTok." },
  { title: "Your brand gets credit", text: "Every post tags your brand, or adds you as a collaborator where the platform allows it." },
];

/* UGC brands. The description shows on the hanging card and the brand's page; the logo (public/images/ugc/) on the card's back, over logoBg; code is an optional sign-up code, codeLink its referral link.
   Videos and their covers go in public/videos/<slug>/, added like:
   { src: "/videos/cleva/1.mp4", cover: "/videos/cleva/1.jpg", title: "Sending money home" } */
export const UGC_BRANDS: UgcBrand[] = [
  { slug: "cleva", name: "Cleva", description: "A fintech banking app that allows you to receive cross-border payments seamlessly.", code: "ROSE851", codeLink: "https://app.getcleva.com/refer/ROSE851", logo: "/images/ugc/cleva.png", logoBg: "#000000", videos: [] },
  { slug: "codebridge-hub", name: "Codebridge Hub", description: "An ed-tech platform where you can learn any tech skill.", logo: "/images/ugc/codebridge-hub.png", logoBg: "#ffffff", videos: [] },
  { slug: "collan", name: "Collan", description: "A community networking platform and shared workspace built for developers, UI/UX designers, tech founders and more.", logo: "/images/ugc/collan.png", logoBg: "#f9f9f9", videos: [] },
];
/* --------------------------------------------- */
