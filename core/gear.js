// core/gear.js

const { colorizeRarity } = require("./rarity");

const gearItems = [
    // COMMON
    {
        name: "Dřevěný meč",
        slot: "weapon",
        rarity: "common",
        stats: { dmg: 2, defense: 0, hp: 0, luck: 0 }
    },
    {
        name: "Kožená zbroj",
        slot: "armor",
        rarity: "common",
        stats: { dmg: 0, defense: 2, hp: 5, luck: 0 }
    },

    // RARE
    {
        name: "Ostřená čepel",
        slot: "weapon",
        rarity: "rare",
        stats: { dmg: 5, defense: 0, hp: 0, luck: 1 }
    },
    {
        name: "Šupinová zbroj",
        slot: "armor",
        rarity: "rare",
        stats: { dmg: 0, defense: 5, hp: 10, luck: 1 }
    },

    // EPIC
    {
        name: "Runový meč",
        slot: "weapon",
        rarity: "epic",
        stats: { dmg: 10, defense: 0, hp: 0, luck: 2 }
    },
    {
        name: "Runová zbroj",
        slot: "armor",
        rarity: "epic",
        stats: { dmg: 0, defense: 10, hp: 20, luck: 2 }
    },

    // LEGENDARY
    {
        name: "Drakobijec",
        slot: "weapon",
        rarity: "legendary",
        stats: { dmg: 20, defense: 0, hp: 0, luck: 4 }
    },
    {
        name: "Zbroj krále lesa",
        slot: "armor",
        rarity: "legendary",
        stats: { dmg: 0, defense: 20, hp: 40, luck: 4 }
    }
];

function getGearByName(name) {
    return gearItems.find(i => i.name.toLowerCase() === name.toLowerCase()) || null;
}

module.exports = {
    gearItems,
    getGearByName,
    colorizeRarity
};
