// core/stats.js
const fs = require("fs");
const path = "./data/stats.json";

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

function saveStats(db) {
    fs.writeFileSync(path, JSON.stringify(db, null, 2));
}

// základní generování statů podle levelu
function generateStats(level) {
    const maxHP = 100 + level * 5;

    return {
        hp: maxHP,
        currentHP: maxHP,
        strength: 10 + level * 2,
        defense: 5 + level * 1,
        agility: 5 + level * 1,   // 🆕 obratnost
        luck: Math.floor(level / 3)
    };
}

function getStats(username, level = 1) {
    const db = loadStats();
    const key = username.toLowerCase();

    if (!db[key]) {
        db[key] = generateStats(level);
        saveStats(db);
    }

    return db[key];
}

// přepočet statů při level-upu
function updateStats(username, level) {
    const db = loadStats();
    const key = username.toLowerCase();

    if (!db[key]) {
        db[key] = generateStats(level);
        saveStats(db);
        return;
    }

    const old = db[key];
    const fresh = generateStats(level);

    const ratio = old.hp > 0 ? old.currentHP / old.hp : 1;
    fresh.currentHP = Math.max(1, Math.floor(fresh.hp * ratio));

    db[key] = fresh;
    saveStats(db);
}

// změna HP (např. při lovu / boji)
function changeHP(username, delta) {
    const db = loadStats();
    const key = username.toLowerCase();
    if (!db[key]) return null;

    const s = db[key];
    s.currentHP += delta;
    if (s.currentHP > s.hp) s.currentHP = s.hp;
    if (s.currentHP < 0) s.currentHP = 0;

    db[key] = s;
    saveStats(db);
    return s;
}

// smrt → 25 % HP
function applyDeath(username) {
    const db = loadStats();
    const key = username.toLowerCase();
    if (!db[key]) return;

    db[key].currentHP = Math.max(1, Math.floor(db[key].hp * 0.25));
    saveStats(db);
}

module.exports = {
    loadStats,
    saveStats,
    getStats,
    updateStats,
    changeHP,
    applyDeath
};
