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
cron.schedule('*/10 * * * * *', () => {
	let date_ob = new Date();
	let hours = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	let seconds = date_ob.getSeconds();
	console.log('running a task every 10 second predictive auto dialer live agent call originate==> '+date_ob+' '+hours+':'+minutes);
    if(hours>8 && hours<19){//       
        //Place Call
        db.query('SELECT rid FROM tf_cdr_live_request WHERE type=1 order by rid asc',[], async function (err, rdata) {
		    if (err) {
				console.log(err);
			}else{
                if(rdata.length>0){
                    var cps = 1;
                    var maxlimit = cps * 10;
                    var numlen = rdata.length;
                    if(numlen>maxlimit) numlen = maxlimit;
                    var loopnum = Math.floor(numlen/cps);
                    if(numlen==1){
                        loopnum = 1
                    }
                    var loopinterval =  0;
                    console.log(loopnum);
                    var secondarysip = await helper.CheckAdminSetting('enable_secondary_sip')
                    console.log('secondarysip',secondarysip)
                    if(loopnum>0){
                        for (let index = 0; index < loopnum; index++) {
                            console.log(loopnum+"=="+index)
                            setTimeout(() => {
                                db.query('SELECT * from tf_cdr_live_request AS R INNER JOIN tf_campaigns C ON R.camid=C.camid WHERE type=1 ORDER BY rid asc limit ?,?',[index,cps], async function (err, ndata) {
                                    if (err) {
                                        console.log(err);
                                    }else{
                                        if(ndata.length>0){
                                            async.forEachOf(ndata,async (num,key, callback) => {
                                                var cammethod = num.cam_method
                                                var dialertype = num.dialer_type
                                                var agentid = num.agent_id
                                                var manager_id = num.manager_id
                                                console.log(agentid)
                                                console.log(cammethod)
                                                console.log(dialertype)
                                                // Live Agent 
                                                if(cammethod==0){
                                                    if(dialertype==1){
                                                        var context = 'cloudX_outgoing_liveagent_pre';
                                                        var number = num.callernumber;
                                                        var callprefix = await helper.GetManagerSettingValueByName(manager_id,'dialer_prefix')
                                                        if(callprefix>=0){}else{callprefix = 0}
                                                        number = number.toString()[0] == callprefix ? number : callprefix+number
                                                        var name = num.callername
                                                        var did = num.did
                                                        if(secondarysip=='yes'){
                                                            did = await helper.CheckAdminSetting('secondary_sip_trunk')
                                                        }
                                                        var numid = num.numid
                                                        var camivrid = num.camivrid
                                                        var camid = num.camid
                                                        const avaiagents =  await helper.getLiveAgent(camid);
                                                        var total = avaiagents.length
                                                        if(total>0){
                                                            var voiceserverdata = await helper.GetManagerVoiceServerData(manager_id)
                                                            const askrestapi = new awry.API({
                                                                baseUrl: voiceserverdata.ari_url,
                                                                username: voiceserverdata.ari_username,
                                                                password: voiceserverdata.ari_password,
                                                            });
                                                            var connectmethod = await helper.GetManagerSettingValueByName(manager_id,'connect_agent_method')
                                                            if(connectmethod==1){
                                                                var agentchannels = await helper.getOnlyAgentVOIP(avaiagents,did,manager_id)
                                                            }else{
                                                                var agentchannels = await helper.getAgentVOIPStatus(avaiagents,did,manager_id)
                                                            }
                                                            var rs = agentchannels.join('&')
                                                            var rs1 = Object.keys(avaiagents).map(function(k){return avaiagents[k].mobile}).join("&");
                                                            var params = { 'endpoint': 'PJSIP/'+number+'@SM'+did,callerId: did, extension: number,context: context,variables:{"DID":did,"NUMID":String(numid),"CallerNumber":number,"CallerName":name,"accountid": String(manager_id),"MembersCount":String(total),"MembersChannels":rs,"MembersMobiles":rs1,"CallType":"dialer"}};
                                                            askrestapi.channels.originate(params).then(async results => {
                                                                //console.log(results.data)
                                                                var chdata = results.data
                                                                var did = num.did
                                                                const conid =  await helper.GetcontidByNumid(numid);
                                                                var cdrdata = {uniqueid:chdata.id,channel:chdata.name,accountid:manager_id,DID:did,serviceid:9,servicevalue:camid,CallStartTime:new Date(),CallerType:0,CallerName:name,CallerNumber:number,CallTypeID:1,CallType:'dialer',CdrStatus:3,auto_numid:numid,cont_id:conid}
                                                                console.log(cdrdata)
                                                                helper.insertcdr(cdrdata, function (err, result) {
                                                                    if (err)  return  console.log(err)
                                                                    cdrid = result.insertId
                                                                })
                                                                db.query('delete from tf_cdr_live_request WHERE rid=?',[num.rid]);   
                                                                console.log(manager_id+'=='+did+'=='+number+'('+name+')==>File is created successfully.'+numid+'-'+number+'.call'+"=="+new Date());
                                                                db.query('update tf_campaigns_numbers set status=1,r_status=1 WHERE numid=?',[numid]);
                                                            }).catch(function(err) {
                                                                console.log(err)
                                                                db.query('delete from tf_cdr_live_request WHERE rid=?',[num.rid]);   
                                                                db.query('update tf_campaigns_numbers set r_status=0 WHERE numid=?',[numid]);
                                                            });
                                                        }else{
                                                            db.query('delete from tf_cdr_live_request WHERE rid=?',[num.rid]);   
                                                            db.query('update tf_campaigns_numbers set r_status=0 WHERE numid=?',[numid]);
                                                        }
                                                    }
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
                    console.log("No pending Agent call request")
                }
            }
        })
    }

    // if(hours<8 || hours>19){
    //     db.query('update tf_campaigns set cam_action="2" WHERE cam_action="1"',[]);
    // }
});
