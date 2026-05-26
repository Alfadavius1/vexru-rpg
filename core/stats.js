const fs = require("fs");
const path = "./data/stats.json";

// Bezpečné načtení databáze
function loadStats() {
    if (!fs.existsSync(path)) return {};

    try {
        const raw = fs.readFileSync(path, "utf8").trim();
        if (!raw) return {};
        return JSON.parse(raw);
    } catch (err) {
        console.error("Chyba při načítání stats.json:", err);
        return {};
    }
}

// Bezpečné uložení
function saveStats(db) {
    fs.writeFileSync(path, JSON.stringify(db, null, 2));
}

// Vytvoření statistik podle levelu
function generateStats(level) {
    const maxHP = 100 + level * 5;

    return {
        hp: maxHP,
        currentHP: maxHP,
        strength: 10 + level * 2,
        defense: 5 + level * 1,
        luck: Math.floor(level / 3)
    };
}

// Získání statistik hráče
function getStats(username, level = 1) {
    const db = loadStats();
    const key = username.toLowerCase();

    // Pokud hráč nemá statistiky → vytvoříme
    if (!db[key]) {
        db[key] = generateStats(level);
        saveStats(db);
    }

    return db[key];
}

// Aktualizace statistik při level-upu
function updateStats(username, level) {
    const db = loadStats();
    const key = username.toLowerCase();

    if (!db[key]) {
        db[key] = generateStats(level);
        saveStats(db);
        return;
    }

    const old = db[key];
    const newStats = generateStats(level);

    // zachováme poměr HP
    const ratio = old.currentHP / old.hp;
    newStats.currentHP = Math.floor(newStats.hp * ratio);

    db[key] = newStats;
    saveStats(db);
}

// Nastavení HP na 25 % po smrti
function applyDeath(username) {
    const db = loadStats();
    const key = username.toLowerCase();

    if (!db[key]) return;

    db[key].currentHP = Math.floor(db[key].hp * 0.25);
    saveStats(db);
}

module.exports = {
    loadStats,
    saveStats,
    getStats,
    updateStats,
    applyDeath
};
