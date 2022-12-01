var cron = require('node-cron');
var Manager = require('../model/manager');
var csv = require('csvtojson');
var async = require('async');



cron.schedule('*/3600 * * * * *', () => {
    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    //console.log('running a task every 40 second auto dialer ivr==> '+date_ob+' '+hours+':'+minutes);
    if (hours > 7 && hours < 20) {//
        var interval = 0
        let currentdate = new Date();
        let beforehourdate = currentdate.getFullYear() + "-" +
            ("00" + (currentdate.getMonth() + 1)).slice(-2) + "-" +
            ("00" + currentdate.getDate()).slice(-2) + " " +
            ("00" + (currentdate.getHours() - 1)).slice(-2) + ":" +
            "00:00";
        let currenthourdate = currentdate.getFullYear() + "-" +
            ("00" + (currentdate.getMonth() + 1)).slice(-2) + "-" +
            ("00" + currentdate.getDate()).slice(-2) + " " +
            ("00" + currentdate.getHours()).slice(-2) + ":" +
            "00:00";
        db.query('SELECT * FROM tf_cdr WHERE CallStartTime between "' + beforehourdate + '" AND "' + currenthourdate + '"', [], async function (err, data) {
            if (err) {
                console.log(err);
            } else {
                //console.log(camdata);
                if (data.length > 0) {
                    async.forEachOf(data, (log, callback) => {
                        if(log.cdr_status==3){
                            db.query('update tf_cdr set cdr_status="0" WHERE id=?',[log.id]);
                        }
                    }, err => {
                        if (err) console.error(err.message);
                    });
                }
            }
        });
    }
});