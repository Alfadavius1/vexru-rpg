const fs = require("fs");
const path = require("path");

const xpPath = path.join(__dirname, "..", "data", "xp.json");

// Načtení XP databáze
function loadXP() {
    if (!fs.existsSync(xpPath)) return {};
    return JSON.parse(fs.readFileSync(xpPath, "utf8"));
}

// Uložení XP databáze
function saveXP(db) {
    fs.writeFileSync(xpPath, JSON.stringify(db, null, 2));
}

// Získání uživatele
function getUser(username) {
    const db = loadXP();
    return db[username] || null;
}

// Přidání XP
function addXP(username, amount) {
    const db = loadXP();

    if (!db[username]) {
        db[username] = { xp: 0, level: 1 };
    }

    db[username].xp += amount;

    const needed = getNeededXP(db[username].level);

    if (db[username].xp >= needed) {
        db[username].level++;
        db[username].xp = 0;
    }

    saveXP(db);
}

// XP potřebné na level
function getNeededXP(level) {
    return 50 + level * 25;
}

// TOP žebříček
function getTop(limit = 10) {
    const db = loadXP();

    const arr = Object.entries(db).map(([username, data]) => ({
        username,
        xp: data.xp,
        level: data.level
    }));

    return arr
        .sort((a, b) => b.level - a.level || b.xp - a.xp)
        .slice(0, limit);
}

module.exports = { getUser, addXP, getNeededXP, getTop };
