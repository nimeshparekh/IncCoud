var db = require('../database/db');

var Segments = {
	createcontact: function (Contacts, callback) { 
        return db.query('Insert INTO tf_segments SET ?',Contacts, callback);
     },
     getContact: function (cid, callback) {
        // console.log('Select * from tf_segments where customer_id='+cid+' and is_deleted ="no" ORDER by created_date DESC'); 
         return db.query('Select * from tf_segments where customer_id=? and is_deleted ="no" ORDER by created_date DESC',cid, callback);
     },
    getsupervisorsegments: function (cid, callback) { 
        return db.query('Select * from tf_segments where created_by=? and is_deleted ="no" ORDER by created_date DESC',cid, callback);
    },
     deleteContact: function (cont_id, callback) { 
         return db.query('DELETE FROM `tf_segments` WHERE `tf_segments`.`cont_id`=?',cont_id, callback);
     },
     getContactDetail: function (cid, callback) { 
         return db.query('Select * from tf_segments where cont_id=?',cid, callback);
     },
     updateCategory: function (Contacts,cont_id, callback) { 
         return db.query('UPDATE `tf_segments` SET ? WHERE `tf_segments`.`cont_id`="'+cont_id+'"',Contacts, callback);
      }, 
      deletesegemntreq: function (id, callback) {
        db.query('UPDATE tf_segments set is_deleted="yes" where 	cont_id=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                callback(err, results);

            }
        })
    },
    getsupervisorallsegments: function (cid, callback) { 
        return db.query('Select * from tf_segments where created_by=? and is_deleted ="no" ORDER by name ASC',cid, callback);
    },
}


module.exports = Segments;