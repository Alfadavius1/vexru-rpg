// =======================================
// VEXRU RPG 2.0 – index.js (Twitch API verze)
// =======================================

const tmi = require("tmi.js");
const fs = require("fs");
const path = require("path");

// AI modul
const { getAIResponse } = require("./core/aiResponses");
const { getProfile } = require("./core/profile");

// Twitch API modul
const { getCurrentGame } = require("./core/twitchApi");

// ===============================
// CONFIG
// ===============================

const BOT_USERNAME = "vexru";
const OAUTH_TOKEN = "oauth:bvlaynp9zsw5s651pf56dr6h7th0b3";
const CHANNEL_NAME = "alfadavius1";

const STREAMER_LOGIN = "alfadavius1"; // pro Twitch API

// Cache hry
let lastGame = null;
let lastGameCheck = 0;

async function getGameCached() {
    const now = Date.now();
    if (!lastGame || now - lastGameCheck > 60 * 1000) {
        lastGame = await getCurrentGame(STREAMER_LOGIN);
        lastGameCheck = now;
    }
    return lastGame;
}

// ===============================
// CLIENT
// ===============================

const client = new tmi.Client({
    options: { debug: false },
    identity: {
        username: "vexru",
    password: "oauth:bvlaynp9zsw5s651pf56dr6h7th0b3"
}
    channels: ["alfadavius1"]

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
    // AI REAKCE – OTÁZKY
    // ===============================

    if (message.endsWith("?")) {
        const ai = getAIResponse();
        return client.say(channel, `@${username} ${ai}`);
    }

    // ===============================
    // AI REAKCE – SPAM
    // ===============================

    if (/([a-zA-Z])\1\1/.test(message)) {
        return client.say(channel, `@${username} klid, nebo ti dám cooldown na život.`);
    }

    // ===============================
    // AI REAKCE – PODLE HRY (Twitch API)
    // ===============================

    const game = await getGameCached();
    if (game) {
        const g = game.toLowerCase();

        if (g.includes("tarkov")) {
            client.say(channel, `🔫 Tarkov? Šance na přežití: 12 %, tilt: 98 %.`);
        }
        if (g.includes("cs2") || g.includes("counter-strike")) {
            client.say(channel, `🎯 CS2? Aim dneska spí jak medvěd.`);
        }
        if (g.includes("fortnite")) {
            client.say(channel, `🏗️ Fortnite? To je dětská verze Tarkova.`);
        }
        if (g.includes("outlast")) {
            client.say(channel, `😱 Outlast? Doufám, že máš čistý trenky.`);
        }
    }
});

// ===============================
// AUTO !all KAŽDÝCH 20 MINUT
// ===============================

setInterval(() => {
    client.say(CHANNEL_NAME, "!all");
}, 20 * 60 * 1000);

console.log("Vexru RPG 2.0 (Twitch API verze) běží...");
