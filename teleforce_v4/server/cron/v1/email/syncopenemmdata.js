var cron = require('node-cron');
var csv = require('csvtojson');
var async = require('async');
var validator = require("email-validator");
var path = require('path');     //used for file path
const { spawn } = require('child_process');
function escapeShellArg (arg) {
    return arg.replace(/\s+/g, '\ ');
}
require("dotenv").config({ path: path.resolve(__dirname, '../../../.env') });
var request = require('request');
var Openemm = require('../../../model/openemm');
const Email = require('../../../model/email');


cron.schedule('*/30 * * * * *', () => {
    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    console.log('running a task every 1 minute sync openemm data==> ' + date_ob + ' ' + hours + ':' + minutes);
    Email.getrunningcampaign(function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            if(rows.length>0){
                async.forEachOf(rows, async (obj, key, callback) => {
                    var camid = obj.cid
                    var openemmcamid = obj.emm_mailingid
                    var userid = obj.account_id
                    Email.getcampaignundelivernumbers(camid,userid,function (err, nrows) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            if(nrows.length>0){
                                async.forEachOf(nrows, async (obj, key, callback) => {
                                    var numid = obj.numid
                                    var openemmcustomerid = obj.emm_customerid
                                    console.log(openemmcamid,openemmcustomerid,numid)
                                    Openemm.synccampaignemailstatus(openemmcamid,openemmcustomerid,numid)
                                })
                            }else{

                            }
                        }
                    })
                    Email.getcampaigndelivernumbers(camid,userid,function (err, nrows) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            if(nrows.length>0){
                                async.forEachOf(nrows, async (obj, key, callback) => {
                                    var numid = obj.numid
                                    var openemmcustomerid = obj.emm_customerid
                                    Openemm.synccampaignemailopening(openemmcamid,openemmcustomerid,numid)
                                })
                            }
                        }
                    })
                })
            }
        }
    })
})