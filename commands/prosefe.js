// commands/prosefe.js
const { getAIResponse } = require("../core/aiResponses");

module.exports = {
    name: "prosefe",
    description: "Speciální příkaz pro Martina",
    execute: async (client, channel, user) => {

        const ai = getAIResponse();

        client.say(
            channel,
            `🧠 @${user.username} šéfe, hlásím se do služby. ${ai}`
        );
    }
};
