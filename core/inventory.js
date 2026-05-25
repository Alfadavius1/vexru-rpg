const fs = require("fs");
const path = require("path");

const invPath = path.join(__dirname, "..", "data", "inventory.json");

// Načtení inventáře
function loadInv() {
    if (!fs.existsSync(invPath)) return {};
    const raw = fs.readFileSync(invPath, "utf8").trim();
    if (!raw) return {};
    return JSON.parse(raw);
}

// Uložení inventáře
function saveInv(db) {
    fs.writeFileSync(invPath, JSON.stringify(db, null, 2));
}

// Přidání itemu hráči
function addItem(username, item) {
    const db = loadInv();

    if (!db[username]) db[username] = [];

    db[username].push(item);

    saveInv(db);
}

// Získání inventáře hráče
function getInventory(username) {
    const db = loadInv();
    return db[username] || [];
}

module.exports = {
    addItem,
    getInventory
};
