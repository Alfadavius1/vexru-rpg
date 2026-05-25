const fs = require("fs");
const path = require("path");

module.exports = {
    name: "all",
    description: "Vypíše všechny dostupné příkazy",

    execute: async (client, channel, user) => {
        const commandsPath = path.join(__dirname);
        const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

        const commandNames = files
            .map(f => require(path.join(commandsPath, f)))
            .filter(cmd => cmd.name && cmd.name !== "all") // neukazuj sám sebe
            .map(cmd => "!" + cmd.name);

        if (commandNames.length === 0) {
            return client.say(channel, "Žádné příkazy nebyly nalezeny.");
        }

        return client.say(
            channel,
            `📜 Dostupné příkazy: ${commandNames.join(" | ")}`
        );
    }
};
