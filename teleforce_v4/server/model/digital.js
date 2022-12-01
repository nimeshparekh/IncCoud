var db = require('../database/db');
var tfdb = require('../database/tfdb');

var Digital = {
    
    getChannel: function (username, callback) {
    
        return tfdb.query('SELECT * FROM ps_endpoints', [], callback);
        return db.query('SELECT * from dp_customers where username=?',[username],function (err, results) {
       //console.log(results);
            if (err) {
                console.log("[mysql error]", err);
            } else {
                if (results[0].role == "admin") {
                    return db.query('SELECT * FROM ps_endpoints', [], callback);
                }
                callback(err, results);
            }
        });
    },
    getChannelDetail: function (id, callback) {
        return db.query('SELECT reg.*,aor.max_contacts,aor.contact,aor.qualify_frequency,aor.remove_existing,auth.auth_type,auth.username,auth.realm,endp.transport as e_transport,endp.aors as e_aors,endp.outbound_auth as e_outbound_auth,endp.context as e_context,endp.disallow as e_disallow,endp.allow as e_allow,endp.direct_media as e_direct_media,endp.rtp_symmetric as e_rtp_symmetric,endp.force_rport as e_force_rport,endp.rewrite_contact as e_rewrite_contact,endp.dtls_ca_file as e_dtls_ca_file,endp.dtls_cert_file as e_dtls_cert_file,endp.from_domain as e_from_domain,endp.preferred_codec_only as e_preferred_codec_only,endp.webrtc as e_webrtc,eip.endpoint as ip_endpoint,eip.match as ip_match FROM ps_registrations reg LEFT JOIN ps_aors aor ON reg.id=aor.id LEFT JOIN ps_auths auth ON reg.id=auth.id LEFT JOIN ps_endpoints endp ON reg.id=endp.id LEFT JOIN ps_endpoint_id_ips eip ON reg.id=eip.id where reg.id=?', [id], callback);
    }, 
    checkchanneluserexist:function (username,callback) {
        return db.query('SELECT * from ps_auths where username=?',[username],callback);
    },
    checkchannelid:function (id,callback) {
        return db.query('SELECT * from ps_registrations where id=?',[id],callback);
    },
     updatechannel: function (ps_aors_data, ps_auths_data, ps_endpoints_data, ps_ip_data, ps_registrations_data, callback) {
        /*db.query('update ps_aors set ? WHERE id = ?',[ps_aors_data,ps_aors_data.id], callback);
        db.query('update ps_auths set ? WHERE id = ?',[ps_auths_data,ps_auths_data.id], callback);
        db.query('update ps_endpoints set ? WHERE id = ?',[ps_endpoints_data,ps_endpoints_data.id], callback);
        db.query('update ps_endpoint_id_ips set ? WHERE id = ?',[ps_ip_data,ps_ip_data.id], callback);
         db.query('update ps_registrations set ? WHERE id = ?',[ps_registrations_data,ps_registrations_data.id], callback);
*/


        db.query('update ps_aors set ? WHERE id = ?', [ps_aors_data, ps_aors_data.id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                db.query('update ps_auths set ? WHERE id = ?', [ps_auths_data, ps_auths_data.id], function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                    } else {
                        db.query('update ps_endpoints set ? WHERE id = ?', [ps_endpoints_data, ps_endpoints_data.id], function (err, results) {
                            if (err) {
                                console.log("[mysql error]", err);
                            } else {
                                db.query('update ps_endpoint_id_ips set ? WHERE id = ?', [ps_ip_data, ps_ip_data.id], function (err, results) {
                                    if (err) {
                                        console.log("[mysql error]", err);
                                    } else {
                                        return db.query('update ps_registrations set ? WHERE id = ?', [ps_registrations_data, ps_registrations_data.id], callback);
                                    }
                                })
                            }
                        })
                    }
                })

            }
        });

    },
    createchannel: function (ps_aors_data, ps_auths_data, ps_endpoints_data, ps_ip_data, ps_registrations_data, callback) {
        db.query('Insert INTO ps_registrations SET ?', ps_registrations_data, function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                db.query('Insert INTO ps_aors SET ?', ps_aors_data, function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                    } else {
                        db.query('Insert INTO ps_auths SET ?', ps_auths_data, function (err, results) {
                            if (err) {
                                console.log("[mysql error]", err);
                            } else {
                                db.query('Insert INTO ps_endpoints SET ?', ps_endpoints_data, function (err, results) {
                                    if (err) {
                                        console.log("[mysql error]", err);
                                    } else {
                                        db.query('Insert INTO ps_endpoint_id_ips SET ?', ps_ip_data, function (err, results) {
                                            if (err) {
                                                console.log("[mysql error]", err);
                                            } else {
                                                callback(err, results);
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
        // db.query('Insert INTO ps_aors SET ?', ps_aors_data, callback);
        // db.query('Insert INTO ps_auths SET ?', ps_auths_data, callback);
        // db.query('Insert INTO ps_endpoints SET ?', ps_endpoints_data, callback);
        // db.query('Insert INTO ps_endpoint_id_ips SET ?', ps_ip_data, callback);
        // db.query('Insert INTO ps_registrations SET ?', ps_registrations_data, callback);
    },  
    deletechannel: function (id, callback) {
        db.query('DELETE FROM ps_aors  where id=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                db.query('DELETE FROM  ps_auths  where id=?', [id], function (err, results) {
                    if (err) {
                        console.log("[mysql error]", err);
                    } else {
                        db.query('DELETE FROM ps_endpoints  where id=?', [id], function (err, results) {
                            if (err) {
                                console.log("[mysql error]", err);
                            } else {
                                db.query('DELETE FROM  ps_endpoint_id_ips   where id=?', [id], function (err, results) {
                                    if (err) {
                                        console.log("[mysql error]", err);
                                    } else {
                                        return db.query('DELETE FROM  	ps_registrations  where id=?', [id], callback);
                                    }
                                })
                            }
                        })
                    }
                })

            }
        });
    },
    getsocial_access: function (user,media,brand, callback) {
        return db.query('select * from td_social_access where access_customer_id = ? AND access_media = ? AND access_brand = ?', [user,media,brand], callback);
    },
    savesocialaccess: function (data, callback) {
        return db.query('Insert INTO td_social_access SET ?', [data], callback);
    },
    updatesocial_access: function (data,id,id2, callback) {
        return db.query('update td_social_access set ? where access_customer_id=? and a_id= ? ', [data,id,id2], callback);
    },
    delete_brand: function (id, callback) {
        return db.query('DELETE FROM `td_brand` WHERE `brand_id` IN (?)', [id], callback)
    },
    edit_brand: function (data, id, callback) {
        console.log(data);
        return db.query('UPDATE `td_brand` SET ? WHERE `td_brand`.`brand_id` = ?', [data, id], callback)
    },
    savebrand: function (data, callback) {
        console.log('innn',data);
        return db.query('Insert INTO td_brand SET ?', [data], callback);
    },
    get_brands: function (username, callback) {
        return db.query('SELECT * FROM `td_brand` WHERE `username` = ?', [username], callback)
    },
    get_brand: function (id, username, callback) {
        return db.query('SELECT * FROM `td_brand` WHERE `brand_id` = ? AND `username` = ?', [id, username], callback)
    },
    delete_brand_channels: function (id, callback) {
        return db.query('DELETE FROM `td_channels` WHERE `brand_id` IN (?)', [id], callback)
    },
    getchannel_check: function (user,brand, callback) {
        return db.query('select * from td_channels where username = ? AND brand_id = ?', [user,brand], callback);
    },
    getsocial_access_brand_id: function (user,brand, callback) {
        return db.query('select * from td_social_access where access_customer_id = ? AND access_brand = ?', [user,brand], callback);
    },
    getchannel: function (user,brand,media,page_id, callback) {
        return db.query('select * from td_channels where username = ? AND brand_id = ? AND access_media = ? AND page_id = ?', [user,brand,media,page_id], callback);
    },
    savechannel: function (data, callback) {
        console.log('savechannel',data);
        return db.query('Insert INTO td_channels SET ?', [data], callback);
    },
    delete_channel_id:function(id,callback){
        console.log('delete',id);
        return db.query('DELETE FROM td_channels where channel_id=?', [id], callback);
    },
    getChatUser:function(user_id,role,callback){
        if(role==1){
           $sql="select c.*,ch.accessToken,(SELECT COUNT(message_read) FROM `td_chat_details` WHERE chat_id=c.chat_id and message_read=0) as total from td_chat as c left JOIN td_channels as ch on ch.page_id=c.channel_id where c.agent_id =? ORDER BY c.last_update DESC";
        }else{
           $sql="select c.*,ch.accessToken,(SELECT COUNT(message_read) FROM `td_chat_details` WHERE chat_id=c.chat_id and message_read=0) as total from td_chat as c left JOIN td_channels as ch on ch.page_id=c.channel_id  where c.user_id =? ORDER BY c.last_update DESC";
        }
        
        return db.query($sql ,[user_id], callback); 
    },
    getChatUserNew:function(user_id,role,callback){
        if(role==1){
           $sql="select c.*,ch.accessToken,(SELECT COUNT(message_read) FROM `td_chat_details` WHERE chat_id=c.chat_id and message_read=0) as total,(SELECT date_time FROM `td_chat_details` WHERE chat_id=c.chat_id ORDER BY date_time desc limit 1) as last_msg_time from td_chat as c left JOIN td_channels as ch on ch.page_id=c.channel_id  where c.agent_id =? and live_status=0  ORDER BY last_msg_time DESC";
        }else{
           $sql="select c.*,ch.accessToken,(SELECT COUNT(message_read) FROM `td_chat_details` WHERE chat_id=c.chat_id and message_read=0) as total,(SELECT date_time FROM `td_chat_details` WHERE chat_id=c.chat_id ORDER BY date_time desc limit 1) as last_msg_time from td_chat as c left JOIN td_channels as ch on ch.page_id=c.channel_id  where c.user_id =? and live_status=0 ORDER BY last_msg_time DESC";
        }
        
        return db.query($sql ,[user_id], callback); 
    },
    getCahtUserLive:function(user_id,role,callback){
        if(role==1){
           $sql="select c.*,ch.accessToken,(SELECT COUNT(message_read) FROM `td_chat_details` WHERE chat_id=c.chat_id and message_read=0) as total,(SELECT date_time FROM `td_chat_details` WHERE chat_id=c.chat_id ORDER BY date_time desc limit 1) as last_msg_time from td_chat as c left JOIN td_channels as ch on ch.page_id=c.channel_id where c.agent_id =? and live_status=1 and chat_id not in (select chat_id from td_chat WHERE last_update < NOW() - INTERVAL 10 MINUTE and live_status !=0) ORDER BY last_msg_time DESC";
        }else{
           $sql="select c.*,ch.accessToken,(SELECT COUNT(message_read) FROM `td_chat_details` WHERE chat_id=c.chat_id and message_read=0) as total,(SELECT date_time FROM `td_chat_details` WHERE chat_id=c.chat_id ORDER BY date_time desc limit 1) as last_msg_time from td_chat as c left JOIN td_channels as ch on ch.page_id=c.channel_id where c.user_id =? and live_status=1 and chat_id not in (select chat_id from td_chat WHERE last_update < NOW() - INTERVAL 10 MINUTE and live_status !=0) ORDER BY last_msg_time DESC";
        }
        
        return db.query($sql ,[user_id], callback); 
    },
    getChatUserArchive:function(user_id,role,callback){
        if(role==1){
           $sql="select c.*,ch.accessToken,(SELECT COUNT(message_read) FROM `td_chat_details` WHERE chat_id=c.chat_id and message_read=0) as total,(SELECT date_time FROM `td_chat_details` WHERE chat_id=c.chat_id ORDER BY date_time desc limit 1) as last_msg_time from td_chat as c left JOIN td_channels as ch on ch.page_id=c.channel_id  where c.agent_id =? and last_update < NOW() - INTERVAL 10 MINUTE and (live_status !=0 or live_status=1) ORDER BY last_msg_time DESC";
        }else{
           $sql="select c.*,ch.accessToken,(SELECT COUNT(message_read) FROM `td_chat_details` WHERE chat_id=c.chat_id and message_read=0) as total,(SELECT date_time FROM `td_chat_details` WHERE chat_id=c.chat_id ORDER BY date_time desc limit 1) as last_msg_time from td_chat as c left JOIN td_channels as ch on ch.page_id=c.channel_id  where c.user_id =? and last_update < NOW() - INTERVAL 10 MINUTE and (live_status !=0 or live_status=1) ORDER BY last_msg_time DESC";
        }
        
        return db.query($sql ,[user_id], callback); 
    },
    getChatdetails:function(chat_id,callback){
        db.query('UPDATE td_chat_details SET message_read=1 WHERE chat_id = ?', [chat_id]);
        return db.query('SELECT detail_id,chat_id,a_id,b_id,s_no,option_type,chat_text,message_mid,attachement,is_echo,message_read,message_read_time,date_time,TIME_FORMAT(date_time, "%h:%i %p") AS chat_time FROM td_chat_details WHERE chat_id = ? ORDER BY detail_id ASC' ,[chat_id], callback); 
    },
    get_message_user_data_by_channel: function (data, callback) { 
        return db.query('Select * from td_messages_user where channelid=?', [data], callback);
    },
    get_message_user_data_by_channel_agent: function (data,agent_id, callback) { 
        return db.query('Select * from td_messages_user where channelid=? and agent_id = ?', [data,agent_id], callback);
    },
    get_message_user_data_by_channel_insta: function (data, callback) { 
        return db.query('Select * from td_messages_user where channelid=? and channeltype = "instagram"', [data], callback);
    },
    get_message_user_data_by_channel_insta_agent: function (data,agent_id, callback) { 
        return db.query('Select * from td_messages_user where channelid=? and agent_id = ? and channeltype = "instagram"', [data,agent_id], callback);
    },
    getchannel_page_id: function (page_id, callback) {
        return db.query('select * from td_channels where page_id = ?' ,[page_id], callback);
    },
    get_message_user_data: function (data, callback) { 
        return db.query('Select * from td_chat where sender_id=?', [data], callback);
    },
    getchannel_pages: function (page_id,media, callback) {
        return db.query('select * from td_channels where page_id = ? and access_media = ?', [page_id,media], callback);
    },
    save_message_user: function (data, callback) { 
        return db.query('INSERT INTO td_chat SET ?', [data], callback);
    },
    updateChatLiveStatus(chat_id,callback){
        return db.query('UPDATE  td_chat  SET live_status=0 where chat_id=?', [chat_id], callback);
    },
    GetMessageAgent: async function (gid,user) {
        console.log('GetMessageAgent',gid);
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM HuntGroupDetail  WHERE HuntGroupID=?', [gid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    console.log('results_Hunt',results);
                    if (results.length > 0) {
                        var agentlead = []
                        var cnt = 0 
                        results.forEach(element => {
                            db.query('SELECT * FROM td_chat WHERE agent_id=? and user_id = ? ORDER BY chat_id DESC LIMIT 1', [element.AgentID,user], function (err, rows) {
                                cnt = cnt + 1
                                if(rows.length>0){
                                    var row = rows[0]
                                    agentlead.push({id:element.AgentID,date:row.date_time})
                                    console.log('agentlead',agentlead)
                                    //console.log(cnt+'=='+results.length)
                                    if(cnt==results.length){
                                        agentlead.sort(function(a, b) {
                                            var c = new Date(a.date).getTime();
                                            var d = new Date(b.date).getTime();
                                            return c>d?1:-1;
                                        });
                                        console.log('lead',agentlead)
                                        resolve(agentlead[0].id);
                                    }        
                                }else{
                                    resolve(element.AgentID);
                                }
                            })
                        });
                    } else {
                        resolve('');
                    }
                }
            })
        })
    },
    get_message_to_user_username: function (chat_id, callback) { 
        return db.query('SELECT chn.username,c.* FROM td_chat as c LEFT JOIN td_channels as chn on c.channel_id=chn.page_id WHERE c.chat_id=?',[chat_id], callback);
       // return db.query('SELECT C.username, M.* FROM td_messages_user M INNER JOIN td_channels C ON M.channelid = C.page_id AND C.username = M.user_id WHERE M.channelid = ? AND sendepsid = ? AND M.channeltype = ? ', [channelid,sender,channeltype], callback);
    },
    save_message: function (data, callback) { 
        db.query('UPDATE  td_chat  SET last_update=now() where chat_id=?', [data.chat_id], callback);
        return db.query('INSERT INTO td_chat_details SET ?', [data], callback);
    },
    get_message_data_sender: function (data, callback) { 
        return db.query('Select * from td_messages where sender=?', [data], callback);
    },
    get_bucket_file_created: function (data,data2, callback) {
        return db.query('SELECT * FROM `td_bucket` WHERE `access_customer_id` = ? AND `name`=?', [data,data2], callback);
    },
    create_bucket: function (data, callback) {
        return db.query('Insert INTO td_bucket SET ?', [data], callback);
    },
    create_bucket_file: function (data, callback) {
        return db.query('Insert INTO td_bucket_file SET ?', [data], callback);
    },
    list_bucket: function (data, callback) {
        return db.query('SELECT * FROM `td_bucket` WHERE `B_id` = ?', [data], callback);
    },
    list_bucket_default: function (data,data2,callback) {
        return db.query('SELECT * FROM `td_bucket` WHERE `access_customer_id` = ? AND `name`=?', [data,data2], callback);
    },
    get_bucket: function (data, callback) {
        return db.query('SELECT * FROM `td_bucket` WHERE `access_customer_id` = ? and status=0', [data], callback);
    },
    delete_bucket: function (data, data2, callback) {
        //return digital.query('DELETE FROM td_bucket where access_customer_id=? AND B_id=?', [data, data2], callback);
        return db.query('UPDATE td_bucket set status=1 where access_customer_id=? AND B_id=?', [data, data2], callback);
    },
    get_bucket_file: function (data, data2, callback) {
        return db.query('SELECT * FROM `td_bucket_file` WHERE `bucket_id` = ? AND `access_customer_id` = ? and status=0 ORDER BY `F_id` DESC', [data, data2], callback);
    },
    delete_bucket_file: function (data, data2, data3, data4, callback) {
        return db.query('update  td_bucket_file set status=1 where file_name=? AND bucket_id=? AND file_type=? AND access_customer_id = ?', [data, data2, data3, data4], callback);
    },
    assign_chat_channels:function (data,pid, callback) {
        return db.query('UPDATE `td_channels` SET `assign_group` = ? WHERE `td_channels`.`channel_id` = ?', [data,pid], callback);
    },
    gethuntgroup: function (id, callback) {
        return db.query('SELECT * from HuntGroup where AccountID=' + id, [], callback);
    },
    assign_chat_channels:function (data,pid, callback) {
        return db.query('UPDATE `td_channels` SET `assign_group` = ? WHERE `td_channels`.`channel_id` = ?', [data,pid], callback);
    },
    update_user_message:function (data,pid, callback) {
        return db.query('UPDATE td_chat SET ? WHERE chat_id = ?', [data,pid], callback);
    },
    assign_message_user: function (agentid,chat_id, callback) {
        return db.query('UPDATE td_chat SET agent_id = ? WHERE chat_id=?', [agentid,chat_id], callback);
    },
    sync_ads_automation : function(id,callback){
        return db.query('Select *,(select COUNT(lid) FROM td_ads_leads WHERE ads_id=A.ads_id) as total_leads,(select COUNT(lid) FROM td_ads_leads WHERE DATE(created_time)=CURDATE() AND ads_id=A.ads_id) as today_leads,(select COUNT(lid) FROM td_ads_leads WHERE ads_id=A.ads_id AND DATE(created_time)=CURDATE() AND lms_status=1) as duplicate_leads from td_ads A  where A.access_customer_id= ? and A.is_automation="yes" and A.media_type IS NULL ORDER BY A.Ad_id DESC',[id],callback)
    },
    sync_ads_automation_google : function(id,callback){
        return db.query('Select *,(select COUNT(lid) FROM td_ads_leads WHERE ads_id=A.ads_id) as total_leads,(select COUNT(lid) FROM td_ads_leads WHERE DATE(created_time)=CURDATE() AND ads_id=A.ads_id) as today_leads,(select COUNT(lid) FROM td_ads_leads WHERE ads_id=A.ads_id AND DATE(created_time)=CURDATE() AND lms_status=1) as duplicate_leads from td_ads A  where A.access_customer_id= ? and A.is_automation="yes" and A.media_type="google" ORDER BY A.Ad_id DESC',[id],callback)
    },
    getchannelByUserIdAccessMedia: function (data, callback) {
        return db.query('select * from td_channels where username = ? and access_media = ?', [data.access_customer_id,data.access_media], callback);
    },
    get_adsbyid : function(id,id2,callback){
        return db.query('Select * from td_ads where Ad_id=? and access_customer_id = ?',[id,id2],callback)
    },
    check_channel_data: function (pageid,id,type, callback) {
        return db.query('Select * FROM td_channels where page_id=? and username=? and access_media=?', [pageid,id,type], callback);
    },
    checkadslead:function (id, callback) {
        return db.query('SELECT * FROM td_ads_leads WHERE leadgen_id = ?', [id], callback);
    },
    insertadslead:function (data, callback) {
        return db.query('INSERT INTO td_ads_leads SET ?', [data], callback);
    },
    updateadslead:function (data,id, callback) {
        return db.query('UPDATE td_ads_leads SET ? WHERE leadgen_id = ?', [data,id], callback);
    },
    Savewebhookurl: function (data, callback) { 
        return db.query('INSERT INTO td_webhook_key SET ?', [data], callback);
    },
    CampaignFindByAccessCustomerId:function (data, callback) { 
        return db.query('Select * FROM  td_campaigns where access_customer_id', [data.access_customer_id], callback);
    },
    CampaignUpdateMany:function (campaign_id,data, callback) {
        return db.query('UPDATE td_campaigns SET ? WHERE campaign_id = ?', [data,campaign_id], callback);
    },
    getchannelByUserIdAccessMediaPageId: function (data, callback) {
        return db.query('select * from td_channels where username = ? and access_media = ? and page_id=?', [data.user_id,data.access_media,data.page_id], callback);
    },
    check_ads_insights : function(id,id2,callback){
        return db.query('Select * from td_ads_insights where ads_id=? AND access_customer_id = ?',[id,id2],callback)
    },
    create_insights: function (data, callback) {
        return db.query('INSERT INTO td_ads_insights SET ?', [data], callback);
    },
    update_insights: function (data,id, callback) {
        return db.query('update td_ads_insights set ? where i_id=?', [data,id], callback);
    },
    getchannelByUserId: function (user,media, callback) {
        return db.query('select * from td_channels where username = ?  AND access_media = ?', [user,media], callback);
    },
    check_ads : function(id,id2,callback){
        return db.query('Select * from td_ads where ads_id=? and access_customer_id = ?',[id,id2],callback)
    },
    update_ads: function (data,id,id2, callback) {
        return db.query('update td_ads set ? where ads_id= ? and access_customer_id = ?', [data,id,id2], callback);
    },
    save_ads: function (data, callback) { 
        return db.query('INSERT INTO td_ads SET ?', [data], callback);
    },
    check_ads_id : function(id,id2,callback){
        console.log("dataids",id,"sds",id2);
        return db.query('SELECT * FROM `td_ads` WHERE `access_customer_id` = ? AND `leadgen_form_page` = ? AND `ads_status` ="ACTIVE" ORDER BY `Ad_id` DESC',[id,id2],callback)
    },
    getuserdetailbyname: function (id, callback) {
        return db.query('SELECT * from tf_account_table where account_name= ?', [id], callback);
    },
    getSegment: function (id, callback) { 
        return db.query('Select cont_id,name from tf_segments where customer_id=? order by created_date desc',[id], callback);
    },
    getAdsFindByUserIdAndAdsId: function (data, callback) { 
        return db.query('SELECT * FROM `td_ads` WHERE access_customer_id=? and ads_id=?',[data.access_customer_id,data.ads_id], callback);
    },
    adsUpdateUserIdAndAdsId: function (data,data1,callback) { 
        return db.query('update td_ads set ? where access_customer_id=? and ads_id= ? ', [data1,data.access_customer_id,data.ads_id], callback);
    },
    adsCreate:function (data, callback) { 
        return db.query('insert into td_ads set ? ', [data], callback);
    },
    check_ads_insights_cron: function(id,callback){
        return db.query('SELECT A.*,C.username,C.page_id,C.channel_id,C.accessToken FROM td_ads A LEFT JOIN td_channels C ON A.leadgen_form_page = C.page_id AND A.access_customer_id = C.username WHERE A.is_automation="yes" and A.media_type IS NULL and (last_sync_insights is null OR last_sync_insights < ? ) ORDER BY Ad_id DESC',[id],callback)
    },
    update_insights_status: function (data,id, callback) {
        return db.query('update td_ads set ? where Ad_id=?', [data,id], callback);
    },
    check_ads_by_id : function(id,callback){
        return db.query('Select * from td_ads where ads_id=?',[id],callback)
    },
    updateadsleadbyid:function (data,id, callback) {
        return db.query('UPDATE td_ads_leads SET ? WHERE lid = ?', [data,id], callback);
    },
    get_fb_thirdparty_data : function(id,callback){
        return db.query('SELECT F.*,A.account_name from td_fb_lead_thirdparty F INNER JOIN tf_account_table A ON A.account_id=F.accountid where F.accountid=?',[id],callback)
    },
    list_ads_lead: function (data,data2, callback) {
        return db.query('SELECT * FROM `td_ads_insights` WHERE ads_id = ? AND access_customer_id = ? ORDER BY `td_ads_insights`.`create_time` DESC , td_ads_insights.i_id ASC', [data,data2], callback);
    },
    list_ads_lead_sum: function (data, callback) {
        return db.query('SELECT SUM(lead_diffrents) AS sum FROM `td_ads_insights` WHERE `ads_id` = ? ORDER BY i_id DESC', [data], callback);
    },
    getbrand: function (brand_id, callback) {
        return db.query('select * from td_brand where brand_id = ?', [brand_id], callback);
    },
    insertschedulepost: function (data, callback) {
        return db.query('INSERT INTO td_schedule_post SET ?', [data], callback);
    },
    insertschedulepostchannel: function (data, callback) {
        return db.query('INSERT INTO td_schedule_post_channel SET ?', [data], callback);
    },
    insertschedulepostfile:function(data,callback){
        return db.query('INSERT INTO td_schedule_post_file SET ?', [data], callback);
    },
    insertschedulepost_update: function (data, id, callback) {
        return db.query('UPDATE `td_schedule_post` SET ? WHERE `td_schedule_post`.`sid` = ?', [data, id], callback);
    },
    deleteschedulepostchannel: function (sid, callback) {
        return db.query('Delete FROM td_schedule_post_channel where post_id=?', [sid], callback);
    },
    deleteschedulepostfile:function(id,callback){
        return db.query('delete from td_schedule_post_file where schedule_post_id=?', [id],callback);
    },
    getSchedulePostfile: function (user,s_id, callback) {
        return db.query('SELECT sp.*,bf.file_name,bf.file_type,bf.file_preview,bf.F_id FROM `td_schedule_post` as sp LEFT JOIN td_schedule_post_file as spf on spf.schedule_post_id=sp.sid LEFT JOIN td_bucket_file as bf on bf.F_id=spf.bucket_file_id where sp.user_id = "' + user + '" and sp.sid="' + s_id + '" and sp.status in (0,1) ', [user,s_id], callback);
    },
    getschedulepost: function (user, brand, callback) {
        return db.query('SELECT sp.*,bf.file_name,bf.file_type,bf.file_preview FROM `td_schedule_post` as sp LEFT JOIN td_schedule_post_file as spf on spf.schedule_post_id=sp.sid LEFT JOIN td_bucket_file as bf on bf.F_id=spf.bucket_file_id where sp.user_id = "' + user + '" and sp.brand_id="' + brand + '" and sp.status in (0,1) GROUP by sp.sid order by sp.sid DESC', [user, brand], callback);
    },
    deleteschedulepost: function (sid, callback) {
        return db.query('Delete FROM td_schedule_post where sid=?', [sid], callback);
    },
    getTwitPageFeed: function (id, callback) {
        return db.query('Select p.message,p.full_picture,p.post_id,IF(p.created_time="0000-00-00 00:00:00", "",p.created_time) as created_time,p.post_id as id,p.application,p.likes,p.channel_type,c.channel_name from td_publish_posts as p LEFT join td_channels as c on c.channel_id=p.channel_id where p.channel_id= ? AND p.channel_type= "twitter" order by p.created_time desc', [id], callback);
    },
    getLinkedinPageFeed: function (id, callback) {
        return db.query('Select message,full_picture,post_id,IF(created_time="0000-00-00 00:00:00", "", created_time) as created_time,post_id as id,application,likes,channel_type,activity from td_publish_posts where channel_id= ? AND channel_type  = "linkedin" order by created_time desc', [id], callback);
    },
    getchannelbyid: function (id, callback) {
        return db.query('select * from td_channels where channel_id = ?  ORDER BY `td_channels`.`channel_id` ASC', [id], callback);
    },
    getInstaPageFeed: function (id, callback) {  
        return db.query('Select message,full_picture,post_id,IF(created_time="0000-00-00 00:00:00", "", created_time) as created_time,post_id as id,application,likes from td_publish_posts where channel_id= ? AND channel_type  = "instagram" order by created_time desc', [id], callback);
    },
    getFbPageFeed: function (id, callback) {
        return db.query('Select message,full_picture,post_id,IF(created_time="0000-00-00 00:00:00", "", created_time) as created_time,post_id as id,application,likes,channel_type from td_publish_posts where channel_id= ? AND channel_type  = "facebook" order by created_time desc', [id], callback);
    },
    insertpublishpost: function (data, callback) {
        return db.query('INSERT INTO td_publish_posts SET ?', [data], callback);
    },
    updatepublishpost: function (data, pid, callback) {
        return db.query('UPDATE td_publish_posts SET ? WHERE post_id = ?', [data, pid], callback);
    },
    getchannelbymedia: function (pageid,access_media, callback) {
        return db.query('select * from td_channels where access_media = ? and page_id=?', [access_media,pageid], callback);
    },
    checkpost: function (id, callback) {
        return db.query('Select * from td_publish_posts where post_id=?', [id], callback);
    },
    insertpublishpostshare:function (data, callback) {
        return db.query('INSERT INTO td_publish_posts_share SET ?', [data], callback);
    },
    insertpublishpostcomment:function (data, callback) {
        return db.query('INSERT INTO td_publish_posts_comment SET ?', [data], callback);
    },
    get_linkedin_post: function (data,user_id,callback) {
        return db.query('SELECT * FROM `td_channels` WHERE `access_media` = "linkedin" and username=? ORDER BY `channel_id` DESC LIMIT 1', [user_id], callback);
    },
    get_twitter_post: function (data,user_id, callback) {
        return db.query('SELECT * FROM `td_channels` WHERE `access_media` = "twitter" and username=?  ORDER BY `channel_id` DESC LIMIT 1', [user_id], callback);
    },
    get_fb_post: function (data,user_id,callback) {
        return db.query('SELECT * FROM `td_channels` WHERE `access_media` = "facebook" AND username=?  ORDER BY `channel_id` DESC LIMIT 1', [user_id], callback);
    },
    get_insta_post: function (data,user_id,callback) {
        return db.query('SELECT * FROM `td_channels` WHERE `access_media` = "instagram" AND  username=? ORDER BY `channel_id` DESC LIMIT 1', [user_id], callback);
    },
    updateChatMessageReadTime:function (data,read_time, callback) {
        return db.query('SELECT chat_id FROM `td_chat` WHERE sender_id=?',[data.sender.id],function (err, results) {
            //console.log(results);
                 if (err) {
                     console.log("[mysql error]", err);
                 } else {
                  
                     console.log('updateChatMessageReadTime',results);
                     if (results.length>0) {
                        return db.query('SELECT detail_id from td_chat_details WHERE chat_id=? and message_read_time IS NULL',[results[0].chat_id],function (err, results) {
                            if (err) {
                                console.log("[mysql error]", err);
                            } else {
                                if (results.length>0) {
                                    results.forEach(function (entry) {
                                       db.query('update td_chat_details set message_read_time=? where detail_id=?',[read_time,entry.detail_id],function (err, results) {
                                        })
                                    })
                                }
                            }
                        })
                     }
                     callback(err, results);
                 }
        });
        //console.log('query_read_message','update td_chat_details set message_read_time=? where detail_id in(SELECT detail_id from td_chat_details WHERE chat_id=(SELECT chat_id FROM `td_chat` WHERE sender_id=?) and message_read_time IS NULL)', [read_time,data.sender.id])
        //return db.query('update td_chat_details set message_read_time=? where detail_id in(SELECT detail_id from td_chat_details WHERE chat_id=(SELECT chat_id FROM `td_chat` WHERE sender_id=?) and message_read_time IS NULL))', [read_time,data.sender.id], callback);
    },
    insertpublishpostreaction:function (data, callback) {
        return db.query('INSERT INTO td_publish_posts_reaction SET ?', [data], callback);
    },
    getMediaById: function (id,callback) {
        return db.query('SELECT * FROM `td_bucket_file` WHERE `F_id` = ?', [id], callback);
    },
    savebulkschedulepost: function (data,userid) {
        return new Promise(function (resolve, reject) {
            db.query('Insert INTO td_schedule_post SET ?', [data], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve(err);
                } else {
                    cdata = {post_id:results['insertId'],channel_id:JSON.parse(data.channel_arr)[0]}
                    db.query('Insert INTO td_schedule_post_channel SET ?', [cdata]);
                    console.log('savebulkschedulepost',results['insertId']);
                    resolve(results['insertId']);
                }
            })
        })
    },
    moveToarchive:function (id,callback) {
        return db.query('SELECT live_status FROM td_chat  where chat_id=?', [id], function (err, results) {
            if(results.length>0){
                var chatdata = results[0]
                console.log('status',chatdata.live_status)
                var newstatus = chatdata.live_status==1?0:1
                console.log('newstatus',newstatus)
                return db.query('update td_chat set live_status=? WHERE chat_id = ?', [newstatus,id], callback);
            }else{
                callback(results)
            }
        })
    },
    deletepost:function (id,callback) {
        db.query('SELECT * FROM td_publish_posts  where post_id=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
                callback(err)
            } else {
                if(results.length>0){
                    var postdata = results[0]
                    db.query('DELETE FROM  td_publish_posts  where post_id=?', [id], function (err, results) {
                        if (err) {
                            console.log("[mysql error]", err);
                            callback(results)
                        } else {
                            db.query('DELETE FROM td_publish_posts_comment where post_id=?', [postdata.p_id], function (err, results) {
                                if (err) {
                                    console.log("[mysql error]", err);
                                } else {
                                    db.query('DELETE FROM  td_publish_posts_share where post_id=?', [postdata.p_id], function (err, results) {
                                        if (err) {
                                            console.log("[mysql error]", err);
                                        } else {
                                            callback(results)
                                        }
                                    })
                                }
                            })
                        }
                    })
                }else{
                    callback(results)
                }
            }
        });
    },
    delete_fb_data:function(data,callback){
        return db.query("DELETE FROM `td_ads` WHERE `Ad_id`="+data.id,callback)
    }

} 


module.exports = Digital;