const path = require("path");
const fs = require("fs");

const { getProfile } = require(path.join(__dirname, "../core/profile.js"));
const { addXP } = require(path.join(__dirname, "../core/xp.js"));
const { getAIResponse } = require(path.join(__dirname, "../core/aiResponses.js"));
const { checkCooldown } = require(path.join(__dirname, "../core/cooldowns.js"));

module.exports = {
    name: "fight",
    description: "Souboj mezi dvěma hráči",

    execute: async (client, channel, user, args) => {
        try {
            const attackerName = user.username.toLowerCase();

            // ⭐ OPRAVA: Cooldown musí být AWAIT
            const cd = await checkCooldown(attackerName, "fight", 20);
            if (cd > 0) {
                return client.say(channel, `@${user.username} počkej ještě ${cd}s.`);
            }

            // Musí označit hráče
            if (!args[0] || !args[0].startsWith("@")) {
                return client.say(channel, `@${user.username} musíš napsat: !fight @hrac`);
            }

            const targetName = args[0].replace("@", "").toLowerCase();

            if (attackerName === targetName) {
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

            // Finální damage s RNG
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

            // Uložení goldů
            const dbPath = path.join(__dirname, "../data/users.json");
            const raw = fs.readFileSync(dbPath, "utf8").trim();
            const db = raw ? JSON.parse(raw) : {};

            db[winner].gold = (db[winner].gold || 0) + goldReward;

            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

            // XP
            addXP(winner, xpReward);

            // AI komentář
            const comment = getAIResponse(winner);

            // ⭐ Jediná odpověď
            return client.say(
                channel,
                `⚔️ Souboj: @${attackerName} vs @${targetName}\n` +
                `Vítěz: @${winner} 🎉 | XP +${xpReward}, Gold +${goldReward}\n` +
                `Komentář: ${comment}`
            );

        } catch (err) {
            console.error("Chyba v !fight:", err);
            return client.say(channel, `@${user.username} něco se pokazilo.`);
        }
    }
};
