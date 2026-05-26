// core/rarity.js

const rarityData = {
    common: {
        color: "⚪",
        label: "common",
        buffs: { xp: 0, dmg: 0, luck: 0, gold: 0 }
    },
    rare: {
        color: "🔵",
        label: "rare",
        buffs: { xp: 1, dmg: 1, luck: 1, gold: 1 }
    },
    epic: {
        color: "🟣",
        label: "epic",
        buffs: { xp: 2, dmg: 2, luck: 2, gold: 2 }
    },
    legendary: {
        color: "🟠",
        label: "legendary",
        buffs: { xp: 4, dmg: 4, luck: 4, gold: 4 }
    }
};

function colorizeRarity(rarity) {
    const r = rarityData[rarity] || rarityData.common;
    return `${r.color} ${r.label}`;
}

function getRarityInfo(rarity) {
    return rarityData[rarity] || rarityData.common;
}

module.exports = {
    rarityData,
    colorizeRarity,
    getRarityInfo
};
