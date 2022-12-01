var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var session = require('express-session');
var Template = require('../model/template');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "Garuda@dv-iagents-secret";
var fs = require("fs");
var path = require('path');
var multer = require('multer');
const mime = require('mime');
var client = require('scp2')
const { exec } = require('child_process');
// const { getAudioDurationInSeconds } = require('get-audio-duration');
const authorize = require("../middlewares/auth");
var helper = require("../helper/common");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({ resave: false, secret: '123456', saveUninitialized: true, cookie: { maxAge: 60000 } }));

router.get('/getApproveSMSTemplate', authorize, function (req, res) {
    const id = 0;
    Template.getapprovesmstemplate(id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getApproveSMSList/:id', authorize, function (req, res) {
    Template.getapprovesmslist(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getTransactionalSMSserver/', authorize, function (req, res) {
    var id = 0;
    Template.gettransactionalsmserver(id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})


/*router.post('/saveEmailTemplate', authorize, function (req, res) {
    console.log(req.body);
    var name = req.body.name;
    var design = JSON.stringify(req.body.email_design);
    var html = req.body.email_html;
    var userid = req.body.account_id;
    var email_subject = req.body.email_subject;
    
    var isschedulemeeting = req.body.isschedulemeeting;
    var is_meet = 0;
    if (isschedulemeeting == true) {
        is_meet = 1;
    }

    fdata = {
        email_subject : email_subject, email_title: name, email_design: design, email_html: html, account_id: userid, isschedulemeeting: is_meet
    };

    Template.inserttemplate(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Email Template saved succesfully.' });
        }

    })
})*/
router.post('/saveEmailTemplate', authorize, function (req, res) {
    // console.log(req.body);
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + Date.now() + '.' + mime.getExtension(file.mimetype))
        }
    })
    var upload = multer({
        storage: storage, limits:
        {
            fileSize: '6mb'
        }
    }).fields(
        [
            {
                name: 'attach_file',
                maxCount: 1
            }
        ]
    );
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            res.status(422).send("an Error occured")
        }
        // No error occured.
        var name = req.body.name;
        console.log((req.body));
        var design = (req.body.email_design);
        var html = req.body.email_html;
        var userid = req.body.account_id;
        var email_subject = req.body.email_subject;
        var email_image = req.body.email_image;
        var isschedulemeeting = req.body.isschedulemeeting;
        var is_meet = 0;
        if (isschedulemeeting == 'true') {
            is_meet = 1;
        }
        var fdata = {
            email_title: name, email_design: design, email_html: html, account_id: userid, email_subject: email_subject, email_image: email_image, isschedulemeeting: is_meet
        };
        // console.log(fdata);
        var attach_file = '';
        var m = new Date();

        if (req.files.attach_file) {
            attach_file = req.files.attach_file[0].filename;
            // console.log(registration_certi);
            fdata = Object.assign({ attach_file: attach_file }, fdata)
        }
        //console.log(fdata);
        Template.inserttemplate(fdata, function (err, rows) {
            if (err) {
                console.log(err);
                res.status(200).send({ "data": "Something went wrong!" });
            }
            else {
                res.status(200).send({ "data": 'Email Template saved succesfully.' });
            }

        })
    });
})


router.post('/saveDupTemplate', authorize, async function (req, res) {
    //console.log(req.body);
    var subject = req.body.subject;
    var name = req.body.template_name;
    var userid = req.body.userid;
    var template_id = req.body.template_id;

    var isschedulemeeting = req.body.isschedulemeeting;
    var is_meet = 0;
    if (isschedulemeeting == true) {
        is_meet = 1;
    }

    //get other data from email template
    await Template.getemailtemplatelist(template_id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log("row");
            // console.log(JSON.stringify(rows[0]));
            fdata = {
                email_title: name, email_subject: subject, email_design: rows[0]['email_design'], email_html: rows[0]['email_html'], account_id: userid, isschedulemeeting: is_meet
            };
            Template.inserttemplate(fdata, function (err, rows) {
                if (err) {
                    console.log(err);
                    res.status(200).send({ "data": "Something went wrong!" });
                }
                else {
                    res.status(200).send({ "data": 'Email Template saved succesfully.' });
                }

            })
        }

    })


    // fdata = {
    //     email_title : name,email_design:design,email_html : html, account_id : userid
    // };
    // Template.inserttemplate(fdata, function (err, rows) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         res.status(200).send({ "data": 'Email Template saved succesfully.' });
    //     }

    // })
})

/*router.post('/updateEmailTemplate', authorize, function (req, res) {
    //console.log(req.body);
    var name = req.body.name;
    var design = JSON.stringify(req.body.email_design);
    var html = req.body.email_html;
    var userid = req.body.account_id;
    var emailid = req.body.emailid;
    var email_subject = req.body.email_subject;

    var isschedulemeeting = req.body.isschedulemeeting;
    var is_meet = 0;
    if (isschedulemeeting == true) {
        is_meet = 1;
    }

    fdata = {
        email_title: name, email_design: design, email_html: html, account_id: userid, email_id: emailid, email_subject: email_subject, isschedulemeeting: is_meet
    };
    Template.updatetemplate(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'Email Template updated succesfully.' });
        }

    })
})*/
router.post('/updateEmailTemplate', authorize, function (req, res) {
    //console.log(req.body);
    /*var name = req.body.name;
    var design = JSON.stringify(req.body.email_design);
    var html = req.body.email_html;
    var userid = req.body.account_id;
    var email_subject = req.body.email_subject;

    fdata = {
        email_title: name, email_design: design, email_html: html, account_id: userid, email_id: emailid, email_subject: email_subject
    };*/
    if (!fs.existsSync(path.join(__dirname, '/../uploads/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/'), (err) => {
            if (err) {
                 console.error(err);
            }
        });
    }
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + Date.now() + '.' + mime.getExtension(file.mimetype))
        }
    })
    var upload = multer({
        storage: storage, limits:
        {
            fileSize: '6mb'
        }
    }).fields(
        [
            {
                name: 'attach_file',
                maxCount: 1
            }
        ]
    );
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            res.status(422).send("an Error occured")
        }
        // No error occured.
        var name = req.body.name;
        //var design = JSON.stringify(req.body.email_design);
        var design = req.body.email_design;
        var html = req.body.email_html;
        var userid = req.body.account_id;
        var email_subject = req.body.email_subject;
        var email_image = req.body.email_image;
        var emailid = req.body.emailid;
        var isschedulemeeting = req.body.isschedulemeeting;
        var is_meet = 0;
        if (isschedulemeeting == 'true') {
            is_meet = 1;
        }

        var fdata = {
            email_id: emailid, email_title: name, email_design: design, email_html: html, account_id: userid, email_subject: email_subject, email_image: email_image,isschedulemeeting: is_meet
        };
        var attach_file = '';
        var m = new Date();

        if (req.files.attach_file) {
            attach_file = req.files.attach_file[0].filename;
            // console.log(registration_certi);
            fdata = Object.assign({ attach_file: attach_file }, fdata)
        }

        Template.updatetemplate(fdata, function (err, rows) {
            if (err) {
                console.log(err);
                res.status(200).send({ "data": "Something went wrong!" });
            }
            else {
                res.status(200).send({ "data": 'Email Template updated succesfully.' });
            }

        })
    })
})

router.get('/getEmailTemplate/:id', authorize, function (req, res) {
    Template.getemailtemplatelist(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/getApproveEmailList', authorize, function (req, res) {
    Template.getapproveemaillist(req.query.tknuserid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/getApprovedAPI', authorize, function (req, res) {
    Template.getapproveapilist(req.query.tknuserid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})



router.post('/savewhatsapptemplate', authorize, function (req, res) {
    // console.log(req.body);
    if (!fs.existsSync(path.join(__dirname, '/../uploads/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/'), (err) => {
            if (err) {
                 console.error(err);
            }
        });
    }
    if (!fs.existsSync(path.join(__dirname, '/../uploads/whatsapp_template/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/whatsapp_template/'), (err) => {
            if (err) {
                 console.error(err);
            }
        });
    }
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/whatsapp_template/')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + Date.now() + '.' + mime.getExtension(file.mimetype))
        }
    })
    var upload = multer({
        storage: storage, limits:
        {
            fileSize: '6mb'
        }
    }).fields(
        [
            {
                name: 'attach_file',
                maxCount: 1
            }
        ]
    );
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            res.status(422).send("an Error occured")
        }
        // No error occured.
        var name = req.body.name;
        var userid = req.body.account_id;
        var description = req.body.description;
        var isschedulemeeting = req.body.isschedulemeeting;
        var is_meet = 0;
        if (isschedulemeeting == 'true') {
            is_meet = 1;
        }
        var fdata = {
            wtemp_title: name, account_id: userid, wtemp_description: description, isschedulemeeting: is_meet
        };
        // console.log(fdata);
        var attach_file = '';
        var m = new Date();

        if (req.files.attach_file) {
            attach_file = req.files.attach_file[0].filename;
            // console.log(registration_certi);
            fdata = Object.assign({ attach_file: attach_file }, fdata)
        }
        //console.log(fdata);
        Template.insertwhatsapptemplate(fdata, function (err, rows) {
            if (err) {
                console.log(err);
                res.status(200).send({ "data": "Something went wrong" });
            }
            else {
                res.status(200).send({ "data": 'Whatsapp Template saved succesfully.' });
            }

        })
    });
})

router.post('/updatewhatsapptemplate', authorize, function (req, res) {
    //console.log(req.body);
    /*var name = req.body.name;
    var design = JSON.stringify(req.body.email_design);
    var html = req.body.email_html;
    var userid = req.body.account_id;
    var email_subject = req.body.email_subject;

    fdata = {
        email_title: name, email_design: design, email_html: html, account_id: userid, email_id: emailid, email_subject: email_subject
    };*/
    if (!fs.existsSync(path.join(__dirname, '/../uploads/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/'), (err) => {
            if (err) {
                 console.error(err);
            }
        });
    }
    if (!fs.existsSync(path.join(__dirname, '/../uploads/whatsapp_template/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/whatsapp_template/'), (err) => {
            if (err) {
                 console.error(err);
            }
        });
    }
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/whatsapp_template')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + Date.now() + '.' + mime.getExtension(file.mimetype))
        }
    })
    var upload = multer({
        storage: storage, limits:
        {
            fileSize: '6mb'
        }
    }).fields(
        [
            {
                name: 'attach_file',
                maxCount: 1
            }
        ]
    );
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            res.status(422).send("an Error occured")
        }
        // No error occured.
        var name = req.body.name;
        //var design = JSON.stringify(req.body.email_design);
        var description = req.body.description;
        var userid = req.body.account_id;
        var wtempid = req.body.id;
        var isschedulemeeting = req.body.isschedulemeeting;
        var is_meet = 0;
        if (isschedulemeeting == 'true') {
            is_meet = 1;
        }
        var fdata = {
            wtemp_id: wtempid, wtemp_title: name, account_id: userid,wtemp_description:description,isschedulemeeting: is_meet,	update_date:new Date()
        };
        var attach_file = '';
        var m = new Date();

        if (req.files.attach_file) {
            attach_file = req.files.attach_file[0].filename;
            // console.log(registration_certi);
            fdata = Object.assign({ attach_file: attach_file }, fdata)
        }

        Template.updatewhatsapptemplate(fdata, function (err, rows) {
            if (err) {
                console.log(err);
                res.status(200).send({ "data": "Somethimg went wrong!" });
            }
            else {
                res.status(200).send({ "data": 'Whatsapp Template updated succesfully.' });
            }
        })
    })
})

router.get('/getwhatsapptemplatedetail/:id', authorize, function (req, res) {
    Template.getwhatsapptemplatedetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get email tempalt data
router.get('/getwhatsapptemplatedata/:id', authorize, async function (req, res) {
    //console.log(req.params);
    var userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
    } else {
        var managerid = userid
    }
    Template.getwhatsapptemplatedata(managerid, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/deletewhatsapptemplatedata/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Template.deletewhatsapptemplatedata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": "Something went wrong!" });
        }
        else {
            res.status(200).send({ "data": 'Whatsapp Template data deleted successfully' });
        }
    })
})
// update email text variables
router.post('/updatemailvariablesdata', authorize, function (req, res) {
    // console.log(req.body);
    var email_id = req.body.email_id;
    var sub_var1 = req.body.sub_var1?req.body.sub_var1:null;
    var sub_var2 = req.body.sub_var2?req.body.sub_var2:null;
    var desc_var1 = req.body.desc_var1?req.body.desc_var1:null;
    var desc_var2 = req.body.desc_var2?req.body.desc_var2:null;
    var desc_var3 = req.body.desc_var3?req.body.desc_var3:null;
    var desc_var4 = req.body.desc_var4?req.body.desc_var4:null;
    var desc_var5 = req.body.desc_var5?req.body.desc_var5:null;

    var m = new Date()
    fdata = { email_id:email_id,sub_var1:sub_var1,sub_var2:sub_var2,desc_var1:desc_var1,desc_var2:desc_var2,desc_var3:desc_var3,
        desc_var4:desc_var4,desc_var5:desc_var5,update_date:m };
    Template.updatetemplate(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": 'SMS Text Variables updated succesfully.' });
        }

    })
})



module.exports = router;