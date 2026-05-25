const fs = require("fs");
const path = require("path");

const goldPath = path.join(__dirname, "..", "data", "gold.json");

// Načtení databáze
function loadGold() {
    if (!fs.existsSync(goldPath)) return {};
    const raw = fs.readFileSync(goldPath, "utf8").trim();
    if (!raw) return {};
    return JSON.parse(raw);
}

// Uložení databáze
function saveGold(db) {
    fs.writeFileSync(goldPath, JSON.stringify(db, null, 2));
}

// Získání goldů hráče
function getGold(username) {
    const db = loadGold();
    return db[username] || 0;
}

// Přidání goldů
function addGold(username, amount) {
    const db = loadGold();
    if (!db[username]) db[username] = 0;

    db[username] += amount;
    saveGold(db);
}

// Odebrání goldů
function removeGold(username, amount) {
    const db = loadGold();
    if (!db[username]) db[username] = 0;

    if (db[username] < amount) return false; // nemá dost

    db[username] -= amount;
    saveGold(db);
    return true;
}

module.exports = {
    loadGold,
    saveGold,
    getGold,
    addGold,
    removeGold
};
