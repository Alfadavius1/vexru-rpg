module.exports = {
    name: "aura",
    description: "Barva aury + popis",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();

        const responses = [
            "Aura: červená — energie a chaos.",
            "Aura: modrá — klid a síla.",
            "Aura: zelená — kreativita.",
            "Aura: fialová — mystika.",
            "Aura: černá — temný humor.",
            "Aura: zlatá — štěstí.",
            "Aura: růžová — chaos s úsměvem.",
            "Aura: oranžová — výbušná osobnost.",
            "Aura: bílá — čistá duše.",
            "Aura: šedá — unavený hrdina.",
            "Aura: neonová — jsi walking highlight.",
            "Aura: tyrkysová — vibe master.",
            "Aura: karmínová — drama.",
            "Aura: stříbrná — elegance.",
            "Aura: hnědá — grounded.",
            "Aura: černozlatá — boss energy.",
            "Aura: světle modrá — dreamer.",
            "Aura: temně fialová — villain arc.",
            "Aura: žlutá — hyperaktivní slunce.",
            "Aura: duhová — chaos mode."
        ];

        const msg = responses[Math.floor(Math.random() * responses.length)];
        client.say(channel, `@${username} ${msg}`);
    }
};
