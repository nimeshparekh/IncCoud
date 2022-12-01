var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var session = require('express-session');
var Products = require('../model/products');
var Call = require('../model/call');
var Default = require('../model/default');
var Manager = require('../model/manager');
var Admin = require('../model/admin');
var Contacts = require('../model/Contacts');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "Garuda@dv-iagents-secret";
const authorize = require("../middlewares/auth");
var request = require('request');
const awry = require('awry');
const { filter } = require('async');
var async = require("async");
var fs = require('fs');
var http = require('http');
var urllib = require('urllib');
const excel = require('node-excel-export');
//const exportFromJSON = require('export-from-json')
var json2xls = require('json2xls');
var path = require('path');
var helper = require("../helper/common")
var multer = require('multer');
const mime = require('mime');
var requestify = require('requestify');
const { Client, Server } = require("nextcloud-node-client")

//Email Integration
var nodemailer = require('nodemailer');
//const fileType = require('file-type');

var transOptions = {
    host: 'mail.cloudX.in',
    port: 587,
    secure: false,
    auth: {
        user: 'no-reply@cloudX.in',
        pass: 'Garuda@dv3',
    },
};
var transporter = nodemailer.createTransport(transOptions);
var frommail = "cloudX<no-reply@cloudX.in>"

function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({ resave: false, secret: '123456', saveUninitialized: true, cookie: { maxAge: 60000 } }));


//Get Product list
router.get('/getProducts', authorize, function (req, res) {
    var id = req.query.tknuserid;
    Products.getproducts(id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})


router.post('/uploadthumbnail', authorize, function (req, res) {
    
    if (!fs.existsSync(path.join(__dirname, '/../uploads/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    if (!fs.existsSync(path.join(__dirname, '/../uploads/products/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/products/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    if (!fs.existsSync(path.join(__dirname, '/../uploads/products/thumbnail/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/products/thumbnail/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    var m = new Date();
    var fileid = 'THUMBNAIL' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/products/thumbnail/')
        },
        filename: function (req, file, cb) {
            cb(null, fileid)
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
                name: 'thumbnail',
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
        // No error occured.
        var footer_image = '';

        var m = new Date();
        // appadata = { account_id: account_id, uploaded_date: m };
        if (req.files.thumbnail) {
            footer_image = req.files.thumbnail[0].filename;
        }
        res.status(200).send({ "data": footer_image });
    })

});
router.post('/uploadproductdocfile', authorize, function (req, res) {
    
    if (!fs.existsSync(path.join(__dirname, '/../uploads/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    if (!fs.existsSync(path.join(__dirname, '/../uploads/products/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/products/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    if (!fs.existsSync(path.join(__dirname, '/../uploads/products/docs/'))) {
        fs.mkdir(path.join(__dirname, '/../uploads/products/docs/'), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    var m = new Date();
    //var fileid = 'DOC' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/products/docs/')
        },
        filename: function (req, file, cb) {
            cb(null, "DOCUMENT" + Date.now() + '.' + mime.getExtension(file.mimetype))
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
                name: 'documentfile',
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
        // No error occured.
        var footer_image = '';

        var m = new Date();
        // appadata = { account_id: account_id, uploaded_date: m };
        if (req.files.documentfile) {
            footer_image = req.files.documentfile[0].filename;
        }
        res.status(200).send({ "data": footer_image });
    })

});



// router.post('/uploadthumbnail',multer().single('file'),authorize,async function (req, res) {
//     console.log('start',JSON.stringify(req))
//     var user_id = req.query.tknuid;
//     var secret = req.query.tknusecret;
//     console.log(req.query)
//     // const server = new Server(
//     // { 
//     //     basicAuth:
//     //     { 
//     //         password: req.query.tknusecret,
//     //         username: user_id+"@cloudX.in",
//     //     },
//     //     url: "https://cloud.cloudX.in",
//     // });
//     // console.log(server)
//     // try {
//     //     const client = new Client(server);
//     //     console.log(client)
//     //     const folder = await client.createFolder("posts");
//     //     console.log(folder)
//     //     // create file within the folder
//     //     var filename = Date.now()+'.'+mime.getExtension(req.file.mimetype)
//     //     const file = await folder.createFile(filename, Buffer.from(req.file.buffer));
//     //     // share the file publicly with password and note
//     //     const share = await client.createShare({ fileSystemElement: file });
//     //     // use the url to access the share 
//     //     if(req.file.mimetype.includes('video')){
//     //         var shareLink = share.url+'/download';
//     //     }else{
//     //         var shareLink = share.url+'/preview';
//     //     }
//     //     shareLink = shareLink.replace(/^http:\/\//i, 'https://');
//     //     console.log(shareLink)
//     //     const content = await file.getContent()

//     //     console.log('File uploading completed!');
//     //     res.status(200).send({ "data": shareLink });
//     // }catch (e) {
//     //     // some error handling   
//     //     console.log(e);
//     //     return  res.status(200).send({'msg':'Something went wrong.please try again!'});
//     // }

//     // var m = new Date();
//     // var fileid = 'THUMBNAIL' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
//     // var storage = multer.diskStorage({
//     //     destination: function (req, file, cb) {
//     //         cb(null, './uploads/products/thumbnail/')
//     //     },
//     //     filename: function (req, file, cb) {
//     //         cb(null, fileid + '.' + mime.getExtension(file.mimetype))
//     //     }
//     // })
//     // var upload = multer({ storage: storage }).single('thumbnail');
//     // upload(req, res, function (err) {
//     //     if (err) {
//     //         // An error occurred when uploading
//     //         console.log(err);
//     //         return res.status(422).send("an Error occured")
//     //     }
//     //     res.status(200).send({ "data": req.file.filename });
//     // });
// });

router.post('/saveProduct', authorize,async function (req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var longdescription = req.body.longdescription;
    var emailtemplate = req.body.emailtemplate;
    var smstemplate = req.body.smstemplate;
    var whatsapptemplate = req.body.whatsapptemplate;
    var status = req.body.status;
    var price = req.body.price;
    var unit = req.body.unit;
    var thumbnailfile = req.body.thimage;
    var document = req.body.document;
    var userid = req.query.tknuserid;
    var actual_qty = req.body.actual_qty;
    var hsn = req.body.hsn;
    var amount = req.body.amount;
    var gst = req.body.gst;
    var web_url = req.body.web_url;
    //console.log(req.body);
    var extraitems = req.body.attributes;
    var userrole = req.query.tknuserrole;
    //req.body.created_by = userid;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
    } else {
        var managerid = userid
    }
    fdata = {
        actual_qty: actual_qty, hsn: hsn, amount: amount,
        product_name: name, product_desc: description, product_long_desc: longdescription, sms_template: smstemplate, email_template: emailtemplate, product_status: status, account_id: userid, whatsapp_template: whatsapptemplate, unit: unit, price: price, product_thumbnail: thumbnailfile, User_id: userid,
        gst: gst,product_document:document,web_url:web_url
    };
    //fdata = { account_type: 1, account_name: name, account_password: password, email: email, mobile: mobile, created_by: created_by, create_date: m };
    Products.insertproduct(fdata, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            var productid = rows.insertId;
            if (extraitems != undefined && extraitems.length > 0) {
                extraitems.forEach(item => {
                    //console.log(item.otherkey + "====" + item.othervalue + "====" + conid)
                    Products.SaveAttributeMeta(item.otherkey, item.othervalue, productid, managerid)
                });
            }
            res.status(200).send({ "data": 'Product saved succesfully.' });
        }

    })
})

router.get('/getproductdetail/:id', authorize,async function (req, res) {
    Products.getProductDetail(req.params.id,async function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            if (rows.length > 0) {
                productid = rows[0].productid
                metadata = await Products.getproductallattribute(productid)
                console.log(metadata);
                rows[0]['metadata'] = metadata
            }
            res.status(200).send({ "data": rows[0] });
        }
    });
});


router.get('/getproductemail/:id', authorize, async function (req, res) {
    Products.getProductEmailDetail(req.params.id, async function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    });
});

router.get('/getproductsms/:id', authorize, async function (req, res) {
    Products.getProductSMSDetail(req.params.id, async function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    });
});

router.get('/getproductwhatsapp/:id', authorize, async function (req, res) {
    Products.getProductWhatsappDetail(req.params.id, async function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    });
});

router.get('/getproductpreview/:id', async function (req, res) {
    Products.getProductDetail(req.params.id, async function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    });
});

router.post('/updateProduct', authorize,async function (req, res) {
    var productid = req.body.productid;
    var name = req.body.name;
    var description = req.body.description;
    var longdescription = req.body.longdescription;
    var emailtemplate = req.body.emailtemplate;
    var smstemplate = req.body.smstemplate;
    var whatsapptemplate = req.body.whatsapptemplate;
    var status = req.body.status;
    var price = req.body.price;
    var unit = req.body.unit;
    var thumbnailfile_1 = req.body.thimage;
    var document = req.body.document;
    var gst = req.body.gst;
    var web_url = req.body.web_url;
    var p_thumbnail = req.body.product_thumbnail;
    var product_document = req.body.product_document;

    if (p_thumbnail && p_thumbnail!=thumbnailfile_1) {
        var thumbnailfile = p_thumbnail;
        const path = './uploads/products/thumbnail/' + p_thumbnail;
        fs.unlinkSync(path);
        var thumbnailfile = thumbnailfile_1;
    }
    if (product_document && product_document!=document) {
        const path = './uploads/products/docs/' + product_document;
        fs.unlinkSync(path);
    }

    var userid = req.query.tknuserid;
    var userrole = req.query.tknuserrole;
    //req.body.created_by = userid;
    if (userrole == 1) {
        var managerid = await helper.GetManagerIdByAgent(userid)
    } else {
        var managerid = userid
    }
    
    var actual_qty = req.body.actual_qty;
    var hsn = req.body.hsn;
    var amount = req.body.amount;
    var extraitems = req.body.attributes;
    fdata = {
        actual_qty: actual_qty, hsn: hsn, amount: amount,
        productid: productid, product_name: name, product_desc: description, product_long_desc: longdescription, sms_template: smstemplate, email_template: emailtemplate, product_status: status, account_id: userid, whatsapp_template: whatsapptemplate, unit: unit, price: price, product_thumbnail: thumbnailfile_1
        , gst: gst,web_url:web_url,product_document:document
    };
    //console.log(fdata);
    Products.updateproduct(fdata, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });

        }
        else {
            var productid = req.body.productid;
            if (extraitems != undefined && extraitems.length > 0) {
                extraitems.forEach(item => {
                    //console.log(item.otherkey + "====" + item.othervalue + "====" + conid)
                    Products.SaveAttributeMeta(item.otherkey, item.othervalue, productid, managerid)
                });
            }
            res.status(200).send({ "data": 'Product updated succesfully.' });
        }
    })
})

//Get Agent top 20 Recent Call 
router.get('/getagentproducts/', authorize, function (req, res) {
    var id = req.query.tknuserid;
    Products.getagentproducts(id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": [] });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/saveProductImages', authorize, function (req, res) {
    console.log("data");
    console.log(JSON.stringify(req.body));
    var m = new Date();
    var fileid = 'product' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/products/images/')
        },
        filename: function (req, file, cb) {
            cb(null, fileid + '.' + mime.getExtension(file.mimetype))
        }
    })
    var upload = multer({ storage: storage }).single('uploadedImage');
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            return res.status(422).send("an Error occured")
        }
        //res.status(200).send({ "data": req.file.filename });
    });
});


router.post('/updateproductimages', authorize, function (req, res) {
    var m = new Date();
    var fileid = 'PRODUCT' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/products/images')
        },
        filename: function (req, file, cb) {
            cb(null, fileid + '.' + mime.getExtension(file.mimetype))
        }
    })
    var upload = multer({ storage: storage }).single('image');
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            res.status(422).send("an Error occured")
        }
        // No error occured.
        var userid = req.body.userid;

        var productid = req.body.product_id;
        imagefilename = req.file.filename;


        fdata = { product_image: imagefilename, product_id: productid }
        Products.addproductimages(fdata, function (err, rows) {
            if (err) {
                console.log(err);
                res.status(400).json(err);
            }
            else {
                console.log("Rows");
                console.log(JSON.stringify(rows));
                res.status(200).send({ "data": 'Product Images uploaded succesfully.' });
            }
            // res.json({error_code:0,err_desc:null});
        });

    });

});

router.post('/updateproductdocs', authorize, function (req, res) {
    var m = new Date();
    var fileid = 'PRODUCT' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/products/docs')
        },
        filename: function (req, file, cb) {
            cb(null, fileid + '.' + mime.getExtension(file.mimetype))
        }
    })
    var upload = multer({ storage: storage }).single('image');
    upload(req, res, function (err) {
        if (err) {
            // An error occurred when uploading
            console.log(err);
            res.status(422).send("an Error occured")
        }
        // No error occured.
        var userid = req.body.userid;

        var productid = req.body.product_id;
        imagefilename = req.file.filename;


        fdata = { product_doc: imagefilename, product_id: productid }
        Products.addproductdocs(fdata, function (err, rows) {
            if (err) {
                console.log(err);
                res.status(400).json(err);
            }
            else {
                console.log("Rows");
                console.log(JSON.stringify(rows));
                res.status(200).send({ "data": 'Product Document uploaded succesfully.' });
            }
            // res.json({error_code:0,err_desc:null});
        });

    });

});

router.get('/getproductimageformdata/:id', function (req, res) {
    //console.log(req.params.id)
    Products.getproductimagedata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })

})

router.get('/getproductdocformdata/:id', function (req, res) {
    //console.log(req.params.id)
    Products.getproductdocdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })

})

router.get('/getproductdocformdata/:id', function (req, res) {
    //console.log(req.params.id)
    Products.getproductdocdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })

})

router.post('/deleteproductimages', authorize, function (req, res) {
    if (req.body.image && req.body.image != '') {
        const path = './uploads/products/thumbnail/' + req.body.image;
        fs.unlinkSync(path);
    }


    Products.deleteproductimage(req.body.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(400).json(err);
        }
        else {
            console.log("Rows");
            console.log(JSON.stringify(rows));
            res.status(200).send({ "data": 'Product Image deleted succesfully.' });
        }
        // res.json({error_code:0,err_desc:null});
    });

});

router.post('/deleteproductdocs', authorize, function (req, res) {
    if (req.body.image && req.body.image != '') {
        const path = './uploads/products/docs/' + req.body.image;
        fs.unlinkSync(path);
    }


    Products.deleteproductdoc(req.body.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(400).json(err);
        }
        else {
            console.log("Rows");
            console.log(JSON.stringify(rows));
            res.status(200).send({ "data": 'Product Document deleted succesfully.' });
        }
        // res.json({error_code:0,err_desc:null});
    });

});

router.get('/getproductpreviewimages/:id', function (req, res) {
    //console.log(req.params.id)
    Products.getproductimagedata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })

})

router.get('/getproductpreviewdocs/:id', function (req, res) {
    //console.log(req.params.id)
    Products.getproductdocdata(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })

})

//Email send for product
router.post('/agentProductEmail', authorize, async function (req, res) {
    //console.log("body");
    //console.log(JSON.stringify(req.body));


    var template_id = req.body.template_id;
    var agent_id = req.body.agent_id;
    var email_to = req.body.email;
    var subject = req.body.subject;
    var product_id = req.body.product_id;

    var url = 'http://products.cloudX.in/product/' + product_id;
    var body = req.body.email_template;
    var fdata = { template_id: template_id, agent_id: agent_id, email_to: email_to, subject: subject, product_id: product_id };

    var short_link = await helper.CreateShortLink(url);
    if (short_link == undefined) {
        var meeting_link = url;
    } else {
        var meeting_link = "https://slss.in/" + short_link;
    }


    let info = {
        from: frommail, // sender address
        to: req.body.email, // list of receivers
        subject: req.body.subject, // Subject line
        text: "", // plain text body
        html: "Product URL :" + meeting_link + body, // html body
    };


    transporter.sendMail(info, function (error, info) {
        if (error) {
            console.log("error");
            console.log(JSON.stringify(error));
        } else {
            Products.insertagentproductemail(fdata, function (err, rows) {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).send({ "msg": 'data saved succesfully.' });
                }
            });
        }
    });

})

//SMS send for product
router.post('/agentProductSMS', authorize, async function (req, res) {
    var message;
    var template_id = req.body.template_id;
    var agent_id = req.body.agent_id;
    var sms_to = req.body.sms_to;
    var subject = req.body.subject;
    var product_id = req.body.product_id;
    var sms_text = req.body.sms_template.changingThisBreaksApplicationSecurity;

    var url = 'http://products.cloudX.in/product/' + product_id;

    var short_link = await helper.CreateShortLink(url);
    if (short_link == undefined) {
        var meeting_link = url;
    } else {
        var meeting_link = "https://slss.in/" + short_link;
    }
    sms_text = sms_text + ',Product Url : ' + meeting_link;


    var fdata = { sms_to: sms_to, template_id: template_id, product_id: product_id, agent_id: agent_id };


    Call.getschedulemeeting(agent_id, function (err, rows) {
        if (err) {
            console.log("Error");
            console.log(err);
        } else {

            if (rows.length > 0) {
                var sms_link = rows[0]['server_url'];
                sms_link = sms_link.replace('{mobile}', sms_to)
                sms_link = sms_link.replace('{msg}', sms_text)
                //console.log("sms_link :"+sms_link);
                urllib.request('http://192.168.1.26:3001/api/sendsms/', {
                    method: 'POST',
                    data: { smsurl: sms_link },
                    rejectUnauthorized: false,
                }, async function (error, resp) {
                    if (error) {
                        console.log(error)
                    }
                    else {
                        var sdata = JSON.parse(resp);
                        var sms_status = sdata['data']['state'];
                        var transactionId = sdata['data']['transactionId'];

                        var sms_credit = await helper.CreditSms(sms_text);

                        var sms_data = { account_id: agent_id, mobile: sms_to, text: sms_text, sms_status: sms_status, sms_uid: transactionId, sms_credit: sms_credit };
                        Call.smsreport(sms_data, function (err, rows) {
                            if (err) {
                                console.log(err);
                            } else {
                                //fdata['type'] = 'sms';
                                var dateFormat = require('dateformat');
                                let now = new Date();
                                var day = dateFormat(now, "yyyy-mm-dd H:MM:ss");

                                var mdata = { agent_id: agent_id, link: meeting_link, mobile: sms_to, type: 'sms', mdate: day };
                                Call.schedulemeeting(mdata, function (err, rows) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        Products.insertagentproductsms(fdata, function (err, rows) {
                                            if (err) {
                                                console.log(err);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
                res.status(200).send({ "msg": 'SMS sent successfully !!!' });
                //message = 'SMS sent successfully !!!';
            } else {
                res.status(200).send({ "msg": 'Insufficient SMS balance.' });
                //message = 'Insufficient SMS balance.';
            }
            //res.status(200).send({ "msg": 'Failed to send SMS !!' });    
            //message = 'Failed to send SMS !!';
        }

    });


})

//SMS send for product
router.post('/agentProductWhatsapp', authorize, function (req, res) {
    // console.log("step 2");
    // console.log(JSON.stringify(req.body));
    var template_id = req.body.template_id;
    var agent_id = req.body.agent_id;
    var sms_to = req.body.sms_to;
    var subject = req.body.subject;
    var product_id = req.body.product_id;
    var sms_text = req.body.sms_template.changingThisBreaksApplicationSecurity;

    var url = 'http://products.cloudX.in/product/' + product_id;


    requestify.post('https://slss.in/', {
        url: url
    })
        .then(function (response) {
            var rs = response.getBody();
            var surl = 'https://slss.in/' + rs.url;

            sms_text = sms_text + ', Product Url : ' + surl;

            var sdata = { 'sms_to': sms_to, sms_text: sms_text };
            Products.insertagentproductwhatsapp(fdata, function (err, rows) {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).send({ "data": sdata });
                }
                // console.log(rows)
            });

        });

    var fdata = { sms_to: sms_to, template_id: template_id, product_id: product_id, agent_id: agent_id };




})


router.post('/saveproductgroup', authorize, function (req, res) {
    console.log(req.body);
    var group_name = req.body.name;
    var User_id = req.query.tknuserid;
    fdata = {
        group_name: group_name, user_id: User_id
    };
    Products.saveproductgroupData(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": ' saved succesfully.' });
        }
    })
})


router.post('/updatproductgroupData', authorize, function (req, res) {
    var group_name = req.body.name;
    var User_id = req.query.tknuserid;
    var pg_id = req.body.pg_id;
    fdata = {
        group_name: group_name, user_id: User_id, pg_id: pg_id
    };
    Products.updatproductgroupData(fdata, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": ' Updated succesfully.' });
        }
    })
})

router.get('/deleteproductgroup/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Products.deleteproductgroup(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": ' data deleted successfully' });
        }
    })
})


router.get('/getproductgroup/:id', authorize, function (req, res) {
    var account_id = req.query.tknuserid
    Products.getproductgroup(account_id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})




router.get('/updateproductgroup/:id', function (req, res) {
    Products.updateproductgroup(req.params.id, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).send({ "data": rows[0] });
        }
    });
});


router.get('/getProductsgroup/:id', authorize, function (req, res) {
    var id = req.params.id;
    var account_id = req.query.tknuserid
    let data = { 'User_id': account_id, 'group_id': id }
    Products.getproductbygroup(data, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})


router.get('/deleteproduct/:id', authorize, function (req, res) {
    console.log(req.params.id);
    Products.getProductDetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": ' Something went wrong!!' });
        }
        else {
            if (rows.length > 0) {
                if (rows[0].product_thumbnail) {
                    const path = './uploads/products/thumbnail/' + rows[0].product_thumbnail;
                    fs.unlinkSync(path);
                }
                if (rows[0].product_document) {
                    const path = './uploads/products/docs/' + rows[0].product_document;
                    fs.unlinkSync(path);
                }
                Products.deleteproduct(req.params.id, function (err, rows) {
                    if (err) {
                        console.log(err);
                        res.status(200).send({ "data": 'Something went wrong!!' });
                    }
                    else {
                        res.status(200).send({ "data": ' data deleted successfully' });
                    }
                })
            } else {
                res.status(200).send({ "data": 'Product not available!!' });
            }

        }
    })

})


router.post('/deleteproductattribute', authorize,async function (req, res) {
    Products.deleteproductattribute(req.body, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "data": 'Something went wrong!!' });
        }
        else {                        
            res.status(200).send({ "data": 'Product attribute deleted succesfully.' });
        }
    })
})


module.exports = router;
