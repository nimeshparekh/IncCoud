var db = require('../database/db');

var Email = {
    getemailtemplatedata: function (cid, callback) {
        console.log('Select * from tf_emailtemplate where  account_id='+cid); 
        return db.query('Select * from tf_emailtemplate where  account_id='+cid,[], callback);
    }, 
    getemailcampaignsdata:function(data,callback){
        var where ='c.account_id='+data.account_id+' and c.cam_type ="1"';
        if(data.startdate && data.enddate){
            where += ' and c.cam_date between "'+data.startdate+' 00:00:00" and "'+data.enddate+' 23:59:59"'
        }
        console.log("SELECT c.*,s.email_title,COUNT(t.emailid)AS total FROM `tf_email_campagin` c INNER join tf_emailtemplate s on s.email_id = c.`cam_temp_id` LEFT join tf_email_camapgin_number as t on c.cid=t.cid WHERE "+where+" GROUP BY c.cid ORDER BY c.cid DESC");
        return db.query("SELECT c.*,s.email_title,COUNT(t.emailid)AS total FROM `tf_email_campagin` c INNER join tf_emailtemplate s on s.email_id = c.`cam_temp_id` LEFT join tf_email_camapgin_number as t on c.cid=t.cid WHERE "+where+" GROUP BY c.cid ORDER BY c.cid DESC",[],callback)
    },
    getemailtemplatebyid: function (id, callback) { 
        return db.query('Select * from tf_emailtemplate where email_id=?',[id], callback);
    },
    savecampagin:function(data,callback){
        return db.query("Insert INTO tf_email_campagin  SET ?",data,callback)
    },
    getLeadListbyStatus:function(accountid,status,callback){
        return db.query("SELECT L.l_id,L.User_id,L.agent_id,L.status,C.mobile,C.email,C.name,C.cont_id,C.emm_customerid FROM `tf_leads` L INNER JOIN tf_contacts C ON L.l_id=C.lead_id WHERE L.User_id = ? AND L.status IN (?) AND C.email IS NOT null",[accountid,status],callback)
    },
    updatecontactemmid: function (eid,id, callback) {
        return db.query('update tf_contacts set emm_customerid = ? WHERE cont_id = ?', [eid, id], callback);
    },
    insertbulkemailcampaigncontact: function (data, callback) {
        return db.query("Insert INTO tf_email_camapgin_number  SET ?",data,callback)        
    },
    updatecampaign: function (data,id, callback) {
        return db.query('update tf_email_campagin set ? WHERE cid = ?', [data, id], callback);
    },      
    getcampaigndetail:function(id,uid,callback){
        return db.query("Select C.*,E.email_title ,S.name from tf_email_campagin C inner join tf_emailtemplate E ON E.email_id=C.`cam_temp_id` LEFT JOIN tf_segments S ON S.cont_id=C.category  where C.cid=? and C.account_id=?",[id,uid],callback);
    }, 
    
    searchcampaignlog: function (data, callback) {
        var where = 'cid = '+data.campaignid; 
        if (data.startdate && data.enddate) {
            where += " and date BETWEEN '" + data.startdate + " 00:00:00' and '" + data.enddate + " 23:59:59'";
        }
        if (data.name) {
            where += " and name LIKE '%" + data.name + "%'";
        }
        if(data.email){
            where += " and emailid LIKE '%" + data.email + "%'";
        }
        if (data.status) {
            if(data.status==0 || data.status==1){
                where += " and email_status=" + data.status;
            }
            if(data.status==2){
                where += " and opener_event='yes'";
            }           
        }
        console.log('SELECT count(numid) as total FROM tf_email_camapgin_number  WHERE '+where);
       return db.query('SELECT count(numid) as total FROM tf_email_camapgin_number  WHERE '+where , [], callback);
    }, 
    
    searchcampaignemaillog: function (data, callback) {
        var where = 'cid = '+data.campaignid; 
        if (data.startdate && data.enddate) {
            where += " and date BETWEEN '" + data.startdate + " 00:00:00' and '" + data.enddate + " 23:59:59'";
        }
        if (data.name) {
            where += " and name LIKE '%" + data.name + "%'";
        }
        if (data.email) {
            where += " and emailid LIKE '%" + data.email + "%'";
        }
        if (data.status) {
            if(data.status==0 || data.status==1 || data.status ==3 || data.status ==4){
                where += " and email_status=" + data.status;
            }
            if(data.status==2){
                where += " and opener_event='yes'";
            }           
        }
        //console.log('SELECT * FROM tf_email_camapgin_number  WHERE '+where+' order by '+data.sortcolumn+' '+data.sortdirection+' LIMIT '+data.position+','+data.pageSize+'');      
        return db.query('SELECT * FROM tf_email_camapgin_number  WHERE '+where+' order by '+data.sortcolumn+' '+data.sortdirection+' LIMIT '+data.position+','+data.pageSize+'' , [], callback);
    },
    getcampaignsummary: function (id,uid, callback) { 
        //console.log('SELECT COUNT(cid) as total,(SELECT COUNT(cid) as total FROM `tf_email_camapgin_number` WHERE cid='+id+' AND account_id='+uid+' AND email_status=1) as delivered,(SELECT COUNT(cid) as total FROM `tf_email_camapgin_number` WHERE cid='+id+' AND account_id='+uid+' AND opener_event="yes") as openers FROM `tf_email_camapgin_number` WHERE cid='+id+' AND account_id='+uid);
        return db.query('SELECT COUNT(cid) as total,(SELECT COUNT(cid) as total FROM `tf_email_camapgin_number` WHERE cid=? AND account_id=? AND email_status=1) as delivered,(SELECT COUNT(cid) as total FROM `tf_email_camapgin_number` WHERE cid=? AND account_id=? AND opener_event="yes") as openers FROM `tf_email_camapgin_number` WHERE cid=? AND account_id=?',[id,uid,id,uid,id,uid], callback);
    },

    getemailloglength:function (data,callback){
        var where = "CN.account_id="+data.account_id;
        if(data.startdate!='' && data.enddate!=''){
            where +=" and (CN.date between '"+data.startdate+"' and '"+data.enddate+"')";
        }
        if(data.mobile){
            where +=" and CN.emailid="+data.email;
        }
        if(data.status){
            where +=" and CN.email_status='"+data.status+"'";
        }
        //console.log("SELECT CN.*,C.cam_name FROM `tf_email_camapgin_number` CN LEFT JOIN tf_email_campagin C ON C.cid=CN.cid WHERE "+where+" ORDER BY CN.date DESC");
        return db.query("SELECT CN.*,C.cam_name FROM `tf_email_camapgin_number` CN LEFT JOIN tf_email_campagin C ON C.cid=CN.cid WHERE "+where+" ORDER BY CN.date DESC",callback)
    },
    getrunningcampaign: function (callback) { 
        return db.query('Select * from tf_email_campagin where cam_status="0" and DATE(cam_date)=CURRENT_DATE() - INTERVAL 1 DAY  ORDER BY cid DESC',[], callback);
    },
    getcampaignundelivernumbers: function (cid,uid,callback) { 
        return db.query('Select E.numid,C.emm_customerid from tf_email_camapgin_number E INNER JOIN tf_contacts C ON E.cont_id=C.cont_id where E.cid=? AND C.customer_id=? AND E.email_status=0 ORDER BY numid ASC',[cid,uid], callback);
    },
    getcampaigndelivernumbers: function (cid,uid,callback) { 
        return db.query('Select E.numid,C.emm_customerid from tf_email_camapgin_number E INNER JOIN tf_contacts C ON E.cont_id=C.cont_id where E.cid=? AND C.customer_id=? AND E.email_status=1 and opener_event="no" ORDER BY numid ASC',[cid,uid], callback);
    },
    getcampaignsummary: function (id,uid, callback) { 
        return db.query('SELECT IFNULL(COUNT(cid),0) AS Sent, COUNT(IF(email_status= 1,1,NULL)) AS Delivered, COUNT(IF(opener_event="yes",1,NULL)) AS Email_Read,COUNT(IF(email_status= 3,1,NULL)) AS Click, COUNT(IF(email_status= 4,1,NULL)) AS Bounce FROM tf_email_camapgin_number WHERE account_id='+uid+' AND cid='+id,callback)
        //  return db.query('SELECT COUNT(cid) as total,(SELECT COUNT(cid) as total FROM `tf_email_camapgin_number` WHERE cid=? AND account_id=? AND email_status=1) as delivered,(SELECT COUNT(cid) as total FROM `tf_email_camapgin_number` WHERE cid=? AND account_id=? AND opener_event="yes") as openers FROM `tf_email_camapgin_number` WHERE cid=? AND account_id=?',[id,uid,id,uid,id,uid], callback);
    },
    searchemailcountgraph:function(data,callback){
        return db.query("SELECT IFNULL(COUNT(cid),0) AS Sent, COUNT(IF(email_status= 1,1,NULL)) AS Delivered, COUNT(IF(opener_event='yes',1,NULL)) AS Email_Read,COUNT(IF(email_status= 3,1,NULL)) AS Click, COUNT(IF(email_status= 4,1,NULL)) AS Bounce FROM tf_email_camapgin_number WHERE account_id="+data.userid+" AND DATE BETWEEN CONCAT('"+data.startdate+"',' 00:00:00') AND CONCAT('"+data.enddate+"',' 23:59:59')",callback);
    },
    searchemaillogdata:function (data,callback){
        var where = "CN.account_id="+data.account_id;
        if(data.startdate!='' && data.enddate!=''){
            where +=" And CN.date BETWEEN CONCAT('"+data.startdate+"',' 00:00:00') AND CONCAT('"+data.enddate+"',' 23:59:59')";
        }
        if(data.email){
            where +=" and CN.emailid= '"+data.email+"'";
        }
        if (data.status) {
            if(data.status==0 || data.status==1 || data.status==3 || data.status==4){
                where += " and  CN.email_status=" + data.status;
            }
            if(data.status==2){
                where += " and CN.opener_event='yes'";
            }           
        }
       
        console.log("SELECT CN.*,C.cam_name FROM `tf_email_camapgin_number` CN LEFT JOIN tf_email_campagin C ON C.cid=CN.cid WHERE "+where+" ORDER BY CN."+data.sortcolumn+"  " + data.sortdirection + " LIMIT " + data.position + "," + data.pageSize);
        return db.query("SELECT CN.*,C.cam_name FROM `tf_email_camapgin_number` CN LEFT JOIN tf_email_campagin C ON C.cid=CN.cid WHERE "+where+" ORDER BY CN."+data.sortcolumn+"  " + data.sortdirection + " LIMIT " + data.position + "," + data.pageSize,callback)
    },
    getregenerateemaillogdata:function (data,callback){
        var where = 'cid = '+data.campaignid; 
        if (data.startdate && data.enddate) {
            where += " and date BETWEEN '" + data.startdate + " 00:00:00' and '" + data.enddate + " 23:59:59'";
        }
        if (data.name) {
            where += " and name LIKE '%" + data.name + "%'";
        }
        if (data.status) {
            if(data.status==0 || data.status==1){
                where += " and email_status=" + data.status;
            }
            if(data.status==2){
                where += " and opener_event='yes'";
            }           
        }
         return db.query('SELECT * FROM tf_email_camapgin_number  WHERE '+where , [], callback);
    },
    
    redirect_email_to_lms:function(email,accountid,callback){
        return db.query('SELECT * FROM `tf_leads` WHERE email_id ="'+email+'" and User_id = '+accountid,callback);
    }
}


module.exports = Email;