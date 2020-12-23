const schedule = require('node-schedule');
const wechat = require('./Wechat');

function scheduleCronstyle(){
    schedule.scheduleJob('30 * * * * *', function(){
        console.log('scheduleCronstyle:' + new Date());
    }); 
}
function getRuleHours(period){
    const times=[];
    for (let i = 0; i < 23; i=i+period) {
        times.push(i);
    }
    return times;
}
function getRuleMinutes(period){
    const times=[];
    for (let i = 0; i < 60; i=i+period) {
        times.push(i);
    }
    return times;
}

exports.scheduleForTokens = function ()
{
   // const rule=new schedule.RecurrenceRule();
   // const times=getRuleHours(1);
   // rule.hour=times;
    // rule.second=times;
    wechat.updateAllTokens()
    schedule.scheduleJob('30 59 * * * *',async function(){
        await  wechat.updateAllTokens();
    })
   
}