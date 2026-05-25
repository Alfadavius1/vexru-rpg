const fs = require("fs");
const path = require("path");

const invPath = path.join(__dirname, "..", "data", "inventory.json");

// Načtení databáze
function loadInv() {
    if (!fs.existsSync(invPath)) return {};
    const raw = fs.readFileSync(invPath, "utf8").trim();
    if (!raw) return {};
    return JSON.parse(raw);
}

// Uložení databáze
function saveInv(db) {
    fs.writeFileSync(invPath, JSON.stringify(db, null, 2));
}

// Přidání itemu (objekt + stackování)
function addItem(username, item) {
    const db = loadInv();
    if (!db[username]) db[username] = [];

    // Pokud item existuje → stackujeme
    const existing = db[username].find(i => i.name === item.name);

    if (existing) {
        existing.amount += item.amount || 1;
    } else {
        db[username].push({
            name: item.name,
            rarity: item.rarity || "common",
            type: item.type || "material",
            amount: item.amount || 1,
            value: item.value || 1
        });
    }

    saveInv(db);
}

// Odebrání itemu
function removeItem(username, itemName, amount = 1) {
    const db = loadInv();
    if (!db[username]) return false;

    const item = db[username].find(i => i.name === itemName);
    if (!item) return false;

    if (item.amount < amount) return false;

    item.amount -= amount;

    if (item.amount <= 0) {
        db[username] = db[username].filter(i => i.name !== itemName);
    }

    saveInv(db);
    return true;
}

// Získání inventáře hráče
function getInventory(username) {
    const db = loadInv();
    return db[username] || [];
}

module.exports = {
    loadInv,
    saveInv,
    addItem,
    removeItem,
    getInventory
};
