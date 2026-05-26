const fs = require("fs");

module.exports = {
    name: "inv",
    description: "Inventář hráče",

    async execute(client, channel, user) {
        const username = user.username.toLowerCase();
        const db = JSON.parse(fs.readFileSync("./data/users.json", "utf8"));

        if (!db[username]) {
            return client.say(channel, `@${user.username} nemáš profil.`);
        }

        const inv = db[username].inventory || [];

        if (inv.length === 0) {
            return client.say(channel, `@${user.username} inventář je prázdný.`);
        }

        return client.say(channel, `@${user.username} inventář: ${inv.join(", ")}`);
    }
};
