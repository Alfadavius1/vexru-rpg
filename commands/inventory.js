const { getInventory } = require("../core/inventory");

module.exports = {
    name: "inventory",
    description: "Zobrazí inventář hráče",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();
        const inv = getInventory(username);

        if (!inv.length) {
            return client.say(channel, `@${username} tvůj inventář je prázdný.`);
        }

        const rarityEmoji = {
            legendary: "🟣",
            epic: "🔵",
            rare: "🟢",
            uncommon: "🟡",
            common: "⚪"
        };

        const text = inv
            .map(i => `${rarityEmoji[i.rarity] || "⚪"} ${i.name}`)
            .join(" | ");

        return client.say(channel, `@${username} inventář: ${text}`);
    }
};
