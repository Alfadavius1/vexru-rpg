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

    // Pokud profil neexistuje → vytvoříme kompletní základ
    if (!db[key]) {
        db[key] = {
            level: 1,
            xp: 0,
            gold: 0,
            rank: "Bronze",
            stats: { dmg: 5, luck: 1, hp: 100 },
            gear: { weapon: null, armor: null, trinket: null },
            inventory: []
        };
    }

    db[key].inventory ??= [];

    // Každý item je samostatný objekt (žádné stacky)
    db[key].inventory.push({
        name: item.name,
        rarity: item.rarity,
        type: item.type
    });

    saveDB(db);
}

function getInventory(username) {
    const db = loadDB();
    const key = username.toLowerCase();
    if (!db[key]) return [];
    return db[key].inventory || [];
}

module.exports = { addItem, getInventory };

