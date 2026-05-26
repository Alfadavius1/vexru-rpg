// commands/lov.js
const { getProfile } = require("../core/profile");
const { getStats, changeHP, applyDeath } = require("../core/stats");

module.exports = {
    name: "lov",
    description: "Jednoduchý lov nepřátel",

    async execute(client, channel, user, args) {
        const username = user.username.toLowerCase();
        const profile = getProfile(username);
        let stats = getStats(username, profile.level);

        if (stats.currentHP <= 0) {
            applyDeath(username);
            stats = getStats(username, profile.level);
            return client.say(channel, `@${user.username} byl jsi na pokraji smrti, máš jen ${stats.currentHP}/${stats.hp} HP.`);
        }

        const difficulty = (args[0] || "easy").toLowerCase();
        let dmgTaken = 0;
        let xpGain = 0;
        let goldGain = 0;

        switch (difficulty) {
            case "hard":
                dmgTaken = 25;
                xpGain = 10;
                goldGain = 6;
                break;
            case "medium":
                dmgTaken = 15;
                xpGain = 5;
                goldGain = 3;
                break;
            default:
                dmgTaken = 8;
                xpGain = 3;
                goldGain = 2;
        }

        // obratnost → šance snížit dmg
        const dodgeChance = Math.min(50, stats.agility * 2); // max 50 %
        const roll = Math.floor(Math.random() * 100) + 1;
        if (roll <= dodgeChance) {
            dmgTaken = Math.floor(dmgTaken / 2);
        }

        const after = changeHP(username, -dmgTaken);

        client.say(
            channel,
            `@${user.username} lovíš (${difficulty.toUpperCase()}) – dostal jsi ${dmgTaken} dmg, máš ${after.currentHP}/${after.hp} HP.`
        );
    }
};
