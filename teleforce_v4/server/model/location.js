var db = require('../database/db');

var Location = {
    saveagentlocation:function (data, callback) {
        return db.query('Insert INTO tf_agent_location SET ?', data, callback);
    },
    getagentlocation:function (data, callback) {
       // console.log('SELECT * FROM  tf_agent_location WHERE agent_id='+data.agent_id+' and latitude="'+data.latitude+'" and longitude="'+data.longitude+'" order by location_id desc limit 1');
        return db.query('SELECT * FROM  tf_agent_location WHERE agent_id='+data.agent_id+' order by location_id desc limit 1', [], callback);
    },
    updateagentlocation: function (data, callback) {
        return db.query('update tf_agent_location set ? WHERE location_id = ?', [data, data.location_id], callback);
    },
    getallagentlocation:function (id,date, callback) {
        //console.log('SELECT L.* FROM  tf_agent_location L inner join tf_account_table A on A.created_by=L.account_id WHERE (DATE(L.created_date)="'+date+'" OR DATE(L.last_modify_date)="'+date+'") and L.account_id='+id);
        return db.query('SELECT L.* FROM  tf_agent_location L inner join tf_account_table A on A.account_id=L.agent_id WHERE (DATE(L.created_date)="'+date+'" OR DATE(L.last_modify_date)="'+date+'") and L.account_id='+id, [], callback);
    },    
    searchagentlocation:function (data, callback) {
        var where ='account_id='+data.userid;
        if(data.date){
            where +=' and (DATE(created_date)="'+data.date+'" OR DATE(last_modify_date)="'+data.date+'")';
        }
        if(data.agentid){
            where +=' and agent_id='+data.agentid;
        }
        //console.log('SELECT * FROM  tf_agent_location WHERE '+where)
        return db.query('SELECT * FROM  tf_agent_location WHERE '+where, [], callback);
    },
    
}

module.exports = Location;