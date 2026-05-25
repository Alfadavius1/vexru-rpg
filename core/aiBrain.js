const fs = require("fs");
const path = require("path");

const usersPath = path.join(__dirname, "..", "data", "users.json");

function loadDB() {
    if (!fs.existsSync(usersPath)) return {};
    const raw = fs.readFileSync(usersPath, "utf8").trim();
    if (!raw) return {};
    return JSON.parse(raw);
}

function saveDB(db) {
    fs.writeFileSync(usersPath, JSON.stringify(db, null, 2));
}

module.exports = {
    updateBehavior(username, message) {
        const db = loadDB();
        db[username] ??= {};
        db[username].ai ??= {
            respect: 0,
            toxicity: 0,
            friendliness: 0,
            chaos: 0,
            activity: 0
        };

        const ai = db[username].ai;

        ai.activity++;

        if (message.match(/(děkuji|dik|díky|❤️|😊|dobrý)/i)) ai.friendliness++;
        if (message.match(/(kokot|debil|píča|idiot|trash)/i)) ai.toxicity++;
        if (message.length > 40) ai.respect++;
        if (message.match(/(wtf|lol|xd|random)/i)) ai.chaos++;

        saveDB(db);
    },

    getPersonality(username) {
        const db = loadDB();
        const ai = db[username]?.ai;

        if (!ai) return "neutral";

        const scores = {
            friendly: ai.friendliness,
            toxic: ai.toxicity,
            wise: ai.respect,
            chaotic: ai.chaos
        };

        const max = Math.max(...Object.values(scores));
        const type = Object.keys(scores).find(k => scores[k] === max);

        return type || "neutral";
    },

    generateReply(username, base) {
        const personality = this.getPersonality(username);

        const variants = {
            friendly: [
                `${base} 😊`,
                `${base} kámo, jsi frajer.`,
                `${base} ❤️`
            ],
            toxic: [
                `${base} ...no, čekal jsem víc.`,
                `${base} šašku.`,
                `${base} tohle bolelo víc než tvoje statistiky.`
            ],
            wise: [
                `🧠 ${base} — cesta je důležitější než cíl.`,
                `🧠 ${base} — zajímavá volba.`,
                `🧠 ${base} — tak praví staré svitky.`
            ],
            chaotic: [
                `${base} 😂`,
                `${base} počkej, cože?`,
                `${base} tohle je největší random dne.`
            ],
            neutral: [
                base,
                `${base}.`,
                `${base}!`
            ]
        };

        const list = variants[personality] || variants.neutral;
        return list[Math.floor(Math.random() * list.length)];
    }
};
