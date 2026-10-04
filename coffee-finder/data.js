// Research data for the Manhattan coffee finder.
// Scores are 1–5 on the three things asked for: chocolatey/rich flavor,
// bean quality, and how unique the visit is. Evidence lines quote or
// closely paraphrase the linked sources (researched October 2026).
//
// photo.view = a point on the street in front of the shop plus a compass
// heading toward the storefront, used for the Street View photo.

window.SHOPS = [
  {
    id: "devocion",
    rank: 1,
    name: "Devoción",
    neighborhood: "Flatiron",
    address: "25 E 20th St, New York, NY 10003",
    lat: 40.73885, lng: -73.98912,
    hours: "Mon–Fri 7am–6pm · Sat–Sun 7:30am–6pm",
    price: "$$",
    website: "https://www.devocion.com/pages/devocion-cafe-flatiron-district-new-york-ny",
    scores: { chocolate: 4, beans: 5, experience: 5 },
    tagline: "Colombian beans roasted about 10 days after leaving the farm, served under a skylit garden atrium.",
    notes: ["Cacao", "Vanilla", "Cherry", "Almond"],
    order: "Espresso or a cortado on the Toro house blend (cacao, vanilla, cherry, almond).",
    evidence: [
      { text: "Roasts \"true farm-fresh coffee only 10 days after leaving origin\", against an industry norm of 6–12 months. Beans are bought from independent Colombian producers, dry-milled in Bogotá and flown to New York.", src: "Devoción Flatiron page", url: "https://www.devocion.com/pages/devocion-cafe-flatiron-district-new-york-ny" },
      { text: "Toro House Blend, built for espresso: tasting notes of cacao, vanilla, cherry and almond (Caturra and Típica, 1,400–1,900 m).", src: "Bean Box", url: "https://beanbox.com/coffee/roast/devocion-toro/1356" },
      { text: "Restored landmarked artist's studio with exposed brick, wood floors, a large skylight over the bar and a plant-filled atrium.", src: "Brian's Coffee Spot", url: "https://www.brian-coffee-spot.com/2022/10/29/devocion-flatiron-district/" },
      { text: "A smaller second Manhattan café opened in 2025 at 1134 Broadway (NoMad), open daily from 7am.", src: "Flatiron NoMad Partnership", url: "https://flatironnomad.nyc/2025/04/30/new-neighbor-roundup-devocion-opto-skinny-louie/" }
    ],
    photo: { view: [40.73880, -73.98915], heading: 29 }
  },
  {
    id: "787",
    rank: 2,
    name: "787 Coffee",
    neighborhood: "East Village",
    address: "131 E 7th St, New York, NY 10009",
    lat: 40.72637, lng: -73.98398,
    hours: "Daily, morning to evening (confirm before going)",
    price: "$$",
    website: "https://www.787coffee.com/blog/brewing-happiness-at-787-coffee-on-7th-st-your-spot-for-new-yorks-finest-cup",
    scores: { chocolate: 5, beans: 4, experience: 4 },
    tagline: "The owners grow the beans on their own farm in Puerto Rico. Expect dark chocolate and molasses.",
    notes: ["Dark chocolate", "Molasses", "Toasted almond", "Low acidity"],
    order: "A cortado on the house Puerto Rican single origin. Take home a bag of the rum-infused beans.",
    evidence: [
      { text: "Beans are grown, hand-picked and roasted from their own farm, Hacienda Iluminada, at about 3,000 ft in Maricao, Puerto Rico.", src: "787 Coffee", url: "https://www.787coffee.com/blog/coffee-farm-tour-puerto-rico-beans" },
      { text: "Hacienda Iluminada beans carry \"notes of rich dark chocolate, comforting molasses, and a hint of toasted almond\". Puerto Rican coffee has low acidity and a rich body.", src: "787 Coffee", url: "https://www.787coffee.com/blog/how-to-taste-puerto-rican-coffee-farm-to-cup" },
      { text: "Rum-, whiskey- and tequila-infused beans, each listing dark chocolate among its notes.", src: "787 Coffee shop", url: "https://www.787coffee.com/787coffeeonlineshop/p/787coffeeinfusedcoffeetrio" },
      { text: "The 7th Street shop was the first location. It opened in October 2018, with swing seats and a patio.", src: "EV Grieve", url: "https://evgrieve.com/2018/08/787-coffee-for-7th-street.html" }
    ],
    photo: { view: [40.72630, -73.98402], heading: 29 }
  },
  {
    id: "felix",
    rank: 3,
    name: "Felix Roasting Co.",
    neighborhood: "NoMad",
    address: "450 Park Ave S, New York, NY 10016",
    lat: 40.74480, lng: -73.98340,
    hours: "Mon–Fri 8am–5pm · Sat 8am–6pm",
    price: "$$$",
    website: "https://www.timeout.com/newyork/restaurants/felix-roasting-co",
    scores: { chocolate: 5, beans: 3, experience: 5 },
    tagline: "A hickory-smoked s'mores latte arrives under a glass bell in a pastel, Aesthetic-Movement room.",
    notes: ["Dark chocolate", "Graham", "Toasted marshmallow", "Hickory smoke"],
    order: "The Smoked S'mores Latte. Order a plain espresso too, to taste the roast on its own.",
    evidence: [
      { text: "The smoked s'mores latte combines graham-cracker-infused milk, espresso, dark chocolate sauce and house-made marshmallow, then is smoked with hickory chips under a glass bell.", src: "One Girl Whole World", url: "https://onegirlwholeworld.com/north-america/felix-roasting-co-nyc/" },
      { text: "Interior inspired by the late-19th-century Aesthetic Movement, with a hand-drawn mural of 500 individual tiles and a bespoke terrazzo floor.", src: "Daily Coffee News", url: "https://dailycoffeenews.com/2020/02/14/the-kaleidoscopic-coffee-opulence-of-felix-roasting-co-in-manhattan" },
      { text: "Roasts its own coffee on a 12-kilo Probat. The roastery is in Houston, not New York, so the beans rate lower here.", src: "Sprudge", url: "https://sprudge.com/get-lost-in-the-elegance-at-new-york-citys-felix-roasting-co-138068.html" },
      { text: "Yelp listing updated July 2026 shows the Park Ave S flagship open. The SoHo (Greene St) shop is closed.", src: "Yelp", url: "https://www.yelp.com/biz/felix-roasting-new-york-4" }
    ],
    photo: { view: [40.74478, -73.98330], heading: 299 }
  },
  {
    id: "integral",
    rank: 4,
    name: "Café Integral",
    neighborhood: "Nolita",
    address: "149 Elizabeth St, New York, NY 10012",
    lat: 40.72140, lng: -73.99500,
    hours: "Daily 8am–4pm",
    price: "$$",
    website: "https://www.yelp.com/biz/caf%C3%A9-integral-new-york-2",
    scores: { chocolate: 4, beans: 5, experience: 3 },
    tagline: "Serves only Nicaraguan coffee, roasted in house. The espresso tastes of nutty dark chocolate and hazelnut.",
    notes: ["Nutty dark chocolate", "Hazelnut", "Red cherry", "Floral"],
    order: "Espresso on the Dulcinea blend, or its signature iced coffee.",
    evidence: [
      { text: "Serves only coffee from Nicaragua, all roasted in house. Founded in 2012 by Nicaraguan-born Cesar Vega.", src: "Daily Coffee News", url: "https://dailycoffeenews.com/2016/09/21/with-nicaraguan-coffee-focus-cafe-integral-expanding-through-the-us" },
      { text: "Dulcinea espresso: 70% washed La Argentina (Dipilto) and 30% pulped natural El Bosque. Notes of \"nutty dark chocolate\", hazelnut and red cherry.", src: "The Way to Coffee", url: "https://www.thewaytocoffee.com/beans/dulcinea/" },
      { text: "Yelp listing updated September 2026, open daily 8am–4pm.", src: "Yelp", url: "https://www.yelp.com/biz/caf%C3%A9-integral-new-york-2" }
    ],
    photo: { view: [40.72140, -73.99508], heading: 119 }
  },
  {
    id: "hicollar",
    rank: 5,
    name: "Hi-Collar",
    neighborhood: "East Village",
    address: "231 E 9th St, New York, NY 10003",
    lat: 40.72962, lng: -73.98790,
    hours: "Lunch 11:30am–3:30pm · Dinner 5:30–10pm",
    price: "$$",
    website: "https://www.theinfatuation.com/new-york/reviews/hi-collar",
    scores: { chocolate: 3, beans: 4, experience: 5 },
    tagline: "A Japanese kissaten where each cup is brewed to order in a gold siphon and served in fine china.",
    notes: ["Rotating single origins", "Full-bodied siphon", "Round, syrupy"],
    order: "A siphon coffee. Ask for the most chocolate-leaning bean they have, and pair it with the soufflé pancakes.",
    evidence: [
      { text: "Every cup is made by hand by pour-over, AeroPress or siphon, using limited rotating roasts from Bali, Colombia and Kenya.", src: "Sprudge", url: "https://sprudge.com/bernson-hi-collar-40077.html" },
      { text: "A siphon coffee served in a Christofle gold-faced cup. About a dozen seats. Becomes a sake and Japanese whisky bar at night.", src: "Time Out", url: "https://www.timeout.com/newyork/restaurants/hi-collar" },
      { text: "Moved to a larger space at 231 E 9th St in 2020 (the old 10th St address is out of date). Yelp listing updated 2026.", src: "Yelp", url: "https://www.yelp.com/biz/hi-collar-new-york-2" },
      { text: "No published chocolate tasting notes. The beans rotate, so it ranks lower on chocolate.", src: "Research note", url: "" }
    ],
    photo: { view: [40.72955, -73.98792], heading: 29 }
  }
];

// Shops that nearly made the list. Shown as small grey pins.
window.MENTIONS = [
  {
    id: "abraco", name: "Abraço", neighborhood: "East Village",
    address: "86 E 7th St, New York, NY 10003", lat: 40.72712, lng: -73.98632,
    why: "The Infatuation calls the espresso \"biting, chocolate-y\". Known for olive oil cake. Fewer details on its beans.",
    url: "https://www.theinfatuation.com/new-york/reviews/abraco"
  },
  {
    id: "mariebelle", name: "MarieBelle Cacao Bar", neighborhood: "SoHo",
    address: "484 Broome St, New York, NY 10013", lat: 40.72250, lng: -74.00240,
    why: "The most chocolate in Manhattan: Aztec hot chocolate under a chandelier. It's a chocolatier first, so the coffee is secondary.",
    url: "https://mariebelle.com/pages/cacao-bar"
  },
  {
    id: "reggio", name: "Caffè Reggio", neighborhood: "Greenwich Village",
    address: "119 MacDougal St, New York, NY 10012", lat: 40.73022, lng: -74.00030,
    why: "Opened in 1927 and credited with bringing cappuccino to America, with a 1902 espresso machine. Strong on history, not a specialty roaster.",
    url: "https://untappedcities.com/the-oldest-espresso-machine-in-nyc-is-in-cafe-reggio"
  }
];
