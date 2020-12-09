var log4js = require('log4js');

log4js.configure({
  appenders: {
      ruleConsole: {type: 'console'},

      ruleFile: {
          type: 'dateFile',

          filename: 'logs/server-',

          pattern: 'yyyy-MM-dd.log',

          maxLogSize: 10 * 1000 * 1000,

          numBackups: 3,

          alwaysIncludePattern: true

      }

  },

  categories: {
      default: {appenders: ['ruleConsole', 'ruleFile'], level: 'info'}

  }

});
var dateFileLog = log4js.getLogger();

exports.logger = dateFileLog;
 
exports.use = function(app){ 
	//app.use(log4js.connectLogger(dateFileLog, {level:'INFO', format:':method :url'}));
	app.use(log4js.connectLogger(dateFileLog, {level:'auto', format:':time :remote-addr :remote-user :method :url :from :status :referrer :response-time ms :user-agent :nextROw'})); 
}
