// commands/equip.js

const fs = require("fs");
const { getGearByRarity, colorizeRarity } = require("../core/gear");

module.exports = {
    name: "equip",
    description: "Nasadí gear",

    execute: async (client, channel, user, args) => {
        const username = user.username.toLowerCase();
        const itemName = args.join(" ");

        if (!itemName) {
            return client.say(channel, `@${user.username} napiš item který chceš equipnout.`);
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

        // není gear → nejde equipnout
        if (item.type !== "gear") {
            return client.say(channel, `@${user.username} tento item není gear.`);
        }

        // nasadit gear
        userData.gear[item.slot] = {
            name: item.name,
            rarity: item.rarity,
            stats: item.stats
        };

        // odstranit z inventáře
        inv.splice(index, 1);

        fs.writeFileSync("./data/users.json", JSON.stringify(db, null, 2));

        return client.say(
            channel,
            `@${user.username} nasadil jsi **${item.name}** (${colorizeRarity(item.rarity)}) do slotu **${item.slot}**.`
        );
    }
};
