// commands/dungeon.js

const { runDungeon } = require("../core/dungeon");
const { colorizeRarity } = require("../core/rarity");

module.exports = {
    name: "dungeon",
    description: "Spustí dungeon (3 mobové + boss)",

    execute: async (client, channel, user, args) => {
        const username = user.username.toLowerCase();

        let difficulty = "medium";
        if (args[0]) {
            const d = args[0].toLowerCase();
            if (["easy", "medium", "hard"].includes(d)) difficulty = d;
        }

        const result = runDungeon(username, difficulty);

        if (!result.ok) {
            return client.say(channel, `@${username} ${result.msg}`);
        }

        let msg = `@${username} dokončil jsi dungeon (${difficulty.toUpperCase()})!\n`;

        for (const line of result.log) {
            msg += `• ${line}\n`;
        }

        msg += `Získáváš +${result.xpGain} XP, +${result.goldGain} goldů.\n`;

        if (result.loot.length > 0) {
            msg += `Loot: ${result.loot.join(", ")}`;
        }

        client.say(channel, msg);
    }
};
