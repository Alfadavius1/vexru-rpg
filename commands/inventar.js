// commands/inventar.js
const { getInventory } = require("../data/inventory");

module.exports = {
    name: "inventar",
    description: "Zobrazí inventář hráče",
    execute: async (client, channel, user) => {

        const inv = getInventory(user.username.toLowerCase());

        if (!inv || inv.length === 0) {
            return client.say(channel, `@${user.username} tvůj inventář je prázdný.`);
        }

        let msg = `🎒 Inventář @${user.username}:\n`;

        inv.forEach(item => {
            const buffs = item.buffs || { xp: 0, dmg: 0, luck: 0, gold: 0 };

            msg += `[${item.rarity}] ${item.name} x${item.amount || 1} | `;
            msg += `Buffy: XP +${buffs.xp}% | DMG +${buffs.dmg}% | LUCK +${buffs.luck}% | GOLD +${buffs.gold}%\n`;
        });

        client.say(channel, msg);
    }
};
