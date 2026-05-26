// commands/_utilProfese.js
const { getProfession } = require("../core/profese");
const { getProfile } = require("../core/profile");

function getAllEffects(username) {
    const profile = getProfile(username);
    const keys = [profile.profession1, profile.profession2, profile.profession3].filter(Boolean);
    const effects = {
        critChance: 0,
        critMult: 2.0,
        dodgeChance: 0,
        blockChance: 0,
        dmgReduceChance: 0,
        dmgReducePercent: 0,
        reflectChance: 0,
        reflectPercent: 0,
        lifestealPercent: 0,
        extraAttackChance: 0,
        extraAttackCount: 1,
        ignoreDefenseChance: 0,
        bonusMagicChance: 0,
        bonusMagicMin: 0,
        bonusMagicMax: 0,
        petChance: 0,
        petMin: 0,
        petMax: 0,
        healChance: 0,
        healMin: 0,
        healMax: 0,
        freezeChance: 0
    };

    for (const key of keys) {
        const p = getProfession(key);
        if (!p) continue;
        const e = p.effects || {};
        for (const k of Object.keys(e)) {
            if (typeof e[k] === "number") {
                if (k === "critMult") {
                    effects.critMult = Math.max(effects.critMult, e[k]);
                } else if (k === "extraAttackCount") {
                    effects.extraAttackCount = Math.max(effects.extraAttackCount, e[k]);
                } else {
                    effects[k] += e[k];
                }
            }
        }
    }

    return effects;
}

function roll(chance) {
    if (!chance || chance <= 0) return false;
    const r = Math.floor(Math.random() * 100) + 1;
    return r <= chance;
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    getAllEffects,
    roll,
    randInt
};
