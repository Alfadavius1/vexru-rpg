// commands/lov.js

console.log("LOV COMMAND LOADED");

const { getProfile } = require("../core/profile");
const { getStats, changeHP, applyDeath } = require("../core/stats");
const { getAllEffects, roll } = require("../utils/_utilProfese");
const bestiary = require("../core/bestiary");
const { scaleMobDifficulty, colorizeRarity } = require("../core/bestiary");
const fs = require("fs");

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

        const users = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));

        users[username].xp = newXP;
        users[username].gold = newGold;
        users[username].level = newLevel;

        const drops = [];

        for (const item of mob.drops) {
            if (Math.random() < item.chance) {
                drops.push(`${item.name} (${colorizeRarity(item.rarity)})`);

                users[username].inventory.push({
                    name: item.name,
                    rarity: item.rarity
                });
            }
        }

        fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 2));

        const dropMsg = drops.length > 0
            ? ` | Loot: ${drops.join(", ")}`
            : "";

        return client.say(
            channel,
            `@${user.username} narazil jsi na **${scaled.name}** (${colorizeRarity(mob.rarity)}). ` +
            `Dostal jsi ${dmgTaken} dmg → HP: ${after.currentHP}/${after.hp}. ` +
            `+${xpGain} XP, +${goldGain} gold` +
            dropMsg +
            (newLevel > profile.level ? ` 🎉 LEVEL UP → ${newLevel}!` : ``)
        );
    }
};
