var cron = require('node-cron');
var Report = require('../model/report');
var async = require('async');

var db = require('../database/db');
var json2xls = require('json2xls');
var fs = require('fs');
var dateFormat = require('dateformat');
var moment = require('moment');
var helper = require('../helper/common')
var APIRESTERPNext = require('../middlewares/ERP/library/restapi-erpnext/index');
var APIRESTERPNext = new APIRESTERPNext({
    username: 'sonali',
    password: 'Garuda@dv321',
    baseUrl: 'https://erp.cloudX.in' //Erpnext Instalado V10+ Porduccion u Develop
})
//'*/3600 * * * * *'
cron.schedule("*/60 * * * * *", async () => {

    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    console.log('running a task every 60 second auto dialer ivr==> ' + date_ob + ' ' + hours + ':' + minutes);
    if (hours > 7 && hours < 23) {

        db.query('SELECT * FROM tf_account_table WHERE current_status = 0 and is_erp = 0 and account_type = 2 limit 0,5', [], async function (err, adata) {
            if (err) {
                console.log(err);
            } else {

                if (adata.length > 0) {
                    async.forEachOf(adata, (data, callback) => {
                        console.log("Email : " + data.email);
                        console.log("Username : " + data.account_name);

                        var acc_id = data.account_id;

                        var user_obj = {};
                        user_obj['doctype'] = "User";
                        user_obj['enabled'] = 1;
                        user_obj['__unsaved'] = 1;
                        user_obj['send_welcome_email'] = 0;
                        user_obj['unsubscribed'] = 0;
                        user_obj['language'] = 'en';
                        user_obj['mute_sounds'] = 0;
                        user_obj['logout_all_sessions'] = 0;
                        user_obj['__islocal'] = 1;
                        user_obj['document_follow_notify'] = 0;
                        user_obj['document_follow_frequency'] = "Daily";
                        user_obj['thread_notify'] = 1;
                        user_obj['send_me_a_copy'] = 0;
                        user_obj['allowed_in_mentions'] = 0;
                        user_obj['simultaneous_sessions'] = 1;
                        user_obj['user_type'] = "System User";
                        user_obj['bypass_restrict_ip_check_if_2fa_enabled'] = 0;

                        user_obj['email'] = data.email;
                        user_obj['name'] = data.account_name;
                        user_obj['first_name'] = data.account_name;
                        user_obj['username'] = data.account_name;
                        user_obj['mobile_no'] = data.mobile;
                        user_obj['new_password'] = "Garuda@dv321" //data.password;

                        user_obj['block_modules'] = [{ "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 1, "module": "Automation" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 2, "module": "Customization" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 3, "module": "Website" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 4, "module": "Leaderboard" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 5, "module": "Getting Started" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 6, "module": "Selling" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 7, "module": "Stock" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 8, "module": "Projects" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 9, "module": "Loan Management" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 10, "module": "HR" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 11, "module": "Healthcare" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 12, "module": "Marketplace" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 13, "module": "Settings" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 14, "module": "Users and Permissions" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 15, "module": "Integrations" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 16, "module": "Social" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 17, "module": "Accounts" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 18, "module": "Buying" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 19, "module": "Assets" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 21, "module": "Support" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 22, "module": "Quality Management" }, { "docstatus": 0, "doctype": "Block Module", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "block_modules", "parenttype": "User", "idx": 23, "module": "Help" }];
                        user_obj['roles'] = [{ "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 1, "role": "Customer" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 2, "role": "Dashboard Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 3, "role": "Analytics" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 4, "role": "Accounts Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 5, "role": "Projects Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 6, "role": "Purchase Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 7, "role": "Purchase User" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 8, "role": "Report Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 9, "role": "Sales Master Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 10, "role": "Item Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 11, "role": "Purchase Master Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 12, "role": "Quality Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 13, "role": "Sales Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 14, "role": "Sales User" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 15, "role": "Stock Manager" }, { "docstatus": 0, "doctype": "Has Role", "__islocal": 1, "__unsaved": 1, "parent": data.email, "parentfield": "roles", "parenttype": "User", "idx": 16, "role": "Supplier" }];

                        //check whether user is exists or not in erp
                        APIRESTERPNext.checkUserExists('email', data.email).then(async function (resp) {
                            if (resp.length > 0) {
                                //set username as email address
                                var email = data.account_name + '@cloudX.in';
                                await APIRESTERPNext.checkUserExists('email', email).then(async function (resp) {
                                    if (resp.length > 0) {
                                        //username and email with username both exists
                                    } else {
                                        user_obj['email'] = email;
                                        APIRESTERPNext.createUSers(user_obj).then(function (resp) {
                                            console.log("step 1");
                                            var erp_userid = resp['social_logins'][0]['userid'];
                                            var erp_username = resp.username;
                                            var erp_email = resp.email;
                                            var erp_password = 'Garuda@dv321';
                                            var is_erp = 1;
                                            db.query('update tf_account_table set erp_userid="' + erp_userid + '",erp_username="' + erp_username + '",erp_email="' + erp_email + '",erp_password="' + erp_password + '",is_erp=1 WHERE account_id=' + acc_id);
                                            console.log("step 1 done");
                                        })
                                    }
                                })

                            } else {
                                APIRESTERPNext.createUSers(user_obj).then(function (resp) {
                                    console.log("step 2");

                                    var erp_userid = resp['social_logins'][0]['userid'];
                                    var erp_username = resp.username;
                                    var erp_email = resp.email;
                                    var erp_password = 'Garuda@dv321';
                                    var is_erp = 1;
                                    db.query('update tf_account_table set erp_userid="' + erp_userid + '",erp_username="' + erp_username + '",erp_email="' + erp_email + '",erp_password="' + erp_password + '",is_erp=1 WHERE account_id=' + acc_id);
                                    console.log("step 2 done");
                                })
                            }
                        })


                    });



                }


            }
        });
    }
});