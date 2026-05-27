module.exports = {
    name: "all",
    description: "Zobrazí všechny zábavné / neherní příkazy",

    execute: async (client, channel, user) => {

        // Pokud příkaz spustí bot nebo automatický interval → user může být undefined
        const username = user?.username?.toLowerCase() || "všichni";

        const msg = `
@${username} zábavné příkazy:

🍌 MEME / SRANDA
• !banan — změří banán
• !analyza — náhodná analýza
• !ego — ego level
• !skill — skill level
• !power — power level

🤖 AI ROLEPLAY
• !hacker — AI hacker odpověď
• !npc — NPC dialog
• !villain — záporák / villain odpověď

🧠 OSOBNOST / TESTY
• !iq — náhodné IQ
• !aura — barva aury + popis

💧 DRIP / SIGMA / LUCK
• !drip — drip level
• !sigma — sigma grindset level
• !luck — dnešní štěstí

🤖 BOT REAKCE
• @vexru — bot odpoví toxic hláškou
`;

        client.say(channel, msg);
    }
};
