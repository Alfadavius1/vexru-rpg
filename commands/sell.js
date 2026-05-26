// commands/sell.js

const fs = require("fs");
const { colorizeRarity } = require("../core/rarity");

module.exports = {
    name: "sell",
    description: "Prodej itemu",

    async execute(client, channel, user, args) {
        const username = user.username.toLowerCase();
        const itemName = args.join(" ");

        if (!itemName) {
            return client.say(channel, `@${user.username} napiš item který chceš prodat.`);
        }

        const db = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));
        const userData = db[username];

        if (!userData) {
            return client.say(channel, `@${user.username} nemáš profil.`);
        }

        const inv = userData.inventory;
        const index = inv.findIndex(i => i.name.toLowerCase() === itemName.toLowerCase());

        if (index === -1) {
            return client.say(channel, `@${user.username} tento item nemáš.`);
        }

        const item = inv[index];

        const price = item.name.length * 2;

        inv.splice(index, 1);
        userData.gold += price;

        fs.writeFileSync("./data/users.json", JSON.stringify(db, null, 2));

        return client.say(
            channel,
            `@${user.username} prodal jsi **${item.name}** (${colorizeRarity(item.rarity)}) za ${price} gold.`
        );
    }
};
