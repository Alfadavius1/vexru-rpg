const bestiary = require("../core/bestiary");
const { loadStats, saveStats } = require("../core/stats");
const { addXP } = require("../core/xp");
const { addGold } = require("../core/gold");
const { addItem } = require("../core/inventory");
const { playerDeath } = require("../core/death");

module.exports = {
    name: "lov",
    description: "Zaútočí na náhodného nepřítele a získá loot",

    execute: async (client, channel, user, args) => {
        const username = user.username.toLowerCase();

        const stats = loadStats();
        const s = stats[username];

        if (!s) {
            return client.say(channel, `@${username} ještě nemáš statistiky. Napiš !stats.`);
        }

        // OBTÍŽNOST: easy / medium / hard
        let difficulty = "medium";

        if (args && args[0]) {
            const d = args[0].toLowerCase();
            if (["easy", "medium", "hard"].includes(d)) {
                difficulty = d;
            }
        }

        // Vybereme náhodného moba
        const baseMob = bestiary[Math.floor(Math.random() * bestiary.length)];
        const mob = bestiary.scaleMobDifficulty(baseMob, s.level || 1, difficulty);

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
            return client.say(channel, `@${username} (${difficulty.toUpperCase()}) ${msg}`);
        }

        // Hráč vyhrál
        s.currentHP = hpPlayer;
        saveStats(stats);

        // XP + goldy základ
        let xpGain = mob.level * 5;
        let goldGain = mob.level * 3;

        if (difficulty === "easy") {
            xpGain = Math.floor(xpGain * 0.7);
            goldGain = Math.floor(goldGain * 0.7);
        }

        if (difficulty === "hard") {
            xpGain = Math.floor(xpGain * 2.0);
            goldGain = Math.floor(goldGain * 2.0);
        }

        addXP(username, xpGain);
        addGold(username, goldGain);

        // DROP S CHANCÍ
        let dropItem = null;

        if (mob.drops && mob.drops.length > 0) {
            for (const drop of mob.drops) {
                if (Math.random() < drop.chance) {
                    dropItem = drop.name;
                    break;
                }
            }
        }

        if (dropItem) {
            addItem(username, dropItem);
        }

        return client.say(
            channel,
            `@${username} porazil jsi **${mob.name}** (${difficulty.toUpperCase()})! Získáváš +${xpGain} XP, +${goldGain} goldů` +
            (dropItem ? ` a item **${dropItem}**.` : `, ale tentokrát nic nepadlo.`)
        );
    }
};
