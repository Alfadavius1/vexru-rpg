// ===============================
// VEXRU RPG 2.0 – index.js
// ===============================

const tmi = require("tmi.js");
const fs = require("fs");

// AI reakce
const aiResponses = require("../core/aiResponses.js");
const { getProfile } = require("./core/profile.js");

// ===============================
// CLIENT
// ===============================

const client = new tmi.Client({
    options: { debug: false },
    identity: {
        username: "vexru",
        password: process.env.TWITCH_OAUTH   // bezpečné
    },
    channels: ["alfadavius1"]               // opraveno
});

client.connect();

// ===============================
// COMMAND LOADER
// ===============================

const commands = new Map();

const commandFiles = fs.readdirSync("./commands").filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
    const cmd = require(`./commands/${file}`);
    commands.set(cmd.name, cmd);
    console.log(`Loaded command: ${cmd.name}`);
}

// ===============================
// MESSAGE HANDLER
// ===============================

client.on("message", async (channel, user, message, self) => {
    if (self) return;

    const username = user.username.toLowerCase();

    // ===============================
    // COMMANDS
    // ===============================

    if (message.startsWith("!")) {
        const args = message.slice(1).split(" ");
        const cmdName = args.shift().toLowerCase();

        const cmd = commands.get(cmdName);
        if (cmd) {
            try {
                await cmd.execute(client, channel, user, args);
            } catch (err) {
                console.error(err);
                client.say(channel, `@${username} něco se pokazilo.`);
            }
        }
        return;
    }

    // ===============================
    // AI REAKCE – NA JMÉNO BOTA
    // ===============================

    if (message.toLowerCase().includes("vexru")) {
        const profile = getProfile(username);
        let extra = "";

        if (profile) {
            if (profile.level <= 3) extra = "máš level jak mimino.";
            else if (profile.level >= 10) extra = "už jsi skoro boss.";
            else extra = "pracuj na sobě dál.";
        }

        const ai = getAIResponse();
        return client.say(channel, `@${username} ${ai} ${extra}`);
    }

    // ===============================
    // AI REAKCE – NA OTÁZKY
    // ===============================

    if (message.endsWith("?")) {
        const ai = getAIResponse();
        return client.say(channel, `@${username} ${ai}`);
    }

    // ===============================
    // AI REAKCE – NA SPAM
    // ===============================

    if (/([a-zA-Z])\1\1/.test(message)) {
        return client.say(channel, `@${username} klid, nebo ti dám cooldown na život.`);
    }
});

// ===============================
// AUTO !all KAŽDÝCH 20 MINUT
// ===============================

setInterval(() => {
    client.say("alfadavius1", "!all");   // opraveno
}, 20 * 60 * 1000);

console.log("Vexru RPG 2.0 běží...");

