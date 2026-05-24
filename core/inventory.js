// core/inventory.js
const fs = require("fs");
const path = "./data/users.json";

function loadDB() {
    if (!fs.existsSync(path)) return {};
    return JSON.parse(fs.readFileSync(path));
}

function saveDB(db) {
    fs.writeFileSync(path, JSON.stringify(db, null, 2));
}

function addItem(username, item) {
    const db = loadDB();
    const key = username.toLowerCase();

    if (!db[key]) db[key] = { inventory: [] };

    const inv = db[key].inventory;

    const existing = inv.find(i => i.name === item.name && i.rarity === item.rarity);

    if (existing) {
        existing.amount += 1;
    } else {
        item.amount = 1;
        inv.push(item);
    }

    saveDB(db);
}

function getInventory(username) {
    const db = loadDB();
    const key = username.toLowerCase();
    if (!db[key]) return [];
    return db[key].inventory;
}

module.exports = { addItem, getInventory };
