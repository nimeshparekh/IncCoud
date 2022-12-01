var db = require('../database/db');

var Products = {
    getproducts: function (id, callback) {
        // return db.query('SELECT p.productid,p.product_name,p.product_desc,p.product_status,e.email_title as email_template,p.date,s.sms_title as sms_template,w.sms_title as whatsapp_template,p.unit,p.price,p.product_thumbnail from tf_products p left join tf_emailtemplate e ON p.email_template=e.email_id left join tf_smstemplate s ON p.sms_template=s.sms_id left join tf_smstemplate w ON p.whatsapp_template=w.sms_id where p.account_id= ?  ORDER by date DESC', [id], callback);
        return db.query('SELECT * FROM `tf_products` WHERE `User_id` = ? ORDER BY `product_name` DESC', [id], callback);

    },
    insertproduct: function (data, callback) {
        return db.query('Insert INTO tf_products SET ?', data, callback);
    },
    getProductDetail: function (cid, callback) {
        return db.query('Select * from tf_products where productid=?', cid, callback);
    },
    getProductEmailDetail: function (cid, callback) {
        return db.query('Select p.productid,p.email_template as templateid,p.product_name,p.product_desc,p.product_long_desc,e.email_html from tf_products p LEFT JOIN tf_emailtemplate e on p.email_template=e.email_id where p.productid=?', cid, callback);
    },
    getProductSMSDetail: function (cid, callback) {
        return db.query('Select p.productid,p.sms_template as templateid,p.product_name,p.product_desc,p.product_long_desc,e.sms_text,e.sms_title from tf_products p LEFT JOIN tf_smstemplate e on p.sms_template=e.sms_id where p.productid=?', cid, callback);
    },
    getProductWhatsappDetail: function (cid, callback) {
        return db.query('Select p.productid,p.whatsapp_template as templateid,p.product_name,p.product_desc,p.product_long_desc,e.sms_text,e.sms_title from tf_products p LEFT JOIN tf_smstemplate e on p.whatsapp_template=e.sms_id where p.productid=?', cid, callback);
    },
    updateproduct: function (data, callback) {
        return db.query('update tf_products set ? WHERE productid = ?', [data, data.productid], callback);
    },
    getagentproducts: function (id, callback) {
        return db.query('SELECT created_by FROM tf_account_table where account_id=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                var row = results[0]
                if (row.created_by > 0) {
                    return db.query('SELECT p.* FROM tf_products p WHERE product_status =1 and account_id=? order by productid desc LIMIT 20', [row.created_by], callback);
                } else {
                    //return db.query('SELECT p.* FROM tf_products p WHERE  product_status =1 order by productid desc LIMIT 20', callback);
                    return db.query('SELECT p.* FROM tf_products p WHERE product_status =1 and account_id=? order by productid desc LIMIT 20', [row.created_by], callback);
                }
            }
        })

    },

    addproductimages: function (data, callback) {
        return db.query('Insert INTO tf_products_images SET ?', data, callback);
    },
    addproductdocs: function (data, callback) {
        return db.query('Insert INTO tf_products_docs SET ?', data, callback);
    },
    updateproductdocs: function (data, callback) {
        return db.query('update tf_products_docs set ? WHERE product_id = ?', [data, data.product_id], callback);
    },
    getproductimagedata: function (id, callback) {
        return db.query('SELECT * from tf_products_images WHERE product_id = ' + id, [], callback);
        // return db.query('SELECT tf_kyc.*,tf_account_table.account_name FROM `tf_kyc` INNER JOIN tf_account_table ON tf_kyc.account_id =tf_account_table.account_id WHERE tf_kyc.account_id ='+id,[],callback)
    },
    getproductdocdata: function (id, callback) {
        return db.query('SELECT * from tf_products_docs WHERE product_id = ' + id, [], callback);
        // return db.query('SELECT tf_kyc.*,tf_account_table.account_name FROM `tf_kyc` INNER JOIN tf_account_table ON tf_kyc.account_id =tf_account_table.account_id WHERE tf_kyc.account_id ='+id,[],callback)
    },
    deleteproductimage: function (data, callback) {
        return db.query('delete from  tf_products_images where product_image_id = ' + data, callback);
    },
    deleteproductdoc: function (data, callback) {
        return db.query('delete from  tf_products_docs where product_doc_id = ' + data, callback);
    },
    insertagentproductemail: function (data, callback) {
        return db.query('Insert INTO tf_product_email SET ?', data, callback);
    },
    insertagentproductsms: function (data, callback) {
        return db.query('Insert INTO tf_product_sms SET ?', data, callback);
    },
    insertagentproductwhatsapp: function (data, callback) {
        return db.query('Insert INTO tf_product_whatsapp SET ?', data, callback);
    },
    saveproductgroupData:function(data,callback){
        return db.query('Insert INTO tf_product_group set ? ', [data], callback);
  
    },
    updatproductgroupData:function(data,callback)
    {
        return db.query('update tf_product_group set ? WHERE pg_id = ?', [data, data.pg_id], callback);

    },
    deleteproductgroup:function(id,callback){
        return db.query('DELETE FROM tf_product_group where pg_id=?', [id], callback);
    },
    getproductgroup:function(id,callback){
    
        return db.query("SELECT * FROM `tf_product_group` WHERE `user_id`= "+id,callback);
    },
    updateproductgroup: function (cid, callback) { 
        return db.query('Select * from tf_product_group where pg_id=?',cid, callback);
    },
    getproductbygroup:function(id,callback){
    
        return db.query("SELECT * FROM `tf_products` WHERE `User_id` = ? AND `group_id` = ? ORDER BY `productid` DESC",[id.User_id,id.group_id],callback);
    },
    deleteproduct:function(id,callback){
         db.query('DELETE FROM tf_products where productid=?', [id], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                
                    return db.query('DELETE FROM tf_product_attributes where product_id=?', [id], callback);
                
            }
        })
    },
    
    // getshorturl: async function (url) {
    //     return requestify
    // .post(url, data)
    // .then((response) => response.getBody());
    // },

    SaveAttributeMeta: async function (key, value, conid, managerid) {
        key = key.toLowerCase().replace(/\s/g, '')
        return new Promise(function (resolve, reject) {
            //console.log('SELECT * FROM tf_product_attributes  WHERE product_id='+conid+' and attribute_key = "'+key+'"');
            db.query('SELECT * FROM tf_product_attributes  WHERE product_id=? and attribute_key = ?', [conid, key], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
                } else {
                    console.log(results);
                    if (results.length > 0) {
                        var data = { attribute_value: value }
                        db.query('Update tf_product_attributes SET ? WHERE product_id=? and attribute_key = ?', [data, conid, key], function (err, results) { })
                        resolve(results);
                    } else {
                        var data = { account_id: managerid, product_id: conid, attribute_key: key, attribute_value: value }
                        //console.log(data)
                        if (key != '') {
                            db.query('INSERT INTO tf_product_attributes SET ?', [data], function (err, results) { })
                        }
                        resolve(0);
                    }
                }
            })
        })
    },
    getproductallattribute: async function (conid) {
        return new Promise(function (resolve, reject) {
            db.query('SELECT * FROM tf_product_attributes  WHERE product_id=?', [conid], function (err, results) {
                if (err) {
                    console.log("[mysql error]", err);
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
    deleteproductattribute: function (data, callback) {
        return db.query('SELECT attribute_id FROM tf_product_attributes where product_id=? and attribute_key=?', [data.productid,data.key], function (err, results) {
            if (err) {
                console.log("[mysql error]", err);
            } else {
                var row = results[0]
                if (results.length > 0) {
                    return db.query('DELETE FROM tf_product_attributes where attribute_id=?', [row.attribute_id], callback);
                } 
            }
        })

    },
}


module.exports = Products;
