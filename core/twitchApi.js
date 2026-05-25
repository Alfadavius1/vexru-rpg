const axios = require("axios");

// DOPLŇ SEM:
const CLIENT_ID = "gra19eeuml50e0et0sdnmfw2ez9ouy";
const CLIENT_SECRET = "lt9ln8rkypuyugubxn3yw4rcvtp815";

let APP_TOKEN = null;

// Získání App Access Tokenu
async function refreshAppToken() {
    try {
        const res = await axios.post(
            `https://id.twitch.tv/oauth2/token`,
            null,
            {
                params: {
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    grant_type: "client_credentials"
                }
            }
        );

        APP_TOKEN = res.data.access_token;
        console.log("Twitch API token obnoven.");
    } catch (err) {
        console.error("Chyba při získávání API tokenu:", err.response?.data || err);
    }
}

// Získání informací o streamu
async function getStreamInfo(login) {
    if (!APP_TOKEN) await refreshAppToken();

    try {
        const response = await axios.get(
            `https://api.twitch.tv/helix/streams?user_login=${login}`,
            {
                headers: {
                    "Client-ID": CLIENT_ID,
                    "Authorization": `Bearer ${APP_TOKEN}`
                }
            }
        );

        return response.data.data[0] || null;
    } catch (error) {
        console.error("Chyba při získávání stream info:", error.response?.data || error);
        return null;
    }
}

// Získání názvu hry
async function getCurrentGame(login) {
    const stream = await getStreamInfo(login);
    if (!stream) return null;

    try {
        const response = await axios.get(
            `https://api.twitch.tv/helix/games?id=${stream.game_id}`,
            {
                headers: {
                    "Client-ID": CLIENT_ID,
                    "Authorization": `Bearer ${APP_TOKEN}`
                }
            }
        );

        return response.data.data[0]?.name || null;
    } catch (error) {
        console.error("Chyba při získávání hry:", error.response?.data || error);
        return null;
    }
}

module.exports = {
    getCurrentGame,
    getStreamInfo
};
