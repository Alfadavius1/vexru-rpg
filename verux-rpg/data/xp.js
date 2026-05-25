// core/xp.js
const fs = require("fs");
const path = "./data/users.json";
const { xpNeeded } = require("./levels");
const { getRank } = require("./ranks");
const { getRarityInfo } = require("../data/rarity");

function loadDB() {
    if (!fs.existsSync(path)) return {};
    return JSON.parse(fs.readFileSync(path));
}

function saveDB(db) {
    fs.writeFileSync(path, JSON.stringify(db, null, 2));
}

function addXP(username, amount) {
    const db = loadDB();
    const key = username.toLowerCase();

    if (!db[key]) return;

    const user = db[key];

    // Základní hodnoty
    user.level ??= 1;
    user.xp ??= 0;
    user.stats ??= { dmg: 5, luck: 1, hp: 100 };
    user.gear ??= { weapon: null, armor: null, trinket: null };

    // XP buffy z gearu
    let xpBuff = 0;

    for (const slot of ["weapon", "armor", "trinket"]) {
        const item = user.gear[slot];
        if (!item) continue;

        const info = getRarityInfo(item.rarity);
        if (!info) continue;

        xpBuff += info.buffs.xp;
    }

    // Aplikace buffů
    const finalXP = amount + xpBuff;

    user.xp += finalXP;

    // LEVEL UP
    let needed = xpNeeded(user.level);

    while (user.xp >= needed) {
        user.xp -= needed;
        user.level++;

        // Stat bonusy za level
        user.stats.dmg += 1;
        user.stats.hp += 5;

        needed = xpNeeded(user.level);
    }

    // Aktualizace ranku
    user.rank = getRank(user.level);

    saveDB(db);
}

module.exports = { addXP };
