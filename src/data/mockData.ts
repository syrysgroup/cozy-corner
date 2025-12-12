import { Language } from "@/lib/i18n";

export interface MockProperty {
  id: string;
  title_en: string;
  title_fr: string;
  description_en: string;
  description_fr: string;
  price: number;
  listing_type: 'sale' | 'rent' | 'shared' | 'student' | 'co_ownership' | 'auction';
  rent_frequency?: 'monthly' | 'weekly' | 'yearly';
  bedrooms: number;
  bathrooms: number;
  property_size: number;
  city: string;
  province: string;
  address_text: string;
  image_urls: string[];
  amenities: string[];
  latitude: number;
  longitude: number;
  status: 'active' | 'pending' | 'sold';
  created_at: string;
  featured?: boolean;
  agent_id?: string;
}

export interface MockAgent {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  specialties: string[];
  listings_count: number;
  rating: number;
  reviews_count: number;
  bio_en: string;
  bio_fr: string;
}

export interface MockTestimonial {
  id: string;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  text_en: string;
  text_fr: string;
  role: 'buyer' | 'seller' | 'renter' | 'landlord';
}

export interface MockCity {
  id: string;
  name: string;
  province: string;
  image: string;
  properties_count: number;
}

export const MOCK_PROPERTIES: MockProperty[] = [
  {
    id: "prop-001",
    title_en: "Luxurious Downtown Penthouse",
    title_fr: "Penthouse luxueux au centre-ville",
    description_en: "Stunning 3-bedroom penthouse with panoramic city views, floor-to-ceiling windows, and premium finishes throughout.",
    description_fr: "Superbe penthouse de 3 chambres avec vue panoramique sur la ville, fenêtres du sol au plafond et finitions haut de gamme.",
    price: 2450000,
    listing_type: "sale",
    bedrooms: 3,
    bathrooms: 3,
    property_size: 2800,
    city: "Toronto",
    province: "Ontario",
    address_text: "100 Harbour Street, Unit PH1",
    image_urls: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ],
    amenities: ["Gym", "Pool", "Concierge", "Rooftop Terrace", "Parking"],
    latitude: 43.6426,
    longitude: -79.3871,
    status: "active",
    created_at: "2024-01-15",
    featured: true,
    agent_id: "agent-001"
  },
  {
    id: "prop-002",
    title_en: "Modern West End Condo",
    title_fr: "Condo moderne du West End",
    description_en: "Bright and spacious 2-bedroom condo in the heart of Vancouver's West End. Walking distance to Stanley Park.",
    description_fr: "Condo lumineux et spacieux de 2 chambres au cœur du West End de Vancouver. À distance de marche du parc Stanley.",
    price: 3200,
    listing_type: "rent",
    rent_frequency: "monthly",
    bedrooms: 2,
    bathrooms: 2,
    property_size: 1100,
    city: "Vancouver",
    province: "British Columbia",
    address_text: "1850 Comox Street",
    image_urls: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
    ],
    amenities: ["In-suite Laundry", "Balcony", "Gym", "Bike Storage"],
    latitude: 49.2888,
    longitude: -123.1384,
    status: "active",
    created_at: "2024-02-01",
    featured: true,
    agent_id: "agent-002"
  },
  {
    id: "prop-003",
    title_en: "Charming Plateau Mont-Royal Duplex",
    title_fr: "Charmant duplex du Plateau Mont-Royal",
    description_en: "Beautiful heritage duplex with exposed brick, hardwood floors, and a private backyard in the trendy Plateau.",
    description_fr: "Magnifique duplex patrimonial avec briques exposées, planchers de bois franc et cour arrière privée dans le Plateau branché.",
    price: 875000,
    listing_type: "sale",
    bedrooms: 4,
    bathrooms: 2,
    property_size: 2200,
    city: "Montreal",
    province: "Quebec",
    address_text: "4521 Rue Saint-Denis",
    image_urls: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"
    ],
    amenities: ["Backyard", "Fireplace", "Basement", "Parking"],
    latitude: 45.5231,
    longitude: -73.5736,
    status: "active",
    created_at: "2024-01-20",
    featured: true,
    agent_id: "agent-003"
  },
  {
    id: "prop-004",
    title_en: "Affordable Student Housing Near McGill",
    title_fr: "Logement étudiant abordable près de McGill",
    description_en: "Cozy room in shared apartment, perfect for McGill students. All utilities included, furnished.",
    description_fr: "Chambre confortable dans un appartement partagé, parfait pour les étudiants de McGill. Tous les services inclus, meublé.",
    price: 750,
    listing_type: "student",
    rent_frequency: "monthly",
    bedrooms: 1,
    bathrooms: 1,
    property_size: 200,
    city: "Montreal",
    province: "Quebec",
    address_text: "3480 Rue McTavish",
    image_urls: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
    ],
    amenities: ["Furnished", "WiFi", "Laundry", "Study Room"],
    latitude: 45.5048,
    longitude: -73.5772,
    status: "active",
    created_at: "2024-02-10",
    agent_id: "agent-003"
  },
  {
    id: "prop-005",
    title_en: "Executive Bungalow in Westmount",
    title_fr: "Bungalow exécutif à Westmount",
    description_en: "Elegant 5-bedroom bungalow in prestigious Westmount. Gourmet kitchen, wine cellar, and manicured gardens.",
    description_fr: "Élégant bungalow de 5 chambres dans le prestigieux Westmount. Cuisine gastronomique, cave à vin et jardins paysagés.",
    price: 3200000,
    listing_type: "sale",
    bedrooms: 5,
    bathrooms: 4,
    property_size: 4500,
    city: "Montreal",
    province: "Quebec",
    address_text: "12 Summit Circle",
    image_urls: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800"
    ],
    amenities: ["Pool", "Wine Cellar", "Home Theater", "Smart Home", "3-Car Garage"],
    latitude: 45.4833,
    longitude: -73.6000,
    status: "active",
    created_at: "2024-01-05",
    featured: true,
    agent_id: "agent-001"
  },
  {
    id: "prop-006",
    title_en: "Downtown Calgary Loft",
    title_fr: "Loft au centre-ville de Calgary",
    description_en: "Industrial-chic loft in converted warehouse. Soaring ceilings, exposed beams, and stunning mountain views.",
    description_fr: "Loft industriel-chic dans un entrepôt converti. Hauts plafonds, poutres apparentes et vue imprenable sur les montagnes.",
    price: 525000,
    listing_type: "sale",
    bedrooms: 2,
    bathrooms: 2,
    property_size: 1400,
    city: "Calgary",
    province: "Alberta",
    address_text: "908 17th Avenue SW",
    image_urls: [
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800"
    ],
    amenities: ["Exposed Brick", "High Ceilings", "Parking", "Rooftop Access"],
    latitude: 51.0447,
    longitude: -114.0719,
    status: "active",
    created_at: "2024-02-05",
    featured: true,
    agent_id: "agent-004"
  },
  {
    id: "prop-007",
    title_en: "Shared Living in Kensington",
    title_fr: "Colocation à Kensington",
    description_en: "Fully furnished room in beautiful shared house. Great roommates, walking distance to shops and cafes.",
    description_fr: "Chambre entièrement meublée dans une belle maison partagée. Super colocataires, à distance de marche des commerces.",
    price: 850,
    listing_type: "shared",
    rent_frequency: "monthly",
    bedrooms: 1,
    bathrooms: 1,
    property_size: 180,
    city: "Calgary",
    province: "Alberta",
    address_text: "234 Kensington Road NW",
    image_urls: [
      "https://images.unsplash.com/photo-1598928506311-c55ez361eb71?w=800"
    ],
    amenities: ["Furnished", "WiFi", "Utilities Included", "Shared Kitchen"],
    latitude: 51.0535,
    longitude: -114.0879,
    status: "active",
    created_at: "2024-02-15",
    agent_id: "agent-004"
  },
  {
    id: "prop-008",
    title_en: "Waterfront Estate in Ottawa",
    title_fr: "Domaine au bord de l'eau à Ottawa",
    description_en: "Magnificent 6-bedroom estate on the Rideau River. Private dock, heated pool, and 2 acres of landscaped grounds.",
    description_fr: "Magnifique domaine de 6 chambres sur la rivière Rideau. Quai privé, piscine chauffée et 2 acres de terrain paysagé.",
    price: 4500000,
    listing_type: "sale",
    bedrooms: 6,
    bathrooms: 5,
    property_size: 6200,
    city: "Ottawa",
    province: "Ontario",
    address_text: "1 Rideau River Drive",
    image_urls: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800"
    ],
    amenities: ["Waterfront", "Pool", "Dock", "Tennis Court", "Guest House"],
    latitude: 45.4215,
    longitude: -75.6972,
    status: "active",
    created_at: "2024-01-25",
    featured: true,
    agent_id: "agent-005"
  },
  {
    id: "prop-009",
    title_en: "Co-Ownership Opportunity in Glebe",
    title_fr: "Opportunité de copropriété dans le Glebe",
    description_en: "Unique co-ownership opportunity in charming Victorian home. Own 50% of this beautifully renovated property.",
    description_fr: "Opportunité unique de copropriété dans une charmante maison victorienne. Possédez 50% de cette propriété magnifiquement rénovée.",
    price: 425000,
    listing_type: "co_ownership",
    bedrooms: 3,
    bathrooms: 2,
    property_size: 1800,
    city: "Ottawa",
    province: "Ontario",
    address_text: "78 Fourth Avenue",
    image_urls: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800"
    ],
    amenities: ["Garden", "Parking", "Fireplace", "Updated Kitchen"],
    latitude: 45.4042,
    longitude: -75.6881,
    status: "active",
    created_at: "2024-02-08",
    agent_id: "agent-005"
  },
  {
    id: "prop-010",
    title_en: "Modern Townhouse in Edmonton",
    title_fr: "Maison de ville moderne à Edmonton",
    description_en: "Brand new 3-bedroom townhouse with attached garage. Open concept living, energy-efficient design.",
    description_fr: "Maison de ville neuve de 3 chambres avec garage attenant. Concept ouvert, design écoénergétique.",
    price: 420000,
    listing_type: "sale",
    bedrooms: 3,
    bathrooms: 3,
    property_size: 1650,
    city: "Edmonton",
    province: "Alberta",
    address_text: "156 Secord Boulevard NW",
    image_urls: [
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
    ],
    amenities: ["Garage", "Energy Efficient", "New Construction", "Smart Home"],
    latitude: 53.5461,
    longitude: -113.4938,
    status: "active",
    created_at: "2024-02-12",
    agent_id: "agent-006"
  },
  {
    id: "prop-011",
    title_en: "Luxury Auction - Yorkville Mansion",
    title_fr: "Vente aux enchères de luxe - Manoir de Yorkville",
    description_en: "Rare auction opportunity for historic Yorkville mansion. Starting bid well below market value.",
    description_fr: "Rare opportunité d'enchères pour un manoir historique de Yorkville. Mise de départ bien en dessous de la valeur marchande.",
    price: 5500000,
    listing_type: "auction",
    bedrooms: 7,
    bathrooms: 6,
    property_size: 8000,
    city: "Toronto",
    province: "Ontario",
    address_text: "45 Hazelton Avenue",
    image_urls: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ],
    amenities: ["Historic", "Wine Cellar", "Library", "Carriage House", "Garden"],
    latitude: 43.6708,
    longitude: -79.3957,
    status: "active",
    created_at: "2024-01-30",
    agent_id: "agent-001"
  },
  {
    id: "prop-012",
    title_en: "Cozy Studio Near UBC",
    title_fr: "Studio confortable près de UBC",
    description_en: "Perfect student studio near UBC campus. Recently renovated with modern amenities.",
    description_fr: "Studio étudiant parfait près du campus UBC. Récemment rénové avec des commodités modernes.",
    price: 1450,
    listing_type: "student",
    rent_frequency: "monthly",
    bedrooms: 0,
    bathrooms: 1,
    property_size: 350,
    city: "Vancouver",
    province: "British Columbia",
    address_text: "2150 Western Parkway",
    image_urls: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
    ],
    amenities: ["Furnished", "WiFi", "Gym", "Study Lounge"],
    latitude: 49.2606,
    longitude: -123.2460,
    status: "active",
    created_at: "2024-02-18",
    agent_id: "agent-002"
  },
  {
    id: "prop-013",
    title_en: "Heritage Home in Old Quebec",
    title_fr: "Maison patrimoniale dans le Vieux-Québec",
    description_en: "Authentic stone house in UNESCO heritage site. Completely restored with modern comforts.",
    description_fr: "Authentique maison de pierre dans un site du patrimoine UNESCO. Entièrement restaurée avec tout le confort moderne.",
    price: 1250000,
    listing_type: "sale",
    bedrooms: 4,
    bathrooms: 3,
    property_size: 2400,
    city: "Quebec City",
    province: "Quebec",
    address_text: "28 Rue du Petit-Champlain",
    image_urls: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"
    ],
    amenities: ["Historic", "Courtyard", "Fireplace", "Stone Walls"],
    latitude: 46.8139,
    longitude: -71.2080,
    status: "active",
    created_at: "2024-01-18",
    agent_id: "agent-003"
  },
  {
    id: "prop-014",
    title_en: "Ski-In Ski-Out Chalet",
    title_fr: "Chalet ski-in ski-out",
    description_en: "Stunning mountain chalet with direct ski access. Perfect for year-round mountain living.",
    description_fr: "Superbe chalet de montagne avec accès direct aux pistes. Parfait pour vivre en montagne toute l'année.",
    price: 1850000,
    listing_type: "sale",
    bedrooms: 5,
    bathrooms: 4,
    property_size: 3200,
    city: "Whistler",
    province: "British Columbia",
    address_text: "4545 Blackcomb Way",
    image_urls: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
    ],
    amenities: ["Ski Access", "Hot Tub", "Fireplace", "Mountain Views", "Sauna"],
    latitude: 50.1150,
    longitude: -122.9535,
    status: "active",
    created_at: "2024-02-01",
    agent_id: "agent-002"
  },
  {
    id: "prop-015",
    title_en: "Investment Property - 4-Plex",
    title_fr: "Propriété d'investissement - 4-Plex",
    description_en: "Excellent investment opportunity. Four fully rented units generating strong monthly income.",
    description_fr: "Excellente opportunité d'investissement. Quatre unités entièrement louées générant un revenu mensuel solide.",
    price: 1100000,
    listing_type: "sale",
    bedrooms: 8,
    bathrooms: 4,
    property_size: 4000,
    city: "Hamilton",
    province: "Ontario",
    address_text: "234 James Street North",
    image_urls: [
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800"
    ],
    amenities: ["Income Property", "Parking", "Separate Meters", "Updated"],
    latitude: 43.2557,
    longitude: -79.8711,
    status: "active",
    created_at: "2024-01-28",
    agent_id: "agent-001"
  }
];

export const MOCK_AGENTS: MockAgent[] = [
  {
    id: "agent-001",
    name: "Sarah Mitchell",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    email: "sarah.mitchell@multilisting.ca",
    phone: "+1 (416) 555-0101",
    city: "Toronto",
    province: "Ontario",
    specialties: ["Luxury Homes", "Condos", "Investment Properties"],
    listings_count: 47,
    rating: 4.9,
    reviews_count: 156,
    bio_en: "With over 15 years of experience in Toronto's luxury market, Sarah specializes in high-end properties and investment opportunities.",
    bio_fr: "Avec plus de 15 ans d'expérience sur le marché du luxe de Toronto, Sarah se spécialise dans les propriétés haut de gamme et les opportunités d'investissement."
  },
  {
    id: "agent-002",
    name: "David Chen",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    email: "david.chen@multilisting.ca",
    phone: "+1 (604) 555-0202",
    city: "Vancouver",
    province: "British Columbia",
    specialties: ["Waterfront", "New Construction", "Condos"],
    listings_count: 38,
    rating: 4.8,
    reviews_count: 124,
    bio_en: "David brings a unique perspective to Vancouver real estate, combining market expertise with a passion for sustainable living.",
    bio_fr: "David apporte une perspective unique à l'immobilier de Vancouver, combinant expertise du marché et passion pour le développement durable."
  },
  {
    id: "agent-003",
    name: "Marie-Claire Dubois",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    email: "marie.dubois@multilisting.ca",
    phone: "+1 (514) 555-0303",
    city: "Montreal",
    province: "Quebec",
    specialties: ["Heritage Properties", "Multi-Family", "Student Housing"],
    listings_count: 52,
    rating: 4.9,
    reviews_count: 189,
    bio_en: "Marie-Claire is Montreal's go-to agent for heritage properties and unique architectural gems in the city's most desirable neighborhoods.",
    bio_fr: "Marie-Claire est l'agente de référence à Montréal pour les propriétés patrimoniales et les joyaux architecturaux uniques."
  },
  {
    id: "agent-004",
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    email: "james.wilson@multilisting.ca",
    phone: "+1 (403) 555-0404",
    city: "Calgary",
    province: "Alberta",
    specialties: ["Single Family", "Acreages", "First-Time Buyers"],
    listings_count: 31,
    rating: 4.7,
    reviews_count: 98,
    bio_en: "James specializes in helping first-time buyers navigate the Calgary market with patience and expertise.",
    bio_fr: "James se spécialise dans l'accompagnement des premiers acheteurs sur le marché de Calgary avec patience et expertise."
  },
  {
    id: "agent-005",
    name: "Emily Thompson",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
    email: "emily.thompson@multilisting.ca",
    phone: "+1 (613) 555-0505",
    city: "Ottawa",
    province: "Ontario",
    specialties: ["Government Relocations", "Luxury Estates", "Waterfront"],
    listings_count: 29,
    rating: 4.8,
    reviews_count: 112,
    bio_en: "Emily's deep understanding of Ottawa's unique market makes her the ideal choice for government professionals and luxury buyers.",
    bio_fr: "La compréhension approfondie d'Emily du marché unique d'Ottawa en fait le choix idéal pour les professionnels du gouvernement."
  },
  {
    id: "agent-006",
    name: "Michael Brown",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    email: "michael.brown@multilisting.ca",
    phone: "+1 (780) 555-0606",
    city: "Edmonton",
    province: "Alberta",
    specialties: ["New Construction", "Townhouses", "Commercial"],
    listings_count: 25,
    rating: 4.6,
    reviews_count: 87,
    bio_en: "Michael focuses on Edmonton's growing new construction market, helping buyers find their perfect modern home.",
    bio_fr: "Michael se concentre sur le marché de la construction neuve en pleine croissance d'Edmonton."
  }
];

export const MOCK_TESTIMONIALS: MockTestimonial[] = [
  {
    id: "test-001",
    name: "Jennifer & Mark Anderson",
    avatar: "https://images.unsplash.com/photo-1522556189639-b150ed9c4330?w=200",
    location: "Toronto, ON",
    rating: 5,
    text_en: "Multilisting made our home buying journey seamless. We found our dream condo in just two weeks, and the process was incredibly smooth from start to finish.",
    text_fr: "Multilisting a rendu notre parcours d'achat de maison fluide. Nous avons trouvé notre condo de rêve en seulement deux semaines.",
    role: "buyer"
  },
  {
    id: "test-002",
    name: "François Tremblay",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    location: "Montreal, QC",
    rating: 5,
    text_en: "As a landlord with multiple properties, the bulk upload feature saved me hours of work. The platform is intuitive and the support team is excellent.",
    text_fr: "En tant que propriétaire de plusieurs propriétés, la fonction de téléchargement en masse m'a fait gagner des heures. La plateforme est intuitive.",
    role: "landlord"
  },
  {
    id: "test-003",
    name: "Lisa Wong",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    location: "Vancouver, BC",
    rating: 5,
    text_en: "I sold my property above asking price within a week! The exposure on Multilisting was incredible, and I received multiple offers.",
    text_fr: "J'ai vendu ma propriété au-dessus du prix demandé en une semaine! L'exposition sur Multilisting était incroyable.",
    role: "seller"
  },
  {
    id: "test-004",
    name: "Ahmed Hassan",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
    location: "Calgary, AB",
    rating: 5,
    text_en: "Finding student housing was so easy with Multilisting. The verified listings gave me peace of mind when renting from abroad.",
    text_fr: "Trouver un logement étudiant était si facile avec Multilisting. Les annonces vérifiées m'ont rassuré en louant de l'étranger.",
    role: "renter"
  },
  {
    id: "test-005",
    name: "Sarah & Tom Miller",
    avatar: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=200",
    location: "Ottawa, ON",
    rating: 5,
    text_en: "We used Multilisting to find renters for our investment property. The quality of applicants was excellent, and we filled the vacancy in days.",
    text_fr: "Nous avons utilisé Multilisting pour trouver des locataires. La qualité des candidats était excellente.",
    role: "landlord"
  },
  {
    id: "test-006",
    name: "Philippe Martin",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    location: "Quebec City, QC",
    rating: 5,
    text_en: "The bilingual support was exactly what I needed. Being able to search in French made the whole experience so much better.",
    text_fr: "Le support bilingue était exactement ce dont j'avais besoin. Pouvoir chercher en français a rendu l'expérience tellement meilleure.",
    role: "buyer"
  }
];

export const MOCK_CITIES: MockCity[] = [
  {
    id: "city-001",
    name: "Toronto",
    province: "Ontario",
    image: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=800",
    properties_count: 2847
  },
  {
    id: "city-002",
    name: "Vancouver",
    province: "British Columbia",
    image: "https://images.unsplash.com/photo-1559511260-66a654ae982a?w=800",
    properties_count: 1923
  },
  {
    id: "city-003",
    name: "Montreal",
    province: "Quebec",
    image: "https://images.unsplash.com/photo-1519178614-68673b201f36?w=800",
    properties_count: 2156
  },
  {
    id: "city-004",
    name: "Calgary",
    province: "Alberta",
    image: "https://images.unsplash.com/photo-1570738639265-cf5bfcb27a0c?w=800",
    properties_count: 1432
  },
  {
    id: "city-005",
    name: "Ottawa",
    province: "Ontario",
    image: "https://images.unsplash.com/photo-1534312527009-56c7016453e6?w=800",
    properties_count: 987
  },
  {
    id: "city-006",
    name: "Edmonton",
    province: "Alberta",
    image: "https://images.unsplash.com/photo-1578811219668-9ea1b2a4c72f?w=800",
    properties_count: 876
  }
];

export const MOCK_STATS = {
  properties: 10000,
  agents: 2500,
  cities: 50,
  happy_clients: 15000
};

// Helper functions
export const getPropertyTitle = (property: MockProperty, lang: Language): string => {
  return lang === 'fr' ? property.title_fr : property.title_en;
};

export const getPropertyDescription = (property: MockProperty, lang: Language): string => {
  return lang === 'fr' ? property.description_fr : property.description_en;
};

export const getAgentBio = (agent: MockAgent, lang: Language): string => {
  return lang === 'fr' ? agent.bio_fr : agent.bio_en;
};

export const getTestimonialText = (testimonial: MockTestimonial, lang: Language): string => {
  return lang === 'fr' ? testimonial.text_fr : testimonial.text_en;
};

export const getFeaturedProperties = (): MockProperty[] => {
  return MOCK_PROPERTIES.filter(p => p.featured).slice(0, 6);
};

export const getTopAgents = (): MockAgent[] => {
  return [...MOCK_AGENTS].sort((a, b) => b.rating - a.rating).slice(0, 4);
};

export const formatPrice = (price: number, listing_type: string, lang: Language, rent_frequency?: string): string => {
  const formatted = new Intl.NumberFormat(lang === 'fr' ? 'fr-CA' : 'en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0
  }).format(price);

  if (listing_type === 'rent' || listing_type === 'student' || listing_type === 'shared') {
    const suffix = lang === 'fr' ? '/mois' : '/mo';
    return `${formatted}${suffix}`;
  }
  return formatted;
};

// Convert mock property to listing format for compatibility with PropertyCard
export const convertMockToListing = (property: MockProperty) => {
  return {
    id: property.id,
    title_en: property.title_en,
    title_fr: property.title_fr,
    description_en: property.description_en,
    description_fr: property.description_fr,
    price: property.price,
    listing_type: property.listing_type,
    rent_frequency: property.rent_frequency,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    property_size: property.property_size,
    city: property.city,
    province: property.province,
    address_text: property.address_text,
    image_urls: property.image_urls,
    amenities: property.amenities,
    latitude: property.latitude,
    longitude: property.longitude,
    status: property.status === 'active' ? 'published' : property.status,
    created_at: property.created_at,
    country: 'Canada',
    formatted_address: `${property.address_text}, ${property.city}, ${property.province}`,
    user_id: property.agent_id || 'mock-user',
    updated_at: property.created_at,
  };
};
