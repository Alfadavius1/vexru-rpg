// commands/fight.js
const { getProfile } = require("../core/profile");
const { getStats, changeHP, applyDeath } = require("../core/stats");
const { getAllEffects, roll, randInt } = require("../utils/_utilProfese");

module.exports = {
    name: "fight",
    description: "Souboj 1v1 proti nepříteli",

    async execute(client, channel, user) {
        const username = user.username.toLowerCase();
        const profile = getProfile(username);
        let stats = getStats(username, profile.level);
        const eff = getAllEffects(username);

        if (stats.currentHP <= 0) {
            applyDeath(username);
            stats = getStats(username, profile.level);
            return client.say(channel, `@${user.username} jsi byl mrtvý, máš ${stats.currentHP}/${stats.hp} HP.`);
        }

        const mob = {
            name: "Temný válečník",
            hp: 80,
            dmg: 12,
            defense: 5
        };

        let playerHP = stats.currentHP;
        let mobHP = mob.hp;

        while (playerHP > 0 && mobHP > 0) {
            // hráč útočí
            let attacks = 1;
            if (roll(eff.extraAttackChance)) {
                attacks = eff.extraAttackCount || 2;
            }

            for (let i = 0; i < attacks && mobHP > 0; i++) {
                let dmg = stats.strength;

                if (!roll(eff.ignoreDefenseChance)) {
                    dmg -= mob.defense;
                }
                if (dmg < 1) dmg = 1;

                if (roll(eff.critChance)) {
                    dmg = Math.floor(dmg * (eff.critMult || 2.0));
                }

                if (roll(eff.bonusMagicChance)) {
                    dmg += randInt(eff.bonusMagicMin || 0, eff.bonusMagicMax || 0);
                }

                mobHP -= dmg;

                if (eff.lifestealPercent && dmg > 0) {
                    const heal = Math.floor(dmg * eff.lifestealPercent / 100);
                    playerHP += heal;
                    if (playerHP > stats.hp) playerHP = stats.hp;
                }

                if (mobHP <= 0) break;
            }

            if (mobHP <= 0) break;

            // mob útočí
            let mobDmg = mob.dmg;

            if (roll(eff.dodgeChance)) {
                mobDmg = 0;
            } else if (roll(eff.blockChance)) {
                mobDmg = 0;
            } else if (roll(eff.dmgReduceChance)) {
                mobDmg = Math.floor(mobDmg * (1 - eff.dmgReducePercent / 100));
            }

            if (mobDmg > 0 && roll(eff.freezeChance)) {
                mobDmg = 0;
            }

            playerHP -= mobDmg;

            if (mobDmg > 0 && roll(eff.reflectChance)) {
                const ref = Math.floor(mobDmg * (eff.reflectPercent || 30) / 100);
                mobHP -= ref;
            }

            if (roll(eff.healChance)) {
                const heal = randInt(eff.healMin || 0, eff.healMax || 0);
                playerHP += heal;
                if (playerHP > stats.hp) playerHP = stats.hp;
            }
        }

        const delta = playerHP - stats.currentHP;
        const after = changeHP(username, delta);

        if (after.currentHP <= 0) {
            applyDeath(username);
            const dead = getStats(username, profile.level);
            return client.say(
                channel,
                `@${user.username} prohrál jsi s ${mob.name} a padl v boji. Máš nyní ${dead.currentHP}/${dead.hp} HP.`
            );
        }

        client.say(
            channel,
            `@${user.username} porazil jsi ${mob.name}! Zbývá ti ${after.currentHP}/${after.hp} HP.`
        );
    }
};
