// core/profese.js

const PROFESSIONS = {
    // TIER 1 (lvl 10)
    valecnik: {
        key: "valecnik",
        tier: 1,
        parent: null,
        name: "Válečník",
        bonuses: { strength: 3, defense: 2, agility: 0, luck: 0, hp: 10 },
        effects: { critChance: 10, critMult: 2.0 }
    },
    lovec: {
        key: "lovec",
        tier: 1,
        parent: null,
        name: "Lovec",
        bonuses: { strength: 0, defense: 0, agility: 3, luck: 2, hp: 0 },
        effects: { dodgeChance: 10 }
    },
    mag: {
        key: "mag",
        tier: 1,
        parent: null,
        name: "Mág",
        bonuses: { strength: 2, defense: 0, agility: 0, luck: 3, hp: -10 },
        effects: { bonusMagicChance: 5, bonusMagicMin: 10, bonusMagicMax: 20 }
    },
    tank: {
        key: "tank",
        tier: 1,
        parent: null,
        name: "Tank",
        bonuses: { strength: -1, defense: 4, agility: 0, luck: 0, hp: 20 },
        effects: { dmgReduceChance: 10, dmgReducePercent: 50 }
    },

    // TIER 2 (lvl 25)
    berserker: {
        key: "berserker",
        tier: 2,
        parent: "valecnik",
        name: "Berserker",
        bonuses: { strength: 6, defense: 0, agility: 2, luck: 0, hp: 0 },
        effects: { critChance: 15, critMult: 2.5 }
    },
    gladiator: {
        key: "gladiator",
        tier: 2,
        parent: "valecnik",
        name: "Gladiátor",
        bonuses: { strength: 4, defense: 4, agility: 0, luck: 0, hp: 0 },
        effects: { reflectChance: 20, reflectPercent: 30 }
    },

    strelec: {
        key: "strelec",
        tier: 2,
        parent: "lovec",
        name: "Střelec",
        bonuses: { strength: 0, defense: 0, agility: 6, luck: 3, hp: 0 },
        effects: { ignoreDefenseChance: 20 }
    },
    stopar: {
        key: "stopar",
        tier: 2,
        parent: "lovec",
        name: "Stopář",
        bonuses: { strength: 0, defense: 4, agility: 4, luck: 0, hp: 0 },
        effects: { petChance: 10, petMin: 5, petMax: 10 }
    },

    elementalista: {
        key: "elementalista",
        tier: 2,
        parent: "mag",
        name: "Elementalista",
        bonuses: { strength: 3, defense: 0, agility: 0, luck: 6, hp: 0 },
        effects: { bonusMagicChance: 15, bonusMagicMin: 15, bonusMagicMax: 30 }
    },
    nekromant: {
        key: "nekromant",
        tier: 2,
        parent: "mag",
        name: "Nekromant",
        bonuses: { strength: 0, defense: 4, agility: 0, luck: 4, hp: 0 },
        effects: { lifestealPercent: 20 }
    },

    guardian: {
        key: "guardian",
        tier: 2,
        parent: "tank",
        name: "Guardian",
        bonuses: { strength: 0, defense: 6, agility: 0, luck: 0, hp: 20 },
        effects: { blockChance: 20 }
    },
    juggernaut: {
        key: "juggernaut",
        tier: 2,
        parent: "tank",
        name: "Juggernaut",
        bonuses: { strength: 0, defense: 8, agility: -2, luck: 0, hp: 0 },
        effects: { extraAttackChance: 10 }
    },

    // TIER 3 (lvl 50) – jen pár příkladů, zbytek můžeš doplnit podobně
    krvavy_berserker: {
        key: "krvavy_berserker",
        tier: 3,
        parent: "berserker",
        name: "Krvavý Berserker",
        bonuses: { strength: 10, defense: 0, agility: 5, luck: 0, hp: 0 },
        effects: { extraAttackChance: 10, extraAttackCount: 2 }
    },
    sileny_berserker: {
        key: "sileny_berserker",
        tier: 3,
        parent: "berserker",
        name: "Šílený Berserker",
        bonuses: { strength: 12, defense: -5, agility: 0, luck: 0, hp: 0 },
        effects: { critChance: 25, critMult: 3.0 }
    },

    ohnivy_arcimag: {
        key: "ohnivy_arcimag",
        tier: 3,
        parent: "elementalista",
        name: "Ohnivý Arcimág",
        bonuses: { strength: 5, defense: 0, agility: 0, luck: 12, hp: 0 },
        effects: { bonusMagicChance: 20, bonusMagicMin: 30, bonusMagicMax: 60 }
    },
    ledovy_arcimag: {
        key: "ledovy_arcimag",
        tier: 3,
        parent: "elementalista",
        name: "Ledový Arcimág",
        bonuses: { strength: 0, defense: 5, agility: 0, luck: 12, hp: 0 },
        effects: { freezeChance: 10 }
    },

    paladin: {
        key: "paladin",
        tier: 3,
        parent: "guardian",
        name: "Paladin",
        bonuses: { strength: 0, defense: 12, agility: 0, luck: 0, hp: 20 },
        effects: { healChance: 10, healMin: 20, healMax: 40 }
    },
    templar: {
        key: "templar",
        tier: 3,
        parent: "guardian",
        name: "Templář",
        bonuses: { strength: 10, defense: 10, agility: 0, luck: 0, hp: 0 },
        effects: { reflectChance: 10, reflectPercent: 50 }
    }
};

function getProfession(key) {
    return PROFESSIONS[key] || null;
}

function getProfessionName(key) {
    const p = getProfession(key);
    return p ? p.name : "žádná";
}

function getAllProfessions() {
    return PROFESSIONS;
}

module.exports = {
    PROFESSIONS,
    getProfession,
    getProfessionName,
    getAllProfessions
};
