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
	console.log('running a task every 10 second textaudio auto dialer call originate==> '+date_ob+' '+hours+':'+minutes);
    if(hours>8 && hours<23){// 
        db.query('SELECT nid FROM tf_textaudio_numbers WHERE status=0 order by nid asc',[], async function (err, rdata) {
		    if (err) {
				console.log(err);
			}else{
                if(rdata.length>0){
                    var cps = 1;
                    var maxlimit = cps * 60;
                    var numlen = rdata.length;
                    if(numlen>maxlimit) numlen = maxlimit;
                    var loopnum = Math.floor(numlen/cps);
                    var loopinterval =  0;
                    console.log(loopnum);
                    if(loopnum>0){
                        for (let index = 0; index < loopnum; index++) {
                            console.log(loopnum+"=="+index)
                            setTimeout(() => {
                                db.query('SELECT * from tf_textaudio_numbers  WHERE status=0 ORDER BY nid asc limit ?,?',[index,cps], async function (err, ndata) {
                                    if (err) {
                                        console.log(err);
                                    }else{
                                        if(ndata.length>0){
                                            async.forEachOf(ndata,async (num,key, callback) => {
                                                var context = 'cloudX_outgoing_textaudio';
                                                var accountid = num.accountid;
                                                var number = num.mobile;
                                                number = number.toString()[0] == 0 ? number : '0'+number
                                                var script_text = num.script_text;
                                                var language = num.language;
                                                var numid = num.nid
                                                var did = await helper.Getoutgoingdid(accountid)
                                                if(did!=''){
                                                    var voiceserverdata = await helper.GetManagerVoiceServerData(accountid)
                                                    const askrestapi = new awry.API({
                                                        baseUrl: voiceserverdata.ari_url,
                                                        username: voiceserverdata.ari_username,
                                                        password: voiceserverdata.ari_password,
                                                    });
                                                    var params = { 'endpoint': 'PJSIP/'+number+'@SM'+did,callerId: did, extension: 's',context: context,variables:{"DID":did,"NUMID":String(numid),"CallerNumber":number,"CallerName":number,"accountid": String(accountid),"ScriptText":script_text,"Language":language,"CallType":"dialer"}};
                                                    askrestapi.channels.originate(params).then(results => {
                                                        //console.log(results.data)
                                                        var chdata = results.data
                                                        var cdrdata = {uniqueid:chdata.id,channel:chdata.name,accountid:accountid,DID:did,serviceid:9,CallStartTime:new Date(),CallerType:0,CallerName:number,CallerNumber:number,CallTypeID:1,CallType:'dialer',CdrStatus:3,auto_numid:numid}
                                                        helper.insertcdr(cdrdata, function (err, result) {
                                                            if (err)  return  console.log(err)
                                                            cdrid = result.insertId
                                                        })
                                                        db.query('update tf_textaudio_numbers set status=1 WHERE nid=?',[numid]);
                                                    }).catch(function(err) {
                                                        console.log(err)
                                                        db.query('update tf_textaudio_numbers set status=1 WHERE nid=?',[numid]);
                                                    });
                                                }
                                            })
                                        }
                                    }
                                })
                            },loopinterval);
                            loopinterval = 1000*(index+1)
                        }
                    }
                }else{
                    console.log("No pending textaudio call request")
                }
            }
        })
    }
})