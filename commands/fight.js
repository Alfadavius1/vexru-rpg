// commands/fight.js
const { getProfile } = require("../core/profile");
const { getStats, changeHP, applyDeath } = require("../core/stats");

module.exports = {
    name: "fight",
    description: "Souboj 1v1 proti mobovi",

    async execute(client, channel, user) {
        const username = user.username.toLowerCase();
        const profile = getProfile(username);
        let stats = getStats(username, profile.level);

        if (stats.currentHP <= 0) {
            applyDeath(username);
            stats = getStats(username, profile.level);
            return client.say(channel, `@${user.username} jsi byl mrtvý, máš jen ${stats.currentHP}/${stats.hp} HP.`);
        }

        const mob = {
            name: "Temný válečník",
            hp: 80,
            dmg: 12,
            agility: 5
        };

        let playerHP = stats.currentHP;
        let mobHP = mob.hp;

        while (playerHP > 0 && mobHP > 0) {
            // hráč útočí
            let playerDmg = stats.strength;
            const critRoll = Math.floor(Math.random() * 100) + 1;
            if (critRoll <= stats.agility * 2) {
                playerDmg = Math.floor(playerDmg * 1.5);
            }
            mobHP -= playerDmg;

            if (mobHP <= 0) break;

            // mob útočí
            let mobDmg = mob.dmg;
            const dodgeRoll = Math.floor(Math.random() * 100) + 1;
            if (dodgeRoll <= stats.agility * 2) {
                mobDmg = Math.floor(mobDmg / 2);
            }
            playerHP -= mobDmg;
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
