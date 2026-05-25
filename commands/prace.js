const fs = require("fs");
const path = require("path");
const { checkCooldown } = require("../core/cooldowns.js");
const { addXP } = require("../core/xp.js");

module.exports = {
    name: "prace",
    description: "Vyděláš si gold a XP",

    execute: async (client, channel, user) => {
        try {
            const username = user.username.toLowerCase();

            // ⭐ OPRAVA: Cooldown musí být AWAIT
            const cd = await checkCooldown(username, "prace", 60);
            if (cd > 0) {
                return client.say(
                    channel,
                    `@${username} makal jsi nedávno. Zkus to za ${cd}s.`
                );
            }

            // Odměny
            const rewardGold = Math.floor(Math.random() * 20) + 10; // 10–30 gold
            const rewardXP = Math.floor(Math.random() * 5) + 5;     // 5–10 XP

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
                `💼 @${username} pracoval a získal ${rewardGold} gold a ${rewardXP} XP.`
            );

        } catch (err) {
            console.error("Chyba v !prace:", err);
            return client.say(channel, `@${user.username} něco se pokazilo.`);
        }
    }
};
