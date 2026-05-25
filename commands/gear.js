const { loadGear } = require("../core/gear");

module.exports = {
    name: "gear",
    description: "Zobrazí aktuální vybavení hráče",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();
        const gear = loadGear();

        if (!gear[username]) {
            return client.say(channel, `@${username} nemáš nic nasazené.`);
        }

        const g = gear[username];

        let msg = `@${username} vybavení:\n`;

        for (const slot of ["weapon", "armor", "ring", "bracelet"]) {
            const item = g[slot];
            if (!item) {
                msg += `• ${slot}: nic\n`;
            } else {
                msg += `• ${slot}: ${item.name} (${item.rarity})`;
                if (item.stats) {
                    const s = item.stats;
                    const parts = [];
                    if (s.attack) parts.push(`ATK +${s.attack}`);
                    if (s.defense) parts.push(`DEF +${s.defense}`);
                    if (s.hp) parts.push(`HP +${s.hp}`);
                    msg += ` [${parts.join(", ")}]`;
                }
                msg += "\n";
            }
        }

        client.say(channel, msg);
    }
};
