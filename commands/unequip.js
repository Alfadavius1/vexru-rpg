// commands/unequip.js
const { unequipItem } = require("../data/equip");

module.exports = {
    name: "unequip",
    description: "Sundá item ze slotu",
    execute: async (client, channel, user, args) => {

        if (!args[0]) {
            return client.say(channel, `@${user.username} použití: !unequip weapon/armor/trinket`);
        }

        const slot = args[0].toLowerCase();
        const result = unequipItem(user.username.toLowerCase(), slot);

        if (result.error) {
            return client.say(channel, `@${user.username} ${result.error}`);
        }

        if (result.previous) {
            client.say(
                channel,
                `@${user.username} sundal **${result.previous.name}** ze slotu ${slot}.`
            );
        } else {
            client.say(
                channel,
                `@${user.username} slot ${slot} je už prázdný.`
            );
        }
    }
};
