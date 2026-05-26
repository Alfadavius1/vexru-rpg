// core/gear.js

const { colorizeRarity } = require("./rarity");

const gearItems = [
    // ============================
    // COMMON (10)
    // ============================
    { name: "Dřevěný meč", slot: "weapon", rarity: "common", stats: { dmg: 2, defense: 0, hp: 0, luck: 0 } },
    { name: "Tupá dýka", slot: "weapon", rarity: "common", stats: { dmg: 1, defense: 0, hp: 0, luck: 1 } },
    { name: "Kožená zbroj", slot: "armor", rarity: "common", stats: { dmg: 0, defense: 2, hp: 5, luck: 0 } },
    { name: "Základní štít", slot: "armor", rarity: "common", stats: { dmg: 0, defense: 3, hp: 0, luck: 0 } },
    { name: "Dřevěný talisman", slot: "trinket", rarity: "common", stats: { dmg: 0, defense: 0, hp: 3, luck: 1 } },
    { name: "Zaječí packa", slot: "trinket", rarity: "common", stats: { dmg: 0, defense: 0, hp: 0, luck: 2 } },
    { name: "Kamená sekera", slot: "weapon", rarity: "common", stats: { dmg: 3, defense: 0, hp: 0, luck: 0 } },
    { name: "Zrezlá helma", slot: "armor", rarity: "common", stats: { dmg: 0, defense: 1, hp: 2, luck: 0 } },
    { name: "Provazový opasek", slot: "trinket", rarity: "common", stats: { dmg: 0, defense: 1, hp: 1, luck: 0 } },
    { name: "Starý plášť", slot: "armor", rarity: "common", stats: { dmg: 0, defense: 1, hp: 3, luck: 0 } },

    // ============================
    // RARE (10)
    // ============================
    { name: "Ostřená čepel", slot: "weapon", rarity: "rare", stats: { dmg: 5, defense: 0, hp: 0, luck: 1 } },
    { name: "Lovcova kuše", slot: "weapon", rarity: "rare", stats: { dmg: 6, defense: 0, hp: 0, luck: 1 } },
    { name: "Šupinová zbroj", slot: "armor", rarity: "rare", stats: { dmg: 0, defense: 5, hp: 10, luck: 1 } },
    { name: "Temný plášť", slot: "armor", rarity: "rare", stats: { dmg: 0, defense: 3, hp: 5, luck: 2 } },
    { name: "Lovcův amulet", slot: "trinket", rarity: "rare", stats: { dmg: 1, defense: 0, hp: 5, luck: 2 } },
    { name: "Ghůlí prsten", slot: "trinket", rarity: "rare", stats: { dmg: 0, defense: 1, hp: 3, luck: 3 } },
    { name: "Kostěná sekera", slot: "weapon", rarity: "rare", stats: { dmg: 7, defense: 0, hp: 0, luck: 0 } },
    { name: "Ledová helma", slot: "armor", rarity: "rare", stats: { dmg: 0, defense: 4, hp: 8, luck: 1 } },
    { name: "Runový opasek", slot: "trinket", rarity: "rare", stats: { dmg: 1, defense: 1, hp: 4, luck: 1 } },
    { name: "Temná maska", slot: "armor", rarity: "rare", stats: { dmg: 0, defense: 3, hp: 6, luck: 2 } },

    // ============================
    // EPIC (10)
    // ============================
    { name: "Runový meč", slot: "weapon", rarity: "epic", stats: { dmg: 10, defense: 0, hp: 0, luck: 2 } },
    { name: "Plamenná sekera", slot: "weapon", rarity: "epic", stats: { dmg: 12, defense: 0, hp: 0, luck: 1 } },
    { name: "Runová zbroj", slot: "armor", rarity: "epic", stats: { dmg: 0, defense: 10, hp: 20, luck: 2 } },
    { name: "Golemí hrudník", slot: "armor", rarity: "epic", stats: { dmg: 0, defense: 12, hp: 25, luck: 1 } },
    { name: "Ohnivé jádro", slot: "trinket", rarity: "epic", stats: { dmg: 3, defense: 0, hp: 10, luck: 2 } },
    { name: "Hadí prsten", slot: "trinket", rarity: "epic", stats: { dmg: 2, defense: 1, hp: 5, luck: 3 } },
    { name: "Mrazivá čepel", slot: "weapon", rarity: "epic", stats: { dmg: 11, defense: 0, hp: 0, luck: 3 } },
    { name: "Stínová zbroj", slot: "armor", rarity: "epic", stats: { dmg: 0, defense: 9, hp: 18, luck: 3 } },
    { name: "Runový talisman", slot: "trinket", rarity: "epic", stats: { dmg: 2, defense: 2, hp: 8, luck: 2 } },
    { name: "Sekera bouří", slot: "weapon", rarity: "epic", stats: { dmg: 13, defense: 0, hp: 0, luck: 2 } },

    // ============================
    // LEGENDARY (10)
    // ============================
    { name: "Drakobijec", slot: "weapon", rarity: "legendary", stats: { dmg: 20, defense: 0, hp: 0, luck: 4 } },
    { name: "Meč věčnosti", slot: "weapon", rarity: "legendary", stats: { dmg: 22, defense: 0, hp: 0, luck: 5 } },
    { name: "Zbroj krále lesa", slot: "armor", rarity: "legendary", stats: { dmg: 0, defense: 20, hp: 40, luck: 4 } },
    { name: "Plášť stínů", slot: "armor", rarity: "legendary", stats: { dmg: 0, defense: 18, hp: 35, luck: 5 } },
    { name: "Amulet bohů", slot: "trinket", rarity: "legendary", stats: { dmg: 5, defense: 3, hp: 20, luck: 5 } },
    { name: "Prsten nekonečna", slot: "trinket", rarity: "legendary", stats: { dmg: 4, defense: 2, hp: 15, luck: 6 } },
    { name: "Sekera titánů", slot: "weapon", rarity: "legendary", stats: { dmg: 25, defense: 0, hp: 0, luck: 4 } },
    { name: "Koruna věků", slot: "trinket", rarity: "legendary", stats: { dmg: 3, defense: 3, hp: 25, luck: 5 } },
    { name: "Brnění bohů", slot: "armor", rarity: "legendary", stats: { dmg: 0, defense: 25, hp: 50, luck: 4 } },
    { name: "Meč pekelného ohně", slot: "weapon", rarity: "legendary", stats: { dmg: 28, defense: 0, hp: 0, luck: 6 } }
];

function getGearByRarity(rarity) {
    const list = gearItems.filter(i => i.rarity === rarity);
    if (list.length === 0) return null;
    return list[Math.floor(Math.random() * list.length)];
}

module.exports = {
    gearItems,
    getGearByRarity,
    colorizeRarity
};
