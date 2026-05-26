// core/profile.js
const fs = require("fs");
const path = "./data/users.json";
const { getRarityInfo } = require("./rarity");

function loadDB() {
    if (!fs.existsSync(path)) return {};
    return JSON.parse(fs.readFileSync(path, "utf8") || "{}");
}

function saveDB(db) {
    fs.writeFileSync(path, JSON.stringify(db, null, 2));
}

function createProfile() {
    return {
        level: 1,
        xp: 0,
        gold: 0,
        rank: "Bronze",
        gear: { weapon: null, armor: null, trinket: null },
        inventory: [],
        profession1: null,
        profession2: null,
        profession3: null
    };
}

function getProfile(username) {
    const key = username.toLowerCase();
    const db = loadDB();

    if (!db[key]) {
        db[key] = createProfile();
        saveDB(db);
    }

    const user = db[key];

    user.level ??= 1;
    user.xp ??= 0;
    user.gold ??= 0;
    user.rank ??= "Bronze";
    user.gear ??= { weapon: null, armor: null, trinket: null };
    user.inventory ??= [];
    user.profession1 ??= null;
    user.profession2 ??= null;
    user.profession3 ??= null;

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

    db[key] = user;
    saveDB(db);

    return {
        level: user.level,
        xp: user.xp,
        gold: user.gold,
        rank: user.rank,
        gear: user.gear,
        buffs: totalBuffs,
        inventoryCount: user.inventory.length,
        profession1: user.profession1,
        profession2: user.profession2,
        profession3: user.profession3
    };
}

function setProfession(username, tier, key) {
    const db = loadDB();
    const u = db[username.toLowerCase()] || createProfile();

    if (tier === 1) u.profession1 = key;
    if (tier === 2) u.profession2 = key;
    if (tier === 3) u.profession3 = key;

    db[username.toLowerCase()] = u;
    saveDB(db);
}

function setLevelAndXP(username, level, xp) {
    const db = loadDB();
    const u = db[username.toLowerCase()] || createProfile();
    u.level = level;
    u.xp = xp;
    db[username.toLowerCase()] = u;
    saveDB(db);
}

module.exports = {
    getProfile,
    setProfession,
    setLevelAndXP
};
