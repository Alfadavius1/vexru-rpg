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

    db[key].inventory ??= [];
    db[key].gear ??= { weapon: null, armor: null, trinket: null };

    const inv = db[key].inventory;

    // Najdeme item v inventáři
    const itemIndex = inv.findIndex(i => i.name.toLowerCase() === itemName.toLowerCase());
    if (itemIndex === -1) return { error: "Item nebyl nalezen v inventáři." };

    const item = inv[itemIndex];

    // Slot podle typu
    const slot = item.type;
    if (!["weapon", "armor", "trinket"].includes(slot)) {
        return { error: "Tento item nejde equipnout." };
    }

    // Předchozí item (pokud existuje)
    const previous = db[key].gear[slot] || null;

    // Equipneme nový item
    db[key].gear[slot] = item;

    // Odebereme item z inventáře
    inv.splice(itemIndex, 1);

    // Pokud tam byl předchozí item → vrátíme ho do inventáře
    if (previous) {
        inv.push(previous);
    }

    saveDB(db);

    return { success: true, previous };
}

function unequipItem(username, slot) {
    const db = loadDB();
    const key = username.toLowerCase();

    if (!db[key]) return { error: "Profil neexistuje." };

    db[key].inventory ??= [];
    db[key].gear ??= { weapon: null, armor: null, trinket: null };

    if (!["weapon", "armor", "trinket"].includes(slot)) {
        return { error: "Neplatný slot." };
    }

    const previous = db[key].gear[slot] || null;

    if (!previous) {
        return { success: true, previous: null };
    }

    // Vrátíme item do inventáře
    db[key].inventory.push(previous);

    // Vyprázdníme slot
    db[key].gear[slot] = null;

    saveDB(db);

    return { success: true, previous };
}

module.exports = { equipItem, unequipItem };

