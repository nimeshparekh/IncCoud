var cron = require('node-cron');
var Report = require('../model/report');
var async = require('async');

var db = require('../database/db');
var json2xls = require('json2xls');
var fs = require('fs');
var dateFormat = require('dateformat');
var moment = require('moment');
var helper = require('../helper/common');
var dateFormat = require("dateformat");
var validator = require("email-validator");


//'*/3600 * * * * *'
cron.schedule("*/60 * * * * *", async () => {

    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    console.log('running a task every 60 second auto dialer ivr==> ' + date_ob + ' ' + hours + ':' + minutes);

    var curr_date = dateFormat(now, "yyyy-mm-dd");

    var now = new Date();
    //console.log("curr date :::" + curr_date);
    if (hours > 7 && hours < 23) {

        db.query('SELECT email,cont_id FROM tf_contacts WHERE is_valid_email = 0 limit 0,2200', [], async function (err, adata) {
            if (err) {
                console.log(err);
            } else {
                if (adata.length > 0) {
                    var cnt = 0;
                    await async.forEachOf(adata, (data, callback) => {
                        
                        var status = validator.validate(data['email']);
                        console.log("status  :  " + status);
                        if(status == true){
                            var is_valid = 1;
                        }else{
                            var is_valid = 2;
                        }
                        console.log("is valid :"+is_valid);
                        //db.query('update tf_contacts set is_valid_email='+is_valid+' WHERE cont_id="'+data['cont_id']+'"');    
                        

                         db.query('update tf_contacts set is_valid_email='+is_valid+' WHERE cont_id="'+data['cont_id']+'"', function (err, results) {
                            if (err) {
                                console.log("[mysql error]", err);
                            } else {
                                cnt++;
                                console.log("count : "+ cnt); 
                            }
                        })
                        
                    });


                }
            }
        });
    }
});