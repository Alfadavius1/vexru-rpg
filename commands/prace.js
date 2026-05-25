const cooldowns = require("../core/cooldowns.js");
const { addXP } = require("../core/xp.js");
const fs = require("fs");

module.exports = {
    name: "prace",
    description: "Vyděláš si gold a XP",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();

        // Cooldown 60 sekund
        const cd = cooldowns.checkCooldown(username, "prace", 60);
        if (cd > 0) {
            return client.say(channel, `@${username} makal jsi nedávno. Zkus to za ${cd}s.`);
        }

        const rewardGold = Math.floor(Math.random() * 20) + 10; // 10–30 gold
        const rewardXP = Math.floor(Math.random() * 5) + 5;     // 5–10 XP

        // JSON databáze
        const db = JSON.parse(fs.readFileSync("./data/users.json"));
        if (!db[username]) db[username] = {};

        db[username].gold = (db[username].gold || 0) + rewardGold;

        fs.writeFileSync("./data/users.json", JSON.stringify(db, null, 2));

        // XP systém
        addXP(username, rewardXP);

        client.say(
            channel,
            `💼 @${username} pracoval a získal ${rewardGold} gold a ${rewardXP} XP.`
        );
    }
};
