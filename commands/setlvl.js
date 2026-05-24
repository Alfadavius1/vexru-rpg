// commands/setlvl.js
const fs = require("fs");

module.exports = {
    name: "setlvl",
    description: "Admin: nastaví level hráče",
    execute: async (client, channel, user, args) => {

        if (user.username.toLowerCase() !== "martin") {
            return client.say(channel, `@${user.username} nemáš oprávnění.`);
        }

        if (!args[0] || !args[1]) {
            return client.say(channel, `Použití: !setlvl @hrac level`);
        }

        const target = args[0].replace("@", "").toLowerCase();
        const level = parseInt(args[1]);

        const db = JSON.parse(fs.readFileSync("./data/users.json"));

        if (!db[target]) {
            return client.say(channel, `Hráč @${target} neexistuje.`);
        }

        db[target].level = level;
        fs.writeFileSync("./data/users.json", JSON.stringify(db, null, 2));

        client.say(channel, `📈 Admin nastavil @${target} level na ${level}.`);
    }
};
