import axios from "axios";

const dataset = [
    "Tech", "Codex", "Bit", "Nano", "Cyber", "Quantum", "Logic", "Data", "Synth", "Protocol",
    "Binary", "Machine", "Virtual", "Matrix", "Algo", "Comp", "Electroz", "Chip", "Synapse", "Serx",
    "Dev", "MicroX", "Stream", "Synthetic", "Web", "Noder", "Net", "Quark", "Flux", "Zynth", "Byte",
    "Plasma", "Ether", "Solis", "Volt", "Nova", "Xeno", "Helix", "Zenon", "Lumos", "Titan", "Echo",
    "Orion", "Nexus", "Droid", "Siren", "Hydra", "Eon", "Cyrix", "Astrum", "Vertex", "Prism", "Axon",
    "Xylon", "Dynex", "Zion", "Pulse", "Pixel", "Radi", "Omega", "Orbit", "Terra", "Axis", "Lyra",
    "Zeta", "BitIQ", "RoboCoin", "DataDex", "TechX", "NanoNet", "AIcash", "CodeCoin", "ByteBot",
    "CyberX", "QuBit", "DataX", "AIcoin", "NanoIQ", "ByteX", "CyberQ", "CodeX", "TechIQ", "CoinIQ",
    "RoboX", "Cred", "Neuro", "Quant", "Pluto", "Merx", "Synx", "Digi", "Hexa", "Crypto", "Axiom",
    "Inno", "Nexa", "Neura", "Vivo", "Virta", "Shift", "Sync", "Spect", "Exo", "Uni", "Nex", "Link",
    "Innov", "Evo", "Gen", "Coin", "Bytez", "Flex", "Nexon", "Cyberz", "Syn", "Cortex", "Nexis",
    "Bot", "Aurum", "Crono", "Sol", "Innovix", "Credix", "Voltz", "Nexico", "Dyna", "Synta", "NovaX",
    "Verix", "Linka", "Axia", "Qua", "Bizi", "Coinex", "Prima", "Genix", "Neos", "Cybera", "Linko",
    "Fint", "Exa", "Genex", "Nanoz", "Bitz", "Dyno", "Synex", "Prizm", "Nexo", "Solix", "Trax",
    "Crypt", "Digix", "Innoz", "Syntex", "Cronex", "Fuzex", "Botix", "Cybrix", "Innovex", "Creda",
    "Axix", "Tronix", "Linkix", "Cortexa", "Neuroz", "Digita", "Aurix", "Quantix", "Solux", "Virtix",
    "Botex", "Synix", "Cronix", "Neurox", "Axona", "Vivix", "Synexa", "Fuzix", "Quantex", "Crypta",
    "Aurix", "Nexium", "Aether", "Quanex", "Synexi", "Bitex", "Neural", "DyneX", "Crypti", "Coinyx",
    "Exonix", "Nexify", "Synapt", "Hexo", "Digex", "Cybex", "Tronex", "Axonix", "Solixy", "Coino",
    "Linki", "Cryto", "Botica", "Neuroxi", "Neurix", "Neuray", "Neuroxy",
    "Cash", "Wealth", "Market", "Stock", "Asset", "Capital", "Investment", "TradeIQ", "Credits", "Funds",
    "Deposits", "Interest", "Return", "Gain", "Loss", "Profit", "Revenue", "Economy", "Currency", 
    "Exchange", "Rate", "Wealthy", "Rich", "Billion", "Million", "Stack", "Card", "Checking", "Loan", 
    "Mortgage",  "Insurance",
    "Retirement", "Fund", "Pension", "Annuity", "Equity", "Bond", "Commodity", "Derivative", "Hedge", 
    "Futures",  "Option", "Risk",
    "Earth", "Forest", "Ocean", "Sky", "Cloud", "Sun", "Moon", "Star", "Galaxy", "Mountain", "River", 
    "Lake",  "Stream", "Desert", "Jungle", "Savanna", "Prairie", "Tundra", "Glacier", "Volcano", 
    "Canyon", "Island", "Continent", "Plateau", "Valley", "Abyss", "Cave", "Reef", "Plain", "Delta", 
    "Marsh", "Swamp", "Rainforest",
    "Tropical", "Polar", "Temperate", "Tidal", "Mountainous", "Arctic", "Antarctic", "Aquatic", 
    "Terrestrial",  "Aerial", "Subterranean", "Ecology", "Biology",
    "HODL", "FUD", "FOMO", "Lambo", "Moon", "Rekt", "Whale", "Pump", "Dump", "Shill", "Ponzi", 
    "Rug", "Scam", "Shit", "Hype", "Bubble", "ATH", "Bull", "Bear", "Altcoin", "ICO", "DYOR", "TA", 
    "Stablecoin", "Gas", "Bag",
    "Shrimp", "Pleb", "Meme", "Bogdanoff", "Gorillion", "Lizard", "Fomo", "PumpNDump", "Stonks",
    "Cosmos", "Galaxy", "Star", "Planet", "Asteroid", "Nebula", "Blackhole", "Gravity", "Space", "Time",
    "Light", "Dark", "Energy", "Matter", "Mass", "BigBang", "Expansion", "Infinity", "Singularity", 
    "Multiverse", "Redshift", "Blueshift", "Neutron", "Quasar", "Pulsar", "Supernova", "Cosmic", 
    "Celestial", "Orbit", "Eclipse",
    "Cosmology", "Astrophysics", "Telescope", "Observatory", "Cosmonaut", "Astronaut", 
    "Meteorite", "Comet", "Satellite", "Exoplanet", "Solar", "Lunar", "Chain", "Swap", "Token",
    "Pool", "Hub", "Labs", "Lab", "DAO", "Bridge", "Gateway", "Service", "Node", "Club", "Box", 
    "Machine", "App", "Center", "Seed", "Block", "Forge", "Nest", "Tree", "Pond", "Pod", "Bee", "Go", 
    "Jet", "Hive", "Rise",
    "Base", "Harbor", "Range", "Sphere", "Wing", "Gate", "Park", "Den", "Vine", "Track", "Loop", "Coop",
    "Hatch", "Port", "Stack", "Ridge", "Pulse", "Warp", "Wire", "Storm", "Grid", "Echo", "Shell", "Burst",
    "Fusion", "Shark", "Wave", "Zen", "Wish", "Wizard", "Wood", "Zero", "Zone", "Zoom", "Oracle", 
    "Meta", "Gem", "Crystal", "Portal", "Soul", "Heart", "Essence", "Wisdom", "Knowledge", "Eternity", 
    "Dimension", "Element", "Particle", "Explorer", "Adventurer", "Pioneer", "Trailblazer", "Discovery", 
    "Treasure",  "Fortune", "Prosperity", "Abundance", "Riches", "Luxury", "Opulence", "Success", 
    "Victory", "Triumph",
    "Champion", "Hero", "Legend", "Myth", "Saga", "Epic", "Chronicle", "Tale", "Narrative", "Odyssey",
    "Expedition", "Campaign", "Ascendancy", "Dominance", "Supremacy", "Sovereignty", "Authority", 
    "Rule", "Reign", "Empire", "Kingdom", "Dynasty", "Regime", "Territory", "Land", "Nation", "State", 
    "Region", "District", "County", "City", "Town", "Village", "Hamlet", "Settlement", "Community",
    "Neighborhood", "Street", "Road", "Avenue", "Lane", "Boulevard", "Highway", "Path", "Trail", 
    "Way", "Passage", "Alley", "Square", "Plaza", "Market", "Bazaar", "Mall", "Center", "Junction",
    "Intersection", "Crossing", "Connection", "Bridge", "Portal", "Door", "Entrance", "Exit", "Escape",
    "Pathway", "Corridor", "Hallway", "Passageway", "Gallery", "Atrium", "Chamber", "Room", "Hall", 
    "Parlor", "Lounge", "Study", "Library", "Office", "Workshop", "Studio", "Factory", "Mill", "Plant",
    "Worksite", "Foundry", "Mint", "Warehouse", "Depot", "Repository", "Storage", "Treasury", 
    "Hoarde", "Reserve", "Stockpile", "Heap", "Mountain", "Hill", "Plateau", "Valley", "Plain", "Meadow",
    "Field", "Desert", "Oasis", "Dune", "Sand", "Beach", "Coast", "Seashore", "Bay", "Gulf", "Harbor",
    "Port", "Dock", "Marina", "Pier", "Jetty", "Anchor", "Buoy", "Lighthouse", "Light", "Beacon", "Signal",
    "Flare", "Torch", "Lantern", "Candle", "Fire", "Flame", "Spark", "Ember", "Heat", "Warmth", 
    "Bonfire", "Campfire", "Blaze", "Inferno", "Furnace", "Oven", "Stove", "Cooker", "Grill", "Barbecue",
    "Campstove", "Incinerator", "Pyre", "Crematorium", "Scorcher", "Scorched Earth", "Ashes", 
    "Smoke", "Steam", "Fog", "Mist", "Haze", "Vapor", "Rain", "Drizzle", "Shower", "Downpour", 
    "Thunder", "Lightning", "Hurricane", "Tornado", "Twister", "Cyclone", "Typhoon", "Tempest", 
    "Gale", "Breeze", "Wind", "Zephyr",
    "Gust", "Draft", "Blast", "Whirlwind", "Vortex", "Whirlpool", "Swirl", "Eddy", "Current", "Tide", 
    "Wave", "Surf", "Ripple", "Breaker", "Undertow", "Stream", "River", "Creek", "Brook", "Streamlet", 
    "Rivulet", "Torrent", "Cascade", "Waterfall", "Falls", "Plunge", "Chute", "Spout", "Spray", "Float", 
    "Raft", "Canoe",
    "Kayak", "Paddle", "Oar", "Row", "Boat", "Ship", "Yacht", "Sailboat", "Sloop", "Schooner", "Clipper",
    "Frigate", "Galley", "Galleon", "Cruiser", "Carrier", "Battleship", "Destroyer", "Submarine", 
    "Mine", "Navy", "Admiral", "Captain", "Skipper", "Helmsman", "Navigator", "Sailor", "Seaman", 
    "Crew", "Deck", "Hull", "Mast", "Sail", "Rudder", "Keel", "Bow",
];

// Function to fetch derivatives of a keyword using Datamuse API
async function fetchDerivatives(keyword, relation) {
    try {
        const response = await axios.get(`https://api.datamuse.com/words?${relation}=${keyword}`);
        // Filter out words with spaces or dashes
        return response.data
            .map(entry => entry.word)
            .filter(word => !/\s|-/.test(word));
    } catch (error) {
        console.error(`Error fetching ${relation} for ${keyword}:`, error);
        return [];
    }
}

// Function to check if a keyword is valid and meaningful
async function isValidKeyword(keyword) {
    // Check if the keyword meets length criteria
    if (keyword.length < 3 || keyword.length > 10) {
        return false;
    }

    // Check if the keyword consists of only letters
    if (!/^[a-zA-Z]+$/.test(keyword)) {
        return false;
    }

    // Check if the keyword contains exactly 3 repetitions of the same character
    if (/(\w)\1\1/.test(keyword)) {
        return false;
    }

    // If none of the checks fail, consider the keyword valid and meaningful
    return true;
}

// Function to generate token with related word
export async function generateTokenWithRelatedWord(keyword) {
    try {
        // Check if keyword is provided and valid
        if (!keyword || !(await isValidKeyword(keyword))) {
            console.error("Invalid or missing keyword.");
            return null;
        }

        // Fetch related words for the keyword (using means like as an example)
        const relatedWords = await fetchDerivatives(keyword, "ml");

        // Check if related words are available
        if (relatedWords.length === 0) {
            console.error("No meaningful related words found.");
            return null;
        }

        // Choose a random word from the dataset and capitalize its first letter
        const randomWord = dataset[Math.floor(Math.random() * dataset.length)];
        const capitalizedRandomWord = randomWord.charAt(0).toUpperCase() + randomWord.slice(1);

        // Choose a random related word from the Datamuse response and capitalize its first letter
        const randomRelatedWord = relatedWords[Math.floor(Math.random() * relatedWords.length)];
        const capitalizedRandomRelatedWord = randomRelatedWord.charAt(0).toUpperCase() + randomRelatedWord.slice(1);

        // Generate the token name by concatenating the capitalized related word and random word
        const tokenName = `${capitalizedRandomRelatedWord}${capitalizedRandomWord}`;

        // Generate the token symbol
        let midIndex;
        if (tokenName.length % 2 === 0) {
            // For even-length names, choose the letter to the left of the exact middle
            midIndex = tokenName.length / 2 - 1;
        } else {
            // For odd-length names, choose the exact middle letter
            midIndex = Math.floor(tokenName.length / 2);
        }
        const symbol = `${tokenName[0].toUpperCase()}${tokenName[midIndex].toUpperCase()}${tokenName[tokenName.length - 1].toUpperCase()}`;

        // Generate the token supply (random value between 100,000,000 and 1,000,000,000)
        const supply = Math.floor(Math.random() * (1000000000 - 100000000 + 1)) + 100000000;

        // Decimal fixed to 9
        const decimal = 9;

        // console.log("generated token info: ", tokenName, symbol, supply, decimal, relatedWords);

        return {
            name: tokenName,
            symbol: symbol,
            supply: supply,
            decimal: decimal
        };
    } catch (error) {
        console.error("Error generating token:", error);
        return {
            name: "",
            symbol: "",
            supply: 0,
            decimal: 0
        };
    }
}