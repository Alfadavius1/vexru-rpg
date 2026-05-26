// core/profile.js
const fs = require("fs");
const path = "./data/users.json";
const { getRarityInfo } = require("../core/rarity.js");

function loadDB() {
    if (!fs.existsSync(path)) return {};
    return JSON.parse(fs.readFileSync(path));
}

function saveDB(db) {
    fs.writeFileSync(path, JSON.stringify(db, null, 2));
}

function createProfile(username) {
    return {
        level: 1,
        xp: 0,
        gold: 0,
        rank: "Bronze",
        stats: { dmg: 5, luck: 1, hp: 100 },
        gear: { weapon: null, armor: null, trinket: null },
        inventory: []
    };
}

function getProfile(username) {
    const db = loadDB();
    const key = username.toLowerCase();

    // 🔥 Pokud profil neexistuje → vytvoříme ho
    if (!db[key]) {
        db[key] = createProfile(username);
        saveDB(db);
    }

    const user = db[key];

    // Default hodnoty (pro staré profily)
    user.level ??= 1;
    user.xp ??= 0;
    user.gold ??= 0;
    user.rank ??= "Bronze";
    user.stats ??= { dmg: 5, luck: 1, hp: 100 };
    user.gear ??= { weapon: null, armor: null, trinket: null };
    user.inventory ??= [];

    // Výpočet buffů
    let totalBuffs = { xp: 0, dmg: 0, luck: 0, gold: 0 };

    for (const slot of ["weapon", "armor", "trinket"]) {
        const item = user.gear[slot];
        if (!item) continue;

        const info = getRarityInfo(item.rarity);
        if (!info) continue;

        totalBuffs.xp += info.buffs.xp;
        totalBuffs.dmg += info.buffs.dmg;
        totalBuffs.luck += info.buffs.luck;
        totalBuffs.gold += info.buffs.gold;
    }

    // Uložíme zpět
    db[key] = user;
    saveDB(db);

    return {
        level: user.level,
        xp: user.xp,
        gold: user.gold,
        rank: user.rank,
        stats: user.stats,
        gear: user.gear,
        buffs: totalBuffs,
        inventoryCount: user.inventory.length
    };
}

module.exports = { getProfile };
