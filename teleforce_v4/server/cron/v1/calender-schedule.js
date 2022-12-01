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
    console.log('running a task every 60 second calender schedule==> ' + date_ob + ' ' + hours + ':' + minutes);

    var curr_date = dateFormat(now, "yyyy-mm-dd");

    var now = new Date();

    if (hours > 7 && hours < 23) {
        await db.query('SELECT s.*,a.created_by as managerid,a.account_name,a.email as account_email,a.emailserver_alloted,es.smtp_server,es.smtp_port,es.smtp_username,es.smtp_password FROM tf_scheduler s  LEFT JOIN tf_account_table a ON s.user_id=a.account_id LEFT JOIN tf_manager_email_server es ON a.emailserver_alloted=es.server_id WHERE s.email_status = 0 limit 0,10', [], async function (err, adata) {
            if (err) {
                console.log(err);
            } else {
                console.log("adata.length :" + adata.length);
                if (adata.length > 0) {
                    var cnt = 0;
                    await async.forEachOf(adata, (data, callback) => {
                        console.log("data");
                        console.log(data);
                        var meeting_type = data['meeting_type'];
                        var customer_name = data['customer_name'];
                        var email = data['email'];
                        var mobile = data['mobile'];
                        var StartTime = data['StartTime'];
                        var EndTime = data['EndTime'];
                        var meeting_link = data['meeting_link'];
                        var smtp_server = data['smtp_server'];
                        var smtp_port = data['smtp_port'];
                        var smtp_username = data['smtp_username'];
                        var smtp_password = data['smtp_password'];
                        var emailserver_alloted = data['emailserver_alloted'];
                        var account_name = data['account_name'];
                        var account_email = data['account_email'];
                        var s_id = data['s_id'];
                        var managerid = data['managerid'];

                        var dateObj = new Date(StartTime);
                        var m_startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2) + " " + ('0' + dateObj.getHours()).slice(-2) + ":" + ('0' + dateObj.getMinutes()).slice(-2) + ":" + ('0' + dateObj.getSeconds()).slice(-2);

                        var dateObj_1 = new Date(EndTime);
                        var m_enddate = dateObj_1.getFullYear() + '-' + ('0' + (dateObj_1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj_1.getDate()).slice(-2) + " " + ('0' + dateObj_1.getHours()).slice(-2) + ":" + ('0' + dateObj_1.getMinutes()).slice(-2) + ":" + ('0' + dateObj_1.getSeconds()).slice(-2);

                        var seconds = (dateObj_1.getTime() - dateObj.getTime()) / 1000;

                        if (emailserver_alloted > 0 && managerid>0) {
                            db.query('SELECT c.metavalue as scheduledemailtemplate,e.email_html FROM tf_configuration_calender c LEFT JOIN tf_emailtemplate e ON c.metavalue=e.email_id  WHERE c.metakey="scheduledemailtemplate" AND c.user_id = ' + managerid, [], async function (err, tdata) {
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

                                            email_html = email_html.replace("{type}", meeting_type);
                                            email_html = email_html.replace("{customer_name}", customer_name);
                                            email_html = email_html.replace("{agent_name}", account_name);
                                            email_html = email_html.replace("{time_of_meet}", dateFormat(m_startdate, "fullDate") + ',' + dateFormat(m_startdate, "h:MM TT") + ' To ' + dateFormat(m_enddate, "h:MM TT"));
                                            email_html = email_html.replace("{email_id}", account_email);
                                            email_html = email_html.replace("{agent_name}", account_name);
                                            if (meeting_type == 'Video') {
                                                email_html = email_html.replace("{meeting_link}", meeting_link);
                                            } else {
                                                email_html = email_html.replace("{meeting_link}", "On Call");
                                            }

                                            email_html = email_html.replace("{email_id}", account_email);
                                            email_html = email_html.replace("{time_gap}", secondsToHms(seconds));

                                            var transporter = nodemailer.createTransport(transOptions);
                                            var frommail = "cloudX<" + smtp_username + ">";

                                            let info = {
                                                from: frommail, // sender address
                                                to: email, // list of receivers
                                                subject: "Invitation: " + customer_name + " and " + account_name + " @ " + dateFormat(StartTime, "fullDate") + ',' + dateFormat(StartTime, "h:MM TT") + ' To ' + dateFormat(EndTime, "h:MM TT") + "  (" + account_email + ")",
                                                text: "", // plain text body
                                                html: email_html, // html body
                                            };

                                            transporter.sendMail(info, function (error, info) {
                                                if (error) {
                                                    console.log("error");
                                                    console.log(JSON.stringify(error));
                                                } else {
                                                    if (info['accepted'].length > 0) {
                                                        db.query('UPDATE tf_scheduler SET `email_status`=1 WHERE s_id=' + s_id);
                                                    }
                                                }
                                            });

                                        } else {
                                            db.query('UPDATE tf_scheduler SET `email_status`=2 WHERE s_id=' + s_id);
                                            console.log({ 'Error': 'Email is invalid !.' });
                                        }
                                    } else {
                                        db.query('UPDATE tf_scheduler SET `email_status`=2 WHERE s_id=' + s_id);
                                        console.log({ 'Error': 'No Email Template is assigned to this manager.' });
                                    }

                                }
                            });


                        }
                    })
                }

            }
        });

        await db.query('SELECT s.*,a.created_by as managerid,a.account_name,a.email as account_email,aa.AccessKey as authkey FROM tf_scheduler s  LEFT JOIN tf_account_table a ON s.user_id=a.account_id  LEFT JOIN tf_account_table aa ON aa.account_id = a.created_by WHERE s.sms_status = 0 limit 0,10', [], async function (err, adata) {
            if (err) {
                console.log(err);
            } else {
                console.log("adata.length :" + adata.length);
                if (adata.length > 0) {
                    var cnt = 0;
                    await async.forEachOf(adata, (data, callback) => {
                        var meeting_type = data['meeting_type'];
                        var customer_name = data['customer_name'];
                        var email = data['email'];
                        var mobile = data['mobile'];
                        var StartTime = data['StartTime'];
                        var EndTime = data['EndTime'];
                        var meeting_link = data['meeting_link'];
                        var authkey = data['authkey'];
                        var account_name = data['account_name'];
                        var account_email = data['account_email'];
                        var s_id = data['s_id'];
                        var managerid = data['managerid'];

                        var dateObj = new Date(StartTime);
                        var m_startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2) + " " + ('0' + dateObj.getHours()).slice(-2) + ":" + ('0' + dateObj.getMinutes()).slice(-2) + ":" + ('0' + dateObj.getSeconds()).slice(-2);

                        var dateObj_1 = new Date(EndTime);
                        var m_enddate = dateObj_1.getFullYear() + '-' + ('0' + (dateObj_1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj_1.getDate()).slice(-2) + " " + ('0' + dateObj_1.getHours()).slice(-2) + ":" + ('0' + dateObj_1.getMinutes()).slice(-2) + ":" + ('0' + dateObj_1.getSeconds()).slice(-2);

                        var seconds = (dateObj_1.getTime() - dateObj.getTime()) / 1000;

                        if (managerid > 0) {
                            db.query('SELECT c.metavalue as smscampaignid FROM tf_configuration_calender c  WHERE c.metakey="smscampaignid" AND c.user_id = ' + managerid, [], async function (err, tdata) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("tdata :" + tdata.length);
                                    if (tdata.length > 0) {
                                        var camp_id = tdata[0]['smscampaignid'];
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
                                                'var1': account_name,
                                                'var2': dateFormat(m_startdate, "fullDate"),
                                                'var3': dateFormat(m_startdate, "h:MM TT"),
                                                'var4': dateFormat(m_enddate, "h:MM TT"),
                                                'var5': meeting_link
                                            }
                                        };
                                        console.log("options");
                                        console.log(options);
                                        request(options, function (error, response) {
                                            if (error) {
                                                throw new Error(error)
                                            } else {
                                                console.log(response.body);
                                                db.query('UPDATE tf_scheduler SET `sms_status`=1 WHERE s_id=' + s_id);
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