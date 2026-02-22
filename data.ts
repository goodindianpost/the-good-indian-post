import { Article, Category } from './types';

// 1. Long Form Narrative (feature stories)
const CONTENT_NARRATIVE = `
  <p class="lead text-xl md:text-2xl font-serif italic text-gray-600 mb-8">
    It started with a whisper in the crowded halls of the festival, but by the time the credits rolled, it was a roar. Indian cinema had arrived, not as a guest, but as a host.
  </p>
  <p>The auditorium was pitch black, save for the flickering light of the projector cutting through the dust motes. In Cannes, the air is usually thick with pretension and expensive perfume, but tonight, it smelled of anticipation.</p>
  <p>For decades, "Indian Cinema" was a monolithic label applied by the West to a diverse subcontinent of storytelling. It meant song and dance; it meant three-hour runtimes; it meant melodrama. But the film unreeling before the jury today was none of those things. It was silence. It was grit. It was the unvarnished reality of rural silence.</p>
  
  <h2 class="mt-12 mb-6 text-3xl font-display font-bold text-brand-black">Breaking the Mold</h2>
  <p>Director R.K. Varma sits across from me in a cafe the next morning, looking less like a revolutionary and more like a tired graduate student. "We aren't trying to destroy Bollywood," he says, stirring his espresso. "We are trying to expand the vocabulary of what Indian stories can be."</p>
  
  <blockquote class="my-10 pl-6 border-l-4 border-brand-red font-display text-2xl md:text-3xl italic text-brand-black bg-gray-50 py-8 pr-4 rounded-r-lg">
    "The audience is ready. They have been ready for years. It was the gatekeepers who were afraid of subtitles."
  </blockquote>

  <p>The statistics back him up. Streaming platforms have democratized access. A thriller set in a Kerala village is now binge-watched in Brazil. A romance in Kolkata finds fans in Korea. The barrier of language is dissolving under the weight of human emotion.</p>

  <h3 class="mt-8 mb-4 text-2xl font-display font-bold">The Economics of Art</h3>
  <p>However, art needs funding. The shift isn't just creative; it's financial. Independent producers are finding co-production treaties with France, Germany, and the UK. </p>
  <ul class="list-disc list-outside pl-6 my-6 space-y-2 text-gray-700 font-serif">
    <li><strong>Co-productions:</strong> 40% increase in Indo-European partnerships in 2023.</li>
    <li><strong>Festival Circuit:</strong> Record number of entries at Sundance and Berlin.</li>
    <li><strong>Streaming Rights:</strong> Bidding wars are becoming common for non-Hindi content.</li>
  </ul>
  <p>As we leave the cafe, Varma puts on his sunglasses. "The sun is bright," he says, pointing at the Riviera skyline. "But the shadow we cast is getting longer."</p>
`;

// 2. Q&A / Interview Style
const CONTENT_INTERVIEW = `
  <p><strong>The Good Indian Post:</strong> You’ve been called the "conscience of Silicon Valley." Is that a heavy burden to carry?</p>
  <p><strong>Vikram Sethi:</strong> [Laughs] It’s a headline, not a job title. I’m just an engineer who read too much philosophy in college. But seriously, if asking "should we build this?" before asking "can we build this?" makes me a conscience, then the bar is too low.</p>

  <p><strong>TGIP:</strong> Let’s talk about the Community AI initiative. What was the catalyst?</p>
  <p><strong>Sethi:</strong> I saw my grandmother struggling to use a voice assistant. It couldn't understand her accent, her syntax. It wasn't built for her. It was built for a 25-year-old in San Francisco. That exclusionary design is what we are fighting.</p>

  <figure class="my-12">
    <img src="https://picsum.photos/800/400?grayscale" alt="Vikram Sethi in his office" class="w-full h-auto rounded-sm shadow-sm" />
    <figcaption class="text-center text-xs text-gray-500 mt-3 font-sans uppercase tracking-widest">Vikram Sethi at the OpenAI Summit, 2023.</figcaption>
  </figure>

  <p><strong>TGIP:</strong> Many argue that speed is essential in tech. That regulation kills innovation.</p>
  <p><strong>Sethi:</strong> That’s a false dichotomy. Seatbelts didn't kill the automotive industry; they made it sustainable. We are building the seatbelts for the mind.</p>

  <hr class="my-12 border-gray-200 w-1/3 mx-auto" />

  <p><strong>TGIP:</strong> What is your advice to young Indian engineers moving to the Valley today?</p>
  <p><strong>Sethi:</strong> Don't just bring your coding skills. Bring your culture. Bring your context. The Valley is an echo chamber. Be the noise that disrupts the signal.</p>
`;

// 3. Visual / Descriptive (Culture/Fashion)
const CONTENT_VISUAL = `
  <p>The loom clatters—a rhythmic, wooden heartbeat that has echoed through the village of Phulia for five hundred years. Here, time is measured not in hours, but in threads.</p>
  
  <p>Weaving is often romanticized, but the reality is visceral. It is the smell of raw cotton, the stain of indigo on fingertips, and the humidity required to keep the yarn pliable. In this humidity, a revolution is brewing.</p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
    <div class="bg-gray-50 p-4 border border-gray-100">
        <h4 class="font-bold text-sm uppercase tracking-widest mb-2 text-brand-red">The Warp</h4>
        <p class="text-sm">The vertical threads, representing the structure, the tradition, and the unyielding history of the craft.</p>
    </div>
    <div class="bg-gray-50 p-4 border border-gray-100">
        <h4 class="font-bold text-sm uppercase tracking-widest mb-2 text-brand-red">The Weft</h4>
        <p class="text-sm">The horizontal threads, representing the innovation, the color, and the new generation of designers.</p>
    </div>
  </div>

  <h2 class="text-3xl font-display font-bold mb-6">Sustainable by Necessity</h2>
  <p>For the West, "sustainable fashion" is a trend. For the weavers of Bengal, it is survival. Nothing is wasted. The dye runoff is treated naturally. The cotton is sourced locally.</p>
  
  <p>Designer Anita Dongre, who sources heavily from this region, explains: " Luxury is no longer about the logo. It is about the hand. When you wear a Jamdani sari, you are wearing six months of a human being's life. That is the ultimate luxury."</p>
  <p>The challenge now is convincing the global market to pay for that time.</p>
`;

// 4. Listicle / Quick Read
const CONTENT_LISTICLE = `
  <p>The urban water crisis is no longer a distant dystopian threat; it is the reality of our summers. However, necessity breeds invention. Here are three Indian startups turning the tide.</p>

  <div class="space-y-12 mt-8">
    
    <div>
      <h3 class="text-2xl font-display font-bold text-brand-black mb-2">1. Uravu Labs</h3>
      <p class="font-bold text-xs uppercase tracking-widest text-brand-gold mb-4">Technology: Atmospheric Water Generation</p>
      <p>Imagine a bottle that fills itself from thin air. Uravu uses renewable energy to extract moisture from the atmosphere, creating 100% potable water with zero groundwater depletion. Their solar-powered hydropanels are currently being piloted in hospitality sectors across Bangalore.</p>
    </div>

    <div>
      <h3 class="text-2xl font-display font-bold text-brand-black mb-2">2. Boson White Water</h3>
      <p class="font-bold text-xs uppercase tracking-widest text-brand-gold mb-4">Technology: Wastewater Recovery</p>
      <p>Apartment complexes waste thousands of liters of water daily. Boson installs decentralized treatment plants that convert STP (Sewage Treatment Plant) water into high-quality potable water, closing the loop for residential communities.</p>
    </div>

    <div>
      <h3 class="text-2xl font-display font-bold text-brand-black mb-2">3. Digital Paani</h3>
      <p class="font-bold text-xs uppercase tracking-widest text-brand-gold mb-4">Technology: IoT Management</p>
      <p>You can't save what you can't measure. Digital Paani uses IoT sensors to monitor water infrastructure in real-time, detecting leaks and inefficiencies that usually go unnoticed for months.</p>
    </div>

  </div>

  <p class="mt-8 italic text-gray-500">Disclosure: The author has no financial interest in the companies mentioned above.</p>
`;

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    slug: 'future-of-indian-cinema-global-stage',
    title: 'The Unstoppable Rise of Indian Cinema on the Global Stage',
    subtitle: 'How a new generation of filmmakers is breaking stereotypes and box office records worldwide.',
    category: Category.FILM,
    author: 'Anjali Sharma',
    publishDate: '2023-10-24',
    excerpt: 'From Cannes to the Oscars, Indian storytelling is finding a universal audience. We sit down with three visionary directors leading the charge.',
    content: CONTENT_NARRATIVE,
    imageUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop',
    featured: true,
    trending: true,
  },
  {
    id: '2',
    slug: 'tech-titans-silicon-valley',
    title: 'The Good Indians of Silicon Valley',
    subtitle: 'Profiling the unsung heroes focusing on ethical AI and community building.',
    category: Category.GLOBAL_INDIANS,
    author: 'Vikram Sethi',
    publishDate: '2023-10-22',
    excerpt: 'Beyond the CEO headlines, a quiet revolution of community-driven leadership is taking place in the Bay Area.',
    content: CONTENT_INTERVIEW,
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
    featured: true,
    trending: true,
  },
  {
    id: '3',
    slug: 'reviving-ancient-literary-traditions',
    title: 'Reviving Ancient Literary Traditions in Modern Prose',
    category: Category.LITERATURE,
    author: 'Meera Nair',
    publishDate: '2023-10-20',
    excerpt: 'Contemporary authors are weaving Sanskrit epics into modern thrillers, creating a genre all their own.',
    content: CONTENT_NARRATIVE, // Reusing narrative structure for literature
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2070&auto=format&fit=crop',
    featured: false,
    trending: false,
  },
  {
    id: '4',
    slug: 'sustainable-fashion-weaving-future',
    title: 'Weaving the Future: Sustainable Fashion in rural Bengal',
    category: Category.CULTURE,
    author: 'Sanjay Gupta',
    publishDate: '2023-10-18',
    excerpt: 'Handloom weavers are partnering with global designers to save a dying art form while protecting the planet.',
    content: CONTENT_VISUAL,
    imageUrl: 'https://images.unsplash.com/photo-1606103920295-9a091573f160?q=80&w=2070&auto=format&fit=crop',
    featured: false,
    trending: true,
  },
  {
    id: '5',
    slug: 'startups-solving-water-crisis',
    title: 'Three Startups Solving the Urban Water Crisis',
    category: Category.GOOD_INDIANS,
    author: 'Priya Desai',
    publishDate: '2023-10-15',
    excerpt: 'Innovation meets necessity as young entrepreneurs tackle one of India’s most pressing challenges.',
    content: CONTENT_LISTICLE,
    imageUrl: 'https://images.unsplash.com/photo-1538300342682-cf57afb97285?q=80&w=2048&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '6',
    slug: 'economic-policy-2024',
    title: 'Understanding the New Economic Policies for 2024',
    category: Category.NEWS,
    author: 'Rajesh Kumar',
    publishDate: '2023-10-25',
    excerpt: 'A deep dive into the fiscal changes expected to impact small businesses and exports next quarter.',
    content: CONTENT_NARRATIVE,
    imageUrl: 'https://images.unsplash.com/photo-1526304640152-d4619684e484?q=80&w=2070&auto=format&fit=crop',
    featured: false,
    trending: true,
  },
  {
    id: '7',
    slug: 'diaspora-diaries-london',
    title: 'Diaspora Diaries: The Changing Face of Southall',
    category: Category.GLOBAL_INDIANS,
    author: 'Sarah Jenkins',
    publishDate: '2023-10-12',
    excerpt: 'How gentrification and a new wave of migration are reshaping London’s historic Indian neighborhood.',
    content: CONTENT_VISUAL,
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '8',
    slug: 'classical-music-renaissance',
    title: 'The Renaissance of Hindustani Classical Music',
    category: Category.CULTURE,
    author: 'Amitabh Ray',
    publishDate: '2023-10-10',
    excerpt: 'Streaming platforms are introducing ragas to Gen Z, sparking a surprising revival in concert attendance.',
    content: CONTENT_NARRATIVE,
    imageUrl: 'https://images.unsplash.com/photo-1514119910136-38d9d30dcadc?q=80&w=2070&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '9',
    slug: 'mumbai-street-food-revolution',
    title: 'Mumbai Street Food Goes Gourmet: A Culinary Revolution',
    category: Category.CULTURE,
    author: 'Priya Sharma',
    publishDate: '2023-10-08',
    excerpt: 'Michelin-trained chefs are reimagining vada pav and pani puri for fine dining tables around the world.',
    content: CONTENT_VISUAL,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070&auto=format&fit=crop',
    featured: false,
    trending: true,
  },
  {
    id: '10',
    slug: 'indian-space-program-mars',
    title: 'India\'s Next Giant Leap: The Road to Mars',
    category: Category.NEWS,
    author: 'Arun Krishnan',
    publishDate: '2023-10-06',
    excerpt: 'ISRO\'s ambitious interplanetary mission could redefine what developing nations can achieve in space exploration.',
    content: CONTENT_NARRATIVE,
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '11',
    slug: 'bollywood-ott-transformation',
    title: 'How OTT Platforms Are Transforming Bollywood Storytelling',
    category: Category.FILM,
    author: 'Karan Mehta',
    publishDate: '2023-10-04',
    excerpt: 'With no intermission and no censors, streaming is unleashing a new wave of bold Indian narratives.',
    content: CONTENT_NARRATIVE,
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop',
    featured: false,
    trending: true,
  },
  {
    id: '12',
    slug: 'indian-women-cricket-rise',
    title: 'The Unstoppable Rise of Indian Women\'s Cricket',
    category: Category.NEWS,
    author: 'Sneha Patel',
    publishDate: '2023-10-02',
    excerpt: 'Record viewership, equal pay debates, and a generation of fearless athletes changing the game.',
    content: CONTENT_INTERVIEW,
    imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2067&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '13',
    slug: 'kerala-model-healthcare',
    title: 'The Kerala Model: Lessons in Public Healthcare',
    category: Category.GOOD_INDIANS,
    author: 'Dr. Thomas Mathew',
    publishDate: '2023-09-30',
    excerpt: 'How a small state achieved health outcomes rivaling developed nations on a fraction of the budget.',
    content: CONTENT_LISTICLE,
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '14',
    slug: 'indian-architects-global-stage',
    title: 'Indian Architects Reshaping Global Skylines',
    category: Category.GLOBAL_INDIANS,
    author: 'Neha Reddy',
    publishDate: '2023-09-28',
    excerpt: 'From Dubai to New York, a new generation of Indian architects is leaving an indelible mark on world cities.',
    content: CONTENT_VISUAL,
    imageUrl: 'https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=2187&auto=format&fit=crop',
    featured: false,
    trending: true,
  },
  {
    id: '15',
    slug: 'contemporary-indian-art-auction',
    title: 'Contemporary Indian Art Breaks Auction Records',
    category: Category.CULTURE,
    author: 'Rohit Malhotra',
    publishDate: '2023-09-26',
    excerpt: 'Christie\'s and Sotheby\'s are witnessing unprecedented demand for works by Indian artists.',
    content: CONTENT_NARRATIVE,
    imageUrl: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?q=80&w=2069&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '16',
    slug: 'indian-language-tech-boom',
    title: 'The Vernacular Tech Boom: Building for Bharat',
    category: Category.NEWS,
    author: 'Amit Verma',
    publishDate: '2023-09-24',
    excerpt: 'Startups are finally cracking the code to reach India\'s next 500 million internet users in their own languages.',
    content: CONTENT_LISTICLE,
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '17',
    slug: 'indian-chefs-michelin-stars',
    title: 'Indian Chefs Earning Michelin Stars Worldwide',
    category: Category.GLOBAL_INDIANS,
    author: 'Maya Krishnamurthy',
    publishDate: '2023-09-22',
    excerpt: 'From London to Singapore, Indian cuisine is finally getting the fine dining recognition it deserves.',
    content: CONTENT_INTERVIEW,
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '18',
    slug: 'regional-cinema-golden-age',
    title: 'Regional Cinema\'s Golden Age: Beyond Bollywood',
    category: Category.FILM,
    author: 'Sridhar Iyer',
    publishDate: '2023-09-20',
    excerpt: 'Malayalam, Tamil, and Telugu films are outperforming Hindi cinema at the box office.',
    content: CONTENT_NARRATIVE,
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '19',
    slug: 'indian-climate-activists',
    title: 'Young Indian Climate Activists Leading the Charge',
    category: Category.GOOD_INDIANS,
    author: 'Aisha Khan',
    publishDate: '2023-09-18',
    excerpt: 'Meet the Gen Z activists taking on corporations and governments to protect India\'s environment.',
    content: CONTENT_INTERVIEW,
    imageUrl: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=2070&auto=format&fit=crop',
    featured: false,
    trending: true,
  },
  {
    id: '20',
    slug: 'indian-podcasts-revolution',
    title: 'The Indian Podcast Revolution: Voices Finding Their Audience',
    category: Category.CULTURE,
    author: 'Ravi Shankar',
    publishDate: '2023-09-16',
    excerpt: 'True crime, mythology, and political commentary—Indian podcasters are creating a new media landscape.',
    content: CONTENT_NARRATIVE,
    imageUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=2070&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '21',
    slug: 'indie-music-scene-india',
    title: 'India\'s Indie Music Scene Finally Gets Its Moment',
    category: Category.CULTURE,
    author: 'Tanya Bhatia',
    publishDate: '2023-09-14',
    excerpt: 'From bedroom producers to sold-out festivals, independent music in India is having its breakthrough.',
    content: CONTENT_VISUAL,
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '22',
    slug: 'indian-education-reform',
    title: 'Reimagining Education: India\'s Bold New Curriculum',
    category: Category.NEWS,
    author: 'Dr. Sunita Rao',
    publishDate: '2023-09-12',
    excerpt: 'The National Education Policy promises to transform how 250 million students learn.',
    content: CONTENT_LISTICLE,
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '23',
    slug: 'indian-designers-fashion-week',
    title: 'Indian Designers Take Over International Fashion Weeks',
    category: Category.CULTURE,
    author: 'Divya Kapoor',
    publishDate: '2023-09-10',
    excerpt: 'From Paris to Milan, Indian aesthetics are influencing global fashion trends.',
    content: CONTENT_VISUAL,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2032&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '24',
    slug: 'indian-documentary-filmmakers',
    title: 'Truth Tellers: India\'s Documentary Renaissance',
    category: Category.FILM,
    author: 'Nandita Das',
    publishDate: '2023-09-08',
    excerpt: 'A new wave of documentary filmmakers is shining light on stories mainstream media ignores.',
    content: CONTENT_NARRATIVE,
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '25',
    slug: 'mental-health-india-startups',
    title: 'Breaking the Stigma: Mental Health Startups in India',
    category: Category.GOOD_INDIANS,
    author: 'Dr. Arjun Menon',
    publishDate: '2023-09-06',
    excerpt: 'Tech-enabled therapy platforms are making mental healthcare accessible to millions.',
    content: CONTENT_LISTICLE,
    imageUrl: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?q=80&w=2090&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '26',
    slug: 'indian-writers-english-literature',
    title: 'The New Guard: Indian Writers Dominating English Literature',
    category: Category.LITERATURE,
    author: 'Shobha De',
    publishDate: '2023-09-04',
    excerpt: 'Booker Prize shortlists are increasingly featuring Indian names and Indian stories.',
    content: CONTENT_NARRATIVE,
    imageUrl: 'https://images.unsplash.com/photo-1474366521946-c3d4b507abf2?q=80&w=2069&auto=format&fit=crop',
    featured: false,
    trending: true,
  },
  {
    id: '27',
    slug: 'indian-gaming-industry',
    title: 'Game On: India\'s Billion-Dollar Gaming Industry',
    category: Category.NEWS,
    author: 'Rohan Joshi',
    publishDate: '2023-09-02',
    excerpt: 'Mobile gaming and esports are turning India into a global entertainment powerhouse.',
    content: CONTENT_LISTICLE,
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=2065&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '28',
    slug: 'indian-yoga-teachers-global',
    title: 'Indian Yoga Teachers Building Wellness Empires Abroad',
    category: Category.GLOBAL_INDIANS,
    author: 'Lakshmi Venkatesh',
    publishDate: '2023-08-30',
    excerpt: 'From LA to London, Indian yoga gurus are leading the global wellness movement.',
    content: CONTENT_INTERVIEW,
    imageUrl: 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=2064&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '29',
    slug: 'poetry-renaissance-india',
    title: 'The Poetry Renaissance: Verse Goes Viral in India',
    category: Category.LITERATURE,
    author: 'Kavita Sharma',
    publishDate: '2023-08-28',
    excerpt: 'Instagram poets and spoken word artists are bringing poetry back to the masses.',
    content: CONTENT_NARRATIVE,
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '30',
    slug: 'indian-graphic-novels',
    title: 'Indian Graphic Novels: A New Visual Language',
    category: Category.LITERATURE,
    author: 'Arjun Menon',
    publishDate: '2023-08-26',
    excerpt: 'Comics and graphic novels are emerging as powerful tools for storytelling in India.',
    content: CONTENT_VISUAL,
    imageUrl: 'https://images.unsplash.com/photo-1588497859490-85d1c17db96d?q=80&w=2070&auto=format&fit=crop',
    featured: false,
  },
  {
    id: '31',
    slug: 'translation-boom-indian-literature',
    title: 'The Translation Boom: Regional Voices Go Global',
    category: Category.LITERATURE,
    author: 'Priya Krishnamurthy',
    publishDate: '2023-08-24',
    excerpt: 'Translators are bridging the gap between India\'s rich regional literatures and global readers.',
    content: CONTENT_INTERVIEW,
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098&auto=format&fit=crop',
    featured: false,
  }
];

export const getArticleBySlug = (slug: string): Article | undefined => {
  return MOCK_ARTICLES.find(article => article.slug === slug);
};

export const getArticlesByCategory = (category: string): Article[] => {
  return MOCK_ARTICLES.filter(article => article.category === category);
};

export const getFeaturedArticles = (): Article[] => {
  return MOCK_ARTICLES.filter(article => article.featured);
};

export const getTrendingArticles = (): Article[] => {
  return MOCK_ARTICLES.filter(article => article.trending).slice(0, 5);
};
