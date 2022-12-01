var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var session = require('express-session');
var Payment = require('../model/payment');
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
var async = require("async");
var json2xls = require('json2xls');
var crypto = require('crypto');
var urllib = require('urllib');
var Default = require('../model/default');

// Read HTML Template
var html = fs.readFileSync('invoice.html', 'utf8');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({ resave: false, secret: '123456', saveUninitialized: true, cookie: { maxAge: 60000 } }));

router.get('/getPaymentData', authorize, function (req, res) {    
    Payment.getpaymentransactiondata(0, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})
//get plan detail by manager id
router.post('/searchPaymentTransaction', authorize, function (req, res) {
    //const data = req.body;
    var dateObj = new Date(req.body.startdate);
    req.body.startdate = dateObj.getFullYear() + '-' + ('0' + (dateObj.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj.getDate()).slice(-2);
    var dateObj1 = new Date(req.body.enddate);
    req.body.enddate =  dateObj1.getFullYear() + '-' + ('0' + (dateObj1.getMonth() + 1)).slice(-2) + '-' + ('0' + dateObj1.getDate()).slice(-2);
    
    Payment.searchpaymentransaction(req.body, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/gethash', function(req, res){
	var data = req.body;
	var cryp = crypto.createHash('sha512');
	var text = 'M9Gf1lTf|'+data.txnid+'|'+data.amount+'|'+data.pinfo+'|'+data.fname+'|'+data.email+'|'+data.udf1+'||||'+data.udf5+'||||||efR7yq4nIc';
	cryp.update(text);
	var hash = cryp.digest('hex');		
	res.status(200).send(JSON.stringify(hash));	
});


router.post('/success', function(req, res){
	var data = req.body;
	console.log(data)
	var key = 'M9Gf1lTf';
	var salt = 'efR7yq4nIc';
	var pgtype = req.body.pgtype;
	var bank_ref_num = req.body.bank_ref_num;
	var payuMoneyId = req.body.payuMoneyId;
	var txnid = req.body.txnid;
	var amount = req.body.amount;
	var productinfo = req.body.productinfo;
	var firstname = req.body.firstname;
	var email = req.body.email;
	var phone = req.body.phone;	
	var udf5 = req.body.udf5;
    var udf1 = req.body.udf1;
	var mihpayid = req.body.mihpayid;
	var status = req.body.status;
	var resphash = req.body.hash;
	var date = req.body.date
	var address = req.body.address
	var state = req.body.state

	var keyString 		=  	key+'|'+txnid+'|'+amount+'|'+productinfo+'|'+firstname+'|'+email+'|'+udf1+'||||'+udf5+'|||||';
	var keyArray 		= 	keyString.split('|');
	var reverseKeyArray	= 	keyArray.reverse();
	var reverseKeyString=	salt+'|'+status+'|'+reverseKeyArray.join('|');
	
	var cryp = crypto.createHash('sha512');	
	cryp.update(reverseKeyString);
	var calchash = cryp.digest('hex');
	
	
	if(calchash == resphash && status=="success"){
		var msg = 'Transaction Successful and Hash Verified...';		
		var paydata = {txnid: txnid,bank_ref_num:String(bank_ref_num),payuMoneyId:String(payuMoneyId),date:date,amount: amount, mihpayid : String(mihpayid), productinfo: productinfo,firstname: firstname, email: email, status: status,resphash: String(resphash),msg:msg,address:address,state:state}
		var pdata = {txnid: txnid,bank_ref_num:String(bank_ref_num),payuMoneyId:String(payuMoneyId),date:date,amount: amount, mihpayid : String(mihpayid),productinfo: productinfo, firstname: firstname, email: email,mobile:phone,status: status,resphash: String(resphash),msg:msg,address:address,state:state,user:udf1}
		Payment.savepaydata(pdata, function (err, rows) {
			console.log(err);
			if (err) {
				console.log(err);
			}
			else{
				console.log(rows);
                //Update User Status
                Default.gettempuser(udf1, function (err, rows) {
                    if (err) {
                        console.log(err);
                    }
                    else{
                        if(rows.length>0){
                            var userid = rows[0].userid
                            Default.updateplan({pay_status:'paid',pay_date:new Date(),userid:userid},function (err, rows) {

                            })
                        }
                    }
                })
				//Send SMS
				var tonumber = phone
				var message = 'Dear '+firstname+' , Your payment of Rs. '+amount+' received successfully. Your Transaction Reference No. is '+txnid+'.  Team cloudX'
				var url = "https://pgapi.vispl.in/fe/api/v1/send?username=garudaadvsupres.trans&password=0HyUq&unicode=false&from=TELFOR&to="+tonumber+"&text="+message
				urllib.request('http://192.168.1.26:3001/api/sendsms/', {
					method: 'POST',
					data:{smsurl:url},
					rejectUnauthorized: false,
				}, async function(error, resp) {
					if (error){
						console.log(error)
					}
					else
					{
						data = {sms_send:'yes'}
						// Default.updaterequestdemo(lid,data, function (err, rows) {
						// 	if (err) {
						// 		console.log(err);
						// 	}
						// 	console.log(rows)
						// });
					}
				});
				// var toaccounts = '9033524218,7838300009,9999919398'
				// var message = 'Dear Team , Payment of Rs. '+amount+' received successfully from '+firstname+'. Transaction Reference No. is '+txnid+'. Team cloudX'
				// var url = "https://pgapi.vispl.in/fe/api/v1/send?username=garudaadvsupres.trans&password=0HyUq&unicode=false&from=TELFOR&to="+toaccounts+"&text="+message
				// urllib.request('http://192.168.1.26:3001/api/sendsms/', {
				// 	method: 'POST',
				// 	data:{smsurl:url},
				// 	rejectUnauthorized: false,
				// }, async function(error, resp) {
				// 	if (error){
				// 		console.log(error)
				// 	}
				// 	else
				// 	{

				// 	}
				// });

				//Send Email


			}
		})
		res.render(__dirname + '/pay_success.html', paydata);
	}else{
		var msg = 'Payment failed for Hash not verified...';
        Default.gettempuser(udf1, function (err, rows) {
            if (err) {
                console.log(err);
            }
            else{
                if(rows.length>0){
                    var userid = rows[0].userid
                    Default.updateplan({pay_status:'failed',pay_date:new Date(),userid:userid},function (err, rows) {
                        
                    })
                }
            }
        })
		res.render(__dirname + '/pay_failed.html', {txnid: txnid,amount: amount, productinfo: productinfo, 
			firstname: firstname, email: email, mihpayid : mihpayid, status: status,resphash: resphash,msg:msg,date:date,address:address,state:state});
	}
})



module.exports = router;