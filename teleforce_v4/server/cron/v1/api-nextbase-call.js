var cron = require('node-cron');
require("dotenv").config();
var db = require('../../database/db');
var fs    = require("fs");
var moment = require('moment');
const delay = require('delay');
const awry = require('awry');
var Automodel = require('../autodialerModel');
var async = require("async");
var helper = require('./helper')

//IVR 
cron.schedule('*/60 * * * * *', () => {
	let date_ob = new Date();
	let hours = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	let seconds = date_ob.getSeconds();
	console.log('running a task every 60 second nexxbase call originate==> '+date_ob+' '+hours+':'+minutes);
    if(hours>8 && hours<19){//       
        //Place Call
        db.query('SELECT rid FROM tf_cdr_request_nexxbase order by rid asc',[], async function (err, rdata) {
		    if (err) {
				console.log(err);
			}else{
                if(rdata.length>0){
                    var cps = 1;
                    var maxlimit = cps * 60
                    var numlen = rdata.length
                    ;if(numlen>maxlimit) numlen = maxlimit
                    var loopnum = Math.floor(numlen/cps);
                    var loopinterval =  0;
                    console.log(loopnum);
                    if(loopnum>0){
                        for (let index = 0; index < loopnum; index++) {
                            console.log(loopnum+"=="+index)
                            setTimeout(() => {
                                db.query('SELECT * from tf_cdr_request_nexxbase ORDER BY rid asc limit ?,?',[index,cps], async function (err, ndata) {
                                    if (err) {
                                        console.log(err);
                                    }else{
                                        if(ndata.length>0){
                                            async.forEachOf(ndata,async (num,key, callback) => {
                                                var mobile = num.mobile
                                                var did = num.did
                                                var manager_id = num.manager_id
                                                var voiceserverdata = await helper.GetManagerVoiceServerData(manager_id)
                                                const askrestapi = new awry.API({
                                                    baseUrl: voiceserverdata.ari_url,
                                                    username: voiceserverdata.ari_username,
                                                    password: voiceserverdata.ari_password,
                                                });
                                                var ivrid = num.ivrid
                                                var inputcode = num.inputcode
                                                var ticketdata = num.ticketdata
                                                var params = { 'endpoint': 'PJSIP/'+mobile+'@SM'+did,callerId: did, extension: 's',context: 'cloudX_outgoing_ivr',priority:1,variables:{"DID":did,"NUMID":"0","CallerNumber":mobile,"CallerName":mobile,"accountid": String(manager_id),"IVRID":String(ivrid),"CallType":"dialer","Archive": 'yes'}};
                                                console.log('params',params)
                                                askrestapi.channels.originate(params).then(results => {
                                                    //console.log(data)
                                                    var chdata = results.data
                                                    var cdrdata = { uniqueid: chdata.id, channel: chdata.name, accountid: manager_id, DID: did, serviceid: 9,servicevalue: ivrid, CallerType: 1, CallerName: mobile, CallerNumber: mobile, CallTypeID: 1, CallType: 'dialer', CdrStatus: 3}
                                                    helper.insertcdr(cdrdata, function (err, result) {
                                                        var cdrid = result.insertId
                                                        //
                                                        if(inputcode>0){
                                                            mobile = mobile.substr(-10)
                                                            var apidata = {account_id:manager_id,input_digit:inputcode,cdr_id:cdrid,mobile:mobile,data:JSON.stringify(ticketdata)}
                                                            helper.insertapidata(apidata, function (err, result) {
                                                                console.log(err)
                                                            })    
                                                        }
                                                        console.log("Call originate succesfully")
                                                        db.query('delete from tf_cdr_request_nexxbase WHERE rid=?',[num.rid]);   
                                                        //res.status(200).send({ "msg": "Call originate succesfully.",'id': cdrid });
                                                    })
                                                }).catch(function (err) {
                                                    console.log('not originate',err)
                                                    //res.status(200).send({ "msg": 'Something went wrong!' });
                                                });
                                            })
                                        }
                                    }
                                })
                            },loopinterval);
                            loopinterval = 1000*(index+1)
                        }
                    }
                }else{
                    console.log("No pending  call request")
                }
            }
        })
    }
});