const fs = require("fs");
const path = require("path");
const { loadStats, saveStats, applyDeath } = require("./stats");
const { loadGold, saveGold } = require("./gold");
const { loadInv, saveInv } = require("./inventory");

// Ztráta 10 % goldů
function loseGold(username) {
    const gold = loadGold();

    if (!gold[username]) gold[username] = 0;

    const lost = Math.floor(gold[username] * 0.10);
    gold[username] -= lost;

    saveGold(gold);
    return lost;
}

// Ztráta 1 náhodného itemu (25 % šance)
function loseRandomItem(username) {
    const inv = loadInv();

    if (!inv[username] || inv[username].length === 0) {
        return null; // žádný item k odebrání
    }

    // 25% šance
    if (Math.random() >= 0.25) {
        return null;
    }

    const items = inv[username];
    const index = Math.floor(Math.random() * items.length);
    const removed = items.splice(index, 1)[0];

    saveInv(inv);
    return removed;
}

// Kompletní smrt hráče
function playerDeath(username) {
    // 1) HP → 25 %
    applyDeath(username);

    // 2) ztráta goldů
    const lostGold = loseGold(username);

    // 3) šance na ztrátu itemu
    const lostItem = loseRandomItem(username);

    // 4) vrátíme text pro hlášku
    let msg = `Byl jsi poražen! HP obnoveno na 25 %. Ztrácíš ${lostGold} goldů.`;

    if (lostItem) {
        msg += ` Ztratil jsi item: ${lostItem.name}.`;
    }

    return msg;
}

module.exports = {
    playerDeath
};
