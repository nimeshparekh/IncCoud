var cron = require('node-cron');
var db = require('../../database/db');
var fs    = require("fs");
var moment = require('moment');
const delay = require('delay');
const awry = require('awry');
var Automodel = require('../autodialerModel');
var async = require("async");
require("dotenv").config();
var helper = require('./helper')
//Live Agent Progressive Dialer
cron.schedule('*/20 * * * * *', () => {
	let date_ob = new Date();
	let hours = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	console.log('running a task every 20 second progressive dialer live agent bucket==> '+date_ob+' '+hours+':'+minutes);
	if(hours>8 && hours<19){
	  // Generate Call Request	
	  db.query('SELECT camid,cam_name,account_id,cam_method,cam_status,cam_ivrid,dialer_type from tf_campaigns WHERE cam_status!="2" and cam_action=1 and cam_type=0 and cam_method=0 and dialer_type="0" ORDER BY create_date asc',[], async function (err, camdata) {
		  if (err) {
				console.log(err);
			 }else{
			  if(camdata.length>0){
				  console.log('Live agent progressive campaign');
				  async.forEachOf(camdata,async (cam, callback) => {
					  try {
						  	var camname = cam.cam_name
							var agentcamid = cam.camid;
							var customerid = cam.account_id;
							var status = cam.cam_status;
							var dialertype = cam.dialer_type;
							var fetchaccountdata = await helper.checkAccountExpiry(customerid)
							if(fetchaccountdata.length>0){
								var userbalance = 1 //await helper.CheckUserMintuteBalance(customerid)
								if(userbalance>0){
									var callprefix = await helper.GetManagerSettingValueByName(customerid,'dialer_prefix')
									if(callprefix>=0){}else{callprefix = 0}
									if(status==0){
										db.query('update tf_campaigns set cam_status="1" WHERE camid=?',[agentcamid]);
									}
									console.log(agentcamid+'=='+customerid)
									helper.getChannel(agentcamid,customerid, async function (err, cdata) {
										if (err) {
											console.log(err);
										}else{
											if(cdata.length>0){
												var chdata = cdata[0]							  
												var totalchannels = chdata.channels;
												var camdid = chdata.did;
												var runningchannel = chdata.rchannel;
												var avaichannels = totalchannels - runningchannel
												console.log(avaichannels)
												if(avaichannels>0){
													const avaiagents =  await helper.getLiveAgent(agentcamid);
													var numlen = avaiagents.length;
													console.log(avaiagents)
													db.query('SELECT CN.numid,CN.account_id,CN.totaltry,C.mobile,C.name from tf_campaigns_numbers CN INNER JOIN tf_contacts C ON CN.cont_id=C.cont_id WHERE CN.status=0 and CN.r_status=0 and CN.totaltry<3 and CN.cam_id = ? AND C.is_mobile_dnd = "no" AND C.mobile NOT IN (SELECT number FROM `tf_block_number` ) ORDER BY CN.date,CN.totaltry ASC limit ?',[agentcamid,numlen], async function (err, ndata) {
														if (err) {
															console.log(err);
														}else{
															if(ndata.length>0){
																async.forEachOf(ndata,async (num,key, callback) => {
																	try {
																		var numid = num.numid;
																		var number = num.mobile;
																		var manager_id = num.account_id
																		number = number.toString()[0] == callprefix ? number : callprefix+number
																		if(num.name && num.name!=null){
																			var name = num.name
																		}else{
																			var name = num.mobile
																		}
																		var agentdid = camdid
																		if(avaiagents.length>0){
																			var AgentName = avaiagents[key].account_name
																			console.log(AgentName);
																			var AgentNumber = avaiagents[key].mobile
																			var AgentID = avaiagents[key].account_id
																			var lastcall = await helper.getAgentLastcall(AgentID)
																			if(lastcall.length>0){
																				var laststatus = lastcall[0].CdrStatus
																				var lastdate = lastcall[0].CallEndTime
																				var wrapuptime = lastcall[0].WrapUpTime*60
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
																					var diff = 0;
																				}
																			}else{
																				var lastdate = new Date()
																				var diff = 0
																				var wrapuptime = 0
																			}
																			console.log(diff+"-------"+wrapuptime)
																			if(diff>=wrapuptime || wrapuptime==0){
																				var rdata = {callernumber:number,callername:name,did:agentdid,numid:numid,manager_id:manager_id,camid:agentcamid,agent_id:AgentID,type:0}
																				helper.insertlivecdrrequest(rdata, function (err, result) {
																					if (err)  return  console.log(err)
																					console.log(manager_id+'=='+agentdid+'=='+AgentName+'=='+number+'('+name+')==>Request is created successfully.'+numid+'-'+number+'.call');
																				})
																				db.query('update tf_campaigns_numbers set r_status=1 WHERE numid=?',[numid]);
																			}
																		}
																	}catch (e) {
																		console.log(e);
																	}
																})
															}else{
																db.query('SELECT * from tf_campaigns_numbers CN INNER JOIN tf_contacts C ON CN.cont_id=C.cont_id WHERE CN.status=0 and CN.totaltry<3 and CN.cam_id = ? AND C.is_mobile_dnd = "no" AND C.mobile NOT IN (SELECT number FROM `tf_block_number` ) ORDER BY CN.date,CN.totaltry ASC',[agentcamid], async function (err, ndata) {
																	if (err) {
																		console.log(err);
																	}else{
																		if(ndata.length>0){
																		}else{
																			db.query('update tf_campaigns set cam_status="2",cam_action=2 WHERE camid=?',[agentcamid]);
																			helper.SendPanelNotification(customerid,'cloudX Alert','Campaign '+camname+' completed successfully!')
																			//helper.SendFirebaseNotification(customerid,'cloudX Alert','Campaign '+camname+' completed successfully!')
																		}
																	}
																})
															}
														}
													})
												}else{
													helper.SendPanelNotification(customerid,'cloudX Alert','All agents busy to generate call request')
												}
											}
										}
									})	
								}else{
									helper.SendPanelNotification(customerid,'cloudX Alert','You have insufficient balance to run campaign.please recharge to continue')
									console.log("Insufficient balance");
								}
							}else{
								helper.SendPanelNotification(customerid,'cloudX Alert','You try to run campaign but your account was expired!')
								console.log("Account not active");
							}
					  } catch (e) {
						  console.log(e);
					  }
				  }, err => {
					  if (err) console.error(err.message);
				  });						
			  }
		  }
	  });

	  //Schedule Campaign Check
	  let nowday = date_ob.getDay()
	  console.log('nowday ',nowday)
	  var weekdayArr = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
	  var weekday = weekdayArr[nowday]
	  console.log('weekday ',weekday)
	  db.query('SELECT S.*,CURRENT_TIME from tf_campaigns C INNER JOIN tf_campaign_schedule S ON C.camid=S.campaignid WHERE C.cam_status!="2" and C.cam_type=0 and C.cam_method=0 and S.'+weekday+'="1" and S.OpenTime <= CURRENT_TIME and S.CloseTime >= CURRENT_TIME ORDER BY camid asc',[], async function (err, camdata) {
		if (err) {
			console.log(err);
		}else{
			if(camdata.length>0){
				async.forEachOf(camdata,async (scheduledata,key, callback) => {
					var campaignid = scheduledata.campaignid
					db.query('update tf_campaigns set cam_action="1" WHERE camid=?',[campaignid]);
				})
			}
		}
	  })

	  db.query('SELECT S.*,CURRENT_TIME from tf_campaigns C INNER JOIN tf_campaign_schedule S ON C.camid=S.campaignid WHERE C.cam_status!="2" and C.cam_type=0 and C.cam_method=0 and S.'+weekday+'="1" and C.cam_action=1 and S.CloseTime <= CURRENT_TIME ORDER BY camid asc',[], async function (err, camdata) {
		if (err) {
			console.log(err);
		}else{
			if(camdata.length>0){
				async.forEachOf(camdata,async (scheduledata,key, callback) => {
					var campaignid = scheduledata.campaignid
					db.query('update tf_campaigns set cam_action="2" WHERE camid=?',[campaignid]);
				})
			}
		}
	  })
				
    }
});