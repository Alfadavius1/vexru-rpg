// commands/lov.js

console.log("LOV COMMAND LOADED");

const { getProfile, setLevelAndXP } = require("../core/profile");
const { getStats, changeHP, applyDeath } = require("../core/stats");
const { getAllEffects, roll } = require("../utils/_utilProfese");
const bestiary = require("../core/bestiary");
const { scaleMobDifficulty } = require("../core/bestiary");

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
            return client.say(channel, `@${user.username} byl jsi KO, dávám ti 25 % HP → ${stats.currentHP}/${stats.hp}.`);
        }

        const difficulty = (args[0] || "easy").toLowerCase();

        const mob = bestiary[Math.floor(Math.random() * bestiary.length)];

        const scaled = scaleMobDifficulty(mob, profile.level, difficulty);

        let dmgTaken = scaled.damage - stats.defense;
        if (dmgTaken < 1) dmgTaken = 1;

        if (roll(eff.dodgeChance)) dmgTaken = 0;
        else if (roll(eff.blockChance)) dmgTaken = 0;
        else if (roll(eff.dmgReduceChance)) {
            dmgTaken = Math.floor(dmgTaken * (1 - eff.dmgReducePercent / 100));
        }

        const after = changeHP(username, -dmgTaken);

        const xpGain = scaled.level * 2 + profile.buffs.xp;
        const goldGain = Math.floor(scaled.level * 1.5) + profile.buffs.gold;

        let newXP = profile.xp + xpGain;
        let newGold = profile.gold + goldGain;
        let newLevel = profile.level;

        const xpNeeded = profile.level * 20;

        if (newXP >= xpNeeded) {
            newXP -= xpNeeded;
            newLevel += 1;
        }

        setLevelAndXP(username, newLevel, newXP);

        return client.say(
            channel,
            `@${user.username} narazil jsi na **${scaled.name}** (lvl ${scaled.level}, ${mob.rarity}). ` +
            `Dostal jsi ${dmgTaken} dmg → HP: ${after.currentHP}/${after.hp}. ` +
            `+${xpGain} XP, +${goldGain} gold ` +
            (newLevel > profile.level ? `🎉 LEVEL UP → ${newLevel}!` : ``)
        );
    }
};
