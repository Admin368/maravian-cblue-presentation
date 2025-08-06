const landmarks = [
  {
    country: "greece",
    name: "Acropolis",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/acropolis.webp"
  },
  {
    country: "spain", 
    name: "Alhambra",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/alhambra.webp"
  },
  {
    country: "cambodia",
    name: "Angkor Wat",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/angkor-wat.webp"
  },
  {
    country: "united kingdom",
    name: "Big Ben & Westminster Abbey",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/big-ben-westminster-abbey.webp"
  },
  {
    country: "united arab emirates",
    name: "Burj Khalifa",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/burj-khalifa-dubai.webp"
  },
  {
    country: "mexico",
    name: "Chichen Itza",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/chichen-itza.webp"
  },
  {
    country: "italy",
    name: "Colosseum",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/colosseum.webp"
  },
  {
    country: "brazil",
    name: "Christ the Redeemer",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/cristo-redentor-rio.webp"
  },
  {
    country: "morocco",
    name: "Djemaa el Fna",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/djemaa-el-fna.webp"
  },
  {
    country: "france",
    name: "Eiffel Tower",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/eiffel-tower-paris.webp"
  },
  {
    country: "united states",
    name: "Empire State Building",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/empire-state-building-new-york-visit.webp"
  },
  {
    country: "united states",
    name: "Golden Gate Bridge",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/golden-gate-bridge-san-francisco.webp"
  },
  {
    country: "united states",
    name: "Grand Canyon",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/grand-canyon-south-rim.webp"
  },
  {
    country: "australia",
    name: "Great Barrier Reef",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/great-barrier-reef.webp"
  },
  {
    country: "china",
    name: "Great Wall of China",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/great-wall-of-china.webp"
  },
  {
    country: "turkey",
    name: "Hagia Sophia",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/hagia-sophia-istanbul.webp"
  },
  {
    country: "vietnam",
    name: "Ha Long Bay",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/halong-bay.webp"
  },
  {
    country: "japan",
    name: "Mount Fuji",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/japan-mount-fuji.webp"
  },
  {
    country: "italy",
    name: "Leaning Tower of Pisa",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/leaning-tower-pisa.webp"
  },
  {
    country: "peru",
    name: "Machu Picchu",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/machu-picchu.webp"
  },
  {
    country: "nepal",
    name: "Mount Everest",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/mount-everest.webp"
  },
  {
    country: "canada/united states",
    name: "Niagara Falls",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/niagara-falls.webp"
  },
  {
    country: "france",
    name: "Notre Dame",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/notre-dame-paris.webp"
  },
  {
    country: "egypt",
    name: "Pyramids of Giza",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/pyramids-giza.webp"
  },
  {
    country: "spain",
    name: "Sagrada Familia",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/sagrada-familia-passion-facade.webp"
  },
  {
    country: "bolivia",
    name: "Salar de Uyuni",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/salar-de-uyuni.webp"
  },
  {
    country: "united states",
    name: "Statue of Liberty",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/statue-of-liberty.webp"
  },
  {
    country: "united kingdom",
    name: "Stonehenge",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/stonehenge.webp"
  },
  {
    country: "australia",
    name: "Sydney Opera House",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/sydney-opera-house.webp"
  },
  {
    country: "south africa",
    name: "Table Mountain",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/table-mountain.webp"
  },
  {
    country: "india",
    name: "Taj Mahal",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/taj-mahal.webp"
  },
  {
    country: "united states",
    name: "Times Square",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/times-square-new-york.webp"
  },
  {
    country: "vatican city",
    name: "Vatican City",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/vatican-city.webp"
  },
  {
    country: "france",
    name: "Palace of Versailles",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/versailles.webp"
  },
  {
    country: "united arab emirates",
    name: "Sheikh Zayed Grand Mosque",
    image_url: "https://files.maravianwebservices.com/paul_photos/landmarks/zayid-mosque.webp"
  }
];

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = landmarks;
}
