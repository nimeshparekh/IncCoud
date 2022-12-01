const { select } = require('async');
var db = require('../database/db');

var Contacts = {
    createcontact: function (Contacts, callback) {
        return db.query('Insert INTO tf_contacts SET ?', Contacts, callback);
    },
    createfile: function (Contacts, callback) {
        return db.query('Insert INTO tf_fileupload_request SET ?', Contacts, callback);
    },
    getContact: function (cid, callback) {
        return db.query('Select * from tf_contacts where customer_id=? ORDER BY created_date DESC', cid, callback);
    },
    deleteContact: function (cont_id, callback) {
        return db.query('DELETE FROM `tf_contacts` WHERE `tf_contacts`.`cont_id`=?', cont_id, callback);
    },
    // update: function (Contacts,cont_id, callback) { 
    //     return db.query('UPDATE `tf_contacts` SET ? WHERE `tf_contacts`.`cont_id`='+cont_id,Contacts, callback);
    // },
    getContactDetail: function (cid, callback) {
        return db.query('Select * from tf_contacts where cont_id=?', cid, callback);
    },
    updateCategory: function (Contacts, cont_id, callback) {
        return db.query('UPDATE `tf_contacts` SET ? WHERE `tf_contacts`.`cont_id`="' + cont_id + '"', Contacts, callback);
    },
    updatefileStatus: function (Contacts, cont_id, callback) {
        return db.query('UPDATE `tf_fileupload_request` SET ? WHERE `tf_fileupload_request`.`fid`="' + cont_id + '"', Contacts, callback);
    },
    AllContactCategory: function (uid, callback) {
        return db.query('Select * from tf_segments where customer_id=? and  is_deleted ="no" order by name asc', uid, callback);
    },
    AllContactCategoryid: function (uid, callback) {
        return db.query('Select * from tf_segments where cont_id=? and  is_deleted ="no" order by name asc', uid, callback);
    },
    AllFiledata: function (uid, callback) {
        return db.query('Select * from tf_fileupload_request where status=? order by upload_date asc limit 1', [uid], callback);
    },
    Filedata: function (id, callback) {
        return db.query('Select * from tf_fileupload_request where customer_id=?', [id], callback);
    },
    contactdata: function (callback) {
        return db.query('Select * from tf_contacts', callback);
    },
    insertbulkcontact: function (data, callback) {
        db.query('Insert INTO tf_contacts (cont_id,customer_id,name,email,mobile,address,city,state,created_date,category,is_mobile_dnd) VALUES ?', [data], callback);
    },
    // getContactseg: function (cid,segment, callback) {
    //     return db.query('Select * from tf_contacts where customer_id=? and category=?',[cid,segment], callback);

    //     ('SELECT count(cont_id) as totalcontact,category FROM `tf_contacts` WHERE customer_id = 42 AND category!='+segment+' GROUP BY category')
    // },
    createcampaign: function (data, callback) {
        return db.query('Insert INTO tf_campaigns SET ?', data, callback);
    },
    getContactbyCategory: function (cid, callback) {
        return db.query('SELECT count(cont_id) as totalcontact,category FROM `tf_contacts` WHERE customer_id =? GROUP BY category', cid, callback);
    },
    getContactseg: function (data, callback) {
        db.query('SELECT count(cont_id) as totalcontact,category FROM `tf_contacts` WHERE customer_id =? AND category!=``GROUP BY category', [data.id, data.category], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    getCampaign: function (cid, callback) {
        return db.query('Select * from tf_campaigns where account_id=?', cid, callback);
    },
    // gethunt: function (cid, callback) { 
    //     return db.query('Select * from HuntGroupDetail where UserID=?',cid, callback);
    // },
    gethunt: function (data, callback) {
        //  console.log(data);
        db.query('SELECT A.account_name,A.account_id FROM `HuntGroup` H INNER JOIN HuntGroupDetail G ON H.GroupID=G.HuntGroupID LEFT JOIN tf_account_table A ON G.AgentID=A.account_id WHERE A.current_status !="1" and H.GroupID =? ORDER BY A.account_name ASC', [data.id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    getgrouptosupervisoragent: function (data, callback) {
        //  console.log(data);
        db.query('SELECT A.account_id,A.account_name,A.account_name as agentname,A.account_id as AgentID FROM `HuntGroup` H INNER JOIN HuntGroupDetail G ON H.GroupID=G.HuntGroupID inner JOIN tf_supervisor_agents S ON S.AgentID=G.AgentID LEFT JOIN tf_account_table A ON A.account_id=S.AgentID WHERE H.GroupID =? and A.current_status="0" ORDER BY A.account_name ASC', [data.id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },

    getunassigncampaignagent: function (data, callback) {
        //  console.log(data);
        db.query('SELECT A.account_name,A.account_id FROM `HuntGroup` H INNER JOIN HuntGroupDetail G ON H.GroupID=G.HuntGroupID LEFT JOIN tf_account_table A ON G.AgentID=A.account_id WHERE A.current_status !="1" and H.GroupID =' + data.id + ' AND A.account_id NOT IN (SELECT agent_id FROM tf_campaigns_agent CA LEFT JOIN tf_campaigns C ON C.camid=CA.cam_id WHERE CA.account_id=' + data.userid + ' AND C.is_deleted="no")', [data.id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    getgrouptounassignsupervisoragent: function (data, callback) {
        //console.log('SELECT A.account_name,A.account_id FROM `HuntGroup` H INNER JOIN HuntGroupDetail G ON H.GroupID=G.HuntGroupID INNER JOIN tf_supervisor_agents S ON S.AgentID=G.AgentID LEFT JOIN tf_account_table A ON G.AgentID=A.account_id WHERE A.current_status="0" and H.GroupID='+data.id+' AND S.AgentID NOT IN (SELECT agent_id FROM tf_campaigns_agent CA LEFT JOIN tf_campaigns C ON C.camid=CA.cam_id WHERE C.created_by='+data.userid+' AND C.is_deleted="no")');
        db.query('SELECT A.account_name,A.account_id FROM `HuntGroup` H INNER JOIN HuntGroupDetail G ON H.GroupID=G.HuntGroupID INNER JOIN tf_supervisor_agents S ON S.AgentID=G.AgentID LEFT JOIN tf_account_table A ON G.AgentID=A.account_id WHERE A.current_status="0" and H.GroupID=' + data.id + ' AND S.AgentID NOT IN (SELECT agent_id FROM tf_campaigns_agent CA LEFT JOIN tf_campaigns C ON C.camid=CA.cam_id WHERE C.created_by=' + data.userid + ' AND C.is_deleted="no") ORDER BY A.account_name ASC', [], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },

    findcame: function (data, callback) {
        return db.query('Select * from tf_campaigns where cam_name=? AND account_id=? AND create_date=?', [data.name, data.id, data.date], callback);
    },
    getCampaign: function (id, callback) {
        return db.query('SELECT * from tf_campaigns WHERE is_deleted ="no" and cam_status="0" and account_id = ? ORDER BY created_at DESC', [id], callback);
    },
    getallvoipCampaign: function (id, callback) {
        return db.query('SELECT * from tf_campaigns WHERE is_deleted ="no" and (cam_method!=1 OR cam_method IS NULL)  and account_id = ? ORDER BY cam_name ASC', [id], callback);
    },
    updatecamaction: function (camid, action, callback) {

        return db.query('UPDATE tf_campaigns SET cam_action=? WHERE camid=?', [action, camid], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                // console.log(camid + '==' + action);
                callback(err, results);
            }
        });
    },

    updatecampaign: function (data, callback) {
        return db.query('UPDATE tf_campaigns SET ? WHERE camid=?', [data, data.camid], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    deleteCampaign: function (cont_id, callback) {
        return db.query('DELETE FROM `tf_campaigns` WHERE `tf_campaigns`.`camid`=?', cont_id, callback);
    },
    deleteCampaignnumber: function (cont_id, callback) {
        return db.query('DELETE FROM `tf_campaigns_numbers` WHERE `tf_campaigns_numbers`.`cam_id`=?', cont_id, callback);
    },
    deletecampaignagents: function (cont_id, callback) {
        return db.query('DELETE FROM `tf_campaigns_agent` WHERE cam_id=?', cont_id, callback);
    },
    deletecampaigndid: function (cont_id, callback) {
        return db.query('DELETE FROM `tf_campaigns_did` WHERE cam_id=?', cont_id, callback);
    },
    getContactbySegment: function (data, callback) {
        return db.query('Select * from tf_contacts where customer_id=? and category = ? ORDER BY created_date DESC', [data.id, data.category], callback);
    },
    getContactbySupervisorSegment: function (data, callback) {
        return db.query('Select * from tf_contacts where created_by=? and category = ? ORDER BY created_date DESC', [data.id, data.category], callback);
    },
    insertbulkcamnumber: function (data, callback) {
        db.query('Insert INTO tf_campaigns_numbers (cam_id,account_id,cont_id,agent_id,segment_id) VALUES ?', [data], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    searchcalllog: function (data, callback) {
        //console.log(data);
        var where = 'C.customer_id=' + data.customer_id;
        if (data.name) {
            where += " and C.name like '%" + data.name + "%'";
        }
        if (data.mobile) {
            where += " and C.mobile like '%" + data.mobile + "%'";
        }
        if (data.email) {
            where += " and C.email like '%" + data.email + "%'";
        }
        if (data.city) {
            where += " and C.city like '%" + data.city + "%'";
        }
        if (data.state) {
            where += " and C.state like '%" + data.state + "%'";
        }
        if (data.category) {
            where += " and C.category='" + data.category + "'";
        }
        //console.log('SELECT C.*,S.name as segment FROM `tf_contacts` C INNER JOIN tf_segments S ON C.category=S.cont_id where ' + where + ' ORDER BY C.created_date , C.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '');
        //console.log('SELECT * FROM `tf_cdr` where '+where+' ORDER BY CallStartTime DESC ' );
        return db.query('SELECT C.*,S.name as segment FROM `tf_contacts` C INNER JOIN tf_segments S ON C.category=S.cont_id where ' + where + ' ORDER BY C.created_date , C.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '', [], callback);
    },
    searchsupervisorcalllog: function (data, callback) {
        //console.log(data);
        var where = '';
        if (data.name) {
            where += " and C.name like '%" + data.name + "%'";
        }
        if (data.mobile) {
            where += " and C.mobile like '%" + data.mobile + "%'";
        }
        if (data.email) {
            where += " and C.email like '%" + data.email + "%'";
        }
        if (data.city) {
            where += " and C.city like '%" + data.city + "%'";
        }
        if (data.state) {
            where += " and C.state like '%" + data.state + "%'";
        }
        if (data.category) {
            where += " and C.category='" + data.category + "'";
        }
        return db.query('SELECT C.*, s.name AS segment,s.created_by AS segment_creator FROM tf_contacts C LEFT JOIN tf_segments s ON C.category=s.cont_id WHERE C.created_by IN(SELECT agentid FROM tf_supervisor_agents WHERE supervisor_account_id='+data.customer_id+' AND agentid IS NOT NULL AND agentid!="" AND agentid!=0) AND s.is_deleted="no" AND s.created_by= '+data.customer_id+' '+ where + ' ORDER BY C.created_date , C.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '', [], callback);
        //return db.query('SELECT C.*,S.name as segment FROM `tf_contacts` C INNER JOIN tf_segments S ON C.category=S.cont_id where ' + where + ' ORDER BY C.created_date , C.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '', [], callback);
    },
    totalsupervisorsearchcalllog: function (data, callback) {
        //console.log(data);
        var where = '';
        if (data.name) {
            where += " and C.name like '%" + data.name + "%'";
        }
        if (data.mobile) {
            where += " and C.mobile like '%" + data.mobile + "%'";
        }
        if (data.email) {
            where += " and C.email like '%" + data.email + "%'";
        }
        if (data.city) {
            where += " and C.city like '%" + data.city + "%'";
        }
        if (data.state) {
            where += " and C.state like '%" + data.state + "%'";
        }
        if (data.category) {
            where += " and C.category='" + data.category + "'";
        }
        //console.log('SELECT count(C.cont_id) as totalcontact FROM tf_contacts C LEFT JOIN tf_segments s ON C.category=s.cont_id WHERE C.created_by IN(SELECT agentid FROM tf_supervisor_agents WHERE supervisor_account_id=' + data.customer_id + ' AND agentid IS NOT NULL AND agentid!="" AND agentid!=0) ' + where );
        return db.query('SELECT count(C.cont_id) as totalcontact FROM tf_contacts C LEFT JOIN tf_segments s ON C.category=s.cont_id WHERE C.created_by IN(SELECT agentid FROM tf_supervisor_agents WHERE supervisor_account_id=' + data.customer_id + ' AND agentid IS NOT NULL AND agentid!="" AND agentid!=0) ' + where, [], callback);
        //return db.query('SELECT count(C.cont_id) as totalcontact FROM `tf_contacts` C INNER JOIN tf_segments S ON C.category=S.cont_id where ' + where, [], callback);
    },


    totalsearchcalllog: function (data, callback) {
        //console.log(data);
        var where = 'C.customer_id=' + data.customer_id;
        if (data.name) {
            where += " and C.name like '%" + data.name + "%'";
        }
        if (data.mobile) {
            where += " and C.mobile like '%" + data.mobile + "%'";
        }
        if (data.email) {
            where += " and C.email like '%" + data.email + "%'";
        }
        if (data.city) {
            where += " and C.city like '%" + data.city + "%'";
        }
        if (data.state) {
            where += " and C.state like '%" + data.state + "%'";
        }
        if (data.category) {
            where += " and C.category='" + data.category + "'";
        }
        //console.log('SELECT count(C.cont_id) as totalcontact FROM `tf_contacts` C INNER JOIN tf_segments S ON C.category=S.cont_id where ' + where );
        return db.query('SELECT count(C.cont_id) as totalcontact FROM `tf_contacts` C INNER JOIN tf_segments S ON C.category=S.cont_id where ' + where, [], callback);
    },
    insertbulkcamagents: function (data, callback) {
        db.query('Insert INTO tf_campaigns_agent (cam_id,account_id,agent_id) VALUES ?', [data], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    insertbulkcamdid: function (data, callback) {
        db.query('Insert INTO tf_campaigns_did (cam_id,account_id,did) VALUES ?', [data], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    getsegmentwithtotalcontact: function (id, callback) {
        db.query('SELECT name,cont_id FROM tf_segments WHERE is_deleted ="no" and customer_id =?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    getcampaigndetail: function (id, callback) {
        return db.query('SELECT *,(SELECT GroupName FROM HuntGroup WHERE GroupID=cam_agentgroup ) AS groupname from tf_campaigns WHERE camid = ?', [id], callback);
    },
    getcampaigncalllog: function (id, callback) {
        return db.query('SELECT C.* from tf_cdr AS C inner join tf_campaigns_numbers AS N on C.auto_numid=N.numid WHERE N.cam_id = ?  ORDER BY C.CallStartTime DESC', [id], callback);
    },
    getcampaigncallsummary: function (id, callback) {
        return db.query('SELECT C.*,count(id) as total from tf_cdr AS C inner join tf_campaigns_numbers AS N on C.auto_numid=N.numid WHERE N.cam_id = ? GROUP BY C.CallStatus', [id], callback);
    },
    getcampaignagent: function (id, callback) {
        return db.query('SELECT * from tf_campaigns_agent as C inner join tf_account_table as A on A.account_id=C.agent_id  WHERE  A.is_deleted="no" and C.cam_id = ? ', [id], callback);
    },
    getcampaigndid: function (id, callback) {
        return db.query('SELECT * FROM `tf_campaigns_did` CD INNER JOIN tf_did D ON CD.did=D.did WHERE CD.cam_id=?', [id], callback);
    },
    getCampaignAgentList: function (id, callback) {
        return db.query('SELECT A.account_id,A.account_name from tf_campaigns_agent as C inner join tf_account_table as A on A.account_id=C.agent_id  WHERE C.cam_id = ? GROUP BY C.agent_id', [id], callback);
    },
    searchcampaigncalllog: function (data, callback) {
        var where = 'N.cam_id = ' + data.campaignid;
        if (data.startdate != '1970-01-01') {
            where += " and DATE(CallStartTime)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(CallStartTime)<='" + data.enddate + "'";
        }
        if (data.status) {
            where += " and CallStatus='" + data.status + "'";
        }
        if (data.agentid) {
            where += " and AgentID='" + data.agentid + "'";
        }
        if (data.callerno) {
            where += " and CallerNumber like '%" + data.callerno + "%'";
        }
        if (data.calltype) {
            where += " and CallType='" + data.calltype + "'";
        }
        if (data.callername) {
            where += " and CallerName like '%" + data.callername + "%'";
        }
        if (data.extension) {
            where += " and LastExtension='" + data.extension + "'";
        }
        //console.log(where)
        return db.query('SELECT C.*,N.* from tf_campaigns_numbers AS N inner join tf_cdr AS C  on C.auto_numid=N.numid WHERE ' + where + ' order by C.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '', [], callback);
    },
    searchpendingdata:function(data,callback){
        var where = 'tcn.cam_id = ' + data.campaignid;
        if (data.startdate != '1970-01-01') {
            where += " and  tcn.date  BETWEEN '" + data.startdate + " 00:00:00'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and '" + data.enddate + "  23:59:59'";
        }
        if (data.callername) {
            where += " and tc.name like '" + data.callername + "%'";
        }
        if (data.callerno) {
            where += " and tc.mobile like '" + data.callerno + "%'";
        }
        return db.query('SELECT tcn.cam_id,tcn.cont_id,tc.name,tc.created_date,tc.mobile FROM tf_campaigns_numbers tcn LEFT JOIN tf_contacts tc ON tcn.cont_id=tc.cont_id WHERE tcn.STATUS=0 AND '+where, callback)
    },
    searchcampaigncal: function (data, callback) {
        var where = 'N.cam_id = ' + data.campaignid;
        if (data.startdate != '1970-01-01') {
            where += " and DATE(CallStartTime)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(CallStartTime)<='" + data.enddate + "'";
        }
        if (data.status) {
            where += " and CallStatus='" + data.status + "'";
        }
        if (data.agentid) {
            where += " and AgentID='" + data.agentid + "'";
        }
        if (data.callerno) {
            where += " and CallerNumber like '%" + data.callerno + "%'";
        }
        if (data.calltype) {
            where += " and CallType='" + data.calltype + "'";
        }
        if (data.callername) {
            where += " and CallerName like '%" + data.callername + "%'";
        }
        if (data.extension) {
            where += " and LastExtension='" + data.extension + "'";
        }
        // console.log(SELECT count(name) as total FROM `tf_master_data)
        // return db.query('SELECT C.* from tf_cdr AS C inner join tf_campaigns_numbers AS N on C.auto_numid=N.numid WHERE '+where+' order by C.CallStartTime desc' , [], callback);
        return db.query('SELECT count(numid) as total from tf_campaigns_numbers AS N inner join tf_cdr AS C on C.auto_numid=N.numid WHERE ' + where + ' order by C.CallStartTime desc', [], callback);
    },
    deletecampaignagent: function (id, callback) {
        return db.query('Select * from  tf_campaigns_agent WHERE camagid=?', id, function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                if (results.length > 0) {
                    var row = results[0]
                    db.query('UPDATE tf_campaigns_numbers SET agent_id=0 WHERE agent_id=? and cam_id = ?', [row.agent_id, row.cam_id])
                }
                return db.query('DELETE FROM `tf_campaigns_agent` WHERE camagid=?', id, callback);
            }
        })
        //return db.query('DELETE FROM `tf_campaigns_agent` WHERE camagid=?',id, callback);
    },
    deletecampaignassigndid: function (id, callback) {
        return db.query('DELETE FROM `tf_campaigns_did` WHERE cam_did=?', id, callback);
    },
    savecampaigndid: function (data, callback) {
        return db.query('Insert INTO tf_campaigns_did SET ?', data, callback);
    },
    getcampaigassignChannel: function (id, callback) {
        db.query('SELECT distinct DN.id,DN.did,D.did_name as channelname FROM tf_did_numbers as DN inner join tf_did  as D on D.did=DN.did where DN.active="1" and DN.Type=9 and DN.account_id=' + id, function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    getcampaignassignagent: function (id, callback) {
        db.query('SELECT * FROM tf_account_table as A where A.current_status="0" and  A.is_deleted="no" and  A.created_by=? ORDER BY A.account_name ASC', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    getcampaignassignsupervisoragent: function (id, callback) {
        //console.log('SELECT A.* FROM tf_account_table as A INNER JOIN tf_supervisor_agents AS S ON S.AgentID=A.account_id where A.current_status="0" and  S.supervisor_account_id=?');
        db.query('SELECT A.* FROM tf_account_table as A INNER JOIN tf_supervisor_agents AS S ON S.AgentID=A.account_id where A.current_status="0" and  S.supervisor_account_id=? ORDER BY A.account_name ASC', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },

    savecampaignagent: function (data, callback) {
        return db.query('Insert INTO tf_campaigns_agent SET ?', data, callback);
    },
    // getContact: function (cid, callback) { 
    //     return db.query('Select * from tf_contacts where customer_id=? ORDER BY created_date DESC',cid, callback);
    // },
    // getContactbySegment: function (data, callback) { 
    //     return db.query('Select * from tf_contacts where customer_id=? and category = ? ORDER BY created_date DESC',[data.id,data.category], callback);
    // }
    checkcallernumber: function (cid, mobileno, callback) {
        //console.log('SELECT * FROM `tf_contacts` WHERE `customer_id` = "'+cid+'" and mobile="'+mobileno+'"')
        //return db.query('SELECT * FROM `tf_contacts` WHERE `customer_id` = ? and mobile=? order by lead_id desc,created_date desc', [cid, mobileno], callback);
        //console.log("SELECT c.cont_id,c.customer_id,c.NAME,c.email,c.mobile,c.address,c.city,c.created_date,IF(c.category IN(NULL,''),d.metavalue,c.category) AS new_category,c.is_mobile_dnd,c.lead_source,c.lead_id,c.created_by,c.is_valid_email,c.emm_customerid FROM tf_contacts c LEFT JOIN tf_configuration d ON c.customer_id=d.user_id WHERE c.customer_id = "+cid+" AND c.mobile='"+mobileno+"' AND d.metakey='category' ORDER BY c.lead_id DESC,c.created_date DESC");
        return db.query("SELECT c.cont_id,c.customer_id,c.NAME,c.email,c.mobile,c.address,c.city,c.state,c.created_date,c.category,c.is_mobile_dnd,c.lead_source,c.lead_id,c.created_by,c.is_valid_email,c.emm_customerid FROM tf_contacts c WHERE c.customer_id = ? AND c.mobile=? ORDER BY c.lead_id DESC,c.created_date DESC", [cid, mobileno], callback);
    },
    campaigncalllogexcel: function (data, callback) {
        var where = 'N.cam_id = ' + data.campaignid;
        if (data.startdate != '1970-01-01') {
            where += " and DATE(CallStartTime)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(CallStartTime)<='" + data.enddate + "'";
        }
        if (data.status) {
            where += " and CallStatus='" + data.status + "'";
        }
        if (data.agentid) {
            where += " and AgentID='" + data.agentid + "'";
        }
        if (data.callerno) {
            where += " and CallerNumber like '%" + data.callerno + "%'";
        }
        if (data.calltype) {
            where += " and CallType='" + data.calltype + "'";
        }
        if (data.callername) {
            where += " and CallerName like '%" + data.callername + "%'";
        }
        if (data.extension) {
            where += " and LastExtension='" + data.extension + "'";
        }
        // console.log(SELECT count(name) as total FROM `tf_master_data)
        // return db.query('SELECT C.* from tf_cdr AS C inner join tf_campaigns_numbers AS N on C.auto_numid=N.numid WHERE '+where+' order by C.CallStartTime desc' , [], callback);
        return db.query('SELECT *,DATE_FORMAT(C.CallStartTime,"%d-%m-%Y %H:%i:%s") as CallStartTime from tf_cdr AS C inner join tf_campaigns_numbers AS N on C.auto_numid=N.numid WHERE ' + where + ' order by C.CallStartTime desc', [], callback);
    },
    getStatedata: function (id, callback) {
        return db.query('SELECT * FROM `tf_state`', [], callback);

    },
    getcampaignsegment: function (cid, callback) {
        //return db.query('Select N.*,S.name from tf_campaigns_numbers N INNER JOIN tf_segments S ON S.cont_id=N.segment_id where N.cam_id=? group by N.segment_id',[cid], callback);
        return db.query('Select (SELECT COUNT(numid) FROM tf_campaigns_numbers WHERE cam_id=N.cam_id and status=0) as runningrecord,(SELECT COUNT(numid) FROM tf_campaigns_numbers WHERE cam_id=N.cam_id and (status=2 or status=1)) as completerecord, 0 as pendingrecord  from tf_campaigns_numbers N where N.cam_id=' + cid + ' GROUP BY N.cam_id', [cid], callback);
    },
    checkcampaigncontact: function (data, callback) {
        return db.query('Select * FROM tf_campaigns_numbers WHERE cam_id=' + data.campaignid + ' and account_id=' + data.userid + ' and agent_id=' + data.agentid + ' and cont_id LIKE "%' + data.mobile + '%"', [], callback);

    },
    getcallogdata: function (id, callback) {
        return db.query('Select * FROM tf_cdr WHERE id=' + id, [], callback);
    },
    insertcampaignnumber: function (Contacts, callback) {
        return db.query('Insert INTO tf_campaigns_numbers SET ?', Contacts, callback);
    },
    insertcontactwithcamnumber: function (Contacts, numbers, callback) {
        return db.query('Insert INTO tf_contacts SET ?', Contacts, function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                return db.query('Insert INTO tf_campaigns_numbers SET ?', numbers, callback);
            }
        })
    },
    getratedate: function (id, callback) {
        return db.query("SELECT SUM(C.CallPluse) as total,DATE(C.CallStartTime) as date FROM `tf_campaigns_numbers` N INNER JOIN tf_cdr C ON N.numid=C.auto_numid WHERE N.cam_id=? GROUP BY date", [id], callback);
        //  return db.query("SELECT C.*,count(id) as total , A.pules,A.pulesrate from tf_cdr AS C inner join tf_campaigns As A inner join tf_campaigns_numbers AS N on C.auto_numid=N.numid WHERE N.cam_id = ? and C.`accountid`= A.account_id and C.CallStatus ='CUSTOMERHANGPUP'  GROUP BY C.CallStatus",[id],callback)
        // return db.query("SELECT C.*,count(id) as total from tf_cdr AS C inner join tf_campaigns_numbers AS N on C.auto_numid=N.numid WHERE N.cam_id = ?  and  C.CallStatus ='CUSTOMERHANGPUP' GROUP BY C.CallStatus", [id], callback);

    },
    updateContact: function (data, id, callback) {
        return db.query('UPDATE `tf_contacts` SET ? WHERE cont_id= ? ', [data, id], callback);
    },
    addfilerequest: function (Contacts, callback) {
        return db.query('Insert INTO tf_bulkupload_request SET ?', Contacts, callback);
    },
    BulkFiledata: function (status, callback) {
        return db.query('Select * from tf_bulkupload_request where status=? order by upload_date asc limit 1', [status], callback);
    },
    updatebulkfileStatus: function (Contacts, cont_id, callback) {
        return db.query('UPDATE `tf_bulkupload_request` SET ? WHERE `fid`="' + cont_id + '"', Contacts, callback);
    },
    insertbulkcontactmeta: function (data, callback) {
        db.query('Insert INTO tf_contacts_meta (account_id,cont_id,meta_key,meta_value) VALUES ?', [data], callback);
    },
    BulkFiledatabycustomer: function (id, callback) {
        return db.query('Select * from tf_bulkupload_request where customer_id=? ORDER BY `fid` DESC', [id], callback);
    },
    BulkFiledatabysupervisor: function (id, callback) {
        return db.query('Select * from tf_bulkupload_request where created_by=? ORDER BY `fid` DESC', [id], callback);
    },
    BulkFileagentdatabycustomer: function (id, callback) {
        return db.query('Select * from tf_bulkupload_calender_request where customer_id=?', [id], callback);
    },
    BulkFileReqdata: function (id, callback) {
        return db.query('Select * from tf_bulkupload_request where status=?', [id], callback);
    },
    getagentcontacts: function (data, callback) {
        //console.log(data);
        var where = 'C.created_by=' + data.agent_id;
        // var where = '1=1' ;
        if (data.callerno) {
            where += ' and C.mobile LIKE "' + data.callerno + '"';
        }
        if (data.name) {
            where += ' and C.name LIKE "' + data.name + '"';
        }
        if (data.email) {
            where += ' and C.email LIKE "' + data.email + '"';
        }
        if (data.segment) {
            where += ' and C.category ="' + data.segment + '"';
        }
        //console.log('SELECT C.*,S.name as segment FROM `tf_contacts` C INNER JOIN tf_segments S ON C.category=S.cont_id where ' + where + ' ORDER BY C.created_date ');
        return db.query('SELECT C.*,S.name as segment FROM `tf_contacts` C INNER JOIN tf_segments S ON C.category=S.cont_id where ' + where + ' ORDER BY C.created_date ', [], callback);
    },
    CalenderFiledata: function (uid, callback) {
        return db.query('Select * from tf_bulkupload_calender_request where status=? order by upload_date asc limit 1', [uid], callback);
    },
    updatefileStatusCalender: function (Contacts, cont_id, callback) {
        return db.query('UPDATE `tf_bulkupload_calender_request` SET ? WHERE `tf_bulkupload_calender_request`.`fid`="' + cont_id + '"', Contacts, callback);
    },
    updatefileCalenderStatus: function (Contacts, cont_id, callback) {
        return db.query('UPDATE `tf_bulkupload_calender_request` SET ? WHERE `tf_bulkupload_calender_request`.`fid`="' + cont_id + '"', Contacts, callback);
    },
    insertbulkcalender: function (data, callback) {
        db.query('Insert INTO tf_scheduler (meeting_type,customer_name,Description,email,mobile,StartTime,EndTime,user_id,meeting_link,original_meeting_link) VALUES ?', [data], callback);
    },
    updatefileStatusCalender: function (Contacts, cont_id, callback) {
        return db.query('UPDATE `tf_bulkupload_calender_request` SET ? WHERE `tf_bulkupload_calender_request`.`fid`="' + cont_id + '"', Contacts, callback);
    },
    getsegments: function (id, callback) {
        return db.query('SELECT * FROM tf_segments S LEFT JOIN tf_account_table A ON A.created_by=S.customer_id where A.account_id=' + id, Contacts, callback);
    },
    searchcampaignrecords: function (data, callback) {
        var where = 'N.cam_id = ' + data.campaignid;
        if (data.startdate != '1970-01-01') {
            where += " and DATE(CallStartTime)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(CallStartTime)<='" + data.enddate + "'";
        }
        if (data.status) {
            where += " and CallStatus='" + data.status + "'";
        }
        if (data.agentid) {
            where += " and AgentID='" + data.agentid + "'";
        }
        if (data.callerno) {
            where += " and CallerNumber like '%" + data.callerno + "%'";
        }
        if (data.calltype) {
            where += " and CallType='" + data.calltype + "'";
        }
        if (data.callername) {
            where += " and CallerName like '%" + data.callername + "%'";
        }
        if (data.extension) {
            where += " and LastExtension='" + data.extension + "'";
        }
        //console.log(where)
        return db.query('SELECT C.*,N.* from tf_campaigns_numbers AS N inner join tf_cdr AS C  on C.auto_numid=N.numid WHERE ' + where + ' order by C.' + data.sortcolumn + ' ' + data.sortdirection + '', [], callback);
    },
    deletecampaingnreq: function (id, callback) {
        /*db.query('UPDATE tf_campaigns set is_deleted="yes" where camid=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);

            }
        })*/
        return db.query('DELETE FROM `tf_campaigns_agent` WHERE cam_id=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                return db.query('DELETE FROM `tf_campaigns_did` WHERE cam_id=?', [id], function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                    } else {
                        return db.query('UPDATE tf_campaigns set is_deleted="yes" ,cam_action = "2" where camid=?', [id], callback);
                    }
                })
            }
        })
    },
    stopcampaign: function (data, callback) {
        db.query('SELECT C.id FROM `tf_campaigns_numbers` N INNER JOIN tf_cdr C ON C.auto_numid=N.numid WHERE `cam_id` = ? and C.in_queue=1', [data.camid], function (err, callresults) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                for (let index = 0; index < callresults.length; index++) {
                    const element = callresults[index];
                    db.query('UPDATE tf_cdr set in_queue=0 where id=?', [element.id], function (err, cresults) {
                        if (err) {
                            console.log("[mysql error]", err);
                        } else {
                            db.query('UPDATE tf_queuecall set status="1" where cdrid=?', [element.id], function (err, qresults) {
                                if (err) {
                                    console.log("[mysql error]", err);
                                } else {
                                    callback(err, qresults);
                                }
                            })
                        }
                    })
                }
                db.query('UPDATE tf_campaigns SET ? WHERE camid=?', [data, data.camid], function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                    } else {
                        callback(err, results);
                    }
                });
            }
        });

    },
    getcampaignunassignagent: function (id, camid, callback) {
        //old db.query('SELECT * FROM tf_account_table as A where A.current_status="0" and   A.created_by=' + id + ' and A.account_id NOT IN (SELECT agent_id FROM tf_campaigns_agent CA LEFT JOIN tf_campaigns C ON C.camid=CA.cam_id WHERE C.dialer_type="1" and  CA.account_id=' + id + ' AND C.is_deleted="no" AND (C.camid=' + camid + ' OR C.cam_status!="2"))', [id], function (err, results) {
      db.query('SELECT A.account_id,A.account_name FROM tf_account_table A WHERE A.current_status="0" AND A.is_deleted="no" AND A.created_by='+id+' AND A.account_id NOT IN (SELECT agent_id FROM tf_campaigns_agent CA LEFT JOIN tf_campaigns C ON C.camid=CA.cam_id WHERE CA.account_id='+id+' AND C.is_deleted="no" AND (C.cam_status!="2" OR C.camid='+camid+'))', [id], function (err, results) {
      if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    getcampaigunassignsupervisoragent: function (id, camid, callback) {
        //console.log('SELECT * FROM tf_account_table as A INNER JOIN tf_supervisor_agents S ON S.AgentID=A.account_id where A.current_status="0" and   S.supervisor_account_id=' + id + ' and S.AgentID NOT IN (SELECT agent_id FROM tf_campaigns_agent CA LEFT JOIN tf_campaigns C ON C.camid=CA.cam_id WHERE C.dialer_type="1" and  C.created_by=' + id + ' AND C.is_deleted="no" AND (C.camid='+camid+' OR C.cam_status!="2"))');
        db.query('SELECT * FROM tf_account_table as A INNER JOIN tf_supervisor_agents S ON S.AgentID=A.account_id where A.current_status="0" and   S.supervisor_account_id=' + id + ' and S.AgentID NOT IN (SELECT agent_id FROM tf_campaigns_agent CA LEFT JOIN tf_campaigns C ON C.camid=CA.cam_id WHERE C.dialer_type="1" and  C.created_by=' + id + ' AND C.is_deleted="no" AND (C.camid=' + camid + ' OR C.cam_status!="2"))', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },

    getgroupunassignagent: function (data, callback) {
        //  console.log(data);
        // db.query('SELECT A.account_name,A.account_id FROM `HuntGroup` H INNER JOIN HuntGroupDetail G ON H.GroupID=G.HuntGroupID LEFT JOIN tf_account_table A ON G.AgentID=A.account_id WHERE A.current_status !="1" and H.GroupID =' + data.id + ' AND A.account_id NOT IN (SELECT agent_id FROM tf_campaigns_agent CA LEFT JOIN tf_campaigns C ON C.camid=CA.cam_id WHERE C.dialer_type="1" and C.cam_status!="2" AND CA.account_id=' + data.userid + ' AND C.is_deleted="no") ORDER BY A.account_name ASC', [data.id], function (err, results) {
     db.query('SELECT A.account_name,A.account_id FROM HuntGroup H INNER JOIN HuntGroupDetail G ON H.GroupID=G.HuntGroupID LEFT JOIN tf_account_table A ON G.AgentID=A.account_id WHERE A.current_status="0" AND A.is_deleted="no" AND H.GroupID ='+data.id+' AND A.account_id NOT IN (SELECT agent_id FROM tf_campaigns_agent CA LEFT JOIN tf_campaigns C ON C.camid=CA.cam_id WHERE C.cam_status!="2" AND CA.account_id='+data.userid+' AND C.is_deleted="no") ORDER BY A.account_name ASC', [data.id], function (err, results) {

        if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },

    serachcampagindata: function (data, callback) {
        var where = 'C.account_id = ' + data.customer_id + ' and C.cam_status ="' + data.cam_statustab + '" and (C.cam_method!=1 OR C.cam_method IS NULL) ';
        if (data.startdate != '1970-01-01' && data.startdate != null && data.startdate != '') {
            where += " and DATE(C.create_date)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01' && data.enddate != null && data.enddate != '') {
            where += " and DATE(C.create_date)<='" + data.enddate + "'";
        }
        if (data.cam_type) {
            where += " and C.cam_type = " + data.cam_type;
        }
        //console.log("SELECT C.*,A.is_deleted as deleted FROM `tf_campaigns` C LEFT JOIN tf_account_table A ON A.account_id=C.lms_agentid " + where + "  and  C.is_deleted ='no' ORDER by C.camid DESC");
        return db.query("SELECT C.*,A.is_deleted as deleted FROM `tf_campaigns` C LEFT JOIN tf_account_table A ON A.account_id=C.lms_agentid where " + where + "  and  C.is_deleted ='no' ORDER by C.camid DESC", callback);
    },

    serachsupervisorcampagindata: function (data, callback) {
        var where = 'created_by = ' + data.customer_id + ' and cam_status ="' + data.cam_statustab + '"';
        if (data.startdate != '1970-01-01' && data.startdate != null && data.startdate != '') {
            where += " and DATE(create_date)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01' && data.enddate != null && data.enddate != '') {
            where += " and DATE(create_date)<='" + data.enddate + "'";
        }
        if (data.cam_status) {
            where += " and cam_status='" + data.cam_status + "'";
        }
        if (data.cam_method) {
            where += " and cam_method=" + data.cam_method;
        }
        if (data.cam_type) {
            where += " and cam_type = " + data.cam_type;
        }
        //console.log("SELECT * FROM `tf_campaigns`  WHERE " +where +"  and  is_deleted ='no' ORDER by camid DESC");
        return db.query("SELECT * FROM `tf_campaigns`  WHERE " + where + "  and  is_deleted ='no' ORDER by camid DESC", callback);
    },

    getsegmentstotalcontactcount: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT COUNT(cont_id) as totalcontact FROM tf_contacts WHERE category="' + id + '"', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        resolve(results[0].totalcontact);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },
    savescheduleform: function (data, callback) {
        return db.query('Insert INTO tf_campaign_schedule SET ?', data, callback);
    },
    getcampaignscheduledata: function (campid, userid, callback) {
        return db.query("SELECT * FROM `tf_campaign_schedule` where campaignid = " + campid + " and account_id =" + userid, callback);
    },
    updatescheduleform: function (data, callback) {
        return db.query('UPDATE `tf_campaign_schedule` SET ? WHERE `id`=' + data.id, data, callback);
    },
    predectiveassignAgentList: function (data, callback) {
        //console.log("daa",data);
        db.query('SELECT A.account_name,A.account_id FROM `HuntGroup` H INNER JOIN HuntGroupDetail G ON H.GroupID=G.HuntGroupID LEFT JOIN tf_account_table A ON G.AgentID=A.account_id WHERE A.current_status !="1" and H.GroupID =' + data.group + ' AND A.account_id NOT IN (SELECT agent_id FROM tf_campaigns_agent CA LEFT JOIN tf_campaigns C ON C.camid=CA.cam_id WHERE C.dialer_type="1" and CA.cam_id=' + data.campid + ' and CA.account_id=' + data.userid + ' AND C.is_deleted="no")', [data.id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    deletecontactmeta: function (id, callback) {
        return db.query('DELETE FROM `tf_contacts_meta` WHERE meta_id=?', [id], callback);
    },
    getrunningCampaign: function (id, callback) {
        return db.query('SELECT * from tf_campaigns WHERE is_deleted ="no" and cam_status="1" and account_id = ? ORDER BY created_at DESC', [id], callback);
    },
    getcompaleteCampaign: function (id, callback) {
        return db.query('SELECT * from tf_campaigns WHERE is_deleted ="no" and cam_status="2" and account_id = ? ORDER BY created_at DESC', [id], callback);
    },
    getSupervisorSegmentwithTotalContact: function (id, callback) {
        //db.query('SELECT count(C.cont_id) as totalcontact,S.name,S.cont_id FROM `tf_contacts` AS C inner join `tf_segments` AS S ON C.category=S.cont_id WHERE S.is_deleted ="no" and  C.created_by =?  GROUP BY C.category', [id], function (err, results) {
        db.query('SELECT name,cont_id FROM `tf_segments` WHERE is_deleted ="no" and  created_by =?  ORDER BY name ASC', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    
    /*gettotalcontactbysegment: function (id, callback) {
       // console.log('SELECT COUNT(C.cont_id) as totalcontact,S.name FROM tf_contacts C INNER JOIN tf_segments S ON S.cont_id=C.category WHERE C.category="' + id + '"');
        return db.query('SELECT COUNT(C.cont_id) as totalcontact,S.name FROM tf_contacts C INNER JOIN tf_segments S ON S.cont_id=C.category WHERE C.category="' + id + '"', [id], callback);
    },*/
    gettotalcontactbysegment: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT COUNT(C.cont_id) as totalcontact,S.name FROM tf_contacts C INNER JOIN tf_segments S ON S.cont_id=C.category WHERE C.category="' + id + '"', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    if (results.length > 0) {
                        resolve(results[0]);
                    } else {
                        resolve(0);
                    }
                }
            })
        })
    },
    getLastContact: function (cid, callback) {
        return db.query('Select * from tf_contacts where customer_id=? ORDER BY created_date DESC limit 0,1', cid, callback);
    },
    getdefaultcategory: function (cid, callback) {
        //console.log('SELECT * FROM `tf_contacts` WHERE `customer_id` = "'+cid+'" and mobile="'+mobileno+'"')
        //return db.query('SELECT * FROM `tf_contacts` WHERE `customer_id` = ? and mobile=? order by lead_id desc,created_date desc', [cid, mobileno], callback);
        //console.log("SELECT c.cont_id,c.customer_id,c.NAME,c.email,c.mobile,c.address,c.city,c.created_date,IF(c.category IN(NULL,''),d.metavalue,c.category) AS new_category,c.is_mobile_dnd,c.lead_source,c.lead_id,c.created_by,c.is_valid_email,c.emm_customerid FROM tf_contacts c LEFT JOIN tf_configuration d ON c.customer_id=d.user_id WHERE c.customer_id = "+cid+" AND c.mobile='"+mobileno+"' AND d.metakey='category' ORDER BY c.lead_id DESC,c.created_date DESC");
        return db.query("SELECT metavalue FROM tf_configuration  WHERE user_id = ? AND metakey='category'", [cid], callback);
    },
    delete_agent_camp: function(id,callback){
        return db.query("SELECT C.*,A.is_deleted FROM `tf_campaigns` C LEFT JOIN tf_account_table A ON A.account_id=C.lms_agentid WHERE A.is_deleted='yes' and C.account_id="+id,callback)
    },
    update_call_ratio:function(data,callback){
        return db.query( 'UPDATE `tf_campaigns` SET ? WHERE `camid`=' + data.camid+' and account_id ='+data.account_id, data, callback)
    },
    totalcampaindatainreqlive:function(data,callback){
        return db.query(' DELETE FROM `tf_cdr_live_request` WHERE `camid` = '+data,callback);
    }
}


module.exports = Contacts;
