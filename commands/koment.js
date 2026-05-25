// commands/koment.js
const { getAIResponse } = require("../core/aiResponses");
const { getCurrentGame } = require("../core/twitchApi");

module.exports = {
    name: "koment",
    description: "AI komentuje hru, kterou streamer hraje",
    execute: async (client, channel, user) => {

        const ai = getAIResponse();

        // ZDE DOSAĎ SVŮJ TWITCH LOGIN (malými písmeny)
        const game = await getCurrentGame("alfadavius1");

        let line = "nevím, co hraješ, ale vypadá to chaoticky.";

        if (game) {
            const g = game.toLowerCase();

            if (g.includes("escape from tarkov")) line = "Tarkov? Šance na přežití: 12 %, tilt: 98 %.";
            else if (g.includes("counter-strike") || g.includes("cs2")) line = "CS2? Aim dneska spí jak medvěd.";
            else if (g.includes("fortnite")) line = "Fortnite? To je dětská verze Tarkova.";
            else if (g.includes("outlast")) line = "Outlast? Doufám, že máš čistý trenky.";
            else line = `hraješ ${game}, tohle bude zajímavý.`;
        }

        client.say(
            channel,
            `🎮 @${user.username} komentář: ${line} (${ai})`
        );
    }
};
