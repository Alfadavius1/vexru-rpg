// commands/lov.js
const fs = require("fs");
const { getRarity, getRarityInfo } = require("../data/rarity");
const { addItem } = require("../data/inventory");
const cooldowns = require("../core/cooldowns.js");
const { addXP } = require("../core/xp.js");

module.exports = {
    name: "lov",
    description: "Jdeš lovit a získáš loot",
    execute: async (client, channel, user) => {

        const cd = checkCooldown(user.username, "lov", 30);
        if (cd) {
            return client.say(channel, `@${user.username} počkej ještě ${cd.toFixed(1)}s.`);
        }

        // Načtení DB
        const db = JSON.parse(fs.readFileSync("./data/users.json"));
        const key = user.username.toLowerCase();

        // ⭐ Pokud hráč neexistuje → vytvoříme celý profil
        if (!db[key]) {
            db[key] = {
                level: 1,
                xp: 0,
                gold: 0,
                gear: {},
                inventory: []
            };
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
        addItem(key, item);

        // Výpočet odměn
        const xpGain = 5 + (info.buffs.xp || 0);
        const goldGain = 3 + (info.buffs.gold || 0);

        // Uložení goldů
        db[key].gold += goldGain;

        fs.writeFileSync("./data/users.json", JSON.stringify(db, null, 2));

        // XP
        addXP(user.username, xpGain);

        client.say(
            channel,
            `🦌 @${user.username} ulovil **${rarity}** item: ${baseItem.name} | XP +${xpGain}, Gold +${goldGain}`
        );
    }
};
