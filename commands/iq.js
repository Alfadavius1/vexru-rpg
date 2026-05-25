module.exports = {
    name: "iq",
    description: "Náhodné IQ + komentář",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();

        const responses = [
            "IQ: 42 — certified NPC.",
            "IQ: 69 — nice.",
            "IQ: 101 — průměrný, ale snažíš se.",
            "IQ: 130 — skoro génius.",
            "IQ: 5 — vypni a zapni mozek.",
            "IQ: 200 — nelegální úroveň.",
            "IQ: 88 — stabilní chaos.",
            "IQ: 150 — Elon Musk vibes.",
            "IQ: 12 — dneska ne.",
            "IQ: 170 — mozek na steroidech.",
            "IQ: 0 — kritická chyba.",
            "IQ: 111 — hezky symetrické.",
            "IQ: 90 — přežiješ.",
            "IQ: 140 — turbo mode.",
            "IQ: 33 — banán má víc.",
            "IQ: 160 — big brain.",
            "IQ: 77 — low battery.",
            "IQ: 200+ — neuvěřitelné.",
            "IQ: 15 — restart recommended.",
            "IQ: 120 — solidní výkon."
        ];

        const msg = responses[Math.floor(Math.random() * responses.length)];
        client.say(channel, `@${username} ${msg}`);
    }
};
