// commands/fight.js
const { getProfile } = require("../core/profile");
const { addXP } = require("../core/xp");
const { getAIResponse } = require("../core/aiResponses");
const { checkCooldown } = require("../core/cooldowns");
const fs = require("fs");

module.exports = {
    name: "fight",
    description: "Souboj mezi dvěma hráči",
    execute: async (client, channel, user, args) => {

        // Cooldown 20 sekund
        const cd = checkCooldown(user.username, "fight", 20);
        if (cd) {
            return client.say(channel, `@${user.username} počkej ještě ${cd.toFixed(1)}s.`);
        }

        // Musí označit hráče
        if (!args[0] || !args[0].startsWith("@")) {
            return client.say(channel, `@${user.username} musíš napsat: !fight @hrac`);
        }

        const targetName = args[0].replace("@", "").toLowerCase();
        const attackerName = user.username.toLowerCase();

        if (targetName === attackerName) {
            return client.say(channel, `@${user.username} nemůžeš fightit sám sebe.`);
        }

        const attacker = getProfile(attackerName);
        const defender = getProfile(targetName);

        if (!attacker) {
            return client.say(channel, `@${user.username} nemáš profil. Zkus !lov.`);
        }
        if (!defender) {
            return client.say(channel, `@${targetName} nemá profil.`);
        }

        // Výpočet síly
        const atkPower = attacker.stats.dmg + attacker.buffs.dmg;
        const defPower = defender.stats.dmg + defender.buffs.dmg;

        // Luck ovlivní RNG
        const atkLuck = attacker.stats.luck + attacker.buffs.luck;
        const defLuck = defender.stats.luck + defender.buffs.luck;

        // Kritiky
        const atkCrit = Math.random() < atkLuck / 100 ? 1.5 : 1;
        const defCrit = Math.random() < defLuck / 100 ? 1.5 : 1;

        const atkFinal = atkPower * atkCrit * (0.8 + Math.random() * 0.4);
        const defFinal = defPower * defCrit * (0.8 + Math.random() * 0.4);

        let winner, loser;

        if (atkFinal > defFinal) {
            winner = attackerName;
            loser = targetName;
        } else {
            winner = targetName;
            loser = attackerName;
        }

        // Odměny
        const xpReward = Math.floor(Math.random() * 10) + 5;
        const goldReward = Math.floor(Math.random() * 8) + 3;

        const db = JSON.parse(fs.readFileSync("./data/users.json"));

        db[winner].gold = (db[winner].gold || 0) + goldReward;
        fs.writeFileSync("./data/users.json", JSON.stringify(db, null, 2));

        addXP(winner, xpReward);

        // AI hláška (mix stylu)
        const comment = getAIResponse();

        client.say(
            channel,
            `⚔️ Souboj: @${attackerName} vs @${targetName}
Vítěz: @${winner} 🎉 | XP +${xpReward}, Gold +${goldReward}
Komentář: ${comment}`
        );
    }
};
