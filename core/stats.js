const fs = require("fs");
const path = require("path");

const statsFile = path.join(__dirname, "../data/stats.json");

// Pokud soubor neexistuje → vytvoříme prázdný
if (!fs.existsSync(statsFile)) {
    fs.writeFileSync(statsFile, JSON.stringify({}, null, 4));
}

// Načtení statů
function loadStats() {
    try {
        const data = fs.readFileSync(statsFile, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Chyba při načítání stats.json:", err);
        return {};
    }
}

// Uložení statů
function saveStats(stats) {
    try {
        fs.writeFileSync(statsFile, JSON.stringify(stats, null, 4));
    } catch (err) {
        console.error("Chyba při ukládání stats.json:", err);
    }
}

// Vytvoření nové postavy
function createPlayer(username) {
    const stats = loadStats();

    stats[username] = {
        level: 1,
        xp: 0,
        xpNeeded: 100,

        // základní staty
        strength: 5,
        defense: 5,
        vitality: 10,

        // celkové staty (gear + base)
        strengthTotal: 5,
        defenseTotal: 5,
        vitalityTotal: 10,

        // HP
        maxHP: 50,
        currentHP: 50,

        // goldy
        gold: 0,

        // inventář + gear
        inventory: [],
        gear: {
            weapon: null,
            helmet: null,
            chest: null,
            boots: null,
            ring: null
        }
    };

    saveStats(stats);
    return stats[username];
}

// Aktualizace celkových statů podle gearu
function recalcStats(username) {
    const stats = loadStats();
    const p = stats[username];
    if (!p) return;

    let str = p.strength;
    let def = p.defense;
    let vit = p.vitality;

    for (const slot in p.gear) {
        const item = p.gear[slot];
        if (item && item.stats) {
            str += item.stats.str || 0;
            def += item.stats.def || 0;
            vit += item.stats.vit || 0;
        }
    }

    p.strengthTotal = str;
    p.defenseTotal = def;
    p.vitalityTotal = vit;

    p.maxHP = 40 + vit * 5;
    if (p.currentHP > p.maxHP) p.currentHP = p.maxHP;

    saveStats(stats);
}

module.exports = {
    loadStats,
    saveStats,
    createPlayer,
    recalcStats
};
