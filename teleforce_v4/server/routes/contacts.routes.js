var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
var Contacts = require('../model/Contacts');
var Manager = require('../model/manager');
var parseurl = require('parseurl');
var request = require('request');
// var busboy = require("connect-busboy");
var path = require('path');     //used for file path
var fs = require('fs-extra');
const csv = require('csvtojson');
var session = require('express-session');
const multer = require('multer');
const mime = require('mime');
const authorize = require("../middlewares/auth");
var async = require("async");
var json2xls = require('json2xls');
var helper = require("../helper/common");
const { Parser } = require('json2csv');


router.post('/getallcontact/:id', authorize, function (req, res) {
    pageNumber = parseInt(req.body.pageNumber);
    pageSize = parseInt(req.body.pageSize);
    position = pageNumber * pageSize
    //console.log(req.params.id)
    Contacts.getContact(req.params.id, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        res.status(200).send({ 'payload': data });

        // res.send({ 'count': cont1.length, 'data': cont1});

        // var cont1 = data;
        // if (cont1 != null){

        //     var i;
        //     var temp = [];
        //     for(i=0;i<data.length;i++){
        //         temp.push(data[i]["category"]);
        //         Contacts.AllContactCategoryid(data[i]["category"], function (err, data) {
        //             if (err) {
        //                 res.status(400).json(err);
        //             }
        //             var i;
        //             var temp1 = [];
        //             for(i=0;i<data.length;i++){
        //                 temp1.push(data[i]["name"]);

        //             }
        //             console.log("cont_id done :"+JSON.stringify(temp1))
        //             res.send({ 'count': cont1.length, 'data': cont1 , 'segment' :{"name":temp1}});

        //         })
        //     }

        // }





    })
});





router.get('/getallc/:id', authorize, function (req, res) {
    Contacts.getContactbyCategory(req.params.id, function (err, data) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).send({ "data": data });
        }
    });
});

router.post('/createcontact', authorize, async function (req, res) {
    let data = req.body;
    var m = new Date();
    var cont_id = 'CON' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    req.body.cont_id = cont_id;
    req.body.created_date = m;
    var mobile = req.body.mobile
    var name = req.body.name;
    var userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    var agentid = 0
    //req.body.created_by = userid;
    if (userrole == 1) {
        req.body.created_by = userid
        agentid = userid
        var managerid = await helper.GetManagerIdByAgent(userid)
    } else {
        var managerid = userid
    }
    let is_lead = req.body.is_lead;
    if (is_lead == 'yes') {
        req.body.lead_source = req.body.source?req.body.source:'Call';
        if (data.lead_id > 0) { } else {
            req.body.lead_id = await helper.GenerateManualLead(data, managerid, agentid)
        }
    }
    req.body.customer_id = managerid;
    var extraitems = req.body.items
    delete req.body.agentrole
    delete req.body.items
    delete req.body.is_lead
    delete req.body.source
    //console.log(req.body)
    Contacts.createcontact(req.body, function (err, result) {
        console.log(err)
        if (err) {
            res.json({ 'msg': 'Something went wrong!' });
        }
        else {
            Contacts.getLastContact(req.body.customer_id, function (err, rdata) {
                console.log(err)
                if (err) {
                    res.json({ 'msg': 'Something went wrong!' });
                } else {
                    var conid = rdata[0].cont_id
                    //console.log(rdata);
                    if (extraitems != undefined && extraitems.length > 0) {
                        extraitems.forEach(item => {
                            //console.log(item.otherkey + "====" + item.othervalue + "====" + conid)
                            helper.SaveContactMeta(item.otherkey, item.othervalue, conid, managerid)
                        });
                    }
                    helper.UpdateCallHistoryByMobile(name, mobile, managerid)
                    res.json({ 'msg': 'Contact added sucessfully!' });
                }
            })

        }
    });
});

router.get('/delete/:cont_id', authorize, function (req, res) {
    //console.log(req.params.cont_id);
    Contacts.deleteContact(req.params.cont_id, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json({ 'msg': 'Contact deleted successfully!' });
        }
    });
});

router.post('/update', authorize, async function (req, res) {
    let data = req.body;
    var mobile = req.body.mobile
    var userid = req.query.tknuserid;
    var name = req.body.name;
    var userrole = req.query.tknuserrole;
    var agentid = 0
    if (userrole == 1) {
        req.body.created_by = userid
        agentid = userid
        var managerid = await helper.GetManagerIdByAgent(userid)
    } else {
        var managerid = userid
    }
    let cont_id = req.body.cont_id;
    let is_lead = req.body.is_lead;
    //console.log(req.body);
    if (is_lead == 'yes') {
        //data.lead_source = 'Call'
        data.lead_source = data.source?data.source:'Call';
        //if (data.lead_id > 0) { } else {
            data.lead_id = await helper.GenerateManualLead(data, managerid, agentid)
        //}
    }
    delete data.cont_id;
    delete data.agentrole;
    var extraitems = data.items
    delete data.items
    delete data.is_lead
    delete data.source
    Contacts.updateContact(data, cont_id, function (err, count) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        else {
            var conid = cont_id
            if (extraitems != undefined && extraitems.length > 0) {
                extraitems.forEach(item => {
                    //console.log(item.otherkey + "====" + item.othervalue)
                    helper.SaveContactMeta(item.otherkey, item.othervalue, conid, managerid)
                });
            }
            helper.UpdateCallHistoryByMobile(name, mobile, managerid)
            res.json({ 'msg': 'Contact Updated sucessfully!' });
        }

    });

});

router.get('/getcontactdetail/:id', authorize, async function (req, res) {
    Contacts.getContactDetail(req.params.id, async function (err, rows) {
        if (err) {
            res.status(200).send({ 'data': [] });
        }
        else {
            var metadata = []
            if (rows.length > 0) {
                conid = rows[0].cont_id
                metadata = await helper.GetContactAllMeta(conid)
                rows[0]['metadata'] = metadata
            }
            //console.log(rows[0])
            res.status(200).send({ 'data': rows[0] });
        }
    });
});


router.get('/getCategorylist/:id', authorize, async function (req, res) {
    var userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    //console.log(userrole);
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
    } else {
        var managerid = userid
    }
    Contacts.AllContactCategory(managerid, function (err, data) {
        //console.log(data);
        if (err) {
            res.status(400).json(err);
        } else {
            res.send({ 'data': data });
        }
    });
});

router.get('/getdefaultcategory/:id', authorize, async function (req, res) {
    var userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    //console.log(userrole);
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
    } else {
        var managerid = userid
    }
    Contacts.getdefaultcategory(managerid, function (err, data) {
        //console.log(data);
        if (err) {
            res.status(400).json(err);
        } else {
            res.send({ 'data': data });
        }
    });
});


router.get('/filedata/:id', authorize, function (req, res) {
    Contacts.BulkFiledatabycustomer(req.params.id, function (err, data) {
        //console.log(data);
        if (err) {
            res.status(400).json(err);
        }
        var i;
        var temp1 = [];
        for (i = 0; i < data.length; i++) {
            temp1.push(data[i]["finish_time"]);
        }
        res.send({ 'data': data, 'count': temp1 });
    });
});

router.get('/agentfiledata/:id', authorize, function (req, res) {
    Contacts.BulkFileagentdatabycustomer(req.params.id, function (err, data) {
        //console.log(data);
        if (err) {
            res.status(400).json(err);
        }
        var i;
        var temp1 = [];
        for (i = 0; i < data.length; i++) {
            temp1.push(data[i]["finish_time"]);

        }
        res.send({ 'data': data, 'count': temp1 });
    });
});

router.get('/getFilelist', authorize, function (req, res) {
    Contacts.AllFiledata('0', function (err, data) {
        if (err) {
            res.status(400).json(err);
        } else {

            var i;
            var temp = [];
            for (i = 0; i < data.length; i++) {
                temp.push(data[i]["file_name"]);
            }
            var file_p = temp[0];
            var temp_i = [];
            for (i = 0; i < data.length; i++) {
                temp_i.push(data[i]["customer_id"]);
            }
            var file_cus = temp_i[0];
            var temp_s = [];
            for (i = 0; i < data.length; i++) {
                temp_s.push(data[i]["segment"]);
            }
            var file_seg = temp_s[0];
            var temp_f = [];
            for (i = 0; i < data.length; i++) {
                temp_f.push(data[i]["fid"]);
            }
            var file_fid = temp_f[0];

            var status = '1';
            let data_a = ({ "status": status })
            let cont_id = file_fid;
            //console.log("cont_id: " + data_a);
            Contacts.updateStatus(data_a, cont_id, function (err, count) {
                if (err) {
                    res.status(400).json(err);
                }
                else {

                    //console.log("Status will be change Pending")

                    var csv_headers_format = [
                        'name',
                        'email',
                        'mobile',
                        'address',
                        'city',
                        'state',
                        'is_mobile_dnd'
                    ]

                    const csvFilePath = './uploads/contacts/csv/' + file_p
                    csv()
                        .fromFile(csvFilePath)
                        .then((jsonObj) => {
                            var json_keys = Object.keys(jsonObj[0]);
                            if (JSON.stringify(json_keys) != JSON.stringify(csv_headers_format)) {
                                return res.status(200).send({ 'msg': 'CSV file format is not valid, Download the sample file for reference.', 'created': false });
                            }
                            bulkUpdateOps = [];
                            async.forEachOf(jsonObj, async (obj, key, callback) => {
                                if (obj['is_mobile_dnd'] == '' || obj['is_mobile_dnd'] != 'yes') {
                                    var dnd = 'no';
                                } else {
                                    var dnd = obj['is_mobile_dnd'].toLowerCase();
                                }
                                //console.log(obj['mobile_dnd'])
                                if (obj['email'] != '' || obj['mobile'] != '') {
                                    var m = new Date();
                                    var cont_id = 'CON' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds() + key + 1;
                                    contactdata = [cont_id, file_cus, obj['name'], obj['email'], obj['mobile'], obj['address'], obj['city'], obj['state'], m, file_seg, dnd];
                                    bulkUpdateOps.push(contactdata);
                                }
                            })
                            Contacts.insertbulkcontact(bulkUpdateOps, function (err, cont) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    //console.log("Contact Upload Done");
                                    req.body.status = '2';
                                    let data_b = req.body;
                                    Contacts.updateStatus(data_b, cont_id, function (err, count) {
                                        if (err) {
                                            res.status(400).json(err);
                                        }
                                        else {
                                            //console.log("Contact status Complate")
                                            return res.status(200).send({ 'msg': 'Contacts uploaded successfully.', 'created': true });
                                        }

                                    });
                                }
                            })
                        })
                }

            });

        }





    });
});

router.post('/upload', authorize, function (req, res) {
    if (!fs.existsSync(path.join(__dirname, '/../uploads/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/'), (err) => {
            if (err) {
                 console.error(err);
            }
        });
    }
    if (!fs.existsSync(path.join(__dirname, '/../uploads/contacts/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/contacts/'), (err) => {
            if (err) {
                 console.error(err);
            }
        });
    }
    //console.log(fs.existsSync(path.join(__dirname, '/../uploads/contacts/')));
    if (!fs.existsSync(path.join(__dirname, '/../uploads/contacts/csv/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/contacts/csv/'), (err) => {
            if (err) {
                 console.error(err);
            }
        });
    }
    var m = new Date();
    var fileid = 'CSV' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/contacts/csv')

        },
        filename: function (req, file, cb) {
            cb(null, fileid + '.' + mime.getExtension(file.mimetype))
        },
    })
    var upload = multer({ storage: storage }).single('image_files');
    upload(req, res, async function (err) {
        if (err) {
            console.log(err);
            return res.status(422).send("an Error occured");
        }
        else {
            // console.log(req)
            req.body.file_name = req.file.originalname;
            req.body.status = '0';
            req.body.file_path = 'contacts/csv/' + req.file.filename;
            req.body.segment = req.query.segment
            var userrole = req.query.tknuserrole;
            req.body.created_by = req.body.customer_id;
            if (userrole == 1) {
                req.body.customer_id = await helper.GetManagerIdByAgent(req.body.customer_id)
            }
            Contacts.addfilerequest(req.body, function (err, count) {
                console.log(err)
                if (err) {
                    res.status(400).json(err);
                }
                else {
                    res.json({ 'msg': 'File added sucessfully!' });
                }
            });

        }
    });

});

router.post('/submitdata', authorize, function (req, res) {


    var path = req.query.path;
    // console.log("start"+req.body.user_id)

    var csv_headers_format = [
        'name',
        'email',
        'mobile',
        'address',
        'city',
        'state',
        'is_mobile_dnd'
    ]

    var user_id = req.query.user_id;
    // console.log("start"+(req.query.user_id))
    var segment = req.body.segment;

    const csvFilePath = path;
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var json_keys = Object.keys(jsonObj[0]);
            if (JSON.stringify(json_keys) != JSON.stringify(csv_headers_format)) {
                return res.status(200).send({ 'msg': 'CSV file format is not valid, Download the sample file for reference.', 'created': false });
            }
            bulkUpdateOps = [];
            async.forEachOf(jsonObj, async (obj, key, callback) => {
                if (obj['is_mobile_dnd'] == '' || obj['is_mobile_dnd'] != 'yes') {
                    var dnd = 'no';
                } else {
                    var dnd = obj['is_mobile_dnd'].toLowerCase();
                }
                //console.log(obj['mobile_dnd'])
                if (obj['email'] != '' || obj['mobile'] != '') {
                    var m = new Date();
                    var cont_id = 'CON' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds() + key + 1;
                    contactdata = [cont_id, user_id, obj['name'], obj['email'], obj['mobile'], obj['address'], obj['city'], obj['state'], m, segment, dnd];
                    bulkUpdateOps.push(contactdata);
                }
            })
            Contacts.insertbulkcontact(bulkUpdateOps, function (err, cont) {
                if (err) {
                    console.log(err);
                } else {
                    return res.status(200).send({ 'msg': 'Contacts uploaded successfully.', 'created': true });
                }
            })
        })





});

function formatDate(date) {

    //console.log(date);
    var datearray = date.split(',');
    var d = new Date(datearray[0]),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

router.post('/createcampaign', authorize, async function (req, res) {
   // console.log(req.body);
    var m = new Date();
    var camid = 'CON' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    //console.log(req);
    var customer_id = req.body.customer_id;
    var startdate = req.body.startdate;
    var date = formatDate(startdate)
    var campaignname = req.body.campaignname;
    var ty = req.body.campaigntype;
    var met = req.body.campaignmethod;
    var camagrp = req.body.agentgroup;
    var cam_agents = req.body.agents;
    var cam_did = req.body.did;
    var cam_segment = req.body.segments;
    var ivrid = req.body.ivr;
    var totalagent = req.body.totalagent;
    var dialertype = req.body.dialertype ? req.body.dialertype : 0;
    var feedbackform = req.body.feedbackform;
    var retryunansweredcall = req.body.retryunansweredcall;
    var retrytime = req.body.retrytime;
    var maxretry = req.body.maxretry;
    var callratio = req.body.callratio;
    var campaigndata = {
        'create_date': date, 'cam_name': campaignname, 'cam_type': ty, 'call_ratio': callratio,
        'cam_method': met, 'cam_agentgroup': camagrp, 'retry': retryunansweredcall, 'retrytime': retrytime, 'maxretry': maxretry,
        cam_ivrid: ivrid, 'account_id': customer_id, 'cam_status': '0', 'dialer_type': dialertype, 'cam_feedback_form': feedbackform, 'totalagent': totalagent
    };
    var userrole = req.query.tknuserrole;
    var managerid = req.body.customer_id;
    var userid = req.body.customer_id;
    if (userrole == 1) {
        managerid = await helper.GetManagerIdByAgent(req.body.customer_id)
        campaigndata.account_id = managerid;
    }
    if (req.body.agentrole == "supervisor") {
        campaigndata.created_by = customer_id
    }
    //console.log(campaigndata)
    var managerbalance = await helper.GetManagerBalance(customer_id)
    if (met == 1 && managerbalance['OBD_User_Balance'] <= 0) {
        return res.json({ 'data': 'You have not sufficient OBD balance.' });
    } else {
        Contacts.createcampaign(campaigndata, function (err, result) {
            console.log(err)
            if (err) {
                res.status(400).json(err);
            }
            else {
                //console.log(result);
                camid = result.insertId;
                if (cam_segment.length > 0) {
                    async.forEachOf(cam_segment, async (cat, key, callback) => {
                        camdata = { category: cat, id: customer_id };
                        //console.log(camdata)
                        if (req.body.agentrole == "supervisor") {
                            Contacts.getContactbySupervisorSegment(camdata, function (err, data) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(data);
                                    var cnt = 1;
                                    var total = data.length;
                                    var agid = 0
                                    if (ty == 1 && cam_agents.length > 0) {
                                        agid = cam_agents[0]
                                    }
                                    bulknumarray = [];
                                    async.forEachOf(data, async (num, key, callback) => {
                                        numberdata = [camid, managerid, num.cont_id, agid, cat];
                                        bulknumarray.push(numberdata)
                                    })
                                    //console.log(bulknumarray)
                                    Contacts.insertbulkcamnumber(bulknumarray, function (err, count) {
                                        if (err) {
                                            console.log(err);
                                        } else {

                                        }
                                    })
                                }
                            });

                        } else {
                            Contacts.getContactbySegment(camdata, function (err, data) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    //console.log(data);
                                    var cnt = 1;
                                    var total = data.length;
                                    var agid = 0
                                    if (ty == 1 && cam_agents.length > 0) {
                                        agid = cam_agents[0]
                                    }
                                    bulknumarray = [];
                                    async.forEachOf(data, async (num, key, callback) => {
                                        numberdata = [camid, managerid, num.cont_id, agid, cat];
                                        bulknumarray.push(numberdata)
                                    })
                                    //console.log(bulknumarray)
                                    Contacts.insertbulkcamnumber(bulknumarray, function (err, count) {
                                        if (err) {
                                            console.log(err);
                                        } else {

                                        }
                                    })
                                }
                            });

                        }

                    })
                }
                if (req.body.agents && cam_agents.length > 0) {
                    bulknumarray = [];
                    async.forEachOf(cam_agents, async (agentid, key, callback) => {
                        numberdata = [camid, managerid, agentid];
                        bulknumarray.push(numberdata)
                    })
                    Contacts.insertbulkcamagents(bulknumarray, function (err, count) {
                        if (err) {
                            console.log(err);
                        } else {

                        }
                    })
                }
                if (req.body.did && cam_did.length > 0) {
                    bulknumarray = [];
                    async.forEachOf(cam_did, async (did, key, callback) => {
                        numberdata = [camid, managerid, did];
                        bulknumarray.push(numberdata)
                    })
                    Contacts.insertbulkcamdid(bulknumarray, function (err, count) {
                        if (err) {
                            console.log(err);
                        } else {

                        }
                    })
                }
                res.json({ 'data': 'Campaign created sucessfully.', 'camid': camid });
            }
        });
    }
});

// save voip campaign
router.post('/savevoipCampaign', authorize, function (req, res) {
    //console.log(req.body);
    var m = new Date();
    var camid = 'CON' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    //console.log(req);
    var customer_id = req.body.customer_id;
    var startdate = req.body.startdate;
    var date = formatDate(startdate)
    var campaignname = req.body.campaignname;
    var ty = req.body.campaigntype;
    var met = req.body.campaignmethod;
    var camagrp = req.body.agentgroup;
    var cam_agents = req.body.agents;
    var cam_did = req.body.did;
    var cam_segment = req.body.segments;
    var ivrid = req.body.ivr;
    var pules = req.body.pulse;
    var pulserate = req.body.pulserate;
    var manager = req.body.manager;

    var dialertype = req.body.dialertype ? req.body.dialertype : 0;
    var campaigndata = {
        'create_date': date, 'cam_name': campaignname, 'cam_type': ty,
        'cam_method': met, 'cam_agentgroup': camagrp, 'pules': pules, 'pulesrate': pulserate, 'manager': manager,
        cam_ivrid: ivrid, 'account_id': customer_id, 'cam_status': '0', 'dialer_type': dialertype
    };
    //console.log(campaigndata)
    Contacts.createcampaign(campaigndata, function (err, result) {
        console.log(err)
        if (err) {
            res.status(400).json(err);
        }
        else {
            //console.log(result);
            camid = result.insertId;
            //console.log(cam_segment)
            if (cam_segment.length > 0) {
                async.forEachOf(cam_segment, async (cat, key, callback) => {
                    camdata = { category: cat, id: customer_id };
                    Contacts.getContactbySegment(camdata, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            var cnt = 1;
                            var total = data.length;
                            agid = 0
                            if (ty == 1 && cam_agents.length > 0) {
                                agid = cam_agents[0]
                            }
                            bulknumarray = [];
                            async.forEachOf(data, async (num, key, callback) => {
                                numberdata = [camid, customer_id, num.cont_id, agid, cat];
                                bulknumarray.push(numberdata)
                            })
                            // console.log(bulknumarray)
                            Contacts.insertbulkcamnumber(bulknumarray, function (err, count) {
                                if (err) {
                                    console.log(err);
                                } else {

                                }
                            })
                        }

                    });

                })
            }
            if (req.body.agents && cam_agents.length > 0) {
                bulknumarray = [];
                async.forEachOf(cam_agents, async (agentid, key, callback) => {
                    numberdata = [camid, customer_id, agentid];
                    bulknumarray.push(numberdata)
                })
                Contacts.insertbulkcamagents(bulknumarray, function (err, count) {
                    if (err) {
                        console.log(err);
                    } else {

                    }
                })
            }
            if (req.body.did && cam_did.length > 0) {
                bulknumarray = [];
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
            res.json({ 'data': 'Campaign created sucessfully.', 'camid': camid });
        }
    });
});



router.get('/getgrouptoagent/:id/:gid', authorize, function (req, res) {
    //  console.log(req.params.id + req.params.gid)
    camdata = { id: req.params.gid };
    Contacts.gethunt(camdata, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        // console.log("data"+JSON.stringify(data));
        res.send({ 'data': data });
    });
});
router.get('/getgrouptosupervisoragent/:id/:gid', authorize, function (req, res) {
    //  console.log(req.params.id + req.params.gid)
    camdata = { id: req.params.gid };
    Contacts.getgrouptosupervisoragent(camdata, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        // console.log("data"+JSON.stringify(data));
        res.send({ 'data': data });
    });
});

router.get('/getallcampaign/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Contacts.getCampaign(req.params.id, function (err, rows) {
        //console.log(rows);
        if (err) {
            //res.status(400).json(err);
            res.status(200).send({ "count": 0, 'data': [] });
        }
        else {
            res.status(200).send({ "count": rows.length, 'data': rows });
        }
    });
});
router.get('/getallvoipCampaign/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Contacts.getallvoipCampaign(req.params.id, function (err, rows) {
        //console.log(rows);
        if (err) {
            rres.status(200).send({ "count": 0, 'data': [] });
        }
        else {
            res.status(200).send({ "count": rows.length, 'data': rows });
        }
    });
});


router.post('/changeaction', authorize, function (req, res) {
    //console.log(req.body);
    var camid = req.body.camid;
    var action = req.body.action;
    data = { camid: camid, cam_action: action };
    Contacts.updatecampaign(data, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        res.send({ 'data': data });
    });
});

router.post('/getsegmenttotalcontact/', authorize,async function (req, res) {
    //console.log(req.body);   
    const segmentarr = req.body.segmentarr;
    // console.log(segmentarr);
    var bulksegmantdata = [];
    for (let index = 0; index < segmentarr.length; index++) {
        const element = segmentarr[index];
        var contactdata = await Contacts.gettotalcontactbysegment(element)        
        //console.log(contactdata);
        let msg = contactdata.name +" having number of "+contactdata.totalcontact +" contacts";
        bulksegmantdata.push(msg);
        if(contactdata.totalcontact==0){
            delete segmentarr[index];
        }
    }
    //console.log("abcd:" + bulksegmantdata);
    res.json({ 'data': bulksegmantdata ,"segmentarr":segmentarr});

});

router.get('/deletecampaign/:cont_id', authorize, function (req, res) {
    Contacts.deleteCampaign(req.params.cont_id, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        else {
            Contacts.deleteCampaignnumber(req.params.cont_id, function (err, data) {
                if (err) {
                    res.status(400).json(err);
                }
                else {
                    Contacts.deletecampaignagents(req.params.cont_id, function (err, data) {
                        if (err) {
                            res.status(400).json(err);
                        }
                        else {
                            Contacts.deletecampaigndid(req.params.cont_id, function (err, data) {
                                if (err) {
                                    res.status(400).json(err);
                                }
                                else {
                                    res.json({ 'msg': 'Campaign deleted successfully!' });

                                }

                            });
                        }
                    });
                }
            });
        }
    });
});
//get segment with total contact count
router.get('/getSegmentwithTotalContact/:id', authorize, async function (req, res) {
    var userid = req.params.id;
    var userrole = req.query.tknuserrole;
    //console.log(userrole);
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
    } else {
        var managerid = userid
    }
    Contacts.AllContactCategory(managerid, async function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        } else {
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                var totalcontact = await Contacts.getsegmentstotalcontactcount(element.cont_id)
                //console.log(totalcontact);
                element.totalcontact = totalcontact;
            }
            res.send({ 'count': data.length, 'data': data });
        }
        //console.log('data:'+JSON.stringify(data));

    });
});
router.get('/getSupervisorSegmentwithTotalContact/:id', authorize, async function (req, res) {
    var userid = req.params.id;
    Contacts.getSupervisorSegmentwithTotalContact(userid, async function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        } else {
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                var totalcontact = await Contacts.getsegmentstotalcontactcount(element.cont_id)
                //console.log(totalcontact);
                element.totalcontact = totalcontact;
            }
            res.send({ 'count': data.length, 'data': data });
        }
        //console.log('data:'+JSON.stringify(data));

    });
});

//get campaign detail from campaign id
router.get('/getCampaignDetail/:id', authorize, function (req, res) {
    var id = req.params.id;
    Contacts.getcampaigndetail(id, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        //console.log("data"+JSON.stringify(data));
        res.send({ 'data': data });
    });
});
//get campaign call log from campaign id
router.get('/getCampaignCallLog/:id', authorize, function (req, res) {
    var id = req.params.id;
    Contacts.getcampaigncalllog(id, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        //console.log("data"+JSON.stringify(data));
        res.send({ 'data': data });
    });
});
//get campaign call summary from campaign id
router.get('/getCampaignCallSummary/:id', authorize, function (req, res) {
    var id = req.params.id;
    Contacts.getcampaigncallsummary(id, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        //console.log("data"+JSON.stringify(data));
        res.send({ 'data': data });
    });
});
//get campaign agent from campaign id
router.get('/getCampaignAgent/:id', authorize, function (req, res) {
    var id = req.params.id;
    Contacts.getcampaignagent(id, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        //console.log("data"+JSON.stringify(data));
        res.send({ 'data': data });
    });
});
//get campaign DID from campaign id
router.get('/getCampaignDID/:id', authorize, function (req, res) {
    var id = req.params.id;
    Contacts.getcampaigndid(id, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        res.send({ 'data': data });
    });
});
router.post('/searchCallLog', authorize, function (req, res) {
    if (req.body.agentrole == "supervisor") {
        Contacts.totalsupervisorsearchcalllog(req.body, function (err, rows) {
            if (err) {
                console.log(err);
            }
            else {
                res.status(200).send({ "data": rows });
            }
        })
    } else {
        Contacts.totalsearchcalllog(req.body, function (err, rows) {
            if (err) {
                console.log(err);
            }
            else {
                res.status(200).send({ "data": rows });
            }
        })
    }
})
//get campaign call log from campaign id
router.post('/searchCampaignCallLog', authorize, function (req, res) {
    //console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    Contacts.searchcampaigncal(req.body, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        // console.log(data)
        res.send({ 'data': data });
    });
});
router.get('/deleteCampaignAgent/:id', authorize, function (req, res) {
    Contacts.deletecampaignagent(req.params.id, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json({ 'msg': 'Campaign Agent deleted successfully!' });
        }
    });
});
router.get('/deleteCampaignAssignDID/:id', authorize, function (req, res) {
    Contacts.deletecampaignassigndid(req.params.id, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json({ 'msg': 'Campaign DID deleted successfully!' });
        }
    });
});
router.post('/saveCampaignDID', authorize, function (req, res) {
    // console.log(req.body.userid);
    for (var i = 0; i < req.body.channelForm.length; i++) {
        var m = new Date();
        c_data = { did: req.body.channelForm[i], account_id: req.body.userid, cam_id: req.body.campaignid };
        Contacts.savecampaigndid(c_data, function (err, count) {
            if (err) {
                console.log(err);
            }
        })

    }
    res.status(200).send({ "data": 'DID assigned succesfully.' });
})
router.get('/getCampaigAssignChannel/:id', authorize,async function (req, res) {
    //console.log(req.params.id);
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.params.id)
    } else {
        var managerid = req.params.id
    }
    Contacts.getcampaigassignChannel(managerid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
             console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getCampaigAssignAgent/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Contacts.getcampaignassignagent(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getCampaigAssignSupervisorAgent/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Contacts.getcampaignassignsupervisoragent(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/saveCampaignAgent', authorize, function (req, res) {
    // console.log(req.body.userid);
    for (var i = 0; i < req.body.agentForm.length; i++) {
        var m = new Date();
        c_data = { agent_id: req.body.agentForm[i], account_id: req.body.userid, cam_id: req.body.campaignid };
        Contacts.savecampaignagent(c_data, function (err, count) {
            if (err) {
                console.log(err);
            }
        })

    }
    res.status(200).send({ "data": 'Agent assigned succesfully.' });
})

// router.post('/api',authorize, function (req, res) {
//     customer_id = req.body.user_id;
//     pageNumber = parseInt(req.body.pageNumber);
//     pageSize = parseInt(req.body.pageSize);
//     position = pageNumber * pageSize
//     req.params.id = customer_id    
//     console.log(req.params.id)

//     Contacts.getContact(req.params.id, function (err, contacts_data) {
//         if(err){
//             console.log("error contacts "+JSON.stringify(err));
//         }
//         console.log("dataaa"+JSON.stringify(contacts_data.length))
//         res.status(200).send({'payload':contacts_data}); 
//     }).skip(position).limit(pageSize)

// });



// router.post('/',authorize, function (req, res) {
//     user_id = req.body.user_id;
//     filter = req.body.filter;
//     pageNumber = parseInt(req.body.pageNumber);
//     pageSize = parseInt(req.body.pageSize);
//     position = pageNumber * pageSize
//     findmatch = {}
//     findmatch.customer_id = user_id
//     //console.log(filter)
//     // if(filter.category!='all' && filter.category!=undefined){
//     //     findmatch.category = filter.category
//     // }
//     // if(filter.mobile!='' && filter.mobile!=undefined){
//     //     findmatch.mobile = new RegExp(filter.mobile, 'i')
//     // }
//     // if(filter.email!='' && filter.email!=undefined){
//     //     findmatch.email = new RegExp(filter.email, 'i')
//     // }

//     console.log(findmatch)
//     Contacts.searchcalllo(findmatch, function (err, contacts_data) {
//         if(err){
//             console.log("error contacts "+JSON.stringify(err));
//         }
//         res.status(200).send({'payload':contacts_data}); 
//     })

// }); 


router.post('/', authorize, async function (req, res) {
    user_id = req.body.user_id;
    filter = req.body.filter;
    sortcolumn = req.body.sortcolumn;
    sortdirection = req.body.sortdirection;
    var pageNumber = parseInt(req.body.pageNumber);
    var pageSize = parseInt(req.body.pageSize);
    var position = pageNumber * pageSize
    name = req.body.name;
    mobile = req.body.mobile;
    email = req.body.email;
    city = req.body.city;
    state = req.body.state;
    category = req.body.category;
    findmatch = {}
    findmatch.customer_id = user_id
    findmatch.position = position;
    findmatch.pageSize = pageSize;
    findmatch.name = filter.name;
    findmatch.mobile = filter.mobile;
    findmatch.email = filter.email;
    findmatch.city = filter.city;
    findmatch.state = filter.state;
    findmatch.category = filter.category;
    findmatch.sortcolumn = sortcolumn;
    findmatch.sortdirection = sortdirection;
    var userrole = req.query.tknuserrole;

    if (filter.agentrole == 'supervisor') {
        findmatch.created_by = user_id;
        //console.log(findmatch);
        Contacts.searchsupervisorcalllog(findmatch, function (err, contacts_data) {
            if (err) {
            }
            // console.log("1111"+JSON.stringify(contacts_data))
            res.status(200).send({ 'payload': contacts_data });
        })
    } else {
        if (userrole == 1) {
            findmatch.customer_id = await helper.GetManagerIdByAgent(user_id)
        }

        Contacts.searchcalllog(findmatch, function (err, contacts_data) {
            if (err) {
            }
            // console.log("1111"+JSON.stringify(contacts_data))
            res.status(200).send({ 'payload': contacts_data });
        })
    }
});


router.post('/CampaignCallLog', authorize, function (req, res) {
    var filter = req.body.filter;
    var sortcolumn = req.body.sortcolumn;
    var sortdirection = req.body.sortdirection;

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
    var pageNumber = parseInt(req.body.pageNumber);
    var pageSize = parseInt(req.body.pageSize);
    var position = pageNumber * pageSize;
    findmatch.position = position;
    findmatch.pageSize = pageSize;
    findmatch.sortcolumn = sortcolumn;
    findmatch.sortdirection = sortdirection

    Contacts.searchcampaigncalllog(findmatch, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        res.status(200).send({ 'payload': data });
    });
});
//check caller number in contact list by login user
router.post('/checkCallerNumber/', authorize, function (req, res) {
    //console.log(req.body.userid+'---'+req.body.mobileno);  
    var mobile = req.body.mobileno;
    mobile = (mobile.length == 10 || mobile.length == 11) ? mobile : mobile.substring(2)
    mobile = mobile.toString()[0] == 0 ? mobile.substring(1) : mobile
    //console.log(mobile)
    //console.log(req.body.userid)
    Contacts.checkcallernumber(req.body.userid, mobile, async function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        } else {
            var metadata = []
            if (data.length > 0) {
                conid = data[0].cont_id
                metadata = await helper.GetContactAllMeta(conid)
            }
            res.status(200).send({ 'data': data, 'metadata': metadata });
        }
    })
});
router.post('/searchCampaignCallLogexcel', authorize, function (req, res) {
    // console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    Contacts.campaigncalllogexcel(req.body, function (err, results) {
        if (err) {
            console.log(err);
        }
        else {

            jsonArray = [];
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
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(jsonArray);
            //var xls = json2xls(jsonArray);
            fs.writeFileSync('./uploads/campaigncalllog-' + req.body.campaignid + '.csv', csv, 'binary');
            res.status(200).send({ "data": 'campaigncalllog-' + req.body.campaignid + '.csv' });
        }

    })
})
router.get('/getStatedata', authorize, function (req, res) {
    Contacts.getStatedata(req.params, function (err, data) {
        //console.log(data);
        if (err) {
            res.status(400).json(err);
        } else {
            res.send({ 'data': data });
        }
    });
});
//get  campaign segment detail by campaign id
router.get('/getCampaignSegment/:id', authorize, function (req, res) {
    Contacts.getcampaignsegment(req.params.id, function (err, data) {
        //console.log(data);
        if (err) {
            res.status(400).json(err);
        } else {
            res.send({ 'data': data });
        }
    });
});

//Save contact number to campaign by call log list select with multiple checkbox
router.post('/saveCampaignContact/', authorize, function (req, res) {
    //console.log(req.params.id);
    bulknumarray = [];
    var numberdata = [];
    var data = req.body.logidArr;
    async.forEachOf(data, async (num, key, callback) => {
        Contacts.getcallogdata(num, function (err, logdata) {
            if (err) {
                console.log(err);
            } else {
                //req.body.mobile = logdata[0].CallerNumber;
                //req.body.name = logdata[0].CallerName;
                var m = new Date();
                var cont_id = 'CON' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
                contactdata = { cont_id: cont_id, customer_id: req.body.userid, mobile: logdata[0].CallerNumber, name: logdata[0].CallerName, created_date: m, category: req.body.segmentid }
                camdata = { cont_id: cont_id, account_id: req.body.userid, cam_id: req.body.campaignid, agent_id: req.body.agentid, date: m, segment_id: req.body.segmentid }

                Contacts.insertcontactwithcamnumber(contactdata, camdata, function (err, rows) {
                    if (err) {
                        console.log(err);
                    } else {
                        //console.log(rows);
                    }
                })
            }
        })
    })
    res.send({ 'data': 'Campaign contact saved successfully!!' });
    /**/
});
router.get('/getratedate/:id', authorize, function (req, res) {
    var id = req.params.id;
    var rates = [];
    var value;
    Contacts.getratedate(id, function (err, data) {
        //console.log(err);
        if (err) {
            res.status(200).json(err);
        }
        res.send({ 'data': data });
    });
});

router.post('/getcontactextrainfo/', authorize, async function (req, res) {
    var cdrid = req.body.id ? req.body.id : 0;
    var metadata = []
    Contacts.getcallogdata(cdrid, async function (err, rows) {
        console.log(err);
        if (err) {
            res.status(200).send({ 'data': [] });
        } else {
            if (rows.length > 0) {
                var conid = rows[0]['cont_id']
                var callmetadata = [{ "mobile": rows[0]['CallerNumber'].substr(-10) }]
                //console.log(conid);
                if (conid != '' && conid != null) {
                    metadata = await helper.GetContactAllMeta(conid)
                    if (metadata.length <= 0) {
                        metadata = callmetadata
                    }
                } else {
                    metadata = await helper.GetAPIData(cdrid)
                    //console.log('count', metadata.length);
                    if (metadata.length <= 0) {
                        metadata = callmetadata
                    }
                }
                res.status(200).send({ 'data': metadata });
            } else {
                res.status(200).send({ 'data': [] });
            }
        }
    })
})
//get agent contacts data by agent id
router.post('/getAgentContacts', authorize, function (req, res) {
    Contacts.getagentcontacts(req.body, function (err, rows) {
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
//get agent segment
router.get('/getSegments/:id', authorize, function (req, res) {
    Contacts.getsegments(req.params.id, function (err, rows) {
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

//Re Generate Campaign
router.post('/regeneratecampaign', authorize, async function (req, res) {
    var m = new Date();
    var camid = 'CON' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var generatetype = req.body.generatetype;
    var customer_id = req.body.customer_id;
    var startdate = new Date();
    var date = startdate
    var campaignname = req.body.campaignname;
    var ty = req.body.campaigntype;
    var met = req.body.campaignmethod;
    var camagrp = req.body.agentgroup;
    var cam_agents = req.body.agents;
    var cam_did = req.body.did;
    var cam_segment = req.body.segments;
    var ivrid = req.body.ivr;
    var totalagent = req.body.totalagent;
    var dialertype = req.body.dialertype ? req.body.dialertype : 0;
    var feedbackform = req.body.feedbackform;
    var retryunansweredcall = req.body.retryunansweredcall;
    var retrytime = req.body.retrytime;
    var maxretry = req.body.maxretry;
    var call_ratio = req.body.callratio;
    
    var campaigndata = {
        'create_date': date, 'cam_name': campaignname, 'cam_type': ty,
        'cam_method': met, 'cam_agentgroup': camagrp, 'retry': retryunansweredcall, 'retrytime': retrytime, 'maxretry': maxretry,
        cam_ivrid: ivrid, 'account_id': customer_id, 'cam_status': '0', 'dialer_type': dialertype, 'cam_feedback_form': feedbackform, 'totalagent': totalagent,'call_ratio':call_ratio
    };
    //console.log(campaigndata)
    var managerbalance = await helper.GetManagerBalance(customer_id)
    if (met == 1 && managerbalance['OBD_User_Balance'] <= 0) {
        return res.json({ 'data': 'You have not sufficient OBD balance.' });
    } else {
        if (generatetype == 0) {
            camid = campaignname;
            assigncontacttocampaign(camid, req.body)
            res.json({ 'data': 'Campaign created sucessfully.', 'camid': camid });
        } else {
            Contacts.createcampaign(campaigndata, function (err, result) {
                if (err) {
                    res.json({ 'data': 'Something went wrong!' });
                }
                else {
                    camid = result.insertId;
                    assigncontacttocampaign(camid, req.body)
                    // if (cam_segment.length > 0) {
                    //     async.forEachOf(cam_segment, async (cat, key, callback) => {
                    //         camdata = { category: cat, id: customer_id };
                    //         Contacts.getContactbySegment(camdata, function (err, data) {
                    //             if (err) {
                    //                 console.log(err);
                    //             } else {
                    //                 var cnt = 1;
                    //                 var total = data.length;
                    //                 var agid = 0
                    //                 if (ty == 1 && cam_agents.length > 0) {
                    //                     agid = cam_agents[0]
                    //                 }
                    //                 bulknumarray = [];
                    //                 async.forEachOf(data, async (num, key, callback) => {
                    //                     numberdata = [camid, customer_id, num.cont_id, agid, cat];
                    //                     bulknumarray.push(numberdata)
                    //                 })
                    //                 // console.log(bulknumarray)
                    //                 Contacts.insertbulkcamnumber(bulknumarray, function (err, count) {
                    //                     if (err) {
                    //                         console.log(err);
                    //                     } else {

                    //                     }
                    //                 })
                    //             }

                    //         });

                    //     })
                    // }
                    if (req.body.agents && cam_agents.length > 0) {
                        bulknumarray = [];
                        async.forEachOf(cam_agents, async (agentid, key, callback) => {
                            numberdata = [camid, customer_id, agentid];
                            bulknumarray.push(numberdata)
                        })
                        Contacts.insertbulkcamagents(bulknumarray, function (err, count) {
                            if (err) {
                                console.log(err);
                            }
                        })
                    }
                    if (req.body.did && cam_did.length > 0) {
                        bulknumarray = [];
                        async.forEachOf(cam_did, async (did, key, callback) => {
                            numberdata = [camid, customer_id, did];
                            bulknumarray.push(numberdata)
                        })
                        Contacts.insertbulkcamdid(bulknumarray, function (err, count) {
                            if (err) {
                                console.log(err);
                            }
                        })
                    }
                    res.json({ 'data': 'Campaign created sucessfully.', 'camid': camid });
                }
            });
        }
    }
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
    Contacts.searchcampaignrecords(findmatch, function (err, data) {
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
                Contacts.insertbulkcamnumber(bulknumarray, function (err, count) {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        }
    });
}
router.get('/deletecampaingnreq/:id', function (req, res) {
    Contacts.deletecampaingnreq(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!!' });
        }
        else {
            Contacts.totalcampaindatainreqlive(req.params.id, function (err, rows) {
                if (err) {
                    console.log(err);
                    res.status(200).send({ "data": 'Something went wrong!!' });
                }
                else {

                }})
            res.status(200).send({ "data": 'Request deleted succesfully.' });
        }
    })
})

router.post('/stopcampaign', authorize, function (req, res) {
    //console.log(req.body);
    var camid = req.body.camid;
    var action = req.body.action;
    data = { camid: camid, cam_action: action };
    Contacts.stopcampaign(data, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        res.send({ 'data': data });
    });
});
router.get('/getgrouptounassignagent/:id/:gid', authorize, function (req, res) {
    //  console.log(req.params.id + req.params.gid)
    camdata = { id: req.params.gid, userid: req.params.id };
    Contacts.getgroupunassignagent(camdata, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        // console.log("data"+JSON.stringify(data));
        res.send({ 'data': data });
    });
});
router.get('/getgrouptounassignsupervisoragent/:id/:gid', authorize, function (req, res) {
    //  console.log(req.params.id + req.params.gid)
    camdata = { id: req.params.gid, userid: req.params.id };
    Contacts.getgrouptounassignsupervisoragent(camdata, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }
        // console.log("data"+JSON.stringify(data));
        res.send({ 'data': data });
    });
});

router.post('/getcampaigunassignagent/', authorize, function (req, res) {
    //console.log(req.params.id);
    //console.log(req.body);
    Contacts.getcampaignunassignagent(req.body.userid, req.body.camid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            // console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/getcampaigunassignsupervisoragent/', authorize, function (req, res) {
    //console.log(req.params.id);
    //console.log(req.body);
    Contacts.getcampaigunassignsupervisoragent(req.body.userid, req.body.camid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            // console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})


router.get('/getcampaigunassignagent/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Contacts.getcampaignunassignagent(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            // console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/serachcampagindata', authorize, function (req, res) {
    //console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;
    if (req.body.agentrole == 'supervisor') {
        Contacts.serachsupervisorcampagindata(req.body, function (err, rows) {
            if (err) {
                //res.status(400).json(err);
                res.status(200).send({ "data": [] });
            } else {
                res.status(200).send({ "data": rows });
            }

        });
    } else {
        Contacts.serachcampagindata(req.body, function (err, rows) {
            if (err) {
                // res.status(400).json(err);
                res.status(200).send({ "data": [] });
            } else {
                res.status(200).send({ "data": rows });
            }

        });
    }

});
router.post('/savescheduleform', authorize, function (req, res) {

    var all = req.body.all;
    var mon = req.body.mon;
    var tue = req.body.tue;
    var wed = req.body.wed;
    var thu = req.body.thu;
    var fri = req.body.fri;
    var sat = req.body.sat;
    var sun = req.body.sun;
    if (mon == true) {
        mon = '1';
    } else {
        mon = '0';
    }
    if (tue == true) {
        tue = '1';
    } else {
        tue = '0';
    }
    if (wed == true) {
        wed = '1';
    } else {
        wed = '0';
    }
    if (thu == true) {
        thu = '1';
    } else {
        thu = '0';
    }
    if (fri == true) {
        fri = '1';
    } else {
        fri = '0';
    }
    if (sat == true) {
        sat = '1';
    } else {
        sat = '0';
    }
    if (sun == true) {
        sun = '1';
    } else {
        sun = '0';
    }
    if (all == true) {
        var mon = '1';
        var tue = '1';
        var wed = '1';
        var thu = '1';
        var fri = '1';
        var sat = '1';
        var sun = '1';
    }
    var starttime = req.body.starttime;
    var endtime = req.body.endtime;
    var campaignid = req.body.campaignid;
    var account_id = req.body.userid;

    fdata = {
        OpenTime: starttime, CloseTime: endtime, Mon: mon, Tue: tue, Wed: wed, Thu: thu, Fri: fri, Sat: sat, Sun: sun,
        campaignid: campaignid, account_id: account_id
    };
    //fdata = { account_type: 1, account_name: name, account_password: password, email: email, mobile: mobile, created_by: created_by, create_date: m };
    Contacts.savescheduleform(fdata, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!!' });
        }
        else {
            res.status(200).send({ "data": ' saved succesfully.' });
        }

    })
})
router.get('/getcampaignscheduledata/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Contacts.getcampaignscheduledata(req.params.id, req.query.tknuserid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data":[] });
        }
        else {

            res.status(200).send({ "data": rows[0] });
        }
    })
})
router.post('/updatescheduleform', authorize, function (req, res) {
    var id = req.body.id;
    var all = req.body.all;
    var mon = req.body.mon;
    var tue = req.body.tue;
    var wed = req.body.wed;
    var thu = req.body.thu;
    var fri = req.body.fri;
    var sat = req.body.sat;
    var sun = req.body.sun;
    if (mon == true) {
        mon = '1';
    } else {
        mon = '0';
    }
    if (tue == true) {
        tue = '1';
    } else {
        tue = '0';
    }
    if (wed == true) {
        wed = '1';
    } else {
        wed = '0';
    }
    if (thu == true) {
        thu = '1';
    } else {
        thu = '0';
    }
    if (fri == true) {
        fri = '1';
    } else {
        fri = '0';
    }
    if (sat == true) {
        sat = '1';
    } else {
        sat = '0';
    }
    if (sun == true) {
        sun = '1';
    } else {
        sun = '0';
    }
    if (all == true) {
        mon = '1';
        tue = '1';
        wed = '1';
        thu = '1';
        fri = '1';
        sat = '1';
        sun = '1';
    }
    var starttime = req.body.starttime;
    var endtime = req.body.endtime;
    var campaignid = req.body.campaignid;
    var account_id = req.body.userid;
    fdata = {
        OpenTime: starttime, CloseTime: endtime, Mon: mon, Tue: tue, Wed: wed, Thu: thu, Fri: fri, Sat: sat, Sun: sun,
        campaignid: campaignid, account_id: account_id, id: id,
    };
    Contacts.updatescheduleform(fdata, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!!' });
        }
        else {
            res.status(200).send({ "data": ' Update succesfully.' });
        }

    })
})
router.get('/predectiveassignAgentList/:id/:gid', authorize, function (req, res) {
    //  console.log(req.params.id + req.params.gid)
    camdata = { campid: req.params.gid, group: req.params.id, userid: req.query.tknuserid };
    Contacts.predectiveassignAgentList(camdata, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
        }

        res.send({ 'data': data });
    });
});
router.get('/deletecontactmetadata/:id', authorize, function (req, res) {
    // console.log(req.params.id);
    Contacts.deletecontactmeta(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": "Something went wrong!!" });
        }
        else {
            res.status(200).send({ "data": "contact meta data deleted successfully!!" });
        }
    })
})
router.get('/supcontactfiledata/:id', authorize, function (req, res) {
    Contacts.BulkFiledatabysupervisor(req.params.id, function (err, data) {
        //console.log(data);
        if (err) {
            res.status(400).json(err);
        }
        var i;
        var temp1 = [];
        for (i = 0; i < data.length; i++) {
            temp1.push(data[i]["finish_time"]);
        }
        res.send({ 'data': data, 'count': temp1 });
    });
});


router.get('/getrunningCampaign/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Contacts.getrunningCampaign(req.params.id, function (err, rows) {
        //console.log(rows);
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).send({ "count": rows.length, 'data': rows });
        }
    });
});
router.get('/getcompaleteCampaign/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Contacts.getcompaleteCampaign(req.params.id, function (err, rows) {
        //console.log(rows);
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).send({ "count": rows.length, 'data': rows });
        }
    });
});
router.get('/delete_agent_camp/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Contacts.delete_agent_camp(req.params.id, function (err, rows) {
        //console.log(rows);
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).send({ "count": rows.length, 'data': rows });
        }
    });
});
router.post('/supervisor_contacts', authorize, async function (req, res) {
    user_id = req.body.user_id;
    filter = req.body.filter;
    sortcolumn = req.body.sortcolumn;
    sortdirection = req.body.sortdirection;
    var pageNumber = parseInt(req.body.pageNumber);
    var pageSize = parseInt(req.body.pageSize);
    var position = pageNumber * pageSize
    name = req.body.name;
    mobile = req.body.mobile;
    email = req.body.email;
    city = req.body.city;
    state = req.body.state;
    category = req.body.category;
    findmatch = {}
    findmatch.customer_id = user_id
    findmatch.position = position;
    findmatch.pageSize = pageSize;
    findmatch.name = filter.name;
    findmatch.mobile = filter.mobile;
    findmatch.email = filter.email;
    findmatch.city = filter.city;
    findmatch.state = filter.state;
    findmatch.category = filter.category;
    findmatch.sortcolumn = sortcolumn;
    findmatch.sortdirection = sortdirection;
    var userrole = req.query.tknuserrole;

    
        findmatch.created_by = user_id;
        //console.log(findmatch);
        Contacts.searchsupervisorcalllog(findmatch, function (err, contacts_data) {
            if (err) {
            }
            // console.log("1111"+JSON.stringify(contacts_data))
            res.status(200).send({ 'payload': contacts_data });
        })
    
});
router.post('/update_call_ratio', authorize, function (req, res) {
    var callratio = req.body.callratio;
    var campaignid = req.body.campaignid;
    var account_id = req.query.tknuserid;
    fdata = {call_ratio:callratio,
        camid : campaignid, account_id: account_id, 
    };
    Contacts.update_call_ratio(fdata, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!!' });
        }
        else {
            res.status(200).send({ "data": ' Update succesfully.' });
        }

    })
})
router.post('/searchpendingdata', authorize, function (req, res) {
    // console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    Contacts.searchpendingdata(req.body, function (err, results) {
        if (err) {
            console.log(err);
        }
        else {
         res.status(200).send({ "data":results });
        }

    })
})
module.exports = router;

