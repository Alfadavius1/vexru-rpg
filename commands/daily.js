// commands/daily.js
const cooldowns = require("../core/cooldowns.js");
const path = require("path");
const { addXP } = require(path.join(__dirname, "../core/xp.js"));
const fs = require("fs");

module.exports = {
    name: "daily",
    description: "Denní odměna",
    execute: async (client, channel, user) => {

        // 24 hodin cooldown
        const cd = checkCooldown(user.username, "daily", 86400);
        if (cd) {
            return client.say(channel, `@${user.username} už sis dnešní daily vybral.`);
        }

        const rewardGold = 50;
        const rewardXP = 10;

        const db = JSON.parse(fs.readFileSync("./data/users.json"));
        const key = user.username.toLowerCase();

        if (!db[key]) db[key] = {};

        db[key].gold = (db[key].gold || 0) + rewardGold;
        fs.writeFileSync("./data/users.json", JSON.stringify(db, null, 2));

        addXP(user.username, rewardXP);

        client.say(
            channel,
            `🎁 @${user.username} získal denní odměnu: ${rewardGold} gold a ${rewardXP} XP.`
        );
    }
};
