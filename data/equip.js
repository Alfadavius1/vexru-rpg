// core/equip.js
const fs = require("fs");
const path = "./data/users.json";

function loadDB() {
    if (!fs.existsSync(path)) return {};
    return JSON.parse(fs.readFileSync(path));
}

function saveDB(db) {
    fs.writeFileSync(path, JSON.stringify(db, null, 2));
}

function equipItem(username, itemName) {
    const db = loadDB();
    const key = username.toLowerCase();

    if (!db[key]) return { error: "Profil neexistuje." };

    const inv = db[key].inventory || [];
    const item = inv.find(i => i.name.toLowerCase() === itemName.toLowerCase());

    if (!item) return { error: "Item nebyl nalezen v inventáři." };

    // slot podle typu
    const slot = item.type;
    if (!["weapon", "armor", "trinket"].includes(slot)) {
        return { error: "Tento item nejde equipnout." };
    }

    // přesun do gearu
    db[key].gear = db[key].gear || {};
    const previous = db[key].gear[slot] || null;

    db[key].gear[slot] = item;

    saveDB(db);

    return { success: true, previous };
}

function unequipItem(username, slot) {
    const db = loadDB();
    const key = username.toLowerCase();

    if (!db[key]) return { error: "Profil neexistuje." };

    if (!["weapon", "armor", "trinket"].includes(slot)) {
        return { error: "Neplatný slot." };
    }

    const previous = db[key].gear?.[slot] || null;

    db[key].gear[slot] = null;
    saveDB(db);

    return { success: true, previous };
}

module.exports = { equipItem, unequipItem };
