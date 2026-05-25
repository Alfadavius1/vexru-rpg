const fs = require("fs");

module.exports = {
    name: "setlvl",
    description: "Admin: nastaví level hráče",

    execute: async (client, channel, user, args) => {

        // Admin check
        if (user.username.toLowerCase() !== "martin") {
            return client.say(channel, `@${user.username} nemáš oprávnění.`);
        }

        if (!args[0] || !args[1]) {
            return client.say(channel, `Použití: !setlvl @hrac level`);
        }

        const target = args[0].replace("@", "").toLowerCase();
        const level = parseInt(args[1]);

        if (isNaN(level) || level < 1) {
            return client.say(channel, `Level musí být číslo větší než 0.`);
        }

        const db = JSON.parse(fs.readFileSync("./data/users.json"));

        if (!db[target]) {
            return client.say(channel, `Hráč @${target} neexistuje.`);
        }

        db[target].level = level;
        db[target].xp = 0; // reset XP při ručním nastavení levelu

        fs.writeFileSync("./data/users.json", JSON.stringify(db, null, 2));

        return client.say(channel, `📈 Admin nastavil @${target} level na ${level}.`);
    }
};
