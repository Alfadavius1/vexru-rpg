module.exports = {
    name: "luck",
    description: "Dnešní štěstí / luck level",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();

        const responses = [
            "Luck: 2 % — dneska nic neotvírej.",
            "Luck: 99 % — jackpot vibes.",
            "Luck: 45 % — meh.",
            "Luck: 12 % — drž se dál od lootboxů.",
            "Luck: 73 % — dobrý den.",
            "Luck: 0 % — katastrofa.",
            "Luck: 88 % — štěstí přeje připraveným.",
            "Luck: 33 % — průměr.",
            "Luck: 56 % — solidní.",
            "Luck: 69 % — nice.",
            "Luck: 81 % — dobré znamení.",
            "Luck: 14 % — radši nic nezkoušej.",
            "Luck: 92 % — dneska padá epic.",
            "Luck: 7 % — smůla.",
            "Luck: 60 % — ok.",
            "Luck: 48 % — skoro.",
            "Luck: 77 % — lucky boy.",
            "Luck: 23 % — slabé.",
            "Luck: 85 % — dobrý den na gamble.",
            "Luck: 100 % — božská náhoda."
        ];

        const msg = responses[Math.floor(Math.random() * responses.length)];
        client.say(channel, `@${username} ${msg}`);
    }
};
