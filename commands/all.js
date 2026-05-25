// commands/all.js
const fs = require("fs");

module.exports = {
    name: "all",
    description: "Vypíše všechny příkazy přehledně",
    execute: async (client, channel, user) => {

        const files = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));

        const commands = files.map(f => {
            const cmd = require(`./${f}`);
            return { name: cmd.name, description: cmd.description || "" };
        });

        // Kategorie
        const rpg = commands.filter(c =>
            ["profil", "inventar", "lov", "prace", "daily", "lvl", "hodnost", "fight", "equip", "unequip", "gear"]
            .includes(c.name)
        );

        const fun = commands.filter(c =>
            ["banan", "prosefe", "koment"].includes(c.name)
        );

        const admin = commands.filter(c =>
            ["give", "setlvl", "wipe"].includes(c.name)
        );

        // Výpis
        let msg = "📜 **PŘEHLED PŘÍKAZŮ**\n\n";

        msg += "🗡️ **RPG příkazy:**\n";
        rpg.forEach(c => msg += `• !${c.name}\n`);

        msg += "\n🎉 **Fun příkazy:**\n";
        fun.forEach(c => msg += `• !${c.name}\n`);

        msg += "\n🛠️ **Admin příkazy:**\n";
        admin.forEach(c => msg += `• !${c.name}\n`);

        msg += "\nℹ️ **Ostatní:**\n";
        commands
            .filter(c => ![...rpg, ...fun, ...admin].includes(c))
            .forEach(c => msg += `• !${c.name}\n`);

        client.say(channel, msg);
    }
};
