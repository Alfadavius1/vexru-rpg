const fs = require("fs");

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
        const index = inv.indexOf(itemName);

        if (index === -1) {
            return client.say(channel, `@${user.username} tento item nemáš.`);
        }

        // cena = délka názvu * 2
        const price = itemName.length * 2;

        inv.splice(index, 1);
        userData.gold += price;

        fs.writeFileSync("./data/users.json", JSON.stringify(db, null, 2));

        return client.say(channel, `@${user.username} prodal jsi **${itemName}** za ${price} gold.`);
    }
};
