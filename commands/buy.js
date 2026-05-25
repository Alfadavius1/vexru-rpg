const { buyItem } = require("../core/shop");

module.exports = {
    name: "buy",
    description: "Koupí item z obchodu",

    execute: async (client, channel, user, args) => {
        const username = user.username.toLowerCase();

        if (!args[0]) {
            return client.say(channel, `@${username} napiš název itemu, který chceš koupit.`);
        }

        const itemName = args.join(" ");
        const result = buyItem(username, itemName);

        client.say(channel, `@${username} ${result.msg}`);
    }
};
