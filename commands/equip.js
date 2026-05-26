// commands/equip.js

const fs = require("fs");
const { getGearByName, colorizeRarity } = require("../core/gear");

module.exports = {
    name: "equip",
    description: "Nasadí gear",

    async execute(client, channel, user, args) {
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
        const gear = getGearByName(item.name);

        if (!gear) {
            return client.say(channel, `@${user.username} tento item není gear.`);
        }

        // nasadit gear
        userData.gear[gear.slot] = {
            name: gear.name,
            rarity: gear.rarity,
            stats: gear.stats
        };

        // odstranit z inventáře
        inv.splice(index, 1);

        fs.writeFileSync("./data/users.json", JSON.stringify(db, null, 2));

        return client.say(
            channel,
            `@${user.username} nasadil jsi **${gear.name}** (${colorizeRarity(gear.rarity)}) do slotu **${gear.slot}**.`
        );
    }
};
