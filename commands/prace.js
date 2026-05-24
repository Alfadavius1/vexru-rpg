const { checkCooldown } = require("../core/cooldowns");
const { addXP } = require("../core/xp");
const fs = require("fs");

module.exports = {
    name: "prace",
    description: "Jdeš pracovat a vyděláš goldy",
    execute: async (client, channel, user) => {

        const cd = checkCooldown(user.username, "prace", 60);
        if (cd) {
            return client.say(channel, `@${user.username} musíš počkat ${cd.toFixed(1)}s.`);
        }

        const gold = Math.floor(Math.random() * 10) + 5;
        const xp = Math.floor(Math.random() * 5) + 3;

        const db = JSON.parse(fs.readFileSync("./data/users.json"));
        const key = user.username.toLowerCase();

        if (!db[key]) db[key] = {};

        db[key].gold = (db[key].gold || 0) + gold;
        fs.writeFileSync("./data/users.json", JSON.stringify(db, null, 2));

        addXP(user.username, xp);

        client.say(channel, `💼 @${user.username} pracoval a získal ${gold} gold a ${xp} XP.`);
    }
};
