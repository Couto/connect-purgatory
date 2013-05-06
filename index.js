module.exports = (process.env.PURGATORY_COVERAGE) ?
    require('./coverage/purgatory.js') :
    require('./lib/purgatory.js');
