var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
var Smscampaign = require('../model/smscampaign');
var Contacts = require('../model/Contacts');
const authorize = require("../middlewares/auth");
var async = require("async");
var fs = require('fs');
const { Parser } = require('json2csv');
var helper = require("../helper/common");
//get sms campaign list by manager
router.post('/getsmscampaignsdata/', authorize, function (req, res) {
    //console.log(req.params.id);
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
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        Smscampaign.getagentsmscampaignsdata(req.body, function (err, rows) {
            //console.log(rows);
            if (err) {
                console.log(err);
                res.status(200).send({ 'data': [] });
            }
            else {
                res.status(200).send({ "count": rows.length, 'data': rows });
            }
        });
    } else {
        Smscampaign.getsmscampaignsdata(req.body, function (err, rows) {
            //console.log(rows);
            if (err) {
                console.log(err);
                res.status(200).send({ 'data': [] });
            }
            else {
                res.status(200).send({ "count": rows.length, 'data': rows });
            }
        });
    }
});

router.post('/getmanagersmscampaignsdata/', authorize, function (req, res) {    
    //console.log(req.params.id);
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
    Smscampaign.getmanagersmscampaignsdata(req.body, function (err, rows) {
        //console.log(rows);
        if (err) {
            console.log(err);
            res.status(200).send({ 'data': [] });
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
    data = { sms_camid: camid, smscam_action: action };
    Smscampaign.updatesmscampaign(data, function (err, data) {
        console.log(err);
        if (err) {
            //res.status(400).json(err);
            res.status(200).send({ "data": [] });
        }
        res.send({ 'data': data });
    });
});

router.post('/getsegment', authorize, function (req, res) {
    //console.log(req.body);
    var camid = req.body.camid;
    var action = req.body.action;
    data = { sms_camid: camid, smscam_action: action };
    Smscampaign.updatesmscampaign(data, function (err, data) {
        console.log(err);
        if (err) {
            //res.status(400).json(err);
            res.status(200).send({ "data": [] });
        }
        res.send({ 'data': data });
    });
});
router.get('/deleteSMSCampaign/:id', authorize, function (req, res) {
    Smscampaign.deletesmscampaign(req.params.id, function (err, data) {
        console.log(err);
        if (err) {
            //res.status(400).json(err);
            res.status(200).send({ "data": [] });
        }
        else {
            Smscampaign.deletesmscampaigncontact(req.params.id, function (err, data) {
                if (err) {
                    //res.status(400).json(err);
                    res.status(200).send({ "msg": '' });
                }
                else {
                    res.json({ 'msg': 'Campaign deleted successfully!' });
                }
            });
        }
    });
});

router.get('/getApproveSMSList/:id', authorize, function (req, res) {
    Smscampaign.getapprovesmslist(req.params.id, function (err, rows) {
        //console.log(rows);
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ 'data': rows });
        }
    });
});
/*router.post('/saveSMSCampaign', authorize, function (req, res) {
    var userid = req.body.userid;
    var startdate = req.body.startdate;
    var date = formatDate(startdate)
    var campaignname = req.body.campaignname;
    var smstemp = req.body.smstemp;
    var smsserver = req.body.smsserver;
    var type = 1;//for promotional sms
    var cam_segment = req.body.segments;
    var campaigndata = {
        'create_date': date, 'smstemp_id': smstemp, 'sms_camname': campaignname, 'smscam_type': type,
        'account_id': userid, 'smscam_status': '0', 'smsserver_id': smsserver
    };
    //console.log(campaigndata)
    Smscampaign.savesmscampaign(campaigndata, function (err, result) {
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
                    camdata = { category: cat, id: userid };
                    Contacts.getContactbySegment(camdata, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            var cnt = 1;
                            var total = data.length;
                            bulknumarray = [];
                            async.forEachOf(data, async (num, key, callback) => {
                                numberdata = [camid, userid, num.cont_id, cat];
                                bulknumarray.push(numberdata)
                            })
                            //console.log(bulknumarray);
                            Smscampaign.insertbulksmscampaigncontact(bulknumarray, function (err, count) {
                                if (err) {
                                    console.log(err);
                                } else {

                                }
                            })
                        }

                    });

                })
            }
            res.json({ 'data': 'SMS Campaign created sucessfully.', 'camid': camid });
        }
    });
});
*/

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
//get sms campaign detail by campaign id
router.get('/getSMSCampaignDetail/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Smscampaign.getsmscampaigndetail(req.params.id, function (err, rows) {
        //console.log(rows);
        if (err) {
            //res.status(400).json(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ 'data': rows[0] });
        }
    });
});
//get sms campaign segment detail by campaign id
router.get('/getSMSCampaignSegment/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Smscampaign.getsmscampaignsegment(req.params.id, function (err, rows) {
        //console.log(rows);
        if (err) {
            //res.status(400).json(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ 'data': rows });
        }
    });
});
//get promotional sms server from assign sms server to manager
router.get('/getPromotionalSMSserver/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Smscampaign.getpromotionalsmserver(req.params.id, function (err, rows) {
        //console.log(rows);
        if (err) {
            //res.status(400).json(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ 'data': rows });
        }
    });
});

//get segment wise contact list which select when sms campaign save
router.get('/getSMSCampaignContactList/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Smscampaign.getsmscampaigncontacts(req.params.id, function (err, rows) {
        //console.log(rows);
        if (err) {
            //res.status(400).json(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ 'data': rows });
        }
    });
});
//delete sms campaign contact data by num id
router.get('/deleteCampaignContact/:id', authorize, function (req, res) {
    Smscampaign.deletecampaigncontact(req.params.id, function (err, data) {
        console.log(err);
        if (err) {
            //res.status(400).json(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.json({ 'msg': 'SMS Campaign Contact deleted successfully!' });
        }

    });
});
router.post('/getsmslog/', authorize, function (req, res) {
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = req.body.startdate ? dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2) : '';
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = req.body.enddate ? dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2) : '';


    Smscampaign.getsmslog(req.body, function (err, rows) {
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
router.post('/getsmstotalcredit/', authorize, function (req, res) {
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = req.body.startdate ? dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2) : '';
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = req.body.enddate ? dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2) : '';
    Smscampaign.getsmstotalcredit(req.body, function (err, rows) {
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
router.get('/getsmstatus/:id', authorize, function (req, res) {
    Smscampaign.getsmstatus(req.params.id, function (err, rows) {
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
router.get('/deletesmslink/:id', authorize, function (req, res) {
    Smscampaign.deletesmslink(req.params.id, function (err, data) {
        console.log(err);
        if (err) {
            res.json({ 'msg': err });
        }
        else {
            res.json({ 'msg': 'SMS Link deleted successfully!' });
        }
    });
});
router.get('/getsmslinklist/:id', authorize, async function (req, res) {
    var userid = req.params.id;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.params.id)
        userid = managerid
    }
    Smscampaign.getsmslinklist(userid, function (err, data) {
        console.log(err);
        if (err) {
            res.json({ 'data': [] });
        }
        else {
            res.json({ 'data': data });
        }
    });
});
router.get('/getsmslinkdetail/:id', authorize, function (req, res) {
    Smscampaign.getsmslinkdetail(req.params.id, function (err, data) {
        console.log(err);
        if (err) {
            res.status(400).json(err);
            res.json({ 'data': [] });
        }
        else {
            res.json({ 'data': data[0] });
        }

    });
});
router.post('/savesmslink', authorize, function (req, res) {
    var userid = req.query.tknuserid;
    var date = new Date();
    //var date = formatDate(startdate)
    var name = req.body.name;
    var url = req.body.url;
    var data = {
        'created_at': date, 'sl_name': name, 'sl_url': url, 'account_id': userid
    };
    Smscampaign.savesmslink(data, function (err, result) {
        if (err) {
            //res.status(400).json(err);
            console.log(err);
            res.json({ 'msg': '' });
        }
        else {
            res.json({ 'msg': 'SMS Link created sucessfully.' });
        }
    });
});

router.post('/updatesmslink', authorize, function (req, res) {
    var userid = req.query.tknuserid;
    var date = new Date();
    var name = req.body.name;
    var url = req.body.url;
    var sl_id = req.body.sl_id;
    var data = {
        'updated_at': date, 'sl_name': name, 'sl_url': url, 'account_id': userid, 'sl_id': sl_id
    };
    Smscampaign.updatesmslink(data, function (err, result) {
        if (err) {
            //res.status(400).json(err);
            console.log(err);
            res.json({ 'msg': '' });
        }
        else {
            res.json({ 'msg': 'SMS Link updated sucessfully.' });
        }
    });
});
router.post("/savesmscampaign", authorize, async function (req, res) {
    // console.log("body");
    //console.log(JSON.stringify(req.body));

    var segments = req.body.segments;
    var leadstatus = req.body.leadstatus;
    var cam_name = req.body.cam_name;
    var cam_temp_id = req.body.smstemp;
    var cam_link = req.body.link?req.body.link:0;
    var dates = req.body.startdate;
    var dateObj = new Date(dates);
    var cam_date = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2) + " " + ('0' + dateObj.getHours()).slice(-2) + ":" + ('0' + dateObj.getMinutes()).slice(-2) + ":" + ('0' + dateObj.getSeconds()).slice(-2);

    //var cam_date = formatDate(dates);
    // var cam_date =req.body.startdate;

    var cam_status = "0";//approve campaign status
    var status = "0";
    var date = new Date();
    var cam_type = req.body.campaigntype;//transctional
    var message = req.body.message;
    var account_id = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    var created_by = null;
    if (userrole == 1) {
        created_by = req.query.tknuserid;
        cam_status = "2";//for agent create sms campaign
        var managerid = await helper.GetManagerIdByAgent(req.query.tknuserid)
        account_id = managerid
    }
    var cams_type = "Bulk";
    var form_id = req.body.formdata?req.body.formdata:0;
    var type = req.body.smstype;
    var sms_credit = req.body.sms_credits;
    if (type == "text") {
        type = 0;
    }
    if (type == "whatsapp") {
        type = 1;
    }
    var var1 = req.body.var1 ? req.body.var1 : '';
    var var2 = req.body.var2 ? req.body.var2 : '';
    var var3 = req.body.var3 ? req.body.var3 : '';
    var var4 = req.body.var4 ? req.body.var4 : '';
    var var5 = req.body.var5 ? req.body.var5 : '';
    var customvar1 = req.body.customvar1 ? req.body.customvar1 : '';
    var customvar2 = req.body.customvar2 ? req.body.customvar2 : '';
    var customvar3 = req.body.customvar3 ? req.body.customvar3 : '';
    var customvar4 = req.body.customvar4 ? req.body.customvar4 : '';
    var customvar5 = req.body.customvar5 ? req.body.customvar5 : '';
    Smscampaign.getassignsmsserver(account_id, cam_type, function (err, ser) {
        if (err) {
            console.log(err);
            res.status(200).send({ 'data': [] });
        }
        else {
            if (ser.length > 0) {
                const fdata = { cam_status: cam_status, cam_name: cam_name, cam_temp_id: cam_temp_id, cam_link: cam_link, cam_date: cam_date, account_id: account_id, cam_type: cam_type, cams_type: cams_type, form_id: form_id, type: type, var1: var1, var2: var2, var3: var3, var4: var4, var5: var5, customvar1: customvar1, customvar2: customvar2, customvar3: customvar3, customvar4: customvar4, customvar5: customvar5, created_by: created_by };
                //console.log(fdata);
                Smscampaign.savesmscampaigndata(fdata, function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(200).send({ 'data': [] });
                    }
                    else {
                        if (segments) {
                            if (segments.length > 0) {
                                camid = rows.insertId;
                                async.forEachOf(segments, async (cat, key, callback) => {
                                    camdata = { category: cat, id: account_id };
                                    Smscampaign.getContactbySegment(camdata, async function (err, data) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            var cnt = 1;
                                            var total = data.length;
                                            bulknumarray = [];
                                            //console.log(total)
                                            async.forEachOf(data, async (num, key, callback) => {
                                                var numberdata = [camid, num.name, status, message, date, num.mobile, num.cont_id, form_id, sms_credit];
                                                bulknumarray.push(numberdata)
                                                if (total == key + 1) {
                                                    //console.log(bulknumarray)
                                                    Smscampaign.insertbulksmscampaigncontact(bulknumarray, function (err, count) {
                                                        if (err) {
                                                            console.log(err);
                                                        } else {
                                                            //Smscampaign.createmsgwithshorturl(camid, message, cloudurl)
                                                        }
                                                    })
                                                }
                                            })
                                            res.status(200).send({ "data": "Campaign created sucessfully" });

                                        }
                                    });

                                })
                            }
                        }
                        else if (leadstatus) {
                            if (leadstatus.length > 0) {
                                camid = rows.insertId;
                                async.forEachOf(leadstatus, async (cat, key, callback) => {
                                    camdata = { status: cat, id: account_id };
                                    Smscampaign.getContactbyLeadStatus(camdata, async function (err, data) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            var cnt = 1;
                                            var total = data.length;
                                            bulknumarray = [];
                                            console.log(total)
                                            async.forEachOf(data, async (num, key, callback) => {
                                                numberdata = [camid, num.name, status, message, date, num.mobile, num.cont_id, form_id, sms_credit];
                                                bulknumarray.push(numberdata);
                                                console.log(total + '::' + key);
                                                if (total == key + 1) {
                                                    console.log(bulknumarray)
                                                    Smscampaign.insertbulksmscampaigncontact(bulknumarray, function (err, count) {
                                                        if (err) {
                                                            console.log(err);
                                                        } else {
                                                            //Smscampaign.createmsgwithshorturl(camid, message, cloudurl);
                                                            //res.status(200).send({ "data": "Campaign created sucessfully" });
                                                        }
                                                    })
                                                }

                                            })
                                            res.status(200).send({ "data": "Campaign created sucessfully" });

                                        }
                                    });
                                })
                            }
                        } else {
                            res.status(200).send({ "data": "Campaign created sucessfully" });
                        }
                    }
                })
            } else {
                res.status(200).send({ "data": "servernotfound" });
            }
        }
    })
})
router.get('/getstatuswithcontactcount/:id', authorize, async function (req, res) {
    //console.log(req.params.id);
    var userid = req.params.id;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.params.id)
        userid = managerid
    }
    Smscampaign.getstatuswithcontactcount(userid, function (err, rows) {
        if (err) {
            res.status(200).send({ 'data': [] });
        }
        else {
            // console.log("final step");
            //console.log(JSON.stringify(rows));
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/searchcampaigndata', authorize, function (req, res) {
    Smscampaign.searchcampaigndata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ 'data': [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }

    })
})

router.get('/getcampaignohitcount/:id', authorize, function (req, res) {
    // console.log(req.params.id);
    Smscampaign.getcampaignohitcount(req.params.id, function (err, rows) {
        if (err) {
            res.status(200).send({ 'data': [] });
        }
        else {
            res.status(200).send({ 'data': rows[0] });
        }
    });
});

router.get('/getsmsdeliver/:id', authorize, function (req, res) {
    // console.log(req.params.id);
    Smscampaign.getsmsdeliver(req.params.id, function (err, rows) {
        if (err) {
            res.status(200).send({ 'data': [] });
        }
        else {
            res.status(200).send({ 'data': rows });
        }
    });
});
router.get('/getsmssent/:id', authorize, function (req, res) {
    // console.log(req.params.id);
    Smscampaign.getsmssent(req.params.id, function (err, rows) {
        if (err) {
            res.status(200).send({ 'data': [] });
        }
        else {
            res.status(200).send({ 'data': rows });
        }
    });
});

router.get('/getcampaigndetail/:id', authorize, function (req, res) {
    // console.log(req.params.id);
    Smscampaign.getcampaigndetail(req.params.id, function (err, rows) {
        if (err) {
            res.status(200).send({ 'data': [] });
        }
        else {
            res.status(200).send({ 'data': rows });
        }
    });
});
router.get('/gethitcount/:id', authorize, function (req, res) {
    // console.log(req.params.id);
    Smscampaign.gethitcount(req.params.id, function (err, rows) {
        if (err) {
            //res.status(400).json(err);
            res.status(200).send({ 'data': [] });
        }
        else {
            res.status(200).send({ 'data': rows });
        }
    });
});
router.post('/searchsmscampaignumberlength', authorize, function (req, res) {
    //console.log(req.body,"total");
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
    Smscampaign.searchsmscampaignumberlength(req.body, function (err, rows) {
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
router.post('/gettotalsmscreditusage', authorize, function (req, res) {
    //console.log(req.body,"total");
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
    Smscampaign.gettotalsmscreditusage(req.body, function (err, rows) {
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

router.post('/searchsmscampaignnumberdata', authorize, function (req, res) {
    //console.log("data", req.body);
    user_id = req.body.user_id;
    filter = req.body.filter;
    sortcolumn = req.body.sortcolumn;
    sortdirection = req.body.sortdirection;
    var pageNumber = parseInt(req.body.pageNumber);
    var pageSize = parseInt(req.body.pageSize);
    var position = pageNumber * pageSize
    findmatch = {}
    findmatch.customer_id = user_id
    findmatch.position = position;
    findmatch.pageSize = pageSize;
    findmatch.name = filter.name;
    findmatch.mobile = filter.mobile;
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
    Smscampaign.searchloadCampagin(findmatch, function (err, contacts_data) {
        if (err) {
            res.status(200).send({ 'payload': [] });
        }
        res.status(200).send({ 'payload': contacts_data });
    })
});
router.post('/exportsmscampaignumberdatacsv', authorize, function (req, res) {
    Smscampaign.smscampaignumberdatatocsv(req.body, function (err, results) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": '' });
        }
        else {
            //console.log("log"+JSON.stringify(rows.length))            
            jsonArray = [];
            async.forEachOf(results, async (rows, key, callback) => {
                var startdateObj1 = new Date(rows['date']);
                var date = ('0' + startdateObj1.getDate()).slice(-2) + '-' + ('0' + (startdateObj1.getMonth() + 1)).slice(-2) + '-' + startdateObj1.getFullYear();

                var tempArry = {
                    'Send_Date': date,
                    'Name': rows['name'],
                    'Mobile': rows['mobile'],
                    'SMS_Status': rows['sms_status'],
                    'SMS_Credit': rows['sms_credit']
                }
                jsonArray.push(tempArry);
            })
            const json2csvParser = new Parser();
            const csv = json2csvParser.parse(jsonArray);
            //var xls = json2xls(jsonArray);
            fs.writeFileSync('./uploads/smscampaign-' + req.body.campaignid + '.csv', csv, 'binary');
            res.status(200).send({ "data": 'smscampaign-' + req.body.campaignid + '.csv' });
        }

    })
});
router.post('/searchsmslogdata', authorize, function (req, res) {
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
    Smscampaign.getsmslog(findmatch, function (err, contacts_data) {
        if (err) {
            res.status(200).send({ 'payload': [] });
        }
        //console.log(contacts_data);
        res.status(200).send({ 'payload': contacts_data });
    })
});
router.post('/getsmsloglength/', authorize, function (req, res) {
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = req.body.startdate ? dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2) : '';
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate = req.body.enddate ? dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2) : '';

    Smscampaign.getsmsloglength(req.body, function (err, rows) {
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


//searchsmsbalancedata
router.post('/searchsmsbalancedata/', authorize, async function (req, res) {
    var userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(req.query.tknuserid)
        userid = managerid
    }

    Smscampaign.searchsmsbalancedata(userid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows[0] });
        }
    })
})
//totalcountsmsgraph
router.post('/totalcountsmsgraph/', authorize, function (req, res) {
    var enddateObj = req.body.enddate ? new Date(req.body.enddate) : new Date();
    req.body.enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    var startdateObj = req.body.startdate ? new Date(req.body.startdate) : new Date();
    req.body.startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.userid = req.query.tknuserid;
    Smscampaign.totalcountsmsgraph(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows[0] });
        }
    })
})

router.post('/searchsmslinkdata', authorize, function (req, res) {
    req.body.userid = req.query.tknuserid;
    Smscampaign.searchsmslinkdata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/approvesmscampaign/:id', authorize, function (req, res) {
    //console.log(req.body);
    var camid = req.params.id;
    var cam_status = "0";
    data = { cid: camid, cam_status: cam_status };
    //console.log(data);
    Smscampaign.updatesmscampaign(data, function (err, data) {
        console.log(err);
        if (err) {
            //res.status(400).json(err);
            res.status(200).send({ "data": [] });
        }
        res.send({ 'data': "Campaign approve successfully!!" });
    });
});
router.get('/rejectsmscampaign/:id', authorize, function (req, res) {
    //console.log(req.body);
    var camid = req.params.id;
    var cam_status = "3";
    data = { cid: camid, cam_status: cam_status };
    //console.log(data);
    Smscampaign.updatesmscampaign(data, function (err, data) {
        console.log(err);
        if (err) {
            //res.status(400).json(err);
            res.status(200).send({ "data": [] });
        }
        res.send({ 'data': "Campaign decline successfully!!" });
    });
});

router.get('/getlinkcountreport', authorize, function (req, res) {
    Smscampaign.getlinkcountreport(req.query.tknuserid, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/searchlinkcount', authorize, function (req, res) {
    Smscampaign.searchlinkcount(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})





module.exports = router;