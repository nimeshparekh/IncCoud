var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var session = require('express-session');
var Admin = require('../model/admin');
var Contacts = require('../model/Contacts');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "Garuda@dv-iagents-secret";
const authorize = require("../middlewares/auth");
const { spawn } = require('child_process');
var pypath = require('../middlewares/pypath');
//Required package
const awry = require('awry');
const helper = require('../helper/common');
var dateFormat = require('dateformat');
var ERP = require('../model/erp');
const askapi = new awry.API({
    baseUrl: 'http://192.168.1.26:8088/ari',
    username: 'autodial',
    password: 'Garuda@dv18'
});
const askapi2 = new awry.API({
    baseUrl: 'http://192.168.1.23:8088/ari',
    username: 'autodial',
    password: 'Garuda@dv18'
});
const askapi3 = new awry.API({
    baseUrl: 'http://192.168.1.28:8088/ari',
    username: 'autodial',
    password: 'Garuda@dv18'
});

var APIRESTERPNext = require('../middlewares/ERP/library/restapi-erpnext/index');
var APIRESTERPNext = new APIRESTERPNext({
    username: 'Administrator',
    password: 'Garuda@dv1234',
    baseUrl: 'https://erp.cloudX.in' //Erpnext Instalado V10+ Porduccion u Develop
})

python_sdk_path = pypath.path()

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({ resave: false, secret: '123456', saveUninitialized: true, cookie: { maxAge: 60000 } }));

router.get('/getAdminUsers/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Admin.getadminusers(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getAdminDatail/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Admin.getadmindetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    })
})
router.post('/saveAdminUser', authorize, function (req, res) {
    //console.log(req.body);
    var name = req.body.name;
    var email = req.body.email;
    var mobile = req.body.mobile;
    if (req.body.password) {
        var password = bcrypt.hashSync(req.body.password);
    }
    var created_by = req.body.created_by;

    var m = new Date();
    fdata = { account_type: 3, account_name: name, account_password: password, email: email, mobile: mobile, created_by: created_by, create_date: m, current_status: 0 };
    Admin.insertadminuser(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Admin user detail saved succesfully.' });
        }

    })
})
router.post('/updateAdminUser', authorize, function (req, res) {
    console.log(req.body);
    var adminid = req.body.adminid;
    var name = req.body.name;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var created_by = req.body.created_by;

    var m = new Date();
    fdata = { account_id: adminid, account_name: name, email: email, mobile: mobile, created_by: created_by, last_modify_date: m };
    Admin.updateadminuser(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Admin User detail updated succesfully.' });
        }

    })
})
router.get('/deleteAdminUser/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Admin.deleteadminuser(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Admin User detail deleted successfully' });
        }
    })
})
//get used did
router.get('/getChannels/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Admin.getchannels(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get unused did
router.get('/getUnusedDid/:id', authorize, function (req, res) {
    // console.log(req.params.id);
    Admin.getUnusedDid(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
//get exprire did
router.get('/ExprieDid/:id', authorize, function (req, res) {
    // console.log(req.params.id);
    Admin.ExprieDid(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/saveChannel', authorize, function (req, res) {
    //console.log(req.body);
    var name = req.body.name;
    var didno = req.body.didno;
    var did = req.body.did;
    var status = req.body.status;
    var is_spam = req.body.is_spam;
    var spam_date = null;
    if (req.body.spam_date) {
        var spam_date = new Date(req.body.spam_date);
    }
    fdata = { did_name: name, did_number: didno, did: did, status: status, is_spam: is_spam, spam_date: spam_date };
    Admin.insertchannel(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Channel detail saved succesfully.' });
        }

    })
})
router.get('/getChannelDetail/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Admin.getchanneldetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    })
})

router.post('/updateChannel', authorize, function (req, res) {
    //  console.log(req.body);
    var did_id = req.body.did_id;
    var name = req.body.name;
    var didno = req.body.didno;
    var did = req.body.did;
    var status = req.body.status;
    var is_spam = req.body.is_spam;
    var spam_date = null;
    if (req.body.spam_date) {
        var spam_date = new Date(req.body.spam_date);
    }
    fdata = { id: did_id, did_name: name, did_number: didno, did: did, status: status, spam_date: spam_date, is_spam: is_spam };
    Admin.updatechannel(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Channel detail updated succesfully.' });
        }

    })
})
router.get('/deleteChannel/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Admin.deletechannel(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Channel detail deleted successfully' });
        }
    })
})
router.get('/getsmsdata', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getsmsdata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getsmsunapprovedata', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getsmsunapprovedata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getsmsdetail/:id', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getsmsdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/updatesmsdata', authorize, function (req, res) {
    console.log(req.body);
    var sms_id = req.body.sms_id;
    var account_id = req.body.account_id;
    var sms_title = req.body.sms_title;
    var sms_text = req.body.sms_text;

    var templateid = req.body.templateid;
    var contentid = req.body.contentid;
    var senderid = req.body.senderid;
    var entityid = req.body.entityid;
    var templatetype = req.body.templatetype;
    var approve_status = 1;

    var isgeneric = 0;
    if (req.body.isgeneric == true) {
        isgeneric = 1;
    }

    var m = new Date()
    fdata = { sms_id: sms_id, account_id: account_id, sms_text: sms_text, sms_title: sms_title, update_date: m, approve_status: approve_status, templateid: templateid, contentid: contentid, senderid: senderid, templatetype: templatetype, isgeneric: isgeneric,entityid:entityid };
    Admin.updatesmsdata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'sms updated succesfully.' });
        }

    })
})
router.post('/savesmsdata', authorize, function (req, res) {
    //console.log(req.body);
    var account_id = req.body.account_id;
    var sms_title = req.body.sms_title;
    var sms_text = req.body.sms_text;
    var approve_status = 0;

    var templateid = req.body.templateid;
    var contentid = req.body.contentid;
    var senderid = req.body.senderid;

    var isgeneric = 0;
    if (req.body.isgeneric == true) {
        isgeneric = 1;
        var approve_status = 1;
    }

    var templatetype = req.body.templatetype;
    var m = new Date();
    var n = new Date();
    fdata = { account_id: account_id, sms_text: sms_text, sms_title: sms_title, add_date: n, approve_status: approve_status, templateid: templateid, contentid: contentid, senderid: senderid, templatetype: templatetype, isgeneric: isgeneric };

    Admin.savesmsdata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'sms saved succesfully.' });
        }

    })
})

router.post('/savenotes', authorize, async function (req, res) {
    //console.log(req.body);

    var lead = await helper.getLeadId(req.body.lead_id);
    var lead_owner = await helper.getLeadOwner(req.body.lead_id);

    var ldata = { comment: req.body.note };
    var now = new Date();
    //ldata['c_date'] = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
    ldata['comment_by'] = lead_owner;
    ldata['customer_id'] = req.body.customer_id;
    ldata['lead_id'] = lead;


    var cdata = {
        "docstatus": 0,
        "doctype": "Comment",
        "__islocal": 1,
        "__unsaved": 1,
        "comment_type": "Comment",
        "published": 0,
        "seen": 0,
        "content": req.body.note,
        "reference_doctype": "Lead",
        "link_doctype": "Lead",
        "reference_name": req.body.lead_id,
        "link_name": req.body.lead_id,
        //"subject":title,
        "comment_by": lead_owner
    }

    APIRESTERPNext.saveLeadComment(cdata).then(function (resp) {
        if (resp) {

            // console.log("data");
            // console.log(JSON.stringify(resp));

            if (resp.statusCode && resp.statusCode > 0) {
                var is_sync = 'no';

            } else {
                var is_sync = 'yes';
                var lead_com_id = resp.name;
                ldata['lead_com_id'] = lead_com_id;
            }
            var now = new Date();
            ldata['c_date'] = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
            ldata['is_sync'] = is_sync;
            ERP.add_lead_comment(ldata, function (err, rows) {
                if (err) {
                    console.log(err);
                } else {
                    return res.status(200).send({ 'data': 'Comment sent Succesfully' });
                }
            })


        }
    })

    // ERP.add_lead_comment(fdata, function (err, rows) {
    //     if (err) {
    //         console.log(err); 
    //     } else {
    //         return res.status(200).send({ 'data': 'Comment sent Succesfully' });
    //     }
    // })
})
router.get('/deletesmsdata/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Admin.deletesmsdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'deleted successfully' });
        }
    })
})
//get email tempalt data
router.get('/getemaildata', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getemaildata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})
//get email data by id
router.get('/getemaildetail/:id', authorize, function (req, res) {

    Admin.getemaildetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//update email template data
router.post('/updateemaildata', authorize, function (req, res) {
    // console.log(req.body);
    var email_id = req.body.email_id;
    var account_id = req.body.account_id;
    var email_title = req.body.email_title;
    var email_subject = req.body.email_subject;
    var email_description = req.body.email_description;
    var m = new Date()
    fdata = { email_id: email_id, account_id: account_id, email_title: email_title, email_subject: email_subject, email_description: email_description, update_date: m };
    //console.log("update",fdata);
    Admin.updateemaildata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'email template updated succesfully.' });
        }

    })
})
// save email temaplate data
router.post('/saveemaildata', authorize, function (req, res) {

    var account_id = req.body.account_id;
    var email_title = req.body.email_title;
    var email_subject = req.body.email_subject;
    var email_description = req.body.email_description;
    var m = new Date();
    var n = new Date();
    fdata = { account_id: account_id, email_title: email_title, email_subject: email_subject, email_description: email_description, add_date: n };

    Admin.saveemaildata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Email temaplate data  saved succesfully.' });
        }

    })
})
// delete email template data
router.get('/deleteemaildata/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Admin.deleteemaildata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Email data deleted successfully' });
        }
    })
})
// get demo request
router.get('/demorequest', authorize, function (req, res) {
    //console.log(req.params);
    Admin.demorequest(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/pushtoerp', function (req, res) {
    var id = req.body.id;
    Admin.getdigitalbyid(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            ldata = rows[0]
            var name = ldata['name']
            var email = ldata['email']
            var mobile = ldata['mobile']
            //console.log(python_sdk_path)
            var process = spawn('python3', [python_sdk_path + "/middlewares/pushlead.py", '-n', name, '-e', email, '-m', mobile]);
            process.stdout.on('data', function (data, error) {
                if (error) {
                    console.log(error)
                    return res.status(200).send({ 'error': error });
                } else {
                    data = { push_erp: 'yes' }
                    Admin.updatedemorequest(id, data, function (err, rows) { })
                    return res.status(200).send({ 'msg': 'success' });


                }
            })
        }
    })
})
//demo resq delete\
router.get('/deletedemorequest/:id', function (req, res) {
    Admin.deletedemorequest(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Request deleted succesfully.' });
        }
    })
})

/// deleted list
router.get('/demoreqlist', authorize, function (req, res) {
    //console.log(req.params);
    Admin.demoreqlist(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})

//get visitor traking list
router.get('/getvisitortraking', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getvisitortraking(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getvisitorIp/:ip', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getVisitorIp(req.params.ip, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getPackages/', authorize, function (req, res) {
    var id = 0;
    Admin.getpackages(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//save package data
router.post('/savePackage', authorize, function (req, res) {
    //console.log(req.body);
    var name = req.body.name;
    var price = req.body.price;
    var validity = req.body.validity;
    var userlimit = req.body.userlimit;
    var channels = req.body.channels;
    var type = req.body.type;
    var service = JSON.stringify(req.body.service);
    var packagetype = req.body.packagetype;
    if (packagetype == 1) {
        var minutes = req.body.minutes;
    } else {
        var minutes = 0;
    }
    var m = new Date();
    fdata = {
        package_name: name, package_price: price, package_validity: validity,
        package_userlimit: userlimit, package_channels: channels, package_type: type,
        package_service: service, add_date: m, minutes: minutes, minute_type: packagetype,
        published_web: req.body.published_web, package_description: req.body.description
    };
    Admin.savepackage(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Package detail saved succesfully.' });
        }
    })
})
//update package data
router.post('/updatePackage', authorize, function (req, res) {
    // console.log(req.body);
    var id = req.body.id;
    var name = req.body.name;
    var price = req.body.price;
    var validity = req.body.validity;
    var userlimit = req.body.userlimit;
    var channels = req.body.channels;
    var type = req.body.type;
    var service = JSON.stringify(req.body.service);
    var packagetype = req.body.packagetype;
    if (packagetype == 1) {
        var minutes = req.body.minutes;
    } else {
        var minutes = 0;
    }

    var m = new Date();
    fdata = {
        package_id: id, package_name: name, package_price: price, package_validity: validity,
        package_userlimit: userlimit, package_channels: channels, package_type: type,
        package_service: service, update_date: m, minutes: minutes, minute_type: packagetype,
        published_web: req.body.published_web, package_description: req.body.description
    };
    Admin.updatepackage(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Package detail updated succesfully.' });
        }

    })
})
// delete package data
router.get('/deletePackage/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Admin.deletepackage(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Package detail deleted successfully' });
        }
    })
})
//get package data by id
router.get('/getPackageDetail/:id', authorize, function (req, res) {
    Admin.getpackagedetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    })
})
// get sms server data
router.get('/getsmsserverdata', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getsmsserverdata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
// get sms server by id
router.get('/getsmsserverdetail/:id', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getsmsserverdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/updatesmsserverdata', authorize, function (req, res) {
    //  console.log(req.body);
    var sid = req.body.sid;
    var sms_url = req.body.sms_url;

    var server_name = req.body.server_name;
    var customer_id = req.body.customer_id;

    var servertype = req.body.servertype;
    fdata = { sid: sid, server_name: server_name, customer_id: customer_id, server_type: servertype, server_url: sms_url };
    Admin.updatesmsserverdata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'sms server updated succesfully.' });
        }

    })
})
router.post('/savesmsserverdata', authorize, function (req, res) {
    //console.log(req.body);
    var sms_url = req.body.sms_url;
    var server_name = req.body.server_name;
    var customer_id = req.body.customer_id;
    var servertype = req.body.servertype;
    fdata = { server_name: server_name, customer_id: customer_id, server_type: servertype, server_url: sms_url };

    Admin.savesmsserverdata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'sms server data saved succesfully.' });
        }

    })
})
// delete sms server data
router.get('/deletesmsserverdata/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Admin.deletesmsserverdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'deleted successfully' });
        }
    })
})
// get email server data
router.get('/getemailserverdata', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getemailserverdata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
// get email server by id
router.get('/getemailserverdetail/:id', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getemailserverdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//Upadate email server
router.post('/updateemailserverdata', authorize, function (req, res) {
    //  console.log(req.body);
    var server_id = req.body.server_id;
    var account_id = req.body.account_id;
    var smtp_server = req.body.smtp_server;
    var smtp_port = req.body.smtp_port;
    var smtp_username = req.body.smtp_username;
    var smtp_password = req.body.smtp_password;
    var perday_limit = req.body.perday_limit;
    var attachment_size = req.body.attachment_size;
    fdata = { server_id: server_id, account_id: account_id, smtp_server: smtp_server, smtp_port: smtp_port, smtp_username: smtp_username, smtp_password: smtp_password, perday_limit: perday_limit, attachment_size: attachment_size };
    Admin.updateemailserverdata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'email server updated succesfully.' });
        }

    })
})
router.post('/saveemailserverdata', authorize, function (req, res) {
    // console.log(req.body);
    var account_id = req.body.account_id;
    var smtp_server = req.body.smtp_server;
    var smtp_port = req.body.smtp_port;
    var smtp_username = req.body.smtp_username;
    var smtp_password = req.body.smtp_password;
    var perday_limit = req.body.perday_limit;
    var attachment_size = req.body.attachment_size;
    fdata = { account_id: account_id, smtp_server: smtp_server, smtp_port: smtp_port, smtp_username: smtp_username, smtp_password: smtp_password, perday_limit: perday_limit, attachment_size: attachment_size };

    Admin.saveemailserverdata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'email server data saved succesfully.' });
        }

    })
})
// delete sms server data
router.get('/deleteemailserverdata/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Admin.deleteemailserverdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'deleted successfully' });
        }
    })
})
// get careers data
router.get('/getcareersdata', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getcareersdata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get get offers data
router.get('/getofferdata', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getofferdata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
// get push erp yes 
router.get('/geterplist', authorize, function (req, res) {
    //console.log(req.params);
    Admin.geterplist(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
// get approve sms template
router.get('/getsmsapprovestatus/:id', function (req, res) {
    Admin.getsmsapprovestatus(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })

})
// approve form sms 
router.post('/approvesms', authorize, function (req, res) {
    var sms_id = req.body.sms_id;
    var approved_by = req.body.approved_by;
    var templateid = req.body.templateid;
    var senderid = req.body.senderid;
    var contentid = req.body.contentid;
    var entityid = req.body.entityid;

    var m = new Date()
    var approve_status = req.body.approve_status;
    var note = req.body.note;
    var templatetype = req.body.templatetype;
    if (approve_status == 1) {
        fdata = {
            sms_id: sms_id, approved_by: approved_by,entityid:entityid,
            approve_date: m, approve_status: approve_status, note: note,
            templateid: templateid, contentid: contentid, senderid: senderid, templatetype: templatetype
        };
        //console.log(fdata);
        Admin.approvesms(fdata, function (err, rows) {
            if (err) {
                console.log(err);
            }
            else {
                res.status(200).send({ "data": 'status successfully...' });
            }
        })
    }
    else {
        fdata = {
            sms_id: sms_id, approved_by: approved_by, approve_status: approve_status, note: note,
            templateid: templateid, contentid: contentid,entityid:entityid,
            senderid: senderid, templatetype: templatetype
        };
        // console.log(fdata);
        Admin.approvesms(fdata, function (err, rows) {
            if (err) {
                console.log(err);
            }
            else {
                res.status(200).send({ "data": 'status successfully...' });
            }
        })

    }

})
/// serch request data
router.post('/searchReqData', authorize, async function (req, res) {
    // console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    await Admin.searchreqdata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            Admin.searchreqdatabydelete(req.body, function (err, deleterows) {
                if (err) {
                    console.log(err);
                }
                else {
                    Admin.searchreqdatabyerp(req.body, function (err, erprows) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.status(200).send({ "data": rows, "deleterows": deleterows, "erprows": erprows });
                        }

                    })
                }

            })
        }

    })
})

// demo req feedback 
router.post('/updatedemorefeedback', authorize, function (req, res) {
    //console.log(req.body);
    var requestid = req.body.requestid;
    var feedback = req.body.feedback;
    var m = new Date();
    fdata = { requestid: requestid, feedback: feedback, date: m };
    Admin.updatedemorefeedback(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Feedback updated succesfully.' });
        }
    })
})

// get demoreq feedback 
router.get('/getdemoreqfeedback/:id', authorize, function (req, res) {
    var id = req.params.id;
    Admin.getdemoreqfeedback(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
// get digital feedback
router.get('/getdigitalfeedback/:id', authorize, function (req, res) {
    var id = req.params.id;
    Admin.getdigitalfeedback(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

// get digital feedback
router.get('/gettelesmsfeedback/:id', authorize, function (req, res) {
    var id = req.params.id;
    Admin.gettelesmsfeedback(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/updatedigitalfeedback', authorize, function (req, res) {
    //console.log(req.body);
    var requestid = req.body.requestid;
    var feedback = req.body.feedback;
    var m = new Date();
    fdata = { requestid: requestid, feedback: feedback, date: m };
    Admin.updatedigitalfeedback(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Feedback updated succesfully.' });
        }
    })
})

router.post('/updatesmsfeedback', authorize, function (req, res) {
    //console.log(req.body);
    var requestid = req.body.requestid;
    var feedback = req.body.feedback;
    var m = new Date();
    fdata = { requestid: requestid, feedback: feedback, date: m };
    Admin.updatesmsfeedback(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Feedback updated succesfully.' });
        }
    })
})

//get digital cuurent data
router.get('/getdigitalcurrentdata', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getdigitalcurrentdata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})
//get deleted digital 

router.get('/getdigitaldeletedata', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getdigitaldeletedata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getdigitalerpdata', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getdigitalerpdata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/searchData', authorize, function (req, res) {
    // console.log(req.body);
    // console.log("data");
    // console.log(JSON.stringify(req.body));
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    Admin.searchdata(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            Admin.searchdatabydelete(req.body, function (err, deleterows) {
                if (err) {
                    console.log(err);
                }
                else {
                    Admin.searchdatabyerp(req.body, function (err, erprows) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.status(200).send({ "data": rows, "deleterows": deleterows, "erprows": erprows });
                        }

                    })
                }

            })
        }

    })
})
router.get('/deletedigitaldata/:id', function (req, res) {
    Admin.deletedigitaldata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Request deleted succesfully.' });
        }
    })
})
router.post('/digitalpushtoerp', function (req, res) {


    var id = req.body.id;

    Admin.getdigitalbyid(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            ldata = rows[0]
            var name = ldata['name']
            var email = ldata['email']
            var mobile = ldata['mobile']
            //console.log(python_sdk_path)
            var process = spawn('python3', [python_sdk_path + "/middlewares/pushlead.py", '-n', name, '-e', email, '-m', mobile]);
            process.stdout.on('data', function (data, error) {
                if (error) {
                    console.log(error)
                    return res.status(200).send({ 'error': error });
                } else {
                    data = { push_erp: 'yes' }
                    Admin.updatedigitaldata(id, data, function (err, rows) { })
                    return res.status(200).send({ 'msg': 'success' });


                }
            })
        }
    })
})
router.post('/searchmailData', authorize, function (req, res) {
    // console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    Admin.searchmailData(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            Admin.searchmaildatabydelete(req.body, function (err, deleterows) {
                if (err) {
                    console.log(err);
                }
                else {
                    Admin.searchmaildatabyerp(req.body, function (err, erprows) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.status(200).send({ "data": rows, "deleterows": deleterows, "erprows": erprows });
                        }

                    })
                }

            })
        }

    })
})

router.post('/searchsmsData', authorize, async function (req, res) {
    // console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;
    var enddateObj = new Date(req.body.enddate);
    var enddate = enddateObj.getFullYear() + '-' + ('0' + (enddateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + enddateObj.getDate()).slice(-2);
    req.body.enddate = enddate;

    await Admin.searchsmsData(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            //search y delete data
            Admin.searchsmsDatabydelete(req.body, function (err, deleterows) {
                if (err) {
                    console.log(err);
                }
                else {
                    Admin.searchsmsDatabyerp(req.body, function (err, erprows) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.status(200).send({ "data": rows, "deleterows": deleterows, "erprows": erprows });
                        }

                    })
                }

            })
            //res.status(200).send({ "data": rows });
        }

    })
})

//delete ditital mail req
router.get('/deletedigitalmail/:id', function (req, res) {
    Admin.deletedigitalmail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Request deleted succesfully.' });
        }
    })
})

//delete ditital mail req
router.get('/deletedigitalsms/:id', function (req, res) {
    Admin.deletedigitalsms(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Request deleted succesfully.' });
        }
    })
})

//get cuurent digital mail 
router.get('/getdigitalmaildata', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getdigitalmaildata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})

//get cuurent digital sms 
router.get('/getdigitalsmsdata', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getdigitalsmsdata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})

//get deleted ditital mail data
router.get('/getdelatedmaildata', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getdelatedmaildata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})

//get deleted ditital mail data
router.get('/getdelatedsmsdata', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getdelatedsmsdata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getmailerplist', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getmailerplist(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getsmserplist', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getsmserplist(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

//mail push erp
router.post('/mailpushtoerp', function (req, res) {


    var id = req.body.id;

    Admin.getdigitalmailbyid(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            ldata = rows[0]
            var name = ldata['name']
            var email = ldata['email']
            var mobile = ldata['mobile']
            //console.log(python_sdk_path)
            var process = spawn('python3', [python_sdk_path + "/middlewares/pushlead.py", '-n', name, '-e', email, '-m', mobile]);
            process.stdout.on('data', function (data, error) {
                if (error) {
                    console.log(error)
                    return res.status(200).send({ 'error': error });
                } else {
                    data = { push_erp: 'yes' }
                    Admin.updatedigitalmaildata(id, data, function (err, rows) { })
                    return res.status(200).send({ 'msg': 'success' });


                }
            })
        }
    })
})

//mail push erp
router.post('/smspushtoerp', function (req, res) {


    var id = req.body.id;

    Admin.getdigitalsmsbyid(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log("rows");
            // console.log(JSON.stringify(rows[0]));
            ldata = rows[0]
            var name = ldata['name']
            var email = ldata['email']
            var mobile = ldata['mobile']
            //console.log(python_sdk_path)
            var process = spawn('python3', [python_sdk_path + "/middlewares/pushlead.py", '-n', name, '-e', email, '-m', mobile]);
            process.stdout.on('data', function (data, error) {
                if (error) {
                    // console.log("error");
                    // console.log(JSON.stringify(error));
                    return res.status(200).send({ 'error': error });
                } else {
                    // console.log("control goes here !!!");
                    // data = { push_erp: 'yes' }
                    Admin.updatedigitalsmsdata(id, data, function (err, rows) { })
                    return res.status(200).send({ 'msg': 'success' });


                }
            })
        }
    })
})

router.post('/updatedigitalmailfeedback', authorize, function (req, res) {
    //console.log(req.body);
    var requestid = req.body.requestid;
    var feedback = req.body.feedback;
    var m = new Date();
    fdata = { requestid: requestid, feedback: feedback, date: m };
    Admin.updatedigitalmailfeedback(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Feedback updated succesfully.' });
        }
    })
})

// get digital mail feedback 
router.get('/getdigitalmailfeedback/:id', authorize, function (req, res) {
    var id = req.params.id;
    Admin.getdigitalmailfeedback(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
// get GST data
router.get('/getGSTdata', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getGSTdata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})
//get gst data by id
router.get('/getGstDetail/:id', authorize, function (req, res) {
    var id = req.params.id;
    Admin.getGstDetail(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
//save GST data
router.post('/saveGSTData', authorize, function (req, res) {
    //console.log(req.body);
    var m = new Date();
    var GST_ID = 'GST' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var GST_Number = req.body.GST_Number;
    var State = req.body.State;
    var State_code = req.body.State_code;
    var address = req.body.address;
    var Created_By = req.body.Created_By;
    var Data_Date = new Date();
    fdata = { GST_ID: GST_ID, GST_Number: GST_Number, State: State, State_code: State_code, Created_By: Created_By, Data_Date: Data_Date, Address: address };

    Admin.saveGSTData(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'data saved succesfully.' });
        }

    })
})
//update Gst data
router.post('/updateGSTData', authorize, function (req, res) {
    // console.log(req.body);
    var GST_ID = req.body.GST_ID;
    var GST_Number = req.body.GST_Number;
    var State = req.body.State;
    var State_code = req.body.State_code;
    var Created_By = req.body.Created_By;
    var Data_Date = new Date();
    var address = req.body.address;
    fdata = { GST_ID: GST_ID, GST_Number: GST_Number, State: State, State_code: State_code, Created_By: Created_By, Data_Date: Data_Date, Address: address };

    Admin.updateGSTData(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'data updated succesfully.' });
        }

    })
})
// delete GST data
router.get('/deleteGST/:id', function (req, res) {
    Admin.deleteGST(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'deleted succesfully.' });
        }
    })
})
// get STATE data
router.get('/getStatedata', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getstatedata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {

            res.status(200).send({ "data": rows });
        }
    })
})
// get Tele SMS Package data
router.get('/getTeleSMSPackages', authorize, function (req, res) {
    //console.log(req.params);
    Admin.gettelesmspackages(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get tele sms package data by id
router.get('/getTeleSMSPackageDetail/:id', authorize, function (req, res) {
    var id = req.params.id;
    Admin.gettelesmspackagedetail(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
//save tele sms package data
router.post('/saveTeleSMSPackageData', authorize, function (req, res) {
    //console.log(req.body);
    var m = new Date();
    var SMS_ID = 'SMS' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var name = req.body.name;
    var transrate = req.body.transrate;
    var transno = req.body.transno;
    var pr_rate = req.body.pr_rate;
    var pr_no = req.body.pr_no;
    var Created_By = req.body.Created_By;
    var date = new Date();
    var otp_rate = req.body.otp_rate;
    var otp_no = req.body.otp_no;
    var SMS_Plan_Value = ((transrate * transno) + (pr_rate * pr_no) + (otp_rate * otp_no));
    fdata = { SMS_ID: SMS_ID, SMS_Plan: name, SMS_TR_Rate: transrate, SMS_TR_No: transno, SMS_Pr_Rate: pr_rate, SMS_Pr_No: pr_no, Created_By: Created_By, SMS_otp_Rate: otp_rate, SMS_otp_No: otp_no, Created_Date: date, SMS_Plan_Value: SMS_Plan_Value };

    Admin.savetelesmspackagedata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'SMS Package data saved succesfully.' });
        }

    })
})
//update tele sms package data
router.post('/updateTeleSMSPackageData', authorize, function (req, res) {
    // console.log(req.body);
    var SMS_ID = req.body.SMS_ID;
    var name = req.body.name;
    var transrate = req.body.transrate;
    var transno = req.body.transno;
    var pr_rate = req.body.pr_rate;
    var pr_no = req.body.pr_no;
    var otp_rate = req.body.otp_rate;
    var otp_no = req.body.otp_no;
    var SMS_Plan_Value = ((transrate * transno) + (pr_rate * pr_no) + (otp_rate * otp_no));
    fdata = { SMS_ID: SMS_ID, SMS_Plan: name, SMS_TR_Rate: transrate, SMS_TR_No: transno, SMS_Pr_Rate: pr_rate, SMS_Pr_No: pr_no, SMS_otp_Rate: otp_rate, SMS_otp_No: otp_no, SMS_Plan_Value: SMS_Plan_Value };

    Admin.updatetelesmspackageData(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'SMS Package data updated succesfully.' });
        }

    })
})
// delete tele sms package data
router.get('/deleteTeleSMSPackageData/:id', function (req, res) {
    Admin.deletetelesmspackagedata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'SMS Package data deleted succesfully.' });
        }
    })
})
// get Tele Mail Package data
router.get('/getTeleMailPackages', authorize, function (req, res) {
    //console.log(req.params);
    Admin.gettelemailpackages(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get tele mail package data by id
router.get('/getTeleMailPackageDetail/:id', authorize, function (req, res) {
    var id = req.params.id;
    Admin.gettelemailpackagedetail(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
//save tele mail package data
router.post('/saveTeleMailPackageData', authorize, function (req, res) {
    //console.log(req.body);
    var m = new Date();
    var Mail_ID = 'MAIL' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    if (req.body.bulkemail == true) {
        var bulkemail = 1;
    } else {
        var bulkemail = 0;
    }
    if (req.body.hostingservice == true) {
        var hostingservice = 1;
    } else {
        var hostingservice = 0;
    }

    var name = req.body.name;
    var rate = req.body.rate;
    var mailno = req.body.mailno;
    var value = req.body.value;
    var gb = req.body.gb;
    var validity = req.body.validity;
    var Created_By = req.body.Created_By;
    var bulk_prate = req.body.bulk_prate;
    var bulk_emailno = req.body.bulk_emailno;
    var bulk_pvalue = req.body.bulk_pvalue;
    var date = new Date();
    fdata = {
        Mail_ID: Mail_ID, Mail_Plan: name, Mail_Rate: rate, Max_User_No: mailno, Mail_Plan_Value: value, Created_By: Created_By, Created_Date: date,
        package_validity: validity, Mail_Gb: gb, hosting_service: hostingservice, bulk_email: bulkemail, Bulk_Mail_Rate: bulk_prate, Bulk_Mail_No: bulk_emailno, Bulk_Mail_Value: bulk_pvalue
    };

    Admin.savetelemailpackagedata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Email Package data saved succesfully.' });
        }

    })
})
//update tele mail package data
router.post('/updateTeleMailPackageData', authorize, function (req, res) {
    // console.log(req.body);
    if (req.body.bulkemail == true) {
        var bulkemail = 1;
    } else {
        var bulkemail = 0;
    }
    if (req.body.hostingservice == true) {
        var hostingservice = 1;
    } else {
        var hostingservice = 0;
    }

    var Mail_ID = req.body.Mail_ID;
    var name = req.body.name;
    var rate = req.body.rate;
    var mailno = req.body.mailno;
    var value = req.body.value;
    var gb = req.body.gb;
    var validity = req.body.validity;
    var bulk_prate = req.body.bulk_prate;
    var bulk_emailno = req.body.bulk_emailno;
    var bulk_pvalue = req.body.bulk_pvalue;
    fdata = {
        hosting_service: hostingservice, bulk_email: bulkemail, Mail_ID: Mail_ID, Mail_Plan: name, Mail_Rate: rate, Max_User_No: mailno, Mail_Plan_Value: value,
        package_validity: validity, Mail_Gb: gb, Bulk_Mail_Rate: bulk_prate, Bulk_Mail_No: bulk_emailno, Bulk_Mail_Value: bulk_pvalue
    };
    Admin.updatetelemailpackageData(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Email Package data updated succesfully.' });
        }

    })
})
// delete tele mail package data
router.get('/deleteTeleMailPackageData/:id', function (req, res) {
    Admin.deletetelemailpackagedata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Email Package data deleted succesfully.' });
        }
    })
})
// get Tele Meet Package data
router.get('/getTeleMeetPackages', authorize, function (req, res) {
    //console.log(req.params);
    Admin.gettelemeetpackages(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get tele meet package data by id
router.get('/getTeleMeetPackageDetail/:id', authorize, function (req, res) {
    var id = req.params.id;
    Admin.gettelemeetpackagedetail(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
//save tele meet package data
router.post('/saveTeleMeetPackageData', authorize, function (req, res) {
    //console.log(req.body);
    var m = new Date();
    var Meet_ID = 'MEET' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var name = req.body.name;
    var rate = req.body.rate;
    var maxuser = req.body.maxuser;
    var value = req.body.value;
    var Created_By = req.body.Created_By;
    var validity = req.body.validity;
    var gb = req.body.gb;
    var date = new Date();
    fdata = {
        Meet_ID: Meet_ID, Meet_Plan: name, Meet_Rate: rate, Max_User_No: maxuser, Meet_Plan_Value: value, Created_By: Created_By, Created_Date: date,
        package_validity: validity, Meet_Gb: gb
    };

    Admin.savetelemeetpackagedata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Meet Package data saved succesfully.' });
        }

    })
})
//update tele meet package data
router.post('/updateTeleMeetPackageData', authorize, function (req, res) {
    // console.log(req.body);
    var Meet_ID = req.body.Meet_ID;
    var name = req.body.name;
    var rate = req.body.rate;
    var maxuser = req.body.maxuser;
    var value = req.body.value;
    var validity = req.body.validity;
    var gb = req.body.gb;
    fdata = {
        Meet_ID: Meet_ID, Meet_Plan: name, Meet_Rate: rate, Max_User_No: maxuser, Meet_Plan_Value: value,
        package_validity: validity, Meet_Gb: gb
    };

    Admin.updatetelemeetpackageData(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Meet Package data updated succesfully.' });
        }

    })
})
// delete tele meet package data
router.get('/deleteTeleMeetPackageData/:id', function (req, res) {
    Admin.deletetelemeetpackagedata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Meet Package data deleted succesfully.' });
        }
    })
})
// get Tele Digital Package data
router.get('/getTeleDigitalPackages', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getteledigitalpackages(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get tele digital package data by id
router.get('/getTeleDigitalPackageDetail/:id', authorize, function (req, res) {
    var id = req.params.id;
    Admin.getteledigitalpackagedetail(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
//save tele digital package data
router.post('/saveTeleDigitalPackageData', authorize, function (req, res) {
    //console.log(req.body);
    var m = new Date();
    var Digital_ID = 'DIG' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var brandno = req.body.brandno;
    var name = req.body.name;
    var channelno = req.body.channelno;
    var memberno = req.body.memberno;
    var messanger = req.body.messanger;
    var groupno = req.body.groupno;
    var monitorno = req.body.monitorno;
    var validity = req.body.validity;
    var hashtagno = req.body.hashtagno;
    var user = req.body.user;
    var bot = req.body.bot;
    var mediaspace = req.body.mediaspace;
    var value = req.body.value;
    var Created_By = req.body.Created_By;

    var date = new Date();
    fdata = {
        Digital_ID: Digital_ID, Digital_Plan: name, brand_no: brandno, channel_no: channelno, member_no: memberno, group_no: groupno, monitor_no: monitorno, Package_Validity: validity,
        messanger: messanger, hashtag_no: hashtagno, user: user, bot: bot, mediaspace: mediaspace, Package_Value: value, Created_By: Created_By, Created_Date: date
    };

    Admin.saveteledigitalpackagedata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Digital Package data saved succesfully.' });
        }

    })
})
//update tele digital package data
router.post('/updateTeleDigitalPackageData', authorize, function (req, res) {
    // console.log(req.body);
    var Digital_ID = req.body.Digital_ID;
    var brandno = req.body.brandno;
    var name = req.body.name;
    var channelno = req.body.channelno;
    var memberno = req.body.memberno;
    var messanger = req.body.messanger;
    var groupno = req.body.groupno;
    var monitorno = req.body.monitorno;
    var validity = req.body.validity;
    var hashtagno = req.body.hashtagno;
    var user = req.body.user;
    var bot = req.body.bot;
    var mediaspace = req.body.mediaspace;
    var value = req.body.value;
    var date = new Date();
    fdata = {
        Digital_ID: Digital_ID, Digital_Plan: name, brand_no: brandno, channel_no: channelno, member_no: memberno, group_no: groupno, monitor_no: monitorno, Package_Validity: validity,
        hashtag_no: hashtagno, user: user, bot: bot, mediaspace: mediaspace, Package_Value: value, messanger: messanger
    };

    Admin.updateteledigitalpackageData(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Digital Package data updated succesfully.' });
        }

    })
})
// delete tele digital package data
router.get('/deleteTeleDigitalPackageData/:id', function (req, res) {
    Admin.deleteteledigitalpackagedata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Digital Package data deleted succesfully.' });
        }
    })
})


router.post('/getlivechannel', function (req, res) {
    askapi.channels.list().then(data => {
        //console.log(data.data)
        res.status(200).send({ "data": data.data });
    }).catch(function (err) {
        console.log(err)
    });
})
router.post('/getlivechannel2', function (req, res) {
    askapi2.channels.list().then(data => {
        //console.log(data.data)
        res.status(200).send({ "data": data.data });
    }).catch(function (err) {
        console.log(err)
    });
})

router.post('/getlivechannel3', function (req, res) {
    askapi3.channels.list().then(data => {
        //console.log(data.data)
        res.status(200).send({ "data": data.data });
    }).catch(function (err) {
        console.log(err)
    });
})


router.post('/getchannelstat', authorize, function (req, res) {
    //console.log(req.params);
    var startdateObj = new Date();
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    Admin.getchannelstat(startdate, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/getchannelstat2', authorize, function (req, res) {
    //console.log(req.params);
    var startdateObj = new Date();
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    Admin.getchannelstat2(startdate, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/getchannelstat3', authorize, function (req, res) {
    //console.log(req.params);
    var startdateObj = new Date();
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    Admin.getchannelstat3(startdate, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/adminChangePassword', authorize, function (req, res) {
    var adminid = req.body.adminid;
    var newpassword = bcrypt.hashSync(req.body.newpassword);

    var m = new Date();
    fdata = { account_id: adminid, account_password: newpassword, last_modify_date: m };
    Admin.updateadminuser(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Admin User password changed succesfully.' });
        }

    })
})
router.get('/getBlockNumbertotalData', authorize, function (req, res) {
    Admin.getBlockNumbertotalData(0, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.post('/', authorize, function (req, res) {
    user_id = req.body.user_id;
    sortcolumn = req.body.sortcolumn;
    sortdirection = req.body.sortdirection;
    const filter = req.body.filter;
    var pageNumber = parseInt(req.body.pageNumber);
    var pageSize = parseInt(req.body.pageSize);
    var position = pageNumber * pageSize
    findmatch = {}
    findmatch.position = position;
    findmatch.pageSize = pageSize;
    //console.log(position)
    //console.log(pageSize)
    findmatch.sortcolumn = sortcolumn;
    findmatch.sortdirection = sortdirection;
   console.log(findmatch);
    Admin.getblocknumbers(findmatch, function (err, contacts_data) {
        if (err) {
        }
        res.status(200).send({ 'payload': contacts_data });
    })

});

router.get('/getBlockNumberDetail/:id', authorize, function (req, res) {
    Admin.getblocknumberdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            if (rows.length > 0) {
                res.status(200).send({ "data": rows[0] });
            } else {
                console.log("data not found");
            }

        }
    })
})
router.post('/saveBlockNumber', authorize, function (req, res) {
    //console.log(req.body);
    var account_id = req.query.tknuserid

    var number = req.body.number;
    var m = new Date();
    fdata = { account_id:account_id,number: number, add_date: m };
    Admin.insertblocknumber(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Block number saved succesfully.' });
        }

    })
})
router.post('/updateBlockNumber', authorize, function (req, res) {
    //console.log(req.body);
    var account_id = req.query.tknuserid

    var numid = req.body.numid;
    var number = req.body.number;
    var m = new Date();
    fdata = { num_id: numid, number: number, update_date: m };
    Admin.updateblocknumber(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Block number updated succesfully.' });
        }
    })
})
// delete tele digital package data
router.get('/deleteBlockNumber/:id', function (req, res) {
    Admin.deleteblocknumber(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Block number deleted succesfully.' });
        }
    })
})

//Save contact number to campaign by demo request id
router.post('/saveAssignLead/', authorize, function (req, res) {
    //console.log(req.params.id);
    bulknumarray = [];
    var numberdata = [];
    var id = req.body.id;
    Admin.getdemorequestbyid(id, function (err, logdata) {
        if (err) {
            console.log(err);
        } else {
            //req.body.mobile = logdata[0].CallerNumber;
            //req.body.name = logdata[0].CallerName;
            Admin.getagentassignleadetail(req.body.id, function (err, leadrows) {
                if (err) {
                    console.log(err);
                } else {
                    if (leadrows.length > 0) {
                        res.send({ 'data': 'Lead already assigned!!' });
                    } else {
                        var m = new Date();
                        leaddata = { account_id: req.body.userid, request_id: req.body.id, agent_id: req.body.agentid, email: logdata[0].email, mobile: logdata[0].mobile, name: logdata[0].name, add_date: m }

                        Admin.insertagentassignlead(leaddata, function (err, rows) {
                            if (err) {
                                console.log(err);
                            } else {
                                data = { push_erp: 'yes' }
                                Admin.updatedigitaldata(id, data, function (err, rows) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.send({ 'data': 'Lead Assign successfully!!' });
                                    }
                                })
                            }
                        })
                    }
                }
            })

        }
    })

    /**/
});


//Save contact number to campaign by digital req request id
router.post('/saveAssignDigitalLead/', authorize, function (req, res) {
    //console.log(req.params.id);
    bulknumarray = [];
    var numberdata = [];
    var id = req.body.id;
    Admin.getdigitalrequestbyid(id, function (err, logdata) {
        if (err) {
            console.log(err);
        } else {
            //req.body.mobile = logdata[0].CallerNumber;
            //req.body.name = logdata[0].CallerName;
            Admin.getagentassignleaddigital(req.body.id, function (err, leadrows) {
                if (err) {
                    console.log(err);
                } else {
                    if (leadrows.length > 0) {
                        res.send({ 'data': 'Lead already assigned!!' });
                    } else {
                        var m = new Date();
                        leaddata = { account_id: req.body.userid, request_id: req.body.id, agent_id: req.body.agentid, email: logdata[0].email, mobile: logdata[0].mobile, name: logdata[0].name, add_date: m }

                        Admin.insertagentassigndigitallead(leaddata, function (err, rows) {
                            if (err) {
                                console.log(err);
                            } else {
                                data = { push_erp: 'yes' }
                                Admin.updatedigitalreqdata(id, data, function (err, rows) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.send({ 'data': 'Lead Assign successfully!!' });
                                    }
                                })
                            }
                        })
                    }
                }
            })

        }
    })

    /**/
});


//Save contact number to campaign by demo request id
router.post('/saveAssignLeadSms/', authorize, function (req, res) {
    //console.log(req.params.id);
    bulknumarray = [];
    var numberdata = [];
    var id = req.body.id;
    Admin.getsmsrequestbyid(id, function (err, logdata) {
        if (err) {
            console.log(err);
        } else {
            //req.body.mobile = logdata[0].CallerNumber;
            //req.body.name = logdata[0].CallerName;
            Admin.getagentassignsmsleadetail(req.body.id, function (err, leadrows) {
                if (err) {
                    console.log(err);
                } else {
                    if (leadrows.length > 0) {
                        res.send({ 'data': 'Lead already assigned!!' });
                    } else {
                        var m = new Date();
                        leaddata = { account_id: req.body.userid, request_id: req.body.id, agent_id: req.body.agentid, email: logdata[0].email, mobile: logdata[0].mobile, name: logdata[0].name, add_date: m }

                        Admin.insertagentsmsassignlead(leaddata, function (err, rows) {
                            if (err) {
                                console.log(err);
                            } else {
                                data = { push_erp: 'yes' }
                                Admin.updatedigitalsmsdata(id, data, function (err, rows) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.send({ 'data': 'Lead Assign successfully!!' });
                                    }
                                })

                            }
                        })
                    }
                }
            })

        }
    })

    /**/
});

//Save contact number to campaign by mail request id
router.post('/saveAssignLeadMail/', authorize, function (req, res) {
    //console.log(req.params.id);
    bulknumarray = [];
    var numberdata = [];
    var id = req.body.id;
    Admin.getmailrequestbyid(id, function (err, logdata) {
        if (err) {
            console.log(err);
        } else {
            //req.body.mobile = logdata[0].CallerNumber;
            //req.body.name = logdata[0].CallerName;
            Admin.getagentassignmailleadetail(req.body.id, function (err, leadrows) {
                if (err) {
                    console.log(err);
                } else {
                    if (leadrows.length > 0) {
                        res.send({ 'data': 'Lead already assigned!!' });
                    } else {
                        var m = new Date();
                        leaddata = { account_id: req.body.userid, request_id: req.body.id, agent_id: req.body.agentid, email: logdata[0].email, mobile: logdata[0].mobile, name: logdata[0].name, add_date: m }

                        Admin.insertagentmailassignlead(leaddata, function (err, rows) {
                            if (err) {
                                console.log(err);
                            } else {
                                data = { push_erp: 'yes' }
                                Admin.updatedigitalmaildata(id, data, function (err, rows) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.send({ 'data': 'Lead Assign successfully!!' });
                                    }
                                })

                            }
                        })
                    }
                }
            })

        }
    })

    /**/
});

//get signup request

router.get('/getsignRequest', authorize, function (req, res) {

    Admin.getsignRequest(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
/// serch request data
router.post('/searchsignReqData', authorize, function (req, res) {
    // console.log(req.body);
    var startdateObj = new Date(req.body.startdate);
    var startdate = startdateObj.getFullYear() + '-' + ('0' + (startdateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + startdateObj.getDate()).slice(-2);
    req.body.startdate = startdate;

    Admin.searchsignReqData(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }

    })
})
// get Tollfree Package data
router.get('/getTollfreePackages', authorize, function (req, res) {
    //console.log(req.params);
    Admin.gettollfreepackages(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get tollfree package data by id
router.get('/getTollfreePackageDetail/:id', authorize, function (req, res) {
    var id = req.params.id;
    Admin.gettollfreepackagedetail(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
//save tollfree package data
router.post('/saveTollfreePackageData', authorize, function (req, res) {
    //console.log(req.body);
    var m = new Date();
    var ID = 'TOLL' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var name = req.body.name;
    var rate = req.body.rate;
    var no = req.body.no;
    var value = req.body.value;
    var Created_By = req.body.Created_By;
    var date = new Date();
    fdata = { TFree_id: ID, TFree_Plan: name, TFree_Rate: rate, TFree_No: no, TFree_Value: value, Created_By: Created_By, Created_Date: date };

    Admin.savetollfreepackagedata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Tollfree Package data saved succesfully.' });
        }

    })
})
//update tollfree package data
router.post('/updateTollfreePackageData', authorize, function (req, res) {
    // console.log(req.body);
    var id = req.body.id;
    var name = req.body.name;
    var rate = req.body.rate;
    var no = req.body.no;
    var value = req.body.value;
    fdata = { TFree_id: id, TFree_Plan: name, TFree_Rate: rate, TFree_No: no, TFree_Value: value };
    Admin.updatetollfreepackageData(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Tollfree Package data updated succesfully.' });
        }

    })
})
// delete tollfree package data
router.get('/deleteTollfreePackageData/:id', function (req, res) {
    Admin.deletetollfreepackagedata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Tollfree Package data deleted succesfully.' });
        }
    })
})

// get OBD Package data
router.get('/getOBDPackages', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getOBDpackages(req.params, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get OBD package data by id
router.get('/getOBDPackageDetail/:id', authorize, function (req, res) {
    var id = req.params.id;
    Admin.getOBDpackagedetail(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
//save OBD package data
router.post('/saveOBDPackageData', authorize, function (req, res) {
    //console.log(req.body);
    var m = new Date();
    var ID = 'OBD' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var name = req.body.name;
    var rate = req.body.rate;
    var no = req.body.no;
    var value = req.body.value;
    var Created_By = req.body.Created_By;
    var pulserate = req.body.pulserate;
    var date = new Date();
    fdata = { OBD_id: ID, OBD_Plan: name, OBD_Rate: rate, OBD_No: no, OBD_Value: value, Created_By: Created_By, Created_Date: date, OBD_Pulserate: pulserate };

    Admin.saveOBDpackagedata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'OBD Package data saved succesfully.' });
        }

    })
})
//update OBD package data
router.post('/updateOBDPackageData', authorize, function (req, res) {
    // console.log(req.body);
    var id = req.body.id;
    var name = req.body.name;
    var rate = req.body.rate;
    var no = req.body.no;
    var value = req.body.value;
    var pulserate = req.body.pulserate;
    fdata = { OBD_id: id, OBD_Plan: name, OBD_Rate: rate, OBD_No: no, OBD_Value: value, OBD_Pulserate: pulserate };
    Admin.updateOBDpackageData(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'OBD Package data updated succesfully.' });
        }

    })
})
// delete OBD package data
router.get('/deleteOBDPackageData/:id', function (req, res) {
    Admin.deleteOBDpackagedata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'OBD Package data deleted succesfully.' });
        }
    })
})
router.get('/getAdsPackages', authorize, function (req, res) {
    Admin.getadspackages(0, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.get('/getAdsPackageDetail/:id', authorize, function (req, res) {
    Admin.getadspackagedetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            if (rows.length > 0) {
                res.status(200).send({ "data": rows[0] });
            } else {
                console.log("data not found");
            }

        }
    })
})
router.post('/saveAdsPackageData', authorize, function (req, res) {
    //console.log(req.body);
    var m = new Date();
    var adsid = 'ADS' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var name = req.body.name;
    var value = req.body.value;

    fdata = { Adspackage_id: adsid, Adspackage_name: name, Adspackage_value: value, createD_date: m };
    Admin.saveadspackagedata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Ads package saved succesfully.' });
        }

    })
})
router.post('/updateAdsPackageData', authorize, function (req, res) {
    //console.log(req.body);
    var adsid = req.body.adsid;
    var name = req.body.name;
    var value = req.body.value;
    var m = new Date();
    fdata = { Adspackage_id: adsid, Adspackage_name: name, Adspackage_value: value };
    Admin.updateadspackagedata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Ads Package updated succesfully.' });
        }
    })
})
// delete tele digital package data
router.get('/deleteAdsPackageData/:id', function (req, res) {
    Admin.deleteadspackagedata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Ads Package deleted succesfully.' });
        }
    })
})
router.get('/getasteriskserverdata', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getasteriskserverdata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
// get email server by id
router.get('/getasteriskserverdetail/:id', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getasteriskserverdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//Upadate email server
router.post('/updateasteriskserverdata', authorize, function (req, res) {
    //  console.log(req.body);
    var server_id = req.body.server_id;
    var server_name = req.body.server_name;
    var server_ip = req.body.server_ip;
    var server_username = req.body.server_username;
    var server_password = req.body.server_password;
    var mysql_username = req.body.mysql_username;
    var mysql_password = req.body.mysql_password;
    var database_name = req.body.database_name;
    var mysql_host = req.body.mysql_host;
    var sip_host = req.body.sip_host;
    var ari_url = req.body.ari_url;
    var ari_username = req.body.ari_username;
    var ari_password = req.body.ari_password;
    var live_domain = req.body.live_domain;
    const fdata = { server_id: server_id, server_name: server_name, server_ip: server_ip,server_username:server_username,server_password:server_password, server_mysql_username: mysql_username, server_mysql_password: mysql_password, server_database_name: database_name, server_mysql_host: mysql_host, sip_host: sip_host,ari_url:ari_url,ari_username:ari_username,ari_password:ari_password,live_domain:live_domain  };
    Admin.updateasteriskserverdata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            res.status(200).send({ "data": 'Asterisk server updated succesfully.' });
        }

    })
})
router.post('/saveasteriskserverdata', authorize, function (req, res) {
    // console.log(req.body);
    var server_name = req.body.server_name;
    var server_ip = req.body.server_ip;
    var server_username = req.body.server_username;
    var server_password = req.body.server_password;
    var mysql_username = req.body.mysql_username;
    var mysql_password = req.body.mysql_password;
    var database_name = req.body.database_name;
    var mysql_host = req.body.mysql_host;
    var sip_host = req.body.sip_host;
    var ari_url = req.body.ari_url;
    var ari_username = req.body.ari_username;
    var ari_password = req.body.ari_password;
    var live_domain = req.body.live_domain;
    const fdata = { server_name: server_name, server_ip: server_ip,server_username:server_username,server_password:server_password, server_mysql_username: mysql_username, server_mysql_password: mysql_password, server_database_name: database_name, server_mysql_host: mysql_host, sip_host: sip_host,ari_url:ari_url,ari_username:ari_username,ari_password:ari_password,live_domain:live_domain };

    Admin.saveasteriskserverdata(fdata, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            res.status(200).send({ "data": 'Asterisk Server data saved succesfully.' });
        }

    })
})
// delete sms server data
router.get('/deleteasteriskserverdata/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Admin.deleteasteriskserverdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            res.status(200).send({ "data": 'Asterisk Server data deleted successfully' });
        }
    })
})

router.get('/getblocknumberdatas', authorize, function (req, res) {
    Admin.getblocknumberdatas(req.query.tknuserid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/checkmobilenumber', function (req, res) {
    Admin.checkmobilenumber(req.body.check, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            //console.log(rows.length);
            if (rows.length > 0) {
                res.json({ 'isexist': true });
            } else {
                res.json({ 'isexist': false });
            }
        }
    });
});
//delete_mappping_zohouser
router.get('/delete_mappping_zohouser/:id', authorize, function (req, res) {
    Admin.delete_mappping_zohouser(req.params.id,req.query.tknuserid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!' });
        }
        else {
            res.status(200).send({ "data": 'Delete Sccessfully' });
        }
    })
})
router.get('/getsocketserverdata', authorize, function (req, res) {
    //console.log(req.params);
    Admin.getsocketserverdata(req.params, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/get_obd_asterisk_server_data', authorize, function (req, res) {
    //console.log(req.params);
    Admin.get_obd_asterisk_server_data(req.params, function (err, rows) {
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