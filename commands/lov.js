// commands/lov.js

console.log("LOV COMMAND LOADED");

const { getProfile, setLevelAndXP } = require("../core/profile");
const { getStats, changeHP, applyDeath } = require("../core/stats");
const { getAllEffects, roll } = require("../utils/_utilProfese");
const bestiary = require("../core/bestiary");
const { scaleMobDifficulty } = require("../core/bestiary");
const fs = require("fs");

module.exports = {
    name: "lov",
    description: "Lov nepřátel",

    async execute(client, channel, user, args) {
        const username = user.username.toLowerCase();

        // profil + staty
        const profile = getProfile(username);
        let stats = getStats(username, profile.level);
        const eff = getAllEffects(username);

        // revive
        if (stats.currentHP <= 0) {
            applyDeath(username);
            stats = getStats(username, profile.level);
            return client.say(channel, `@${user.username} byl jsi KO, dávám ti 25 % HP → ${stats.currentHP}/${stats.hp}.`);
        }

        const difficulty = (args[0] || "easy").toLowerCase();

        // náhodný mob
        const mob = bestiary[Math.floor(Math.random() * bestiary.length)];

        // škálování podle levelu hráče
        const scaled = scaleMobDifficulty(mob, profile.level, difficulty);

        // výpočet dmg
        let dmgTaken = scaled.damage - stats.defense;
        if (dmgTaken < 1) dmgTaken = 1;

        // efekty profesí
        if (roll(eff.dodgeChance)) dmgTaken = 0;
        else if (roll(eff.blockChance)) dmgTaken = 0;
        else if (roll(eff.dmgReduceChance)) {
            dmgTaken = Math.floor(dmgTaken * (1 - eff.dmgReducePercent / 100));
        }

        // aplikace dmg
        const after = changeHP(username, -dmgTaken);

        // XP + GOLD
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

        // ULOŽENÍ XP + LEVEL
        const users = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));
        users[username].xp = newXP;
        users[username].gold = newGold;
        users[username].level = newLevel;

        // DROP SYSTÉM
        const drops = [];
        for (const item of mob.drops) {
            if (Math.random() < item.chance) {
                drops.push(item.name);

                // ULOŽENÍ DO INVENTÁŘE
                users[username].inventory.push(item.name);
            }
        }

        fs.writeFileSync("./data/users.json", JSON.stringify(users, null, 2));

        // zpráva o dropu
        const dropMsg = drops.length > 0
            ? ` | Loot: ${drops.join(", ")}`
            : "";

        return client.say(
            channel,
            `@${user.username} narazil jsi na **${scaled.name}** (lvl ${scaled.level}, ${mob.rarity}). ` +
            `Dostal jsi ${dmgTaken} dmg → HP: ${after.currentHP}/${after.hp}. ` +
            `+${xpGain} XP, +${goldGain} gold` +
            dropMsg +
            (newLevel > profile.level ? ` 🎉 LEVEL UP → ${newLevel}!` : ``)
        );
    }
};
