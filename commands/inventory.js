const { getInventory } = require("../core/inventory");

module.exports = {
    name: "inventory",
    description: "Zobrazí inventář hráče",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();
        const inv = getInventory(username);

        if (inv.length === 0) {
            return client.say(channel, `@${username} inventář je prázdný.`);
        }

        // Rarity pořadí
        const rarityOrder = {
            legendary: 1,
            epic: 2,
            rare: 3,
            common: 4,
            junk: 5
        };

        // Seřadíme itemy podle rarity
        const sorted = inv.sort((a, b) => {
            return rarityOrder[a.rarity] - rarityOrder[b.rarity];
        });

        let msg = `@${username} inventář:\n`;

        for (const item of sorted) {
            let line = `• ${item.name} (${item.rarity}, ${item.type}) ×${item.amount}`;

            // Pokud má item staty → zobrazíme je
            if (item.stats) {
                const s = item.stats;
                const statParts = [];

                if (s.attack) statParts.push(`ATK +${s.attack}`);
                if (s.defense) statParts.push(`DEF +${s.defense}`);
                if (s.hp) statParts.push(`HP +${s.hp}`);

                if (statParts.length > 0) {
                    line += ` [${statParts.join(", ")}]`;
                }
            }

            msg += line + "\n";
        }

        client.say(channel, msg);
    }
};
