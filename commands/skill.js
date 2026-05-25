module.exports = {
    name: "skill",
    description: "Skill level uživatele",

    execute: async (client, channel, user) => {
        const username = user.username.toLowerCase();

        const responses = [
            "Skill: 2 % — drž se dál od her.",
            "Skill: 5 % — random button presser.",
            "Skill: 12 % — začínáme se hýbat.",
            "Skill: 20 % — slabý, ale snažíš se.",
            "Skill: 27 % — průměrný bot.",
            "Skill: 33 % — skoro hráč.",
            "Skill: 40 % — solidní základ.",
            "Skill: 48 % — už to není tragédie.",
            "Skill: 55 % — decent.",
            "Skill: 60 % — dobrý výkon.",
            "Skill: 69 % — nice.",
            "Skill: 73 % — talentovaný jedinec.",
            "Skill: 80 % — respekt.",
            "Skill: 85 % — skoro pro gamer.",
            "Skill: 90 % — high skill.",
            "Skill: 93 % — elite gameplay.",
            "Skill: 96 % — demon mode.",
            "Skill: 98 % — mechaniky v malíku.",
            "Skill: 100 % — absolutní legenda.",
            "Skill: 0 % — kámo… co to bylo?"
        ];

        client.say(channel, `@${username} ${responses[Math.floor(Math.random() * responses.length)]}`);
    }
};
