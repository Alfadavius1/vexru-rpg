const { unequipItem, validSlots } = require("../core/gear");

module.exports = {
    name: "unequip",
    description: "Sundá vybavení ze slotu",

    execute: async (client, channel, user, args) => {
        const username = user.username.toLowerCase();

        if (!args[0]) {
            return client.say(channel, `@${username} napiš slot: weapon, armor, ring, bracelet.`);
        }

        const slot = args[0].toLowerCase();

        if (!validSlots.includes(slot)) {
            return client.say(channel, `@${username} neplatný slot.`);
        }

        const ok = unequipItem(username, slot);

        if (!ok) {
            return client.say(channel, `@${username} v tomto slotu nic nemáš.`);
        }

        return client.say(channel, `@${username} sundal jsi vybavení ze slotu **${slot}**.`);
    }
};
