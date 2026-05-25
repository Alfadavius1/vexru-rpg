const bestiary = require("../core/bestiary");
const { loadStats, saveStats } = require("../core/stats");
const { addXP } = require("../core/xp");
const { addGold } = require("../core/gold");
const { addItem } = require("../core/inventory");
const { playerDeath } = require("../core/death");

module.exports = {
    name: "lov",
    description: "Zaútočí na náhodného nepřítele a získá loot",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();

        const stats = loadStats();
        const s = stats[username];

        if (!s) {
            return client.say(channel, `@${username} ještě nemáš statistiky. Napiš !stats.`);
        }

        // Vybereme náhodného moba
        const mob = bestiary[Math.floor(Math.random() * bestiary.length)];

        // PvE damage výpočet
        const dmgPlayer = Math.max(1, s.strength - (mob.defense || 0));
        const dmgMob = Math.max(1, (mob.damage || mob.level * 2) - s.defense);

        let hpPlayer = s.currentHP;
        let hpMob = mob.hp || mob.level * 10;

        // Simulace boje
        while (hpPlayer > 0 && hpMob > 0) {
            hpMob -= dmgPlayer;
            if (hpMob <= 0) break;

            hpPlayer -= dmgMob;
        }

        // Hráč prohrál
        if (hpPlayer <= 0) {
            const msg = playerDeath(username);
            return client.say(channel, `@${username} ${msg}`);
        }

        // Hráč vyhrál
        s.currentHP = hpPlayer;
        saveStats(stats);

        // XP + goldy
        const xpGain = mob.level * 5;
        const goldGain = mob.level * 3;

        addXP(username, xpGain);
        addGold(username, goldGain);

        // Loot
        const drop = mob.drops[Math.floor(Math.random() * mob.drops.length)];
        addItem(username, drop.name);

        return client.say(
            channel,
            `@${username} porazil jsi **${mob.name}**! Získáváš +${xpGain} XP, +${goldGain} goldů a item **${drop.name}**.`
        );
    }
};
