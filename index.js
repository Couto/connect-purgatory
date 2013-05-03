module.exports = (process.env.BLESSED_COVERAGE) ?
    require('coverage/blessed.js') :
    require('lib/blessed.js');
