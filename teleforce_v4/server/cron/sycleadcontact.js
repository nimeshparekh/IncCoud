var cron = require('node-cron');
var Manager = require('../model/manager');
var csv = require('csvtojson');
var async = require('async');
var db = require('../database/db');
var Contacts = require('../model/Contacts');



db.query('SELECT * FROM `tf_leads`  ORDER BY `l_id` DESC', [], async function (err, data) {
    if (err) {
        console.log(err);
    } else {
        //console.log(camdata);
        if (data.length > 0) {
            var cnt = 1
            async.forEachOf(data, (log, callback) => {
                db.query('SELECT * FROM `tf_contacts` WHERE `customer_id` = ? AND `lead_id`=?',[log.User_id,log.l_id],async function (err, results) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (results.length > 0) {
                        }else{
                            //console.log(log.l_id+'=='+log.mobile_no)
                            db.query('SELECT * FROM `tf_contacts` WHERE `customer_id` = ? AND `mobile`=? order by created_date desc',[log.User_id,log.mobile_no],async function (err, results) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    if (results.length > 0) {
                                        console.log(log.l_id+'=='+log.mobile_no+"=="+results.length+'--'+log.User_id)
                                        //console.log(results[0].cont_id)
                                        //db.query('update tf_contacts set lead_id=? WHERE cont_id=?',[log.l_id,results[0].cont_id]);
                                    }else{
                                        console.log('No Contact found=='+log.l_id+'=='+log.mobile_no+'--'+cnt+'--'+log.User_id)
                                        // var leadid = log.l_id
                                        // var m = new Date();
                                        // var cont_id = 'CON' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
                                        // var data = { cont_id: cont_id, customer_id: 1790, created_date: m, name: log.lead_name, email: log.email_id, mobile: log.mobile_no, address: log.address_title, city: log.city, state: log.state, lead_source: log.source, category: '', created_by: 1790, lead_id: leadid }
                                        // Contacts.createcontact(data, function (err, result) {
                                        //     //console.log(err)
                                        //     if (err) {
                                        //         console.log(err)
                                        //     }
                                        //     else {
                                        //         var conid = cont_id
                                        //         console.log(result)
                                        //     }
                                        // });
                                        cnt = cnt + 1
                                    }
                                }
                            })
                        }
                    }
                })
            });
        }
    }
});