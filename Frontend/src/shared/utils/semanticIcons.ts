/**
 * Intelligent Semantic Emoji & Icon Mapping Engine.
 * Maps German vocabulary lexicon words and English concepts to true, strictly controlled visual iconography.
 */
export interface WordVisualInput {
  id?: number | string;
  german: string;
  english: string;
  category?: string;
  emoji?: string;
}

const EMOJI_KEYWORD_MAP: Array<[string, string]> = [
  // 1. Fruits, Vegetables & Food (Strict Match)
  ["apfel", "🍎"], ["apple", "🍎"],
  ["banane", "🍌"], ["banana", "🍌"],
  ["birne", "🍐"], ["pear", "🍐"],
  ["orange", "🍊"],
  ["zitrone", "🍋"], ["zitron", "🍋"], ["lemon", "🍋"],
  ["erdbeere", "🍓"], ["erdbeer", "🍓"], ["strawberry", "🍓"],
  ["kirsche", "🍒"], ["kirsch", "🍒"], ["cherry", "🍒"],
  ["traube", "🍇"], ["traub", "🍇"], ["grape", "🍇"],
  ["wassermelone", "🍉"], ["watermelon", "🍉"], ["melone", "🍉"],
  ["ananas", "🍍"], ["pineapple", "🍍"],
  ["pfirsich", "🍑"], ["peach", "🍑"],
  ["tomate", "🍅"], ["tomato", "🍅"],
  ["karotte", "🥕"], ["carrot", "🥕"], ["möhre", "🥕"],
  ["kartoffel", "🥔"], ["potato", "🥔"],
  ["brot", "🍞"], ["bread", "🍞"], ["brötchen", "🥖"],
  ["butter", "🧈"],
  ["käse", "🧀"], ["cheese", "🧀"],
  ["milch", "🥛"], ["milk", "🥛"],
  ["wasser", "💧"], ["water", "💧"],
  ["kaffee", "☕"], ["coffee", "☕"],
  ["tee", "🍵"], ["tea", "🍵"],
  ["bier", "🍺"], ["beer", "🍺"],
  ["wein", "🍷"], ["wine", "🍷"],
  ["suppe", "🍲"], ["soup", "🍲"],
  ["fleisch", "🥩"], ["meat", "🥩"],
  ["fisch", "🐟"], ["fish", "🐟"],
  ["hähnchen", "🍗"], ["chicken", "🍗"],
  ["ei", "🥚"], ["egg", "🥚"],
  ["salz", "🧂"], ["salt", "🧂"],
  ["zucker", "🍬"], ["sugar", "🍬"],
  ["pfeffer", "🌶️"], ["pepper", "🌶️"],
  ["reis", "🍚"], ["rice", "🍚"],
  ["nudel", "🍝"], ["pasta", "🍝"], ["noodle", "🍝"],
  ["pizza", "🍕"],
  ["burger", "🍔"], ["hamburger", "🍔"],
  ["pommes", "🍟"], ["fries", "🍟"],
  ["schokolade", "🍫"], ["chocolate", "🍫"],
  ["kuchen", "🍰"], ["cake", "🍰"], ["torte", "🎂"],
  ["eis", "🍦"], ["ice cream", "🍦"], ["ice", "🧊"],
  ["honig", "🍯"], ["honey", "🍯"],
  ["salat", "🥗"], ["salad", "🥗"],
  ["pilz", "🍄"], ["mushroom", "🍄"],
  ["nuss", "🥜"], ["nut", "🥜"],
  ["keks", "🍪"], ["cookie", "🍪"], ["biscuit", "🍪"],
  ["sandwich", "🥪"],
  ["wurst", "🌭"], ["sausage", "🌭"],
  ["knoblauch", "🧄"], ["garlic", "🧄"],
  ["zwiebel", "🧅"], ["onion", "🧅"],
  ["essen", "🍽️"], ["food", "🍽️"], ["meal", "🍽️"],
  ["trinken", "🥤"], ["drink", "🥤"],
  ["restaurant", "🍽️"], ["café", "☕"], ["cafe", "☕"],

  // 2. Animals & Wildlife (Strict Match)
  ["hund", "🐶"], ["dog", "🐶"], ["welpe", "🐕"],
  ["katze", "🐱"], ["cat", "🐱"], ["kater", "🐈"],
  ["vogel", "🐦"], ["bird", "🐦"],
  ["adler", "🦅"], ["eagle", "🦅"],
  ["eule", "🦉"], ["owl", "🦉"],
  ["pferd", "🐴"], ["horse", "🐴"], ["pony", "🐎"],
  ["kuh", "🐮"], ["cow", "🐮"], ["rind", "🐂"],
  ["schwein", "🐷"], ["pig", "🐷"],
  ["schaf", "🐑"], ["sheep", "🐑"],
  ["ziege", "🐐"], ["goat", "🐐"],
  ["hase", "🐰"], ["rabbit", "🐰"], ["kaninchen", "🐇"],
  ["maus", "🐭"], ["mouse", "🐭"], ["ratte", "🐀"],
  ["bär", "🐻"], ["bear", "🐻"],
  ["löwe", "🦁"], ["lion", "🦁"],
  ["tiger", "🐯"],
  ["wolf", "🐺"],
  ["fuchs", "🦊"], ["fox", "🦊"],
  ["hirsch", "🦌"], ["deer", "🦌"], ["reh", "🦌"],
  ["elefant", "🐘"], ["elephant", "🐘"],
  ["affe", "🐒"], ["monkey", "🐒"],
  ["giraffe", "🦒"],
  ["zebra", "🦓"],
  ["frosch", "🐸"], ["frog", "🐸"],
  ["schlange", "🐍"], ["snake", "🐍"],
  ["krokodil", "🐊"], ["crocodile", "🐊"],
  ["schildkröte", "🐢"], ["turtle", "🐢"],
  ["hai", "🦈"], ["shark", "🦈"],
  ["wal", "🐳"], ["whale", "🐳"],
  ["delfin", "🐬"], ["dolphin", "🐬"],
  ["biene", "🐝"], ["bee", "🐝"],
  ["schmetterling", "🦋"], ["butterfly", "🦋"],
  ["spinne", "🕷️"], ["spider", "🕷️"],
  ["ente", "🦆"], ["duck", "🦆"],
  ["huhn", "🐔"], ["hen", "🐔"], ["hahn", "🐓"],

  // 3. Home, Furniture & Architecture (Strict Match)
  ["haus", "🏠"], ["house", "🏠"], ["home", "🏠"],
  ["wohnung", "🏢"], ["apartment", "🏢"], ["flat", "🏢"],
  ["zimmer", "🚪"], ["room", "🚪"],
  ["küche", "🍳"], ["kitchen", "🍳"],
  ["bad", "🛁"], ["bath", "🛁"], ["badezimmer", "🛁"], ["bathroom", "🛁"],
  ["wohnzimmer", "🛋️"], ["living room", "🛋️"],
  ["schlafzimmer", "🛏️"], ["bedroom", "🛏️"],
  ["garten", "🏡"], ["garden", "🏡"],
  ["wand", "🧱"], ["wall", "🧱"],
  ["treppe", "🪜"], ["stairs", "🪜"],
  ["tür", "🚪"], ["door", "🚪"],
  ["fenster", "🪟"], ["window", "🪟"],
  ["tisch", "🪑"], ["table", "🪑"],
  ["schreibtisch", "💻"], ["desk", "💻"],
  ["stuhl", "🪑"], ["chair", "🪑"],
  ["sofa", "🛋️"], ["sessel", "🛋️"], ["couch", "🛋️"],
  ["bett", "🛏️"], ["bed", "🛏️"],
  ["schrank", "🗄️"], ["closet", "🗄️"], ["wardrobe", "🗄️"],
  ["regal", "📚"], ["shelf", "📚"],
  ["spiegel", "🪞"], ["mirror", "🪞"],
  ["lampe", "💡"], ["lamp", "💡"], ["licht", "💡"], ["light", "💡"],
  ["schlüssel", "🔑"], ["key", "🔑"], ["schloss", "🔒"],
  ["mülleimer", "🗑️"], ["trash", "🗑️"], ["bin", "🗑️"],
  ["uhr", "⌚"], ["clock", "🕰️"], ["watch", "⌚"], ["wecker", "⏰"],
  ["fernseher", "📺"], ["television", "📺"], ["tv", "📺"],
  ["radio", "📻"],
  ["telefon", "📱"], ["phone", "📱"], ["handy", "📱"],
  ["computer", "💻"], ["laptop", "💻"],
  ["kamera", "📷"], ["camera", "📷"], ["foto", "📸"],

  // 4. Tableware & Kitchen Utensils (Strict Match)
  ["teller", "🍽️"], ["plate", "🍽️"],
  ["tasse", "☕"], ["cup", "☕"], ["mug", "☕"],
  ["glas", "🥛"], ["glass", "🥛"],
  ["flasche", "🍾"], ["bottle", "🍾"],
  ["topf", "🍲"], ["pot", "🍲"],
  ["pfanne", "🍳"], ["pan", "🍳"],
  ["messer", "🔪"], ["knife", "🔪"],
  ["gabel", "🍴"], ["fork", "🍴"],
  ["löffel", "🥄"], ["spoon", "🥄"],
  ["besteck", "🍴"], ["cutlery", "🍴"],
  ["herd", "🍳"], ["stove", "🍳"], ["ofen", "♨️"], ["oven", "♨️"],
  ["kühlschrank", "🧊"], ["refrigerator", "🧊"], ["fridge", "🧊"],

  // 5. Clothing, Fashion & Accessories (Strict Match)
  ["kleidung", "👕"], ["clothes", "👕"], ["clothing", "👕"],
  ["hemd", "👔"], ["shirt", "👔"],
  ["bluse", "👚"], ["blouse", "👚"],
  ["t-shirt", "👕"],
  ["pullover", "🧶"], ["sweater", "🧶"],
  ["jacke", "🧥"], ["jacket", "🧥"], ["mantel", "🧥"], ["coat", "🧥"],
  ["hose", "👖"], ["pants", "👖"], ["trousers", "👖"], ["jeans", "👖"],
  ["rock", "👗"], ["skirt", "👗"],
  ["kleid", "👗"], ["dress", "👗"],
  ["anzug", "👔"], ["suit", "👔"],
  ["schuh", "👟"], ["shoe", "👟"], ["stiefel", "👢"], ["boot", "👢"],
  ["socke", "🧦"], ["sock", "🧦"],
  ["handschuh", "🧤"], ["glove", "🧤"],
  ["schal", "🧣"], ["scarf", "🧣"],
  ["mütze", "🧢"], ["cap", "🧢"], ["hut", "🎩"], ["hat", "🎩"],
  ["gürtel", "🪢"], ["belt", "🪢"],
  ["krawatte", "👔"], ["tie", "👔"],
  ["tasche", "👜"], ["bag", "👜"], ["handtasche", "👜"],
  ["rucksack", "🎒"], ["backpack", "🎒"],
  ["koffer", "🧳"], ["suitcase", "🧳"],
  ["geldbörse", "👛"], ["wallet", "👛"], ["portemonnaie", "👛"],
  ["brille", "👓"], ["glasses", "👓"], ["sonnenbrille", "🕶️"],
  ["ring", "💍"],
  ["regenschirm", "☂️"], ["schirm", "☔"], ["umbrella", "☂️"],

  // 6. Transportation & Vehicles (Strict Match)
  ["auto", "🚗"], ["car", "🚗"],
  ["bus", "🚌"],
  ["zug", "🚆"], ["train", "🚆"], ["eisenbahn", "🚂"],
  ["u-bahn", "🚇"], ["subway", "🚇"], ["metro", "🚇"],
  ["straßenbahn", "🚊"], ["tram", "🚊"],
  ["fahrrad", "🚲"], ["bicycle", "🚲"], ["bike", "🚲"], ["rad", "🚲"],
  ["motorrad", "🏍️"], ["motorcycle", "🏍️"],
  ["flugzeug", "✈️"], ["plane", "✈️"], ["airplane", "✈️"],
  ["schiff", "🚢"], ["ship", "🚢"],
  ["boot", "⛵"], ["boat", "⛵"],
  ["taxi", "🚕"],
  ["lkw", "🚚"], ["truck", "🚚"], ["lastwagen", "🚛"],
  ["krankenwagen", "🚑"], ["ambulance", "🚑"],
  ["feuerwehr", "🚒"], ["polizeiauto", "🚓"],
  ["rakete", "🚀"], ["rocket", "🚀"],

  // 7. Places, City & Public Infrastructure (Strict Match)
  ["stadt", "🏙️"], ["city", "🏙️"],
  ["dorf", "🏘️"], ["village", "🏘️"],
  ["land", "🗺️"], ["country", "🗺️"],
  ["welt", "🌍"], ["world", "🌍"], ["erde", "🌍"], ["earth", "🌍"],
  ["straße", "🛣️"], ["street", "🛣️"], ["road", "🛣️"], ["autobahn", "🛣️"],
  ["brücke", "🌉"], ["bridge", "🌉"],
  ["platz", "📍"], ["place", "📍"], ["square", "🟩"],
  ["gebäude", "🏢"], ["building", "🏢"],
  ["geschäft", "🏪"], ["shop", "🏪"], ["store", "🏪"], ["laden", "🏪"],
  ["supermarkt", "🛒"], ["supermarket", "🛒"], ["markt", "🛒"], ["market", "🛒"],
  ["bank", "🏦"],
  ["post", "🏣"],
  ["polizei", "👮"], ["police", "👮"],
  ["krankenhaus", "🏥"], ["hospital", "🏥"],
  ["apotheke", "💊"], ["pharmacy", "💊"],
  ["schule", "🏫"], ["school", "🏫"],
  ["universität", "🎓"], ["university", "🎓"], ["campus", "🏫"],
  ["bibliothek", "📖"], ["library", "📖"],
  ["museum", "🏛️"],
  ["theater", "🎭"],
  ["kino", "🎬"], ["cinema", "🎬"], ["movie", "🎬"],
  ["park", "🌳"],
  ["zoo", "🦁"],
  ["kirche", "⛪"], ["church", "⛪"], ["dom", "⛪"], ["kathedrale", "⛪"],
  ["bahnhof", "🚉"], ["station", "🚉"],
  ["haltestelle", "🚏"], ["bus stop", "🚏"],
  ["flughafen", "✈️"], ["airport", "✈️"],
  ["hafen", "⚓"], ["harbor", "⚓"], ["port", "⚓"],
  ["hotel", "🏨"],
  ["bar", "🍸"], ["pub", "🍺"],

  // 8. Nature, Geography & Weather (Strict Match)
  ["baum", "🌳"], ["tree", "🌳"],
  ["wald", "🌲"], ["forest", "🌲"],
  ["blume", "🌸"], ["flower", "🌸"],
  ["rose", "🌹"],
  ["pflanze", "🌿"], ["plant", "🌿"],
  ["gras", "🌱"], ["grass", "🌱"], ["blatt", "🍃"], ["leaf", "🍃"],
  ["berg", "⛰️"], ["mountain", "⛰️"], ["hügel", "⛰️"], ["hill", "⛰️"],
  ["fluss", "🏞️"], ["river", "🏞️"],
  ["see", "🌊"], ["lake", "🌊"], ["meer", "🌊"], ["sea", "🌊"], ["ozean", "🌊"], ["ocean", "🌊"],
  ["strand", "🏖️"], ["beach", "🏖️"],
  ["insel", "🏝️"], ["island", "🏝️"],
  ["wüste", "🏜️"], ["desert", "🏜️"],
  ["himmel", "☁️"], ["sky", "☁️"],
  ["wolke", "☁️"], ["cloud", "☁️"],
  ["regen", "🌧️"], ["rain", "🌧️"],
  ["gewitter", "⛈️"], ["thunder", "⚡"], ["blitz", "⚡"], ["lightning", "⚡"],
  ["schnee", "❄️"], ["snow", "❄️"],
  ["nebel", "🌫️"], ["fog", "🌫️"],
  ["wind", "💨"], ["sturm", "🌪️"], ["storm", "🌪️"],
  ["sonne", "☀️"], ["sun", "☀️"],
  ["mond", "🌙"], ["moon", "🌙"],
  ["stern", "⭐"], ["star", "⭐"],
  ["planet", "🪐"],
  ["feuer", "🔥"], ["fire", "🔥"], ["flamme", "🔥"],

  // 9. People, Family & Professions (Strict Match)
  ["mensch", "🧑"], ["person", "🧑"], ["human", "🧑"],
  ["mann", "👨"], ["man", "👨"],
  ["frau", "👩"], ["woman", "👩"], ["dame", "👩"], ["lady", "👩"],
  ["kind", "🧒"], ["child", "🧒"],
  ["baby", "👶"],
  ["junge", "👦"], ["boy", "👦"],
  ["mädchen", "👧"], ["girl", "👧"],
  ["familie", "👨‍👩‍👧‍👦"], ["family", "👨‍👩‍👧‍👦"],
  ["vater", "👨"], ["father", "👨"], ["papa", "👨"],
  ["mutter", "👩"], ["mother", "👩"], ["mama", "👩"],
  ["eltern", "🧑‍🤝‍🧑"], ["parents", "🧑‍🤝‍🧑"],
  ["sohn", "👦"], ["son", "👦"],
  ["tochter", "👧"], ["daughter", "👧"],
  ["bruder", "👦"], ["brother", "👦"],
  ["schwester", "👧"], ["sister", "👧"],
  ["opa", "👴"], ["großvater", "👴"], ["grandfather", "👴"],
  ["oma", "👵"], ["großmutter", "👵"], ["grandmother", "👵"],
  ["onkel", "👨"], ["uncle", "👨"],
  ["tante", "👩"], ["aunt", "👩"],
  ["freund", "👫"], ["friend", "👫"],
  ["gast", "🤝"], ["guest", "🤝"],
  ["arzt", "👨‍⚕️"], ["doctor", "👨‍⚕️"],
  ["lehrer", "👨‍🏫"], ["teacher", "👨‍🏫"],
  ["schüler", "🎒"], ["student", "🎓"],
  ["polizist", "👮"],
  ["koch", "👨‍🍳"], ["cook", "👨‍🍳"], ["bäcker", "🍞"], ["baker", "🍞"],
  ["kellner", "🍽️"], ["waiter", "🍽️"],
  ["pilot", "👨‍✈️"],
  ["fahrer", "🚗"], ["driver", "🚗"],
  ["musiker", "🎵"], ["musician", "🎵"],
  ["künstler", "🎨"], ["artist", "🎨"],
  ["sportler", "⚽"], ["athlete", "⚽"],
  ["chef", "👔"], ["boss", "👔"],
  ["kollege", "🧑‍💻"], ["colleague", "🧑‍💻"],

  // 10. Body Parts & Anatomy (Strict Match)
  ["kopf", "🗣️"], ["head", "🗣️"],
  ["gesicht", "😊"], ["face", "😊"],
  ["auge", "👁️"], ["eye", "👁️"],
  ["ohr", "👂"], ["ear", "👂"],
  ["nase", "👃"], ["nose", "👃"],
  ["mund", "👄"], ["mouth", "👄"],
  ["zahn", "🦷"], ["tooth", "🦷"], ["teeth", "🦷"],
  ["zunge", "👅"], ["tongue", "👅"],
  ["haar", "💇"], ["hair", "💇"],
  ["hand", "✋"],
  ["finger", "☝️"], ["daumen", "👍"], ["thumb", "👍"],
  ["arm", "💪"],
  ["bein", "🦵"], ["leg", "🦵"],
  ["fuß", "🦶"], ["foot", "🦶"], ["feet", "🦶"],
  ["herz", "❤️"], ["heart", "❤️"],
  ["blut", "🩸"], ["blood", "🩸"],
  ["gehirn", "🧠"], ["brain", "🧠"],
  ["knochen", "🦴"], ["bone", "🦴"],

  // 11. Sports, Games & Music (Strict Match)
  ["sport", "⚽"],
  ["fußball", "⚽"], ["football", "⚽"], ["soccer", "⚽"],
  ["basketball", "🏀"],
  ["volleyball", "🏐"],
  ["tennis", "🎾"],
  ["tischtennis", "🏓"], ["table tennis", "🏓"],
  ["golf", "⛳"],
  ["bowling", "🎳"],
  ["schwimmen", "🏊"], ["swimming", "🏊"],
  ["laufen", "🏃"], ["running", "🏃"],
  ["radfahren", "🚴"], ["cycling", "🚴"],
  ["skifahren", "⛷️"], ["skiing", "⛷️"], ["snowboard", "🏂"],
  ["yoga", "🧘"],
  ["tanzen", "💃"], ["dancing", "💃"],
  ["musik", "🎵"], ["music", "🎵"],
  ["lied", "🎶"], ["song", "🎶"],
  ["gitarre", "🎸"], ["guitar", "🎸"],
  ["klavier", "🎹"], ["piano", "🎹"],
  ["geige", "🎻"], ["violin", "🎻"],
  ["trommel", "🥁"], ["drum", "🥁"],
  ["trompete", "🎺"], ["trumpet", "🎺"],
  ["saxophon", "🎷"], ["saxophone", "🎷"],
  ["spiel", "🎮"], ["game", "🎮"],
  ["schach", "♟️"], ["chess", "♟️"],
  ["karte", "🃏"], ["card", "💳"],
  ["puzzle", "🧩"],
  ["kunst", "🎨"], ["art", "🎨"],
  ["bild", "🖼️"], ["picture", "🖼️"],

  // 12. Time, Dates & Celebrations (Strict Match)
  ["zeit", "⏱️"], ["time", "⏱️"],
  ["sekunde", "⏱️"], ["second", "⏱️"],
  ["minute", "⏲️"],
  ["stunde", "⏳"], ["hour", "⏳"],
  ["tag", "☀️"], ["day", "☀️"],
  ["nacht", "🌙"], ["night", "🌙"],
  ["morgen", "🌅"], ["morning", "🌅"],
  ["mittag", "☀️"], ["noon", "☀️"],
  ["abend", "🌇"], ["evening", "🌇"],
  ["mitternacht", "🌌"], ["midnight", "🌌"],
  ["heute", "📍"], ["today", "📍"],
  ["woche", "📆"], ["week", "📆"],
  ["wochenende", "🌴"], ["weekend", "🌴"],
  ["monat", "🗓️"], ["month", "🗓️"],
  ["jahr", "📅"], ["year", "📅"],
  ["frühling", "🌷"], ["spring", "🌷"],
  ["sommer", "☀️"], ["summer", "☀️"],
  ["herbst", "🍁"], ["autumn", "🍁"], ["fall", "🍁"],
  ["winter", "❄️"],
  ["geburtstag", "🎂"], ["birthday", "🎂"],
  ["fest", "🎊"], ["festival", "🎊"],
  ["party", "🎉"],
  ["weihnachten", "🎄"], ["christmas", "🎄"],
  ["ostern", "🥚"], ["easter", "🥚"],
  ["urlaub", "🏖️"], ["vacation", "🌴"], ["ferien", "🌴"], ["holiday", "🌴"],
  ["reise", "✈️"], ["trip", "✈️"], ["travel", "✈️"],

  // 13. Tools, Office & Study Materials (Strict Match)
  ["werkzeug", "🛠️"], ["tool", "🛠️"],
  ["hammer", "🔨"],
  ["zange", "🗜️"],
  ["säge", "🪚"], ["saw", "🪚"],
  ["schere", "✂️"], ["scissors", "✂️"],
  ["papier", "📄"], ["paper", "📄"],
  ["brief", "✉️"], ["letter", "✉️"],
  ["paket", "📦"], ["package", "📦"], ["box", "📦"],
  ["stift", "✏️"], ["pen", "✏️"], ["kugelschreiber", "🖋️"], ["bleistift", "✏️"], ["pencil", "✏️"],
  ["lineal", "📏"], ["ruler", "📏"],
  ["buch", "📖"], ["book", "📖"],
  ["heft", "📓"], ["notebook", "📓"],
  ["zeitung", "📰"], ["newspaper", "📰"], ["zeitschrift", "📰"], ["magazine", "📰"],
  ["dokument", "📄"], ["document", "📄"],
  ["vertrag", "🤝"], ["contract", "🤝"],
  ["ticket", "🎟️"], ["fahrkarte", "🎫"],
  ["geld", "💶"], ["money", "💶"],
  ["münze", "🪙"], ["coin", "🪙"],
  ["kreditkarte", "💳"], ["credit card", "💳"],
  ["rechnung", "🧾"], ["bill", "🧾"], ["receipt", "🧾"],

  // 14. Colors & Shapes (Strict Match)
  ["rot", "🔴"], ["red", "🔴"],
  ["blau", "🔵"], ["blue", "🔵"],
  ["grün", "🟢"], ["green", "🟢"],
  ["gelb", "🟡"], ["yellow", "🟡"],
  ["orange", "🟠"],
  ["lila", "🟣"], ["purple", "🟣"], ["violett", "🟣"],
  ["rosa", "🌸"], ["pink", "💗"],
  ["braun", "🟤"], ["brown", "🟤"],
  ["schwarz", "⚫"], ["black", "⚫"],
  ["weiß", "⚪"], ["white", "⚪"],
  ["grau", "🩶"], ["gray", "🩶"], ["grey", "🩶"],
  ["silber", "🥈"], ["silver", "🥈"],
  ["gold", "🥇"],
  ["bunt", "🌈"], ["colorful", "🌈"],
  ["kreis", "🔵"], ["circle", "🔵"],
  ["quadrat", "🟦"], ["square", "🟦"],
  ["dreieck", "📐"], ["triangle", "📐"],

  // 15. Concrete Action Verbs & States (Strict Match)
  ["gehen", "🚶"], ["go", "🚶"], ["walk", "🚶"],
  ["rennen", "🏃"], ["run", "🏃"],
  ["springen", "🤾"], ["jump", "🤾"],
  ["schwimmen", "🏊"], ["swim", "🏊"],
  ["klettern", "🧗"], ["climb", "🧗"],
  ["fahren", "🚗"], ["drive", "🚗"], ["ride", "🚴"],
  ["fliegen", "✈️"], ["fly", "✈️"],
  ["reiten", "🏇"],
  ["stehen", "🧍"], ["stand", "🧍"],
  ["sitzen", "🪑"], ["sit", "🪑"],
  ["liegen", "🛏️"], ["lie", "🛏️"],
  ["schlafen", "😴"], ["sleep", "😴"],
  ["träumen", "💭"], ["dream", "💭"],
  ["aufstehen", "⏰"], ["get up", "⏰"], ["wake", "⏰"],
  ["frühstücken", "🥐"], ["breakfast", "🥐"],
  ["trinken", "🥤"],
  ["kochen", "👨‍🍳"], ["cook", "👨‍🍳"], ["backen", "🍞"], ["bake", "🍞"],
  ["schneiden", "🔪"], ["cut", "🔪"],
  ["waschen", "🧺"], ["wash", "🧺"], ["duschen", "🚿"], ["shower", "🚿"], ["baden", "🛁"], ["bathe", "🛁"],
  ["putzen", "🧹"], ["clean", "🧹"], ["aufräumen", "🧺"],
  ["anziehen", "👕"], ["wear", "👕"], ["dress", "👗"],
  ["sehen", "👁️"], ["see", "👁️"], ["schauen", "👀"], ["look", "👀"], ["gucken", "👀"], ["watch", "📺"],
  ["hören", "👂"], ["hear", "👂"], ["zuhören", "🎧"], ["listen", "🎧"],
  ["riechen", "👃"], ["smell", "👃"],
  ["schmecken", "👅"], ["taste", "👅"],
  ["fühlen", "❤️"], ["feel", "❤️"],
  ["sprechen", "🗣️"], ["speak", "🗣️"], ["reden", "💬"], ["talk", "💬"],
  ["sagen", "💬"], ["say", "💬"], ["tell", "💬"],
  ["fragen", "❓"], ["ask", "❓"], ["question", "❓"],
  ["antworten", "💬"], ["answer", "💬"],
  ["erklären", "👨‍🏫"], ["explain", "👨‍🏫"],
  ["rufen", "📣"], ["call", "📱"],
  ["singen", "🎤"], ["sing", "🎤"],
  ["tanzen", "💃"], ["dance", "💃"],
  ["lachen", "😆"], ["laugh", "😆"], ["lächeln", "😊"], ["smile", "😊"],
  ["weinen", "😭"], ["cry", "😭"],
  ["streiten", "💥"], ["fight", "💥"],
  ["küssen", "😘"], ["kiss", "😘"],
  ["umarmen", "🫂"], ["hug", "🫂"],
  ["lieben", "❤️"], ["love", "❤️"], ["liebe", "❤️"],
  ["mögen", "👍"], ["like", "👍"],
  ["freuen", "😄"], ["enjoy", "😊"],
  ["denken", "🤔"], ["think", "💭"],
  ["glauben", "🙏"], ["believe", "🙏"],
  ["hoffen", "🤞"], ["hope", "🤞"],
  ["wünschen", "🌟"], ["wish", "🌟"],
  ["wissen", "🧠"], ["know", "💡"], ["kennen", "🤝"],
  ["verstehen", "💡"], ["understand", "💡"],
  ["erinnern", "💭"], ["remember", "💭"],
  ["vergessen", "🤷"], ["forget", "🤷"],
  ["lernen", "🧠"], ["learn", "🧠"],
  ["studieren", "🎓"], ["study", "🎓"],
  ["lesen", "📖"], ["read", "📖"],
  ["schreiben", "✍️"], ["write", "✍️"],
  ["zeichnen", "🎨"], ["draw", "🖌️"], ["malen", "🖌️"], ["paint", "🎨"],
  ["rechnen", "🧮"], ["calculate", "🧮"],
  ["arbeiten", "💼"], ["work", "🛠️"], ["job", "💼"],
  ["bauen", "🏗️"], ["build", "🏗️"],
  ["reparieren", "🔧"], ["repair", "🔧"], ["fix", "🔧"],
  ["kaufen", "🛍️"], ["buy", "🛒"], ["einkaufen", "🛒"], ["shop", "🛍️"],
  ["bezahlen", "💶"], ["pay", "💳"],
  ["verkaufen", "🏷️"], ["sell", "💰"],
  ["geben", "🎁"], ["give", "🎁"],
  ["nehmen", "✊"], ["take", "✊"],
  ["bringen", "🤲"], ["bring", "🤲"],
  ["fangen", "🤾"], ["catch", "⚾"],
  ["werfen", "⚾"], ["throw", "⚾"],
  ["suchen", "🔍"], ["search", "🔎"],
  ["finden", "🎉"], ["find", "💡"],
  ["verlieren", "🕳️"], ["lose", "🕳️"],
  ["öffnen", "📖"], ["open", "🔓"], ["aufmachen", "🔓"],
  ["schließen", "🚪"], ["close", "🔒"], ["zumachen", "🔒"],
  ["beginnen", "🏁"], ["start", "▶️"], ["anfangen", "🏁"],
  ["beenden", "🛑"], ["end", "🏁"], ["finish", "🏁"], ["aufhören", "⏹️"],
  ["gewinnen", "🏆"], ["win", "🏆"], ["siegen", "🏅"],
  ["treffen", "🤝"], ["meet", "🤝"],
  ["einladen", "💌"], ["invite", "💌"],
  ["besuchen", "🏡"], ["visit", "🧳"],
  ["warten", "⏳"], ["wait", "⏳"],
  ["halten", "🛑"], ["stop", "🛑"],
  ["bleiben", "🏠"], ["stay", "🏠"],
  ["wohnen", "🏡"], ["live", "🏡"],
  ["leben", "💖"], ["life", "💖"],
  ["feiern", "🎉"], ["celebrate", "🎉"],
  ["gratulieren", "🥂"], ["congratulate", "🥂"],
  ["reisen", "✈️"], ["travel", "✈️"], ["packen", "🧳"], ["pack", "🧳"]
];

// Fallback diverse icon deck for unmapped general vocabulary when outside strict games
const FALLBACK_ICON_PALETTE = [
  "🎯", "🏅", "🎨", "🚀", "💎", "🌟", "⚡", "🔮", "🧩", "🏆", 
  "🎪", "🥁", "🛸", "⚓", "🌈", "🔥", "🪐", "🪁", "🎻", "🪘"
];

/**
 * Checks if a word has a strictly controlled, verified visual concept representation.
 * Essential for picture matching games where abstract grammatical words must be avoided.
 */
export function hasStrictVisualIcon(word: WordVisualInput): boolean {
  if (!word || (!word.german && !word.english)) return false;

  // 1. If database explicitly contains a verified specific non-book emoji not in fallback palette
  if (word.emoji && word.emoji !== "📚" && word.emoji.trim() !== "" && !FALLBACK_ICON_PALETTE.includes(word.emoji.trim())) {
    return true;
  }

  const germanLower = (word.german || "").toLowerCase().trim();
  const englishLower = (word.english || "").toLowerCase().trim();

  // 2. Check strict exact or root keyword match against our verified dictionary
  for (const [key] of EMOJI_KEYWORD_MAP) {
    if (
      germanLower === key ||
      englishLower === key ||
      germanLower.includes(key) ||
      englishLower.includes(key)
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Resolves a precise visual emoji/icon representation for any vocabulary word.
 */
export function resolveWordVisualIcon(word: WordVisualInput): string {
  if (!word) return "💡";

  // If the database has a specific non-book emoji, use it directly
  if (word.emoji && word.emoji !== "📚" && word.emoji.trim() !== "" && !FALLBACK_ICON_PALETTE.includes(word.emoji.trim())) {
    return word.emoji.trim();
  }

  const germanLower = (word.german || "").toLowerCase().trim();
  const englishLower = (word.english || "").toLowerCase().trim();

  // 1. Check exact or substring keyword matches in our strict dictionary
  for (const [key, icon] of EMOJI_KEYWORD_MAP) {
    if (
      germanLower === key || 
      englishLower === key ||
      germanLower.includes(key) || 
      englishLower.includes(key)
    ) {
      return icon;
    }
  }

  // 2. Category-based intuitive fallbacks (used only outside strict picture games)
  const cat = (word.category || "").toLowerCase();
  if (cat.includes("noun") || cat.includes("object")) return "🏷️";
  if (cat.includes("verb") || cat.includes("action")) return "🏃";
  if (cat.includes("adj") || cat.includes("desc")) return "🎨";
  if (cat.includes("society") || cat.includes("city")) return "🏙️";
  if (cat.includes("leisure") || cat.includes("travel")) return "✈️";
  if (cat.includes("idiom") || cat.includes("culture")) return "💡";

  // 3. Deterministic hashing so each general word always gets a distinct consistent icon
  const idHash = word.id ? typeof word.id === "number" ? word.id : word.id.toString().length : germanLower.length;
  return FALLBACK_ICON_PALETTE[Math.abs(idHash) % FALLBACK_ICON_PALETTE.length];
}
