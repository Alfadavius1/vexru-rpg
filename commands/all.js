// commands/all.js
const fs = require("fs");

module.exports = {
    name: "all",
    description: "Vypíše všechny příkazy přehledně",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();

        // Načtení všech příkazů
        const files = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));

        const commands = files.map(f => {
            const cmd = require(`./${f}`);
            return {
                name: cmd.name || f.replace(".js", ""),
                description: cmd.description || ""
            };
        });

        // Kategorie
        const rpgList = [
            "profil", "inventar", "lov", "prace", "daily", "lvl",
            "hodnost", "fight", "equip", "unequip", "gear", "xp", "top"
        ];

        const funList = [
            "banan", "prosefe", "koment"
        ];

        const adminList = [
            "give", "setlvl", "wipe"
        ];

        const rpg = commands.filter(c => rpgList.includes(c.name));
        const fun = commands.filter(c => funList.includes(c.name));
        const admin = commands.filter(c => adminList.includes(c.name));

        // Ostatní příkazy
        const other = commands.filter(c =>
            !rpgList.includes(c.name) &&
            !funList.includes(c.name) &&
            !adminList.includes(c.name) &&
            c.name !== "all"
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
        other.forEach(c => msg += `• !${c.name}\n`);

        // Twitch neumí multiline → převedeme na jeden řádek
        client.say(channel, msg.replace(/\n/g, " | "));
    }
};
