const { getRandomEnemy, getLoot } = require("../core/loot");
const { addXP } = require("../core/xp");
const { addItem } = require("../core/inventory");

module.exports = {
    name: "lov",
    description: "Lov nepřátel a získávání lootů",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();

        const enemy = getRandomEnemy();
        const loot = getLoot(enemy);

        // XP za kill
        const xpGain = enemy.level * 10;
        addXP(username, xpGain);

        // Uložení itemu do inventáře
        addItem(username, {
            name: loot.name,
            rarity: loot.rarity,
            enemy: enemy.name
        });

        return client.say(
            channel,
            `@${username} ulovil **${enemy.name}** (lvl ${enemy.level}) a získal **${loot.rarity}** item: ${loot.name}! (+${xpGain} XP)`
        );
    }
};
