var db = require('../database/db');
var Erp = {

    addlead_db: function (data, callback) {
        return db.query('Insert INTO tf_leads set ? ', [data], callback);
    },
    get_lead_status_lead: function (id, role, callback) {
        if (role == 1) {
            return db.query('SELECT L.*,A.account_name as agentname FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE agent_id= ? and  status IN ("Lead","Do Not Contact") order by l_id DESC', [id], callback);
        } else {
            return db.query('SELECT L.*,A.account_name as agentname FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE User_id= ? and status IN ("Lead","Do Not Contact") order by l_id DESC', [id], callback);
        }
    },
    get_lead_status_notlead: function (id, role, callback) {
        if (role == 1) {
            return db.query('SELECT L.*,A.account_name as agentname FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE agent_id= ? and status IN ("Open","Replied","Interested") order by l_id DESC', [id], callback);
        } else {
            return db.query('SELECT L.*,A.account_name as agentname FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE User_id= ? and status IN ("Open","Replied","Interested") order by l_id DESC', [id], callback);
        }
    },
    updatelead: function (data, callback) {
        return db.query('update tf_leads set ? WHERE name = ?', [data, data.name], callback);
    },
    get_username: function (data, callback) {
        return db.query('SELECT * FROM tf_account_table WHERE account_id = ?', [data], callback);
    },
    addopp_db: function (data, callback) {
        return db.query('Insert INTO tf_opportunity set ? ', [data], callback);
    },
    updateopp: function (data, callback) {
        return db.query('update tf_opportunity set ? WHERE name = ?', [data, data.name], callback);
    },
    // getOpportunity_status_not_Quotation: function (data, callback) {
    //     return db.query('SELECT * FROM tf_opportunity WHERE User_id like ? and status!="Quotation" and is_sync="yes"', [data], callback);
    // },
    getOpportunity_status_not_Quotation: function (id, role, callback) {
        // return db.query('SELECT L.mobile_no,L.email_id, O.* FROM tf_quotation O INNER JOIN tf_leads L ON O.name=L.name WHERE O.User_id=? AND O.status IN ("Open","Replied") ORDER BY O.op_id ASC', [data], callback);
        // return db.query('SELECT L.mobile_no,L.email_id, O.* FROM tf_quotation O INNER JOIN tf_leads L ON O.name=L.name WHERE O.User_id=? AND O.status IN ("Open","Replied")', [data], callback);
        if (role == 1) {
            return db.query('SELECT L.*,A.account_name as agentname FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE agent_id= ? and status IN ("Quotation") order by l_id DESC', [id], callback);
        } else {
            return db.query('SELECT L.*,A.account_name as agentname FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE User_id= ? and status IN ("Quotation") order by l_id DESC', [id], callback);
        }

    },
    getleadetail: function (id, callback) {
        return db.query('SELECT * FROM tf_leads WHERE name="' + id + '"', [], callback);
    },
    getleadetailbyid: function (id, aid, callback) {
        return db.query('SELECT L.*,A.account_name as agentname,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + aid + ' AND CD.status_master = L.status) as newstatus FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE l_id=? and User_id = ? ', [id, aid], callback);
    },
    getleadetailbyid_role: function (id, aid, agentid, role, callback) {
        if (role == 1) { //console.log(aid);
            db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [agentid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    row = results[0]
                    if (row.show_no_id == 1) {
                        //console.log('id');
                        return db.query('SELECT L.*,C.cont_id AS mobileno,A.whatsup_access,A.show_no_id,A.account_name as agentname,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + aid + ' AND CD.status_master = L.status) as newstatus FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id LEFT JOIN tf_contacts C ON C.lead_id=L.l_id WHERE L.l_id=? and L.User_id = ? ', [id, aid], callback);
                    } else {
                        // console.log('no');
                        return db.query('SELECT L.*,L.mobile_no AS mobileno,A.whatsup_access,A.show_no_id,A.account_name as agentname,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + aid + ' AND CD.status_master = L.status) as newstatus FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE l_id=? and User_id = ? ', [id, aid], callback);
                    }
                }
            })
        } else {
            //console.log('SELECT L.*,A.account_name as agentname,A.whatsup_access,A.show_no_id,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + aid + ' AND CD.status_master = L.status) as newstatus FROM tf_leads L LEFT JOIN tf_account_table A ON L.User_id=A.account_id WHERE l_id='+id+' and User_id ='+aid);
            return db.query('SELECT L.*,L.mobile_no AS mobileno,A.account_name as agentname,A.whatsup_access,A.show_no_id,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + aid + ' AND CD.status_master = L.status) as newstatus FROM tf_leads L LEFT JOIN tf_account_table A ON L.User_id=A.account_id WHERE l_id=? and User_id = ? ', [id, aid], callback);
        }

    },

    // getOpportunity_status_Quotation: function (data, callback) {
    //     return db.query('SELECT * FROM tf_opportunity WHERE User_id like ? and status="Quotation" and is_sync="yes"', [data], callback);
    // },
    getOpportunity_status_Quotation: function (id, role, callback) {
        // return db.query('SELECT * FROM `tf_quotation` WHERE User_id = 42 AND status="Ordered"', [data], callback);
        if (role == 1) {
            return db.query('SELECT L.*,A.account_name as agentname FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE agent_id= ? and status IN ("Opportunity") order by l_id DESC', [id], callback);
        } else {
            return db.query('SELECT L.*,A.account_name as agentname FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE User_id= ? and status IN ("Opportunity") order by l_id DESC', [id], callback);
        }

    },
    addcustomer_db: function (data, callback) {
        return db.query('Insert INTO tf_erp_customer set ? ', [data], callback);
    },
    // get_Customer_list_api: function (data, callback) {
    //     return db.query('SELECT * FROM tf_erp_customer WHERE User_id like ? ', [data], callback);
    // },
    get_Customer_list_api: function (data, callback) {
        return db.query('SELECT L.mobile_no AS mobile,L.email_id AS email, O.* FROM tf_erp_customer O INNER JOIN tf_leads L ON O.lead_name=L.name WHERE O.User_id=? ORDER BY O.c_id ASC', [data], callback);
    },
    get_Agent_list_api: function (data, callback) {
        return db.query('SELECT * FROM `tf_account_table` WHERE `account_type` = 1 AND current_status !="1" AND `created_by` =? ', [data], callback);
    },
    assign_lead: function (data, callback) {
        return db.query('update tf_leads set ? WHERE name = ? AND User_id = ?', [data, data.name, data.User_id], callback);
    },
    get_lead_status_won: function (id, role, callback) {
        if (role == 1) {
            return db.query('SELECT L.*,A.account_name as agentname FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE agent_id= ? and status IN ("Converted") order by l_id DESC', [id], callback);
        } else {
            return db.query('SELECT L.*,A.account_name as agentname FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE User_id= ? and status IN ("Converted") order by l_id DESC', [id], callback);
        }
        // return db.query('SELECT L.*,A.account_name as agentname FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE User_id= ? and status IN ("Converted") order by l_id DESC', [data], callback);
    },
    get_lead_status_lost: function (id, callback) {
        // if (role == 1) {
        //     // return db.query('SELECT L.*,A.account_name as agentname FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE agent_id= ? and status IN ("Not Interested","Junk Lead","Lost Quotation") order by l_id DESC', [id], callback);
        // } else {
        //     return db.query('SELECT L.*,A.account_name as agentname FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE User_id= ? and status IN ("Not Interested","Junk Lead","Lost Quotation") order by l_id DESC', [id], callback);
        // }
        return db.query('SELECT L.*,A.account_name as agentname FROM tf_leads L LEFT JOIN tf_account_table A ON L.agent_id=A.account_id WHERE User_id= ? and status IN ("Not Interested","Junk Lead","Lost Quotation") order by l_id DESC', [id], callback);
    },
    get_lead_timeline: function (lid, callback) {
        return db.query('SELECT CD.* FROM tf_contacts C INNER JOIN tf_cdr CD ON C.cont_id=CD.cont_id WHERE C.lead_id = ? ORDER BY CD.id DESC', [lid], callback);
    },
    addquotation_db: function (data, callback) {
        return db.query('Insert INTO tf_quotation set ? ', [data], callback);
    },
    getquotation_db: function (data, callback) {
        // console.log('SELECT * FROM `tf_quotation` WHERE User_id='+data.User_id+' AND party_name="'+data.party_name+'"');
        return db.query('SELECT * FROM `tf_quotation` WHERE User_id=' + data.User_id + ' AND party_name="' + data.party_name + '"', [data.User_id, data.party_name], callback);
    },
    addleadsemail_db: function (data, callback) {
        return db.query('Insert INTO tf_leads_email set ? ', [data], callback);
    },
    add_lead_comment: function (data, callback) {
        return db.query('Insert INTO tf_lead_comment set ? ', [data], callback);
    },
    get_lead_comments: function (data, callback) {
        return db.query('SELECT L.*,A.account_name AS comment_by_user FROM tf_lead_comment L LEFT JOIN tf_account_table A ON L.comment_by=A.account_id WHERE lead_id = ? order by c_date DESC', [data], callback);
    },
    get_lead_list_api: async function (data, callback) {
        if (data.role == 1) {
            return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [data.userid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    row = results[0]
                    var where = " where l.agent_id=" + data.userid + " and is_sync = 'yes'";
                    if (data.leadArr.length > 0) {
                        where += " and l.l_id IN (" + data.leadArr + ")";
                    }
                    if (data.startdate != '1970-01-01') {
                        where += " and DATE(l.creation)>='" + data.startdate + "'";
                    }

                    if (data.enddate != '1970-01-01') {
                        where += " and DATE(l.creation)<='" + data.enddate + "'";
                    }

                    if (data.modifiedstartdate != '1970-01-01') {
                        where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
                    }

                    if (data.modifiedenddate != '1970-01-01') {
                        where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
                    }


                    if (data.status != '' && data.status != null) {
                        where += " and l.status IN (" + data.status + ")";
                    }

                    if (data.lead_name != '' && data.lead_name != null) {
                        where += " and l.lead_name like '%" + data.lead_name + "%'";
                    }

                    if (data.source != '' && data.source != null) {
                        where += " and l.source IN (" + data.source + ")";
                    }

                    if (data.ads_name != '' && data.ads_name != null) {
                        where += " and l.ads_name IN (" + data.ads_name + ")";
                    }
                    if (data.mobileno != '' && data.mobileno != null) {
                        where += " and l.mobile_no ='" + data.mobileno + "'";
                    }
                    if (data.tag_id) {
                        where += " and l.tag_id IN (" + data.tag_id + ")";
                    }
                    var account_id = data.account_id
                    if (row.show_no_id == 1) {
                        return db.query('SELECT l.*,a.show_no_id,C.cont_id as mobileno,a.whatsup_access,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where + ' ORDER BY l.creation DESC ', callback);
                    } else {
                        return db.query('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,a.whatsup_access,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.creation DESC ', callback);
                    }
                }
            })

        } else {
            var where = " where l.User_id=" + data.userid + " and is_sync = 'yes'";
            if (data.leadArr.length > 0) {
                where += " and l.l_id IN (" + data.leadArr + ")";
            }
            if (data.agent.length > 0) {
                where += " and l.agent_id IN (" + data.agent + ")";
            }

            if (data.startdate != '1970-01-01') {
                where += " and DATE(l.creation)>='" + data.startdate + "'";
            }

            if (data.enddate != '1970-01-01') {
                where += " and DATE(l.creation)<='" + data.enddate + "'";
            }

            if (data.modifiedstartdate != '1970-01-01') {
                where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
            }

            if (data.modifiedenddate != '1970-01-01') {
                where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
            }

            if (data.status != '' && data.status != null) {
                where += " and l.status IN (" + data.status + ")";
            }

            if (data.lead_name != '' && data.lead_name != null) {
                where += " and l.lead_name like '%" + data.lead_name + "%'";
            }

            if (data.source != '' && data.source != null) {
                where += " and l.source IN (" + data.source + ")";
            }

            if (data.ads_name != '' && data.ads_name != null) {
                where += " and l.ads_name IN (" + data.ads_name + ")";
            }
            if (data.mobileno != '' && data.mobileno != null) {
                where += " and l.mobile_no ='" + data.mobileno + "'";
            }
            if (data.tag_id) {
                where += " and l.tag_id IN (" + data.tag_id + ")";
            }
            return db.query('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + data.userid + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.creation DESC ', callback);
        }
    },
    count_lead: function (data, callback) {
        var where = "WHERE  DATE(creation) ='" + data.startdate + "' AND User_id=" + data.userid;
        return db.query('SELECT COUNT(lead_name) AS total FROM tf_leads ' + where + '', callback);
    }, count_Junk_lead: function (data, callback) {
        var where = "WHERE  DATE(creation) ='" + data.startdate + "' AND User_id='" + data.userid + "' AND status IN ('Not Interested','Junk Lead','Lost Quotation')";
        return db.query('SELECT COUNT(lead_name) AS total FROM tf_leads ' + where + '', callback);
    },
    count_lead_date: function (data, callback) {
        var where = "WHERE  DATE(creation) >='" + data.startdate + "' AND DATE(creation) <='" + data.enddate + "' AND User_id=" + data.userid;
        return db.query('SELECT COUNT(lead_name) AS total FROM tf_leads ' + where + '', callback);
    }, count_Junk_lead_date: function (data, callback) {
        var where = "WHERE  DATE(creation) >='" + data.startdate + "' AND DATE(creation) <='" + data.enddate + "' AND User_id='" + data.userid + "' AND status IN ('Not Interested','Junk Lead','Lost Quotation')";
        return db.query('SELECT COUNT(lead_name) AS total FROM tf_leads ' + where + '', callback);
    },
    count_Junk_need_analysis: function (data, callback) {
        var where = "WHERE  DATE(creation) ='" + data.startdate + "' AND User_id='" + data.userid + "' AND status IN ('Open','Replied','interested')";
        return db.query('SELECT COUNT(lead_name) AS total FROM tf_leads ' + where + '', callback);
    },
    count_Junk_need_analysis_date: function (data, callback) {
        var where = "WHERE  DATE(creation) >='" + data.startdate + "' AND DATE(creation) <='" + data.enddate + "' AND User_id='" + data.userid + "' AND status IN ('Open','Replied','interested')";
        return db.query('SELECT COUNT(lead_name) AS total FROM tf_leads ' + where + '', callback);
    },
    count_proposal: function (data, callback) {
        var where = "WHERE  DATE(creation) ='" + data.startdate + "' AND User_id='" + data.userid + "' AND status IN ('Quotation')";
        return db.query('SELECT COUNT(lead_name) AS total FROM tf_leads ' + where + '', callback);
    },
    count_proposal_date: function (data, callback) {
        var where = "WHERE  DATE(creation) >='" + data.startdate + "' AND DATE(creation) <='" + data.enddate + "' AND User_id='" + data.userid + "' AND status IN ('Quotation')";
        return db.query('SELECT COUNT(lead_name) AS total FROM tf_leads ' + where + '', callback);
    },
    count_negotiation: function (data, callback) {
        var where = "WHERE  DATE(creation) ='" + data.startdate + "' AND User_id='" + data.userid + "' AND status IN ('Opportunity')";
        return db.query('SELECT COUNT(lead_name) AS total FROM tf_leads ' + where + '', callback);
    },
    count_negotiation_date: function (data, callback) {
        var where = "WHERE  DATE(creation) >='" + data.startdate + "' AND DATE(creation) <='" + data.enddate + "' AND User_id='" + data.userid + "' AND status IN ('Opportunity')";
        return db.query('SELECT COUNT(lead_name) AS total FROM tf_leads ' + where + '', callback);
    },
    count_won: function (data, callback) {
        var where = "WHERE  DATE(creation) ='" + data.startdate + "' AND User_id='" + data.userid + "' AND status IN ('Converted')";
        return db.query('SELECT COUNT(lead_name) AS total FROM tf_leads ' + where + '', callback);
    },
    count_won_date: function (data, callback) {
        var where = "WHERE  DATE(creation) >='" + data.startdate + "' AND DATE(creation) <='" + data.enddate + "' AND User_id='" + data.userid + "' AND status IN ('Converted')";
        return db.query('SELECT COUNT(lead_name) AS total FROM tf_leads ' + where + '', callback);
    },
    getagents: function (id, callback) {
        // return db.query('SELECT distinct(l.agent_id) as agent_id,a.account_name from tf_leads l LEFT JOIN tf_account_table a ON l.agent_id=a.account_id where a.created_by=' + id + " " + 'ORDER by create_date DESC', [], callback);
        return db.query('SELECT * from tf_account_table where current_status = 0 and is_deleted = "no" and created_by=' + id + " " + 'ORDER by account_name ASC', [], callback);
    },
    getstatus: function (id, callback) {
        return db.query('SELECT distinct(status) as status from tf_leads where status != "" and status IS NOT NULL AND User_id=' + id + " " + 'ORDER by status ASC', [], callback);
    },
    getsource: function (id, callback) {
        return db.query('SELECT distinct(source) as source from tf_leads where source != "" and source IS NOT NULL AND User_id=' + id + " " + 'ORDER by status ASC', [], callback);
    },
    getitem: function (data, callback) {
        return db.query('SELECT * FROM `tf_products` WHERE `account_id`=?', [data], callback);
    },
    getactiveproduct: function (data, callback) {
        return db.query('SELECT * FROM `tf_products` WHERE `account_id`=? and product_status=1', [data], callback);
    },
    getitem_check: function (data, callback) {
        return db.query('SELECT * FROM tf_products WHERE item_price_id = ?', [data], callback);
    },
    check_old_leak: function (data, callback) {
        return db.query('SELECT * FROM `tf_cdr` WHERE `feedback` IS NOT NULL ORDER BY `tf_cdr`.`feedback` DESC', [data], callback);
    },
    check_id: function (data, callback) {
        return db.query('SELECT * FROM `tf_account_table` WHERE `account_id` = ? AND `current_status` = 0', [data], callback);
    },
    addwhatsapp_db: function (data, callback) {
        return db.query('Insert INTO tf_erp_whatsapp set ? ', [data], callback);
    },
    get_lead_timeline_whatsapp: function (lid, callback) {
        return db.query('SELECT C.*,CD.account_name as agentname FROM tf_erp_whatsapp C RIGHT JOIN tf_account_table CD ON C.account_id=CD.account_id WHERE C.lead_id =?', [lid], callback);
    },
    get_lead_timeline_email: function (lid, callback) {
        return db.query('SELECT C.*,CD.account_name as agentname FROM tf_leads_email C RIGHT JOIN tf_account_table CD ON C.User_id=CD.account_id WHERE C.lead_name =? ORDER by C.create_time DESC', [lid], callback);
    },
    get_lead_timeline_appointment: function (lid, callback) {
        return db.query('SELECT s.* FROM tf_scheduler s LEFT JOIN tf_leads l ON s.customer_id=l.name WHERE l.l_id=? ORDER BY s.StartTime DESC', [lid], callback);
    },
    addissue: function (data, callback) {
        return db.query('Insert INTO tf_tickets set ? ', [data], callback);
    },
    get_lead_list_api_excel: function (data, callback) {
        // console.log(JSON.stringify(data));
        // if (data.role == 1) {
        //     return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [data.userid], function (err, results) {
        //         if (err) {
        //             console.log("[mysql error]", err);
        //         } else {
        //             row = results[0]
        //             var where = " where l.agent_id=" + data.userid + " and is_sync = 'yes' and l.is_deleted='no'";

        //             if (data.startdate != '1970-01-01') {
        //                 where += " and DATE(l.creation)>='" + data.startdate + "'";
        //             }

        //             if (data.enddate != '1970-01-01') {
        //                 where += " and DATE(l.creation)<='" + data.enddate + "'";
        //             }
        //             if (data.modifiedstartdate) {
        //                 where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
        //             }

        //             if (data.modifiedenddate) {
        //                 where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
        //             }


        //             if (data.status != '' && data.status != null) {
        //                 where += " and l.status ='" + data.status + "'";
        //             }

        //             if (data.lead_name != '' && data.lead_name != null) {
        //                 where += " and l.lead_name like '%" + data.lead_name + "%'";
        //             }

        //             if (data.source != '' && data.source != null) {
        //                 where += " and l.source ='" + data.source + "'";
        //             }

        //             if (data.mobileno != '' && data.mobileno != null) {
        //                 where += " and l.mobile_no ='" + data.mobileno + "'";
        //             }
        //             var account_id = data.account_id
        //             if (row.show_no_id == 1) {
        //                 return db.query('SELECT l.*,a.show_no_id,C.cont_id as mobile_no,a.whatsup_access,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where + ' ORDER BY l.creation DESC ', callback);
        //             } else {
        //                 return db.query('SELECT l.*,a.show_no_id,a.account_name as agent,a.whatsup_access,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.creation DESC ', callback);
        //             }
        //         }
        //     })
        // } else {
        //     var where = " where l.User_id=" + data.userid + " and is_sync = 'yes' and l.is_deleted='no'";
        //     //console.log(data);
        //     if (data.agent > 0) {
        //         where += " and l.agent_id =" + data.agent;
        //     }

        //     if (data.startdate != '1970-01-01') {
        //         where += " and DATE(l.creation)>='" + data.startdate + "'";
        //     }

        //     if (data.enddate != '1970-01-01') {
        //         where += " and DATE(l.creation)<='" + data.enddate + "'";
        //     }

        //     if (data.modifiedstartdate) {
        //         where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
        //     }

        //     if (data.modifiedenddate) {
        //         where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
        //     }

        //     if (data.status != '' && data.status != null) {
        //         where += " and l.status ='" + data.status + "'";
        //     }

        //     if (data.lead_name != '' && data.lead_name != null) {
        //         where += " and l.lead_name like '%" + data.lead_name + "%'";
        //     }

        //     if (data.source != '' && data.source != null) {
        //         where += " and l.source ='" + data.source + "'";
        //     }

        //     if (data.mobileno != '' && data.mobileno != null) {
        //         where += " and l.mobile_no ='" + data.mobileno + "'";
        //     }
        //     //console.log('SELECT l.*,a.show_no_id,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + data.userid + ' AND CD.status_master = l.status) as newstatus,(SELECT comment FROM tf_lead_comment WHERE lead_id=l_id order by comment_id desc limit 1) as note FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.creation DESC ');
        //     return db.query('SELECT l.*,a.show_no_id,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + data.userid + ' AND CD.status_master = l.status) as newstatus,(SELECT comment FROM tf_lead_comment WHERE lead_id=l_id order by comment_id desc limit 1) as note FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.creation DESC ', [], callback);
        // }
        if (data.role == 1) {
            return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [data.userid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    row = results[0]
                    console.log("data",data)
                    var where = " where l.agent_id=" + data.userid + "  and l.is_sync = 'yes' and l.is_deleted = 'no'";

                    if (data.startdate != '1970-01-01') {
                        where += " and DATE(l.creation)>='" + data.startdate + "'";
                    }

                    if (data.enddate != '1970-01-01' ) {
                        where += " and DATE(l.creation)<='" + data.enddate + "'";
                    }

                    if (data.modifiedstartdate != '1970-01-01') {
                        where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
                    }

                    if (data.modifiedenddate != '1970-01-01') {
                        where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
                    }


                    if (data.status != '' && data.status != null) {
                        where += " and l.status IN (" + data.status + ")";
                    }

                    if (data.lead_name != '' && data.lead_name != null) {
                        where += " and l.lead_name like '%" + data.lead_name + "%'";
                    }
                    if (data.ads_name != '' && data.ads_name != null) {
                        where += " and l.ads_name IN (" + data.ads_name + ")";
                    }
                    if (data.source != '' && data.source != null) {
                        where += " and l.source IN (" + data.source + ")";
                    }

                    if (data.mobileno != '' && data.mobileno != null) {
                        where += " and l.mobile_no ='" + data.mobileno + "'";
                    }

                    if (data.tag_id != '') {
                        where += " and l.tag_id IN (" + data.tag_id + ")";
                    }
                    var account_id = data.account_id
                    if (row.show_no_id == 1) {
                        return db.query('SELECT l.*,a.show_no_id,C.cont_id as mobileno,a.whatsup_access,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where, callback);
                    } else {
                        console.log('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,a.whatsup_access,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where )
                        return db.query('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,a.whatsup_access,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where , callback);
                    }
                }
            })

        } else {
            var where = " where l.User_id=" + data.userid + "  and l.is_sync = 'yes' and l.is_deleted = 'no'";

            if (data.agent != '') {
                where += " and l.agent_id IN (" + data.agent + ")";
            }

            if (data.startdate != '1970-01-01' ) {
                where += " and DATE(l.creation)>='" + data.startdate + "'";
            }

            if (data.enddate != '1970-01-01' ) {
                where += " and DATE(l.creation)<='" + data.enddate + "'";
            }

            if (data.modifiedstartdate != '1970-01-01') {
                where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
            }

            if (data.modifiedenddate != '1970-01-01') {
                where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
            }

            if (data.status != '' && data.status != null) {
                where += " and l.status IN (" + data.status + ")";
            }

            if (data.lead_name != '' && data.lead_name != null) {
                where += " and l.lead_name like '%" + data.lead_name + "%'";
            }
            if (data.ads_name != '' && data.ads_name != null) {
                where += " and l.ads_name IN (" + data.ads_name + ")";
            }
            if (data.source != '' && data.source != null) {
                where += " and l.source IN (" + data.source + ")";
            }

            if (data.mobileno != '' && data.mobileno != null) {
                where += " and l.mobile_no ='" + data.mobileno + "'";
            }

            if (data.tag_id != '') {
                where += " and l.tag_id IN (" + data.tag_id + ")";
            }
            //console.log('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + data.userid + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '');
            return db.query('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + data.userid + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where , callback);
        }

    },
    getstages: function (id, callback) {

        return db.query("SELECT * FROM `tf_lead_stage` WHERE `User_id`= " + id, callback);
    },
    get_supervisor_Stages: function (id, callback) {

        return db.query("SELECT s_id,stage_name FROM tf_lead_stage WHERE User_id IN(SELECT userid FROM tf_supervisor_agents WHERE supervisor_account_id=" + id + ")", callback);
    },
    updatestages: function (cid, callback) {
        return db.query('Select * from tf_lead_stage where s_id=?', cid, callback);
    },
    saveleadstageData: function (data, callback) {
        return db.query('Insert INTO tf_lead_stage set ? ', [data], callback);

    },
    updatestageData: function (data, callback) {
        return db.query('update tf_lead_stage set ? WHERE s_id = ?', [data, data.s_id], callback);

    },
    deleteleadstages: function (id, callback) {
        return db.query('DELETE FROM tf_lead_stage where s_id=?', [id], callback);
    },
    getstagesstatus: function (id, callback) {
        return db.query("SELECT * FROM `tf_lead_stage_status` WHERE `stage_id`= " + id, callback);
    },
    savestagestatus: function (data, callback) {
        return db.query('Insert INTO tf_lead_stage_status set ? ', [data], callback);
    },
    getstagestatusbyid: function (id, callback) {
        return db.query("SELECT * FROM `tf_lead_stage_status` WHERE `St_id`= " + id, callback);

    },
    updatestagestatus: function (data, callback) {
        return db.query('update tf_lead_stage_status set ? WHERE St_id = ?', [data, data.St_id], callback);
    },
    deleteleadstagesstatus: function (id, callback) {
        return db.query('DELETE FROM tf_lead_stage_status where St_id=?', [id], callback);

    },
    getsmstemplate: function (id, callback) {
        return db.query("SELECT * FROM `tf_smstemplate` WHERE approve_status ='1' and `account_id` =" + id, callback);
    },
    getemailtemplate: function (id, role, callback) {
        if (role == 1) {
            return db.query("SELECT E.* FROM `tf_emailtemplate` E LEFT JOIN tf_account_table A ON E.account_id=A.created_by WHERE E.status =1 and A.account_id =" + id, callback);
        } else {
            return db.query("SELECT * FROM `tf_emailtemplate` WHERE `status` =1 and account_id =" + id, callback);
        }
    },
    get_master_status: function (id, callback) {
        return db.query('SELECT * FROM tf_lead_master_status', [], callback);
    },
    get_lead_stage_status: function (lid, callback) {
        return db.query('SELECT C.*,CD.stage_status as statusdb,CD.status_master as masterstatus FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ? ORDER BY statusdb ASC', [lid], callback);
    },
    stage_status: function (lid, callback) {
        //console.log('SELECT * FROM tf_lead_stage where User_id='+lid);
        return db.query('SELECT * FROM tf_lead_stage where User_id=?', [lid], callback);
    },
    stage_status_id: function (lid, callback) {
        return db.query('SELECT * FROM tf_lead_stage_status where stage_id=?', [lid], callback);
    },
    get_lead_stage_source: function (lid, callback) {
        return db.query('SELECT DISTINCT source FROM tf_leads WHERE User_id =? AND (source is NOT null AND source!="") ORDER BY source ASC', [lid], callback);
    },
    addfilerequest: function (request, callback) {
        if (request.user_id == '2656' || request.user_id == '42') {
            return db.query('Insert INTO tf_dholera_leads_upload_file SET ?', request, callback);
        } else {
            return db.query('Insert INTO tf_leads_upload_file SET ?', request, callback);
        }
    },
    AllFiledata: function (uid, callback) {
        return db.query('Select * from tf_leads_upload_file where file_status=? order by upload_date asc limit 1', [uid], callback);
    },
    updatefileStatus: function (Contacts, cont_id, callback) {
        return db.query('UPDATE `tf_leads_upload_file` SET ? WHERE `tf_leads_upload_file`.`F_id`="' + cont_id + '"', Contacts, callback);
    },
    BulkFiledatabycustomer: function (id, callback) {
        return db.query('Select * from tf_leads_upload_file where user_id=? ORDER BY `F_id` DESC', [id], callback);
    },
    check_lead_by_number: function (data, data2, agentid, callback) {
        return db.query('SELECT *,(SELECT show_no_id FROM tf_account_table where account_id=' + agentid + ') AS show_no_id FROM `tf_leads` WHERE `mobile_no`=? AND `User_id` = ? AND is_sync="yes"', [data, data2], callback);
    },
    get_unassign_master_status: function (id, callback) {
        return db.query('SELECT * FROM tf_lead_master_status WHERE status_name NOT IN (SELECT status_master FROM `tf_lead_stage_status` LS INNER JOIN tf_lead_stage L ON LS.stage_id=L.s_id WHERE L.User_id = ?)', [id], callback);
    },
    get_lead_contacts_meta: function (lid, aid, callback) {
        return db.query('SELECT meta_key,meta_value,meta_id FROM `tf_contacts_meta` WHERE cont_id IN (SELECT cont_id FROM `tf_contacts` WHERE `customer_id` = ? AND `lead_id` = ?)', [aid, lid], callback);
    },
    get_country: function (lid, callback) {
        return db.query('SELECT * FROM `tf_lead_country`', callback);
    },
    add: function (request, callback) {
        return db.query('Insert INTO tf_currency SET ?', request, callback);
    },
    get_currency: function (lid, callback) {
        return db.query('SELECT * FROM `tf_currency`', callback);
    },
    get_market_segment: function (lid, callback) {
        return db.query('SELECT * FROM `tf_market_segement`', callback);
    },
    updat_lead_name: function (data, data2, callback) {
        return db.query('update tf_leads set ? WHERE l_id = ?', [data, data2], callback);
    },
    check_lead_by_mobile: function (data, data2, callback) {
        return db.query('SELECT * FROM `tf_leads` WHERE `User_id` = ? AND `mobile_no` = ?', [data, data2], callback);
    },
    get_tf_quotation: function (data, data2, callback) {
        return db.query('SELECT * FROM `tf_quotation` M LEFT JOIN tf_leads L ON M.party_name = L.name WHERE M.User_id = ? AND M.name = ?', [data, data2], callback);
    },
    updat_lead_quotation_id: function (data, data2, callback) {
        return db.query('update tf_quotation set ? WHERE q_id = ?', [data, data2], callback);
    },
    get_lead_id_details: function (lid, callback) {
        return db.query('SELECT * FROM `tf_leads` WHERE `l_id` = ?', [lid], callback);
    },
    add_timeline_lead: function (request, callback) {
        return db.query('Insert INTO tf_lead_timeline SET ?', request, callback);
    },
    get_lead_timeline_status: function (lid, callback) {
        return db.query('SELECT * FROM `tf_lead_timeline` WHERE lead_id = ? and form_id IS NULL ORDER BY `t_id` DESC', [lid], callback);
    },
    get_lead_timeline_feedback: function (lid, callback) {
        return db.query('SELECT L.*,CDR.id AS cdrid FROM `tf_lead_timeline` L LEFT JOIN tf_contacts C ON C.lead_id=L.lead_id LEFT JOIN tf_cdr CDR ON CDR.cont_id=C.cont_id WHERE L.lead_id = ? and L.form_id IS NOT NULL ORDER BY CDR.CallStartTime DESC LIMIT 1', [lid], callback);
    },
    addsource_db: function (data, callback) {
        return db.query('Insert INTO tf_source_master set ? ', [data], callback);
    },
    deleteSource: function (s_id, callback) {
        return db.query('DELETE FROM `tf_source_master` WHERE `tf_source_master`.`s_id`=?', s_id, callback);
    },
    updateSource: function (Source, s_id, callback) {
        return db.query('UPDATE `tf_source_master` SET ? WHERE `tf_source_master`.`s_id`="' + s_id + '"', Source, callback);
    },
    get_source: function (lid, callback) {
        console.log('SELECT * FROM `tf_source_master` WHERE customer_id = '+lid+' ORDER BY `s_id` DESC');
        return db.query('SELECT * FROM `tf_source_master` WHERE customer_id = ? ORDER BY `s_id` DESC', [lid], callback);
    },
    get_lead_by_id: function (lid, callback) {
        return db.query('SELECT * FROM `tf_leads` WHERE `l_id` = ?', [lid], callback);
    },
    get_lead_with_contacts: async function (data, callback) {
        if (data.role == 1) {
            if (data.agentrole == 'supervisor') {
                var where = " where S.supervisor_account_id=" + data.userid + " and l.is_sync = 'yes' and l.is_deleted = 'no' ";
                if (data.leadArr.length > 0) {
                    where += " and l.l_id IN (" + data.leadArr + ")";
                }
                if (data.startdate != '1970-01-01') {
                    where += " and DATE(l.creation)>='" + data.startdate + "'";
                }

                if (data.enddate != '1970-01-01') {
                    where += " and DATE(l.creation)<='" + data.enddate + "'";
                }

                if (data.modifiedstartdate != '1970-01-01') {
                    where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
                }

                if (data.modifiedenddate != '1970-01-01') {
                    where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
                }

                if (data.status != '' && data.status != null) {
                    where += " and l.status IN (" + data.status + ")";
                }

                if (data.lead_name != '' && data.lead_name != null) {
                    where += " and l.lead_name like '%" + data.lead_name + "%'";
                }

                if (data.source != '' && data.source != null) {
                    where += " and l.source IN (" + data.source + ")";
                }

                if (data.ads_name != '' && data.ads_name != null) {
                    where += " and l.ads_name IN (" + data.ads_name + ")";
                }
                if (data.mobileno != '' && data.mobileno != null) {
                    where += " and l.mobile_no ='" + data.mobileno + "'";
                }
                if (data.tag_id != '') {
                    where += " and l.tag_id IN (" + data.tag_id + ")";
                }
                var account_id = data.account_id
                //console.log('SELECT l.*,c.cont_id,c.category FROM `tf_leads` l LEFT JOIN `tf_contacts` c ON l.l_id = c.lead_id LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id ' + where + ' ORDER BY l.creation DESC ');
                return db.query('SELECT l.*,c.cont_id,c.category FROM `tf_leads` l LEFT JOIN `tf_contacts` c ON l.l_id = c.lead_id LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id ' + where + ' ORDER BY l.creation DESC ', callback);
            } else {


                var where = " where l.agent_id=" + data.userid + " and l.is_sync = 'yes' and l.is_deleted = 'no' ";
                if (data.leadArr.length > 0) {
                    where += " and l.l_id IN (" + data.leadArr + ")";
                }
                if (data.startdate != '1970-01-01') {
                    where += " and DATE(l.creation)>='" + data.startdate + "'";
                }

                if (data.enddate != '1970-01-01') {
                    where += " and DATE(l.creation)<='" + data.enddate + "'";
                }

                if (data.modifiedstartdate != '1970-01-01') {
                    where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
                }

                if (data.modifiedenddate != '1970-01-01') {
                    where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
                }

                if (data.status != '' && data.status != null) {
                    where += " and l.status IN (" + data.status + ")";
                }

                if (data.lead_name != '' && data.lead_name != null) {
                    where += " and l.lead_name like '%" + data.lead_name + "%'";
                }

                if (data.source != '' && data.source != null) {
                    where += " and l.source IN (" + data.source + ")";
                }

                if (data.ads_name != '' && data.ads_name != null) {
                    where += " and l.ads_name IN (" + data.ads_name + ")";
                }
                if (data.mobileno != '' && data.mobileno != null) {
                    where += " and l.mobile_no ='" + data.mobileno + "'";
                }
                if (data.tag_id != '') {
                    where += " and l.tag_id IN (" + data.tag_id + ")";
                }
                var account_id = data.account_id
                return db.query('SELECT l.*,c.cont_id,c.category FROM `tf_leads` l LEFT JOIN `tf_contacts` c ON l.l_id = c.lead_id ' + where + ' ORDER BY l.creation DESC ', callback);
            }
        } else {
            var where = " where l.User_id=" + data.userid + " and l.is_sync = 'yes' and l.is_deleted = 'no' ";
            if (data.leadArr.length > 0) {
                where += " and l.l_id IN (" + data.leadArr + ")";
            }
            if (data.agent != '' && data.agent != null) {
                where += " and l.agent_id  IN (" + data.agent + ")";
            }

            if (data.startdate != '1970-01-01') {
                where += " and DATE(creation)>='" + data.startdate + "'";
            }

            if (data.enddate != '1970-01-01') {
                where += " and DATE(creation)<='" + data.enddate + "'";
            }
            if (data.modifiedstartdate != '1970-01-01') {
                where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
            }

            if (data.modifiedenddate != '1970-01-01') {
                where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
            }
            if (data.status != '' && data.status != null) {
                where += " and l.status IN (" + data.status + ")";
            }

            if (data.lead_name != '' && data.lead_name != null) {
                where += " and l.lead_name like '%" + data.lead_name + "%'";
            }

            if (data.source != '' && data.source != null) {
                where += " and l.source IN (" + data.source + ")";
            }

            if (data.ads_name != '' && data.ads_name != null) {
                where += " and l.ads_name IN (" + data.ads_name + ")";
            }
            if (data.mobileno != '' && data.mobileno != null) {
                where += " and l.mobile_no ='" + data.mobileno + "'";
            }
            if (data.tag_id != '') {
                where += " and l.tag_id IN (" + data.tag_id + ")";
            }
            return db.query('SELECT l.*,c.cont_id,c.category FROM `tf_leads` l LEFT JOIN `tf_contacts` c ON l.l_id = c.lead_id ' + where + ' ORDER BY l.creation DESC ', callback);
        }
    },
    get_agent_campaign: function (aid, mid, callback) {
        return db.query('SELECT * FROM `tf_campaigns` WHERE `account_id` = ? AND `lms_agentid` = ?', [mid, aid], callback);
    },
    get_lead_agents: async function (data, callback) {
        if (data.role == 1) {
            if (data.agentrole == 'supervisor') {
                var where = " where S.supervisor_account_id=" + data.userid + " and l.is_sync = 'yes' and l.is_deleted='no'";
                if (data.leadArr.length > 0) {
                    where += " and l.l_id IN (" + data.leadArr + ")";
                }
                if (data.startdate != '1970-01-01') {
                    where += " and DATE(creation)>='" + data.startdate + "'";
                }
                if (data.enddate != '1970-01-01') {
                    where += " and DATE(creation)<='" + data.enddate + "'";
                }
                if (data.modifiedstartdate != '1970-01-01') {
                    where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
                }
                if (data.modifiedenddate != '1970-01-01') {
                    where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
                }
                if (data.status != '' && data.status != null) {
                    where += " and l.status  IN (" + data.status + ")";
                }
                if (data.lead_name != '' && data.lead_name != null) {
                    where += " and l.lead_name like '%" + data.lead_name + "%'";
                }
                if (data.source != '' && data.source != null) {
                    where += " and l.source  IN (" + data.source + ")";
                }
                if (data.ads_name != '' && data.ads_name != null) {
                    where += " and l.ads_name IN (" + data.ads_name + ")";
                }
                if (data.mobileno != '' && data.mobileno != null) {
                    where += " and l.mobile_no ='" + data.mobileno + "'";
                }
                if (data.tag_id != '') {
                    where += " and l.tag_id IN (" + data.tag_id + ")";
                }
                var account_id = data.account_id
                //console.log('SELECT l.agent_id,l.User_id FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id ' + where + ' GROUP BY agent_id ORDER BY l.creation DESC ');
                return db.query('SELECT l.agent_id,l.User_id FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id ' + where + ' GROUP BY agent_id ORDER BY l.creation DESC ', callback);
            } else {
                var where = " where l.agent_id=" + data.userid + " and l.is_sync = 'yes' and l.is_deleted='no'";
                if (data.leadArr.length > 0) {
                    where += " and l.l_id IN (" + data.leadArr + ")";
                }
                if (data.startdate != '1970-01-01') {
                    where += " and DATE(creation)>='" + data.startdate + "'";
                }
                if (data.enddate != '1970-01-01') {
                    where += " and DATE(creation)<='" + data.enddate + "'";
                }
                if (data.modifiedstartdate != '1970-01-01') {
                    where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
                }
                if (data.modifiedenddate != '1970-01-01') {
                    where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
                }
                if (data.status != '' && data.status != null) {
                    where += " and l.status  IN (" + data.status + ")";
                }
                if (data.lead_name != '' && data.lead_name != null) {
                    where += " and l.lead_name like '%" + data.lead_name + "%'";
                }
                if (data.source != '' && data.source != null) {
                    where += " and l.source  IN (" + data.source + ")";
                }
                if (data.ads_name != '' && data.ads_name != null) {
                    where += " and l.ads_name IN (" + data.ads_name + ")";
                }
                if (data.mobileno != '' && data.mobileno != null) {
                    where += " and l.mobile_no ='" + data.mobileno + "'";
                }
                if (data.tag_id != '') {
                    where += " and l.tag_id IN (" + data.tag_id + ")";
                }

            // if (data.agent != '') {
            //     where += " and l.agent_id IN (" + data.agent + ")";
            // }
                var account_id = data.account_id
                console.log('SELECT agent_id,User_id FROM `tf_leads` l ' + where + ' GROUP BY agent_id ORDER BY l.creation DESC ')
                return db.query('SELECT agent_id,User_id FROM `tf_leads` l ' + where + ' GROUP BY agent_id ORDER BY l.creation DESC ', callback);
            }
        } else {
            var where = " where l.User_id=" + data.userid + " and l.is_sync = 'yes' and l.is_deleted='no'";
            if (data.leadArr.length > 0) {
                where += " and l.l_id IN (" + data.leadArr + ")";
            }
            if (data.agent  != '' && data.agent != null) {
                where += " and l.agent_id IN (" + data.agent + ")";
            }

            if (data.startdate != '1970-01-01') {
                where += " and DATE(creation)>='" + data.startdate + "'";
            }

            if (data.enddate != '1970-01-01') {
                where += " and DATE(creation)<='" + data.enddate + "'";
            }

            if (data.modifiedstartdate != '1970-01-01') {
                where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
            }

            if (data.modifiedenddate != '1970-01-01') {
                where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
            }


            if (data.status != '' && data.status != null) {
                where += " and l.status  IN (" + data.status + ")";
            }

            if (data.lead_name != '' && data.lead_name != null) {
                where += " and l.lead_name like '%" + data.lead_name + "%'";
            }

            if (data.source != '' && data.source != null) {
                where += " and l.source  IN (" + data.source + ")";
            }
            if (data.ads_name != '' && data.ads_name != null) {
                where += " and l.ads_name IN (" + data.ads_name + ")";
            }
            if (data.mobileno != '' && data.mobileno != null) {
                where += " and l.mobile_no ='" + data.mobileno + "'";
            }
            if (data.tag_id != '') {
                where += " and l.tag_id IN (" + data.tag_id + ")";
            }
            console.log("genterde");
            console.log('SELECT agent_id,User_id FROM `tf_leads` l  ' + where + '  GROUP BY agent_id ORDER BY l.creation DESC ');
            return db.query('SELECT agent_id,User_id FROM `tf_leads` l  ' + where + '  GROUP BY agent_id ORDER BY l.creation DESC ', callback);
        }
    },
    updateotherdetail: function (data, callback) {
        return db.query('update tf_contacts_meta set ? WHERE meta_id = ?', [data, data.meta_id], callback);
    },
    getleadfeedback: function (fid, cid, callback) {
        return db.query('SELECT FD.*,F.form_name FROM tf_feedbackform_data FD LEFT JOIN tf_feedbackforms F ON F.fid=FD.fid WHERE FD.fid=? and FD.cdrid=?', [fid, cid], callback);
    },
    getactiveagentgroup: function (aid, callback) {
        return db.query('SELECT * FROM `HuntGroup` WHERE `AccountID` = ?', [aid], callback);
    },
    getagentgroupdetail: function (aid, callback) {
        return db.query('SELECT * FROM `HuntGroup` WHERE `GroupID` = ?', [aid], callback);
    },
    getagentdetail: function (aid, callback) {
        return db.query('SELECT * FROM `tf_account_table` WHERE `account_id` = ?', [aid], callback);
    },
    updatelead: function (data, callback) {
        return db.query('update tf_leads set ? WHERE l_id = ?', [data, data.l_id], callback);
    },
    get_module_access_generate_campaign(id, callback) {
        return db.query("SELECT * FROM `tf_account_table` WHERE account_id =" + id, callback)
    },
    get_lead_timeline_details: function (lid, callback) {
        return db.query('SELECT * FROM `tf_lead_timeline` WHERE `t_id` = ?', [lid], callback);
    },
    update_lead_timeline: function (data, callback) {
        return db.query('update tf_lead_timeline set ? WHERE t_id = ?', [data, data.t_id], callback);
    },
    get_lead_contactsmeta: function (lid, aid, callback) {
        return db.query('SELECT meta_key,meta_value,meta_id FROM `tf_contacts_meta` WHERE cont_id IN (SELECT cont_id FROM `tf_contacts` WHERE `customer_id` = ? AND `lead_id` = ?) ORDER BY meta_id desc', [aid, lid], callback);
    },
    getaccessettingbyname: function (data, callback) {
        return db.query('SELECT * FROM `tf_manager_settings` WHERE `account_id` = ' + data.account_id + ' and setting_name="' + data.setting_name + '"', [], callback);
    },
    getwhatsupapidetail: function (data, callback) {
        return db.query('SELECT A.* FROM `tf_manager_settings` S LEFT JOIN tf_manager_api A on A.api_id=S.setting_value WHERE S.account_id = ' + data.account_id + ' and S.setting_name="whatsup_api"', [], callback);
    },
    deleteleadsreq: function (id, callback) {
        db.query('UPDATE tf_leads set is_deleted="yes" where l_id=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);

            }
        })
    },
    getsmsbalance: function (id, callback) {
        return db.query('SELECT  SMS_Pr_Balance FROM tf_account_balance WHERE Account_ID = ? ', [id], callback);
    },
    update_balance: function (data, callback) {
        return db.query('update tf_account_balance set ? WHERE Account_ID = ?', [data, data.Account_ID], callback);
    },
    getassignsmserver: function (managerid, callback) {
        return db.query('SELECT  S.* FROM tf_assign_sms_server SS INNER JOIN tf_sms_server S ON S.sid=SS.server_id WHERE SS.account_id = ? ', [managerid], callback);
    },
    getsmstemplatebyid: function (id, callback) {
        return db.query('SELECT  * FROM tf_smstemplate WHERE sms_id = ? ', [id], callback);
    },
    insertsmsdata: function (data, callback) {
        return db.query('Insert INTO tf_sms_report SET ?', data, callback);
    },
    getagentsmscampaign: function (id, callback) {
        return db.query('SELECT * FROM tf_smscampagis WHERE agent_id = ?', [id], callback);
    },
    getContactbyLeadID: function (id, callback) {
        return db.query('SELECT * FROM tf_contacts WHERE lead_id=' + id, [], callback);
    },
    insertbulksmscampaigncontact: function (data, callback) {
        db.query('Insert INTO tf_sms_campagins_number (cid,name,status,message,date,mobile,cont_id,form_id) VALUES ?', [data], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);
            }
        });
    },
    savecampaigns: function (data, callback) {
        return db.query("Insert INTO tf_smscampagis  SET ?", data, callback)
    },
    saveleaddealdonedata: function (data, callback) {
        return db.query("Insert INTO tf_lead_deal_done  SET ?", data, callback)
    },
    updateleaddealdonedata: function (data, dealid, callback) {
        return db.query('update tf_lead_deal_done set ? WHERE deal_id = ?', [data, dealid], callback);
    },
    dholeraAllFiledata: function (uid, callback) {
        return db.query('Select * from tf_dholera_leads_upload_file where file_status=? order by upload_date asc limit 1', [uid], callback);
    },
    updatedholerafileStatus: function (Contacts, cont_id, callback) {
        return db.query('UPDATE `tf_dholera_leads_upload_file` SET ? WHERE `tf_dholera_leads_upload_file`.`F_id`="' + cont_id + '"', Contacts, callback);
    },
    getagentgroupdetaildata: function (gid, aid, callback) {
        return db.query('SELECT * FROM HuntGroupDetail WHERE UserID = ' + aid + ' and HuntGroupID=' + gid + ' order by ID ASC', [], callback);
    },
    BulkFiledatabydholeracustomer: function (id, callback) {
        return db.query('Select * from tf_dholera_leads_upload_file where user_id=? ORDER BY `F_id` DESC', [id], callback);
    },
    getdealdonedatabyleadid: function (id, callback) {
        return db.query("SELECT * FROM `tf_lead_deal_done` WHERE `lead_id`= " + id, callback);
    },
    getemailtemplatedetail: function (id, callback) {
        return db.query("SELECT * FROM `tf_emailtemplate` WHERE email_id =" + id, callback);
    },
    getsegmentnamebyleadid: function (id, callback) {
        return db.query("SELECT S.name FROM `tf_contacts` C INNER JOIN tf_segments S ON S.cont_id=C.category WHERE C.lead_id ='" + id + "'", callback);
    },/*
    get_supervisor_lead_list: async function (data, callback) {
        return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [data.userid], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                row = results[0]
                var where = " where S.supervisor_account_id=" + data.userid + " and is_sync = 'yes'";

                if (data.startdate != '1970-01-01') {
                    where += " and DATE(l.creation)>='" + data.startdate + "'";
                }

                if (data.enddate != '1970-01-01') {
                    where += " and DATE(l.creation)<='" + data.enddate + "'";
                }

                if (data.modifiedstartdate != '1970-01-01') {
                    where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
                }

                if (data.modifiedenddate != '1970-01-01') {
                    where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
                }


                if (data.status != '' && data.status != null) {
                    where += " and l.status ='" + data.status + "'";
                }

                if (data.lead_name != '' && data.lead_name != null) {
                    where += " and l.lead_name like '%" + data.lead_name + "%'";
                }

                if (data.source != '' && data.source != null) {
                    where += " and l.source ='" + data.source + "'";
                }

                if (data.mobileno != '' && data.mobileno != null) {
                    where += " and l.mobile_no ='" + data.mobileno + "'";
                }
                var account_id = data.account_id
                if (row.show_no_id == 1) {
                    //console.log('SELECT l.*,a.show_no_id,C.cont_id as mobileno,a.whatsup_access,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where + ' ORDER BY l.creation DESC ');
                    return db.query('SELECT l.*,a.show_no_id,C.cont_id as mobileno,a.whatsup_access,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where + ' ORDER BY l.creation DESC ', callback);
                } else {
                    console.log('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,a.whatsup_access,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id  LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id ' + where + ' ORDER BY l.creation DESC');
                    return db.query('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,a.whatsup_access,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id  LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id ' + where + ' ORDER BY l.creation DESC ', callback);
                }
            }
        })
    },*/
    searchsupervisorleaddata: async function (data, callback) {
        return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [data.userid], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                row = results[0]
                var where = " where S.supervisor_account_id=" + data.userid + " and l.is_sync = 'yes' and l.is_deleted='no'";
                if (data.agent.length>0) {
                    where += " and l.agent_id IN (" + data.agent + ")";
                }
                if (data.startdate != '1970-01-01') {
                    where += " and DATE(l.creation)>='" + data.startdate + "'";
                }

                if (data.enddate != '1970-01-01') {
                    where += " and DATE(l.creation)<='" + data.enddate + "'";
                }

                if (data.modifiedstartdate != '1970-01-01') {
                    where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
                }

                if (data.modifiedenddate != '1970-01-01') {
                    where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
                }
                if (data.complatedstartdate != '1970-01-01') {
                    where += " and DATE(l.expected_closing)>='" + data.complatedstartdate + "'";
                }

                if (data.complatedenddate != '1970-01-01') {
                    where += " and DATE(l.expected_closing)<='" + data.complatedenddate + "'";
                }

                if (data.status != '' && data.status != null) {
                    where += " and l.status IN (" + data.status + ")";
                }

                if (data.lead_name != '' && data.lead_name != null) {
                    where += " and l.lead_name like '%" + data.lead_name + "%'";
                }

                if (data.ads_name != '' && data.ads_name != null) {
                    where += " and l.ads_name IN (" + data.ads_name + ")";
                }
                if (data.source != '' && data.source != null) {
                    where += " and l.source IN (" + data.source + ")";
                }
                if (data.mobileno != '' && data.mobileno != null) {
                    where += " and l.mobile_no ='" + data.mobileno + "'";
                }
                if (data.tag_id != '') {
                    where += " and l.tag_id IN (" + data.tag_id + ")";
                }
                var account_id = data.account_id
                if (row.show_no_id == 1) {
                    //console.log('SELECT l.*,a.show_no_id,C.cont_id as mobileno,a.whatsup_access,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where + ' ORDER BY l.creation DESC ');
                    return db.query('SELECT l.*,a.show_no_id,C.cont_id as mobileno,a.whatsup_access,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where + ' ORDER BY l.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '', callback);
                } else {
                    //console.log('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,a.whatsup_access,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id  LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id ' + where + ' ORDER BY l.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '');
                    return db.query('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,a.whatsup_access,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id  LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id ' + where + ' ORDER BY l.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '', callback);
                }
            }
        })
    },
    getsupervisorleaddatalength: async function (data, callback) {
        //console.log("length::" + JSON.stringify(data))
        return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [data.userid], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                row = results[0]
                var where = " where S.supervisor_account_id=" + data.userid + " and l.is_sync = 'yes' and l.is_deleted='no'";
                if (data.agent.length>0) {
                    where += " and l.agent_id IN (" + data.agent + ")";
                }
                if (data.startdate != '1970-01-01') {
                    where += " and DATE(l.creation)>='" + data.startdate + "'";
                }

                if (data.enddate != '1970-01-01') {
                    where += " and DATE(l.creation)<='" + data.enddate + "'";
                }

                if (data.modifiedstartdate != '1970-01-01') {
                    where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
                }

                if (data.modifiedenddate != '1970-01-01') {
                    where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
                }
                if (data.complatedstartdate != '1970-01-01') {
                    where += " and DATE(l.expected_closing)>='" + data.complatedstartdate + "'";
                }

                if (data.complatedenddate != '1970-01-01') {
                    where += " and DATE(l.expected_closing)<='" + data.complatedenddate + "'";
                }

                if (data.status != '' && data.status != null) {
                    where += " and l.status IN (" + data.status + ")";
                }

                if (data.lead_name != '' && data.lead_name != null) {
                    where += " and l.lead_name like '%" + data.lead_name + "%'";
                }

                if (data.ads_name != '' && data.ads_name != null) {
                    where += " and l.ads_name IN (" + data.ads_name + ")";
                }
                if (data.source != '' && data.source != null) {
                    where += " and l.source IN (" + data.source + ")";
                }
                if (data.mobileno != '' && data.mobileno != null) {
                    where += " and l.mobile_no ='" + data.mobileno + "'";
                }
                if (data.tag_id != '') {
                    where += " and l.tag_id IN (" + data.tag_id + ")";
                }
                var account_id = data.account_id
                if (row.show_no_id == 1) {
                    //console.log('SELECT l.*,a.show_no_id,C.cont_id as mobileno,a.whatsup_access,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where + ' ORDER BY l.creation DESC ');
                    return db.query('SELECT COUNT(l.l_id) AS totallead FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where, callback);
                } else {
                    //console.log('SELECT COUNT(l.l_id) AS totallead FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id  LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id ' + where);
                    return db.query('SELECT COUNT(l.l_id) AS totallead FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id  LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id ' + where, callback);
                }
            }
        })

    },


    get_sup_lead_list_api_excel: function (data, callback) {
        return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [data.userid], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                row = results[0]
                var where = " where S.supervisor_account_id=" + data.userid + " and l.is_sync = 'yes' and l.is_deleted='no'";
                if (data.agent.length>0) {
                    where += " and l.agent_id IN (" + data.agent + ")";
                }
                if (data.startdate != '1970-01-01') {
                    where += " and DATE(l.creation)>='" + data.startdate + "'";
                }

                if (data.enddate != '1970-01-01') {
                    where += " and DATE(l.creation)<='" + data.enddate + "'";
                }

                if (data.modifiedstartdate != '1970-01-01') {
                    where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
                }

                if (data.modifiedenddate != '1970-01-01') {
                    where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
                }


                if (data.status != '' && data.status != null) {
                    where += " and l.status IN (" + data.status + ")";
                }

                if (data.lead_name != '' && data.lead_name != null) {
                    where += " and l.lead_name like '%" + data.lead_name + "%'";
                }

                if (data.ads_name != '' && data.ads_name != null) {
                    where += " and l.ads_name IN (" + data.ads_name + ")";
                }
                if (data.source != '' && data.source != null) {
                    where += " and l.source IN (" + data.source + ")";
                }
                if (data.mobileno != '' && data.mobileno != null) {
                    where += " and l.mobile_no ='" + data.mobileno + "'";
                }
                if (data.tag_id != '') {
                    where += " and l.tag_id IN (" + data.tag_id + ")";
                }
                var account_id = data.account_id
                if (row.show_no_id == 1) {
                    return db.query('SELECT l.*,a.show_no_id,C.cont_id as mobileno,a.whatsup_access,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where , callback);
                } else {
                    return db.query('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,a.whatsup_access,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id  LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id ' + where , callback);
                }
            }
        })
        // return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [data.userid], function (err, results) {
        //     if (err) {
        //         console.log("[mysql error]", err);
        //     } else {
        //         row = results[0]
        //         var where = " where S.supervisor_account_id=" + data.userid + " and l.is_sync = 'yes' and l.is_deleted='no'";
        //         if (data.agent.length>0) {
        //             where += " and l.agent_id IN (" + data.agent + ")";
        //         }
        //         if (data.startdate != '1970-01-01') {
        //             where += " and DATE(l.creation)>='" + data.startdate + "'";
        //         }

        //         if (data.enddate != '1970-01-01') {
        //             where += " and DATE(l.creation)<='" + data.enddate + "'";
        //         }

        //         if (data.modifiedstartdate) {
        //             where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
        //         }

        //         if (data.modifiedenddate) {
        //             where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
        //         }
        //         if (data.status != '' && data.status != null) {
        //             where += " and l.status ='" + data.status + "'";
        //         }

        //         if (data.lead_name != '' && data.lead_name != null) {
        //             where += " and l.lead_name like '%" + data.lead_name + "%'";
        //         }

        //         if (data.source != '' && data.source != null) {
        //             where += " and l.source ='" + data.source + "'";
        //         }

        //         if (data.mobileno != '' && data.mobileno != null) {
        //             where += " and l.mobile_no ='" + data.mobileno + "'";
        //         }
        //         var account_id = data.account_id
        //         if (row.show_no_id == 1) {
        //             //console.log('SELECT l.*,a.show_no_id,C.cont_id as mobileno,a.whatsup_access,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where + ' ORDER BY l.creation DESC ');
        //             return db.query('SELECT l.*,a.show_no_id,C.cont_id as mobileno,a.whatsup_access,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where + ' ORDER BY l.creation DESC ', callback);
        //             //return db.query('SELECT l.*,a.show_no_id,C.cont_id as mobile_no,a.whatsup_access,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where + ' ORDER BY l.creation DESC ', callback);
        //         } else {
        //             //console.log('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,a.whatsup_access,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id  LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id ' + where + ' ORDER BY l.creation DESC ');
        //             //return db.query('SELECT l.*,a.show_no_id,a.account_name as agent,a.whatsup_access,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.creation DESC ', callback);
        //             return db.query('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,a.whatsup_access,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id  LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id ' + where + ' ORDER BY l.creation DESC ', callback);
        //         }
        //     }
        // })
    },
    get_lead_status: function (id, callback) {
        return db.query('SELECT * FROM `tf_lead_stage_status` WHERE stage_id IN (SELECT s_id FROM `tf_lead_stage` WHERE User_id = ? )', [id], callback);
    },
    get_api_data: function (id, callback) {
        return db.query('SELECT * FROM tf_manager_api where account_id= ?', [id], callback);
    },
    getoutbountdid: function (id, callback) {
        return db.query('SELECT D.did_number,N.* FROM `tf_did_numbers` N INNER JOIN tf_did D ON N.did=D.did WHERE N.account_id=? and N.Type=9 order by N.assginDate desc', [id], callback);
    },
    create_trigger: function (data, callback) {
        return db.query('Insert INTO tf_triggers set ? ', [data], callback);
    },
    get_trigger_list: function (id, callback) {
        return db.query('SELECT * FROM tf_triggers where account_id=?', [id], callback);
    },
    getwhatsapptemplate: function (id, role, callback) {
        if (role == 1) {
            return db.query("SELECT E.* FROM `tf_whatsapp_template` E LEFT JOIN tf_account_table A ON E.account_id=A.created_by WHERE E.status =1 and A.account_id =" + id, callback);
        } else {
            return db.query("SELECT * FROM `tf_whatsapp_template` WHERE `status` =1 and account_id =" + id, callback);
        }
    },
    GetSmsServerByManagerId: function (managerid, callback) {
        return db.query('SELECT A.*,S.server_name,S.server_type,S.sid,S.server_url from tf_assign_sms_server A INNER JOIN tf_sms_server S ON S.sid=A.server_id where A.account_id=? and S.server_type=0', [managerid], callback);
    },
    searchleaddata: async function (data, callback) {
        if (data.role == 1) {
            return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [data.userid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    row = results[0]
                    var where = " where l.agent_id=" + data.userid + "  and l.is_sync = 'yes' and l.is_deleted = 'no'";

                    if (data.startdate != '1970-01-01') {
                        where += " and DATE(l.creation)>='" + data.startdate + "'";
                    }

                    if (data.enddate != '1970-01-01' ) {
                        where += " and DATE(l.creation)<='" + data.enddate + "'";
                    }

                    if (data.modifiedstartdate != '1970-01-01') {
                        where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
                    }

                    if (data.modifiedenddate != '1970-01-01') {
                        where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
                    }

                    if (data.complatedstartdate != '1970-01-01') {
                        where += " and DATE(l.expected_closing)>='" + data.complatedstartdate + "'";
                    }

                    if (data.complatedenddate != '1970-01-01') {
                        where += " and DATE(l.expected_closing)<='" + data.complatedenddate + "'";
                    }
                    if (data.status != '' && data.status != null) {
                        where += " and l.status IN (" + data.status + ")";
                    }

                    if (data.lead_name != '' && data.lead_name != null) {
                        where += " and l.lead_name like '%" + data.lead_name + "%'";
                    }
                    if (data.ads_name != '' && data.ads_name != null) {
                        where += " and l.ads_name IN (" + data.ads_name + ")";
                    }
                    if (data.source != '' && data.source != null) {
                        where += " and l.source IN (" + data.source + ")";
                    }

                    if (data.mobileno != '' && data.mobileno != null) {
                        where += " and l.mobile_no ='" + data.mobileno + "'";
                    }

                    if (data.tag_id != '') {
                        where += " and l.tag_id IN (" + data.tag_id + ")";
                    }
                    var account_id = data.account_id
                    if (row.show_no_id == 1) {
                        console.log('SELECT l.*,a.show_no_id,C.cont_id as mobileno,a.whatsup_access,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where + ' ORDER BY l.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + ' ', callback);
                        return db.query('SELECT l.*,a.show_no_id,C.cont_id as mobileno,a.whatsup_access,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where + ' ORDER BY l.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + ' ', callback);
                    } else {
                        console.log('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,a.whatsup_access,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '', callback);
                        return db.query('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,a.whatsup_access,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '', callback);
                    }
                }
            })

        } else {
            var where = " where l.User_id=" + data.userid + "  and l.is_sync = 'yes' and l.is_deleted = 'no'";

            if (data.agent != '') {
                where += " and l.agent_id IN (" + data.agent + ")";
            }

            if (data.startdate != '1970-01-01' ) {
                where += " and DATE(l.creation)>='" + data.startdate + "'";
            }

            if (data.enddate != '1970-01-01' ) {
                where += " and DATE(l.creation)<='" + data.enddate + "'";
            }

            if (data.modifiedstartdate != '1970-01-01') {
                where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
            }

            if (data.modifiedenddate != '1970-01-01') {
                where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
            }
            if (data.complatedstartdate != '1970-01-01') {
                where += " and DATE(l.expected_closing)>='" + data.complatedstartdate + "'";
            }

            if (data.complatedenddate != '1970-01-01') {
                where += " and DATE(l.expected_closing)<='" + data.complatedenddate + "'";
            }
            if (data.status != '' && data.status != null) {
                where += " and l.status IN (" + data.status + ")";
            }

            if (data.lead_name != '' && data.lead_name != null) {
                where += " and l.lead_name like '%" + data.lead_name + "%'";
            }
            if (data.ads_name != '' && data.ads_name != null) {
                where += " and l.ads_name IN (" + data.ads_name + ")";
            }
            if (data.source != '' && data.source != null) {
                where += " and l.source IN (" + data.source + ")";
            }

            if (data.mobileno != '' && data.mobileno != null) {
                where += " and l.mobile_no ='" + data.mobileno + "'";
            }

            if (data.tag_id != '') {
                where += " and l.tag_id IN (" + data.tag_id + ")";
            }
            console.log('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + data.userid + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '');
            return db.query('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + data.userid + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '', callback);
        }
    },
    getleaddatalength: async function (data, callback) {
        if (data.role == 1) {
            return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [data.userid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    row = results[0]
                    var where = " where l.agent_id=" + data.userid + " and l.is_sync = 'yes' and l.is_deleted = 'no'";

                    if (data.startdate) {
                        where += " and DATE(l.creation)>='" + data.startdate + "'";
                    }

                    if (data.enddate) {
                        where += " and DATE(l.creation)<='" + data.enddate + "'";
                    }

                    if (data.modifiedstartdate != '1970-01-01') {
                        where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
                    }

                    if (data.modifiedenddate != '1970-01-01') {
                        where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
                    }
                    if (data.complatedstartdate != '1970-01-01') {
                        where += " and DATE(l.expected_closing)>='" + data.complatedstartdate + "'";
                    }

                    if (data.complatedenddate != '1970-01-01') {
                        where += " and DATE(l.expected_closing)<='" + data.complatedenddate + "'";
                    }

                    if (data.status != '' && data.status != null) {
                        where += " and l.status IN (" + data.status + ")";
                    }

                    if (data.lead_name != '' && data.lead_name != null) {
                        where += " and l.lead_name like '%" + data.lead_name + "%'";
                    }
                    if (data.ads_name != '' && data.ads_name != null) {
                        where += " and l.ads_name IN (" + data.ads_name + ")";
                    }

                    if (data.source != '' && data.source != null) {
                        where += " and l.source IN (" + data.source + ")";
                    }

                    if (data.mobileno != '' && data.mobileno != null) {
                        where += " and l.mobile_no ='" + data.mobileno + "'";
                    }

                    if (data.tag_id != '') {
                        where += " and l.tag_id IN (" + data.tag_id + ")";
                    }
                    var account_id = data.account_id
                    if (row.show_no_id == 1) {
                        return db.query('SELECT COUNT(l.l_id) AS totallead FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where, callback);
                    } else {
                        console.log('SELECT COUNT(l.l_id) AS totallead FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where);
                        return db.query('SELECT COUNT(l.l_id) AS totallead FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where, callback);
                    }
                }
            })

        } else {
            var where = " where l.User_id=" + data.userid + "  and l.is_sync = 'yes' and l.is_deleted = 'no'";

            if (data.agent != '') {
                where += " and l.agent_id IN (" + data.agent + ")";
            }

            if (data.startdate != '1970-01-01' && data.startdate != null) {
                where += " and DATE(l.creation)>='" + data.startdate + "'";
            }

            if (data.enddate != '1970-01-01'  && data.enddate != null) {
                where += " and DATE(l.creation)<='" + data.enddate + "'";
            }

            if (data.modifiedstartdate != '1970-01-01') {
                where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
            }

            if (data.modifiedenddate != '1970-01-01') {
                where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
            }
            if (data.complatedstartdate !=null && data.complatedstartdate != '1970-01-01') {
                where += " and DATE(l.expected_closing)>='" + data.complatedstartdate + "'";
            }

            if (data.complatedenddate !=null &&  data.complatedenddate != '1970-01-01') {
                where += " and DATE(l.expected_closing)<='" + data.complatedenddate + "'";
            }
            if (data.status != '' && data.status != null) {
                where += " and l.status IN (" + data.status + ")";
            }

            if (data.lead_name != '' && data.lead_name != null) {
                where += " and l.lead_name like '%" + data.lead_name + "%'";
            }
            if (data.ads_name != '' && data.ads_name != null) {
                where += " and l.ads_name IN (" + data.ads_name + ")";
            }

            if (data.source != '' && data.source != null) {
                where += " and l.source IN (" + data.source + ")";
            }

            if (data.mobileno != '' && data.mobileno != null) {
                where += " and l.mobile_no ='" + data.mobileno + "'";
            }
            if (data.tag_id != '') {
                where += " and l.tag_id IN (" + data.tag_id + ")";
            }
            console.log('SELECT COUNT(l.l_id) AS totallead FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where );
            return db.query('SELECT COUNT(l.l_id) AS totallead FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where, callback);
        }
    },
    getleadagentdetail: function (id, callback) {
        return db.query('SELECT A.account_name,A.email,A.mobile FROM tf_leads L INNER JOIN tf_account_table A on A.account_id=L.agent_id WHERE L.l_id=' + id, [], callback);
    },
    getsmstemplatedetail: function (id, callback) {
        return db.query("SELECT IF((var1='form' OR var2='form' OR var3='form' OR var4='form' OR var5='form'),formname,'NA') AS FromName,IF((var1='link' OR var2='link' OR var3='link' OR var4='link' OR var5='link'),slname,'NA') AS LinkName FROM (SELECT a.sms_id,a.var1,a.var2,a.var3,a.var4,a.var5,a.form_id,a.link_id,a.form_id AS formname,c.sl_url AS slname FROM tf_smstemplate a LEFT JOIN tf_feedbackforms b ON a.form_id=b.fid LEFT JOIN tf_sms_links c ON a.link_id=c.sl_id WHERE a.sms_id=" + id + ")U", [], callback);
    },
    getadsnamebyuserid: function (data, callback) {
        //console.log("SELECT DISTINCT(ads_name) as ads_name FROM `tf_leads` WHERE User_id=" + id + " AND (ads_name IS NOT NULL AND ads_name!='');");
        if(data.source.length>0){
            where = " and source IN (" + data.source + ")";
        }
        return db.query("SELECT DISTINCT(ads_name) as ads_name FROM `tf_leads` WHERE User_id=" + data.userid + " AND (ads_name IS NOT NULL AND ads_name!='') AND is_deleted='no' ORDER BY ads_name ASC", [], callback);
    },
    checkleadstatus: function (name, callback) {
        return db.query('SELECT * FROM tf_lead_master_status where status_name="' + name + '"', [], callback);
    },
    saveleadstatus: function (data, callback) {
        return db.query('Insert INTO tf_lead_master_status set ? ', [data], callback);
    },
    getleadtags: function (id, callback) {
        return db.query('SELECT * from tf_lead_tags where account_id=? ORDER BY tag_name ASC', [id], callback);
    },
    getnextleaddata: async function (data, callback) {
        console.log(data);
        if (data.role == 1) {
            var where = " where l.agent_id=" + data.userid + "  and l.is_sync = 'yes' and l.is_deleted = 'no'";

            if (data.startdate != '1970-01-01') {
                where += " and DATE(l.creation)>='" + data.startdate + "'";
            }

            if (data.enddate != '1970-01-01') {
                where += " and DATE(l.creation)<='" + data.enddate + "'";
            }

            if (data.modifiedstartdate != '1970-01-01' || data.modifiedstartdate != 'NaN-aN-aN') {
                where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
            }

            if (data.modifiedenddate != '1970-01-01' || data.modifiedenddate != 'NaN-aN-aN') {
                where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
            }


            if (data.status != '' && data.status != null) {
                where += " and l.status IN (" + data.status + ")";
            }

            if (data.lead_name != '' && data.lead_name != null) {
                where += " and l.lead_name like '%" + data.lead_name + "%'";
            }
            if (data.ads_name != '' && data.ads_name != null) {
                where += " and l.ads_name IN (" + data.ads_name + ")";
            }
            if (data.source != '' && data.source != null) {
                where += " and l.source IN (" + data.source + ")";
            }

            if (data.mobileno != '' && data.mobileno != null) {
                where += " and l.mobile_no ='" + data.mobileno + "'";
            }

            if (data.tag_id != '') {
                where += " and l.tag_id IN (" + data.tag_id + ")";
            }
            var account_id = data.account_id
            return db.query('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,a.whatsup_access,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '', callback);


        } else {
            var where = " where l.User_id=" + data.userid + " and l.is_sync = 'yes' and l.is_deleted = 'no'";

            if (data.agent != '') {
                where += " and l.agent_id IN (" + data.agent + ")";
            }

            if (data.startdate != '1970-01-01') {
                where += " and (l.creation)>='" + data.startdate + "'";
            }

            if (data.enddate != '1970-01-01') {
                where += " and (l.creation)<'" + data.enddate + "'";
            }

            if (data.modifiedstartdate != '' || data.modifiedstartdate) {
                where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
            }

            if (data.modifiedenddate != '' || data.modifiedenddate) {
                where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
            }

            if (data.status != '' && data.status != null) {
                where += " and l.status IN (" + data.status + ")";
            }

            if (data.lead_name != '' && data.lead_name != null) {
                where += " and l.lead_name like '%" + data.lead_name + "%'";
            }
            if (data.ads_name != '' && data.ads_name != null) {
                where += " and l.ads_name IN (" + data.ads_name + ")";
            }
            if (data.source != '' && data.source != null) {
                where += " and l.source IN (" + data.source + ")";
            }

            if (data.mobileno != '' && data.mobileno != null) {
                where += " and l.mobile_no ='" + data.mobileno + "'";
            }
            if (data.tag_id != '') {
                where += " and l.tag_id IN (" + data.tag_id + ")";
            }
            //console.log('SELECT l.l_id FROM `tf_leads` l  ' + where + ' ORDER BY l.creation DESC LIMIT 1');
            return db.query('SELECT l.l_id FROM `tf_leads` l  ' + where + ' ORDER BY l.creation DESC LIMIT 1', callback);
        }
    },
    saveleadquotation: function (data, callback) {
        return db.query('Insert INTO tf_lead_quotation SET ?', data, callback);
    },
    insertquotationitems: function (data, callback) {
        return db.query('Insert INTO tf_lead_quotation_item SET ?', data, callback);
    },
    updatleadquotation: function (data, data2, callback) {
        return db.query('update tf_lead_quotation set ? WHERE quotation_id = ?', [data, data2], callback);
    },
    getleadquotation: function (data, callback) {
        return db.query('SELECT Q.quotation_id,Q.quotation_name,Q.total_quantity,Q.grand_total, COUNT(item_id) AS itemcount FROM `tf_lead_quotation` Q LEFT JOIN tf_lead_quotation_item I ON I.quotation_id=Q.quotation_id WHERE Q.account_id=' + data.User_id + ' AND Q.lead_id=' + data.leadid+' GROUP BY I.quotation_id', [], callback);
    },
    getleadquotationdetail: function (data, callback) {
        //console.log('SELECT * FROM `tf_lead_quotation` WHERE account_id=' + data.User_id + ' AND lead_id=' + data.leadid);
        return db.query('SELECT Q.*,L.lead_name,L.mobile_no FROM `tf_lead_quotation` Q LEFT JOIN tf_leads L ON L.l_id=Q.lead_id WHERE account_id=' + data.User_id + ' AND quotation_id=' + data.quotationid, [], callback);
    },
    getleadquotationitembyid: async function (id) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT I.*,P.product_name,P.product_desc AS description FROM tf_lead_quotation_item I INNER JOIN tf_products P ON P.productid=I.product_id  WHERE quotation_id=?', [id], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                    resolve([]);
                } else {
                    if (results.length > 0) {
                        resolve(results);
                    } else {
                        resolve([]);
                    }
                }
            })
        })
    },
    deletequotationitems: function (id, callback) {
        return db.query('DELETE FROM tf_lead_quotation_item where quotation_id=?', [id], callback);
    },
    getleadstagenamebystatus: function (data, callback) {
        return db.query('SELECT C.stage_name FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = '+data.userid+' AND CD.status_master = "'+data.status+'"', [], callback);
    },
    updateopportunityamount: async function (quotationid,leadid, amount) {
        return new Promise(function (resolve, reject) {
            if(quotationid>0){
                db.query('SELECT total_amount FROM tf_lead_quotation WHERE quotation_id = ?', [quotationid], function (error, rows) {
                    if (error) {
                        resolve(0)
                    } else {
                        if (rows.length > 0) {
                            db.query('SELECT opportunity_amount FROM tf_leads WHERE l_id = ?', [leadid], function (error, lrows) {
                                if (error) {
                                    resolve(0)
                                } else {
                                    if (lrows.length > 0) {
                                        if(rows[0].opportunity_amount||rows[0].opportunity_amount!=''){
                                            var opportunity_amount = (Number(lrows[0].opportunity_amount) - Number(rows[0].total_amount))+Number(amount);
                                        }else{
                                            var opportunity_amount = Number(amount)
                                        }
                                        db.query('Update `tf_leads` set opportunity_amount='+opportunity_amount+' WHERE l_id = ?', [leadid], async function (error, rows) {
                                            if (error) {
                                                resolve(0)
                                            } else {
                                                resolve(1)
                                            }
                                        })
                                    }else{
                                        resolve(0)
                                    }
                                }
                            })
                        }else{
                            resolve(0)
                        }
                    }
                })
    
            }else{
                db.query('SELECT opportunity_amount FROM tf_leads WHERE l_id = ?', [leadid], function (error, rows) {
                    if (error) {
                        resolve(0)
                    } else {
                        if (rows.length > 0) {
                            if(rows[0].opportunity_amount||rows[0].opportunity_amount!=''){
                                var opportunity_amount = Number(rows[0].opportunity_amount)+Number(amount);
                            }else{
                                var opportunity_amount = Number(amount)
                            }
                            db.query('Update `tf_leads` set opportunity_amount='+opportunity_amount+' WHERE l_id = ?', [leadid], async function (error, rows) {
                                if (error) {
                                    resolve(0)
                                } else {
                                    resolve(1)
                                }
                            })
                        } else {
                            resolve(0)
                        }
                    }
                })
            }
            
        })
    },
    get_leadby_contacs:function(data,callback){
        return db.query("SELECT * FROM `tf_contacts` WHERE `customer_id` = "+data.account_id+" AND `mobile` LIKE '"+data.mobile+"' AND lead_id ="+data.lead_id,callback)
    },

    update_leadyby_contacts: function (data, callback) {
        return db.query('UPDATE `tf_contacts` SET ? WHERE `cont_id`="' + data.cont_id + '"', data, callback);
    },
    getissuetype:function(id,callback){
        return db.query("SELECT * FROM `tf_issue_type` where account_id= "+id,callback)
    },    
    getmanagers:function(id,callback){
        return db.query("SELECT * FROM `tf_account_table` where account_type=2 and is_deleted='no' ORDER BY account_name ASC",callback)
    },
    addtickettimeline: function (data, callback) {
        return db.query('Insert INTO tf_ticket_timeline SET ?', data, callback);
    },
    searchleaddata_isdeleted: async function (data, callback) {
        if (data.role == 1) {
            return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [data.userid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    row = results[0]
                    var where = " where l.agent_id=" + data.userid + "  and l.is_sync = 'yes' and l.is_deleted = 'yes'";

                    if (data.startdate != '1970-01-01') {
                        where += " and DATE(l.creation)>='" + data.startdate + "'";
                    }

                    if (data.enddate != '1970-01-01' ) {
                        where += " and DATE(l.creation)<='" + data.enddate + "'";
                    }

                    if (data.modifiedstartdate != '1970-01-01') {
                        where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
                    }

                    if (data.modifiedenddate != '1970-01-01') {
                        where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
                    }


                    if (data.status != '' && data.status != null) {
                        where += " and l.status IN (" + data.status + ")";
                    }

                    if (data.lead_name != '' && data.lead_name != null) {
                        where += " and l.lead_name like '%" + data.lead_name + "%'";
                    }
                    if (data.ads_name != '' && data.ads_name != null) {
                        where += " and l.ads_name IN (" + data.ads_name + ")";
                    }
                    if (data.source != '' && data.source != null) {
                        where += " and l.source IN (" + data.source + ")";
                    }

                    if (data.mobileno != '' && data.mobileno != null) {
                        where += " and l.mobile_no ='" + data.mobileno + "'";
                    }

                    if (data.tag_id != '') {
                        where += " and l.tag_id IN (" + data.tag_id + ")";
                    }
                    var account_id = data.account_id
                    if (row.show_no_id == 1) {
                        return db.query('SELECT l.*,a.show_no_id,C.cont_id as mobileno,a.whatsup_access,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where + ' ORDER BY l.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + ' ', callback);
                    } else {
                        console.log('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,a.whatsup_access,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '')
                        return db.query('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,a.whatsup_access,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '', callback);
                    }
                }
            })

        } else {
            var where = " where l.User_id=" + data.userid + "  and l.is_sync = 'yes' and l.is_deleted = 'yes'";

            if (data.agent != '') {
                where += " and l.agent_id IN (" + data.agent + ")";
            }

            if (data.startdate != '1970-01-01' ) {
                where += " and DATE(l.creation)>='" + data.startdate + "'";
            }

            if (data.enddate != '1970-01-01' ) {
                where += " and DATE(l.creation)<='" + data.enddate + "'";
            }

            if (data.modifiedstartdate != '1970-01-01') {
                where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
            }

            if (data.modifiedenddate != '1970-01-01') {
                where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
            }

            if (data.status != '' && data.status != null) {
                where += " and l.status IN (" + data.status + ")";
            }

            if (data.lead_name != '' && data.lead_name != null) {
                where += " and l.lead_name like '%" + data.lead_name + "%'";
            }
            if (data.ads_name != '' && data.ads_name != null) {
                where += " and l.ads_name IN (" + data.ads_name + ")";
            }
            if (data.source != '' && data.source != null) {
                where += " and l.source IN (" + data.source + ")";
            }

            if (data.mobileno != '' && data.mobileno != null) {
                where += " and l.mobile_no ='" + data.mobileno + "'";
            }

            if (data.tag_id != '') {
                where += " and l.tag_id IN (" + data.tag_id + ")";
            }

            //console.log('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + data.userid + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '');
            return db.query('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + data.userid + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '', callback);
        }
    },
    searchsupervisorleaddata_isdeleted: async function (data, callback) {
        return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [data.userid], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                row = results[0]
                var where = " where S.supervisor_account_id=" + data.userid + " and l.is_sync = 'yes' and l.is_deleted='yes'";

                if (data.startdate != '1970-01-01') {
                    where += " and DATE(l.creation)>='" + data.startdate + "'";
                }

                if (data.enddate != '1970-01-01') {
                    where += " and DATE(l.creation)<='" + data.enddate + "'";
                }

                if (data.modifiedstartdate != '1970-01-01') {
                    where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
                }

                if (data.modifiedenddate != '1970-01-01') {
                    where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
                }


                if (data.status != '' && data.status != null) {
                    where += " and l.status IN (" + data.status + ")";
                }

                if (data.lead_name != '' && data.lead_name != null) {
                    where += " and l.lead_name like '%" + data.lead_name + "%'";
                }

                if (data.ads_name != '' && data.ads_name != null) {
                    where += " and l.ads_name IN (" + data.ads_name + ")";
                }
                if (data.source != '' && data.source != null) {
                    where += " and l.source IN (" + data.source + ")";
                }
                if (data.mobileno != '' && data.mobileno != null) {
                    where += " and l.mobile_no ='" + data.mobileno + "'";
                }
                if (data.tag_id != '') {
                    where += " and l.tag_id IN (" + data.tag_id + ")";
                }
                var account_id = data.account_id
                if (row.show_no_id == 1) {
                    //console.log('SELECT l.*,a.show_no_id,C.cont_id as mobileno,a.whatsup_access,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where + ' ORDER BY l.creation DESC ');
                    return db.query('SELECT l.*,a.show_no_id,C.cont_id as mobileno,a.whatsup_access,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where + ' ORDER BY l.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '', callback);
                } else {
                    //console.log('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,a.whatsup_access,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id  LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id ' + where + ' ORDER BY l.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '');
                    return db.query('SELECT l.*,a.show_no_id,a.account_name as agent,l.mobile_no as mobileno,a.whatsup_access,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id  LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id ' + where + ' ORDER BY l.' + data.sortcolumn + ' ' + data.sortdirection + ' LIMIT ' + data.position + ',' + data.pageSize + '', callback);
                }
            }
        })
    },
    getleaddatalength_isdeleted: async function (data, callback) {
        if (data.role == 1) {
            return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [data.userid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    row = results[0]
                    var where = " where l.agent_id=" + data.userid + " and l.is_sync = 'yes' and l.is_deleted = 'yes'";

                    if (data.startdate) {
                        where += " and DATE(l.creation)>='" + data.startdate + "'";
                    }

                    if (data.enddate) {
                        where += " and DATE(l.creation)<='" + data.enddate + "'";
                    }

                    if (data.modifiedstartdate != '1970-01-01') {
                        where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
                    }

                    if (data.modifiedenddate != '1970-01-01') {
                        where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
                    }


                    if (data.status != '' && data.status != null) {
                        where += " and l.status IN (" + data.status + ")";
                    }

                    if (data.lead_name != '' && data.lead_name != null) {
                        where += " and l.lead_name like '%" + data.lead_name + "%'";
                    }
                    if (data.ads_name != '' && data.ads_name != null) {
                        where += " and l.ads_name IN (" + data.ads_name + ")";
                    }

                    if (data.source != '' && data.source != null) {
                        where += " and l.source IN (" + data.source + ")";
                    }

                    if (data.mobileno != '' && data.mobileno != null) {
                        where += " and l.mobile_no ='" + data.mobileno + "'";
                    }

                    if (data.tag_id != '') {
                        where += " and l.tag_id IN (" + data.tag_id + ")";
                    }
                    var account_id = data.account_id
                    if (row.show_no_id == 1) {
                        return db.query('SELECT COUNT(l.l_id) AS totallead FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where, callback);
                    } else {
                        console.log('SELECT COUNT(l.l_id) AS totallead FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where);
                        return db.query('SELECT COUNT(l.l_id) AS totallead FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where, callback);
                    }
                }
            })

        } else {
            var where = " where l.User_id=" + data.userid + "  and l.is_sync = 'yes' and l.is_deleted = 'yes'";

            if (data.agent != '') {
                where += " and l.agent_id IN (" + data.agent + ")";
            }

            if (data.startdate != '1970-01-01') {
                where += " and DATE(l.creation)>='" + data.startdate + "'";
            }

            if (data.enddate != '1970-01-01') {
                where += " and DATE(l.creation)<='" + data.enddate + "'";
            }

            if (data.modifiedstartdate != '1970-01-01') {
                where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
            }

            if (data.modifiedenddate != '1970-01-01') {
                where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
            }

            if (data.status != '' && data.status != null) {
                where += " and l.status IN (" + data.status + ")";
            }

            if (data.lead_name != '' && data.lead_name != null) {
                where += " and l.lead_name like '%" + data.lead_name + "%'";
            }
            if (data.ads_name != '' && data.ads_name != null) {
                where += " and l.ads_name IN (" + data.ads_name + ")";
            }

            if (data.source != '' && data.source != null) {
                where += " and l.source IN (" + data.source + ")";
            }

            if (data.mobileno != '' && data.mobileno != null) {
                where += " and l.mobile_no ='" + data.mobileno + "'";
            }
            if (data.tag_id != '') {
                where += " and l.tag_id IN (" + data.tag_id + ")";
            }
            // console.log('SELECT COUNT(l.l_id) AS totallead FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where );
            return db.query('SELECT COUNT(l.l_id) AS totallead FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where, callback);
        }
    },
    getsupervisorleaddatalength_isdeleted: async function (data, callback) {
        return db.query('SELECT show_no_id FROM tf_account_table where account_id=?', [data.userid], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                row = results[0]
                var where = " where S.supervisor_account_id=" + data.userid + " and l.is_sync = 'yes' and l.is_deleted='yes'";

                if (data.startdate != '1970-01-01') {
                    where += " and DATE(l.creation)>='" + data.startdate + "'";
                }

                if (data.enddate != '1970-01-01') {
                    where += " and DATE(l.creation)<='" + data.enddate + "'";
                }

                if (data.modifiedstartdate != '1970-01-01') {
                    where += " and DATE(l.modified)>='" + data.modifiedstartdate + "'";
                }

                if (data.modifiedenddate != '1970-01-01') {
                    where += " and DATE(l.modified)<='" + data.modifiedenddate + "'";
                }


                if (data.status != '' && data.status != null) {
                    where += " and l.status IN (" + data.status + ")";
                }

                if (data.lead_name != '' && data.lead_name != null) {
                    where += " and l.lead_name like '%" + data.lead_name + "%'";
                }

                if (data.ads_name != '' && data.ads_name != null) {
                    where += " and l.ads_name IN (" + data.ads_name + ")";
                }
                if (data.source != '' && data.source != null) {
                    where += " and l.source IN (" + data.source + ")";
                }
                if (data.mobileno != '' && data.mobileno != null) {
                    where += " and l.mobile_no ='" + data.mobileno + "'";
                }
                if (data.tag_id != '') {
                    where += " and l.tag_id IN (" + data.tag_id + ")";
                }
                var account_id = data.account_id
                if (row.show_no_id == 1) {
                    //console.log('SELECT l.*,a.show_no_id,C.cont_id as mobileno,a.whatsup_access,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + account_id + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where + ' ORDER BY l.creation DESC ');
                    return db.query('SELECT COUNT(l.l_id) AS totallead FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id LEFT JOIN tf_contacts C ON C.lead_id=l.l_id ' + where, callback);
                } else {
                    //console.log('SELECT COUNT(l.l_id) AS totallead FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id  LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id ' + where);
                    return db.query('SELECT COUNT(l.l_id) AS totallead FROM `tf_leads` l LEFT JOIN tf_supervisor_agents S ON S.AgentID=l.agent_id  LEFT JOIN `tf_account_table` a ON S.AgentID = a.account_id ' + where, callback);
                }
            }
        })

    },
    deleteleadsrestore: function (id, callback) {
        db.query('UPDATE tf_leads set is_deleted="no" where l_id=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);

            }
        })
    },
    delete_campagin_data: function (id, callback) {
        db.query('DELETE FROM tf_campaigns_numbers WHERE  cam_id=? AND STATUS=0', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);

            }
        })
    },
    getassignedsupervisoragents: function (id, callback) {
        return db.query('SELECT A.account_name ,A.account_id from tf_supervisor_agents as D inner join tf_account_table as A on D.AgentID=A.account_id where A.current_status="0" and  A.is_deleted="no" and  D.supervisor_account_id=' + id , [], callback);
    },
    getallleadsource: function (id, callback) {
        //console.log("SELECT DISTINCT(source) AS name FROM tf_leads WHERE User_id="+id+" AND is_deleted='no' AND source IS NOT NULL AND source !=''");
        //old return db.query("SELECT DISTINCT(source) AS name FROM tf_leads WHERE User_id="+id+" AND is_deleted='no' AND source IS NOT NULL AND source !='' ORDER BY source ASC" , [], callback);
        return db.query("SELECT DISTINCT(name) FROM (SELECT DISTINCT(source) AS NAME FROM tf_leads WHERE User_id="+id+" AND is_deleted='no' AND source IS NOT NULL AND source !='' UNION ALL SELECT NAME FROM tf_source_master WHERE customer_id="+id+")U ORDER BY name",callback)
    },
    savedholeracompany: function (data, callback) {
        db.query('select * from tf_dholera_company where id=?', [data.id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                if (results.length > 0) {                   
                    return db.query('update tf_dholera_company set ? WHERE id = ?', [data, data.id], callback);                        
                } else {
                    return db.query('Insert INTO tf_dholera_company SET ?', data, callback);
                }
            }
        })
    },
    savedholeracompanyproject: function (data, callback) {
        db.query('select * from tf_dholera_company_project where id=?', [data.id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                if (results.length > 0) {                   
                    return db.query('update tf_dholera_company_project set ? WHERE id = ?', [data, data.id], callback);                        
                } else {
                    return db.query('Insert INTO tf_dholera_company_project SET ?', data, callback);
                }
            }
        })
    },
    savedholeradealers: function (data, callback) {
        db.query('select * from tf_dholera_dealer where id=?', [data.id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                if (results.length > 0) {                   
                    return db.query('update tf_dholera_dealer set ? WHERE id = ?', [data, data.id], callback);                        
                } else {
                    return db.query('Insert INTO tf_dholera_dealer SET ?', data, callback);
                }
            }
        })
    },
    savedholeraleadgenerator: function (data, callback) {
        db.query('select * from tf_dholera_leadgenerator where id=?', [data.id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                if (results.length > 0) {                   
                    return db.query('update tf_dholera_leadgenerator set ? WHERE id = ?', [data, data.id], callback);                        
                } else {
                    return db.query('Insert INTO tf_dholera_leadgenerator SET ?', data, callback);
                }
            }
        })
    },
    getticketlaststatus:function(id,callback){
        return db.query("SELECT * FROM `tf_ticket_timeline` where ticket_id="+id+" ORDER BY t_id DESC LIMIT 1",callback)
    },
    check_password_manager:function(id,callback){
        return db.query("Select * from tf_account_table where account_id ="+id,callback)
    },
    update_deleted_lead_bulk:function(id,callback){
        return db.query("Update `tf_leads` SET `is_deleted`='yes' where l_id ="+id,callback)
    },
    getdholeracompany: function (data, callback) {
        return db.query('select * from tf_dholera_company', [], callback)
    },
}

module.exports = Erp;