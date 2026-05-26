// commands/allgame.js
module.exports = {
    name: "allgame",
    description: "Zobrazí všechny RPG příkazy",

    async execute(client, channel, user) {
        const username = user.username.toLowerCase();

        const msg = `
@${username} RPG příkazy:

⚔️ BOJ
• !fight — souboj 1v1 proti nepříteli
• !lov [easy/medium/hard] — lov nepřátel

🛡️ GEAR
• !equip <item> — nasadí vybavení
• !unequip <slot> — sundá vybavení
• !gear — zobrazí aktuální gear

📦 PROFIL & STATY
• !profil — kompletní profil (lvl, profese, staty, gear)

🎭 PROFESE
• !profese — info / výběr profese (T1 od lvl 10, T2 od lvl 25, T3 od lvl 50)

🛒 SHOP
• !shop — aktuální rotace obchodu
• !buy <item> — koupě itemu
• !sell <item> — prodej itemu
`;

        client.say(channel, msg);
    }
};
