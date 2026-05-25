const { getInventory, removeItem } = require("../core/inventory");
const { equipItem } = require("../core/gear");

module.exports = {
    name: "equip",
    description: "Nasadí vybavení",

    execute: async (client, channel, user, args) => {
        const username = user.username.toLowerCase();

        if (!args[0]) {
            return client.say(channel, `@${username} napiš název itemu, který chceš nasadit.`);
        }

        const itemName = args.join(" ").toLowerCase();
        const inv = getInventory(username);

        const item = inv.find(i => i.name.toLowerCase() === itemName);

        if (!item) {
            return client.say(channel, `@${username} tento item nemáš v inventáři.`);
        }

        if (!item.stats) {
            return client.say(channel, `@${username} tento item nelze nasadit.`);
        }

        // Odebereme z inventáře
        removeItem(username, item.name, 1);

        // Nasadíme
        equipItem(username, item);

        return client.say(channel, `@${username} nasadil jsi **${item.name}**.`);
    }
};
