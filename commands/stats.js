const fs = require("fs");
const path = require("path");

const statsPath = path.join(__dirname, "..", "data", "stats.json");

// Načtení databáze
function loadStats() {
    if (!fs.existsSync(statsPath)) return {};
    const raw = fs.readFileSync(statsPath, "utf8").trim();
    if (!raw) return {};
    return JSON.parse(raw);
}

// Uložení databáze
function saveStats(db) {
    fs.writeFileSync(statsPath, JSON.stringify(db, null, 2));
}

// Vytvoření statistik podle levelu
function generateStats(level) {
    const maxHP = 100 + level * 5;

    return {
        hp: maxHP,               // maximální HP
        currentHP: maxHP,        // aktuální HP
        strength: 10 + level * 2,
        defense: 5 + level * 1,
        luck: Math.floor(level / 3)
    };
}

// Získání statistik hráče
function getStats(username, level = 1) {
    const db = loadStats();

    if (!db[username]) {
        db[username] = generateStats(level);
        saveStats(db);
    }

    return db[username];
}

// Aktualizace statistik při level-upu
function updateStats(username, level) {
    const db = loadStats();
    const old = db[username];

    const newStats = generateStats(level);

    // zachováme currentHP poměrně
    const ratio = old.currentHP / old.hp;
    newStats.currentHP = Math.floor(newStats.hp * ratio);

    db[username] = newStats;
    saveStats(db);
}

// Nastavení HP na 25 % po smrti
function applyDeath(username) {
    const db = loadStats();
    if (!db[username]) return;

    const stats = db[username];
    stats.currentHP = Math.floor(stats.hp * 0.25);

    saveStats(db);
}

module.exports = {
    loadStats,
    saveStats,
    getStats,
    updateStats,
    applyDeath
};
