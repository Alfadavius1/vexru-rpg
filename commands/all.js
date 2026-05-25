module.exports = {
    name: "all",
    description: "Zobrazí všechny zábavné / neherní příkazy",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();

        const msg = `
@${username} zábavné příkazy:

🍌 MEME / SRANDA
• !banan — změří banán
• !analyza — náhodná analýza
• !nasranost — procenta nasranosti
• !ego — ego level
• !stesti — štěstí
• !skill — skill level
• !toxicity — toxicita
• !power — power level

🤖 BOT REAKCE
• @vexru — bot odpoví náhodnou toxic hláškou
`;

        client.say(channel, msg);
    }
};
