const { getUser, getNeededXP } = require("../core/xp.js");
const fs = require("fs");

module.exports = {
    name: "profese",
    description: "Zobrazí informace o tvé profesi",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();

        // JSON databáze
        const db = JSON.parse(fs.readFileSync("./data/users.json"));
        if (!db[username]) db[username] = {};

        const gold = db[username].gold || 0;
        const profese = db[username].profese || "Žádná";

        // XP systém
        const xpData = getUser(username);
        if (!xpData) {
            return client.say(channel, `@${username} ještě nemáš žádnou profesi ani XP.`);
        }

        const needed = getNeededXP(xpData.level);

        client.say(
            channel,
            `🧰 @${username} | Profese: ${profese} | Level: ${xpData.level} | XP: ${xpData.xp}/${needed} | Gold: ${gold}`
        );
    }
};
