// core/aiResponses.js

// Slova, která AI nikdy nesmí použít
const forbiddenWords = ["buzerant", "negr", "žid"];

// Kategorie hlášek
const friendly = [
    "Neboj kámo, příště to bude lepší.",
    "To chce klid, RNG je dneska divoký.",
    "Hele, stává se, nic si z toho nedělej."
];

const toxic = [
    "Brácho, tvoje štěstí dneska spí jak medvěd.",
    "Tohle RNG tě fakt nemá rádo.",
    "Kámo, tohle je skill issue."
];

const sarcastic = [
    "Jo jasně, určitě to nebyla tvoje chyba… vůbec.",
    "Tohle je přesně ten moment, kdy se směju nahlas.",
    "No… tohle se ti fakt povedlo."
];

const dark = [
    "Kdyby tvoje aim byla rarita, byla by to Common.",
    "Tohle RNG tě dneska zabilo víc než boss.",
    "Tohle je tak smutný, až je to vtipný."
];

// Hlavní funkce
function getAIResponse() {
    const all = [...friendly, ...toxic, ...sarcastic, ...dark];
    let msg = all[Math.floor(Math.random() * all.length)];

    // Bezpečnostní filtr
    for (const word of forbiddenWords) {
        if (msg.toLowerCase().includes(word)) {
            return getAIResponse(); // vybere jinou hlášku
        }
    }

    return msg;
}

module.exports = { getAIResponse };
