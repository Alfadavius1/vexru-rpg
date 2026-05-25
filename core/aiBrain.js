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
            activity: 0
        };

        const ai = db[username].ai;

        // Aktivita
        ai.activity++;

        // Friendly
        if (message.match(/(děkuji|dik|díky|❤️|😊|dobrý)/i)) {
            ai.friendliness++;
        }

        // Toxic
        if (message.match(/(kokot|debil|píča|idiot|trash)/i)) {
            ai.toxicity++;
        }

        // Respekt (dlouhé zprávy)
        if (message.length > 40) {
            ai.respect++;
        }

        saveDB(db);
    },

    getPersonality(username) {
        const db = loadDB();
        const ai = db[username]?.ai;

        if (!ai) return "neutral";

        if (ai.toxicity > ai.friendliness && ai.toxicity > ai.respect) return "toxic";
        if (ai.friendliness > ai.toxicity && ai.friendliness > ai.respect) return "friendly";
        if (ai.respect > ai.toxicity && ai.respect > ai.friendliness) return "wise";

        return "neutral";
    },

    generateReply(username, base) {
        const personality = this.getPersonality(username);

        switch (personality) {
            case "friendly":
                return base + " 😊";
            case "toxic":
                return base + " ...a příště piš líp, šašku.";
            case "wise":
                return "🧠 " + base + " — zajímavá volba, poutníku.";
            default:
                return base;
        }
    }
};
