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
var requestify = require('requestify'); 

const askapi = new awry.API({
	baseUrl: process.env.ARIURL,
	username: process.env.ARIUSERNAME,
	password: process.env.ARIPASSWORD
});
//Live Agent Progressive Dialer
cron.schedule('*/60 * * * * *', () => {
	let date_ob = new Date();
	let hours = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	console.log('running a task every 60 second Mobile dialer live agent==> '+date_ob+' '+hours+':'+minutes);
	if(hours>8 && hours<19){
	  // Generate Call Request	
	  db.query('SELECT camid,cam_name,account_id,cam_method,cam_status,cam_ivrid,dialer_type from tf_campaigns WHERE cam_status!="2" and cam_action=1 and cam_type=0 and cam_method=2  ORDER BY create_date asc',[], async function (err, camdata) {
		  if (err) {
				console.log(err);
			 }else{
			  if(camdata.length>0){
				  async.forEachOf(camdata,async (cam, callback) => {
					  try {
						  	var camname = cam.cam_name
							var agentcamid = cam.camid;
							var customerid = cam.account_id;
							var status = cam.cam_status;
							var fetchaccountdata = await helper.checkAccountExpiry(customerid)
							if(fetchaccountdata.length>0){
								if(status==0){
									db.query('update tf_campaigns set cam_status="1" WHERE camid=?',[agentcamid]);
								}
								console.log(agentcamid+'=='+customerid)
								const avaiagents =  await helper.getLiveAgent(agentcamid);
								var numlen = avaiagents.length;
								console.log(avaiagents)
								if(numlen>0){
									db.query('SELECT CN.numid,CN.account_id,CN.totaltry,C.mobile,C.name from tf_campaigns_numbers CN INNER JOIN tf_contacts C ON CN.cont_id=C.cont_id WHERE CN.status=0 and CN.r_status=0 and CN.totaltry<3 and CN.cam_id = ? AND C.is_mobile_dnd = "no" AND C.mobile NOT IN (SELECT number FROM `tf_block_number` ) ORDER BY CN.date,CN.totaltry ASC limit ?',[agentcamid,numlen], async function (err, ndata) {
										if (err) {
											console.log(err);
										}else{
											if(ndata.length>0){
												async.forEachOf(ndata,async (num,key, callback) => {
													try {
														var numid = num.numid;
														var mobile = num.mobile;
														var manager_id = num.account_id
														if(num.name && num.name!=null){
															var name = num.name
														}else{
															var name = num.mobile
														}
														if(avaiagents.length>0){
															var AgentName = avaiagents[key].account_name
															console.log(AgentName);
															var AgentNumber = avaiagents[key].mobile
															var AgentID = avaiagents[key].account_id
															var lastcall = await helper.getMobileAgentLastcall(AgentID)
															if(lastcall.length>0){
																var laststatus = lastcall[0].CdrStatus
																var lastdate = lastcall[0].CallEndTime
																var wrapuptime = lastcall[0].WrapUpTime*60
																var nowdate = new Date()
																if(laststatus==0){
																	var lastcalltime = moment(lastdate, 'YYYY-MM-DD HH:mm:ss')
																	var nowtime = moment(nowdate, 'YYYY-MM-DD HH:mm:ss')
																	var diff = nowtime.diff(lastcalltime, 'seconds')
																	console.log(diff+">"+wrapuptime)	
																}else{
																	var diff = 0;
																}
															}else{
																var lastdate = new Date()
																var diff = 0
																var wrapuptime = 0
															}
															if(diff>=wrapuptime || wrapuptime==0){
																// var rdata = {callernumber:number,callername:name,did:agentdid,numid:numid,manager_id:manager_id,camid:agentcamid,agent_id:AgentID}
																// helper.insertlivecdrrequest(rdata, function (err, result) {
																// 	if (err)  return  console.log(err)
																// 	console.log(manager_id+'=='+agentdid+'=='+AgentName+'=='+number+'('+name+')==>Request is created successfully.'+numid+'-'+number+'.call');
																// })
																requestify.request("https://uat.cloudX.in/socketapi/checkagentsocket", {
																	method: 'POST',
																	body: { userid: AgentID },
																	dataType: 'form-url-encoded',
																}).then(function (response) {
																	console.log(response.body , "==api success==" )
																	var resdata = JSON.parse(response.body)
																	console.log(resdata['msg'])
																	if(resdata['msg']){
																		var cdrdata = { accountid: manager_id, serviceid: 9, CallerType: 1, CallerName: mobile, CallerNumber: mobile, AgentID: AgentID, AgentName: AgentName, AgentNumber: AgentNumber, CallTypeID: 1, CallType: 'dialer', CdrStatus: 3, AgentStatus: "CALLING",auto_numid:numid }
																		helper.insertcdr(cdrdata, function (err, result) {
																			if (err) return console.log(err)
																			var cdrid = result.insertId
																			requestify.request("https://uat.cloudX.in/socketapi/autocalldial", {
																				method: 'POST',
																				body: { userid: AgentID,callernumber:mobile,cdrid:cdrid },
																				dataType: 'form-url-encoded',
																			}).then(function (response) {
																				console.log(response , "==api success==")
																				var resdata = JSON.parse(response.body)
																				if(resdata['msg']){
																					console.log(response , "Call originate succesfully. cdrid : "+cdrid)
																					db.query('update tf_campaigns_numbers set status=1,r_status=1 WHERE numid=?',[numid]);
																					//res.status(200).send({ "msg": "Call originate succesfully.", 'id': cdrid });
																				}else{
																					console.log(response , "==Agent not logged in==")
																					//res.status(200).send({ "msg": 'Agent not logged in.' });
																				}
																			}).fail(function (response) {
																				console.log(response , "==Agent not logged in==")
																				//res.status(200).send({ "msg": 'Agent not logged in.' });
																			});
																			//db.query('update tf_campaigns_numbers set r_status=1 WHERE numid=?',[numid]);
																			//res.status(200).send({ "msg": "Call originate succesfully.", "uid": chdata.id, 'id': cdrid });
																		})
																	}else{
																		console.log(response , "==Agent not logged in==")
																		//res.status(200).send({ "msg": 'Agent not logged in.' });
																	}
																}).fail(function (response) {
																	console.log(response , "==Agent not logged in==")
																	//res.status(200).send({ "msg": 'Agent not logged in.' });
																});
																// db.query('update tf_campaigns_numbers set r_status=1 WHERE numid=?',[numid]);
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
															//helper.SendPanelNotification(customerid,'cloudX Alert','Campaign '+camname+' completed successfully!')
															//helper.SendFirebaseNotification(customerid,'cloudX Alert','Campaign '+camname+' completed successfully!')
														}
													}
												})
											}
										}
									})
								}
							}else{
								//helper.SendPanelNotification(customerid,'cloudX Alert','You try to run campaign but your account was expired!')
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