var cron = require('node-cron');
var Manager = require('../model/manager');
var csv = require('csvtojson');
var async = require('async');
var db = require('../database/db');
var requestify = require('requestify'); 

function formatDateTime(sDate,FormatType) {
    if(!sDate) return sDate;
    var lDate = new Date(sDate)

    var month=new Array(12);
    month[0]="January";
    month[1]="February";
    month[2]="March";
    month[3]="April";
    month[4]="May";
    month[5]="June";
    month[6]="July";
    month[7]="August";
    month[8]="September";
    month[9]="October";
    month[10]="November";
    month[11]="December";

    var weekday=new Array(7);
    weekday[0]="Sunday";
    weekday[1]="Monday";
    weekday[2]="Tuesday";
    weekday[3]="Wednesday";
    weekday[4]="Thursday";
    weekday[5]="Friday";
    weekday[6]="Saturday";

    var hh = lDate.getHours() < 10 ? '0' + 
        lDate.getHours() : lDate.getHours();
    var mi = lDate.getMinutes() < 10 ? '0' + 
        lDate.getMinutes() : lDate.getMinutes();
    var ss = lDate.getSeconds() < 10 ? '0' + 
        lDate.getSeconds() : lDate.getSeconds();

    var d = lDate.getDate();
    var dd = d < 10 ? '0' + d : d;
    var yyyy = lDate.getFullYear();
    var mon = eval(lDate.getMonth()+1);
    var mm = (mon<10?'0'+mon:mon);
    var monthName=month[lDate.getMonth()];
    var weekdayName=weekday[lDate.getDay()];

    if(FormatType==1) {
       return mm+'/'+dd+'/'+yyyy+' '+hh+':'+mi;
    } else if(FormatType==2) {
       return weekdayName+', '+monthName+' '+ 
            dd +', ' + yyyy;
    } else if(FormatType==3) {
       return mm+'/'+dd+'/'+yyyy; 
    } else if(FormatType==4) {
       var dd1 = lDate.getDate();    
       return dd1+'-'+Left(monthName,3)+'-'+yyyy;    
    } else if(FormatType==5) {
        return mm+'/'+dd+'/'+yyyy+' '+hh+':'+mi+':'+ss;
    } else if(FormatType == 6) {
        return mon + '/' + d + '/' + yyyy + ' ' + 
            hh + ':' + mi + ':' + ss;
    } else if(FormatType == 7) {
        return  yyyy + '-' + mm + 
            '-' + dd + ' ' + hh + ':' + mi + ':' + ss;
    }
}
cron.schedule('*/600 * * * * *', () => {
    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    //console.log('running a task every 40 second auto dialer ivr==> '+date_ob+' '+hours+':'+minutes);
    db.query('SELECT * FROM tf_cdr WHERE feedback="schedule" AND scheduledate BETWEEN NOW() AND NOW() + INTERVAL 10 MINUTE', [], async function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            if (data.length > 0) {
                zdata = {id:data[0].AgentID,name:data[0].CallerName,number:data[0].CallerNumber,time:formatDateTime(data[0].scheduledate,7)}
                requestify.request("https://app.cloudX.in/socketapi/callschedule", {
                    method: 'POST',
                    body: zdata,
                    dataType: 'form-url-encoded',
                }).then(function(response) {
                    console.log(response)
                })
                .fail(function(response) {  
                    console.log(response)
                }); 
            }
        }
    });
});
