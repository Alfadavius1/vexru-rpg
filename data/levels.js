// core/levels.js

// Výpočet XP potřebných na další level
// Škálování je plynulé, vhodné pro RPG systém
function xpNeeded(level) {
    // Level 1 → 90 XP
    // Level 10 → 950 XP
    // Level 20 → 2550 XP
    // Level 50 → 13000+ XP
    return Math.floor(50 + level * 35 + (level ** 2) * 5);
}

module.exports = { xpNeeded };
