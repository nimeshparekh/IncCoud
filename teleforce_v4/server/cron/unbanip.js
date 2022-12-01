var cron = require('node-cron');
var db = require('../database/db');
var fs    = require("fs");
var moment = require('moment');
const delay = require('delay');
const awry = require('awry');
var Automodel = require('./autodialerModel');
var urllib = require('urllib');
var requestify = require('requestify'); 
var async = require("async");
require("dotenv").config();
console.log(process.env.FAIL2RESTURL)
cron.schedule('*/60 * * * * *', () => {
	let date_ob = new Date();
	let hours = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	console.log('running a task every 5 minute for unban ip==> '+date_ob+' '+hours+':'+minutes);
    if(hours>7 && hours<22){//
        var url = process.env.FAIL2RESTURL+"/global/bans"
        requestify.request(url, {
            method: 'GET',
            //dataType: 'form-url-encoded',
        }).then(function(response) {
            var results = JSON.parse(response.body)
            //console.log(results)
            var banips = results.map(rs => {
                return rs.IP
            })
            //console.log(banips)
            db.query('SELECT login_ip,account_name FROM `tf_account_table` WHERE login_ip is NOT null and account_type=1',[],async function (err, data) {
                if (err) {
                    console.log(err);
                }else{
                console.log(data);
                if(data.length>0){
                    async.forEachOf(data, (ipdata, callback) => {
                        ip = ipdata.login_ip
                        if(banips.includes(ip)){
                            console.log(ip+"==>already in ban list")
                            var url = process.env.FAIL2RESTURL+"/jail/asterisk-iptables/bannedip"
                            zdata = {IP : ip}
                            requestify.request(url, {
                                method: 'DELETE',
                                body: zdata,
                                //dataType: 'form-url-encoded',
                            }).then(function(response) {
                                var results = JSON.parse(response.body)
                                console.log(results)                        
                            })
                            .fail(function(response) {
                                console.log(response)
                            });
                        }else{
                            console.log(ip+"==>not in ban list")
                        }
                    })
                }
                }
            })
        })
        .fail(function(response) {
            console.log(response)
        }); 
    }
})