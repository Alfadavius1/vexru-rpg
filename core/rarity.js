// core/rarity.js

const rarityData = {
    Common: {
        color: "#bfbfbf",
        buffs: { xp: 0, dmg: 0, luck: 0, gold: 0 }
    },
    Uncommon: {
        color: "#4caf50",
        buffs: { xp: 2, dmg: 0, luck: 0, gold: 0 }
    },
    Rare: {
        color: "#2196f3",
        buffs: { xp: 5, dmg: 2, luck: 0, gold: 0 }
    },
    Epic: {
        color: "#9c27b0",
        buffs: { xp: 10, dmg: 5, luck: 0, gold: 0 }
    },
    Legendary: {
        color: "#ff9800",
        buffs: { xp: 20, dmg: 10, luck: 5, gold: 0 }
    },
    Divine: {
        color: "#ffd700",
        buffs: { xp: 50, dmg: 25, luck: 15, gold: 10 }
    }
};

function getRarity() {
    const roll = Math.random() * 100;

    if (roll <= 0.05) return "Divine";
    if (roll <= 1.00) return "Legendary";
    if (roll <= 5.00) return "Epic";
    if (roll <= 15.00) return "Rare";
    if (roll <= 40.00) return "Uncommon";
    return "Common";
}

function getRarityInfo(rarity) {
    return rarityData[rarity];
}

module.exports = { getRarity, getRarityInfo };
