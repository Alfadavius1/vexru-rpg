const { loadStats, saveStats } = require("../core/stats");
const { getUser, addXP } = require("../core/xp");
const { addGold } = require("../core/gold");
const { applyDeath } = require("../core/stats");

module.exports = {
    name: "fight",
    description: "PvP souboj mezi dvěma hráči",

    execute: async (client, channel, user, args) => {
        const attacker = user.username.toLowerCase();

        if (!args[0]) {
            return client.say(channel, `@${attacker} napiš hráče, kterého chceš vyzvat. Např.: !fight jmeno`);
        }

        const defender = args[0].replace("@", "").toLowerCase();

        if (attacker === defender) {
            return client.say(channel, `@${attacker} nemůžeš bojovat sám se sebou.`);
        }

        const stats = loadStats();

        if (!stats[attacker] || !stats[defender]) {
            return client.say(channel, `@${attacker} oba hráči musí mít statistiky.`);
        }

        const A = stats[attacker];
        const D = stats[defender];

        // PvP povoleno jen při plných HP
        if (A.currentHP < A.hp) {
            return client.say(channel, `@${attacker} nemáš plné HP. PvP je možné jen s plnými HP.`);
        }

        if (D.currentHP < D.hp) {
            return client.say(channel, `@${attacker} hráč @${defender} nemá plné HP. PvP nelze zahájit.`);
        }

        // Výpočet damage
        const dmgA = Math.max(1, A.strength - D.defense);
        const dmgD = Math.max(1, D.strength - A.defense);

        // Simulace boje
        let hpA = A.hp;
        let hpD = D.hp;

        while (hpA > 0 && hpD > 0) {
            hpD -= dmgA;
            if (hpD <= 0) break;

            hpA -= dmgD;
        }

        let winner, loser;

        if (hpA > 0) {
            winner = attacker;
            loser = defender;
        } else {
            winner = defender;
            loser = attacker;
        }

        // Odměny vítězi
        addXP(winner, 20);
        addGold(winner, 15);

        // Poražený → HP na 25 %
        stats[loser].currentHP = Math.floor(stats[loser].hp * 0.25);
        saveStats(stats);

        return client.say(
            channel,
            `🥊 PvP souboj: @${attacker} vs @${defender} → vítěz je **@${winner}**! (+20 XP, +15 goldů) | @${loser} padl a má nyní 25 % HP.`
        );
    }
};
