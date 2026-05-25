const cooldowns = require("../core/cooldowns.js");
const path = require("path");
const { addXP } = require(path.join(__dirname, "../core/xp.js"));
const fs = require("fs");

module.exports = {
    name: "daily",
    description: "Denní odměna",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();

        // 24 hodin cooldown
        const cd = cooldowns.checkCooldown(username, "daily", 86400);
        if (cd > 0) {
            return client.say(
                channel,
                `@${username} už sis dnešní daily vybral. Zkus to za ${cd}s.`
            );
        }

        const rewardGold = 50;
        const rewardXP = 10;

        // JSON databáze
        const db = JSON.parse(fs.readFileSync("./data/users.json"));
        if (!db[username]) db[username] = {};

        db[username].gold = (db[username].gold || 0) + rewardGold;

        fs.writeFileSync("./data/users.json", JSON.stringify(db, null, 2));

        // XP systém
        addXP(username, rewardXP);

        client.say(
            channel,
            `🎁 @${username} získal denní odměnu: ${rewardGold} gold a ${rewardXP} XP.`
        );
    }
};
