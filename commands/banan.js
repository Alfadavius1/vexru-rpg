// commands/banan.js
const { getAIResponse } = require("../core/aiResponses");

module.exports = {
    name: "banan",
    description: "Změří ti banán",
    execute: async (client, channel, user) => {

        const length = Math.floor(Math.random() * 35) + 1;

        let comment = "";

        if (length <= 5) comment = "to je spíš mini verze.";
        else if (length <= 10) comment = "takovej průměr, nic extra.";
        else if (length <= 20) comment = "solidní výkon, kámo.";
        else if (length <= 30) comment = "to už je skoro legendární.";
        else comment = "tohle je boss level.";

        const ai = getAIResponse();

        client.say(
            channel,
            `🍌 @${user.username} má banán dlouhý **${length} cm** — ${comment} (${ai})`
        );
    }
};
