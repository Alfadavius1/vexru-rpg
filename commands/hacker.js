module.exports = {
    name: "hacker",
    description: "AI hacker roleplay odpověď",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();

        const responses = [
            "Analyzuju tvoje digitální stopy… kámo, máš heslo slabší než tvoje výmluvy.",
            "Firewall: 0/10. Doporučuju upgrade mozku.",
            "Právě jsem hacknul tvoji ledničku. Máš tam jen kečup.",
            "Tvoje IP adresa je… no, radši ti to neřeknu, aby ses nerozbrečel.",
            "Skenuju… našel jsem 12 virů a 1 uživatele bez skillu.",
            "Tvůj router se mě snažil zastavit. Neuspěl.",
            "Tvoje heslo je tak slabé, že by ho prolomil i toaster.",
            "Přístup udělen. Tvoje data jsou teď moje.",
            "Analyzuju… aha, ty nemáš žádné soukromí.",
            "Tvoje historie vyhledávání… no comment.",
            "Hack complete. Získal jsem tvoje XP. Díky.",
            "Tvůj mozek běží na 2.4 GHz, ale výkon jako 56k modem.",
            "Tvoje WiFi heslo je ‚123456‘? To je zločin.",
            "Sken dokončen. Doporučuju: vypnout a zapnout sebe.",
            "Tvoje digitální stopa je větší než tvoje ego.",
            "Získal jsem přístup k tvému účtu… nic tam není.",
            "Tvůj antivir je placebo.",
            "Analyzuju… jsi offline i když jsi online.",
            "Tvoje RAM: 2GB. Tvoje problémy: 64GB.",
            "Hack complete. Tvoje IQ bylo úspěšně odcizeno."
        ];

        const msg = responses[Math.floor(Math.random() * responses.length)];
        client.say(channel, `@${username} ${msg}`);
    }
};
