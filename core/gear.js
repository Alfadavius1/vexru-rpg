const fs = require("fs");
const path = require("path");
const { addItem } = require("./inventory");
const { loadStats, saveStats } = require("./stats");

const gearPath = path.join(__dirname, "..", "data", "gear.json");

// Načtení databáze
function loadGear() {
    if (!fs.existsSync(gearPath)) return {};
    const raw = fs.readFileSync(gearPath, "utf8").trim();
    if (!raw) return {};
    return JSON.parse(raw);
}

// Uložení databáze
function saveGear(db) {
    fs.writeFileSync(gearPath, JSON.stringify(db, null, 2));
}

// Sloty
const validSlots = ["weapon", "armor", "ring", "bracelet"];

// Nasazení itemu
function equipItem(username, item) {
    const gear = loadGear();
    const stats = loadStats();

    if (!gear[username]) {
        gear[username] = {
            weapon: null,
            armor: null,
            ring: null,
            bracelet: null
        };
    }

    const slot = item.type;
    if (!validSlots.includes(slot)) return false;

    // Pokud má hráč něco nasazené → vrátíme do inventáře
    if (gear[username][slot]) {
        addItem(username, gear[username][slot]);
    }

    // Nasadíme nový item
    gear[username][slot] = item;
    saveGear(gear);

    // Přepočítáme staty
    recalcStats(username);

    return true;
}

// Sundání itemu
function unequipItem(username, slot) {
    const gear = loadGear();
    if (!gear[username]) return false;

    if (!validSlots.includes(slot)) return false;

    const item = gear[username][slot];
    if (!item) return false;

    // Vrátíme do inventáře
    addItem(username, item);

    // Odebereme ze slotu
    gear[username][slot] = null;
    saveGear(gear);

    // Přepočítáme staty
    recalcStats(username);

    return true;
}

// Přepočet statů hráče podle gearu
function recalcStats(username) {
    const gear = loadGear();
    const stats = loadStats();

    if (!stats[username]) return;

    // Základní staty hráče
    let base = stats[username];

    // Reset bonusů
    base.bonusAttack = 0;
    base.bonusDefense = 0;
    base.bonusHP = 0;

    if (gear[username]) {
        for (const slot of validSlots) {
            const item = gear[username][slot];
            if (item && item.stats) {
                base.bonusAttack += item.stats.attack || 0;
                base.bonusDefense += item.stats.defense || 0;
                base.bonusHP += item.stats.hp || 0;
            }
        }
    }

    // Aplikace bonusů
    base.strengthTotal = base.strength + base.bonusAttack;
    base.defenseTotal = base.defense + base.bonusDefense;
    base.hpTotal = base.hp + base.bonusHP;

    // Pokud HP klesne pod currentHP → upravíme
    if (base.currentHP > base.hpTotal) {
        base.currentHP = base.hpTotal;
    }

    saveStats(stats);
}

module.exports = {
    loadGear,
    saveGear,
    equipItem,
    unequipItem,
    recalcStats,
    validSlots
};
