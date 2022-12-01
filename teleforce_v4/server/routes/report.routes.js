var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var session = require('express-session');
var Report = require('../model/report');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "Garuda@dv-iagents-secret";
var fs = require("fs");
var multer = require('multer');
const mime = require('mime');
var client = require('scp2')
const { exec } = require('child_process');
// const { getAudioDurationInSeconds } = require('get-audio-duration');
const authorize = require("../middlewares/auth");
var pdf = require("pdf-creator-node");
var fs = require('fs');
var async = require("async");
var json2xls = require('json2xls');
// Read HTML Template
var html = fs.readFileSync('invoice.html', 'utf8');
var csv=require('csvtojson');
var helper = require("../helper/common");
const awry = require('awry');
const { Parser } = require('json2csv');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({ resave: false, secret: '123456', saveUninitialized: true, cookie: { maxAge: 60000 } }));

async function getAgentVOIP(username,accountid){
    var voiceserverdata = await helper.GetManagerVoiceServerData(accountid)
    const askrestapi = new awry.API({
        baseUrl: voiceserverdata.ari_url,
        username: voiceserverdata.ari_username,
        password: voiceserverdata.ari_password,
    });
    //console.log(voiceserverdata)
    return askrestapi.endpoints.get({technology:'PJSIP',resource:username}).then(results => {
        if(results.data.state=='online'){
            return 'online'
        }else{
            //data.voipstatus = 'offline'
            return 'offline'
        }
    }).catch(function(err) {
        return 'offline'
    });
}


router.post('/searchCallSummary', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.searchcallsummary(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

//get agent login logut data for agent report
router.post('/agentLoginLogoutData', authorize, function (req, res) {
    //const data = req.body;
    //return res.status(200).send({ "data": [] });
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.getagentloginlogoutdata(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            if (rows.length > 0) {
                var filterrows = await Report.filterloginlogouttime(rows);
            } else {
                var filterrows = [];
            }

            res.status(200).send({ "data": filterrows });
        }
    })
})

//get agent login logut data for agent report
router.post('/agentLoginActivityData', authorize, function (req, res) {
    //const data = req.body;

    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.getagentloginactivitydata(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getResourceAvailability', authorize, function (req, res) {
    //const data = req.body;
    var date = new Date();
    date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    //date = '2020-09-02';
    Report.getresourceavailability(date, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get agent hourly call data for agent report
router.post('/agentHourlyCallData', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    //var dateObj1 = new Date(req.body.enddate);
    //req.body.enddate =  dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.getagenthourlycalldata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get agent hourly call data for agent report
router.post('/hourlyCallData', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    //var dateObj1 = new Date(req.body.enddate);
    //req.body.enddate =  dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);
    res.status(200).send({ "data": [] });
    // Report.gethourlycalldata(req.body, function (err, rows) {
    //     if (err) {
    //         console.log(err);
    //         res.status(200).send({ "data": [] });
    //     }
    //     else {
    //         res.status(200).send({ "data": rows });
    //     }
    // })
})
router.get('/getBillingReport', authorize, function (req, res) {
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();
    var currentdate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

    Report.getbillingdata(currentdate, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get manager dial data for report
router.post('/managerDialResultData', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.getmanagerdialresultdata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//campaign wise call summary 
router.post('/getManagerCampaignData/', authorize, function (req, res) {
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.getmanagercampaigndata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/getAgentCallDurationData/', authorize, function (req, res) {

    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.getagentcalldurationdata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/managerCallBackSummary/', authorize, function (req, res) {
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.managercallbacksummary(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/managerCallBackDetail/', authorize, function (req, res) {
    Report.managercallbackdetail(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getChannelUtilizationData', authorize, function (req, res) {
    var id = 0;
    Report.getchannelutilizationdata(id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/getRenewalBillingReport', authorize, function (req, res) {

    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();
    var currentdate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    req.body.date = currentdate;

    Report.getrenewalbillingdata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//this api use in campaign wise call summary 
router.post('/getManagerMinuteAssignData/', authorize, function (req, res) {
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.getmanagerminuteassigndata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getSpamDIDdata', authorize, function (req, res) {
    //const data = req.body;
    var date = '';
    Report.getspamdiddata(date, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getPackageCallDurationData/:id', authorize, function (req, res) {
    //const data = req.body;
    var date = '';
    Report.getpackagecalldurationdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getIVRExtension/:id', authorize, function (req, res) {
    //const data = req.body;
    var date = '';
    Report.getivrextension(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/createinvoice', authorize, function (req, res) {
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.createInvoice(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            //res.status(200).send({ "data": [] });
        } else {
            console.log(rows[0].Account_GST_NO);
            str = rows[0].Company_GST_ID;
            str = str.substring(0, str.length - 3);
            str = str.substring(2);
            rows[0].panno = str;
            rows[0].Plan_Value = (rows[0].Plan_Value).toLocaleString('en-US', { style: 'currency', currency: 'INR' })
            rows[0].Plan_TotalValue = (rows[0].Plan_TotalValue).toLocaleString('en-US', { style: 'currency', currency: 'INR' })
            rows[0].Total_GST = (rows[0].Total_GST).toLocaleString('en-US', { style: 'currency', currency: 'INR' })
            rows[0].Final_amount = (rows[0].Final_amount).toLocaleString('en-US', { style: 'currency', currency: 'INR' })
            var document = {
                html: html,
                data: {
                    detail: rows[0],
                },
                path: "./invoice.pdf"
            };
            var options = {
                format: "A3",
                orientation: "portrait",
                border: "10mm",
                header: {

                },
                "footer": {

                }
            };
            pdf.create(document, options)
                .then(res => {
                    console.log(res)
                })
                .catch(error => {
                    console.error(error)
                });
        }
    })
})
router.post('/getManagerIVRInputs/', authorize, function (req, res) {
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.getmanagerivrinputs(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getusercount', authorize, function (req, res) {

    //const data = req.body;
    // var date = new Date();
    // date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    // date = '2020-09-02';
    Report.getusercount(req.params, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getExpriedusercount', authorize, function (req, res) {

    Report.getExpriedusercount(req.params, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getNewusercount', authorize, function (req, res) {

    Report.getNewusercount(req.params, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})

//get agent performance data for agent report
router.post('/agent_performance_data', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + (dateObj.getDate())).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + (dateObj1.getDate())).slice(-2);

    if (req.body.startdate == req.body.enddate) {
        req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + ((dateObj1.getDate()))).slice(-2);
    }
    var dateObj2 = new Date();
    var curr_date = dateObj2.getFullYear() + '-' + ('0' + (dateObj2.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj2.getDate()).slice(-2);
    var start = req.body.startdate;
    var end = req.body.enddate;
    //console.log(new Date())
    Report.getagentperformancedata_new(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            //  console.log("data");
            //  console.log(JSON.stringify(rows));
            //console.log(new Date())
            if (rows.length > 0) {
                //console.log(rows);
                for (let index = 0; index < rows.length; index++) {
                    const element = rows[index];
                    var loggedata = await helper.getloggedatabyid(req.body,element.account_id);
                    element.loggedtime=loggedata;
                    element.totalholdcalltime=0;
                }
                //var filterrows = await Report.filterlogouttime(rows)
                res.status(200).send({ "data": rows });
            } else {
                res.status(200).send({ "data": [] });
            }

        }
    })
})
//get agent performance data for XLNC Manager
router.post('/xlncagentperformancedata', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + (dateObj.getDate())).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + (dateObj1.getDate())).slice(-2);

    if (req.body.startdate == req.body.enddate) {
        req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + ((dateObj1.getDate()))).slice(-2);
    }
    Report.getxlncagentperformancedata(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            //  console.log("data");
            //  console.log(JSON.stringify(rows));
            console.log(new Date())
            if (rows.length > 0) {
                //console.log(rows);
                for (let index = 0; index < rows.length; index++) {
                    const element = rows[index];
                    var loggedata = await helper.getloggedatabyid(req.body,element.account_id);
                    element.loggedtime=loggedata;
                    //element.totalholdcalltime=0;
                }
                //console.log(rows);
                //var filterrows = await Report.filterlogouttime(rows)
                res.status(200).send({ "data": rows });
            } else {
                res.status(200).send({ "data": [] });
            }

        }
    })
})


router.post('/getAgentLoggedTime', authorize, function (req, res) {

    var dateObj = new Date(req.body.start);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.end);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);


    var dateObj2 = new Date();

    var curr_date = dateObj2.getFullYear() + '-' + ('0' + (dateObj2.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj2.getDate()).slice(-2);
    var start = req.body.startdate;
    var end = req.body.enddate;

    var fdata = { agentid: req.body.agentid, start: start }
    if (curr_date == start) {
        fdata['curr_date'] = curr_date;
    }


    Report.getagentloggedtime(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            Report.getagentloggedtimenew(req.body.agentid, function (err, rows) {
                if (err) {
                    console.log(err);
                    res.status(200).send({ "data": [] });
                } else {
                    res.status(200).send({ "data": rows });
                }
            })
        }
    })

})

router.post('/searchUserReportData', authorize, function (req, res) {
    // console.log(req.body);
    var dateObj = new Date(req.body.start);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj = new Date(req.body.end);
    req.body.enddate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);

    Report.searchusereportdata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getManagerUserData', authorize, function (req, res) {
    var id = 0;
    Report.getmanageruserdata(id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/todayAnswerCallLead/', authorize, function (req, res) {
    var id = req.body.userid;
    var startdateObj = new Date(req.body.startdate);
    req.body.startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    var enddateObj = new Date(req.body.enddate);
    req.body.enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    //console.log(id);
    Report.todayanswercallead(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get lead wise agent count 
router.post('/todayCallLeadAgent/', authorize, function (req, res) {
    var id = req.body.userid;
    var lead = req.body.lead;
    var startdateObj = new Date(req.body.startdate);
    req.body.startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    var enddateObj = new Date(req.body.enddate);
    req.body.enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);

    //console.log(id);
    Report.todaycalleadagent(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get agent hourly call data for agent report
router.post('/hourlyAnswerCallLead', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date(req.body.date);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    //var dateObj1 = new Date(req.body.enddate);
    //req.body.enddate =  dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.hourlyanswercalleadata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get lead and date time wise agent count 
router.post('/hourlyCallLeadAgent/', authorize, function (req, res) {
    var id = req.body.userid;
    var lead = req.body.index1;
    var time = req.body.index2;
    var startdateObj = new Date(req.body.date);
    var todaydate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    //console.log(id);
    Report.hourlycalleadagents(id, todaydate, lead, time, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get manager plan minutes data
router.get('/planMinutesData/:userid', authorize, function (req, res) {
    var id = req.params.userid;
    Report.getplanminutesdata(id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getManagerCampaigns/', authorize, function (req, res) {
    var id = req.query.tknuserid;
    Report.getmanagercampaigns(id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get answer call count and no answer call count by campaign id
router.post('/getCampaignCallCount/', authorize, function (req, res) {
    //console.log(req.body);
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    //console.log(id);
    Report.getcampaigncallcount(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
//get CAMPAIGN WISE answer call lead data
router.post('/campaignAnswerCallLead', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.campaignanswercallead(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get CAMPAIGN WISE answer call lead data
router.post('/campaignCallLeadAgent', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.campaigncalleadagent(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get plan detail by manager id
router.get('/getPlanExpiryData/', authorize, function (req, res) {
    //const data = req.body;
    //var dateObj = new Date(req.body.date);
    //req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    //var dateObj1 = new Date(req.body.enddate);
    //req.body.enddate =  dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.getplanexpirydata(req.query.tknuserid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/downloadStatusExcel', authorize, function (req, res) {
    // console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    Report.searchcallsummary(req.body, function (err, results) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            //console.log("log"+JSON.stringify(rows.length))            
            jsonArray = [];
            async.forEachOf(results, async (rows, key, callback) => {
                var tempArry = {
                    'Cancel Call Count': rows['CANCEL'],
                    'Answer Call Count': rows['NOANSWER'],
                    'No Answer Call Count': rows['ANSWER'],
                    'Incoming Call Count': rows['INCOMMING'],
                    'Dialer Call Count': rows['DIALER'],
                    'Outgoing Call Count': rows['OUTGOING'],
                    'Interested Call Count': rows['interested'],
                    'Not Interested Call Count': rows['not_interested'],
                    'Schedule Call Count': rows['schedule']
                }
                jsonArray.push(tempArry);
            })
            var xls = json2xls(jsonArray);
            fs.writeFileSync('./uploads/callsummary-' + req.body.userid + '.xlsx', xls, 'binary');
            res.status(200).send({ "data": 'callsummary-' + req.body.userid + '.xlsx' });
        }

    })
})

router.post('/downloadHourlyCallExcel', authorize, function (req, res) {
    downloadCampaignCallExcel
    // console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    Report.getagenthourlycalldata(req.body, function (err, results) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            //console.log("log"+JSON.stringify(rows.length))            
            jsonArray = [];
            var rows = results[0];
            //async.forEachOf(results, async (rows, key, callback) => {
            var tempArry = {
                '10 AM-11 AM': rows['count1'],
                '11 AM-12 PM': rows['count2'],
                '12 PM-1 PM': rows['count3'],
                '2 PM-3 PM': rows['count4'],
                '3 PM-4 PM': rows['count5'],
                '4 PM-5 PM': rows['count6'],
                '5 PM-6 PM': rows['count7']
            }
            jsonArray.push(tempArry);
            //})   
            var xls = json2xls(jsonArray);
            fs.writeFileSync('./uploads/hourlycall-' + req.body.userid + '.xlsx', xls, 'binary');
            res.status(200).send({ "data": 'hourlycall-' + req.body.userid + '.xlsx' });
        }

    })
})
router.post('/downloadCampaignCallExcel', authorize, function (req, res) {
    // console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    Report.campaignCallexceldata(req.body, function (err, results) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            //console.log("log"+JSON.stringify(rows.length))            
            jsonArray = [];
            async.forEachOf(results, async (rows, key, callback) => {
                var date = rows['CallStartTime'];
                var date = ("00" + date.getDate()).slice(-2) + "-" +
                    ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
                    date.getFullYear() + " " +
                    ("00" + date.getHours()).slice(-2) + ":" +
                    ("00" + date.getMinutes()).slice(-2) + ":" +
                    ("00" + date.getSeconds()).slice(-2);
                var tempArry = {
                    'Campaign': rows['cam_name'],
                    'DID': rows['DID'],
                    'Agent_Name': rows['AgentName'],
                    'Call_Time': date,
                    'Caller_Name': rows['CallerName'],
                    'Caller_Number': rows['CallerNumber'],
                    'Call_Duration': rows['CallTalkTime'],
                    'Call_Status': rows['CallStatus'],
                    'Call_Type': rows['CallType'],
                }
                jsonArray.push(tempArry);
            })
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(jsonArray);
            //var xls = json2xls(jsonArray);
            fs.writeFileSync('./uploads/campaigncalldata-' + req.body.camid + '.csv', csv, 'binary');
            res.status(200).send({ "data": 'campaigncalldata-' + req.body.camid + '.csv' });
        }

    })
})
router.get('/getUserSMSBalance/:id', authorize, function (req, res) {
    //const data = req.body;
    var date = '';
    Report.getusersmsbalance(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get total manager calls
router.get('/getTotalCalls/:id', authorize, function (req, res) {
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();
    var currentdate = year + "-" + month + "-" + date;
    data = { date: currentdate, userid: req.params.id }
    Report.getmanagertotalcalls(data, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})



router.get('/getmanagerlist/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Report.getmanagerwithplan(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getPackageManagerCalc/:id', authorize, function (req, res) {
    //const data = req.body;
    var date = '';
    Report.getpackagemanagercalldurationdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

//get most converted call data 
router.post('/getMostConvertedCallData', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    //var dateObj1 = new Date(req.body.enddate);
    //req.body.enddate =  dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.getmostconvertedcalldata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

//get campaign performance data 
router.post('/getCampaignPerformance', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    //var dateObj1 = new Date(req.body.enddate);
    //req.body.enddate =  dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.getcampaignperformancedata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/createreport', authorize, async function (req, res) {
    console.log("body");
    console.log(JSON.stringify(req.body));
    var startdateObj = new Date(req.body.startdate);
    var enddateObj = new Date(req.body.enddate);

    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    console.log("startdate :" + startdate + 'enddate:' + enddate);
    var fdata = { managerid: req.body.userid, reportname: 'call_summary', startdate: startdate, enddate: enddate }
    Report.savereportdata(fdata, function (err, result) {
        console.log(err)
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).send({ "msg": 'Report Request sent sucessfully!' });
        }
    })
})
router.post('/createreqreport', authorize, async function (req, res) {
    console.log("body");
    console.log(JSON.stringify(req.body));
    var startdateObj = new Date(req.body.startdate);
    var enddateObj = new Date(req.body.enddate);

    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    console.log("startdate :" + startdate + 'enddate:' + enddate);
    var fdata = { managerid: req.body.userid, reportname: req.body.reportname, startdate: startdate, enddate: enddate }
    console.log(fdata);
    Report.savereportdata(fdata, function (err, result) {
        console.log(err)
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).send({ "msg": 'Report Request sent sucessfully!' });
        }
    })
})
router.get('/getrequestedreport/:id', authorize, function (req, res) {
    //const data = req.body;
    var date = '';
    Report.getrequestedreport(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/recordingrequest', authorize, function (req, res) {
    //const data = req.body;
    var date = req.body.date;
    var mobile = req.body.mobile;
    var userid = req.query.tknuserid;
    var startdate = req.body.startdate?req.body.startdate:'';
    var enddate = req.body.enddate?req.body.enddate:'';
    //if(mobile!=''){
        var data = {date:date,mobile:mobile,userid:userid,status:0,created_date:new Date(),startdate:startdate,enddate:enddate}
        Report.insertrecordingrequest(data, function (err, rows) {
            if (err) {
                console.log(err);
                res.status(200).send({ "msg": err});
            }
            else {
                res.status(200).send({ "msg": 'Request submited successfully!' });
            }
        })    
    // }else{
    //     res.status(200).send({ "msg": 'Mobile number is required!' });
    // }
})
router.post('/recordingrequestlist', authorize, function (req, res) {
    //const data = req.body;
    var date = '';
    var userid = req.query.tknuserid;
    Report.getrecordingrequestedlist(userid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/uploadrequest', authorize, function (req, res) {
    var userid = req.query.tknuserid;
    var file_or = req.query.namm;
    var m = new Date();
    var fileid = m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var filename = fileid+'-'+file_or
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/report/csv')

        },
        filename: function (req, file, cb) {
            cb(null, filename)
        },
    })
    var upload = multer({ storage: storage }).single('image_files');
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.status(200).send("an Error occured");
        }
        else {
            var filepath = 'report/csv/' + filename;
            var data = {date:new Date(),filename:filename,filepath:filepath,userid:userid,status:0,created_date:new Date()}
            Report.insertrecordingrequest(data, function (err, rows) {
                console.log(err)
                if (err) {
                    res.status(200).json(err);
                }
                else {
                    var reqid = rows.insertId
                    const csvFilePath='uploads/' + filepath
                    console.log(csvFilePath)
                    bulkUpdateOps = [];
                    csv()
                    .fromFile(csvFilePath)
                    .then((jsonObj)=>{
                        var json_keys = Object.keys(jsonObj[0]);
                        if(jsonObj.length>0){
                            async.forEachOf(jsonObj, async (obj, key, callback) => {
                                //console.log(obj)
                                if(obj['mobile']!=''){
                                    var date = new Date(obj['Date'])
                                    console.log(date)
                                    var contactdata = [reqid,date,obj['mobile'] ]
                                    bulkUpdateOps.push(contactdata);
                                }
                                if(jsonObj.length==key+1){
                                    console.log(bulkUpdateOps)
                                    Report.insertrecordingrequestnumber(bulkUpdateOps, function (err, cont) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            res.json({ 'msg': 'File added sucessfully!' });
                                        }
                                    })
                                }
                            })
                        }else{
                            res.json({ 'msg': 'No record found!' });
                        }
                    })
                    //console.log(bulkUpdateOps)
                }
            });

        }
    });

});

router.post('/getagentlivestatus', authorize, function (req, res) {
    //const data = req.body;
    var date = '';
    var userid = req.query.tknuserid;
    var group = req.body.group;
    Report.getagentlivestatus(userid,group,async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            console.log(new Date(),rows.length)
            if(rows.length>0){
                var result = rows
                var cnt = 1;
                var totalreord = rows.length
                console.log(totalreord)
                rows.forEach(async element => {
                    var uid = element.account_id
                    var cdrdata = await Report.GetLiveCdrDataByUid(uid)
                    if(cdrdata.length>0){
                        // var cdrdata = await Report.GetCdrDataById(cdrid)
                        //console.log(cdrdata[0])
                        element.cdrdata = cdrdata[0]
                    }else{
                        var cdrdata = await Report.GetIdleTime(element.account_id)
                        if(cdrdata.length>0){
                            element.cdrdata = cdrdata[0]
                        }
                    }
                    element.voip = await getAgentVOIP(element.account_name,userid)
                    //console.log(result)
                    if(totalreord==cnt){
                        console.log(new Date(),totalreord)
                        //console.log(result)
                        res.status(200).send({ "data": result });
                    }
                    cnt = cnt + 1
                });
            }else{
                res.status(200).send({ "data": [] });
            }
        }
    })
})
router.post('/callsummaryreportexcel', authorize, function (req, res) {
    
    // console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    Report.searchcallsummary(req.body, function (err, results) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            //console.log("log"+JSON.stringify(rows.length))            
            jsonArray = [];
            async.forEachOf(results, async (rows, key, callback) => {
                var tempArry = {
                    'Answer Call Count': rows['ANSWER'],
                    'No Answer Call Count': rows['NOANSWER'],
                    'Incoming Call Count': rows['INCOMMING'],
                    'Dialer Call Count': rows['DIALER'],
                    'Outgoing Call Count': rows['OUTGOING'],                    
                }
                jsonArray.push(tempArry);
            })
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(jsonArray);
            //var xls = json2xls(jsonArray);
            fs.writeFileSync('./uploads/callsummaryreport-' + req.body.userid + '.csv', csv, 'binary');
            res.status(200).send({ "data": 'callsummaryreport-' + req.body.userid + '.csv' });
        }

    })
})
//get agent login logut data for agent report
router.post('/agentHoldCallingReasonData', authorize, function (req, res) {
    //const data = req.body;
    //console.log(req.body);
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.getagentholdcallingreasondata(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
           /* if (rows.length > 0) {
                var filterrows = await Report.filterloginlogouttime(rows);
            } else {
                var filterrows = rows;
            }*/

            res.status(200).send({ "data": rows });
        }
    })
})
//get agent login logut data for agent report
router.post('/agentadherencegraphreport', authorize, function (req, res) {
    //const data = req.body;
    return res.status(200).send({ "data": [] });
    var dateObj = new Date(req.body.date);
    req.body.date = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    
    Report.getagentadherencegraphdata(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            if (rows.length > 0) {
                var filterrows = await Report.filterloginlogouttime(rows);
            } else {
                var filterrows = [];
            }

            res.status(200).send({ "data": filterrows });
        }
    })
})
//get agent performance data for agent report
router.post('/agentperformancegraphdata', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date(req.body.date);
    req.body.date = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + (dateObj.getDate())).slice(-2);
    
    Report.getagentperformancegraphdata(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            //  console.log("data");
            //  console.log(JSON.stringify(rows));
            if (rows.length > 0) {
                var filterrows = await Report.filterlogouttime(rows)
                res.status(200).send({ "data": filterrows });
            } else {
                res.status(200).send({ "data": rows });
            }

        }
    })
})

router.post('/getagentcalldurationgraphdata/', authorize, function (req, res) {
    console.log(req.body);
    var dateObj = new Date(req.body.date);
    req.body.date = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    
    Report.getagentcalldurationgraphdata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/getManagerCampaignGraphData/', authorize, function (req, res) {
    var dateObj = new Date(req.body.date);
    req.body.date = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    
    Report.getmanagercampaigngraphdata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/getivrinputsgraphdata/', authorize, function (req, res) {
    var dateObj = new Date(req.body.date);
    req.body.date = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
   
    Report.getivrinputsgraphdata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/getagentloginactivitygraphdata', authorize, function (req, res) {
    //const data = req.body;

    var dateObj = new Date(req.body.date);
    req.body.date = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    Report.getagentloginactivitygraphdata(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})



router.post('/searchacwgraphdata', authorize, function (req, res) {
    // console.log(req.body);
    var startdateObj = new Date(req.body.date);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.date = startdate;
    return res.status(200).send({ "data": [] });
    Report.searchacwgraphdata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows, "length": rows.length });
        }

    })
})

router.post('/getagentmissedcallgraphdata', authorize, function (req, res) {
    // console.log(req.body);
    var startdateObj = new Date(req.body.date);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.date = startdate;
    Report.getagentmissedcallgraphdata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows, "length": rows.length });
        }

    })
})

router.post('/agentreviewratedata', authorize, function (req, res) {
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.agentreviewratedata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data":[] });
        }
        else {
            console.log(rows);
            res.status(200).send({ "data": rows, "length": rows.length });
        }

    })
})
router.post('/agentHoldCallingReasonSummaryData', authorize, function (req, res) {
    //const data = req.body;
    //console.log(req.body);
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.getagentholdcallingreasonsummarydata(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
           /* if (rows.length > 0) {
                var filterrows = await Report.filterloginlogouttime(rows);
            } else {
                var filterrows = rows;
            }*/

            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getIVRCampaign/:id', authorize, function (req, res) {
    //const data = req.body;
    var date = '';
    Report.getivrcampaign(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getactiveagents/:id', authorize, function (req, res) {
    //console.log(req.params.id);gethuntgroup
    Report.getactiveagents(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})// login activity
router.get('/getallcampaign/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Report.getCampaign(req.params.id, function (err, rows) {
        //console.log(rows);
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).send({ "count": rows.length, 'data': rows });
        }
    });
});
//campaign wise call summary
router.post('/getcampaigndispositiondata/', authorize, function (req, res) {
    req.body.userid = req.query.tknuserid;
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.getcampaigndispositiondata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getdispositioncampaign/', authorize, function (req, res) {
    req.body.userid = req.query.tknuserid;
    
    Report.getdispositioncampaign(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})



router.post('/calltrafficreport', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date();
    req.body.userid = req.query.tknuserid;

    req.body.date = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + (dateObj.getDate())).slice(-2);
    
    Report.calltrafficreport(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
             res.status(200).send({ "data": rows });

        }
    })
})

router.post('/hourlycallreportgraph', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date();
    req.body.userid = req.query.tknuserid;

    req.body.date = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + (dateObj.getDate())).slice(-2);
    
    Report.hourlycallreportgraph(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            //  console.log("data");
             res.status(200).send({ "data": rows });

           

        }
    })
})

router.post('/getsalesfunnelreport', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date();
    req.body.userid = req.query.tknuserid;

    req.body.date = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + (dateObj.getDate())).slice(-2);
    
    Report.getsalesfunnelreport(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
             console.log("data",rows);
             res.status(200).send({ "data": rows });

          

        }
    })
})

router.post('/getleadsourcereport', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date();
    req.body.userid = req.query.tknuserid;

    req.body.date = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + (dateObj.getDate())).slice(-2);
    
    Report.getleadsourcereport(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            //  console.log("data");
             res.status(200).send({ "data": rows });

         

        }
    })
})
router.post('/getqueuecalls', authorize, function (req, res) {
    data = {  userid: req.body.id }
    //console.log(data);
    Report.getmanagerqueuecalls(data, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/search_call_usage_report', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.search_call_usage_report(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/agent_performance_report_data', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);
req.body.userid =req.query.tknuserid;
    Report.agent_performance_report_data(req.body,async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            if (rows.length > 0) {
                //console.log(rows);
                for (let index = 0; index < rows.length; index++) {
                    const element = rows[index];
                    var loggedata = await helper.getloggedatabyid(req.body,element.agent_id);
                    element.loggedtime=loggedata;
                   
                }
                res.status(200).send({ "data": rows });
            }else{
                res.status(200).send({ "data": [] });
            }
           
        }
    })
})

router.post('/agent_break_time_report', authorize, function (req, res) {
    //const data = req.body;

    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);
    req.body.account_id=req.query.tknuserid
    Report.agent_break_time_report(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/total_break_time_report', authorize, function (req, res) {
    //const data = req.body;

    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);
    req.body.account_id=req.query.tknuserid
    Report.total_break_time_report(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/callsupiviosertrafficreport', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date();
    req.body.userid = req.query.tknuserid;

    req.body.date = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + (dateObj.getDate())).slice(-2);
    
    Report.callsupiviosertrafficreport(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
             res.status(200).send({ "data": rows });

        }
    })
})

router.post('/hourlysupiviorcallreportgraph', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date();
    req.body.userid = req.query.tknuserid;

    req.body.date = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + (dateObj.getDate())).slice(-2);
    
    Report.hourlysupiviorcallreportgraph(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
             res.status(200).send({ "data": rows });

           

        }
    })
})
router.post('/getsupervisioragentlivestatus', authorize, function (req, res) {
    //const data = req.body;
    var date = '';
    var userid = req.query.tknuserid;
    var group = req.body.group;
    Report.getsupervisioragentlivestatus(userid,async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            console.log(new Date(),rows.length)
            if(rows.length>0){
                var result = rows
                var cnt = 1;
                var totalreord = rows.length
                console.log(totalreord)
                rows.forEach(async element => {
                    var uid = element.account_id
                    var cdrdata = await Report.GetLiveCdrDataByUid(uid)
                    if(cdrdata.length>0){
                        // var cdrdata = await Report.GetCdrDataById(cdrid)
                        //console.log(cdrdata[0])
                        element.cdrdata = cdrdata[0]
                    }else{
                        var cdrdata = await Report.GetIdleTime(element.account_id)
                        if(cdrdata.length>0){
                            element.cdrdata = cdrdata[0]
                        }
                    }
                   // element.voip = await getAgentVOIP(element.account_name,userid)
                    //console.log(result)
                    if(totalreord==cnt){
                        console.log(new Date(),totalreord)
                        //console.log(result)
                        res.status(200).send({ "data": result });
                    }
                    cnt = cnt + 1
                });
            }else{
                res.status(200).send({ "data": [] });
            }
        }
    })
})
router.post('/getsupervisiorsalesfunnelreport', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date();
    req.body.userid = req.query.tknuserid;

    req.body.date = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + (dateObj.getDate())).slice(-2);
    
    Report.getsupervisiorsalesfunnelreport(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
             console.log("data",rows);
             res.status(200).send({ "data": rows });

          

        }
    })
})
//agent_supervisior_break_time_report
router.post('/agent_supervisior_break_time_report', authorize, function (req, res) {
    //const data = req.body;

    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);
    req.body.id = req.query.tknuserid;
    Report.agent_supervisior_break_time_report(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/agent_supervisior_ReviewRateData', authorize, function (req, res) {
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.agent_supervisior_ReviewRateData(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data":[] });
        }
        else {
            console.log(rows);
            res.status(200).send({ "data": rows, "length": rows.length });
        }

    })
})
router.post('/supervisior_agentPerformanceData', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + (dateObj.getDate())).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + (dateObj1.getDate())).slice(-2);

    if (req.body.startdate == req.body.enddate) {
        req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + ((dateObj1.getDate()))).slice(-2);
    }
    var dateObj2 = new Date();
    var curr_date = dateObj2.getFullYear() + '-' + ('0' + (dateObj2.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj2.getDate()).slice(-2);
    var start = req.body.startdate;
    var end = req.body.enddate;
    console.log(req.body)
    Report.supervisior_agentPerformanceData(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            //  console.log("data");
            //  console.log(JSON.stringify(rows));
            console.log(new Date())
            if (rows.length > 0) {
                //console.log(rows);
                for (let index = 0; index < rows.length; index++) {
                    const element = rows[index];
                    var loggedata = await helper.getloggedatabyid(req.body,element.account_id);
                    element.loggedtime=loggedata;
                }
                //console.log(rows);
                //var filterrows = await Report.filterlogouttime(rows)
                res.status(200).send({ "data": rows });
            } else {
                res.status(200).send({ "data": [] });
            }

        }
    })
})
router.post('/agentsupervisiorHoldCallingReasonSummaryData', authorize, function (req, res) {
    //const data = req.body;
    //console.log(req.body);
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.agentsupervisiorHoldCallingReasonSummaryData(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
           /* if (rows.length > 0) {
                var filterrows = await Report.filterloginlogouttime(rows);
            } else {
                var filterrows = rows;
            }*/

            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/agentsupervisiorHoldCallingReasonData', authorize, function (req, res) {
    //const data = req.body;
    //console.log(req.body);
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.agentsupervisiorHoldCallingReasonData(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
           /* if (rows.length > 0) {
                var filterrows = await Report.filterloginlogouttime(rows);
            } else {
                var filterrows = rows;
            }*/

            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/supervisior_agentLoginLogoutData', authorize, function (req, res) {
    //const data = req.body;
    //return res.status(200).send({ "data": [] });
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.getsupervisioragentloginlogoutdata(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            if (rows.length > 0) {
                var filterrows = await Report.filterloginlogouttime(rows);
            } else {
                var filterrows = [];
            }

            res.status(200).send({ "data": filterrows });
        }
    })
})
router.post('/get_supervisior_AgentCallDurationData/', authorize, function (req, res) {

    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.get_supervisior_agentcalldurationdata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/getsupervisiorCampaignData/', authorize, function (req, res) {
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.getsupervisiorCampaignData(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getsupervisiordispositioncampaign/', authorize, function (req, res) {
    req.body.userid = req.query.tknuserid;
    
    Report.getsupervisiordispositioncampaign(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/get_supervisior_campaign_disposition_data/', authorize, function (req, res) {
    req.body.userid = req.query.tknuserid;
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.get_supervisior_campaign_disposition_data(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/get_supervisior_agent_login_activity', authorize, function (req, res) {
    //const data = req.body;

    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.get_supervisior_agent_login_activity(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/get_agent_callduration_talktime/', authorize, function (req, res) {

    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.get_agent_callduration_talktime(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/segement_wise_call_log/', authorize, function (req, res) {

    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.segement_wise_call_log(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/incoming_misscall_reports/', authorize, function (req, res) {

    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.incoming_misscall_reports(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/new_caller_report/', authorize, function (req, res) {

    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.new_caller_report(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/xlncagentperformancedata', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + (dateObj.getDate())).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + (dateObj1.getDate())).slice(-2);

    if (req.body.startdate == req.body.enddate) {
        req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + ((dateObj1.getDate()))).slice(-2);
    }
    Report.getxlncagentperformancedata(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            //  console.log("data");
            //  console.log(JSON.stringify(rows));
            if (rows.length > 0) {
                //console.log(rows);
                for (let index = 0; index < rows.length; index++) {
                    const element = rows[index];
                    var loggedata = await helper.getloggedatabyid(req.body,element.account_id);
                    element.loggedtime=loggedata;
                    //element.totalholdcalltime=0;
                }
                //console.log(rows);
                //var filterrows = await Report.filterlogouttime(rows)
                res.status(200).send({ "data": rows });
            } else {
                res.status(200).send({ "data": [] });
            }

        }
    })
})
router.post('/supervisior_xlncagentPerformanceData', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + (dateObj.getDate())).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + (dateObj1.getDate())).slice(-2);

    if (req.body.startdate == req.body.enddate) {
        req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + ((dateObj1.getDate()))).slice(-2);
    }
   
    Report.supervisior_xlncagentPerformanceData(req.body, async function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            
            if (rows.length > 0) {
                //console.log(rows);
                for (let index = 0; index < rows.length; index++) {
                    const element = rows[index];
                    var loggedata = await helper.getloggedatabyid(req.body,element.account_id);
                    element.loggedtime=loggedata;
                }
                //console.log(rows);
                //var filterrows = await Report.filterlogouttime(rows)
                res.status(200).send({ "data": rows });
            } else {
                res.status(200).send({ "data": [] });
            }

        }
    })
})
router.post('/getobdpulsereport/', authorize, function (req, res) {
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.getobdpulsereport(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/getcommonagentperformnace/', authorize, function (req, res) {
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    // var dateObj1 = new Date(req.body.enddate);
    // req.body.enddate = dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);

    Report.getcommonagentperformnace(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
module.exports = router;
