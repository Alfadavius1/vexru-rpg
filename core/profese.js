// core/profese.js

const PROFESSIONS = {
    valecnik: {
        name: "Válečník",
        bonuses: { strength: 3, defense: 2, agility: -1, luck: 0, hp: 10 }
    },
    lovec: {
        name: "Lovec",
        bonuses: { strength: 0, defense: -1, agility: 3, luck: 2, hp: 0 }
    },
    mag: {
        name: "Mág",
        bonuses: { strength: 2, defense: -1, agility: 0, luck: 3, hp: -10 }
    },
    tank: {
        name: "Tank",
        bonuses: { strength: -1, defense: 4, agility: -1, luck: 0, hp: 20 }
    }
};

function getProfession(name) {
    return PROFESSIONS[name] || null;
}

module.exports = { PROFESSIONS, getProfession };
