// CommonJS reaches the same hooks through require(); Node hands the load hook a string instead of a Buffer.
module.exports = { scale: require("../optics/constants.js").SCALE };
