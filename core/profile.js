// core/profile.js
const fs = require("fs");
const path = "./data/users.json";
const { getRarityInfo } = require("./rarity");

function loadDB() {
    if (!fs.existsSync(path)) return {};
    return JSON.parse(fs.readFileSync(path));
}

function getProfile(username) {
    const db = loadDB();
    const key = username.toLowerCase();

    if (!db[key]) return null;

    const user = db[key];

    user.level ??= 1;
    user.xp ??= 0;
    user.gold ??= 0;
    user.rank ??= "Bronze";
    user.stats ??= { dmg: 5, luck: 1, hp: 100 };
    user.gear ??= { weapon: null, armor: null, trinket: null };
    user.inventory ??= [];

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
