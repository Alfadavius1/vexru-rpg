// commands/give.js

const fs = require("fs");

module.exports = {
    name: "give",
    description: "Admin příkaz – dá hráči item",

    execute: async (client, channel, user, args) => {
        const username = user.username.toLowerCase();

        // jen admin
        if (username !== "alfadavius1") {
            return client.say(channel, `@${username} tento příkaz nemůžeš použít.`);
        }

        const target = args[0]?.toLowerCase();
        const itemName = args.slice(1).join(" ");

        if (!target || !itemName) {
            return client.say(channel, `Použití: !give <uživatel> <item>`);
        }

        const users = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));

        if (!users[target]) {
            return client.say(channel, `Uživatel ${target} neexistuje.`);
        }

        // přidání itemu
        users[target].inventory.push({
            name: itemName,
            rarity: "common",
            type: "material",
            value: 1,
            stats: null
        });

        fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 2));

        client.say(channel, `@${target} dostal jsi item: ${itemName}`);
    }
};
