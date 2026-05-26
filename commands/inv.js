// commands/inv.js

const fs = require("fs");
const { colorizeRarity } = require("../core/bestiary");

module.exports = {
    name: "inv",
    description: "Inventář hráče",

    async execute(client, channel, user) {
        const username = user.username.toLowerCase();
        const db = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));

        if (!db[username]) {
            return client.say(channel, `@${user.username} nemáš profil.`);
        }

        const inv = db[username].inventory || [];

        if (inv.length === 0) {
            return client.say(channel, `@${user.username} inventář je prázdný.`);
        }

        const items = inv
            .map(i => `${i.name} (${colorizeRarity(i.rarity)})`)
            .join(", ");

        return client.say(channel, `@${user.username} inventář: ${items}`);
    }
};
