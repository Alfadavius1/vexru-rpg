const fs = require("fs");
const path = require("path");
const { checkCooldown } = require("../core/cooldowns.js");
const { addXP } = require("../core/xp.js");

module.exports = {
    name: "daily",
    description: "Denní odměna",

    execute: async (client, channel, user) => {
        try {
            const username = user.username.toLowerCase();

            // ⭐ OPRAVA: Cooldown musí být AWAIT
            const cd = await checkCooldown(username, "daily", 86400);
            if (cd > 0) {
                return client.say(
                    channel,
                    `@${username} už sis dnešní daily vybral. Zkus to za ${cd}s.`
                );
            }

            const rewardGold = 50;
            const rewardXP = 10;

            // Cesta k users.json
            const usersPath = path.join(__dirname, "..", "data", "users.json");

            // Načtení databáze
            let db = {};
            if (fs.existsSync(usersPath)) {
                const raw = fs.readFileSync(usersPath, "utf8").trim();
                db = raw ? JSON.parse(raw) : {};
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

            // Přidání goldů
            db[username].gold = (db[username].gold || 0) + rewardGold;

            // Uložení databáze
            fs.writeFileSync(usersPath, JSON.stringify(db, null, 2));

            // XP systém
            addXP(username, rewardXP);

            // ⭐ Jediná odpověď
            return client.say(
                channel,
                `🎁 @${username} získal denní odměnu: ${rewardGold} gold a ${rewardXP} XP.`
            );

        } catch (err) {
            console.error("Chyba v !daily:", err);
            return client.say(channel, `@${user.username} něco se pokazilo.`);
        }
    }
};
