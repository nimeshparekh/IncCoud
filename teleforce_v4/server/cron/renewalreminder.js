var cron = require('node-cron');
var Manager = require('../model/manager');
var csv = require('csvtojson');
var async = require('async');
var urllib = require('urllib');
var nodemailer = require('nodemailer');
var db = require('../database/db');



cron.schedule('*/40 * * * * *', () => {
    //let date_ob = new Date();
    //let hours = date_ob.getHours();
    //let minutes = date_ob.getMinutes();
    //console.log('running a task every 40 second auto dialer ivr==> '+date_ob+' '+hours+':'+minutes);
    //if(hours>8 && hours<20){//
    var interval = 0;
    var date = new Date();
    db.query('SELECT account_id,expiry_date,mobile,email FROM tf_account_table WHERE current_status=0 AND account_type=2 AND (expiry_date IS NOT NULL AND expiry_date > ? )', [date], async function (err, data) {
        if (err) {
            console.log(err);
        } else {
            //console.log(data.length);
            if (data.length > 0) {
               // console.log(data[0].account_name);
                //console.log('IVR campaign');
                async.forEachOf(data, (manager, callback) => {
                    //if (manager.expiry_date != null) {
                        let date_ob = new Date();
                        var daydiff = (manager.expiry_date.getTime() - date_ob.getTime()) / 1000 / 60 / 60 / 24;
                        if (daydiff <= 1) {
                            db.query('SELECT ES.smtp_username,ES.smtp_password ,ES.smtp_port,SS.username,SS.auth_key,SS.senderid,ST.sms_text,ET.email_subject,ET.email_description FROM `tf_emailsms_configuration`  C LEFT JOIN tf_email_server  ES ON ES.server_id=C.emailserver_id LEFT JOIN tf_sms_server SS ON SS.sid=C.smsserver_id LEFT JOIN tf_smstemplate ST ON ST.sms_id=C.smstemp_id LEFT JOIN tf_emailtemplate ET ON ET.email_id=C.emailtemp_id WHERE C.event LIKE "renew before 1 days"', [], async function (err, configdata) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    if (configdata.length > 0) {
                                        //SEND SMS
                                        var tonumber = manager.mobile;
                                        var message = configdata[0].sms_text;
                                        urllib.request("http://zipping.vispl.in/vapi/pushsms?user=cloudX&authkey=0105x0fp0opE05oRhi5K&sender=GARADV&mobile=" + tonumber + "&text=" + message + "&rpt=1", {
                                            method: 'GET',
                                            rejectUnauthorized: false,
                                        }, function (error, resp) {
                                            if (error) {
                                                console.log(error)
                                            }
                                            else {
                                                var result = JSON.parse(resp);
                                                smsstatus = result.STATUS;
                                                let m = new Date();
                                                numberdata = {
                                                    account_id: manager.account_id, expire_day: daydiff, sendsms_date: m, sendsms_status: smsstatus
                                                };
                                                Manager.insertsendsmsdata(numberdata, function (err, count) {
                                                    if (err) {
                                                        //console.log(err);
                                                    } else {

                                                    }
                                                })
                                            }
                                        });
                                        //send email
                                        var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
                                        //console.log(ip);
                                        var transOptions = {
                                            host: 'mail.cloudX.in',
                                            port: configdata[0].smtp_port,
                                            secure: false,
                                            auth: {
                                                user: configdata[0].smtp_username,
                                                pass: configdata[0].smtp_password,
                                            },
                                        };
                                        var transporter = nodemailer.createTransport(transOptions);
                                        subject = configdata[0].email_subject;
                                        emailhtml = configdata[0].email_description;
                                        toemail = manager.email;
                                       // emailhtml = emailhtml.replace('[name]', 'Jasvant')
                                        var mailOptions = {
                                            from: 'cloudX<no-reply@cloudX.in>',
                                            to: toemail,
                                            subject: subject,
                                            html: emailhtml,
                                        };  
                                        transporter.sendMail(mailOptions, function(error, info){
                                            if (error) {
                                                console.log(error);
                                            } else {
                                                console.log('Email sent: ' + info.response);
                                                var emailstatus = info.response;
                                                numberdata = {
                                                    account_id: manager.account_id, expire_day: daydiff, sendemail_date: m, sendemail_status: emailstatus
                                                };
                                                Manager.insertsendemaildata(numberdata, function (err, count) {
                                                    if (err) {
                                                        //console.log(err);
                                                    } else {

                                                    }
                                                })
                                            }
                                        })
    
                                    }

                                }
                            });
                        }
                        var daydiff = (manager.expiry_date.getTime() - date_ob.getTime()) / 1000 / 60 / 60 / 24;
                        if (daydiff <= 3 && daydiff >= 2) {
                            db.query('SELECT ES.smtp_username,ES.smtp_password ,ES.smtp_port,SS.username,SS.auth_key,SS.senderid,ST.sms_text,ET.email_subject,ET.email_description FROM `tf_emailsms_configuration`  C LEFT JOIN tf_email_server  ES ON ES.server_id=C.emailserver_id LEFT JOIN tf_sms_server SS ON SS.sid=C.smsserver_id LEFT JOIN tf_smstemplate ST ON ST.sms_id=C.smstemp_id LEFT JOIN tf_emailtemplate ET ON ET.email_id=C.emailtemp_id WHERE C.event LIKE "renew before 3 days"', [], async function (err, configdata) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    if (configdata.length > 0) {
                                        //SEND SMS
                                        var tonumber = manager.mobile;
                                        var message = configdata[0].sms_text;
                                        urllib.request("http://zipping.vispl.in/vapi/pushsms?user=cloudX&authkey=0105x0fp0opE05oRhi5K&sender=GARADV&mobile=" + tonumber + "&text=" + message + "&rpt=1", {
                                            method: 'GET',
                                            rejectUnauthorized: false,
                                        }, function (error, resp) {
                                            if (error) {
                                                console.log(error)
                                            }
                                            else {
                                                var result = JSON.parse(resp);
                                                smsstatus = result.STATUS;
                                                let m = new Date();
                                                numberdata = {
                                                    account_id: manager.account_id, expire_day: daydiff, sendsms_date: m, sendsms_status: smsstatus
                                                };
                                                Manager.insertsendsmsdata(numberdata, function (err, count) {
                                                    if (err) {
                                                        //console.log(err);
                                                    } else {

                                                    }
                                                })
                                            }
                                        });
                                        //send email
                                        var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
                                        //console.log(ip);
                                        var transOptions = {
                                            host: 'mail.cloudX.in',
                                            port: configdata[0].smtp_port,
                                            secure: false,
                                            auth: {
                                                user: configdata[0].smtp_username,
                                                pass: configdata[0].smtp_password,
                                            },
                                        };
                                        var transporter = nodemailer.createTransport(transOptions);
                                        subject = configdata[0].email_subject;
                                        emailhtml = configdata[0].email_description;
                                        toemail = manager.email;
                                       // emailhtml = emailhtml.replace('[name]', 'Jasvant')
                                        var mailOptions = {
                                            from: 'cloudX<no-reply@cloudX.in>',
                                            to: toemail,
                                            subject: subject,
                                            html: emailhtml,
                                        };  
                                        transporter.sendMail(mailOptions, function(error, info){
                                            if (error) {
                                                console.log(error);
                                            } else {
                                                console.log('Email sent: ' + info.response);
                                                var emailstatus = info.response;
                                                numberdata = {
                                                    account_id: manager.account_id, expire_day: daydiff, sendemail_date: m, sendemail_status: emailstatus
                                                };
                                                Manager.insertsendemaildata(numberdata, function (err, count) {
                                                    if (err) {
                                                        //console.log(err);
                                                    } else {

                                                    }
                                                })
                                            }
                                        })
    
                                    }
                                }
                            });
                        }
                        var daydiff = (manager.expiry_date.getTime() - date_ob.getTime()) / 1000 / 60 / 60 / 24;
                        if (daydiff <= 7 && daydiff >= 4) {
                            db.query('SELECT ES.smtp_username,ES.smtp_password ,ES.smtp_port,SS.username,SS.auth_key,SS.senderid,ST.sms_text,ET.email_subject,ET.email_description FROM `tf_emailsms_configuration`  C LEFT JOIN tf_email_server  ES ON ES.server_id=C.emailserver_id LEFT JOIN tf_sms_server SS ON SS.sid=C.smsserver_id LEFT JOIN tf_smstemplate ST ON ST.sms_id=C.smstemp_id LEFT JOIN tf_emailtemplate ET ON ET.email_id=C.emailtemp_id WHERE C.event LIKE "renew before 7 days"', [], async function (err, configdata) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    if (configdata.length > 0) {
                                        //SEND SMS
                                        var tonumber = manager.mobile;
                                        var message = configdata[0].sms_text;
                                        urllib.request("http://zipping.vispl.in/vapi/pushsms?user=cloudX&authkey=0105x0fp0opE05oRhi5K&sender=GARADV&mobile=" + tonumber + "&text=" + message + "&rpt=1", {
                                            method: 'GET',
                                            rejectUnauthorized: false,
                                        }, function (error, resp) {
                                            if (error) {
                                                console.log(error)
                                            }
                                            else {
                                                var result = JSON.parse(resp);
                                                smsstatus = result.STATUS;
                                                let m = new Date();
                                                numberdata = {
                                                    account_id: manager.account_id, expire_day: daydiff, sendsms_date: m, sendsms_status: smsstatus
                                                };
                                                Manager.insertsendsmsdata(numberdata, function (err, count) {
                                                    if (err) {
                                                        //console.log(err);
                                                    } else {

                                                    }
                                                })
                                            }
                                        });
                                        //send email
                                        var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
                                        //console.log(ip);
                                        var transOptions = {
                                            host: 'mail.cloudX.in',
                                            port: configdata[0].smtp_port,
                                            secure: false,
                                            auth: {
                                                user: configdata[0].smtp_username,
                                                pass: configdata[0].smtp_password,
                                            },
                                        };
                                        var transporter = nodemailer.createTransport(transOptions);
                                        subject = configdata[0].email_subject;
                                        emailhtml = configdata[0].email_description;
                                        toemail = manager.email;
                                       // emailhtml = emailhtml.replace('[name]', 'Jasvant')
                                        var mailOptions = {
                                            from: 'cloudX<no-reply@cloudX.in>',
                                            to: toemail,
                                            subject: subject,
                                            html: emailhtml,
                                        };  
                                        transporter.sendMail(mailOptions, function(error, info){
                                            if (error) {
                                                console.log(error);
                                            } else {
                                                console.log('Email sent: ' + info.response);
                                                var emailstatus = info.response;
                                                numberdata = {
                                                    account_id: manager.account_id, expire_day: daydiff, sendemail_date: m, sendemail_status: emailstatus
                                                };
                                                Manager.insertsendemaildata(numberdata, function (err, count) {
                                                    if (err) {
                                                        //console.log(err);
                                                    } else {

                                                    }
                                                })
                                            }
                                        })
    
                                    }
                                }
                            });
                        }
                        var daydiff = (date_ob.getTime() - manager.expiry_date.getTime()) / 1000 / 60 / 60 / 24;
                        if (daydiff <= 1) {
                            db.query('SELECT ES.smtp_username,ES.smtp_password ,ES.smtp_port,SS.username,SS.auth_key,SS.senderid,ST.sms_text,ET.email_subject,ET.email_description FROM `tf_emailsms_configuration`  C LEFT JOIN tf_email_server  ES ON ES.server_id=C.emailserver_id LEFT JOIN tf_sms_server SS ON SS.sid=C.smsserver_id LEFT JOIN tf_smstemplate ST ON ST.sms_id=C.smstemp_id LEFT JOIN tf_emailtemplate ET ON ET.email_id=C.emailtemp_id WHERE C.event LIKE "renew after 1 day"', [], async function (err, configdata) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    if (configdata.length > 0) {
                                        //SEND SMS
                                        var tonumber = manager.mobile;
                                        var message = configdata[0].sms_text;
                                        urllib.request("http://zipping.vispl.in/vapi/pushsms?user=cloudX&authkey=0105x0fp0opE05oRhi5K&sender=GARADV&mobile=" + tonumber + "&text=" + message + "&rpt=1", {
                                            method: 'GET',
                                            rejectUnauthorized: false,
                                        }, function (error, resp) {
                                            if (error) {
                                                console.log(error)
                                            }
                                            else {
                                                var result = JSON.parse(resp);
                                                smsstatus = result.STATUS;
                                                let m = new Date();
                                                numberdata = {
                                                    account_id: manager.account_id, expire_day: daydiff, sendsms_date: m, sendsms_status: smsstatus
                                                };
                                                Manager.insertsendsmsdata(numberdata, function (err, count) {
                                                    if (err) {
                                                        //console.log(err);
                                                    } else {

                                                    }
                                                })
                                            }
                                        });
                                        //send email
                                        var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
                                        //console.log(ip);
                                        var transOptions = {
                                            host: 'mail.cloudX.in',
                                            port: configdata[0].smtp_port,
                                            secure: false,
                                            auth: {
                                                user: configdata[0].smtp_username,
                                                pass: configdata[0].smtp_password,
                                            },
                                        };
                                        var transporter = nodemailer.createTransport(transOptions);
                                        subject = configdata[0].email_subject;
                                        emailhtml = configdata[0].email_description;
                                        toemail = manager.email;
                                       // emailhtml = emailhtml.replace('[name]', 'Jasvant')
                                        var mailOptions = {
                                            from: 'cloudX<no-reply@cloudX.in>',
                                            to: toemail,
                                            subject: subject,
                                            html: emailhtml,
                                        };  
                                        transporter.sendMail(mailOptions, function(error, info){
                                            if (error) {
                                                console.log(error);
                                            } else {
                                                console.log('Email sent: ' + info.response);
                                                var emailstatus = info.response;
                                                numberdata = {
                                                    account_id: manager.account_id, expire_day: daydiff, sendemail_date: m, sendemail_status: emailstatus
                                                };
                                                Manager.insertsendemaildata(numberdata, function (err, count) {
                                                    if (err) {
                                                        //console.log(err);
                                                    } else {

                                                    }
                                                })
                                            }
                                        })
    
                                    }
                                }
                            });
                        }
                        var daydiff = (date_ob.getTime() - manager.expiry_date.getTime()) / 1000 / 60 / 60 / 24;
                        if (daydiff <= 3 && daydiff >= 2 ) {
                            db.query('SELECT ES.smtp_username,ES.smtp_password ,ES.smtp_port,SS.username,SS.auth_key,SS.senderid,ST.sms_text,ET.email_subject,ET.email_description FROM `tf_emailsms_configuration`  C LEFT JOIN tf_email_server  ES ON ES.server_id=C.emailserver_id LEFT JOIN tf_sms_server SS ON SS.sid=C.smsserver_id LEFT JOIN tf_smstemplate ST ON ST.sms_id=C.smstemp_id LEFT JOIN tf_emailtemplate ET ON ET.email_id=C.emailtemp_id WHERE C.event LIKE "renew after 3 days"', [], async function (err, configdata) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    if (configdata.length > 0) {
                                        //SEND SMS
                                        var tonumber = manager.mobile;
                                        var message = configdata[0].sms_text;
                                        urllib.request("http://zipping.vispl.in/vapi/pushsms?user=cloudX&authkey=0105x0fp0opE05oRhi5K&sender=GARADV&mobile=" + tonumber + "&text=" + message + "&rpt=1", {
                                            method: 'GET',
                                            rejectUnauthorized: false,
                                        }, function (error, resp) {
                                            if (error) {
                                                console.log(error)
                                            }
                                            else {
                                                var result = JSON.parse(resp);
                                                smsstatus = result.STATUS;
                                                let m = new Date();
                                                numberdata = {
                                                    account_id: manager.account_id, expire_day: daydiff, sendsms_date: m, sendsms_status: smsstatus
                                                };
                                                Manager.insertsendsmsdata(numberdata, function (err, count) {
                                                    if (err) {
                                                        //console.log(err);
                                                    } else {

                                                    }
                                                })
                                            }
                                        });
                                        //send email
                                        var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
                                        //console.log(ip);
                                        var transOptions = {
                                            host: 'mail.cloudX.in',
                                            port: configdata[0].smtp_port,
                                            secure: false,
                                            auth: {
                                                user: configdata[0].smtp_username,
                                                pass: configdata[0].smtp_password,
                                            },
                                        };
                                        var transporter = nodemailer.createTransport(transOptions);
                                        subject = configdata[0].email_subject;
                                        emailhtml = configdata[0].email_description;
                                        toemail = manager.email;
                                       // emailhtml = emailhtml.replace('[name]', 'Jasvant')
                                        var mailOptions = {
                                            from: 'cloudX<no-reply@cloudX.in>',
                                            to: toemail,
                                            subject: subject,
                                            html: emailhtml,
                                        };  
                                        transporter.sendMail(mailOptions, function(error, info){
                                            if (error) {
                                                console.log(error);
                                            } else {
                                                console.log('Email sent: ' + info.response);
                                                var emailstatus = info.response;
                                                numberdata = {
                                                    account_id: manager.account_id, expire_day: daydiff, sendemail_date: m, sendemail_status: emailstatus
                                                };
                                                Manager.insertsendemaildata(numberdata, function (err, count) {
                                                    if (err) {
                                                        //console.log(err);
                                                    } else {

                                                    }
                                                })
                                            }
                                        })
    
                                    }
                                }
                            });
                        }
                        //var daydiff = (date_ob.getTime() - manager.expiry_date.getTime()) / 1000 / 60 / 60 / 24;
                        //if (daydiff <= 3 && daydiff >= 2 ) {
                            db.query('SELECT ES.smtp_username,ES.smtp_password ,ES.smtp_port,SS.username,SS.auth_key,SS.senderid,ST.sms_text,ET.email_subject,ET.email_description FROM `tf_emailsms_configuration`  C LEFT JOIN tf_email_server  ES ON ES.server_id=C.emailserver_id LEFT JOIN tf_sms_server SS ON SS.sid=C.smsserver_id LEFT JOIN tf_smstemplate ST ON ST.sms_id=C.smstemp_id LEFT JOIN tf_emailtemplate ET ON ET.email_id=C.emailtemp_id WHERE C.event LIKE "call audio"', [], async function (err, configdata) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    if (configdata.length > 0) {
                                        //SEND SMS
                                        var tonumber = manager.mobile;
                                        var message = configdata[0].sms_text;
                                        urllib.request("http://zipping.vispl.in/vapi/pushsms?user=cloudX&authkey=0105x0fp0opE05oRhi5K&sender=GARADV&mobile=" + tonumber + "&text=" + message + "&rpt=1", {
                                            method: 'GET',
                                            rejectUnauthorized: false,
                                        }, function (error, resp) {
                                            if (error) {
                                                console.log(error)
                                            }
                                            else {
                                                var result = JSON.parse(resp);
                                                smsstatus = result.STATUS;
                                                let m = new Date();
                                                numberdata = {
                                                    account_id: manager.account_id, expire_day: daydiff, sendsms_date: m, sendsms_status: smsstatus
                                                };
                                                Manager.insertsendsmsdata(numberdata, function (err, count) {
                                                    if (err) {
                                                        //console.log(err);
                                                    } else {

                                                    }
                                                })
                                            }
                                        });
                                        //send email
                                        var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
                                        //console.log(ip);
                                        var transOptions = {
                                            host: 'mail.cloudX.in',
                                            port: configdata[0].smtp_port,
                                            secure: false,
                                            auth: {
                                                user: configdata[0].smtp_username,
                                                pass: configdata[0].smtp_password,
                                            },
                                        };
                                        var transporter = nodemailer.createTransport(transOptions);
                                        subject = configdata[0].email_subject;
                                        emailhtml = configdata[0].email_description;
                                        toemail = manager.email;
                                       // emailhtml = emailhtml.replace('[name]', 'Jasvant')
                                        var mailOptions = {
                                            from: 'cloudX<no-reply@cloudX.in>',
                                            to: toemail,
                                            subject: subject,
                                            html: emailhtml,
                                        };  
                                        transporter.sendMail(mailOptions, function(error, info){
                                            if (error) {
                                                console.log(error);
                                            } else {
                                                console.log('Email sent: ' + info.response);
                                                var emailstatus = info.response;
                                                numberdata = {
                                                    account_id: manager.account_id, expire_day: daydiff, sendemail_date: m, sendemail_status: emailstatus
                                                };
                                                Manager.insertsendemaildata(numberdata, function (err, count) {
                                                    if (err) {
                                                        //console.log(err);
                                                    } else {

                                                    }
                                                })
                                            }
                                        })
    
                                    }
                                }
                            });
                        //}
                    //}
                }, err => {
                    if (err) console.error(err.message);
                });
            }
        }
    });
});