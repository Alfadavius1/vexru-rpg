module.exports = {
    name: "villain",
    description: "AI záporák roleplay odpověď",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();

        const responses = [
            "Takže ty si myslíš, že mě zastavíš? Roztomilé.",
            "Tvůj strach je cítit na kilometry.",
            "Jsi jen pěšák v mé hře.",
            "Tvá slabost mě nudí.",
            "Zlo nikdy nespí. A já taky ne.",
            "Tvůj konec je blíž, než si myslíš.",
            "Mohl bych tě zničit… ale to by byla nuda.",
            "Tvůj osud je zpečetěn.",
            "Jsi jen další překážka.",
            "Tvůj hněv mě posiluje.",
            "Moc je moje. Strach je tvůj.",
            "Jsi slabší, než jsem čekal.",
            "Tvůj odpor je marný.",
            "Připrav se na temnotu.",
            "Jsi jen stínem toho, čím jsem já.",
            "Tvůj svět brzy padne.",
            "Směju se tvé odvaze.",
            "Tvůj konec bude rychlý.",
            "Jsi jen figurka.",
            "Až skončím, nezůstane nic."
        ];

        const msg = responses[Math.floor(Math.random() * responses.length)];
        client.say(channel, `@${username} ${msg}`);
    }
};
