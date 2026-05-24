const cooldowns = require("../data/cooldowns.js");
const fs = require("fs");

module.exports = {
    name: "daily",
    description: "Denní odměna",
    execute: async (client, channel, user) => {

        const cd = checkCooldown(user.username, "daily", 86400);
        if (cd) {
            return client.say(channel, `@${user.username} už sis dnešní daily vybral.`);
        }

        const reward = 50;

        const db = JSON.parse(fs.readFileSync("./data/users.json"));
        const key = user.username.toLowerCase();

        if (!db[key]) db[key] = {};

        db[key].gold = (db[key].gold || 0) + reward;
        fs.writeFileSync("./data/users.json", JSON.stringify(db, null, 2));

        client.say(channel, `🎁 @${user.username} získal denní odměnu: ${reward} gold.`);
    }
};
