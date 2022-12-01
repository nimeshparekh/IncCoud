const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const userSocketIdMap = new Map(); //a map of online usernames and their clients
var bodyParser = require('body-parser');
var helper = require("../server/helper/common")

function formatDateTime(sDate,FormatType) {
  if(!sDate) return sDate;
  var lDate = new Date(sDate)

  var month=new Array(12);
  month[0]="January";
  month[1]="February";
  month[2]="March";
  month[3]="April";
  month[4]="May";
  month[5]="June";
  month[6]="July";
  month[7]="August";
  month[8]="September";
  month[9]="October";
  month[10]="November";
  month[11]="December";

  var weekday=new Array(7);
  weekday[0]="Sunday";
  weekday[1]="Monday";
  weekday[2]="Tuesday";
  weekday[3]="Wednesday";
  weekday[4]="Thursday";
  weekday[5]="Friday";
  weekday[6]="Saturday";

  var hh = lDate.getHours() < 10 ? '0' + 
      lDate.getHours() : lDate.getHours();
  var mi = lDate.getMinutes() < 10 ? '0' + 
      lDate.getMinutes() : lDate.getMinutes();
  var ss = lDate.getSeconds() < 10 ? '0' + 
      lDate.getSeconds() : lDate.getSeconds();

  var d = lDate.getDate();
  var dd = d < 10 ? '0' + d : d;
  var yyyy = lDate.getFullYear();
  var mon = eval(lDate.getMonth()+1);
  var mm = (mon<10?'0'+mon:mon);
  var monthName=month[lDate.getMonth()];
  var weekdayName=weekday[lDate.getDay()];

  if(FormatType==1) {
     return mm+'/'+dd+'/'+yyyy+' '+hh+':'+mi;
  } else if(FormatType==2) {
     return weekdayName+', '+monthName+' '+ 
          dd +', ' + yyyy;
  } else if(FormatType==3) {
     return mm+'/'+dd+'/'+yyyy; 
  } else if(FormatType==4) {
     var dd1 = lDate.getDate();    
     return dd1+'-'+Left(monthName,3)+'-'+yyyy;    
  } else if(FormatType==5) {
      return mm+'/'+dd+'/'+yyyy+' '+hh+':'+mi+':'+ss;
  } else if(FormatType == 6) {
      return mon + '/' + d + '/' + yyyy + ' ' + 
          hh + ':' + mi + ':' + ss;
  } else if(FormatType == 7) {
      return  yyyy + '-' + mm + 
          '-' + dd + ' ' + hh + ':' + mi + ':' + ss;
  }
}
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/callnotify/:id', (req, res) => {
  //get all clients (socketIds) of recipient
  var recipientSocketIds = userSocketIdMap.get(req.params.id);
  console.log(req.params.id+' == Callnotify == ',recipientSocketIds)
  if(recipientSocketIds!=undefined){
    for (let socketId of recipientSocketIds) {
      io.to(socketId).emit('agentcallanswer', req.params.id);
    }
  }
  res.json({"data":"success"});
});
app.post('/callincoming', (req, res) => {
  //helper.SendthirdAPI(req.body,'incoming')
  //get all clients (socketIds) of recipient
  var recipientSocketIds = userSocketIdMap.get(req.body.userid);
  console.log(''+req.body.userid + ' == callincoming == ',recipientSocketIds)
  if(recipientSocketIds!=undefined){
    for (let socketId of recipientSocketIds) {
      io.to(socketId).emit('callincoming', req.body);
    }
  }
  res.json({"data":"success"});
});
app.post('/callmissed',async (req, res) => {
  var cdrdata = await helper.GetCdrDataById(req.body.id)
  if(cdrdata.length>0){
    //console.log(cdrdata)
    var type = cdrdata[0].CallTypeID
    if(type==2){
      //helper.SendthirdAPI(cdrdata[0],'missed')
    }
  }
  res.json({"data":"success"});  
})

app.post('/callend',async (req, res) => {
  var cdrdata = await helper.GetCdrDataById(req.body.id)
  //console.log(cdrdata)
  if(cdrdata.length>0){
    var agentid = cdrdata[0].AgentID
    if(agentid>0){
      helper.updateAgentQueueTime(agentid)
    }
    var type = cdrdata[0].CallTypeID
    var callduration = cdrdata[0].CallTalkTime
    var callnumber = cdrdata[0].CallerNumber
    var calldate = cdrdata[0].CallStartTime
    if(type==2 && callduration==0){
      //helper.SendthirdAPI(cdrdata[0],'missed')
      helper.SendPanelNotification(cdrdata[0].AgentID,'Missed Call','Missed call from '+callnumber+' at '+formatDateTime(calldate,7))
    }
    //helper.SendthirdAPI(cdrdata[0],'end')
  }
  //get all clients (socketIds) of recipient
  var recipientSocketIds = userSocketIdMap.get(req.body.userid);
  console.log(req.body.userid + ' == callend == ',recipientSocketIds)
  if(recipientSocketIds!=undefined){
    for (let socketId of recipientSocketIds) {
      io.to(socketId).emit('callend', req.body);
    }
  }
  res.json({"data":"success"});
});
app.post('/calldial', (req, res) => {
  //get all clients (socketIds) of recipient
  var recipientSocketIds = userSocketIdMap.get(req.body.userid);
  console.log(req.body.userid + ' == calldial == ',recipientSocketIds)
  if(recipientSocketIds!=undefined){
    for (let socketId of recipientSocketIds) {
      io.to(socketId).emit('calldial', req.body);
    }
  }
 // helper.SendthirdAPI(req.body,'dial')
  res.json({"data":"success"});
});
app.post('/callanswer', (req, res) => {
  //get all clients (socketIds) of recipient
  var recipientSocketIds = userSocketIdMap.get(req.body.userid);
  console.log(req.body.userid + ' == callanswer == ',recipientSocketIds)
  if(recipientSocketIds!=undefined){
    for (let socketId of recipientSocketIds) {
      io.to(socketId).emit('callanswer', req.body);
    }
  }
  // console.log(req.body)
  //helper.SendthirdAPI(req.body,'answer')
  var agentid = req.body.userid
  if(agentid>0){
    helper.updateAgentQueueTime(agentid)
  }
  res.json({"data":"success"});
});
app.post('/callschedule', (req, res) => {
  //get all clients (socketIds) of recipient
  var recipientSocketIds = userSocketIdMap.get(req.body.id);
  console.log(req.body.id + ' == callschedule == ',recipientSocketIds)
  if(recipientSocketIds!=undefined){
    for (let socketId of recipientSocketIds) {
      var data = {userid:req.body.id,name:req.body.name,number:req.body.number,time:req.body.time,lastnote:req.body.lastnote}
      io.to(socketId).emit('agentcallschedule', data);
    }
  }
  res.json({"data":"success"});
});
app.post('/agentcallqueue', (req, res) => {
  if(req.body.totalcall>0){
    helper.SendPanelNotification(req.body.id,'Queue Call','There is '+req.body.totalcall+' call in queue')
  }
  //get all clients (socketIds) of recipient
  var recipientSocketIds = userSocketIdMap.get(req.body.id);
  //console.log(recipientSocketIds)
  console.log(req.body.id + ' == agentcallqueue == ',recipientSocketIds)
  if(recipientSocketIds!=undefined){
    for (let socketId of recipientSocketIds) {
      var data = {userid:req.body.id,totalcall:req.body.totalcall}
      io.to(socketId).emit('agentcallqueue', data);
    }
  }
  res.json({"data":"success"});
});
app.post('/logout', (req, res) => {
  //get all clients (socketIds) of recipient
  var recipientSocketIds = userSocketIdMap.get(req.body.userid);
  //console.log(recipientSocketIds)
  console.log(req.body.userid + ' == logout == ',recipientSocketIds)
  if(recipientSocketIds!=undefined){
    for (let socketId of recipientSocketIds) {
      var data = {userid:req.body.userid}
      io.to(socketId).emit('logout', data);
    }
  }
  res.json({"data":"success"});
});
//
app.post('/checkagentcallstatus', (req, res) => {
  //get all clients (socketIds) of recipient
  var recipientSocketIds = userSocketIdMap.get(req.body.userid);
  //console.log(recipientSocketIds)
  console.log(req.body.userid + ' == checkagentcallstatus == ',recipientSocketIds)
  if(recipientSocketIds!=undefined){
    for (let socketId of recipientSocketIds) {
      var data = {userid:req.body.userid}
      io.to(socketId).emit('agentoncall', data);
    }
  }
  res.json({"data":"success"});
});

app.post('/checkagentsocket', (req, res) => {
  //get all clients (socketIds) of recipient
  var recipientSocketIds = userSocketIdMap.get(req.body.userid);
  console.log(req.body.userid + ' == checkagentsocket == ',recipientSocketIds)
  if(recipientSocketIds!=undefined){
    res.json({"msg":true});
  }else{
    res.json({"msg":false});
  }
});

// Auto CALl to Sim Based Calling
app.post('/autocalldial', (req, res) => {
  //get all clients (socketIds) of recipient
  var recipientSocketIds = userSocketIdMap.get(req.body.userid);
  console.log(req.body.userid + ' == autocalldial == ',recipientSocketIds)
  if(recipientSocketIds!=undefined){
    for (let socketId of recipientSocketIds) {
      io.to(socketId).emit('autocalldial', req.body);
    }
    res.json({"msg":true});
  }else{
    res.json({"msg":false});
  }
});

//Auto SMS to Sim Based Calling
app.post('/autosendsms', (req, res) => {
  //get all clients (socketIds) of recipient
  var recipientSocketIds = userSocketIdMap.get(req.body.userid);
  console.log(recipientSocketIds)
  if(recipientSocketIds!=undefined){
    for (let socketId of recipientSocketIds) {
      io.to(socketId).emit('autosendsms', req.body);
    }
  }
  res.json({"data":"success"});
});

app.get('/getsocketuser', (req, res) => {
  // //Iterate over map keys  
  // for (let key of userSocketIdMap.keys()) {  
  //     console.log("Map Keys= " +key);          
  // }  
  // //Iterate over map values  
  // for (let value of userSocketIdMap.values()) {  
  //   console.log("Map Values= ",value);      
  // }  
  console.log("The Map Enteries are: ");   
  //Iterate over map entries  
  for (let entry of userSocketIdMap.entries()) {  
      console.log(entry[0], entry[1]);   
  }  
  res.json({total:userSocketIdMap.size,data:userSocketIdMap.entries()});
})
app.get('/clearsocketuser', (req, res) => {
  userSocketIdMap.clear()
  res.json({"data":"success"});
})
//chat message
app.post('/message_list', (req, res) => {
    console.log('message_list',req.body);
    var recipientSocketIds = userSocketIdMap.get(req.body.userid);
    var managerIdSocketIds = userSocketIdMap.get(req.body.manager_id);
    
    console.log('recipientSocketIds',recipientSocketIds)
    console.log(req.body)
    if(recipientSocketIds!=undefined){
      for (let socketId of recipientSocketIds) {
        var data = {userid:req.body.userid}
        io.to(socketId).emit('message_list', req.body);
      }
    }
    if(managerIdSocketIds!=undefined){
      for (let socketId of managerIdSocketIds) {
        var data = {userid:req.body.manager_id}
        io.to(socketId).emit('message_list', req.body);
      }
    }
    res.json({"data":"success"});
});

app.post('/chatincoming', (req, res) => {
  console.log('chatincoming',req.body);
  var recipientSocketIds = userSocketIdMap.get(req.body.userid);
  var managerIdSocketIds = userSocketIdMap.get(req.body.manager_id);
  
  console.log('recipientSocketIds',recipientSocketIds)
  console.log(req.body)
  if(recipientSocketIds!=undefined){
    for (let socketId of recipientSocketIds) {
      var data = {userid:req.body.userid}
      io.to(socketId).emit('chatincoming', req.body);
    }
  }
  if(managerIdSocketIds!=undefined){
    for (let socketId of managerIdSocketIds) {
      var data = {userid:req.body.manager_id}
      io.to(socketId).emit('chatincoming', req.body);
    }
  }
  res.json({"data":"success"});
});

io.on('connection', (socket) => {
  console.log(socket.id)
  console.log(socket.handshake.query.token)
  addClientToMap(socket.handshake.query.token, socket.id);
  console.log('a user connected == ',userSocketIdMap.size);
  socket.on('disconnect', () => {
    console.log('user disconnected ==='+socket.handshake.query.token,userSocketIdMap.size);
    removeClientFromMap(socket.handshake.query.token, socket.id);
  });
  socket.on('my message', (msg) => {
    //console.log('message: ' + msg);
    //io.emit('my broadcast', `server: ${msg}`);
  });
});

http.listen(3002, () => {
  console.log('listening on *:3002');
});

function addClientToMap(userName, socketId){
  if (!userSocketIdMap.has(userName)) {
    //when user is joining first time
    userSocketIdMap.set(userName, new Set([socketId]));
  } else{
    //user had already joined from one client and now joining using another client
    userSocketIdMap.get(userName).add(socketId);
  }
}
function removeClientFromMap(userName, socketId){
  if (userSocketIdMap.has(userName)) {
    let userSocketIdSet = userSocketIdMap.get(userName);
    userSocketIdSet.delete(socketId);
    //if there are no clients for a user, remove that user from online list (map)
    if (userSocketIdSet.size ==0 ) {
      userSocketIdMap.delete(userName);
    }
    //
    //helper.EventLogout(userName)
  }
}
