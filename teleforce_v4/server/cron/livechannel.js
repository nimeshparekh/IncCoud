var cron = require('node-cron');
var db = require('../database/db');
var fs    = require("fs");
var moment = require('moment');
const delay = require('delay');
const awry = require('awry');
var Automodel = require('./autodialerModel');
var async = require("async");
const askapi = new awry.API({
	baseUrl: 'http://192.168.1.26:8088/ari',
	username: 'autodial',
	password: 'Garuda@dv18'
});
var admin = require("firebase-admin");
var serviceAccount = require("./teleforce-ebf8e-firebase-adminsdk-8e948-fa48e52af3.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cloudX-ebf8e.firebaseio.com"
});


function sendnotification(toname,tonumber,agentid){
	if(agentid>0){
		Automodel.getAgentbyid(agentid, async function (err, rows) {
			if (err) {
				console.log(err);
			}else{
				adata = rows[0]
				const notification_options = {
					priority: "high",
					timeToLive: 60 * 60 * 24,
					click_action: "FLUTTER_NOTIFICATION_CLICK",
				};
				const message_notification = {
					notification: {
						title: "Auto Call",
						body: "Call for : "+tonumber+" ("+toname+")",
					}
				};
				const  registrationToken = adata.uuid
				const message = message_notification
				const options =  notification_options
				
				admin.messaging().sendToDevice(registrationToken, message, options)
				.then( response => {

					console.log("Notification sent successfully")
				
				})
				.catch( error => {
					console.log(error);
				});
			}
		})
	}
}
//Live Agent
cron.schedule('*/10 * * * * *', () => {
	let date_ob = new Date();
	let hours = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	askapi.channels.list().then(data => {
        //console.log(data.data)
        var count =  data.data.length
        console.log(count)
        record = {count:count}
        db.query('INSERT INTO tf_channelusages SET ?', [record]);
    }).catch(function (err) {
        console.log(err)
    });
});