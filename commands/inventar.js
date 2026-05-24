const { getInventory } = require("../core/inventory");

module.exports = {
    name: "inventar",
    description: "Zobrazí inventář hráče",
    execute: async (client, channel, user) => {
        const inv = getInventory(user.username);

        if (!inv || inv.length === 0) {
            return client.say(channel, `@${user.username} tvůj inventář je prázdný.`);
        }

        let msg = `🎒 Inventář @${user.username}:\n`;

        inv.forEach(item => {
            msg += `[${item.rarity}] ${item.name} x${item.amount} | `
            msg += `Buffy: XP +${item.buffs.xp} %, DMG +${item.buffs.dmg} %, LUCK +${item.buffs.luck} %, GOLD +${item.buffs.gold} %\n`;
        });

        client.say(channel, msg);
    }
};
