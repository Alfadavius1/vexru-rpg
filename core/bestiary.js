// core/bestiary.js

function colorizeRarity(rarity) {
    switch (rarity) {
        case "rare": return "🔵 rare";
        case "epic": return "🟣 epic";
        case "legendary": return "🟠 legendary";
        default: return "common";
    }
}

function scaleMobDifficulty(mob, playerLevel, difficulty) {
    let multiplier = 1;

    if (difficulty === "easy") multiplier = 0.8;
    if (difficulty === "medium") multiplier = 1.0;
    if (difficulty === "hard") multiplier = 1.5;

    const scale = (playerLevel / mob.level) * multiplier;

    return {
        ...mob,
        level: Math.max(1, Math.floor(playerLevel * multiplier)),
        hp: Math.max(1, Math.floor(mob.hp * scale)),
        damage: Math.max(1, Math.floor(mob.damage * scale)),
        defense: Math.max(0, Math.floor(mob.defense * scale))
    };
}

const bestiary = [
    {
        name: "Lesní vlk",
        level: 1,
        hp: 20,
        damage: 4,
        defense: 1,
        rarity: "common",
        drops: [
            { name: "Vlčí srst", chance: 0.6, rarity: "common" },
            { name: "Malý zub", chance: 0.3, rarity: "common" },
            { name: "Vlčí dráp", chance: 0.1, rarity: "rare" }
        ]
    },
    {
        name: "Divoký zajíc",
        level: 1,
        hp: 10,
        damage: 2,
        defense: 0,
        rarity: "common",
        drops: [
            { name: "Zaječí maso", chance: 0.7, rarity: "common" },
            { name: "Zaječí ucho", chance: 0.3, rarity: "common" }
        ]
    },
    {
        name: "Lesní goblin",
        level: 2,
        hp: 25,
        damage: 5,
        defense: 1,
        rarity: "common",
        drops: [
            { name: "Gobliní ucho", chance: 0.5, rarity: "common" },
            { name: "Malý měšec", chance: 0.3, rarity: "common" },
            { name: "Zrezlá kudla", chance: 0.2, rarity: "rare" }
        ]
    },
    {
        name: "Hladový pavouk",
        level: 2,
        hp: 22,
        damage: 6,
        defense: 0,
        rarity: "common",
        drops: [
            { name: "Pavoučí žláza", chance: 0.4, rarity: "common" },
            { name: "Pavoučí vlákno", chance: 0.6, rarity: "common" }
        ]
    },

    // RARE
    {
        name: "Temný lovec",
        level: 4,
        hp: 45,
        damage: 9,
        defense: 4,
        rarity: "rare",
        drops: [
            { name: "Temná čepel", chance: 0.25, rarity: "rare" },
            { name: "Lovcův kámen", chance: 0.5, rarity: "rare" },
            { name: "Stínový plášť", chance: 0.25, rarity: "epic" }
        ]
    },

    // EPIC
    {
        name: "Ohnivý elementál",
        level: 6,
        hp: 70,
        damage: 12,
        defense: 5,
        rarity: "epic",
        drops: [
            { name: "Ohnivé jádro", chance: 0.4, rarity: "epic" },
            { name: "Popel žáru", chance: 0.4, rarity: "rare" },
            { name: "Plamená sekera", chance: 0.2, rarity: "legendary" }
        ]
    },

    // LEGENDARY
    {
        name: "Král lesa — Gromar",
        level: 10,
        hp: 150,
        damage: 20,
        defense: 10,
        rarity: "legendary",
        drops: [
            { name: "Gromarův roh", chance: 0.3, rarity: "epic" },
            { name: "Královský amulet", chance: 0.3, rarity: "legendary" },
            { name: "Gromarova sekera", chance: 0.2, rarity: "legendary" },
            { name: "Esence lesa", chance: 0.2, rarity: "epic" }
        ]
    }
];

module.exports = bestiary;
module.exports.scaleMobDifficulty = scaleMobDifficulty;
module.exports.colorizeRarity = colorizeRarity;
