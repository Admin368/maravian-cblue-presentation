interface MalawiSlide {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  images: string[];
  keyPoints: string[];
  practicalTips: string[];
  culturalComparisons: string[];
  questions?: Array<{
    question: string;
    answer: string;
    type: "comprehension" | "comparison" | "practical" | "critical";
  }>;
}

export const malawiSlides: MalawiSlide[] = [
  {
    id: "introduction",
    title: "Introduction to Malawi",
    subtitle: "The Warm Heart of Africa",
    icon: "mappin",
    images: [
      "https://maravianwebservices.com/images/photos/cblue/malawi4.gif", // Malawi map highlighting location in Africa
      "https://files.maravianwebservices.com/paul_photos/malawi/thumbnails/tn_istockphoto-1434636372-612x612.jpg", // Flag of Malawi
      "https://files.maravianwebservices.com/paul_photos/malawi/thumbnails/tn_maxresdefault.jpg", // Welcome sign or airport arrival scene
      "https://files.maravianwebservices.com/paul_photos/malawi/thumbnails/tn_City-of-Blantyre-Malawi.jpg", // Comparison map showing Malawi vs China size
    ],
    keyPoints: [
      "Location: Southeast Africa, landlocked country",
      "Population: ~20 million people",
      "Capital: Lilongwe, Blantyre (commercial)",
      "Known as 'The Warm Heart of Africa'",
    ],
    practicalTips: [
      "Much smaller than China (similar to Henan province)",
      "English-speaking country (former British colony)",
      // "Peaceful, stable democracy",
      "Very different climate and landscape from most of China",
    ],
    culturalComparisons: [
      "Size comparison: Malawi is about 1/80th the size of China",
      "Population density similar to some Chinese provinces",
      // "Diffe",
      "Tropical climate vs diverse climate zones in China",
    ],
    questions: [
      {
        question:
          "What is Malawi known as, and why do you think it has this nickname?",
        answer:
          "The Warm Heart of Africa - because of the friendly, welcoming nature of Malawian people",
        type: "comprehension",
      },
      {
        question:
          "How does the size of Malawi compare to China? What challenges might this create for business?",
        answer:
          "Malawi is much smaller (1/80th), creating challenges like smaller markets, limited resources, but easier logistics",
        type: "comparison",
      },
    ],
  },
  {
    id: "arrival",
    title: "Arrival - What to Expect",
    subtitle: "Airport, Immigration, First Steps",
    icon: "plane",
    images: [
      "https://files.maravianwebservices.com/paul_photos/malawi/thumbnails/tn_kamuzu-international1.jpg", // Kamuzu International Airport exterior/interior
      "https://files.maravianwebservices.com/paul_photos/malawi/thumbnails/tn_kamuzu-international.jpg", // Immigration checkpoint
      "https://files.maravianwebservices.com/paul_photos/malawi/thumbnails/tn_e35ca00a-9ec0-44c3-be56-39984d163209_1280x850.jpg", // Taxi/bus transportation options
      "https://files.maravianwebservices.com/paul_photos/malawi/thumbnails/tn_sososo.jpg", // Taxi/bus transportation options
      "https://files.maravianwebservices.com/paul_photos/malawi/thumbnails/tn_capital-7.jpg", // Hotel/accommodation examples
      "https://files.maravianwebservices.com/paul_photos/malawi/thumbnails/tn_capital3.jpg", // Hotel/accommodation examples
    ],
    keyPoints: [
      "Main entry point: Kamuzu International Airport (Lilongwe)",
      // "Visa requirements",
      "Immigration process and documentation",
      "Transportation from airport",
    ],
    practicalTips: [
      // "Visa on arrival available for Chinese citizens",
      "Yellow fever vaccination certificate required",
      "US Dollar widely accepted alongside Malawian Kwacha",
      "Public transport",
    ],
    culturalComparisons: [
      "Simpler immigration process compared to many countries",
      "English language advantage vs language barriers elsewhere",
      "Smaller airport scale compared to major airports",
      // "More personal, less automated processes than China",
    ],
    questions: [
      {
        question:
          "If you arrived at Kamuzu International Airport, what would be your first three priorities?",
        answer:
          "1) Show vaccination certificate and visa, 2) Exchange money or get USD, 3) Arrange transportation to accommodation",
        type: "practical",
      },
    ],
  },
  {
    id: "money",
    title: "Money & Banking",
    subtitle: "Currency, Banking, Cost of Living",
    icon: "dollar",
    images: [
      "https://files.maravianwebservices.com/paul_photos/malawi/thumbnails/tn_current-malawi-kwacha-banknotes.jpg", // Malawian Kwacha banknotes and coins
      "https://files.maravianwebservices.com/paul_photos/malawi/thumbnails/tn_20181127t15.png", // ATM machines and banks
      "https://files.maravianwebservices.com/paul_photos/malawi/232EG2UFWFOGZKWY5MU7G3RECU.avif", // Market prices/shopping scenes
      "https://files.maravianwebservices.com/paul_photos/malawi/Travel-Africa-local-fish-Malawi-lunch-scaled-1.webp", // Restaurant price examples
    ],
    keyPoints: [
      "Currency: Malawian Kwacha (MWK)",
      "Exchange rates and where to exchange money",
      "Banking system and ATM availability",
      "Cost of living comparison with China",
    ],
    practicalTips: [
      "Much lower cost of living",
      "ATM and Bank network",
      "Cash-based economy (less digital payment)",
    ],
    culturalComparisons: [
      "Cash-based vs China's mobile payment dominance",
      "Bartering common in markets vs fixed prices in China",
      "Lower cost of living but also lower average incomes",
    ],
    questions: [
      {
        question:
          "What are the main differences between Chinese and Malawian payment systems?",
        answer:
          "Malawi is cash-based with limited digital payments, while China uses mobile payments extensively",
        type: "comparison",
      },
      {
        question:
          "How would you budget your money differently in Malawi compared to China?",
        answer:
          "Budget more for cash, less for accommodation/food, more for transportation, consider tipping, and plan for limited ATM access",
        type: "practical",
      },
    ],
  },
  {
    id: "language",
    title: "Language & Communication",
    subtitle: "English, Local Languages, Communication Styles",
    icon: "message",
    images: [
      "https://files.maravianwebservices.com/paul_photos/malawi/thumbnails/tn_38891892.jpg", // Language learning materials
      "https://files.maravianwebservices.com/paul_photos/malawi/thumbnails/tn_274251.png", // Written signs in English and Chichewa
      "https://files.maravianwebservices.com/paul_photos/malawi/thumbnails/tn_MaristSecondarySchool_Malawi2022.jpg", // Business meeting scenarios
      "https://files.maravianwebservices.com/paul_photos/malawi/thumbnails/tn_W020220616648820771517.png", // Business meeting scenarios
      "https://files.maravianwebservices.com/paul_photos/malawi/thumbnails/tn_27ed5868-f753-4908-8cb3-c20d4c838cbe_720x450.jpg", // Business meeting scenarios
    ],
    keyPoints: [
      "Official language: English (advantage for students)",
      "Local languages: Chichewa, Tumbuka, others",
      "Communication styles and cultural nuances",
      "Non-verbal communication differences",
    ],
    practicalTips: [
      "English proficiency gives significant advantage",
      "Respect for elders and hierarchy important",
      "Patience valued over efficiency",
    ],
    culturalComparisons: [
      "English advantage vs language barriers elsewhere",
      "More personal relationships needed for business vs transactional Chinese business",
    ],
    questions: [
      {
        question:
          "Why is English being the official language an advantage for foreign visitors?",
        answer:
          "Eliminates language barriers, easier to conduct business, access education, and navigate daily life compared to countries with only local languages",
        type: "comprehension",
      },
      {
        question:
          "Compare the communication styles in Malawi and China. How are they similar or different?",
        answer:
          "Similar: indirect style, respect for hierarchy. Different: Malawi values patience over efficiency, more personal relationship-building required",
        type: "comparison",
      },
    ],
  },
  {
    id: "culture",
    title: "Tribes & Cultural Groups",
    subtitle: "Ethnic Diversity, Cultural Understanding",
    icon: "users",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv5nJTRmsYmZ1nzrUIgtc6Ty3DMeNi5BX3EA&s", // Traditional clothing and ceremonies
      "https://cdn.shopify.com/s/files/1/0565/1926/2384/files/Malawian_Traditional_Wedding_Styles_1.jpg?v=1621556032", // Different ethnic group representatives
      "https://www.unesco.org/archives/multimedia/images/3668/keyframe_medium/0999.jpg", // Religious buildings (churches, mosques)
      "https://www.musicinafrica.net/sites/default/files/styles/article_slider_large/public/images/article/201505/gulewamkuluwwwafricawildtruckcom.jpg?itok=CKqkC_XY", // Cultural festivals and celebrations
      "https://malawigulf.com/wp-content/uploads/2019/02/Dance2.jpg", // Cultural festivals and celebrations
    ],
    keyPoints: [
      "Major ethnic groups: Chewa, Tumbuka, Yao, Ngoni, others",
      "Traditional customs and beliefs",
      "Modern vs traditional lifestyles",
      "Religious influences (Christianity, Islam, traditional)",
    ],
    practicalTips: [
      "Respect for tribal traditions important",
      "Extended family systems strong",
      "Community-oriented society",
    ],
    culturalComparisons: [
      "Multiple ethnic groups vs Han majority in China",
      "Christianity dominant vs secular/Buddhist China",
      "Extended family focus vs nuclear family trends in China",
      "Community decisions vs individual decisions common in China",
    ],
    questions: [
      {
        question:
          "How might the strong Christian influence in Malawi affect business practices compared to China?",
        answer:
          "Sunday closures, prayer before meetings, ethical considerations in business, different from secular Chinese business environment",
        type: "comparison",
      },
    ],
  },
  {
    id: "etiquette",
    title: "Etiquette & Social Norms",
    subtitle: "Do's and Don'ts, Social Behavior",
    icon: "users",
    images: [
      "https://techafricanews.com/wp-content/uploads/2024/09/Malwai-President-PR.jpg", // Professional handshake examples
      "https://files.maravianwebservices.com/paul_photos/malawi/thumbnails/tn_Bawo.jpg", // Appropriate business attire
      "https://i0.wp.com/clipkulture.com/wp-content/uploads/2019/12/1577183885g48nk.jpg?fit=789%2C793&ssl=1", // Traditional gift-giving scenes
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLX5b9UIzX7Bw-v1WAekRdVrx0pCE6b1phjA&s", // Dining/eating scenarios
    ],
    keyPoints: [
      "Greeting customs and handshakes",
      "Dress codes (professional and casual)",
      "Gift-giving traditions",
      "Table manners and dining etiquette",
    ],
    practicalTips: [
      "Direct eye contact expected (different from Chinese deference)",
      "Personal space preferences",
      "Religious considerations in daily life",
    ],
    culturalComparisons: [
      "Direct eye contact expected",
      "Physical greetings common",
      "Religious considerations vs secular business practices",
    ],
    questions: [
      {
        question:
          "What aspects of Malawian etiquette would be most challenging for Chinese people to adapt to?",
        answer:
          "Direct eye contact with superiors, flexible time concepts, physical greetings, and religious considerations in business",
        type: "comparison",
      },
      {
        question:
          "What cultural gifts from China would be appropriate to bring to Malawian colleagues?",
        answer:
          "Tea, silk items, traditional crafts, or items representing Chinese culture (avoid expensive gifts that might embarrass recipients)",
        type: "practical",
      },
    ],
  },
  // {
  //   id: "safety",
  //   title: "Safety & Security",
  //   subtitle: "Personal Safety, Health, Emergency Procedures",
  //   icon: "shield",
  //   images: [
  //     "/placeholder.svg", // Police stations and emergency services
  //     "/placeholder.svg", // Medical facilities/hospitals
  //     "/placeholder.svg", // Water purification/safety measures
  //     "/placeholder.svg", // Safety equipment (mosquito nets, etc.)
  //   ],
  //   keyPoints: [
  //     "General safety situation",
  //     "Health precautions (malaria, water safety)",
  //     "Emergency contacts and procedures",
  //     "Common scams and how to avoid them",
  //   ],
  //   practicalTips: [
  //     "Malaria prevention essential (unlike China)",
  //     "Water safety - bottled/boiled water recommended",
  //     "Limited emergency services compared to China",
  //     "Strong community safety networks",
  //   ],
  //   culturalComparisons: [
  //     "Malaria risk vs no malaria in most of China",
  //     "Water safety concerns vs generally safe tap water in Chinese cities",
  //     "Limited emergency services vs extensive Chinese emergency infrastructure",
  //     "Community-based safety vs state-based security systems",
  //   ],
  //   questions: [
  //     {
  //       question:
  //         "What health precautions would you need to take in Malawi that you don't need in China?",
  //       answer:
  //         "Malaria prevention (mosquito nets, medication), water purification, yellow fever vaccination, tropical disease awareness",
  //       type: "comparison",
  //     },
  //     {
  //       question:
  //         "How would you prepare for the health challenges of living in Malawi?",
  //       answer:
  //         "Get required vaccinations, buy malaria prevention supplies, research local hospitals, get travel insurance, pack first aid kit",
  //       type: "practical",
  //     },
  //   ],
  // },
  // {
  //   id: "transportation",
  //   title: "Travel & Transportation",
  //   subtitle: "Getting Around, Transportation Options",
  //   icon: "car",
  //   images: [
  //     "/placeholder.svg", // Matola (minibus) transportation
  //     "/placeholder.svg", // Bus stations and terminals
  //     "/placeholder.svg", // Road conditions examples
  //     "/placeholder.svg", // Bicycle transportation
  //   ],
  //   keyPoints: [
  //     "Public transportation systems",
  //     "Taxi and ride-sharing options",
  //     "Intercity travel (bus, minibus)",
  //     "Road conditions and driving culture",
  //   ],
  //   practicalTips: [
  //     "Limited infrastructure compared to China",
  //     "Matola (shared minibus) main public transport",
  //     "Road conditions variable",
  //     "Walking often necessary",
  //   ],
  //   culturalComparisons: [
  //     "Limited public transport vs extensive Chinese metro/bus systems",
  //     "Matola (shared minibus) vs modern Chinese public transport",
  //     "Variable road conditions vs modern Chinese highway system",
  //     "More walking required vs convenient transport in Chinese cities",
  //   ],
  //   questions: [
  //     {
  //       question:
  //         "How does the transportation system in Malawi differ from what you're used to in China?",
  //       answer:
  //         "Less developed infrastructure, shared minibuses instead of metros, more walking required, variable road conditions vs modern Chinese systems",
  //       type: "comparison",
  //     },
  //   ],
  // },
  {
    id: "food",
    title: "Food & Dining Culture",
    subtitle: "Local Cuisine, Dining Customs, Food Safety",
    icon: "utensils",
    images: [
      "https://images.food52.com/qwZz0V9i7vYhwGwS78mPR1ybZD8=/96d1952b-1ab6-4c21-bdcb-8bbe4e25c678--2020-0403_malawian-chicken-curry-nsima_3x2_james-ransom-073.jpg", // Traditional Malawian dishes (nsima, relish)
      "https://tellerrandstories.de/wp-content/uploads/2023/05/img_6713-eyeturner-georg-berg-1024x768.jpg", // Local markets with fresh produce
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuHjts5tfDlq56aWSk6x12FA7g9qSgUYZ7Cg&s", // Restaurant dining scenes
      "https://i.ytimg.com/vi/plTuQbf8qwM/sddefault.jpg", // Street food vendors
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdq7nZWjRvr0x3V5xuf3OtH2dGyupOzpDFdg&s", // Street food vendors
    ],
    keyPoints: [
      "Staple foods: nsima (maize porridge), vegetables, fish",
      "Meal times and eating customs",
      "Street food and restaurant culture",
      "Food safety considerations",
    ],
    practicalTips: [
      "Very different from Chinese cuisine",
      "Fresh ingredients",
      "Communal eating customs",
    ],
    culturalComparisons: [
      "Nsima (maize) staple vs rice staple in China",
      "Less diverse cuisine vs varied Chinese regional cuisines",
      "Communal eating vs individual portions in modern China",
    ],
    questions: [
      {
        question:
          "What foods from your home region of China would you miss most in Malawi?",
        answer:
          "Varied regional cuisines, specific spices (soy sauce, hot peppers), rice as staple, diverse cooking methods, familiar snacks",
        type: "comparison",
      },
    ],
  },
  {
    id: "landmarks",
    title: "Landmarks & Attractions",
    subtitle: "Must-See Places, Cultural Sites",
    icon: "landmark",
    images: [
      "https://maravianwebservices.com/images/photos/cblue/malawi3.png", // Lake Malawi scenic views
      "https://maravianwebservices.com/images/photos/cblue/malawi1.png", // Wildlife photos (elephants, antelope)
      "https://www.malawianstyle.com/wp-content/uploads/2024/11/Mulanje-Mountain.jpeg", // Historical buildings and museums
      "https://www.expertafrica.com/images/country/0090ab5afe1340c789fa2ebc1c348b96-400-lq.jpg", // Traditional markets and crafts
      "https://www.goeco.org/wp-content/uploads/2020/07/volunteer-review-from-Malawi-Holly1-1024x660.jpg", // Traditional markets and crafts
      "https://www.malawitourism.com/wp-content/uploads/2018/12/Game-drive-with-elephants-Dana-Allen-1920x720.jpg", // Traditional markets and crafts
      "https://images.squarespace-cdn.com/content/v1/66ec3b49803ab81bf84f89e4/2b0fef79-bec8-4126-9a6c-284687c60c7d/LionFamilyPlanning.jpg", // Traditional markets and crafts
      "https://12travelafrica.com/wp-content/uploads/2021/04/Safari-dieren-in-Malawi-zebras-scaled.jpg", // Traditional markets and crafts
    ],
    keyPoints: [
      "Lake Malawi (UNESCO World Heritage)",
      "Historical sites and museums",
      "National parks and wildlife",
      "Cultural centers and markets",
    ],
    practicalTips: [
      "Natural beauty very different from China",
      "Wildlife viewing opportunities",
      "Cultural tourism potential",
      "Adventure tourism (hiking, water sports)",
    ],
    culturalComparisons: [
      "African wildlife vs Chinese wildlife (pandas, etc.)",
      "Lake-based tourism vs mountain/city tourism in China",
      "Traditional crafts vs modern Chinese manufacturing",
      "Adventure tourism vs cultural/historical tourism emphasis in China",
    ],
    questions: [
      {
        question:
          "What business opportunities might exist in Malawi that don't exist in China?",
        answer:
          "Eco-tourism, wildlife conservation, sustainable fishing, agricultural development, cultural exchange programs",
        type: "critical",
      },
      {
        question:
          "How could your experience living in China help you adapt to life in Malawi?",
        answer:
          "Understanding different systems, adaptability, patience with bureaucracy, appreciation for community values, cross-cultural communication skills",
        type: "critical",
      },
    ],
  },
];

export default malawiSlides;
