// commands/equip.js
const { equipItem } = require("../core/equip");

module.exports = {
    name: "equip",
    description: "Equipne item z inventáře",
    execute: async (client, channel, user, args) => {

        if (!args[0]) {
            return client.say(channel, `@${user.username} použití: !equip NazevItemu`);
        }

        const itemName = args.join(" ");
        const result = equipItem(user.username, itemName);

        if (result.error) {
            return client.say(channel, `@${user.username} ${result.error}`);
        }

        if (result.previous) {
            client.say(channel, `@${user.username} equipnul **${itemName}** a sundal **${result.previous.name}**.`);
        } else {
            client.say(channel, `@${user.username} equipnul **${itemName}**.`);
        }
    }
};
