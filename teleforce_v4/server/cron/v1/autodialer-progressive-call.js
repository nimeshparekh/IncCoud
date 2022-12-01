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
	console.log('running a task every 10 second progressive auto dialer live agent call originate==> '+date_ob+' '+hours+':'+minutes);
    if(hours>8 && hours<19){//       
        //Place Call
        db.query('SELECT rid FROM tf_cdr_live_request WHERE type=0 order by rid asc',[], async function (err, rdata) {
		    if (err) {
				console.log(err);
			}else{
                if(rdata.length>0){
                    var cps = 1;
                    var maxlimit = cps * 10
                    var numlen = rdata.length
                    ;if(numlen>maxlimit) numlen = maxlimit
                    var loopnum = Math.floor(numlen/cps);
                    var loopinterval =  0;
                    console.log(loopnum);
                    var secondarysip = await helper.CheckAdminSetting('enable_secondary_sip')
                    console.log('secondarysip',secondarysip)
                    if(loopnum>0){
                        for (let index = 0; index < loopnum; index++) {
                            console.log(loopnum+"=="+index)
                            setTimeout(() => {
                                db.query('SELECT * from tf_cdr_live_request AS R INNER JOIN tf_campaigns C ON R.camid=C.camid WHERE type=0 ORDER BY rid asc limit ?,?',[index,cps], async function (err, ndata) {
                                    if (err) {
                                        console.log(err);
                                    }else{
                                        if(ndata.length>0){
                                            async.forEachOf(ndata,async (num,key, callback) => {
                                                var cammethod = num.cam_method
                                                var dialertype = num.dialer_type
                                                var agentid = num.agent_id
                                                console.log(agentid)
                                                console.log(cammethod)
                                                console.log(dialertype)
                                                // Live Agent 
                                                if(cammethod==0){
                                                    if(dialertype==0){
                                                        var context = 'cloudX_outgoing_liveagent';
                                                        var number = num.callernumber;
                                                        var manager_id = num.manager_id
                                                        var callprefix = await helper.GetManagerSettingValueByName(manager_id,'dialer_prefix')
                                                        if(callprefix>=0){}else{callprefix = 0}
                                                        number = number.toString()[0] == callprefix ? number : callprefix+number
                                                        var name = num.callername
                                                        var did = num.did
                                                        if(secondarysip=='yes'){
                                                            did = await helper.CheckAdminSetting('secondary_sip_trunk')
                                                        }
                                                        var numid = num.numid
                                                        console.log(numid)
                                                        var camivrid = num.camivrid
                                                        var camid = num.camid
                                                        const agentsdata =  await helper.getAgentData(agentid);
                                                        console.log(agentsdata)
                                                        const lastcalldata =  await helper.getAgentLastCallStatus(agentid);
                                                        var diff = 0
                                                        var wrapuptime = 0
                                                        if(lastcalldata.length>0){
                                                            var laststatus = lastcalldata[0].agent_status
                                                            var lastdate = lastcalldata[0].last_updated
                                                            var wrapuptime = lastcalldata[0].WrapUpTime*60
                                                            var nowdate = new Date()
                                                            if(laststatus==0){
                                                                var lastcalltime = moment(lastdate, 'YYYY-MM-DD HH:mm:ss')
                                                                var nowtime = moment(nowdate, 'YYYY-MM-DD HH:mm:ss')
                                                                var diff = nowtime.diff(lastcalltime, 'seconds')
                                                                if(lastdate=='0000-00-00 00:00:00'){
                                                                    diff = wrapuptime
                                                                }
                                                                console.log(diff+">"+wrapuptime)	
                                                            }else{
                                                                var diff = 0
                                                            }
                                                        }
                                                        if(agentsdata.length>0 && diff>=wrapuptime){
                                                            var AgentNumber = agentsdata[0].mobile
                                                            AgentNumber = AgentNumber.toString()[0] == callprefix ? AgentNumber : callprefix+AgentNumber
                                                            var AgentName = agentsdata[0].account_name
                                                            var connectmethod = await helper.GetManagerSettingValueByName(manager_id,'connect_agent_method')
                                                            var agentconnectmethod = 0
                                                            if(connectmethod==1){
                                                                agentconnectmethod = 1
                                                                var agentchannels = await helper.getOnlyAgentVOIP([{account_name:AgentName,mobile:AgentNumber}],did,manager_id)
                                                            }else{
                                                                var agentchannels = await helper.getAgentVOIPStatus([{account_name:AgentName,mobile:AgentNumber}],did,manager_id)
                                                                agentconnectmethod = agentchannels[0].includes('@')?0:1
                                                            }
                                                            console.log(manager_id,' == agent = '+agentchannels)
                                                            if(agentchannels.length>0 && agentchannels[0]!=''){
                                                                var voiceserverdata = await helper.GetManagerVoiceServerData(manager_id)
                                                                const askrestapi = new awry.API({
                                                                    baseUrl: voiceserverdata.ari_url,
                                                                    username: voiceserverdata.ari_username,
                                                                    password: voiceserverdata.ari_password,
                                                                });
                                                                console.log(voiceserverdata)
                                                                var params = { 'endpoint': agentchannels[0]+'@1234',callerId: did, extension: AgentNumber,context: context,variables:{"DID":did,"NUMID":String(numid),"CallerNumber":number,"CallerName":name,"AgentID":String(agentid),"AgentName":AgentName,"AgentNumber":AgentNumber,"accountid": String(manager_id),"MemberChannel":"PJSIP/"+number+"@SM"+did,"CallType":"dialer"}};
                                                                askrestapi.channels.originate(params).then(async results => {
                                                                    //console.log(results.data)
                                                                    var chdata = results.data
                                                                    var did = num.did
                                                                    const conid =  await helper.GetcontidByNumid(numid);
                                                                    var cdrdata = {uniqueid:chdata.id,channel:chdata.name,accountid:manager_id,DID:did,serviceid:9,servicevalue:camid,CallerType:0,CallStartTime:new Date(),CallerName:name,CallerNumber:number,AgentID:agentid,AgentName:AgentName,AgentNumber:AgentNumber,CallTypeID:1,CallType:'dialer',CdrStatus:3,auto_numid:numid,AgentStatus:"CALLING",agent_connect:agentconnectmethod,cont_id:conid}
                                                                    helper.insertcdr(cdrdata, function (err, result) {
                                                                        var cdrid = result.insertId
                                                                        helper.UpdateAgentLiveStatus({account_id:manager_id,agent_status:3,cdr_id:cdrid},agentid)
                                                                    })
                                                                    db.query('delete from tf_cdr_live_request WHERE rid=?',[num.rid]);   
                                                                    console.log(AgentName+"==="+manager_id+'=='+did+'=='+number+'('+name+')==>File is created successfully.'+numid+'-'+number+'.call'+"=="+new Date());
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
});