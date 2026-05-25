module.exports = {
    name: "ego",
    description: "Ego level uživatele",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();

        const responses = [
            "Ego: 1 % — skromný jak mnich.",
            "Ego: 5 % — skoro neexistuje.",
            "Ego: 12 % — low confidence.",
            "Ego: 20 % — tichý pozorovatel.",
            "Ego: 30 % — normální člověk.",
            "Ego: 40 % — zdravé sebevědomí.",
            "Ego: 50 % — vyrovnaný jedinec.",
            "Ego: 60 % — začínáš si věřit.",
            "Ego: 69 % — nice.",
            "Ego: 75 % — sebevědomý king.",
            "Ego: 80 % — dominantní energie.",
            "Ego: 85 % — boss aura.",
            "Ego: 90 % — giga chad vibes.",
            "Ego: 93 % — svět se točí kolem tebe.",
            "Ego: 96 % — absolutní dominance.",
            "Ego: 98 % — zrcadlo tě miluje.",
            "Ego: 100 % — božský komplex.",
            "Ego: 120 % — to už není zdravé.",
            "Ego: 150 % — ego větší než vesmír.",
            "Ego: 0 % — kámo, jsi v pohodě?"
        ];

        client.say(channel, `@${username} ${responses[Math.floor(Math.random() * responses.length)]}`);
    }
};
