module.exports = {
    name: "npc",
    description: "AI NPC roleplay odpověď",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();

        const responses = [
            "Zdravím cestovateli, potřebuju 12 banánů. Hned.",
            "Nemůžu ti pomoct, dokud neporazíš 3 krysy v kanále.",
            "Ahoj! *Opakuje stejnou větu dokola.*",
            "Tvoje cesta teprve začíná… ale já tu stojím už 12 let.",
            "Prosím, neklikej na mě. Bolí to.",
            "Hrdino, svět potřebuje tvoji pomoc! Ale já ne.",
            "Mám pro tebe quest… přines mi kebab.",
            "Jsem jen NPC, ale i tak mám víc skillu než ty.",
            "Moje dialogy píše opilý scénárista.",
            "Nemůžu jít s tebou. Jsem přilepený k zemi.",
            "Tvoje karma se zvýšila o 0.",
            "Hrdino, tvůj inventář je plný. Stejně jako moje trpělivost.",
            "Dneska ne. Jsem na pauze.",
            "Mám pro tebe radu: neutíkej od problémů. Utíkej rychleji.",
            "Jsem NPC. Ty jsi hráč. Oba jsme ztraceni.",
            "Můj obchod je zavřený. A tvoje šance taky.",
            "Hrdino, tvůj osud je… no, nic moc.",
            "Můžeš mě přestat mlátit? Nic ti nedám.",
            "Jsem tu jen na ozdobu.",
            "Tvoje rozhodnutí ovlivní příběh… ale stejně skončíš špatně."
        ];

        const msg = responses[Math.floor(Math.random() * responses.length)];
        client.say(channel, `@${username} ${msg}`);
    }
};
