var cron = require('node-cron');
//var Report = require('../../model/report');
var async = require('async');

var db = require('../../database/db');
var json2xls = require('json2xls');
var fs = require('fs');
var dateFormat = require('dateformat');
var moment = require('moment');
var helper = require('../../helper/common');
var dateFormat = require("dateformat");
var validator = require("email-validator");
var nodemailer = require('nodemailer');
var request = require('request');


//'*/3600 * * * * *'
cron.schedule("*/60 * * * * *", async () => {

    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    console.log('running a task every 60 second auto dialer ivr==> ' + date_ob + ' ' + hours + ':' + minutes);

    var curr_date = dateFormat(now, "yyyy-mm-dd");

    var now = new Date();
    console.log("hours" + hours);
    if (hours >= 7 && hours < 23) {
        db.query('SELECT s.*,a.created_by as managerid,a.account_name,a.email as account_email,a.emailserver_alloted,es.smtp_server,es.smtp_port,es.smtp_username,es.smtp_password FROM tf_schedule_meeting s  LEFT JOIN tf_account_table a ON s.agent_id=a.account_id LEFT JOIN tf_manager_email_server es ON a.emailserver_alloted=es.server_id WHERE s.email_status = 1 limit 0,10', [], async function (err, adata) {
            if (err) {
                console.log(err);
            } else {
                console.log("adata.length :" + adata.length);
                if (adata.length > 0) {
                    var cnt = 0;
                    await async.forEachOf(adata, (data, callback) => {
                        var meetingid = data['meetingid'];
                        var customer_name = data['customer_name'];
                        var email = data['email'];
                        var mobile = data['mobile'];
                        var meeting_link = data['shared_link'];

                        var smtp_server = data['smtp_server'];
                        var smtp_port = data['smtp_port'];
                        var smtp_username = data['smtp_username'];
                        var smtp_password = data['smtp_password'];
                        var emailserver_alloted = data['emailserver_alloted'];

                        var account_name = data['account_name'];
                        var account_email = data['account_email'];
                        var managerid = data['managerid'];

                        if (emailserver_alloted > 0) {
                            db.query('SELECT c.metavalue as linkshareemailtemplate,e.email_html FROM tf_configuration_calender c LEFT JOIN tf_emailtemplate e ON c.metavalue=e.email_id  WHERE c.metakey="linkshareemailtemplate" AND c.user_id = ' + managerid, [], async function (err, tdata) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    if (tdata.length > 0) {
                                        var email_html = tdata[0]['email_html'];
                                        var status = validator.validate(data['email']);
                                        console.log("status :" + data['email']);
                                        if (status == true) {
                                            var transOptions = {
                                                host: smtp_server,
                                                port: smtp_port,
                                                secure: false,
                                                auth: {
                                                    user: smtp_username,
                                                    pass: smtp_password,
                                                },
                                            };

                                            email_html = email_html.replace("AgentName", account_name);
                                            email_html = email_html.replace("CustomerName", customer_name);
                                            email_html = email_html.replace("Your Details", account_email);
                                            email_html = email_html.replace("{meeting_link}", meeting_link);

                                            var transporter = nodemailer.createTransport(transOptions);
                                            var frommail = "cloudX<" + smtp_username + ">";

                                            let info = {
                                                from: frommail, // sender address
                                                to: email, // list of receivers
                                                subject: "Meeting Schedule Calender",
                                                text: "", // plain text body
                                                html: email_html, // html body
                                            };

                                            transporter.sendMail(info, function (error, info) {
                                                if (error) {
                                                    console.log("error");
                                                    console.log(JSON.stringify(error));
                                                } else {
                                                    if (info['accepted'].length > 0) {
                                                        db.query('UPDATE tf_schedule_meeting SET `email_status`=2 WHERE meetingid=' + meetingid);
                                                    }
                                                }
                                            });

                                        } else {
                                            console.log({ 'Error': 'No server assigned to Agent.' });
                                        }
                                    } else {
                                        console.log({ 'Error': 'No Email Template is assigned to this manager.' });
                                    }

                                }
                            });


                        }
                    })
                }

            }
        });

        db.query('SELECT s.*,a.created_by as managerid,a.account_name,a.email as account_email,aa.AccessKey as authkey FROM tf_schedule_meeting s  LEFT JOIN tf_account_table a ON s.agent_id=a.account_id  LEFT JOIN tf_account_table aa ON aa.account_id = a.created_by WHERE s.sms_status = 1 limit 0,10', [], async function (err, adata) {
            if (err) {
                console.log(err);
            } else {
                console.log("adata.length :" + adata.length);
                if (adata.length > 0) {
                    var cnt = 0;
                    await async.forEachOf(adata, (data, callback) => {
                        var meetingid = data['meetingid'];
                        var customer_name = data['customer_name'];
                        var email = data['email'];
                        var mobile = data['mobile'];
                        var meeting_link = data['shared_link'];

                        var smtp_server = data['smtp_server'];
                        var smtp_port = data['smtp_port'];
                        var smtp_username = data['smtp_username'];
                        var smtp_password = data['smtp_password'];
                        var emailserver_alloted = data['emailserver_alloted'];

                        var account_name = data['account_name'];
                        var account_email = data['account_email'];
                        var managerid = data['managerid'];
                        var authkey = data['authkey'];
                        if (managerid > 0) {
                            db.query('SELECT c.metavalue as smscampaignid FROM tf_configuration_calender c  WHERE c.metakey="sharelinksmscampaignid" AND c.user_id = ' + managerid, [], async function (err, tdata) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("tdata :" + tdata.length);
                                    var camp_id = tdata[0]['smscampaignid'];
                                    if (tdata.length > 0) {
                                        var options = {
                                            'method': 'POST',
                                            'url': 'https://sms.cloudX.in/api/tfapi/sendsms',
                                            'headers': {
                                                'Content-Type': 'application/x-www-form-urlencoded'
                                            },
                                            form: {
                                                'authkey': authkey,
                                                'mobile': mobile,
                                                'name': customer_name,
                                                'campaignid': camp_id,
                                                'var1': meeting_link,
                                            }
                                        };
                                        console.log("options");
                                        console.log(options);
                                        request(options, function (error, response) {
                                            if (error) {
                                                throw new Error(error)
                                            } else {
                                                console.log(response.body);
                                                db.query('UPDATE tf_schedule_meeting SET `sms_status`=2 WHERE meetingid=' + meetingid);
                                            }


                                        });

                                    } else {
                                        console.log({ 'Error': 'No SMS Template is assigned to this manager.' });
                                    }

                                }
                            });


                        }
                    })
                }

            }
        });

    }
});


function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
}