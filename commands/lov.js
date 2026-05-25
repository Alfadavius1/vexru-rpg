// commands/lov.js
const fs = require("fs");
const path = require("path");
const { getRarity, getRarityInfo } = require("../data/rarity.js");
const { addItem } = require("../core/inventory.js");
const { checkCooldown } = require("../core/cooldowns.js");
const { addXP } = require("../core/xp.js");

module.exports = {
    name: "lov",
    description: "Jdeš lovit a získáš loot",
    execute: async (client, channel, user) => {
        try {
            const username = user.username.toLowerCase();

            // Cooldown
            const cd = checkCooldown(username, "lov", 30);
            if (cd) {
                return client.say(channel, `@${user.username} počkej ještě ${cd.toFixed(1)}s.`);
            }

            // Cesty k souborům – fungují i na Renderu
            const usersPath = path.join(__dirname, "..", "data", "users.json");
            const itemsPath = path.join(__dirname, "..", "data", "baseItems.json");

            // Načtení DB
            let db = {};
            if (fs.existsSync(usersPath)) {
                db = JSON.parse(fs.readFileSync(usersPath));
            }

            // Pokud hráč neexistuje → vytvoříme základní profil
            if (!db[username]) {
                db[username] = {
                    level: 1,
                    xp: 0,
                    gold: 0,
                    rank: "Bronze",
                    stats: { dmg: 5, luck: 1, hp: 100 },
                    gear: { weapon: null, armor: null, trinket: null },
                    inventory: []
                };
            }

            // Načtení itemů
            if (!fs.existsSync(itemsPath)) {
                return client.say(channel, `@${user.username} něco se pokazilo (chybí baseItems.json).`);
            }

            const baseItems = JSON.parse(fs.readFileSync(itemsPath));
            if (!Array.isArray(baseItems) || baseItems.length === 0) {
                return client.say(channel, `@${user.username} něco se pokazilo (žádné itemy v baseItems.json).`);
            }

            const baseItem = baseItems[Math.floor(Math.random() * baseItems.length)];

            // Rarity
            const rarity = getRarity();
            const info = getRarityInfo(rarity) || { color: "#ffffff", buffs: {} };

            const item = {
                name: baseItem.name,
                type: baseItem.type,
                rarity,
                color: info.color,
                buffs: info.buffs
            };

            // Přidání itemu do inventáře
            addItem(username, item);

            // Výpočet odměn
            const xpGain = 5 + (info.buffs.xp || 0);
            const goldGain = 3 + (info.buffs.gold || 0);

            // Uložení goldů
            db[username].gold = (db[username].gold || 0) + goldGain;

            fs.writeFileSync(usersPath, JSON.stringify(db, null, 2));

            // XP
            addXP(user.username, xpGain);

            // Výstup do chatu
            client.say(
                channel,
                `🦌 @${user.username} ulovil **${rarity}** item: ${baseItem.name} | XP +${xpGain}, Gold +${goldGain}`
            );
        } catch (err) {
            console.error("Chyba v !lov:", err);
            client.say(channel, `@${user.username} něco se pokazilo.`);
        }
    }
};
