module.exports = {
    name: "drip",
    description: "Drip level / outfit rating",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();

        const responses = [
            "Drip level: 12 % — basic outfit.",
            "Drip level: 99 % — certified fire.",
            "Drip level: 45 % — průměrný drip.",
            "Drip level: 73 % — dobrý styl.",
            "Drip level: 3 % — outfit z Lidlu.",
            "Drip level: 88 % — fashion demon.",
            "Drip level: 0 % — katastrofa.",
            "Drip level: 56 % — solidní.",
            "Drip level: 100 % — too much sauce.",
            "Drip level: 22 % — meh.",
            "Drip level: 69 % — nice.",
            "Drip level: 81 % — certified stylish.",
            "Drip level: 14 % — potřebuješ upgrade.",
            "Drip level: 92 % — runway ready.",
            "Drip level: 7 % — outfit z roku 2005.",
            "Drip level: 60 % — decent.",
            "Drip level: 48 % — almost.",
            "Drip level: 77 % — good taste.",
            "Drip level: 33 % — random mix.",
            "Drip level: 85 % — clean."
        ];

        const msg = responses[Math.floor(Math.random() * responses.length)];
        client.say(channel, `@${username} ${msg}`);
    }
};
