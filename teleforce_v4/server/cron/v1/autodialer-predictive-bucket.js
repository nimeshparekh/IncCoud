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

//Live Agent Predictive Dialer
cron.schedule('*/30 * * * * *', () => {
	let date_ob = new Date();
	let hours = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	console.log('running a task every 30 second predictive dialer live agent==> '+date_ob+' '+hours+':'+minutes);
	if(hours>8 && hours<19){
	  // Generate Call Request	
	  db.query('SELECT camid,cam_name,account_id,cam_method,cam_status,cam_ivrid,dialer_type from tf_campaigns WHERE cam_status!="2" and cam_action=1 and cam_type=0 and cam_method=0 and dialer_type="1" ORDER BY create_date asc',[], async function (err, camdata) {
		  if (err) {
				console.log(err);
			 }else{
				console.log(camdata) 
			  if(camdata.length>0){
				  console.log('Live agent predictive campaign');
				  var loopinterval =  0;
				  async.forEachOf(camdata,async (cam,key, callback) => {
					  try {
							var camname = cam.cam_name
							var agentcamid = cam.camid;
							var customerid = cam.account_id;
							var status = cam.cam_status;
							var dialertype = cam.dialer_type;
							var callratio = cam.call_ratio!='' && cam.call_ratio!=null?cam.call_ratio:1;
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
									setTimeout(() => {
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
														console.log(agentcamid+'=='+customerid,avaichannels)
														if(avaichannels>0){
															const avaiagents =  await helper.getLiveAgent(agentcamid);
															var numlen = avaiagents.length * callratio;
															//var numlen = avaichannels;
															console.log(numlen)
															db.query('SELECT * from tf_campaigns_numbers CN INNER JOIN tf_contacts C ON CN.cont_id=C.cont_id WHERE CN.status=0 and CN.r_status=0 and CN.totaltry<3 and CN.cam_id = ? AND C.is_mobile_dnd = "no" AND C.mobile NOT IN (SELECT number FROM `tf_block_number` ) ORDER BY CN.date,CN.totaltry ASC limit ?',[agentcamid,numlen], async function (err, ndata) {
																if (err) {
																	console.log(err);
																}else{
																	if(ndata.length>0){
																		var loopinterval =  0;
																		async.forEachOf(ndata,async (num,key, callback) => {
																			try {
																				var numid = num.numid;
																				var number = num.mobile;
																				number = number.toString()[0] == callprefix ? number : callprefix+number
																				if(num.name && num.name!=null){
																					var name = num.name
																				}else{
																					var name = num.mobile
																				}
																				var manager_id = num.account_id
																				var agentdid = camdid
																				if(avaiagents.length>0){
																					console.log(avaiagents[key]);
																					// var AgentName = avaiagents[key].account_name
																					// var AgentNumber = avaiagents[key].mobile
																					// var AgentID = avaiagents[key].account_id	
																					var rdata = {callernumber:number,callername:name,did:agentdid,numid:numid,manager_id:manager_id,camid:agentcamid,type:1}
																					helper.insertlivecdrrequest(rdata, function (err, result) {
																						if (err)  return  console.log(err)
																						console.log(manager_id+'=='+agentdid+'=='+number+'('+name+')==>Request is created successfully.'+numid+'-'+number+'.call');
																					})
																					db.query('update tf_campaigns_numbers set r_status=1 WHERE numid=?',[numid]);
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
														}	
													}
													else{
														helper.SendPanelNotification(customerid,'cloudX Alert','All agents busy to generate call request')
													}
												}
										})
									},loopinterval);
									loopinterval = 2000*(key+1)	
								}else{
									helper.SendPanelNotification(customerid,'cloudX Alert','You have insufficient balance to run campaign.please recharge to continue')
									console.log("Insufficient balance");
								}
							}else{
								helper.SendPanelNotification(customerid,'cloudX Alert','Your account expired!')
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
    }
});