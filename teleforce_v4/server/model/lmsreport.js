var db = require('../database/db');
var Lmsreport = {
    getleadsourcereport: async function (data, callback) {
        /*if(data.role == 1){
            var where = " where l.agent_id="+data.userid+" and is_sync = 'yes'";
            
            if (data.startdate != '1970-01-01') {
                where += " and DATE(creation)>='" + data.startdate + "'";
            }

            if (data.enddate != '1970-01-01') {
                where += " and DATE(creation)<='" + data.enddate + "'";
            }
            
            if(data.status != '' && data.status != null){
                where += " and l.status ='"+data.status+"'";
            }

            if(data.lead_name != '' && data.lead_name != null){
                where += " and l.lead_name like '%"+data.lead_name+"%'";
            }

            if(data.source != '' && data.source != null){
                where += " and l.source ='"+data.source+"'";
            }

            if(data.mobileno != '' && data.mobileno != null){
                where += " and l.mobile_no ='"+data.mobileno+"'";
            }
            var account_id = data.account_id
            return db.query('SELECT l.*,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = '+account_id+' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id '+where+' ORDER BY l.creation DESC ', callback);
        }else{*/
        var where = " where l.User_id=" + data.userid + " and is_sync = 'yes' and l.source IS NOT NULL";

        if (data.agent > 0) {
            where += " and l.agent_id =" + data.agent;
        }

        if (data.startdate != '1970-01-01') {
            where += " and DATE(creation)>='" + data.startdate + "'";
        }

        if (data.enddate != '1970-01-01') {
            where += " and DATE(creation)<='" + data.enddate + "'";
        }

        if (data.source != '' && data.source != null) {
            where += " and l.source ='" + data.source + "'";
        }
        console.log('SELECT l.*,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + data.userid + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.creation DESC ');
        return db.query('SELECT l.*,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + data.userid + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.creation DESC ', callback);
        //}

    },
    getuntouchleadreport: async function (data, callback) {
        var where = " where l.User_id=" + data.userid + " and is_sync = 'yes'";

        if (data.agent > 0) {
            where += " and l.agent_id =" + data.agent;
        }
        if (data.date != '1970-01-01') {
            where += " and DATE(modified)<='" + data.date + "'";
        }
        if(data.status != '' && data.status != null){
            where += " and l.status ='"+data.status+"'";
        }
        //console.log('SELECT l.*,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + data.userid + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.creation DESC ');
        return db.query('SELECT l.*,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + data.userid + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.creation DESC ', callback);
    },
    getleadstagereport: async function (data, callback) {
        var where = " where L.User_id=" + data.userid + " and L.is_sync = 'yes' AND S.User_id="+data.userid;

        if (data.agent > 0) {
            where += " and L.agent_id =" + data.agent;
        }
        if (data.startdate != '1970-01-01') {
            where += " and DATE(L.creation)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(L.creation)<='" + data.enddate + "'";
        }
        if(data.stage != '' && data.stage != null){
            where += " and SS.stage_id ="+data.stage;
        }
       // console.log('SELECT L.*,A.account_name as agent,SS.stage_status as newstatus,S.stage_name as stage FROM `tf_leads` L LEFT JOIN tf_lead_stage_status SS ON SS.status_master=L.status INNER JOIN tf_lead_stage S ON S.s_id=SS.stage_id LEFT JOIN `tf_account_table` A ON L.agent_id = A.account_id  ' + where + ' GROUP BY L.l_id ORDER BY L.creation DESC ');
        return db.query('SELECT L.*,A.account_name as agent,SS.stage_status as newstatus,S.stage_name as stage FROM `tf_leads` L LEFT JOIN tf_lead_stage_status SS ON SS.status_master=L.status INNER JOIN tf_lead_stage S ON S.s_id=SS.stage_id LEFT JOIN `tf_account_table` A ON L.agent_id = A.account_id  ' + where + ' GROUP BY L.l_id ORDER BY L.creation DESC ', callback);        

    },
    getleadopportunityamountreport: async function (data, callback) {
        var where = " where l.User_id=" + data.userid + " and l.is_sync = 'yes' and l.opportunity_amount>0";

        if (data.agent > 0) {
            where += " and l.agent_id =" + data.agent;
        }
        if (data.startdate != '1970-01-01') {
            where += " and DATE(l.creation)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(l.creation)<='" + data.enddate + "'";
        }
        //console.log('SELECT l.*,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + data.userid + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.creation DESC ');
        return db.query('SELECT l.*,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + data.userid + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.creation DESC ', callback);
    },
    getleadbystagereport: async function (data, callback) {
        var where = " where L.User_id=" + data.userid + " and L.is_sync = 'yes' and S.User_id="+data.userid;

        if (data.agent > 0) {
            where += " and L.agent_id =" + data.agent;
        }
        if (data.startdate != '1970-01-01') {
            where += " and DATE(L.creation)>='" + data.startdate + "'";
        }
        if (data.enddate != '1970-01-01') {
            where += " and DATE(L.creation)<='" + data.enddate + "'";
        }
        if(data.stage != '' && data.stage != null){
            where += " and SS.stage_id ="+data.stage;
        }
        //console.log('SELECT COUNT(L.l_id) as count,S.stage_name,S.color_id as stage_color,S.s_id FROM `tf_leads` L LEFT JOIN tf_lead_stage_status SS ON SS.status_master=L.status INNER JOIN tf_lead_stage S ON S.s_id=SS.stage_id LEFT JOIN `tf_account_table` A ON L.agent_id = A.account_id  ' + where + ' GROUP BY S.s_id   ORDER BY S.stage_name ASC ');
        return db.query('SELECT COUNT(L.l_id) as count,S.stage_name,S.color_id as stage_color,S.s_id FROM `tf_leads` L LEFT JOIN tf_lead_stage_status SS ON SS.status_master=L.status INNER JOIN tf_lead_stage S ON S.s_id=SS.stage_id LEFT JOIN `tf_account_table` A ON L.agent_id = A.account_id  ' + where + ' GROUP BY S.s_id   ORDER BY S.stage_name ASC ', callback);  
    },
    getleadtimelinereport: async function (data, callback) {
        var where = " where L.User_id=" + data.userid + " and L.is_sync = 'yes' ";
        var c_where = "";
        var w_where = "";
        var s_where = "";

        if (data.agent > 0) {
            where += " and L.agent_id =" + data.agent;
        }
        if (data.startdate != '1970-01-01' && data.enddate != '1970-01-01') {
            where += ' and (DATE(L.creation) BETWEEN "'+ data.startdate +'" AND "'+ data.enddate +'")';
            c_where += ' and (DATE(CD.CallStartTime) BETWEEN "'+ data.startdate +'" AND "'+ data.enddate +'")';
            w_where += ' and (DATE(create_time) BETWEEN "'+ data.startdate +'" AND "'+ data.enddate +'")';
            s_where += ' and (DATE(created_time) BETWEEN "'+ data.startdate +'" AND "'+ data.enddate +'")';
            
        }
       // console.log('SELECT L.l_id,L.lead_name,L.creation,A.account_name as agent,(SELECT COUNT(CD.id) FROM tf_contacts C INNER JOIN tf_cdr CD ON C.cont_id=CD.cont_id WHERE C.lead_id =L.l_id '+c_where+') AS callscount ,(SELECT COUNT(w_id) FROM tf_erp_whatsapp  WHERE  account_id=A.account_id AND lead_id =L.l_id '+w_where+') AS wtsupcount,(SELECT COUNT(t_id) FROM `tf_lead_timeline` WHERE lead_id = L.l_id '+s_where+') AS statuscount FROM `tf_leads` L LEFT JOIN tf_account_table A ON A.account_id=L.agent_id   '+where+' order by L.l_id desc');
        return db.query('SELECT L.l_id,L.lead_name,L.creation,A.account_name as agent,(SELECT COUNT(CD.id) FROM tf_contacts C INNER JOIN tf_cdr CD ON C.cont_id=CD.cont_id WHERE C.lead_id =L.l_id '+c_where+') AS callscount ,(SELECT COUNT(w_id) FROM tf_erp_whatsapp  WHERE  account_id=A.account_id AND lead_id =L.l_id '+w_where+') AS wtsupcount,(SELECT COUNT(t_id) FROM `tf_lead_timeline` WHERE lead_id = L.l_id '+s_where+') AS statuscount FROM `tf_leads` L LEFT JOIN tf_account_table A ON A.account_id=L.agent_id   '+where+' order by L.l_id desc', callback);  
    },

    get_supervisiore_Lead_Timeline_Report: async function (data, callback) {
       
        return db.query("SELECT L.l_id,L.lead_name,L.creation,A.account_name AS agent,(SELECT COUNT(CD.id) FROM tf_contacts C INNER JOIN tf_cdr CD ON C.cont_id=CD.cont_id WHERE C.lead_id =L.l_id  AND CD.CallStartTime BETWEEN CONCAT('"+data.startdate+"',' 00:00:00') AND CONCAT('"+data.enddate+"',' 23:59:59')) AS callscount ,(SELECT COUNT(w_id) FROM tf_erp_whatsapp  WHERE  account_id=A.account_id AND lead_id =L.l_id  AND create_time BETWEEN CONCAT('"+data.startdate+"',' 00:00:00') AND CONCAT('"+data.enddate+"',' 23:59:59')) AS wtsupcount,(SELECT COUNT(t_id) FROM `tf_lead_timeline` WHERE lead_id = L.l_id  AND created_time BETWEEN CONCAT('"+data.startdate+"',' 00:00:00') AND CONCAT('"+data.enddate+"',' 23:59:59')) AS statuscount FROM `tf_leads` L LEFT JOIN tf_account_table A ON A.account_id=L.agent_id    WHERE L.agent_id IN(SELECT agentid FROM tf_supervisor_agents WHERE supervisor_account_id="+data.userid+" AND agentid IS NOT NULL AND agentid!='' AND agentid!=0) AND L.is_sync = 'yes'  AND L.creation BETWEEN CONCAT('"+data.startdate+"',' 00:00:00') AND CONCAT('"+data.enddate+"',' 23:59:59') ORDER BY L.l_id DESC", callback);  
    },
    get_supervisor_lead_opportunity_amount_report:function(data,callback){
        return db.query("SELECT l.*,a.account_name AS agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id IN(SELECT userid FROM tf_supervisor_agents WHERE supervisor_account_id="+data.userid+") AND CD.status_master = l.status) AS newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id  WHERE l.agent_id IN(SELECT agentid FROM tf_supervisor_agents WHERE supervisor_account_id="+data.userid+" AND agentid IS NOT NULL AND agentid!='' AND agentid!=0) AND l.is_sync = 'yes' AND l.opportunity_amount>0 AND DATE(l.creation)>='"+data.startdate+"' AND DATE(l.creation)<='"+data.enddate+"' ORDER BY l.creation DESC",callback)
    },
    get_supervisoir_leadstagereport: async function (data, callback) {
        var where = " supervisor_account_id="+data.userid+" AND agentid IS NOT NULL AND agentid!='' AND agentid!=0) AND L.is_sync = 'yes' AND S.User_id IN(SELECT userid FROM tf_supervisor_agents WHERE supervisor_account_id="+data.userid+")" ;

        // if (data.agent > 0) {
        //     where += " and  L.agent_id  =" + data.agent;
        // }
        if (data.startdate != '1970-01-01') {
            where += " AND L.creation BETWEEN CONCAT('"+data.startdate+"',' 00:00:00') ";
        }
        if (data.enddate != '1970-01-01') {
            where += " AND CONCAT('"+data.enddate+"',' 23:59:59') ";
        }
        if(data.stage != '' && data.stage != null){
            where += " AND S.s_id="+data.stage;
        }
        return db.query("SELECT L.creation,A.account_name as agent,L.mobile_no,L.lead_name,L.email_id,L.source,L.status as newstatus,S.stage_name AS stage FROM `tf_leads` L LEFT JOIN tf_lead_stage_status SS ON SS.status_master=L.status LEFT JOIN tf_lead_stage S ON S.s_id=SS.stage_id LEFT JOIN `tf_account_table` A ON L.agent_id = A.account_id  WHERE L.agent_id IN(SELECT agentid FROM tf_supervisor_agents WHERE "+where +" GROUP BY L.l_id ORDER BY L.creation DESC", callback);        

    },
    get_supervisior_lead_by_stage_report: async function (data, callback) {
        var where = " supervisor_account_id="+data.userid+" AND agentid IS NOT NULL AND agentid!='' AND agentid!=0) AND L.is_sync = 'yes' AND S.User_id IN(SELECT userid FROM tf_supervisor_agents WHERE supervisor_account_id="+data.userid+")" ;

        // if (data.agent > 0) {
        //     where += " and  L.agent_id  =" + data.agent;
        // }
        if (data.startdate != '1970-01-01') {
            where += " AND L.creation BETWEEN CONCAT('"+data.startdate+"',' 00:00:00') ";
        }
        if (data.enddate != '1970-01-01') {
            where += " AND CONCAT('"+data.enddate+"',' 23:59:59') ";
        }
        if(data.stage != '' && data.stage != null){
            where += " AND S.s_id="+data.stage;
        }
        return db.query("SELECT COUNT(L.l_id) AS count,S.stage_name,S.color_id AS stage_color,S.s_id FROM `tf_leads` L LEFT JOIN tf_lead_stage_status SS ON SS.status_master=L.status INNER JOIN tf_lead_stage S ON S.s_id=SS.stage_id LEFT JOIN `tf_account_table` A ON L.agent_id = A.account_id WHERE L.agent_id IN(SELECT agentid FROM tf_supervisor_agents WHERE supervisor_account_id="+data.userid+" AND agentid IS NOT NULL AND agentid!='' AND agentid!=0) AND L.is_sync = 'yes' AND S.User_id IN(SELECT userid FROM tf_supervisor_agents WHERE "+where+" GROUP BY S.s_id ORDER BY S.stage_name ASC", callback);  
    },
    get_supervisior_UntouchLeadReport: async function (data, callback) {
        console.log(data);
        var where = " C.User_id = "+data.userid+" AND CD.status_master = l.status) AS newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id  WHERE l.agent_id IN(SELECT agentid FROM tf_supervisor_agents WHERE supervisor_account_id="+data.userid+" AND agentid IS NOT NULL AND agentid!='' AND agentid!=0) AND is_sync = 'yes'";

      
        if (data.date != '1970-01-01') {
            where += " AND modified BETWEEN CONCAT('"+data.date+"',' 00:00:00') AND CONCAT('"+data.date+"',' 23:59:59') ";
        }
        if(data.status != '' && data.status != null){
            where += " AND l.status ='"+data.status+"'";
        }
        //console.log('SELECT l.*,a.account_name as agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE C.User_id = ' + data.userid + ' AND CD.status_master = l.status) as newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id ' + where + ' ORDER BY l.creation DESC ');
        return db.query("SELECT l.*,a.account_name AS agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE "+where+" ORDER BY l.creation DESC", callback);
    },
    get_supervisior_LeadSourceReport:function(data,callback){
        var where = "  C.User_id = "+data.userid+" AND CD.status_master = l.status) AS newstatus FROM `tf_leads` l LEFT JOIN `tf_account_table` a ON l.agent_id = a.account_id  WHERE l.agent_id IN(SELECT agentid FROM tf_supervisor_agents WHERE supervisor_account_id="+data.userid+" AND agentid IS NOT NULL AND agentid!='' AND agentid!=0) AND is_sync = 'yes' AND l.source IS NOT NULL";

      

        if (data.startdate != '1970-01-01') {
            where += " AND creation BETWEEN CONCAT('"+data.startdate+"',' 00:00:00') ";
        }

        if (data.enddate != '1970-01-01') {
            where += " AND CONCAT('"+data.enddate+"',' 23:59:59')";
        }

        if (data.source != '' && data.source != null) {
            where += " AND l.source ='" + data.source + "'";
        }
        return db.query("SELECT l.*,a.account_name AS agent,(SELECT CD.stage_status FROM tf_lead_stage C RIGHT JOIN tf_lead_stage_status CD ON C.s_id=CD.stage_id WHERE "+where+"  ORDER BY l.creation DESC;", callback);
       
    },
    stage_leads_converts_the_most:function(data,callback){
        return db.query("SELECT DISTINCT(c.stage_name) AS STAGE_NAME,COUNT(z.lead_id) CONVERTED_LEADS FROM        (SELECT a.user_id AS user_id,a.s_id AS stage_id,a.stage_name AS stage_name,b.status_master AS status_master FROM tf_lead_stage a LEFT JOIN tf_lead_stage_status b ON a.s_id=b.stage_id WHERE a.user_id="+data.userid+" AND b.status_master NOT IN('CloseWon','Converted') ORDER BY a.s_id)c   LEFT JOIN tf_lead_timeline z ON c.status_master=z.previous_status  AND z.account_id="+data.userid+" AND z.current_status IN('converted','closewon')GROUP BY c.stage_name",callback)
        //return db.query("SELECT DISTINCT(c.stage_name) AS STAGE_NAME,COUNT(z.lead_id) CONVERTED_LEADS FROM (SELECT a.user_id AS user_id,a.s_id AS stage_id,a.stage_name AS stage_name,b.status_master AS status_master FROM tf_lead_stage a LEFT JOIN tf_lead_stage_status b ON a.s_id=b.stage_id WHERE a.user_id="+data.userid+" ORDER BY a.s_id)c LEFT JOIN tf_lead_timeline z ON c.status_master=z.previous_status AND z.account_id="+data.userid+" AND z.current_status IN('converted','closewon')GROUP BY c.stage_name",callback);
    },
    stage_wise_drop_off:function(data,callback){
        return db.query("SELECT DISTINCT(c.stage_name) AS STAGE_NAME,COUNT(z.lead_id) AS LEADS_LOST FROM (SELECT a.user_id AS user_id,a.s_id AS stage_id,a.stage_name AS stage_name,b.status_master AS status_master FROM tf_lead_stage a LEFT JOIN tf_lead_stage_status b ON a.s_id=b.stage_id WHERE a.user_id="+data.userid+" AND a.stage_name!='Closed Lost' ORDER BY a.s_id)c LEFT JOIN tf_lead_timeline z ON c.status_master=z.previous_status  AND z.account_id="+data.userid+" AND z.current_status IN('Junk Lead','Lost','Not Interested','Do Not Contact') GROUP BY c.stage_name",callback);
      //  return db.query("SELECT DISTINCT(c.stage_name) AS STAGE_NAME,COUNT(z.lead_id) AS LEADS_LOST FROM(SELECT a.user_id AS user_id,a.s_id AS stage_id,a.stage_name AS stage_name,b.status_master AS status_master  FROM tf_lead_stage a LEFT JOIN tf_lead_stage_status b ON a.s_id=b.stage_id WHERE a.user_id="+data.userid+" ORDER BY a.s_id)c  LEFT JOIN tf_lead_timeline z ON c.status_master=z.previous_status  AND z.account_id="+data.userid+" AND z.current_status IN('Junk Lead','Lost','Not Interested','Do Not Contact')GROUP BY c.stage_name",callback)
    },
    get_ads_id:function(data,callback){
        return db.query("SELECT DISTINCT(a.ads_id) AS AD_ID,b.ads_name AS AD_NAME FROM td_ads_insights a LEFT JOIN td_ads b ON a.ads_id=b.ads_id WHERE a.access_customer_id="+data.userid,callback);
    },
    get_ads_cost_graph:function(data,callback){
        return db.query("SELECT ACCOUNT_ID,AD_ID,AD_NAME,AD_START_DATE,AD_STOP_DATE,TOTAL_LEADS,CONVERTED_LEADS,ROUND(SPEND),ROUND(IFNULL((SPEND/TOTAL_LEADS),0)) AS PER_LEAD_COST,ROUND(IFNULL((SPEND/CONVERTED_LEADS),0)) AS CONVERSION_COST FROM( SELECT DISTINCT(a.ads_id) AS AD_ID,IFNULL(b.ads_name,'NA') AS AD_NAME,access_customer_id AS ACCOUNT_ID,SUM(a.reach) AS REACH,(SELECT SUM(spend) FROM td_ads_insights WHERE ads_id='"+data.adsname+"')AS SPEND,MIN(a.date_start) AS AD_START_DATE,MAX(a.date_stop) AS AD_STOP_DATE,(SELECT COUNT(*) FROM tf_leads WHERE ads_id='"+data.adsname+"') AS TOTAL_LEADS,(SELECT COUNT(l_id) FROM tf_leads WHERE ads_id='"+data.adsname+"' AND STATUS IN('converted','closewon')) AS CONVERTED_LEADS FROM td_ads_insights a LEFT JOIN tf_leads b ON a.ads_id=b.ads_id WHERE a.ads_id='"+data.adsname+"' GROUP BY a.ads_id)U",callback)
        //return db.query("SELECT ACCOUNT_ID,AD_ID,AD_START_DATE,AD_STOP_DATE,TOTAL_LEADS,CONVERTED_LEADS,SPEND,IFNULL((SPEND/TOTAL_LEADS),0) AS PER_LEAD_COST,IFNULL((SPEND/CONVERTED_LEADS),0) AS CONVERSION_COST FROM(SELECT DISTINCT(a.ads_id) AS AD_ID,access_customer_id AS ACCOUNT_ID,SUM(a.reach) AS REACH,(SELECT SUM(spend) FROM td_ads_insights WHERE ads_id='"+data.adsname+"')AS SPEND,MIN(a.date_start) AS AD_START_DATE,MAX(a.date_stop) AS AD_STOP_DATE,(SELECT COUNT(*) FROM tf_leads WHERE ads_id='"+data.adsname+"') AS TOTAL_LEADS,(SELECT COUNT(l_id) FROM tf_leads WHERE ads_id='"+data.adsname+"' AND STATUS IN('converted','closewon')) AS CONVERTED_LEADS FROM td_ads_insights a LEFT JOIN tf_leads b ON a.ads_id=b.ads_id WHERE a.ads_id='"+data.adsname+"' GROUP BY a.ads_id)U",callback);
    },
    stage_wise_oppurtunity_amount:function(data,callback){
        return db.query("SELECT DISTINCT(c.stage_name) AS STAGE_NAME,IFNULL(SUM(z.opportunity_amount),0) AS OPPORTUNITY_AMOUNT FROM (SELECT a.user_id AS user_id,a.s_id AS stage_id,a.stage_name AS stage_name,b.status_master AS status_master FROM tf_lead_stage a LEFT JOIN tf_lead_stage_status b ON a.s_id=b.stage_id WHERE a.user_id="+data.userid+" ORDER BY a.s_id)c  LEFT JOIN tf_leads z ON c.status_master=z.status AND z.user_id="+data.userid+" AND(z.opportunity_amount REGEXP '^[0-9]+$') GROUP BY STAGE_NAME",callback);
    },
    get_adslist_by_agent:function(data,callback){
        return db.query("SELECT GROUP_CONCAT(DISTINCT(ads_id)) AS ads_id FROM td_ads_insights WHERE access_customer_id="+data.userid+" AND ads_id IN(SELECT DISTINCT ads_id FROM tf_leads WHERE ads_id IS NOT NULL AND ads_id!='' AND source='facebook' OR source LIKE '%website%' AND agent_id="+data.agentname+")",callback)
        // old return db.query("SELECT DISTINCT(ads_id) AS ads_id,IFNULL(IF(ads_name ='','NA',ads_name),'NA')AS ad_name FROM td_ads WHERE access_customer_id="+data.userid+" AND ads_id IN(SELECT DISTINCT ads_id FROM tf_leads WHERE ads_id IS NOT NULL AND ads_id!='' AND source='facebook' OR source LIKE '%website%' AND agent_id="+data.agentname+")",callback)
    },
    get_ads_roi_by_agent:function(data,callback){
        return db.query("SELECT AD_ID,AD_NAME,ROUND(SPEND) AS SPEND,ROUND(IFNULL((SPEND/TOTAL_LEADS),0)) AS PER_LEAD_COST,TOTAL_LEADS,TOTAL_LEADS_AGENT,(ROUND(IFNULL((SPEND/TOTAL_LEADS),0))*TOTAL_LEADS_AGENT) AS LEADS_COST_AGENT,CONVERTED_LEADS_AGENT,OPP_AMOUNT_TOTAL,Revenue FROM(SELECT DISTINCT(a.ads_id) AS AD_ID,IFNULL(b.ads_name,'NA') AS AD_NAME,(SELECT SUM(spend) FROM td_ads_insights WHERE ads_id='"+data.agent_adsname+"')AS SPEND,(SELECT COUNT(*) FROM tf_leads WHERE ads_id='"+data.agent_adsname+"') AS TOTAL_LEADS,(SELECT COUNT(*) FROM tf_leads WHERE ads_id='"+data.agent_adsname+"' AND agent_id="+data.agentname+") AS TOTAL_LEADS_AGENT,(SELECT COUNT(l_id) FROM tf_leads WHERE ads_id='"+data.agent_adsname+"' AND agent_id="+data.agentname+" AND STATUS IN('converted','closewon')) AS CONVERTED_LEADS_AGENT,(SELECT IFNULL(SUM(opportunity_amount),0) FROM tf_leads WHERE ads_id='"+data.agent_adsname+"' AND agent_id="+data.agentname+")  AS OPP_AMOUNT_TOTAL ,(SELECT IFNULL(SUM(opportunity_amount),0) FROM tf_leads WHERE ads_id='"+data.agent_adsname+"' AND agent_id="+data.agentname+" AND STATUS IN('converted','closewon'))  AS Revenue  FROM td_ads_insights a LEFT JOIN tf_leads b ON a.ads_id=b.ads_id WHERE a.ads_id='"+data.agent_adsname+"' GROUP BY a.ads_id)U",callback);
    },
    get_ads_new_roi_by_agent:function(data,callback){
      return db.query("SELECT SUM(SPEND) AS SPEND,SUM(TOTAL_LEADS) AS TOTAL_LEADS,SUM(PER_LEAD_COST) AS PER_LEAD_COST,SUM(TOTAL_LEADS_AGENT) AS TOTAL_LEADS_AGENT,SUM(CONVERTED_LEADS_AGENT) AS CONVERTED_LEADS_AGENT,SUM(LEADS_COST_AGENT) AS LEADS_COST_AGENT,SUM(OPP_AMOUNT_TOTAL) AS OPP_AMOUNT_TOTAL,SUM(REVENUE)AS REVENUE FROM (SELECT ADID,SPEND,COUNT(L.l_id) AS TOTAL_LEADS,ROUND(IFNULL((SPEND/COUNT(L.l_id)),0)) AS PER_LEAD_COST,COUNT(IF(L.agent_id="+data.agentname+",1,NULL)) AS TOTAL_LEADS_AGENT,COUNT(IF((L.agent_id= "+data.agentname+" AND STATUS IN('converted','closewon')),1,NULL)) AS CONVERTED_LEADS_AGENT,(ROUND(IFNULL((SPEND/COUNT(L.l_id)),0))*COUNT(IF(L.agent_id= "+data.agentname+",1,NULL))) AS LEADS_COST_AGENT , IFNULL(SUM(IF(agent_id = "+data.agentname+", L.opportunity_amount, 0)),0) AS OPP_AMOUNT_TOTAL,  IFNULL(SUM(IF((agent_id = "+data.agentname+" AND STATUS IN('converted','closewon')), L.opportunity_amount, 0)),0) AS REVENUE   FROM (SELECT DISTINCT(ads_id) AS ADID,SUM(spend) AS SPEND FROM td_ads_insights WHERE ads_id IN("+data.ads_id+") GROUP BY ads_id)U  LEFT JOIN tf_leads L ON U.ADID=L.ads_id GROUP BY ADID)K",callback);
        //old return db.query("SELECT ADID,SPEND,COUNT(L.l_id) AS TOTAL_LEADS,ROUND(IFNULL((SPEND/COUNT(L.l_id)),0)) AS PER_LEAD_COST,COUNT(IF(L.agent_id= "+data.userid+",1,NULL)) AS TOTAL_LEADS_AGENT,COUNT(IF((L.agent_id="+data.userid+" AND STATUS IN('converted','closewon')),1,NULL)) AS CONVERTED_LEADS_AGENT,(ROUND(IFNULL((SPEND/COUNT(L.l_id)),0))*COUNT(IF(L.agent_id= "+data.userid+" ,1,NULL))) AS LEADS_COST_AGENT , IFNULL(SUM(IF(agent_id = "+data.userid+", L.opportunity_amount, 0)),0) AS OPP_AMOUNT_TOTAL,  IFNULL(SUM(IF((agent_id = "+data.userid+" AND STATUS IN('converted','closewon')), L.opportunity_amount, 0)),0) AS REVENUE  FROM (SELECT DISTINCT(ads_id) AS ADID,SUM(spend) AS SPEND FROM td_ads_insights WHERE ads_id IN("+data.ads_id+") GROUP BY ads_id)U  LEFT JOIN tf_leads L ON U.ADID=L.ads_id GROUP BY ADID",callback);
 
    }
}

module.exports = Lmsreport;