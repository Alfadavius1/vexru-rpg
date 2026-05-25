const { sellItem } = require("../core/shop");

module.exports = {
    name: "sell",
    description: "Prodá item z inventáře",

    execute: async (client, channel, user, args) => {
        const username = user.username.toLowerCase();

        if (!args[0]) {
            return client.say(channel, `@${username} napiš název itemu, který chceš prodat.`);
        }

        const itemName = args.join(" ");
        const result = sellItem(username, itemName);

        client.say(channel, `@${username} ${result.msg}`);
    }
};
