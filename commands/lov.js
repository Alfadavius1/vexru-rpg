// commands/lov.js

console.log("LOV COMMAND LOADED"); // kontrola načtení

const { getProfile } = require("../core/profile");
const { getStats, changeHP, applyDeath } = require("../core/stats");
const { getAllEffects, roll, randInt } = require("../utils/_utilProfese");

module.exports = {
    name: "lov",
    description: "Lov nepřátel",

    async execute(client, channel, user, args) {
        const username = user.username.toLowerCase();

        // načtení profilu a statů
        const profile = getProfile(username);
        let stats = getStats(username, profile.level);
        const eff = getAllEffects(username);

        // hráč mrtvý → oživit
        if (stats.currentHP <= 0) {
            applyDeath(username);
            stats = getStats(username, profile.level);
            return client.say(channel, `@${user.username} byl jsi KO, dávám ti 25 % HP → ${stats.currentHP}/${stats.hp}.`);
        }

        // obtížnost
        const diff = (args[0] || "easy").toLowerCase();
        let dmgTaken = 0;

        if (diff === "hard") dmgTaken = 25;
        else if (diff === "medium") dmgTaken = 15;
        else dmgTaken = 8;

        // efekty profesí
        if (roll(eff.dodgeChance)) {
            dmgTaken = 0;
        } else if (roll(eff.blockChance)) {
            dmgTaken = 0;
        } else if (roll(eff.dmgReduceChance)) {
            dmgTaken = Math.floor(dmgTaken * (1 - eff.dmgReducePercent / 100));
        }

        // aplikace dmg
        const after = changeHP(username, -dmgTaken);

        return client.say(
            channel,
            `@${user.username} lovíš (${diff.toUpperCase()}) → dostal jsi ${dmgTaken} dmg. HP: ${after.currentHP}/${after.hp}.`
        );
    }
};
