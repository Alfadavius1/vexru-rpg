const fs = require("fs");
const path = require("path");

module.exports = {
    name: "all",
    description: "Vypíše všechny dostupné příkazy",

    execute: async (client, channel, user) => {
        try {
            const commandsPath = path.join(__dirname);

            // Načteme všechny .js soubory v /commands
            const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

            // Načteme příkazy bezpečně (bez dvojitého require)
            const commandNames = [];

            for (const file of files) {
                if (file === "all.js") continue; // neukazuj sám sebe

                const cmdPath = path.join(commandsPath, file);
                const cmd = require(cmdPath);

                if (cmd && cmd.name) {
                    commandNames.push("!" + cmd.name);
                }
            }

            if (commandNames.length === 0) {
                return client.say(channel, "Žádné příkazy nebyly nalezeny.");
            }

            // Jediná odpověď
            return client.say(
                channel,
                `📜 Dostupné příkazy: ${commandNames.join(" | ")}`
            );

        } catch (err) {
            console.error("Chyba v !all:", err);
            return client.say(channel, `@${user.username} něco se pokazilo při načítání příkazů.`);
        }
    }
};
