// commands/give.js
const { addItem } = require("../../data/inventory");
const { getRarityInfo } = require("../../data/rarity");

module.exports = {
    name: "give",
    description: "Admin: dá hráči item",
    execute: async (client, channel, user, args) => {

        // Admin check
        if (user.username.toLowerCase() !== "martin") {
            return client.say(channel, `@${user.username} nemáš oprávnění.`);
        }

        if (!args[0] || !args[1]) {
            return client.say(channel, `Použití: !give @hrac NazevItemu Rarity`);
        }

        const target = args[0].replace("@", "").toLowerCase();
        const itemName = args[1];
        const rarity = args[2] || "Common";

        const info = getRarityInfo(rarity);
        if (!info) {
            return client.say(channel, `Neplatná rarita.`);
        }

        const item = {
            name: itemName,
            rarity,
            color: info.color,
            buffs: info.buffs
        };

        addItem(target, item);

        client.say(
            channel,
            `🛠️ Admin dal hráči @${target} item: ${itemName} [${rarity}]`
        );
    }
};

