
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
var OBDCampaign = require('../model/obd_campaign');
const authorize = require("../middlewares/auth");
var async = require("async");
var helper = require("../helper/common");
const { Parser } = require('json2csv');
var fs = require('fs-extra');
var Contacts = require('../model/Contacts');

function formatDate(date) {

    //console.log(date);
    var datearray = date.split(',');
    var d = new Date(datearray[0]),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),

        houre = d.getHours(),
        min = '' + d.getMinutes(),
        sec = '' + d.getSeconds();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    var dates = [year, month, day].join('-');
    var time = [houre, min, sec].join('-');
    return [dates + " " + time];
}
router.get('/getallobdcampaign/:id', authorize, function (req, res) { 
    console.log("params:"+req.params.id);  
    OBDCampaign.getallobdcampaign(req.params.id, function (err, rows) {
        //console.log(rows);
        if (err) {
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    });
});

router.post('/getobdcampaign/', authorize, function (req, res) {
    //console.log(req.params.id);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;
    OBDCampaign.getobdcampaign(req.body, function (err, rows) {
        //console.log(rows);
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).send({ "count": rows.length, 'data': rows });
        }
    });
});

router.post('/createobdcampaign', authorize, async function (req, res) {
    //console.log(req.body);
    var m = new Date();
    var camid = 'CON' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    //console.log(req);
    var customer_id = req.body.customer_id;
    var startdate = req.body.startdate;
    //console.log(startdate);
    var date = formatDate(startdate)
    var campaignname = req.body.campaignname;
    var camtype = req.body.campaigntype;
    var cam_method = req.body.campaignmethod;
    var camagentgroup = req.body.agentgroup;
    var cam_agents = req.body.agents;
    var cam_did = req.body.did;
    var cam_segment = req.body.segments;
    var ivrid = req.body.ivr;
    var dialertype = "0";
    var retryunansweredcall = req.body.retryunansweredcall;
    var retrytime = req.body.retrytime?req.body.retrytime:1;
    var maxretry = req.body.maxretry;
    var sms_call_answered = req.body.smscallanswered;
    var sms_template_id = req.body.smstemplateid;
    //console.log(req.body);
    var campaigndata = {
        'create_date': date, 'cam_name': campaignname, 'cam_type': camtype,
        'cam_method': cam_method, 'cam_agentgroup': camagentgroup, 'retry': retryunansweredcall, 'retrytime': retrytime, 'maxretry': maxretry,
        cam_ivrid: ivrid, 'account_id': customer_id, 'cam_status': '0', 'dialer_type': dialertype,sms_call_answered:sms_call_answered,sms_template_id:sms_template_id
    };
    //console.log(campaigndata)
    var managerbalance = await helper.GetManagerBalance(customer_id)
    if (cam_method == 1 && managerbalance['OBD_User_Balance'] <= 0) {
        return res.json({ 'data': 'You have not sufficient OBD balance.' });
    } else {
        OBDCampaign.createcampaign(campaigndata,async function (err, result) {
            console.log(err)
            if (err) {
                res.json({ 'data': 'Something went wrong!!', 'camid': 0 });
            }
            else {
                //console.log(result);
                camid = result.insertId;
                //console.log(cam_segment)
                if (cam_segment.length > 0) {
                    async.forEachOf(cam_segment, async (cat, key, callback) => {
                        camdata = { category: cat, id: customer_id };
                        OBDCampaign.getContactbySegment(camdata, function (err, data) {
                            if (err) {
                                console.log(err);
                                res.json({ 'data': 'Something went wrong!!', 'camid': 0 });
                            } else {
                                var cnt = 1;
                                var total = data.length;
                                var agid = 0
                                if (camtype == 1 && cam_agents.length > 0) {
                                    agid = cam_agents[0]
                                }
                                bulknumarray = [];
                                async.forEachOf(data, async (num, key, callback) => {
                                    numberdata = [camid, customer_id, num.cont_id, agid, cat];
                                    bulknumarray.push(numberdata)
                                })
                                // console.log(bulknumarray)
                                OBDCampaign.insertbulkcamnumber(bulknumarray, function (err, count) {
                                    if (err) {
                                        console.log(err);
                                    } else {

                                    }
                                })
                            }

                        });

                    })
                }
                if (req.body.did && cam_did.length > 0) {
                    bulknumarray = [];
                    console.log(req.body.did)
                    async.forEachOf(cam_did, async (did, key, callback) => {
                        numberdata = [camid, customer_id, did];
                        bulknumarray.push(numberdata)
                    })
                    Contacts.insertbulkcamdid(bulknumarray, function (err, count) {
                        if (err) {
                            console.log(err);
                        } else {

                        }
                    })
                }
                // bulkdidarray = [];
                // const did = await helper.CheckAdminSetting('obd_agent_did')
                // var diddata = [camid, customer_id, did];
                // bulkdidarray.push(diddata)
                // Contacts.insertbulkcamdid(bulkdidarray, function (err, count) {
                //     if (err) {
                //         console.log(err);
                //     } else {

                //     }
                // })
               
                res.json({ 'data': 'OBD Campaign created sucessfully.', 'camid': camid });
            }
        });
    }
});
router.post('/searchOBDCampaignCallLogexcel', authorize, function (req, res) {
    // console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    OBDCampaign.obdcampaigncalllogexcel(req.body, function (err, results) {
        if (err) {
            console.log(err);
        }
        else {
            jsonArray = [];
            if(results.length>0){

            }
            async.forEachOf(results, async (rows, key, callback) => {
                //  console.log("log"+JSON.stringify(rows))   
                var tempArry = {
                    'Call Time': rows['CallStartTime'],
                    'Caller Name': rows['CallerName'],
                    'Caller Number': rows['CallerNumber'],
                    'Status': rows['CallStatus'],
                    'Duration': rows['CallDuration'],
                    'Talktime': rows['CallTalkTime'],
                    'Disconnected By': rows['DisconnectedBy'],
                    'Agent': rows['AgentName'],
                    'Call Type': rows['CallType'],
                }
                jsonArray.push(tempArry);
            })
            //var xls = json2xls(jsonArray);
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(jsonArray);
            fs.writeFileSync('./uploads/campaigncalllog-' + req.body.campaignid +  '.csv', csv, 'binary');
            res.status(200).send({ "data": 'campaigncalllog-' + req.body.campaignid + '.csv' });
        }

    })
})


router.post('/CampaignCallLog', authorize, function (req, res) {
    filter = req.body.filter;
    sortcolumn = req.body.sortcolumn;
    sortdirection = req.body.sortdirection;

    findmatch = {}
    //console.log(filter);
    var startdateObj = new Date(filter.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    findmatch.startdate = startdate;
    var enddateObj = new Date(filter.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    findmatch.enddate = enddate;
    findmatch.campaignid = filter.campaignid;
    findmatch.status = filter.status;
    findmatch.agentid = filter.agentid;
    findmatch.callerno = filter.callerno;
    findmatch.calltype = filter.calltype;
    findmatch.callername = filter.callername;
    findmatch.extension = filter.extension;
    findmatch.disposition = filter.disposition;
    var pageNumber = parseInt(req.body.pageNumber);
    var pageSize = parseInt(req.body.pageSize);
    var position = pageNumber * pageSize;
    findmatch.position = position;
    findmatch.pageSize = pageSize;
    findmatch.sortcolumn = sortcolumn;
    findmatch.sortdirection = sortdirection

    OBDCampaign.searchcampaigncalllog(findmatch, function (err, data) {
        console.log(err);
        if (err) {
            res.status(200).send({ 'payload': [] });
        }   
        res.status(200).send({ 'payload': data });
    });
});
//get campaign call log from campaign id
router.post('/searchCampaignCallLog', authorize, function (req, res) {
    //console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    OBDCampaign.searchcampaigncallloglength(req.body, function (err, data) {
        console.log(err);
        if (err) {
            //res.status(400).json(err);
            res.send({ 'data': [] });
        }
        // console.log(data)
        res.send({ 'data': data });
    });
});

router.get('/deleteobdcampaingn/:id', function (req, res) {
    OBDCampaign.deleteobdcampaingn(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!!' });
        }
        else {
            res.status(200).send({ "data": 'OBD Campaign deleted succesfully.' });
        }
    })
})
router.post('/changecampaignaction', authorize, function (req, res) {
    //console.log(req.body);
    var camid = req.body.camid;
    var action = req.body.action;
    data = { camid: camid, cam_action: action };
    OBDCampaign.updatecampaign(data, function (err, data) {
        console.log(err);
        if (err) {
            res.send({ 'data': [] });
        } 
        res.send({ 'data': data });
    });
});
router.post('/obdcampaigncalloglength', authorize, function (req, res) {
    //console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    OBDCampaign.obdcampaigncalloglength(req.body, function (err, data) {
        console.log(err);
        if (err) {
            res.send({ 'data': [] });
        }
        // console.log(data)
        res.send({ 'data': data });
    });
});
//Re Generate Campaign
router.post('/regenerateobdcampaign', authorize, async function (req, res) {
    var m = new Date();
    var camid = 'CON' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var generatetype = req.body.generatetype;
    var customer_id = req.body.customer_id;
    var startdate = new Date();
    var date = startdate
    var campaignname = req.body.campaignname;
    var camtype = req.body.campaigntype;
    var cam_method = req.body.campaignmethod;
    var camagrp = req.body.agentgroup;
    var cam_agents = req.body.agents;
    var cam_did = req.body.did;
    var ivrid = req.body.ivr;
    var totalagent = req.body.totalagent;
    var dialertype = req.body.dialertype ? req.body.dialertype : 0;
    var feedbackform = req.body.feedbackform;
    var retryunansweredcall = req.body.retryunansweredcall;
    var retrytime = req.body.retrytime;
    var maxretry = req.body.maxretry;
    
    var campaigndata = {
        'create_date': date, 'cam_name': campaignname, 'cam_type': camtype,
        'cam_method': cam_method, 'cam_agentgroup': camagrp, 'retry': retryunansweredcall, 'retrytime': retrytime, 'maxretry': maxretry,
        cam_ivrid: ivrid, 'account_id': customer_id, 'cam_status': '0', 'dialer_type': dialertype, 'cam_feedback_form': feedbackform, 'totalagent': totalagent
    };
    //console.log(campaigndata)
    var managerbalance = await helper.GetManagerBalance(customer_id)
    if (cam_method == 1 && managerbalance['OBD_User_Balance'] <= 0) {
        return res.json({ 'data': 'You have not sufficient OBD balance.' });
    } else {
        if (generatetype == 0) {
            var camid = campaignname;
            assigndidtocampaign(camid,customer_id)
            assigncontacttocampaign(camid, req.body)
            res.json({ 'data': 'Campaign created sucessfully.', 'camid': camid });
        } else {
            OBDCampaign.createcampaign(campaigndata, function (err, result) {
                if (err) {
                    res.json({ 'data': 'Something went wrong!' });
                }
                else {
                    var camid = result.insertId;
                    // assigndidtocampaign(camid,customer_id)
                    if (req.body.did && cam_did.length > 0) {
                        bulknumarray = [];
                        console.log(req.body.did)
                        async.forEachOf(cam_did, async (did, key, callback) => {
                            numberdata = [camid, customer_id, did];
                            bulknumarray.push(numberdata)
                        })
                        Contacts.insertbulkcamdid(bulknumarray, function (err, count) {
                            if (err) {
                                console.log(err);
                            } else {
    
                            }
                        })
                    }
                    assigncontacttocampaign(camid, req.body)
                    res.json({ 'data': 'Campaign created sucessfully.', 'camid': camid });
                }
            });
        }
    }
});
router.get('/getobdcampaigncallsummary/:id', authorize, function (req, res) {
    var id = req.params.id;
    OBDCampaign.getobdcampaigncallsummary(id, function (err, data) {
        console.log(err);
        if (err) {
            res.send({ 'data': [] });
        }
        //console.log("data"+JSON.stringify(data));
        res.send({ 'data': data });
    });
});
//get campaign detail from campaign id
router.get('/getcampaigndetail/:id', authorize, function (req, res) {
    var id = req.params.id;
    OBDCampaign.getcampaigndetail(id, function (err, data) {
        console.log(err);
        if (err) {
            res.send({ 'data': [] });
        }
        //console.log("data"+JSON.stringify(data));
        res.send({ 'data': data });
    });
});

router.get('/getobdcampaignratedate/:id', authorize, function (req, res) {
    var id = req.params.id;
    var rates = [];
    var value;
    OBDCampaign.getobdcampaignratedate(id, function (err, data) {
        //console.log(err);
        if (err) {
            res.send({ 'data': [] });
        }
        res.send({ 'data': data });
    });
});



function assigncontacttocampaign(camid, filter) {
    var sortcolumn = 'CallStartTime';
    var sortdirection = 'DESC';
    findmatch = {}
    //console.log(filter);
    var startdateObj = new Date(filter.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    findmatch.startdate = startdate;
    var enddateObj = new Date(filter.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    findmatch.enddate = enddate;
    findmatch.campaignid = filter.campaignid;
    findmatch.status = filter.status;
    findmatch.agentid = filter.agentid;
    findmatch.callerno = filter.callerno;
    findmatch.calltype = filter.calltype;
    findmatch.callername = filter.callername;
    findmatch.extension = filter.extension;
    findmatch.sortcolumn = sortcolumn;
    findmatch.sortdirection = sortdirection
    OBDCampaign.searchcampaigncallogdata(findmatch, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            if (data.length > 0) {
                var cnt = 1;
                var total = data.length;
                var agid = 0
                if (filter.campaigntype == 1 && filter.agents.length > 0) {
                    agid = filter.agents[0]
                }
                bulknumarray = [];
                async.forEachOf(data, async (num, key, callback) => {
                    numberdata = [camid, num.account_id, num.cont_id, agid, num.segment_id];
                    bulknumarray.push(numberdata)
                })
                // console.log(bulknumarray)
                OBDCampaign.insertbulkcamnumber(bulknumarray, function (err, count) {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        }
    });
}

async function assigndidtocampaign(camid,customer_id){
    bulkdidarray = [];
    const did = await helper.CheckAdminSetting('obd_agent_did')
    var diddata = [camid, customer_id, did];
    bulkdidarray.push(diddata)
    Contacts.insertbulkcamdid(bulkdidarray, function (err, count) {
        if (err) {
            console.log(err);
        } else {

        }
    })
}
//get campaign agent from campaign id
router.get('/getobdcampaignagent/:id', authorize, function (req, res) {
    var id = req.params.id;
    OBDCampaign.getobdcampaignagent(id, function (err, data) {
        console.log(err);
        if (err) {
            res.send({ 'data': [] });
        }
        //console.log("data"+JSON.stringify(data));
        res.send({ 'data': data });
    });
});









module.exports = router;