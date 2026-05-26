// core/bestiary.js

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
    // ============================
    // COMMON MOBY
    // ============================
    {
        name: "Lesní vlk",
        level: 1,
        hp: 20,
        damage: 4,
        defense: 1,
        rarity: "common",
        drops: [
            { name: "Vlčí srst", chance: 0.6 },
            { name: "Malý zub", chance: 0.3 },
            { name: "Vlčí dráp", chance: 0.1 }
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
            { name: "Zaječí maso", chance: 0.7 },
            { name: "Zaječí ucho", chance: 0.3 }
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
            { name: "Gobliní ucho", chance: 0.5 },
            { name: "Malý měšec", chance: 0.3 },
            { name: "Zrezlá kudla", chance: 0.2 }
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
            { name: "Pavoučí žláza", chance: 0.4 },
            { name: "Pavoučí vlákno", chance: 0.6 }
        ]
    },

    // ============================
    // RARE MOBY
    // ============================
    {
        name: "Temný lovec",
        level: 4,
        hp: 45,
        damage: 9,
        defense: 4,
        rarity: "rare",
        drops: [
            { name: "Temná čepel", chance: 0.25 },
            { name: "Lovcův kámen", chance: 0.5 },
            { name: "Stínový plášť", chance: 0.25 }
        ]
    },
    {
        name: "Kostěný válečník",
        level: 5,
        hp: 55,
        damage: 10,
        defense: 5,
        rarity: "rare",
        drops: [
            { name: "Kostěný meč", chance: 0.3 },
            { name: "Kostěná přilba", chance: 0.3 },
            { name: "Zlomená kost", chance: 0.4 }
        ]
    },
    {
        name: "Ledový ghúl",
        level: 5,
        hp: 50,
        damage: 11,
        defense: 3,
        rarity: "rare",
        drops: [
            { name: "Ledové srdce", chance: 0.4 },
            { name: "Ghúlí dráp", chance: 0.4 },
            { name: "Mrazivý kámen", chance: 0.2 }
        ]
    },

    // ============================
    // EPIC MOBY
    // ============================
    {
        name: "Ohnivý elementál",
        level: 6,
        hp: 70,
        damage: 12,
        defense: 5,
        rarity: "epic",
        drops: [
            { name: "Ohnivé jádro", chance: 0.4 },
            { name: "Popel žáru", chance: 0.4 },
            { name: "Plamená sekera", chance: 0.2 }
        ]
    },
    {
        name: "Kamenný golem",
        level: 7,
        hp: 90,
        damage: 14,
        defense: 8,
        rarity: "epic",
        drops: [
            { name: "Golemov kámen", chance: 0.5 },
            { name: "Runový kámen", chance: 0.3 },
            { name: "Golemov pěst", chance: 0.2 }
        ]
    },
    {
        name: "Jedovatý had",
        level: 6,
        hp: 60,
        damage: 16,
        defense: 2,
        rarity: "epic",
        drops: [
            { name: "Hadí jed", chance: 0.5 },
            { name: "Hadí kůže", chance: 0.3 },
            { name: "Jedový zub", chance: 0.2 }
        ]
    },

    // ============================
    // LEGENDARY BOSSES
    // ============================
    {
        name: "Král lesa — Gromar",
        level: 10,
        hp: 150,
        damage: 20,
        defense: 10,
        rarity: "legendary",
        drops: [
            { name: "Gromarův roh", chance: 0.3 },
            { name: "Královský amulet", chance: 0.3 },
            { name: "Gromarova sekera", chance: 0.2 },
            { name: "Esence lesa", chance: 0.2 }
        ]
    },
    {
        name: "Pán stínů — Morvath",
        level: 12,
        hp: 180,
        damage: 25,
        defense: 12,
        rarity: "legendary",
        drops: [
            { name: "Stínová čepel", chance: 0.25 },
            { name: "Plášť temnoty", chance: 0.25 },
            { name: "Morvathova duše", chance: 0.25 },
            { name: "Krystal noci", chance: 0.25 }
        ]
    },
    {
        name: "Ohnivý tyran — Ignar",
        level: 15,
        hp: 220,
        damage: 30,
        defense: 15,
        rarity: "legendary",
        drops: [
            { name: "Ignarův roh", chance: 0.25 },
            { name: "Tyranova zbroj", chance: 0.25 },
            { name: "Ohnivý krystal", chance: 0.25 },
            { name: "Plamený meč", chance: 0.25 }
        ]
    }
];

module.exports = bestiary;
module.exports.scaleMobDifficulty = scaleMobDifficulty;
