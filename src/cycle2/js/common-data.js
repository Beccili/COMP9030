// Shared data for the Indigenous Art Atlas
// Expose under window.AppData for use by all pages

(function () {
  const artEntries = [
    {
      id: "vincent-namatjira-stand-strong",
      title: "Stand Strong for Who You Are",
      description:
        "This groundbreaking 2020 Archibald Prize-winning portrait depicts Aboriginal rugby star Adam Goodes (wearing red and black jersey) standing hand-in-hand with the artist himself. The painting celebrates Indigenous identity and resilience, with Goodes' athletic prowess interwoven with symbols of Aboriginal heritage. Namatjira became the first Aboriginal artist to win the prestigious Archibald Prize in nearly a century, making this work historically significant in recognizing Indigenous voices in Australian art.",
      artist: "Vincent Namatjira",
      artType: "Portrait",
      period: "Contemporary",
      region: "SA",
      coords: { lat: -26.9, lng: 133.1 },
      location_sensitivity: "general",
      images: ["assets/img/art01.png", "assets/img/art02.png", "assets/img/art03.png"],
      dateAdded: "2025-09-10",
      submitter: "art_historian",
      sensitive: false,
    },
    {
      id: "kaylene-whiskey-tv",
      title: "Kaylene TV",
      description:
        "This vibrant 2017 work depicts two of Whiskey's beloved 'tough girl' icons - Cher (left) holding a microphone in silver fringe boots, and Dolly Parton (right) in pink overalls, fresh from skateboarding around the community store. The living room scene features an old TV displaying 'You're watching Kaylene TV!', suggesting this joyful gathering is broadcast through the artist's imaginary community television station. The painting brilliantly fuses pop culture icons with desert community life, decorated with local cultural symbols including Christmas trees, boomerangs, and native tobacco plants.",
      artist: "Kaylene Whiskey",
      artType: "Painting",
      period: "Contemporary",
      region: "SA",
      coords: { lat: -26.9, lng: 133.1 },
      location_sensitivity: "general",
      images: ["assets/img/art02.png", "assets/img/art03.png", "assets/img/art04.png", "assets/img/art05.png"],
      dateAdded: "2025-09-09",
      submitter: "iwantja_arts",
      sensitive: false,
    },
    {
      id: "tony-albert-sorry",
      title: "Sorry",
      description:
        "This powerful 2008 installation spells out 'SORRY' using large three-dimensional letters, each embedded with 99 collected vintage objects featuring Aboriginal imagery - figurines, commemorative plates, and promotional materials displaying stereotypical 'blackface' representations. These objects form a 'forest of faces' gazing at viewers, symbolizing historically distorted Aboriginal identities. Created in response to the Australian government's 2008 apology to the 'Stolen Generations', Albert recontextualizes these once-discriminatory memorabilia, transforming them into a monument that both commemorates the apology and questions whether real change has followed.",
      artist: "Tony Albert",
      artType: "Installation",
      period: "Contemporary",
      region: "QLD",
      coords: { lat: -27.4698, lng: 153.0251 },
      location_sensitivity: "exact",
      images: ["assets/img/art03.png", "assets/img/art04.png", "assets/img/art01.png"],
      dateAdded: "2025-09-08",
      submitter: "qagoma_curator",
      sensitive: true,
    },
    {
      id: "megan-cope-death-song",
      title: "Untitled (Death Song)",
      description:
        "This 2020 sculptural sound installation transforms industrial mining waste into a playable musical instrument. Cope assembled rusted spiral drill bits, cut oil drums, metal frames, and rock core samples into a suspended ensemble that can be performed by musicians using bows and percussion. Inspired by the haunting call of the endangered Bush Stone-curlew, the installation mimics the bird's cry through these industrial remnants. When performed, the work creates an eerie soundscape of bird calls and wind, warning of environmental destruction and species endangerment caused by mining, while echoing the Quandamooka tradition of 'listening to Country'.",
      artist: "Megan Cope",
      artType: "Sound Installation",
      period: "Contemporary",
      region: "QLD",
      coords: { lat: -27.4, lng: 153.4 },
      location_sensitivity: "general",
      images: ["assets/img/art04.png", "assets/img/art05.png", "assets/img/art01.png"],
      dateAdded: "2025-09-07",
      submitter: "adelaide_biennial",
      sensitive: false,
    },
    {
      id: "yhonnie-scarce-thunder-poison",
      title: "Thunder Raining Poison",
      description:
        "This monumental 2015 installation features a suspended 'nuclear cloud' composed of over 2000 hand-blown glass yams, hanging five meters high in cloud and raindrop formations. Each translucent glass yam, shaped after the desert plant that is traditional Aboriginal food, symbolizes lives affected by the 1950s Maralinga nuclear tests on Kokatha land. The title 'Thunder Raining Poison' refers to radioactive fallout that rained down after nuclear explosions, causing irreversible land contamination. Ironically, the intense heat from one Maralinga blast once melted nearby sand into glass, inspiring Scarce's choice of medium. The installation is both breathtakingly beautiful and chillingly haunting - a luminous chandelier-like structure that tells the heavy truth of nuclear colonialism.",
      artist: "Yhonnie Scarce",
      artType: "Glass Installation",
      period: "Contemporary",
      region: "SA",
      coords: { lat: -30.2, lng: 131.6 },
      location_sensitivity: "region",
      images: ["assets/img/art05.png"],
      dateAdded: "2025-09-06",
      submitter: "national_gallery",
      sensitive: true,
    },
    // Placeholder entries
    {
      id: "placeholder-artwork-6",
      title: "Artwork Title 6 (To be updated)",
      description:
        "Detailed description will be provided for this contemporary Aboriginal artwork.",
      artist: "Artist Name 6",
      artType: "TBD",
      period: "Contemporary",
      region: "TBD",
      coords: { lat: -25.2744, lng: 133.7751 },
      location_sensitivity: "general",
      images: ["assets/img/art01.png"],
      dateAdded: "2025-09-05",
      submitter: "curator_placeholder",
      sensitive: false,
    },
    {
      id: "placeholder-artwork-7",
      title: "Artwork Title 7 (To be updated)",
      description:
        "Detailed description will be provided for this contemporary Aboriginal artwork.",
      artist: "Artist Name 7",
      artType: "TBD",
      period: "Contemporary",
      region: "TBD",
      coords: { lat: -25.2744, lng: 133.7751 },
      location_sensitivity: "general",
      images: ["assets/img/art01.png"],
      dateAdded: "2025-09-04",
      submitter: "curator_placeholder",
      sensitive: false,
    },
    {
      id: "placeholder-artwork-8",
      title: "Artwork Title 8 (To be updated)",
      description:
        "Detailed description will be provided for this contemporary Aboriginal artwork.",
      artist: "Artist Name 8",
      artType: "TBD",
      period: "Contemporary",
      region: "TBD",
      coords: { lat: -25.2744, lng: 133.7751 },
      location_sensitivity: "general",
      images: ["assets/img/art01.png"],
      dateAdded: "2025-09-03",
      submitter: "curator_placeholder",
      sensitive: false,
    },
    {
      id: "placeholder-artwork-9",
      title: "Artwork Title 9 (To be updated)",
      description:
        "Detailed description will be provided for this contemporary Aboriginal artwork.",
      artist: "Artist Name 9",
      artType: "TBD",
      period: "Contemporary",
      region: "TBD",
      coords: { lat: -25.2744, lng: 133.7751 },
      location_sensitivity: "general",
      images: ["assets/img/art01.png"],
      dateAdded: "2025-09-02",
      submitter: "curator_placeholder",
      sensitive: false,
    },
  ];

  // Region centroids for location sensitivity handling (used by map)
  const regionCentroids = {
    NSW: { lat: -32.1656, lng: 147.0167 },
    VIC: { lat: -36.5986, lng: 144.678 },
    QLD: { lat: -22.1646, lng: 144.0647 },
    SA: { lat: -30.0002, lng: 136.2092 },
    WA: { lat: -25.2744, lng: 123.7751 },
    NT: { lat: -19.4914, lng: 132.551 },
    TAS: { lat: -42.0409, lng: 146.5925 },
    ACT: { lat: -35.3081, lng: 149.1244 },
  };

  window.AppData = {
    artEntries,
    regionCentroids,
  };
})();

/*
#-# START COMMENT BLOCK #-#
AI Tool used: ChatGPT GPT-5 (OpenAI) via Cursor
AI-Acknowledgement.md line: 24
AI helped me complete the vast majority of lengthy, repetitive code. It significantly saved me time, allowing me to focus on bug fixes and multi-file code integration.
#-# END COMMENT BLOCK #-#
*/

