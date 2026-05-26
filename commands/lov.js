// commands/lov.js
const { getProfile } = require("../core/profile");
const { getStats, changeHP, applyDeath } = require("../core/stats");
const { getAllEffects, roll, randInt } = require("./_utilProfese");

module.exports = {
    name: "lov",
    description: "Lov nepřátel",

    async execute(client, channel, user, args) {
        const username = user.username.toLowerCase();
        const profile = getProfile(username);
        let stats = getStats(username, profile.level);
        const eff = getAllEffects(username);

        if (stats.currentHP <= 0) {
            applyDeath(username);
            stats = getStats(username, profile.level);
            return client.say(channel, `@${user.username} byl jsi na pokraji smrti, máš ${stats.currentHP}/${stats.hp} HP.`);
        }

        const diff = (args[0] || "easy").toLowerCase();
        let dmgTaken = 0;
        let xpGain = 0;
        let goldGain = 0;

        if (diff === "hard") {
            dmgTaken = 25;
            xpGain = 10;
            goldGain = 6;
        } else if (diff === "medium") {
            dmgTaken = 15;
            xpGain = 5;
            goldGain = 3;
        } else {
            dmgTaken = 8;
            xpGain = 3;
            goldGain = 2;
        }

        // dodge / block / dmg reduce
        if (roll(eff.dodgeChance)) {
            dmgTaken = 0;
        } else if (roll(eff.blockChance)) {
            dmgTaken = 0;
        } else if (roll(eff.dmgReduceChance)) {
            dmgTaken = Math.floor(dmgTaken * (1 - eff.dmgReducePercent / 100));
        }

        const after = changeHP(username, -dmgTaken);

        client.say(
            channel,
            `@${user.username} lovíš (${diff.toUpperCase()}) – dostal jsi ${dmgTaken} dmg, máš ${after.currentHP}/${after.hp} HP.`
        );
    }
};
