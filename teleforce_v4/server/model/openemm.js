var db = require('../database/emm_db');
var tfdb = require('../database/db');

var Openemm = {
    insertcustomerdata: function (data, callback) {
        var cdata = {email:data.email,firstname:data.name,mailtype:1,gender:0,creation_date:data.creation_date}
        return new Promise(function(resolve, reject){
            db.query('SELECT C.customer_id FROM `customer_1_tbl` C INNER JOIN customer_1_binding_tbl CB ON C.customer_id=CB.customer_id WHERE C.email=? AND CB.mailinglist_id=?', [data.email,data.mailinglist_id], function (err, results) {
                if(results.length>0){
                    resolve(results[0]['customer_id']);
                }else{
                    db.query('Insert INTO customer_1_tbl SET ?', [cdata], function (err, results) {
                        if (err) {
                            console.log("[mysql error]", err);
                            resolve(0);
                        } else {
                            var customerid = results.insertId
                            console.log(customerid)
                            var cmdata = {customer_id:customerid,mailinglist_id:data.mailinglist_id,user_type:'W',user_status:1,user_remark:'sent by telemail',creation_date:data.creation_date}
                            db.query('Insert INTO customer_1_binding_tbl SET ?', [cmdata], function (err, results) {
                                resolve(customerid);
                            });
                        }
                    })        
                }
            })
        })
    },
    synccampaignemailstatus: function (mid,cid,numid, callback) {
        console.log('SELECT * FROM `success_1_tbl` where mailing_id = ? and customer_id = ?', [mid,cid])
        db.query('SELECT * FROM `success_1_tbl` where mailing_id = ? and customer_id = ?', [mid,cid], function (err, results) {
            if(results.length>0){
                tfdb.query('Update tf_email_camapgin_number SET email_status=1,delivery_date=? where numid = ?', [results[0]['timestamp'],numid], function (err, results) {
                    console.log(results)
                })
            }
        })
        db.query('SELECT * FROM `bounce_tbl` where mailing_id = ? and customer_id = ?', [mid,cid], function (err, results) {
            if(results.length>0){
                tfdb.query('Update tf_email_camapgin_number SET email_status=4 where numid = ?', [results[0]['timestamp'],numid], function (err, results) {
                    console.log(results)
                })
            }
        })
    },
    synccampaignemailopening: function (mid,cid,numid, callback) {
        db.query('SELECT * FROM `access_data_tbl` where mailing_id = ? and customer_id = ? and access_type="ONEPIXEL"', [mid,cid], function (err, results) {
            if(results.length>0){
                tfdb.query('Update tf_email_camapgin_number SET opener_event="yes",open_date=?,email_status=2 where numid = ?', [results[0]['creation_date'],numid], function (err, results) {
                    console.log(results)
                })
            }
        })
        db.query('SELECT * FROM `access_data_tbl` where mailing_id = ? and customer_id = ? and access_type="REDIRECT"', [mid,cid], function (err, results) {
            if(results.length>0){
                tfdb.query('Update tf_email_camapgin_number SET opener_event="yes",open_date=?,email_status=3 where numid = ?', [results[0]['creation_date'],numid], function (err, results) {
                    console.log(results)
                })
            }
        })
    }
}   

module.exports = Openemm;