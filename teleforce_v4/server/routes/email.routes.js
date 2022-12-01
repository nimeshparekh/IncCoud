
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
var Email = require('../model/email');
const authorize = require("../middlewares/auth");
var async = require("async");
var Openemm = require('../model/openemm');
var helper = require("../helper/common");
var request = require('request');
var ERP = require('../model/erp');

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

router.post('/getemailcampaignsdata', authorize, function (req, res) {
    if (req.body.startdate) {
        var startdateObj = new Date(req.body.startdate);
        req.body.startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    } else {
        req.body.startdate = '';
    }
    if (req.body.enddate) {
        var startdateObj1 = new Date(req.body.enddate);
        req.body.enddate = startdateObj1.getFullYear() + '-' + ('0' + (startdateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj1.getDate()).slice(-2);
    } else {
        req.body.enddate = '';
    }
 req.body.account_id = req.query.tknuserid;
    Email.getemailcampaignsdata(req.body, function (err, rows) {
        //console.log(rows);
        if (err) {
            res.status(200).send({ 'data': [] });
        }
        else {
            res.status(200).send({ 'data': rows });
        }
    });
});
router.post('/saveemailcampagin', authorize, async function (req, res) {
    var leadstatusArr = req.body.lead_status;
    // var emm_segmetid = await helper.GetEmmSegmentId(segmentid)
    var cam_name = req.body.cam_name;
    var sendername = req.body.sendername;
    var senderaddress = req.body.senderaddress + '@' + process.env.OPENEMMDOMAIN;
    var replyname = req.body.replyname;
    var replyaddress = req.body.replyaddress;
    var templateid = req.body.template;
    var dates = req.body.startdate;
    var cam_date = dates;
    var cam_status = "0";
    var cam_type = "1"//Pramotional
    var name = req.body.name;
    var account_id = req.query.tknuserid;
    if (leadstatusArr.length > 0) {
        var fdata = { cam_status: cam_status, cam_type: cam_type, cam_name: cam_name, sendername: sendername, senderaddress: senderaddress, replyname: replyname, replyaddress: replyaddress, cam_temp_id: templateid, cam_date: formatDate(cam_date), account_id: account_id };
        console.log(fdata);
        var mailinglistname = cam_name + ' ' + account_id
        var emm_mailinglist = await helper.GetEmmMalingListId(mailinglistname)
        if (templateid > 0 && emm_mailinglist > 0) {
            Email.getemailtemplatebyid(templateid, function (err, rows) {
                if (err) {
                    console.log(err)
                    res.json({ 'data': 'Something went wrong!' });
                } else {
                    var subject = rows[0]['email_subject']
                    var html = rows[0]['email_html']
                    html = html +
                        ' <div class="v-text-align" style="line-height: 140%; text-align: left; word-wrap: break-word;">' +
                        '<p style="font-size: 14px; line-height: 140%; text-align: center;"><strong><span style="color: #000000; font-size: 14px; line-height: 19.6px;"><a style="color: #000000;" href="[agnUNSUBSCRIBE/]">Unsubscribe</a></span></strong></p> </div>';
                    //REST API OPENEMM
                    var options = {
                        'method': 'POST',
                        'url': process.env.OPENEMMRESTAPI + 'mailing?username=' + process.env.OPENEMMRESTUSERNAME + '&password=' + process.env.OPENEMMRESTPASSWORD,
                        'headers': {
                            'Content-Type': 'application/json'
                        },
                        json: {
                            "version": "1.1.0",
                            "company_id": 1,
                            "shortname": cam_name,
                            "description": cam_name,
                            "mailinglist_id": emm_mailinglist,
                            "mailingtype": "NORMAL",
                            "mediatypes": [
                                {
                                    "type": "EMAIL",
                                    "priority": 1,
                                    "status": "Active",
                                    "subject": subject,
                                    "from_address": senderaddress,
                                    "from_fullname": sendername,
                                    "reply_address": replyaddress,
                                    "reply_fullname": replyname,
                                    "charset": "UTF-8",
                                    "mailformat": "HTML",
                                    "onepixel": "top",
                                    "linefeed": 72
                                }
                            ],
                            "components": [
                                {
                                    "name": "agnHtml",
                                    "type": "Template",
                                    "emm_block": "[agnDYN name=\"emailHtml\"/]",
                                    "mimetype": "text/html"
                                },
                                {
                                    "name": "agnText",
                                    "type": "Template",
                                    "emm_block": "[agnDYN name=\"emailText\"/]",
                                    "mimetype": "text/plain"
                                },
                                // {
                                //     "name": "attachment1",
                                //     "type": "Attachment",
                                //     "mimetype": "application/pdf",
                                //     "bin_block":""
                                // }
                            ],
                            "contents": [
                                {
                                    "name": "emailHtml",
                                    "disableLinkExtension": false,
                                    "content": [
                                        {
                                            "order": 1,
                                            "text": html
                                        }
                                    ]
                                },
                                {
                                    "name": "emailText",
                                    "disableLinkExtension": false,
                                    "content": [
                                        {
                                            "order": 1,
                                            "text": "content"
                                        }
                                    ]
                                }
                            ],

                        }
                    };
                    request(options, function (error, response) {
                        if (error) {
                            console.log(error)
                            res.json({ 'data': 'Something went wrong!' });
                        } else {
                            console.log(response.body);
                            const emmid = response.body.mailing_id
                            var camid = 0
                            if (emmid > 0) {
                                fdata.emm_mailingid = emmid;
                                Email.savecampagin(fdata, function (err, rows) {
                                    if (err) {
                                        console.log(err);
                                        res.json({ 'data': 'Something went wrong!' });
                                    }
                                    else {
                                        camid = rows.insertId;
                                        Email.getLeadListbyStatus(account_id, leadstatusArr, function (err, rows) {
                                            var total = rows.length;
                                            async.forEachOf(rows, async (lead, key, callback) => {
                                                var nowdate = new Date()
                                                const emmdata = { email: lead.email, firstname: lead.name, mailinglist_id: emm_mailinglist, creation_date: nowdate }
                                                const emmcustid = await Openemm.insertcustomerdata(emmdata)
                                                const mdata = { cid: camid, emm_cid: emmcustid, account_id: account_id, name: lead.name, email_status: 0, date: nowdate, emailid: lead.email, cont_id: lead.cont_id };
                                                Email.updatecontactemmid(emmcustid, lead.cont_id, async function (err, count) { })
                                                Email.insertbulkemailcampaigncontact(mdata, async function (err, count) {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        var c_numid = count.insertId;
                                                        //Update Lead Timeline
                                                        var timeline = {}
                                                        timeline.agent_id = lead.agent_id
                                                        timeline.account_id = lead.User_id
                                                        timeline.lead_id = lead.l_id
                                                        timeline.current_status = lead.status
                                                        timeline.notes = 'Email - ' + subject
                                                        timeline.action_type = 'email'
                                                        timeline.action_id = c_numid
                                                        console.log(timeline);
                                                        ERP.add_timeline_lead(timeline, function (err, rows2) { })
                                                    }
                                                })
                                                console.log(total, '==', key + 1)
                                                if (total == key + 1) {
                                                    var options = {
                                                        'method': 'PUT',
                                                        'url': process.env.OPENEMMRESTAPI + 'mailing/' + emmid + '?username=' + process.env.OPENEMMRESTUSERNAME + '&password=' + process.env.OPENEMMRESTPASSWORD,
                                                        'headers': {
                                                            'Content-Type': 'application/json'
                                                        },
                                                        json: {
                                                            "shortname": cam_name,
                                                            "mailinglist_id": emm_mailinglist
                                                        }
                                                    };
                                                    request(options, function (error, response) {
                                                        if (error) {
                                                            console.log(error)
                                                        } else {
                                                            console.log(response.body);
                                                            console.log('cam_date == ', cam_date);
                                                            var options = {
                                                                'method': 'POST',
                                                                'url': process.env.OPENEMMRESTAPI + 'send/' + emmid + '?username=' + process.env.OPENEMMRESTUSERNAME + '&password=' + process.env.OPENEMMRESTPASSWORD,
                                                                'headers': {
                                                                    'Content-Type': 'application/json'
                                                                },
                                                                json: {
                                                                    "send_type": "W",
                                                                    "send_date": cam_date,
                                                                }
                                                            };
                                                            request(options, function (error, response) {
                                                                if (error) {
                                                                    console.log(error)
                                                                } else {
                                                                    console.log('emm send response', response.body);
                                                                    Email.updatecampaign({ scheduled: 1 }, camid)
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            })
                                        })
                                        res.status(200).send({ "data": "Campaign created sucessfully" });
                                    }
                                })
                            } else {
                                res.json({ 'data': 'Something went wrong!' });
                            }
                        }
                    });
                }
            })
        } else {
            res.json({ 'data': 'No template selected!' });
        }
    } else {
        res.json({ 'data': 'No lead status selected!' });
    }
});

router.post('/getemailtemplatedata', authorize, function (req, res) {
    Email.getemailtemplatedata(req.query.tknuserid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getcampaigndetail/:id', authorize, function (req, res) {
    var id = req.params.id;
    Email.getcampaigndetail(id, req.query.tknuserid, function (err, rows) {
        if (err) {
            res.status(200).send({ 'data': [] });
        }
        else {
            if (rows.length > 0) {
                res.status(200).send({ 'data': rows });
            } else {
                res.status(200).send({ 'data': [] });
            }
        }
    });
});

router.post('/searchCampaignEmailLog', authorize, function (req, res) {
    console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = req.body.startdate ? startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2) : '';
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = req.body.enddate ? enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2) : '';
    req.body.enddate = enddate;

    Email.searchcampaignlog(req.body, function (err, data) {
        console.log(err);
        if (err) {
            res.send({ 'data': [] });
        } else {
            // console.log(data)
            res.send({ 'data': data });
        }
    });
});

router.post('/CampaignEmailLog', authorize, function (req, res) {
    filter = req.body.filter;
    sortcolumn = req.body.sortcolumn;
    sortdirection = req.body.sortdirection;

    findmatch = {}
    //console.log(filter);
    var startdateObj = new Date(filter.startdate);
    var startdate = filter.startdate ? startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2) : '';
    findmatch.startdate = startdate;
    var enddateObj = new Date(filter.enddate);
    var enddate = filter.enddate ? enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2) : '';
    findmatch.enddate = enddate;
    findmatch.campaignid = filter.campaignid;
    findmatch.name = filter.name;
    findmatch.status = filter.status;
    findmatch.email = filter.email
    var pageNumber = parseInt(req.body.pageNumber);
    var pageSize = parseInt(req.body.pageSize);
    var position = pageNumber * pageSize;
    findmatch.position = position;
    findmatch.pageSize = pageSize;
    findmatch.sortcolumn = sortcolumn;
    findmatch.sortdirection = sortdirection
    Email.searchcampaignemaillog(findmatch, function (err, data) {
        console.log(err);
        if (err) {
            res.status(200).json(err);
        }
        res.status(200).send({ 'payload': data });
    });
});
router.post('/getcampaignsummary', authorize, function (req, res) {
    var campaignid = req.body.campaignid
    var userid = req.query.tknuserid
    Email.getcampaignsummary(campaignid, userid, function (err, rows) {
        if (err) {
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/getemaillog/', authorize, function (req, res) {
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = req.body.startdate ? dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2) : '';
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = req.body.enddate ? dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2) : '';
    Email.getemailloglength(req.body, function (err, rows) {
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
router.post('/searchemaillogdata', authorize, function (req, res) {
    //console.log("data", req.body);
    user_id = req.body.user_id;
    filter = req.body.filter;
    sortcolumn = req.body.sortcolumn;
    sortdirection = req.body.sortdirection;
    var pageNumber = parseInt(req.body.pageNumber);
    var pageSize = parseInt(req.body.pageSize);
    var position = pageNumber * pageSize
    findmatch = filter
    findmatch.position = position;
    findmatch.pageSize = pageSize;
    if (filter.startdate) {
        var startdateObj = new Date(filter.startdate);
        findmatch.startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    } else {
        findmatch.startdate = '';
    }
    if (filter.enddate) {
        var startdateObj1 = new Date(filter.enddate);
        findmatch.enddate = startdateObj1.getFullYear() + '-' + ('0' + (startdateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj1.getDate()).slice(-2);
    } else {
        findmatch.enddate = '';
    }
    findmatch.cid = filter.customer_id
    findmatch.sortcolumn = sortcolumn;
    findmatch.sortdirection = sortdirection;
    Email.searchemaillogdata(findmatch, function (err, contacts_data) {
        if (err) {
            res.status(200).send({ 'payload': [] });
        }
        //console.log(contacts_data);
        res.status(200).send({ 'payload': contacts_data });
    })
});

router.post('/regenerateemailcampagin', authorize, async function (req, res) {
    // var emm_segmetid = await helper.GetEmmSegmentId(segmentid)
    var cam_name = req.body.cam_name;
    var sendername = req.body.sendername;
    var senderaddress = req.body.senderaddress + '@' + process.env.OPENEMMDOMAIN;
    var replyname = req.body.replyname;
    var replyaddress = req.body.replyaddress;
    var templateid = req.body.template;
    var dates = req.body.startdate;
    var cam_date = dates;
    var cam_status = "0";
    var cam_type = "1"//Pramotional
    var name = req.body.name;
    var account_id = req.query.tknuserid;

    var fdata = { cam_status: cam_status, cam_type: cam_type, cam_name: cam_name, sendername: sendername, senderaddress: senderaddress, replyname: replyname, replyaddress: replyaddress, cam_temp_id: templateid, cam_date: formatDate(cam_date), account_id: account_id };
    console.log(fdata);
    var mailinglistname = cam_name + ' ' + account_id
    var emm_mailinglist = await helper.GetEmmMalingListId(mailinglistname)
    if (templateid > 0 && emm_mailinglist > 0) {
        Email.getemailtemplatebyid(templateid, function (err, rows) {
            if (err) {
                console.log(err)
                res.json({ 'data': 'Something went wrong!' });
            } else {
                var subject = rows[0]['email_subject']
                var html = rows[0]['email_html']
                html = html +
                    ' <div class="v-text-align" style="line-height: 140%; text-align: left; word-wrap: break-word;">' +
                    '<p style="font-size: 14px; line-height: 140%; text-align: center;"><strong><span style="color: #000000; font-size: 14px; line-height: 19.6px;"><a style="color: #000000;" href="[agnUNSUBSCRIBE/]">Unsubscribe</a></span></strong></p> </div>';
                //REST API OPENEMM
                var options = {
                    'method': 'POST',
                    'url': process.env.OPENEMMRESTAPI + 'mailing?username=' + process.env.OPENEMMRESTUSERNAME + '&password=' + process.env.OPENEMMRESTPASSWORD,
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    json: {
                        "version": "1.1.0",
                        "company_id": 1,
                        "shortname": cam_name,
                        "description": cam_name,
                        "mailinglist_id": emm_mailinglist,
                        "mailingtype": "NORMAL",
                        "mediatypes": [
                            {
                                "type": "EMAIL",
                                "priority": 1,
                                "status": "Active",
                                "subject": subject,
                                "from_address": senderaddress,
                                "from_fullname": sendername,
                                "reply_address": replyaddress,
                                "reply_fullname": replyname,
                                "charset": "UTF-8",
                                "mailformat": "HTML",
                                "onepixel": "top",
                                "linefeed": 72
                            }
                        ],
                        "components": [
                            {
                                "name": "agnHtml",
                                "type": "Template",
                                "emm_block": "[agnDYN name=\"emailHtml\"/]",
                                "mimetype": "text/html"
                            },
                            {
                                "name": "agnText",
                                "type": "Template",
                                "emm_block": "[agnDYN name=\"emailText\"/]",
                                "mimetype": "text/plain"
                            },
                            // {
                            //     "name": "attachment1",
                            //     "type": "Attachment",
                            //     "mimetype": "application/pdf",
                            //     "bin_block":""
                            // }
                        ],
                        "contents": [
                            {
                                "name": "emailHtml",
                                "disableLinkExtension": false,
                                "content": [
                                    {
                                        "order": 1,
                                        "text": html
                                    }
                                ]
                            },
                            {
                                "name": "emailText",
                                "disableLinkExtension": false,
                                "content": [
                                    {
                                        "order": 1,
                                        "text": "content"
                                    }
                                ]
                            }
                        ],

                    }
                };
                request(options, function (error, response) {
                    if (error) {
                        console.log(error)
                        res.json({ 'data': 'Something went wrong!' });
                    } else {
                        console.log(response.body);
                        const emmid = response.body.mailing_id
                        var camid = 0
                        if (emmid > 0) {
                            fdata.emm_mailingid = emmid;
                            Email.savecampagin(fdata, function (err, rows) {
                                if (err) {
                                    console.log(err);
                                    res.json({ 'data': 'Something went wrong!' });
                                }
                                else {
                                    camid = rows.insertId;
                                    //console.log(req.body.filterdata);
                                    //req.body.filterdata.account_id=req.query.tknuserid;
                                    Email.getregenerateemaillogdata(req.body.filterdata, function (err, rows) {
                                        var total = rows.length;
                                        async.forEachOf(rows, async (lead, key, callback) => {
                                            var nowdate = new Date()
                                            const emmdata = { email: lead.emailid, firstname: lead.name, mailinglist_id: emm_mailinglist, creation_date: nowdate }
                                            const emmcustid = await Openemm.insertcustomerdata(emmdata)
                                            const mdata = { cid: camid, emm_cid: emmcustid, account_id: account_id, name: lead.name, email_status: 0, date: nowdate, emailid: lead.emailid, cont_id: lead.cont_id };
                                            Email.updatecontactemmid(emmcustid, lead.cont_id, async function (err, count) { })
                                            Email.insertbulkemailcampaigncontact(mdata, async function (err, count) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    var c_numid = count.insertId;
                                                    //Update Lead Timeline
                                                    var timeline = {}
                                                    //timeline.agent_id = lead.agent_id
                                                    timeline.account_id = lead.account_id
                                                    timeline.lead_id = lead.lead_id
                                                    timeline.current_status = lead.status
                                                    timeline.notes = 'Email - ' + subject
                                                    timeline.action_type = 'email'
                                                    timeline.action_id = c_numid
                                                    console.log(timeline);
                                                    ERP.add_timeline_lead(timeline, function (err, rows2) { })
                                                }
                                            })
                                            console.log(total, '==', key + 1)
                                            if (total == key + 1) {
                                                var options = {
                                                    'method': 'PUT',
                                                    'url': process.env.OPENEMMRESTAPI + 'mailing/' + emmid + '?username=' + process.env.OPENEMMRESTUSERNAME + '&password=' + process.env.OPENEMMRESTPASSWORD,
                                                    'headers': {
                                                        'Content-Type': 'application/json'
                                                    },
                                                    json: {
                                                        "shortname": cam_name,
                                                        "mailinglist_id": emm_mailinglist
                                                    }
                                                };
                                                request(options, function (error, response) {
                                                    if (error) {
                                                        console.log(error)
                                                    } else {
                                                        console.log(response.body);
                                                        console.log('cam_date == ', cam_date);
                                                        var options = {
                                                            'method': 'POST',
                                                            'url': process.env.OPENEMMRESTAPI + 'send/' + emmid + '?username=' + process.env.OPENEMMRESTUSERNAME + '&password=' + process.env.OPENEMMRESTPASSWORD,
                                                            'headers': {
                                                                'Content-Type': 'application/json'
                                                            },
                                                            json: {
                                                                "send_type": "W",
                                                                "send_date": cam_date,
                                                            }
                                                        };
                                                        request(options, function (error, response) {
                                                            if (error) {
                                                                console.log(error)
                                                            } else {
                                                                console.log('emm send response', response.body);
                                                                Email.updatecampaign({ scheduled: 1 }, camid)
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        })
                                    })
                                    res.status(200).send({ "data": "Campaign created sucessfully" });
                                }
                            })
                        } else {
                            res.json({ 'data': 'Something went wrong!' });
                        }
                    }
                });
            }
        })
    } else {
        res.json({ 'data': 'No template selected!' });
    }
});




//searchemailcountgraph
router.post('/searchemailcountgraph/', authorize, function (req, res) {
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = req.body.startdate?dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2):'';
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = req.body.enddate?dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2):'';
    req.body.userid = req.query.tknuserid;
    Email.searchemailcountgraph(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data":  [] });

        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    })
})

router.post('/redirect_email_to_lms', authorize, function (req, res) {
    var userid = req.query.tknuserid
    var email_id = req.body.email;

    Email.redirect_email_to_lms(email_id,userid, function (err, rows) {
        if (err) {
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    })
})
module.exports = router;