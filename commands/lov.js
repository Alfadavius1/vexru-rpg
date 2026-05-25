// commands/lov.js
const fs = require("fs");
const { getRarity, getRarityInfo } = require("../data/rarity");
const { addItem } = require("../data/inventory");
const cooldowns = require("../core/cooldowns.js");
const { addXP } = require("../data/xp");

module.exports = {
    name: "lov",
    description: "Jdeš lovit a získáš loot",
    execute: async (client, channel, user) => {

        const cd = checkCooldown(user.username, "lov", 30);
        if (cd) {
            return client.say(channel, `@${user.username} počkej ještě ${cd.toFixed(1)}s.`);
        }

        // Náhodný základní item
        const baseItems = JSON.parse(fs.readFileSync("./data/baseItems.json"));
        const baseItem = baseItems[Math.floor(Math.random() * baseItems.length)];

        // Rarity
        const rarity = getRarity();
        const info = getRarityInfo(rarity);

        const item = {
            name: baseItem.name,
            type: baseItem.type,
            rarity,
            color: info.color,
            buffs: info.buffs
        };

        // Přidání itemu do inventáře
        addItem(user.username.toLowerCase(), item);

        // Výpočet odměn
        const xpGain = 5 + (info.buffs.xp || 0);
        const goldGain = 3 + (info.buffs.gold || 0);

        // Uložení goldů
        const db = JSON.parse(fs.readFileSync("./data/users.json"));
        const key = user.username.toLowerCase();

        if (!db[key]) db[key] = {};
        db[key].gold = (db[key].gold || 0) + goldGain;

        fs.writeFileSync("./data/users.json", JSON.stringify(db, null, 2));

        // XP
        addXP(user.username, xpGain);

        client.say(
            channel,
            `🦌 @${user.username} ulovil **${rarity}** item: ${baseItem.name} | XP +${xpGain}, Gold +${goldGain}`
        );
    }
};
