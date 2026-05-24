const fs = require("fs");
const { getRarity, getRarityInfo } = require("../core/rarity");
const { addItem } = require("../core/inventory");
const { checkCooldown } = require("../core/cooldowns");

module.exports = {
    name: "lov",
    description: "Jdeš lovit a získáš loot",
    execute: async (client, channel, user) => {

        const cd = checkCooldown(user.username, "lov", 30);
        if (cd) {
            return client.say(channel, `@${user.username} počkej ještě ${cd.toFixed(1)}s.`);
        }

        const baseItems = JSON.parse(fs.readFileSync("./data/baseItems.json"));
        const baseItem = baseItems[Math.floor(Math.random() * baseItems.length)];

        const rarity = getRarity();
        const info = getRarityInfo(rarity);

        const item = {
            name: baseItem.name,
            type: baseItem.type,
            rarity,
            color: info.color,
            buffs: info.buffs
        };

        addItem(user.username, item);

        const xpGain = 5 + info.buffs.xp;
        const goldGain = 3 + info.buffs.gold;

        client.say(
            channel,
            `🦌 @${user.username} ulovil **${rarity}** item: ${baseItem.name} | XP +${xpGain}, Gold +${goldGain}`
        );
    }
};
