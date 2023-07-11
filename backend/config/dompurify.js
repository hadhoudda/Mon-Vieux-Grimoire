const createDOMPurify = require("dompurify"); //Package pour purifier code malvaiillant en entrée
const { JSDOM } = require("jsdom"); //Package crée  un domvirtuel utilisé par dompurify

// Créer une instance de DOMPurify
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

module.exports = DOMPurify;