var cron = require('node-cron');
var Report = require('../model/report');
var async = require('async');

var db = require('../database/db');
var json2xls = require('json2xls');
var fs = require('fs-extra');
var dateFormat = require('dateformat');
var moment = require('moment');
var helper = require('../helper/common')
var path = require('path');

//'*/3600 * * * * *'
cron.schedule("*/10 * * * * *", async () => {

    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    if (!fs.existsSync(path.join(__dirname, '/../uploads/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    if (!fs.existsSync(path.join(__dirname, '/../uploads/reports/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/reports/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    //console.log('running a task every 40 second auto dialer ivr==> '+date_ob+' '+hours+':'+minutes);
    if (hours > 7 && hours < 23) {

        db.query('SELECT * FROM tf_report_req WHERE status = 0', [], async function (err, data) {
            if (err) {
                console.log(err);
            } else {

                if (data.length > 0) {
                    async.forEachOf(data, (log, callback) => {
                        var startdate = log.startdate;
                        var enddate = log.enddate;
                        var reportname = log.reportname;
                        var managerid = log.managerid;
                        var reqid = log.reqid;

                        var startdateObj = new Date(startdate);
                        var enddateObj = new Date(enddate);
                        var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
                        var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);


                        var data = { userid: managerid, startdate: startdate, enddate: enddate };

                        
                        if (reportname == 'agent_login_logout') {
                            Report.getagentloginlogoutdata(data, async function (err, rows) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(rows);
                                    if (rows.length > 0) {
                                        var filterrows = await Report.filterloginlogouttime(rows);
                                        jsonArray = [];

                                        async.forEachOf(filterrows, async (rows, key, callback) => {

                                            var l_date = dateFormat(rows['logintime'], "dd-mm-yyyy");
                                            var login = dateFormat(rows['logintime'], "dd-mm-yyyy HH:MM:ss");
                                            var logout = dateFormat(rows['logout_time'], "dd-mm-yyyy HH:MM:ss");

                                            if (rows['logout_time'] != null) {
                                                var dt1 = new Date(rows['logintime']);
                                                var dt2 = new Date(rows['logout_time']);
                                                var diff = (dt2.getTime() - dt1.getTime()) / 1000;
                                                var date = new Date(0);
                                                date.setSeconds(diff);
                                                var timeString = date.toISOString().substr(11, 8);
                                            } else {
                                                var timeString = '00:00:00';
                                            }

                                            if (rows['breaktime'] != null) {
                                                var break_time = rows['breaktime'];
                                            } else {
                                                var break_time = '00:00:00';
                                            }



                                            //Total working time
                                            if (rows['logout_time'] != null || break_time != null) {
                                                if (rows['logout_time'] != null) {
                                                    var dt1 = new Date(rows['logintime']);
                                                    var dt2 = new Date(rows['logout_time']);
                                                    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
                                                    var totalseconds = diff;
                                                } else {
                                                    var totalseconds = 0;
                                                }
                                                if (break_time != null) {
                                                    var break_time = break_time.split(':'); // split it at the colons  
                                                    // minutes are worth 60 seconds. Hours are worth 60 minutes.
                                                    var breakseconds = (+break_time[0]) * 60 * 60 + (+break_time[1]) * 60 + (+break_time[2]);
                                                } else {
                                                    var breakseconds = 0;
                                                }

                                                if (totalseconds > 0) {
                                                    var worktime = totalseconds - breakseconds;
                                                    var date = new Date(0);
                                                    date.setSeconds(worktime); // specify value for SECONDS here
                                                    var totaltime = date.toISOString().substr(11, 8);
                                                } else {
                                                    totaltime = '00:00:00';
                                                }

                                            } else {
                                                totaltime = '00:00:00';
                                            }

                                            if (rows['totalholdcalltime'] != null) {
                                                var totalholdcalltime = rows['totalholdcalltime'];
                                            } else {
                                                var totalholdcalltime = '00:00:00';
                                            }
                                            var tempArry = {
                                                'Agent Name': rows['account_name'],
                                                'Date': l_date,
                                                'Login Time': login,
                                                'Logout Time': logout,
                                                'Total Logged Time': timeString,
                                                'Total Break Time': break_time,
                                                'After Call Work': totalholdcalltime,
                                                'Total Working Time': totaltime,
                                            }

                                            jsonArray.push(tempArry);
                                        })
                                        var xls = json2xls(jsonArray);
                                        fs.writeFileSync('./uploads/reports/agentadherencereport-' + reqid + '.xlsx', xls, 'binary');
                                        var fdata = { downliad_link: 'agentadherencereport-' + reqid + '.xlsx', status: 1 };
                                        db.query('update tf_report_req set ? WHERE reqid = ?', [fdata, reqid]);

                                    } else {
                                        jsonArray = [];
                                        var tempArry = {
                                            'Agent Name': "",
                                            'Date': "",
                                            'Login Time': "",
                                            'Logout Time': "",
                                            'Total Logged Time': "",
                                            'Total Break Time': "",
                                            'After Call Work': "",
                                            'Total Working Time': "",
                                        }

                                        jsonArray.push(tempArry);
                                        var xls = json2xls(jsonArray);
                                        fs.writeFileSync('./uploads/reports/agentadherencereport-' + reqid + '.xlsx', xls, 'binary');
                                        var fdata = { downliad_link: 'agentadherencereport-' + reqid + '.xlsx', status: 1 };
                                        db.query('update tf_report_req set ? WHERE reqid = ?', [fdata, reqid]);
                                    }
                                }
                            })
                        }

                        if (reportname == 'agent_wise_call_duration') {
                            Report.getagentcalldurationdata(data, async function (err, rows) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    jsonArray = [];
                                    async.forEachOf(rows, async (rows, key, callback) => {

                                        var incomingduration = rows['incomingduration'];
                                        var outgoingduration = rows['outgoingduration'];
                                        var dialerduration = rows['dialerduration'];
                                        var totalduration = rows['totalduration'];

                                        if (incomingduration != null) {
                                            var in_call_dur = new Date(incomingduration * 1000).toISOString().substr(11, 8)
                                        } else {
                                            var in_call_dur = '00:00:00';
                                        }

                                        if (outgoingduration != null) {
                                            var out_call_dur = new Date(outgoingduration * 1000).toISOString().substr(11, 8)
                                        } else {
                                            var out_call_dur = '00:00:00';
                                        }

                                        if (dialerduration != null) {
                                            var dialer_call_dur = new Date(dialerduration * 1000).toISOString().substr(11, 8)
                                        } else {
                                            var dialer_call_dur = '00:00:00';
                                        }

                                        if (totalduration != null) {
                                            var total_call_dur = new Date(totalduration * 1000).toISOString().substr(11, 8)
                                        } else {
                                            var total_call_dur = '00:00:00';
                                        }

                                        var tempArry = {
                                            'Agent Name': rows['account_name'],

                                            'In Count Call': rows['totalincoming'],
                                            'In Call Duration': in_call_dur,
                                            'In Connected Call': rows['incomingconnectcalls'],

                                            'Out Count Call': rows['totaloutgoing'],
                                            'Out Call Duration': out_call_dur,
                                            'Out Connected Call': rows['outgoingconnectcalls'],

                                            'Dialer Count Call': rows['totaldialer'],
                                            'Dialer Call Duration': dialer_call_dur,
                                            'Dialer Connected Call': rows['dialerconnectcalls'],

                                            'Total Call Duration(Seconds)': total_call_dur,
                                            'Total Connected Call': rows['totalconnectcalls'],
                                        }

                                        jsonArray.push(tempArry);
                                    })
                                    var xls = json2xls(jsonArray);
                                    fs.writeFileSync('./uploads/reports/agent-call-duration-' + reqid + '.xlsx', xls, 'binary');
                                    var fdata = { downliad_link: 'agent-call-duration-' + reqid + '.xlsx', status: 1 };
                                    db.query('update tf_report_req set ? WHERE reqid = ?', [fdata, reqid]);
                                    console.log("done");
                                }
                            })
                        }

                        if (reportname == 'campaign_summary') {
                            Report.getmanagercampaigndata(data, async function (err, rows) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    jsonArray = [];
                                    async.forEachOf(rows, async (rows, key, callback) => {
                                        var tempArry = {
                                            'Campaign Name': rows['campaign_name'],
                                            'Total Records': rows['total_contacts'],
                                            'Total Calls': rows['total_calls'],
                                            'Answer (Count Calls)': rows['answered'],
                                            'No Answer (Count Calls)': rows['not_answered'],
                                            'Not Interested (Count Calls)': rows['not_interested'],
                                            'Schedule (Count Calls)': rows['scheduled'],
                                            'Connected Ratio': rows['connected_ratio']
                                        }
                                        jsonArray.push(tempArry);
                                    })
                                    var xls = json2xls(jsonArray);
                                    fs.writeFileSync('./uploads/reports/campaign-summary-' + reqid + '.xlsx', xls, 'binary');
                                    var fdata = { downliad_link: 'campaign-summary-' + reqid + '.xlsx', status: 1 };
                                    db.query('update tf_report_req set ? WHERE reqid = ?', [fdata, reqid]);
                                    console.log("done");
                                }
                            })
                        }

                        
                        
                    }, err => {
                        if (err) console.error(err.message);
                    });
                }
            }
        });
    }
});