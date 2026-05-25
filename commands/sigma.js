module.exports = {
    name: "sigma",
    description: "Sigma grindset level",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();

        const responses = [
            "Sigma level: 12 % — NPC energy.",
            "Sigma level: 100 % — top G.",
            "Sigma level: 47 % — halfway lone wolf.",
            "Sigma level: 3 % — beta moment.",
            "Sigma level: 69 % — nice sigma.",
            "Sigma level: 82 % — grindset activated.",
            "Sigma level: 0 % — no grind.",
            "Sigma level: 55 % — average sigma.",
            "Sigma level: 91 % — unstoppable.",
            "Sigma level: 23 % — weak aura.",
            "Sigma level: 77 % — silent killer.",
            "Sigma level: 14 % — needs improvement.",
            "Sigma level: 64 % — decent grind.",
            "Sigma level: 88 % — giga sigma.",
            "Sigma level: 33 % — confused wolf.",
            "Sigma level: 95 % — elite mindset.",
            "Sigma level: 41 % — mid.",
            "Sigma level: 52 % — neutral sigma.",
            "Sigma level: 70 % — strong aura.",
            "Sigma level: 99 % — legend."
        ];

        const msg = responses[Math.floor(Math.random() * responses.length)];
        client.say(channel, `@${username} ${msg}`);
    }
};
