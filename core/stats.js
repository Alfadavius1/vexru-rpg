// core/stats.js
const fs = require("fs");
const path = "./data/stats.json";
const { getProfession } = require("./profese");

function loadStats() {
    if (!fs.existsSync(path)) return {};
    try {
        const raw = fs.readFileSync(path, "utf8").trim();
        if (!raw) return {};
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

function saveStats(db) {
    fs.writeFileSync(path, JSON.stringify(db, null, 2));
}

function loadUserProfile(username) {
    if (!fs.existsSync("./data/users.json")) return null;
    const db = JSON.parse(fs.readFileSync("./data/users.json", "utf8") || "{}");
    return db[username.toLowerCase()] || null;
}

function getUserProfessions(username) {
    const u = loadUserProfile(username) || {};
    const keys = [u.profession1, u.profession2, u.profession3].filter(Boolean);
    return keys.map(k => getProfession(k)).filter(Boolean);
}

function generateStats(level, professions = []) {
    const base = {
        hp: 100 + level * 5,
        currentHP: 0,
        strength: 10 + level * 2,
        defense: 5 + level * 1,
        agility: 5 + level * 1,
        luck: Math.floor(level / 3)
    };

    for (const p of professions) {
        base.hp += p.bonuses.hp;
        base.strength += p.bonuses.strength;
        base.defense += p.bonuses.defense;
        base.agility += p.bonuses.agility;
        base.luck += p.bonuses.luck;
    }

    if (base.hp < 1) base.hp = 1;
    base.currentHP = base.hp;
    return base;
}

function getStats(username, level = 1) {
    const key = username.toLowerCase();
    const db = loadStats();

    if (!db[key]) {
        const profs = getUserProfessions(username);
        db[key] = generateStats(level, profs);
        saveStats(db);
    }

    return db[key];
}

function updateStats(username, level) {
    const key = username.toLowerCase();
    const db = loadStats();
    const profs = getUserProfessions(username);

    if (!db[key]) {
        db[key] = generateStats(level, profs);
        saveStats(db);
        return;
    }

    const old = db[key];
    const fresh = generateStats(level, profs);
    const ratio = old.hp > 0 ? old.currentHP / old.hp : 1;
    fresh.currentHP = Math.max(1, Math.floor(fresh.hp * ratio));

    db[key] = fresh;
    saveStats(db);
}

function changeHP(username, delta) {
    const key = username.toLowerCase();
    const db = loadStats();
    if (!db[key]) return null;

    const s = db[key];
    s.currentHP += delta;
    if (s.currentHP > s.hp) s.currentHP = s.hp;
    if (s.currentHP < 0) s.currentHP = 0;

    db[key] = s;
    saveStats(db);
    return s;
}

function applyDeath(username) {
    const key = username.toLowerCase();
    const db = loadStats();
    if (!db[key]) return;

    db[key].currentHP = Math.max(1, Math.floor(db[key].hp * 0.25));
    saveStats(db);
}

module.exports = {
    getStats,
    updateStats,
    changeHP,
    applyDeath
};
