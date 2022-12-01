var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var parseurl = require('parseurl');
var session = require('express-session');
var Digital = require('../model/digital');
var Admin = require('../model/admin');
var mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "Garuda@dv-iagents-secret";
const authorize = require("../middlewares/auth");
const { spawn } = require('child_process');
var pypath = require('../middlewares/pypath');
const dateFormat = require('dateformat');
var urllib = require('urllib');
var request = require('request');
var camelCase = require("camelcase");
const multer = require('multer');
const path = require('path');
var fs = require('fs');
const mime = require('mime');
var async = require("async");
var API = require('../model/api');
var Twit = require('twit');
const AdwordsAuth = require('node-adwords').AdwordsAuth;
//Required package
const awry = require('awry');
var helper = require("../helper/common");
var helperDigital = require("../helper/digital");
var ERP = require('../model/erp');
python_sdk_path = pypath.path()

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({ resave: false, secret: '123456', saveUninitialized: true, cookie: { maxAge: 60000 } }));

//Google Ads
let googlead = new AdwordsAuth({
    client_id: '366781832248-k004pjtln285aluo2iprjs09o0a7l4k8.apps.googleusercontent.com', //this is the api console client_id
    client_secret: 'wsV1hh_unK83s32pyXTdc-I2'
}, 'https://digital.cloudX.in/customer-access'   /** insert your redirect url here */);

const LoginWithTwitter = require('login-with-twitter');
const tw = new LoginWithTwitter({
    consumerKey: process.env.TWITTER_CONSUMERKEY,
    consumerSecret: process.env.TWITTER_CONSUMERSECRET,
    //callbackUrl: 'https://digital.cloudX.in/account-access'
    callbackUrl: process.env.TWITTER_CALLBACK_URL,
})
const t_config = {
    consumer_key: process.env.TWITTER_CONSUMERKEY,
    consumer_secret: process.env.TWITTER_CONSUMERSECRET,
    access_token: '',
    access_token_secret: '',

};
// LinkedIn ---------------------------------------------------------------------------------------
var Linkedin = require('node-linkedin')(process.env.LINKED_APP_ID, process.env.LINKED_SECRET);
var lscope = ['r_basicprofile', 'r_emailaddress', 'r_ads', 'w_organization_social', 'r_organization_social', 'rw_ads', 'r_ads_reporting', 'r_liteprofile', 'rw_organization_admin', 'w_member_social', 'r_1st_connections_size'];
// Account Access
router.get('/getchannel/:id', authorize, function (req, res) {
    Digital.getChannel(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(rows);
            res.status(200).send({ "data": rows });
        }
    })
})
router.get('/getchanneldetail/:id', authorize, function (req, res) {
    console.log(req.params.id);
    Digital.getChannelDetail(req.params.id, function (err, rows) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            console.log(rows[0]);
            res.status(200).send({ "data": rows[0] });
        }
    });
});
router.post('/checkchannelusername', function (req, res) {
    if (req.body.server_id > 0) {
        Admin.getasteriskserverdetail(req.body.server_id, function (err, rows) {
            if (err) {
                console.log(err);
            }
            else {
                var serverdata = rows;
                // var mysql = require('mysql');
                if (serverdata.length > 0) {
                    var connection = mysql.createPool({
                        host: serverdata[0].server_mysql_host, //192.168.1.27
                        user: serverdata[0].server_mysql_username, //root
                        port: '3306',
                        password: serverdata[0].server_mysql_password, //Garuda@dv1234
                        database: serverdata[0].server_database_name,
                    });
                    connection.query('SELECT * from ps_auths where username=?', [req.body.check], function (err, results) {
                        //console.log(results);
                        if (err) {
                            console.log("[mysql error]", err);
                            connection.end();
                        } else {
                            // return res.json({ 'data': results });
                            // callback(err, results);
                            //console.log(results);
                            connection.end();
                            if (results.length > 0) {
                                res.json({ 'isexist': true });
                            } else {
                                res.json({ 'isexist': false });
                            }
                        }
                    });
                }
            }
        });
    } else {
        Digital.checkchanneluserexist(req.body.check, function (err, rows) {
            if (err) {
                res.status(400).json(err);
            }
            else {
                if (rows.length > 0) {
                    res.json({ 'isexist': true });
                } else {
                    res.json({ 'isexist': false });
                }
            }
        });
    }
});
router.post('/checkchannelid', function (req, res) {
    if (req.body.server_id > 0) {
        Admin.getasteriskserverdetail(req.body.server_id, function (err, rows) {
            if (err) {
                console.log(err);
            }
            else {
                var serverdata = rows;
                // var mysql = require('mysql');
                if (serverdata.length > 0) {
                    var connection = mysql.createPool({
                        host: serverdata[0].server_mysql_host, //192.168.1.27
                        user: serverdata[0].server_mysql_username, //root
                        port: '3306',
                        password: serverdata[0].server_mysql_password, //Garuda@dv1234
                        database: serverdata[0].server_database_name,
                    });
                    // var data = connection.query('SELECT * FROM ps_endpoints', [], callback);

                    connection.query('SELECT * from ps_endpoints where id=?', [req.body.check], function (err, results) {
                        //console.log(results);
                        if (err) {
                            console.log("[mysql error]", err);
                            connection.end();
                        } else {
                            // return res.json({ 'data': results });
                            // callback(err, results);
                            //console.log(results);
                            connection.end();
                            if (results.length > 0) {
                                res.json({ 'isexist': true });
                            } else {
                                res.json({ 'isexist': false });
                            }
                        }
                    });


                }
            }
        });
    } else {
        Digital.checkchannelid(req.body.check, function (err, rows) {
            if (err) {
                res.status(400).json(err);
            }
            else {
                console.log(rows);
                if (rows.length > 0) {
                    res.json({ 'isexist': true });
                } else {
                    res.json({ 'isexist': false });
                }
            }
        });
    }

});
router.post('/updatechannel', function (req, res) {
    // console.log(JSON.stringify(req.body));
    var id = req.body.id;
    var max_contacts = req.body.max_contacts;
    var contact = req.body.contact;
    var qualify_frequency = req.body.qualify_frequency;
    var remove_existing = req.body.remove_existing;
    ps_aors_data = { id: id, max_contacts: max_contacts, contact: contact, qualify_frequency: qualify_frequency, remove_existing: remove_existing };

    //AUTHS
    var auth_type = req.body.auth_type;
    //var password = req.body.password;
    //var username = req.body.username;
    var realm = req.body.realm;
    ps_auths_data = { id: id, auth_type: auth_type, realm: realm };

    //eND POINTS
    var e_transport = req.body.e_transport;
    var e_aors = req.body.e_aors;
    var e_outbound_auth = req.body.e_outbound_auth;
    var e_context = req.body.e_context;
    var e_disallow = req.body.e_disallow;
    var e_allow = req.body.e_allow;
    var e_direct_media = req.body.e_direct_media;
    var e_rtp_symmetric = req.body.e_rtp_symmetric;
    var e_force_rport = req.body.e_force_rport;
    var e_rewrite_contact = req.body.e_rewrite_contact;
    var e_dtls_ca_file = req.body.e_dtls_ca_file;
    var e_dtls_cert_file = req.body.e_dtls_cert_file;
    var e_from_domain = req.body.e_from_domain;
    var e_preferred_codec_only = req.body.e_preferred_codec_only;
    var e_webrtc = req.body.e_webrtc;
    ps_endpoints_data = { id: id, transport: e_transport, aors: e_aors, outbound_auth: e_outbound_auth, context: e_context, disallow: e_disallow, allow: e_allow, direct_media: e_direct_media, rtp_symmetric: e_rtp_symmetric, force_rport: e_force_rport, rewrite_contact: e_rewrite_contact, dtls_ca_file: e_dtls_ca_file, dtls_cert_file: e_dtls_cert_file, from_domain: e_from_domain, preferred_codec_only: e_preferred_codec_only, webrtc: e_webrtc };

    //ps_endpoint_id_ips
    var ip_endpoint = req.body.ip_endpoint;
    var ip_match = req.body.ip_match;
    ps_ip_data = { id: id, endpoint: ip_endpoint, match: ip_match };

    //ps_registrations

    var transport = req.body.transport;
    var outbound_auth = req.body.outbound_auth;
    var server_uri = req.body.server_uri;
    var client_uri = req.body.client_uri;
    var retry_interval = req.body.retry_interval;
    var expiration = req.body.expiration;
    var line = req.body.line;
    var contact_user = req.body.contact_user;
    var endpoint = req.body.endpoint;
    ps_registrations_data = { id: id, transport: transport, outbound_auth: outbound_auth, server_uri: server_uri, client_uri: client_uri, retry_interval: retry_interval, expiration: expiration, line: line, contact_user: contact_user, endpoint: endpoint };

    Digital.updatechannel(ps_aors_data, ps_auths_data, ps_endpoints_data, ps_ip_data, ps_registrations_data, function (err, count) {

        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json({ 'msg': 'Channel updated sucessfully.' });
        }
    });
});
router.post('/createchannel', function (req, res) {
    // if (req.body.password) {
    //     const password = bcrypt.hashSync(req.body.password);
    //     req.body.password = password;
    // }
    //var m = new Date(); 
    //var id = 'VAG'+m.getUTCFullYear() +""+ (m.getUTCMonth()+1) +""+ m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();

    //AORS
    var id = req.body.id;
    var max_contacts = req.body.max_contacts;
    var contact = req.body.contact;
    var qualify_frequency = req.body.qualify_frequency;
    var remove_existing = req.body.remove_existing;
    ps_aors_data = { id: id, max_contacts: max_contacts, contact: contact, qualify_frequency: qualify_frequency, remove_existing: remove_existing };

    //AUTHS
    var auth_type = req.body.auth_type;
    var password = req.body.password;
    var username = req.body.username;
    var realm = req.body.realm;
    ps_auths_data = { id: id, auth_type: auth_type, password: password, username: username, realm: realm };

    //eND POINTS
    var e_transport = req.body.e_transport;
    var e_aors = req.body.e_aors;
    var e_outbound_auth = req.body.e_outbound_auth;
    var e_context = req.body.e_context;
    var e_disallow = req.body.e_disallow;
    var e_allow = req.body.e_allow;
    var e_direct_media = req.body.e_direct_media;
    var e_rtp_symmetric = req.body.e_rtp_symmetric;
    var e_force_rport = req.body.e_force_rport;
    var e_rewrite_contact = req.body.e_rewrite_contact;
    var e_dtls_ca_file = req.body.e_dtls_ca_file;
    var e_dtls_cert_file = req.body.e_dtls_cert_file;
    var e_from_domain = req.body.e_from_domain;
    var e_preferred_codec_only = req.body.e_preferred_codec_only;
    var e_webrtc = req.body.e_webrtc;
    ps_endpoints_data = { id: id, transport: e_transport, aors: e_aors, outbound_auth: e_outbound_auth, context: e_context, disallow: e_disallow, allow: e_allow, direct_media: e_direct_media, rtp_symmetric: e_rtp_symmetric, force_rport: e_force_rport, rewrite_contact: e_rewrite_contact, dtls_ca_file: e_dtls_ca_file, dtls_cert_file: e_dtls_cert_file, from_domain: e_from_domain, preferred_codec_only: e_preferred_codec_only, webrtc: e_webrtc };

    //ps_endpoint_id_ips
    var ip_endpoint = req.body.ip_endpoint;
    var ip_match = req.body.ip_match;
    ps_ip_data = { id: id, endpoint: ip_endpoint, match: ip_match };

    //ps_registrations

    var transport = req.body.transport;
    var outbound_auth = req.body.outbound_auth;
    var server_uri = req.body.server_uri;
    var client_uri = req.body.client_uri;
    var retry_interval = req.body.retry_interval;
    var expiration = req.body.expiration;
    var line = req.body.line;
    var contact_user = req.body.contact_user;
    var endpoint = req.body.endpoint;
    ps_registrations_data = { id: id, transport: transport, outbound_auth: outbound_auth, server_uri: server_uri, client_uri: client_uri, retry_interval: retry_interval, expiration: expiration, line: line, contact_user: contact_user, endpoint: endpoint };

    Digital.createchannel(ps_aors_data, ps_auths_data, ps_endpoints_data, ps_ip_data, ps_registrations_data, function (err, count) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json({ 'msg': 'Channel created sucessfully.' });
        }
    });
});
router.post('/deletechannel', function (req, res) {
    var id = req.body.id;
    var serverid = req.body.server_id;
    if (serverid > 0) {
        Admin.getasteriskserverdetail(serverid, function (err, rows) {
            if (err) {
                console.log(err);
            }
            else {
                var serverdata = rows;
                // var mysql = require('mysql');
                if (serverdata.length > 0) {
                    var connection = mysql.createPool({
                        host: serverdata[0].server_mysql_host, //192.168.1.27
                        user: serverdata[0].server_mysql_username, //root
                        port: '3306',
                        password: serverdata[0].server_mysql_password, //Garuda@dv1234
                        database: serverdata[0].server_database_name,
                    });
                    // var data = connection.query('SELECT * FROM ps_endpoints', [], callback);


                    connection.query('DELETE FROM ps_aors  where id=?', [id], function (err, results) {
                        if (err) {
                            console.log("[mysql error]", err);
                            connection.end();
                        } else {
                            connection.query('DELETE FROM  ps_auths  where id=?', [id], function (err, results) {
                                if (err) {
                                    console.log("[mysql error]", err);
                                } else {
                                    connection.query('DELETE FROM ps_endpoints  where id=?', [id], function (err, results) {
                                        if (err) {
                                            console.log("[mysql error]", err);
                                        } else {
                                            connection.query('DELETE FROM  ps_endpoint_id_ips   where id=?', [id], function (err, results) {
                                                if (err) {
                                                    console.log("[mysql error]", err);
                                                } else {
                                                    connection.query('DELETE FROM  	ps_registrations  where id=?', [id]);
                                                    connection.end();
                                                }
                                            })
                                        }
                                    })
                                }
                            })

                        }
                    });
                    res.json({ 'msg': 'Channel deleted sucessfully.' });
                }
            }
        });
    } else {
        Digital.deletechannel(id, function (err, count) {
            if (err) {
                res.status(400).json(err);
            }
            else {
                res.json({ 'msg': 'Channel deleted sucessfully.' });
            }
        })
    }

});
//dynamic database connection to add channel
router.post('/createnewdynamicchannel', function (req, res) {
    //console.log(req.body);
    Admin.getasteriskserverdetail(req.body.server_id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            var serverdata = rows;
            // var mysql = require('mysql');
            if (serverdata.length > 0) {
                var connection = mysql.createPool({
                    host: serverdata[0].server_mysql_host, //192.168.1.27
                    user: serverdata[0].server_mysql_username, //root
                    port: '3306',
                    password: serverdata[0].server_mysql_password, //Garuda@dv1234
                    database: serverdata[0].server_database_name,
                });
                //console.log(connection);
                connection.getConnection(function (err, connection) {
                    if (err) {
                        console.log('==>' , err);
                        res.json({ 'data': 'connection error.' });
                    } else {
                        //console.log('hi');
                        console.log(serverdata[0].server_mysql_host + ' Database connected succesfully.');
                        var id = req.body.id;
                        var max_contacts = req.body.max_contacts;
                        var contact = req.body.contact;
                        var qualify_frequency = req.body.qualify_frequency;
                        var remove_existing = req.body.remove_existing;
                        var outbound_proxy = req.body.a_outbound_proxy;
                        ps_aors_data = { id: id, max_contacts: max_contacts, contact: contact, qualify_frequency: qualify_frequency, remove_existing: remove_existing, outbound_proxy: outbound_proxy };
                        //console.log(ps_aors_data);
                        connection.query('Insert INTO ps_aors SET ?', ps_aors_data, function (err, results) {
                            console.log(err)
                        });
                        //AUTHS
                        if (req.body.registrationopt == 1) {
                            var id = req.body.id;
                            var auth_type = req.body.auth_type;
                            var password = req.body.password;
                            var username = req.body.username;
                            var realm = req.body.realm;
                            ps_auths_data = { id: id, auth_type: auth_type, password: password, username: username, realm: realm };
                            //console.log(ps_auths_data);
                            connection.query('Insert INTO ps_auths SET ?', ps_auths_data);
                        }
                        //eND POINTS
                        var e_transport = req.body.e_transport;
                        var e_aors = req.body.e_aors;
                        var e_outbound_auth = req.body.e_outbound_auth;
                        var e_context = req.body.e_context;
                        var e_disallow = req.body.e_disallow;
                        var e_allow = req.body.e_allow;
                        var e_direct_media = req.body.e_direct_media;
                        var e_rtp_symmetric = req.body.e_rtp_symmetric;
                        var e_force_rport = req.body.e_force_rport;
                        var e_rewrite_contact = req.body.e_rewrite_contact;
                        var e_dtls_ca_file = req.body.e_dtls_ca_file;
                        var e_dtls_cert_file = req.body.e_dtls_cert_file;
                        var e_from_domain = req.body.e_from_domain;
                        var e_preferred_codec_only = req.body.e_preferred_codec_only;
                        var e_webrtc = req.body.e_webrtc;
                        var id = req.body.id;
                        var outbound_proxy = req.body.e_outbound_proxy;
                        ps_endpoints_data = { id: id, transport: e_transport, aors: e_aors, outbound_auth: e_outbound_auth, context: e_context, disallow: e_disallow, allow: e_allow, direct_media: e_direct_media, rtp_symmetric: e_rtp_symmetric, force_rport: e_force_rport, rewrite_contact: e_rewrite_contact, dtls_ca_file: e_dtls_ca_file, dtls_cert_file: e_dtls_cert_file, from_domain: e_from_domain, preferred_codec_only: e_preferred_codec_only, webrtc: e_webrtc, outbound_proxy: outbound_proxy };
                        //console.log(ps_endpoints_data);
                        connection.query('Insert INTO ps_endpoints SET ?', ps_endpoints_data);
                        //ps_endpoint_id_ips
                        var ip_endpoint = req.body.ip_endpoint;
                        var ip_match = req.body.ip_match;
                        var id = req.body.id;
                        ps_ip_data = { id: id, endpoint: ip_endpoint, match: ip_match };
                        //console.log(ps_ip_data);
                        connection.query('Insert INTO ps_endpoint_id_ips SET ?', ps_ip_data);
                        //ps_registrations
                        if (req.body.registrationopt == 1) {
                            var id = req.body.id;
                            var transport = req.body.transport;
                            var outbound_auth = req.body.outbound_auth;
                            var server_uri = req.body.server_uri;
                            var client_uri = req.body.client_uri;
                            var retry_interval = req.body.retry_interval;
                            var expiration = req.body.expiration;
                            var line = req.body.line;
                            var contact_user = req.body.contact_user;
                            var endpoint = req.body.endpoint;
                            var outbound_proxy = req.body.r_outbound_proxy;
                            ps_registrations_data = { id: id, transport: transport, outbound_auth: outbound_auth, server_uri: server_uri, client_uri: client_uri, retry_interval: retry_interval, expiration: expiration, line: line, contact_user: contact_user, endpoint: endpoint, outbound_proxy: outbound_proxy };
                            connection.query('Insert INTO ps_registrations SET ?', ps_registrations_data);
                            connection.end();
                        }else{
                            connection.end();
                        }
                        res.json({ 'data': 'Channel added sucessfully.' });
                    }
                });
            } else {
                console.log('asterisk server not found!!');
                res.json({ 'data': 'asterisk server not found' });
            }
        }
    });
});
router.get('/getchannelbyserver/:id', authorize, function (req, res) {
    //console.log(req.params.id);
    Admin.getasteriskserverdetail(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
            return res.json({ 'data': [] });
        }
        else {
            var serverdata = rows;
            // var mysql = require('mysql');
            if (serverdata.length > 0) {
                var connection = mysql.createPool({
                    host: serverdata[0].server_mysql_host, //192.168.1.27
                    user: serverdata[0].server_mysql_username, //root
                    port: '3306',
                    password: serverdata[0].server_mysql_password, //Garuda@dv1234
                    database: serverdata[0].server_database_name,
                });
                connection.getConnection(function(err, connection) {
                    if (err) {
                        console.log('==>',err);
                        return res.json({ 'data': [] });
                    }else{
                        console.log(serverdata[0].server_mysql_host + ' ==> Datbase connected succesfully.');
                        connection.query('SELECT * from ps_endpoints', [], function (err, results) {
                            //console.log(results);
                            if (err) {
                                console.log("[mysql error]", err);
                                connection.end();
                                return res.json({ 'data': [] });
                            } else {
                                connection.end();
                                return res.json({ 'data': results });
                                // callback(err, results);
                            }
                        });
                    }
                })
            }else{
                return res.json({ 'data': [] });
            }
        }
    });


})
router.post('/getchanneldetailbyserver/', authorize, function (req, res) {
    //console.log(req.params.id);
    Admin.getasteriskserverdetail(req.body.server_id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            var serverdata = rows;
            // var mysql = require('mysql');
            if (serverdata.length > 0) {
                var connection = mysql.createPool({
                    host: serverdata[0].server_mysql_host, //192.168.1.27
                    user: serverdata[0].server_mysql_username, //root
                    port: '3306',
                    password: serverdata[0].server_mysql_password, //Garuda@dv1234
                    database: serverdata[0].server_database_name,
                });
                // var data = connection.query('SELECT * FROM ps_endpoints', [], callback);

                connection.query('SELECT reg.*,reg.id as regid,auth.id as authid,endp.id as id,endp.outbound_proxy as e_outbound_proxy,aor.outbound_proxy as a_outbound_proxy,reg.outbound_proxy as r_outbound_proxy,aor.max_contacts,aor.contact,aor.qualify_frequency,aor.remove_existing,auth.auth_type,auth.username,auth.realm,endp.transport as e_transport,endp.aors as e_aors,endp.outbound_auth as e_outbound_auth,endp.context as e_context,endp.disallow as e_disallow,endp.allow as e_allow,endp.direct_media as e_direct_media,endp.rtp_symmetric as e_rtp_symmetric,endp.force_rport as e_force_rport,endp.rewrite_contact as e_rewrite_contact,endp.dtls_ca_file as e_dtls_ca_file,endp.dtls_cert_file as e_dtls_cert_file,endp.from_domain as e_from_domain,endp.preferred_codec_only as e_preferred_codec_only,endp.webrtc as e_webrtc,eip.endpoint as ip_endpoint,eip.match as ip_match FROM ps_endpoints endp LEFT JOIN ps_aors aor ON endp.id=aor.id LEFT JOIN ps_auths auth ON endp.id=auth.id  LEFT JOIN ps_endpoint_id_ips eip ON endp.id=eip.id LEFT JOIN ps_registrations reg ON endp.id=reg.id where endp.id=?', [req.body.id], function (err, results) {
                    //console.log(results);
                    if (err) {
                        console.log("[mysql error]", err);
                        connection.end();
                    } else {
                        connection.end();
                        return res.json({ 'data': results[0], 'server_id': req.body.server_id });
                        // callback(err, results);
                    }
                });
            }
        }
    });
});
router.post('/updatenewdynamicchannel', function (req, res) {
    // console.log(JSON.stringify(req.body));
    //console.log(req.body);
    var id = req.body.id;
    var max_contacts = req.body.max_contacts;
    var contact = req.body.contact;
    var qualify_frequency = req.body.qualify_frequency;
    var remove_existing = req.body.remove_existing;
    var outbound_proxy = req.body.a_outbound_proxy;
    ps_aors_data = { id: id, max_contacts: max_contacts, contact: contact, qualify_frequency: qualify_frequency, remove_existing: remove_existing,outbound_proxy:outbound_proxy };

    //AUTHS
    var id = req.body.id;
    var auth_type = req.body.auth_type;
    //var password = req.body.password;
    //var username = req.body.username;
    var realm = req.body.realm;
    ps_auths_data = { id: id, auth_type: auth_type, realm: realm };



    //eND POINTS
    var id = req.body.id;
    var e_transport = req.body.e_transport;
    var e_aors = req.body.e_aors;
    var e_outbound_auth = req.body.e_outbound_auth;
    var e_context = req.body.e_context;
    var e_disallow = req.body.e_disallow;
    var e_allow = req.body.e_allow;
    var e_direct_media = req.body.e_direct_media;
    var e_rtp_symmetric = req.body.e_rtp_symmetric;
    var e_force_rport = req.body.e_force_rport;
    var e_rewrite_contact = req.body.e_rewrite_contact;
    var e_dtls_ca_file = req.body.e_dtls_ca_file;
    var e_dtls_cert_file = req.body.e_dtls_cert_file;
    var e_from_domain = req.body.e_from_domain;
    var e_preferred_codec_only = req.body.e_preferred_codec_only;
    var e_webrtc = req.body.e_webrtc;
    var outbound_proxy = req.body.e_outbound_proxy;
    ps_endpoints_data = { id: id, transport: e_transport, aors: e_aors, outbound_auth: e_outbound_auth, context: e_context, disallow: e_disallow, allow: e_allow, direct_media: e_direct_media, rtp_symmetric: e_rtp_symmetric, force_rport: e_force_rport, rewrite_contact: e_rewrite_contact, dtls_ca_file: e_dtls_ca_file, dtls_cert_file: e_dtls_cert_file, from_domain: e_from_domain, preferred_codec_only: e_preferred_codec_only, webrtc: e_webrtc,outbound_proxy:outbound_proxy };

    //ps_endpoint_id_ips
    var id = req.body.id;
    var ip_endpoint = req.body.ip_endpoint;
    var ip_match = req.body.ip_match;
    
    ps_ip_data = { id: id, endpoint: ip_endpoint, match: ip_match };
    

    //ps_registrations
    var id = req.body.id;
    var transport = req.body.transport;
    var outbound_auth = req.body.outbound_auth;
    var server_uri = req.body.server_uri;
    var client_uri = req.body.client_uri;
    var retry_interval = req.body.retry_interval;
    var expiration = req.body.expiration;
    var line = req.body.line;
    var contact_user = req.body.contact_user;
    var endpoint = req.body.endpoint;
    var outbound_proxy = req.body.r_outbound_proxy;
    ps_registrations_data = { id: id, transport: transport, outbound_auth: outbound_auth, server_uri: server_uri, client_uri: client_uri, retry_interval: retry_interval, expiration: expiration, line: line, contact_user: contact_user, endpoint: endpoint,outbound_proxy:outbound_proxy };

    if (req.body.server_id > 0) {
        Admin.getasteriskserverdetail(req.body.server_id, function (err, rows) {
            if (err) {
                console.log(err);
            }
            else {
                var serverdata = rows;
                // var mysql = require('mysql');
                if (serverdata.length > 0) {
                    var connection = mysql.createPool({
                        host: serverdata[0].server_mysql_host, //192.168.1.27
                        user: serverdata[0].server_mysql_username, //root
                        port: '3306',
                        password: serverdata[0].server_mysql_password, //Garuda@dv1234
                        database: serverdata[0].server_database_name,
                    });

                    if (req.body.registrationopt == true) {
                       // console.log(ps_endpoints_data);
                        connection.query('update ps_aors set ? WHERE id = ?', [ps_aors_data, ps_aors_data.id], function (err, results) {
                            if (err) {
                                console.log("[mysql error]", err);
                            } else {
                                connection.query('update ps_auths set ? WHERE id = ?', [ps_auths_data, ps_auths_data.id], function (err, results) {
                                    if (err) {
                                        console.log("[mysql error]", err);
                                    } else {
                                        connection.query('update ps_endpoints set ? WHERE id = ?', [ps_endpoints_data, ps_endpoints_data.id], function (err, results) {
                                            if (err) {
                                                console.log("[mysql error]", err);
                                            } else {
                                                connection.query('update ps_endpoint_id_ips set ? WHERE id = ?', [ps_ip_data, ps_ip_data.id], function (err, results) {
                                                    if (err) {
                                                        console.log("[mysql error]", err);
                                                    } else {
                                                        connection.query('update ps_registrations set ? WHERE id = ?', [ps_registrations_data, ps_registrations_data.id]);
                                                        connection.end();
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        });
                    } else {                        
                        connection.query('update ps_aors set ? WHERE id = ?', [ps_aors_data, ps_aors_data.id], function (err, results) {
                            if (err) {
                                console.log("[mysql error]", err);
                            } else {
                                connection.query('update ps_endpoints set ? WHERE id = ?', [ps_endpoints_data, ps_endpoints_data.id], function (err, results) {
                                    if (err) {
                                        console.log("[mysql error]", err);
                                    } else {
                                        connection.query('update ps_endpoint_id_ips set ? WHERE id = ?', [ps_ip_data, ps_ip_data.id]);
                                        connection.end();
                                    }
                                })
                            }
                        });
                    }
                }
                res.json({ 'msg': 'Channel updated sucessfully.' });
            }
        });
       

    } else {
        Digital.updatechannel(ps_aors_data, ps_auths_data, ps_endpoints_data, ps_ip_data, ps_registrations_data, function (err, count) {

            if (err) {
                res.status(400).json(err);
            }
            else {
                res.json({ 'msg': 'Channel updated sucessfully.' });
            }
        });
    }

});
router.post('/brand_create', authorize, (req, res) => {
    var brand = {}
    brand.brand_name = req.body.brand_name;
    brand.username = req.query.tknuserid;
    var adata = { username: req.query.tknuserid, brand_name: req.body.brand_name, add_date: dateFormat(new Date(), 'yyyy-mm-dd') }
    Digital.savebrand(adata, function (err, srows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "message": 'server error' });
        }
        else {
            res.status(200).json({
                message: "Brand successfully created!",
                result: { 'brand_id': srows.insertId, 'brand_name': req.body.brand_name }
            });
        }
    });
})
router.post("/get_brands", authorize, (req, res) => {
    // var user_id = req.query.tknuserid;
     var user_id = req.body.user_id
     console.log(req.body);
     Digital.get_brands(user_id, function (err, result) {
         if (err) {
             return res.status(400).send({ 'error': err.toString() });
         } else {
             res.status(200).json({
                 data: result
             })
         }
     })
 })
router.post("/get_brand", authorize, (req, res) => {
    var user_id = req.query.tknuserid;
    var brand_id = req.body.brand_id
    console.log(req.body);
    Digital.get_brand(brand_id, user_id, function (err, result) {
        if (err) {
            return res.status(400).send({ 'error': err.toString() });
        } else {
            res.status(200).json(result)
        }
    })
})
router.post("/delete_brand", authorize, (req, res) => {
    var brand_id = req.body.brand_id;
    Digital.delete_brand(brand_id, function (err, result) {
        if (err) {
            return res.status(400).send({ 'message': err.toString() });
        } else {
            Digital.delete_brand_channels(brand_id, function (err, result) {
                if (err) {
                    return res.status(400).send({ 'error': err.toString() });
                } else {
                    res.status(200).json({
                        message: "Brand Deleted Successfully"
                    })
                }
            })
        }
    })
})
router.post('/brand_update', authorize, (req, res) => {
    console.log("hello");
    var brand = {}
    brand.brand_name = req.body.brand_name;
    brand.auto_share = req.body.auto_share;
    brand.update_date = dateFormat(new Date(), 'yyyy-mm-dd');
    var brand_id = req.body.brand_id;
    console.log(req.body)
    Digital.edit_brand(brand, brand_id, function (err, result) {
        if (err) {
            res.status(200).send({ message: err });
        } else {
            console.log(result);
            res.status(200).json({
                message: "Brand successfully updated!",
            });
        }
    })
})
router.post('/social_fb',authorize, async function(req, res){
    console.log("BODY:")
    console.log(req.body);
    var user_id = req.body.user_id;
    var brand_id = req.body.brand_id;
    var media = req.body.media_type;
    var usertoken = req.body.usertoken;
    var expiredate = req.body.expiry_date;
    var date = new Date(expiredate * 1000);
    console.log(date);
    Digital.getsocial_access(user_id,media,brand_id,async function (err, result) {
        if(err){
            console.log('err',err);
            res.status(404).json({
                message: 'Something went wrong!'
            })
        }else{
            console.log("here");
            console.log(result.length);
            if(result.length == 0){
                await urllib.request('https://graph.facebook.com/v13.0/oauth/access_token?grant_type=fb_exchange_token&client_id='+process.env.FB_APPID+'&client_secret='+process.env.FB_CLIENT_SECRET+'&fb_exchange_token=' + usertoken, { method: 'GET', headers: { 'Content-Type': 'application/json' } },async function (error, buffer) {
                    var jResp = JSON.parse(buffer); 
                    console.log('jResp',jResp);
                    var social = {};
                    social.access_customer_id = user_id
                    social.accessToken = jResp.access_token;
                    social.access_media = media
                    social.access_brand = brand_id
                    Digital.savesocialaccess(social,async function (err, result) {
                        if(err){
                            res.status(404).json({
                                message: err
                            })
                        }else{
                            res.status(200).json({
                                message: 'Access token saved successfully.'
                            })
                        }
                    })
                })
            }else{
                await urllib.request('https://graph.facebook.com/v13.0/oauth/access_token?grant_type=fb_exchange_token&client_id='+process.env.FB_APPID+'&client_secret='+process.env.FB_CLIENT_SECRET+'&fb_exchange_token=' + usertoken, { method: 'GET', headers: { 'Content-Type': 'application/json' } },async function (error, buffer) {
                    var jResp = JSON.parse(buffer);
                    console.log(jResp);
                    var social = {};
                    social.accessToken = jResp.access_token;
                    Digital.updatesocial_access(social,user_id,result[0].a_id,async function (err, result) {
                        if(err){
                            res.status(404).json({
                                msg: err
                            })
                        }else{
                            res.status(200).json({
                                msg: 'Access token update successfully.'
                            })
                        }
                    })
                })
            }
        }
    })
});
router.post("/getChannelsAll", authorize, async function (req, res) {
    console.log('body',req.body);
    console.log(req.query);
    console.log('getChannelsAll');
    var user_id = req.query.tknuserid;
    // var brand_id = req.body.brand_id;
    var access_media = req.body.access_media;
    var brand_id = req.body.brand_id
    var role = req.query.tknuserrole
    if (role == '1') {
        var managerid = await helper.GetManagerIdByAgent(req.query.tknuserid)
        user_id = managerid
    }
    console.log(user_id, brand_id)
    Digital.getchannel_check(user_id, brand_id, function (err, result) {
        if (err) {
            return res.status(200).send({ 'error': err.toString() });
        } else if (result && result.length > 0) {
            var decreased = result.map((element, i) => {
                return {
                    access_media: element.access_media,
                    page_id: element.page_id,
                    channel_name: element.channel_name,
                    channel_id: element.channel_id,
                    brand_id: element.brand_id,
                    channel_thumbnail: element.channel_thumbnail,
                    token: element.accessToken,
                    token_expire: element.token_expire,
                    assign_group: element.assign_group,
                }
            });
            return res.status(200).json({ 'data': decreased });
        } else {
            return res.status(200).send({ 'data': [] }); // changed for brandmangement 
        }
    })

});
router.post('/social_list', authorize, async function (req, res) {
    console.log('inn',req.body);
    var user_id = req.query.tknuserid;
    var brand_id = req.body.brand_id;
    Digital.getsocial_access_brand_id(user_id, brand_id, async function (err, result) {
        if (err) {
            res.status(result).json({
                msg: 'Something went wrong!'
            })
        } else {
            console.log('result',result);
            res.status(200).json({
                data: result
            })
        }
    })

})
router.post('/sync_fb_social', authorize, async function (req, res) {
    var accessToken = req.body.accessToken
    urllib.request(process.env.FBGRAPHAPIVERSION + '/me?fields=last_name,first_name,email,accounts.limit(500){best_page,name,access_token,picture{url}}&access_token=' + accessToken, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }, function (error, resp) {
        if (error) {
            return res.status(200).json({ 'error': error });
        }
        else {
            var str_resp = JSON.parse(resp);
            return res.status(200).json({ 'data': str_resp });
        }
    })
})
router.post('/FbAccess', authorize, async function (req, res) {
    console.log("BODY:")
    console.log(req.body);
    var channel_id = req.body.channel_id;
    console.log(channel_id);
    // var user_id = req.body.userid;
    var user_id = req.query.tknuserid
    var brand_id = req.body.brand_id;
    var page_id = req.body.page_id;
    var page_name = req.body.page_name;
    //var page_profile = req.body.page_profile;

     // if telemedia folder is not found then create directory 
     if (!fs.existsSync(path.join(__dirname, '/../telemedia/'))) {
        fs.mkdir(path.join(__dirname, '/../telemedia/'), (err) => {
            if (err) {
                 console.error(err);
            }
        });
    }

    // create directory user wise
    if (!fs.existsSync(path.join(__dirname, '/../telemedia/'+user_id))) {
        fs.mkdir(path.join(__dirname, '/../telemedia/'+user_id), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    var m = new Date();
    var fileid = 'channel_profile' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    var filename=path.join(__dirname, '/../telemedia/'+user_id+'/')+fileid+'.png';                                 
    page_profile = user_id+'/'+fileid+'.png'
     download(req.body.page_profile, filename, function(){
    });
    var media = req.body.media_type;
    console.log(brand_id);
    var exchange_token = req.body.accessToken;
    var user_token = req.body.user_token;
    var usertoken = req.body.usertoken;
    console.log("exchange_token" + exchange_token);
    var check_page = await helper.already_channel(page_id)
    if (check_page >= 1) {
        res.status(201).json({
            message: page_name + " Is already Channel Assign",
        })
    } else {
        console.log(check_page);
        Digital.getchannel(user_id, brand_id, media, page_id, function (err, srows) {
            if (err) {
                console.log(err);
                res.status(200).send({ "msg": 'server error' });
            }
            else {
                console.log(srows[0]);
                if (srows.length == 0) {
                    var channel = {}
                    channel.brand_id = brand_id;
                    channel.access_media = media;
                    urllib.request(process.env.FBGRAPHAPIVERSION+'oauth/access_token?grant_type=fb_exchange_token&client_id='+process.env.FB_APPID+'&client_secret='+process.env.FB_CLIENT_SECRET+'&fb_exchange_token=' + exchange_token, { method: 'GET', headers: { 'Content-Type': 'application/json' } }, function (err, buffer) {
                        if (err) {
                            return res.status(400).json({ 'msg': err.toString() });
                        }
                        jResp = JSON.parse(buffer);
                        console.log("hey" + JSON.stringify(jResp));
                        channel.page_id = page_id;
                        channel.channel_name = page_name;
                        channel.channel_thumbnail = page_profile;
                        channel.accessToken = jResp.access_token;
                        // channel.userToken = usertoken;
                        channel.access_expiry_date = jResp.expires_in;
                        urllib.request(process.env.FBGRAPHAPIVERSION+'oauth/access_token?grant_type=fb_exchange_token&client_id='+process.env.FB_APPID+'&client_secret='+process.env.FB_CLIENT_SECRET+'&fb_exchange_token=' + user_token, { method: 'GET', headers: { 'Content-Type': 'application/json' } }, function (error, buffer2) {
                            var jResp2 = JSON.parse(buffer2);
                            console.log('user_token',jResp2);
                            channel.user_Token = jResp2.access_token;
                            urllib.request(process.env.FBGRAPHAPIVERSION + page_id + '/subscribed_apps?access_token=' + jResp.access_token,
                                {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    data: { 'subscribed_fields': ['leadgen', 'feed','name','picture','messages',
                                    'messaging_postbacks','messaging_optins','messaging_optouts','message_deliveries','message_reads','messaging_payments',
                                    'messaging_pre_checkouts','messaging_checkout_updates','messaging_account_linking','messaging_referrals','message_echoes',
                                    'messaging_game_plays','standby','messaging_handovers','messaging_policy_enforcement',
                                    'message_reactions','inbox_labels','messaging_feedback','messaging_customer_information',''] },
                                    function(error, response) {
                                        if (error) {
                                            console.log("Error in Subcribing LEADGEN");
                                            console.log(error);
                                        }
                                        else {
                                            console.log(response);
                                        }
                                    }
                                });
                            urllib.request(process.env.FBGRAPHAPIVERSION + process.env.FB_BUSINESS_ID + '/client_pages',
                                {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    data: {
                                        'page_id': page_id,
                                        'permitted_tasks': ['ADVERTISE', 'ANALYZE'],
                                        'access_token': jResp.access_token,
                                    },
                                    function(error, response) {
                                        if (error) {
                                            console.log("Error becoming Advertiser");
                                            console.log(error);
                                        }
                                        else {
                                            console.log(response);
                                        }
                                    }
                                }
                            );
                            channel.username = user_id;
                            Digital.savechannel(channel, function (err, srows) {
                                if (err) {
                                    console.log(err);
                                    res.status(200).send({ "msg": 'server error' });
                                }
                                else {
                                    res.status(201).json({
                                        message: "Social User Access successfully Created!",
                                        'channel_id':srows.insertId
                                    })
                                }
                            });
                        })

                    });
                }
            }
        })
    }

})
router.post('/sync_instagram_social', authorize, async function (req, res) {
    var accessToken = req.body.accessToken
    urllib.request(process.env.FBGRAPHAPIVERSION + '/me?fields=last_name,first_name,email,accounts{instagram_business_account{name},name,access_token,picture{url}}&access_token=' + accessToken, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }, function (error, resp) {
        if (error) {
            return res.status(200).json({ 'error': error });
        }
        else {
            var str_resp = JSON.parse(resp);
            return res.status(200).json({ 'data': str_resp });
        }
    })
})
router.post("/delete_channels", authorize, (req, res) => {
    Digital.delete_channel_id(req.body.id, function (err, srows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).json({
                msg: "Delete Succesfull"
            })
        }
    });
})
router.post('/getChatUser', authorize, async function (req, res) {
    const user_id = req.query.tknuserid;
    const role = req.query.tknuserrole;
    console.log('user_id',user_id,' role ',role);
    Digital.getChatUser(user_id,role, function (err, rows) {
        console.log('chatuser rows',rows);
        if (err) {
            console.log(err);
            return res.status(200).send({ "msg": false,'data': [] });
        }
        else {
            return res.status(200).send({ 'data': rows })
        }
    })
});
router.post('/getChatUserNew', authorize, async function (req, res) {
    const user_id = req.query.tknuserid;
    console.log('user_id',user_id);
    const role = req.query.tknuserrole;
    Digital.getChatUserNew(user_id,role, function (err, rows) {
        if (err) {
            console.log(err);
            return res.status(200).send({ "msg": false ,'data': []});
        }
        else {
            return res.status(200).send({ 'data': rows })
        }
    })
});
router.post('/getCahtUserLive', authorize, async function (req, res) {
    user_id=req.query.tknuserid;
    console.log('user_id',user_id);
    role=req.query.tknuserrole;
    Digital.getCahtUserLive(user_id,role, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "msg": false });
        }
        else {
            return res.status(200).send({ 'data': rows })
        }
    })
});
router.post('/getChatUserArchive', authorize, async function (req, res) {
    const user_id = req.query.tknuserid;
    console.log('user_id',user_id);
    const role = req.query.tknuserrole;
    Digital.getChatUserArchive(user_id,role, function (err, rows) {
        if (err) {
            console.log(err);
            return res.status(200).send({ "msg": false,'data': [] });
        }
        else {
            return res.status(200).send({ 'data': rows })
        }
    })
});

router.post('/getChatdetails', authorize, async  function (req, res) {
   // user_id=req.body.tknuserid;
    console.log('getChatdetails',req.body.chat_id);
    Digital.getChatdetails(req.body.chat_id, async function (err, rows) {
        if (err) {
            console.log(err);
            return res.status(200).send({ "msg": false,'data': [] });
        }
        else {
            var chatuser = await helper.GetChat(req.body.chat_id)
            return res.status(200).send({ 'data': rows,'chatuser':chatuser })
        }
    })
});
router.post("/chatmemberlist", authorize, (req, res, next) => {
    var channelid = req.body.channelid;
    console.log('channelid')
    console.log(req.query)
    var role = req.query.tknuserrole
    if (role == '1') {
        Digital.get_message_user_data_by_channel_agent(channelid, req.query.tknuserid, function (error, data) {
            if (error) {
                return res.status(200).send({ 'msg': error });
            } else {
                return res.status(200).send({ 'data': data });
            }
        })
    } else {
        Digital.get_message_user_data_by_channel(channelid, function (error, data) {
            if (error) {
                return res.status(200).send({ 'msg': error });
            } else {
                return res.status(200).send({ 'data': data });
            }
        })
    }
})
router.post("/chatmemberlist_insta", authorize, (req, res, next) => {
    var channelid = req.body.channelid;
    console.log('channelid')
    var role = req.query.tknuserrole
    if (role == '1') {
        Digital.get_message_user_data_by_channel_insta_agent(channelid, req.query.tknuserid, function (error, data) {
            if (error) {
                return res.status(200).send({ 'msg': error });
            } else {
                return res.status(200).send({ 'data': data });
            }
        })
    } else {
        Digital.get_message_user_data_by_channel_insta(channelid, function (error, data) {
            if (error) {
                return res.status(200).send({ 'msg': error });
            } else {
                return res.status(200).send({ 'data': data });
            }
        })
    }
})
// Adds support for GET requests to our webhook
router.get('/webhook', (req, res) => {
    console.log('webhook',req.query);
    // Your verify token. Should be a random string.
    const VERIFY_TOKEN = process.env.FB_CALL_BACK_VERIFY_TOKEN;
     console.log('VERIFY_TOKEN',VERIFY_TOKEN);
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

// Creates the endpoint for your webhook
router.post('/webhook', (req, res) => {
    //console.log('webhook',req.body);
    let body = req.body;
    var users = {};
    // Checks if this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {
            //Lead Webhook
            if ("changes" in entry) {
                //console.log('entry',entry);
                //console.log('value',entry.changes[0].value.message);
                //console.log('filed',entry.changes[0].field);
                // Handle Page Changes event
                //let receiveMessage = new Receive();
                if (entry.changes[0].field === "feed") {
                    let change = entry.changes[0].value;
                    //console.log(change.from)
                    switch (change.item) {
                        case "post":
                            var action = change.verb
                            if (action == 'add') {
                                var pageid = change.from.id
                                var postid = change.post_id
                                handleFeed(pageid,postid,change);
                            }
                            return;
                        case "photo":
                            var action = change.verb
                            if (action == 'add') {
                                var pageid = change.from.id
                                var postid = change.post_id
                                handleFeed(pageid,postid,change);
                            }
                            return;
                        case "status":
                            var action = change.verb
                            if (action == 'add') {
                                var pageid = change.from.id
                                var postid = change.post_id
                                handleFeed(pageid,postid,change);
                            }
                            return;
                        case "video":
                            var action = change.verb
                            if (action == 'add') {
                                var pageid = change.from.id
                                var postid = change.post_id
                                handleFeed(pageid,postid,change);
                            }
                            return;
                        case "comment":
                            var action = change.verb
                            if (action == 'add') {
                                handleFeedComment(change);
                            }
                            return;
                        case "share":
                            var action = change.verb
                            if (action == 'add') {
                                handleFeedShare(change);
                            }
                            return;
                        case "reaction":
                            var action = change.verb
                            if (action == 'add') {
                                var pageid = change.from.id
                                var postid = change.post_id
                                handleFeedReaction(pageid,postid,change);
                            }
                            return;
                        default:
                            console.log(change.item + "== Unsupported feed change type.");
                            return;
                    }
                }
                if (entry.changes[0].field === "leadgen") {
                    console.log("Got into Change!");
                    console.log('leadgen',entry.changes);
                    let change = entry.changes[0].value;
                    //handleLead(change);
                    handleLead(change);
                    return;
                }
            }
            console.log('sender_action',entry);
            
            //   Gets the body of the webhook event
            let webhookEvent = entry.messaging[0];
            
            // Discard uninteresting events
            if ("read" in webhookEvent) {
                console.log('read',webhookEvent);
                const message_read_time=webhookEvent.read.watermark;
                const read_time=dateFormat(message_read_time, "yyyy-mm-dd HH:MM:ss");
                Digital.updateChatMessageReadTime(webhookEvent,read_time, function (err, user) {
                    if (err) {
                        console.log("User is unavailable:", err);
                    } else {
                        console.log('read_update',user);
                    }
                })
                
                // console.log("Got a read event");
                return;
            }

            if ("delivery" in webhookEvent) {
                // console.log("Got a delivery event");
                return;
            }

            if ("message" in webhookEvent) {
                // Get the sender PSID
                let senderPsid = sender_id = webhookEvent.sender.id;
                let receiverid = page_id = webhookEvent.recipient.id;
                console.log('Sender PSID: ' + senderPsid);
                if(webhookEvent.message.is_echo==true){
                    page_id = senderPsid;
                    sender_id = receiverid;
                }
                console.log('page_id: ' + page_id);
                Digital.getchannel_page_id(page_id, function (err, res) {
                    if (err) {
                        console.log("page token is unavailable:", err);
                    } else {
                        if(res.length>0){
                            let accessToken = res[0].accessToken;                 
                            Digital.get_message_user_data(sender_id, function (err, user) {
                                if (err) {
                                    console.log("User is unavailable:", err);
                                } else {
                                    if (user.length <= 0) {
                                        getUserProfile (sender_id,accessToken)
                                            .then(async userProfile =>{
                                                console.log('userProfile',userProfile)
                                                console.log('userProfile 1');
                                                var user = {}
                                                user.channel_type = 'facebook'
                                                user.channel_id = receiverid
                                                user.sender_id =  senderPsid
                                                user.first_name = userProfile.name?userProfile.name:'Guest User'
                                                console.log('userProfile_picture_data',userProfile.picture)
                                                if(userProfile.picture){
                                                    var pictureurl = ''
                                                    if(userProfile.picture.data){
                                                        pictureurl = userProfile.picture['data']['url']
                                                    }else{
                                                        pictureurl = userProfile.picture
                                                    }
                                                    //user.profile_pic = userProfile.picture
                                                    var m = new Date();
                                                    var fileid = 'user_profile' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
                                                    // create directory user wise
                                                    if (!fs.existsSync(path.join(__dirname, '/../telemedia/'+res[0].username))) {
                                                        fs.mkdir(path.join(__dirname, '/../telemedia/'+res[0].username), (err) => {
                                                            if (err) {
                                                                console.error(err);
                                                            }
                                                        });
                                                    }
                                                    var filename= path.join(__dirname, '/../telemedia/'+res[0].username+'/')+fileid+'.png';                                 
                                                    user.profile_pic = res[0].username+'/'+fileid+'.png'
                                                    download(pictureurl, filename, function(){
                                                    });
                                                }                                               
                                                Digital.getchannel_pages(page_id, user.channel_type, async function (err, data) {
                                                    if (err) {
                                                        console.log("User is data not save:", err);
                                                    } else {
                                                        if (data.length > 0) {
                                                            user.user_id = data[0].username
                                                            var manager_id = await helper.Getassign_group_id(user.user_id, user.channel_id, user.channel_type)
                                                            var agentid = await Digital.GetMessageAgent(manager_id, user.user_id)
                                                            user.agent_id = agentid
                                                            Digital.save_message_user(user, function (err, user1) {
                                                                if (err) {
                                                                    console.log("User is data not save:", err);
                                                                } else {
                                                                    var chat_id = user1.insertId
                                                                    handleMessage(senderPsid, webhookEvent, user.channel_type,chat_id);
                                                                    console.log("User data")
                                                                }
                                                            })
                                                        }
                                                    }
                                                })
                                            })
                                            .catch(error => {
                                                // The profile is unavailable
                                                console.log("Profile is unavailable:", error);
                                            })
                                            .finally(() => {
                                                //users[senderPsid] = user;
                                                // i18n.setLocale(user.locale);
                                                console.log(
                                                    "New Profile PSID:",
                                                    senderPsid,
                                                    "with locale:",
                                                    // i18n.getLocale()
                                                );
                                                //let receiveMessage = new Receive(users[senderPsid], webhookEvent);
                                                //return receiveMessage.handleMessage();
                                            });
                                    } else {
                                        if(user.length>0){
                                            let chat_id = user[0].chat_id;
                                            handleMessage(senderPsid, webhookEvent, 'facebook',chat_id);
                                        }
                                    }
                                }
                            })
                        }
                    }
                });
            }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } 
    else if (body.object === 'instagram') {
        console.log("Instagram event");
        // Iterates over each entry - there may be multiple if batched
        console.log(JSON.stringify(body))
        body.entry.forEach(function (entry) {
            let webhookEvent = entry.messaging[0];
            console.log(webhookEvent);
            if ("read" in webhookEvent) {
                console.log('read',webhookEvent);
                const message_read_time=webhookEvent.read.watermark;
                const read_time=dateFormat(message_read_time, "yyyy-mm-dd HH:MM:ss");
                
                Digital.updateChatMessageReadTime(webhookEvent,read_time, function (err, user) {
                    if (err) {
                        console.log("User is unavailable:", err);
                    } else {
                        console.log('read_update',user);
                    }
                })
                
                // console.log("Got a read event");
                return;
            }
            if ("message" in webhookEvent) {
                console.log("Instagram message here")
                let senderPsid =sender_id= webhookEvent.sender.id;
                let receiverid =page_id= webhookEvent.recipient.id;
                if(webhookEvent.message.is_echo==true){
                    page_id=senderPsid;
                    sender_id=receiverid;
                }
                console.log();
                Digital.get_message_user_data(sender_id, function (err, user) {
                    console.log('user_info',user);
                    let chat_id=user[0]?user[0].chat_id:'';
                    if (err) {
                        console.log("User is unavailable:", error);
                    } else {
                        console.log(user)
                        if (user.length <= 0) {
                            getUserProfile_instagram(senderPsid)
                                .then(userProfile => {
                                    console.log(userProfile)
                                    var user = {}
                                    user.channel_type = 'instagram'
                                    user.channel_id = receiverid
                                    user.sender_id = senderPsid
                                    user.first_name = userProfile.name
                                    if(userProfile.picture['data']['url']){
                                        //user.profile_pic = userProfile.picture
                                        var m = new Date();
                                        var fileid = 'user_profile' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
                                        var filename=path.join(__dirname, '/../telemedia/'+user_id[0].user_id+'/')+fileid+'.png';
                                        user.profile_pic = user_id[0].user_id+'/'+fileid+'.png'
                                        download(userProfile.picture['data']['url'], filename, function(){
                                        });
                                    }  
                                    
                                    //user.profile_pic = userProfile.profilePic
                                    Digital.getchannel_pages(receiverid, user.channel_type, async function (err, data) {
                                        if (err) {
                                            console.log("User is data not save:", err);
                                        } else {
                                            if (data.length > 0) {
                                                user.user_id = data[0].username
                                                var manager_id = await helper.Getassign_group_id(user.user_id, user.channel_id, user.channel_type)
                                                var agentid = await Digital.GetMessageAgent(manager_id, user.user_id)
                                                user.agent_id = agentid
                                                Digital.save_message_user(user, function (err, user1) {
                                                    if (err) {
                                                        console.log("User is data not save:", err);
                                                    } else {
                                                        chat_id=user1.insertId
                                                        handleMessage(senderPsid, webhookEvent, 'instagram',chat_id);
                                                        console.log("User data")
                                                    }
                                                })
                                            }
                                        }
                                    })
                                })
                                .catch(error => {
                                    // The profile is unavailable
                                    console.log("Profile is unavailable:", error);
                                })
                                .finally(() => {
                                   // handleMessage(senderPsid, webhookEvent, 'instagram',chat_id);

                                });
                        } else {
                            console.log("Already account save")
                            handleMessage(senderPsid, webhookEvent, 'instagram',chat_id);


                        }
                    }
                })
            }
           

        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.status(200).send('EVENT_RECEIVED');
    }
});

function handleLead(change){
    //console.log(change);
    Digital.getchannel_pages(change.page_id, 'facebook', async function (err, data) {
        if (err)
        {   
            console.log("db err");
        }else{
            if(data.length>0){
                var a_token= data[0].accessToken;
                var account_id = data[0].username;
                urllib.request(process.env.FBGRAPHAPIVERSION+change.leadgen_id+'?access_token='+a_token,{
                    method: 'GET',
                    timeout: 50000,
                    headers: {
                        'Content-Type': 'application/json'
                    }}, async function(error, resp) {
                    if (error){
                        console.log("FB error to get lead data using leadgen_id ==> "+change.leadgen_id);
                        console.log(error);
                    }
                    else
                    {   
                        console.log(JSON.parse(resp));
                        var f_arr = JSON.parse(resp)['field_data'];
                        console.log('f_arr:');
                        console.log(f_arr);
                        var lead = {};
                        lead.source="facebook";
                        lead.notes = "<div>"+JSON.stringify(f_arr)+"</div>";
                        var leadarr = {}
                        var cnt = 1
                        var fullmobile = ''
                        if(f_arr.length>0){
                            await f_arr.forEach(function(obj){
                                //console.log("-->"+obj)
                                if(obj.name==='EMAIL' || obj.name==='email' || obj.name==='email-id' || obj.name==='LEAD_EMAIL' || obj.name==='email_id'){
                                    lead.email_id=obj.values[0];
                                }
                                else if (obj.name==='PHONE' || obj.name==='phone' || obj.name==='phone_number' || obj.name==='contact_number' || obj.name==='LEAD_PHONE' || obj.name==='contact_number_'){
                                    lead.mobile_no=obj.values[0].substr(-10);
                                    fullmobile = obj.values[0]
                                }
                                else if (obj.name==='FULL_NAME' || obj.name==='full_name' || obj.name==='name_' || obj.name==='LEAD_NAME'){
                                    if(!lead.lead_name){
                                        lead.lead_name=obj.values[0];//.replace(/[^a-zA-Z ]/g, "");
                                    }
                                }
                                else if (obj.name==='COMPANY_NAME' || obj.name ==='company_name'){
                                    lead.company_name=obj.values[0];
                                }
                                leadarr[obj.name] = obj.values[0] 
                                // console.log("-->"+leadarr)    
                                if(cnt==f_arr.length){
                                    console.log(leadarr)
                                    var leaddata = {account_id:account_id,mobile:lead.mobile_no,email:lead.email_id,name:lead.lead_name,page_id:change.page_id,ads_id:change.ad_id,form_id:change.form_id,leadgen_id:change.leadgen_id,adgroup_id:change.adgroup_id,created_time:new Date(change.created_time * 1000),leaddata:JSON.stringify(leadarr)}
                                    Digital.insertadslead(leaddata,function(err,rows){
                                        console.log(err)
                                        var adleadid = rows.insertId
                                        var payload = {};
                                        payload.lead_source='facebook';
                                        payload.extraparams = leadarr;
                                        if (lead.mobile_no){
                                            payload.mobile=lead.mobile_no;
                                        }
                                        if (lead.email_id){
                                            payload.email=lead.email_id;
                                        }
                                        if(lead.lead_name){
                                            payload.name=lead.lead_name;
                                        }
                                        Digital.check_ads_by_id(change.ad_id,function(err,rows){
                                            if (err)
                                            {   
                                                console.log("db err");
                                            }
                                            else if (rows.length>0){
                                                var ads_name = rows[0].ads_name?rows[0].ads_name:''
                                                var categoryid = rows[0].automationSegmentID?rows[0].automationSegmentID:''
                                                var agentgroupid = rows[0].AgentGroupID?rows[0].AgentGroupID:''
                                                var leaddata = {account_id:account_id,mobile:payload.mobile,email:payload.email,name:payload.name,notes:lead.notes,lead_source:lead.source,category:categoryid,agentgroupid:agentgroupid,ads_id:change.ad_id,ad_leadid:adleadid,ads_name:ads_name,extraparams:payload.extraparams}
                                                if(agentgroupid!='' && agentgroupid!=null)
                                                    helper.GenerateLead(leaddata)
                                            }else{
                                                console.log('No Ads account mapped:'+adleadid)
                                            }
                                        });
    
                                        //Lead sent to third party API
                                        Digital.get_fb_thirdparty_data(account_id,function(err,rows){
                                            if (err)
                                            {   
                                                console.log("db err");
                                            }
                                            else if (rows.length>0){
                                                payload.full_mobile = fullmobile
                                                payload.username = rows[0].account_name
                                                payload.page_id = change.page_id
                                                payload.leadgen_id = change.leadgen_id
                                                payload.ad_id = change.ad_id
                                                payload.ad_leadid = adleadid
                                                leadthirdpartyapi(rows[0].endpoint_url,payload)
                                            }else{

                                            }
                                        })
                                        // if(result.user_id=='spgtech' || result.user_id=='mitusshar' || result.user_id=='rise'){
                                        //     payload.username = result.user_id
                                        //     payload.page_id = change.page_id
                                        //     payload.leadgen_id = change.leadgen_id
                                        //     payload.ad_id = change.ad_id
                                        //     payload.ad_leadid = adleadid
                                        //     leadthirdpartyapi('https://salesnayak.com/API/cloudXFacebook',payload)
                                        // }
                                    })
                                }
                                cnt = cnt + 1
                            });    
                        }
                    }
                });
            }else{
                console.log("No channel found for page ==> "+change.page_id);
            }
        } 
    });    
}

function leadthirdpartyapi(apipath,payload){
    urllib.request(apipath,{
        method: 'POST',
        timeout: 50000,
        data:payload,
        headers: {
            'Content-Type': 'application/json'
        }}, function(error, resp) {
        if (error){
            console.log(apipath+" == Lead API error:");
            console.log(error);
            Digital.updateadsleadbyid({lms_status:0},payload.ad_leadid)
        }
        else
        {
            console.log(resp);
            Digital.updateadsleadbyid({lms_status:2},payload.ad_leadid)
        }
    });
}

async function getUserProfile_instagram(senderPsid) {
    try {
        const userProfile = await callUserProfile_InstagramAPI(senderPsid);

        for (const key in userProfile) {
            const camelizedKey = camelCase(key);
            const value = userProfile[key];
            delete userProfile[key];
            userProfile[camelizedKey] = value;
        }

        return userProfile;
    } catch (err) {
        console.log("Fetch failed:", err);
    }
}

function callUserProfile_InstagramAPI(senderPsid) {
    return new Promise(function (resolve, reject) {
        let body = [];

        // Send the HTTP request to the Graph API
        request({
            uri: process.env.FBGRAPHAPIVERSION + senderPsid,
            qs: {
                access_token: process.env.PAGE_ACCESS_TOKEN_INSTA,
                fields: "name,profile_pic"
            },
            method: "GET"
        })
            .on("response", function (response) {
                // console.log(response.statusCode);

                if (response.statusCode !== 200) {
                    reject(Error(response.statusCode));
                }
            })
            .on("data", function (chunk) {
                body.push(chunk);
            })
            .on("error", function (error) {
                console.error("Unable to fetch profile:" + error);
                reject(Error("Network Error"));
            })
            .on("end", () => {
                body = Buffer.concat(body).toString();
                // console.log(JSON.parse(body));

                resolve(JSON.parse(body));
            });
    });
}

function handleMessage(senderPsid, event, channeltype,chat_id) {
    console.log('chat_id',chat_id);
    let response;
    try {
        console.log("try Work")
        if (event.message) {
            let receivedMessage = event.message;
            let receiverid = event.recipient.id;
            // Checks if the message contains text
            if (receivedMessage.text) {
                // Create the payload for a basic text message, which
                // will be added to the body of your request to the Send API
                response = {
                    'text': `You sent the message: '${receivedMessage.text}'. Now send me an attachment!`
                };
            } else if (receivedMessage.attachments) {

                // Get the URL of the message attachment
                let attachmentUrl = receivedMessage.attachments[0].payload.url;
                response = {
                    'attachment': {
                        'type': 'template',
                        'payload': {
                            'template_type': 'generic',
                            'elements': [{
                                'title': 'Is this the right picture?',
                                'subtitle': 'Tap a button to answer.',
                                'image_url': attachmentUrl,
                                'buttons': [
                                    {
                                        'type': 'postback',
                                        'title': 'Yes!',
                                        'payload': 'yes',
                                    },
                                    {
                                        'type': 'postback',
                                        'title': 'No!',
                                        'payload': 'no',
                                    }
                                ],
                            }]
                        }
                    }
                };
            }
            if (receivedMessage.is_echo == true) {
                console.log("message RECEVIE")
                var message = {}
                message.chat_id = chat_id
                message.message_mid = receivedMessage.mid
                message.chat_text = receivedMessage.text
                //message.timestamp = event.timestamp
               // message.type = 1
                if (receivedMessage.attachments) {
                    console.log(receivedMessage.attachments[0].payload.url)
                    message.attachement = receivedMessage.attachments[0].payload.url
                    message.option_type = receivedMessage.attachments[0].type
                }
                console.log(message)
                Digital.updateChatLiveStatus(chat_id, function (err, user) {
                    if (err) {
                        console.log("Message Not Save:", err);
                    } else {
                    }
                });
                
                Digital.save_message(message, function (err, user) {
                    if (err) {
                        console.log("Message Not Save:", err);
                    } else {
                        console.log('Message Save')
                        Digital.get_message_to_user_username(chat_id, async function (err, user1) {
                            console.log('get_message_to_user_username',user1);
                            if (err) {
                                console.log("Message Not Save:", err);
                            } else {
                                console.log('Message Username')
                                if (user1.length > 0) {
                                    var user_
                                    var manager_id
                                    if (user1[0].agent_id == 0) {
                                        user_ = user1[0].username
                                        manager_id = user1[0].user_id
                                    } else {
                                        user_ = user1[0].agent_id
                                        manager_id = user1[0].user_id
                                    }
                                    var socketendpoint = await helper.GetSocketDomain(manager_id,2)
                                    var options = {
                                        'method': 'POST',
                                        'url': "https://"+socketendpoint+'/socketapi/chatincoming',
                                        'headers': {
                                            'Content-Type': 'application/x-www-form-urlencoded'
                                        },
                                        form: {
                                            'userid': user_,
                                            'manager_id':manager_id,
                                            'senderid':user1[0].sender_id,
                                            'sendername':user1[0].first_name,
                                            'chatid':chat_id,
                                            'chatdata':JSON.stringify(user1) 
                                        }
                                    };
                                    request(options, function (error, response) {
                                        if (error) {
                                            console.log(error)
                                        }
                                    });
                                    //Send Firebase
                                    //helper.SendFirebaseNotification(user_,'New facebook message',receivedMessage.text)
                                }
                            }
                        })
                    }
                })

            } else {
                var message = {}
                message.chat_id = chat_id
                message.message_mid = receivedMessage.mid
                message.chat_text = receivedMessage.text
                message.is_echo = 1
               // message.type = 0
                if (receivedMessage.attachments) {
                    console.log(receivedMessage.attachments[0].payload.url)
                    message.attachement = receivedMessage.attachments[0].payload.url
                    message.option_type = receivedMessage.attachments[0].type
                }
               
                //console.log(message)
                Digital.save_message(message, function (err, user) {
                    if (err) {
                        console.log("Message Not Save:", err);
                    } else {
                        console.log('Message Save')
                        Digital.get_message_to_user_username(chat_id, async function (err, user1) {
                            console.log('get_message_to_user_username',user1);
                            if (err) {
                                console.log("Message Not Save:", err);
                            } else {
                                if (user1.length > 0) {
                                    var user_
                                    var manager_id = 0
                                    if (user1[0].agent_id == 0) {
                                        user_ = user1[0].username
                                        manager_id = user1[0].user_id
                                    } else {
                                        user_ = user1[0].agent_id
                                        manager_id = user1[0].user_id
                                    }
                                    var socketendpoint = await helper.GetSocketDomain(manager_id,2)
                                    var options = {
                                        'method': 'POST',
                                        'url': "https://"+socketendpoint+'/socketapi/chatincoming',
                                        'headers': {
                                            'Content-Type': 'application/x-www-form-urlencoded'
                                        },
                                        form: {
                                            'userid': user_,
                                            'manager_id':manager_id,
                                            'senderid':user1[0].sender_id,
                                            'sendername':user1[0].first_name,
                                            'chatid':chat_id,
                                            'chatdata': JSON.stringify(user1[0]) 
                                        }
                                    };
                                    request(options, function (error, response) {
                                        if (error) {
                                            console.log(error)
                                        }
                                    });
                                    //Send Firebase
                                    helper.SendFirebaseChatNotification(user_,'New facebook message',receivedMessage.text,chat_id)
                                }
                            }
                        })
                    }
                })

            }

            // Send the response message
            //callSendAPI(senderPsid, response);    
        } else if (event.postback) {
            //handlePostback(senderPsid, event.postback);
        }
    } 
    catch (error) {
        console.log("catch Work")
        console.log(error);
        responses = {
            text: `An error has occured: '${error}'. We have been notified and \
            will fix the issue shortly!`
        };
    }
    

}

async function getUserProfile(senderPsid,accessToken) {
    try {
        const userProfile = await callUserProfileAPI(senderPsid,accessToken);
        console.log('this');
        console.log(userProfile);
        for (const key in userProfile) {
            const camelizedKey = camelCase(key);
            const value = userProfile[key];
            delete userProfile[key];
            userProfile[camelizedKey] = value;
        }

        return userProfile;
    } catch (err) {
        console.log("Fetch failed:", err);
    }
}


function callUserProfileAPI(senderPsid,accessToken) {
    return new Promise(function (resolve, reject) {
        let body = [];
        console.log(process.env.FBGRAPHAPIVERSION + senderPsid+'?access_token'+accessToken)
        // Send the HTTP request to the Graph API
        request({
            uri: process.env.FBGRAPHAPIVERSION + senderPsid,
            qs: {
                access_token: accessToken,
                fields: "name,picture"
            },
            method: "GET"
        })
            .on("response", function (response) {
                //console.log(response);

                if (response.statusCode !== 200) {
                    reject(Error(response.statusCode));
                }
            })
            .on("data", function (chunk) {
                body.push(chunk);
            })
            .on("error", function (error) {
                console.error("Unable to fetch profile:" + error);
                reject(Error("Network Error"));
            })
            .on("end", () => {
                body = Buffer.concat(body).toString();
                // console.log(JSON.parse(body));

                resolve(JSON.parse(body));
            });
    });
}

router.post('/sendchatmessage',authorize, async function (req, res) {
    // The page access token we have generated in your app settings
    var userrole = req.query.tknuserrole;
    var user_id=req.query.tknuserid;
    if(userrole==1){
        user_id = await helper.GetManagerIdByAgent(user_id)
    }
   
    var channel_media = req.body.channel_media
    var msg = req.body.message;
    var receiverid = req.body.receiverid;
    var senderid = req.body.senderid;
    var attachment = req.body.attachment;
    var attachmentType = req.body.attachmentType;
    if (channel_media != 'whatsapp'){
        PAGE_ACCESS_TOKEN = await helper.getChannelToken({"sender_id":senderid,"user_id":user_id});
    }
    if (channel_media == 'facebook') {
       // var PAGE_ACCESS_TOKEN = req.body.token
        if (msg != '') {
            console.log('msg work')
            response = {
                'text': msg
            };
            // Construct the message body
            let requestBody = {
                'recipient': {
                    'id': receiverid
                },
                'message': response
            };
            // Send the HTTP request to the Messenger Platform
            request({
                'uri': process.env.FBGRAPHAPIVERSION + 'me/messages',
                'qs': { 'access_token': PAGE_ACCESS_TOKEN },
                'method': 'POST',
                'host': '31.13.79.18',
                'port': '443',
                'json': requestBody
            }, (err, _res, _body) => {
                console.log('error',err);
                if (!err) {
                    return res.status(200).send({ "msg": "Message Sent!" });
                } else {
                    console.error('Unable to send message:' + err);
                    return res.status(200).send({ "msg": "Unable to send message", "iserror": true });
                }
            });
        }else if (attachment != '') {
            console.log('Attacment work')
            var attachtype = 'image'
            if (attachmentType.includes('video')) {
                attachtype = 'video'
            }
            if (attachmentType.includes('pdf')) {
                attachtype = 'file'
            }
            console.log('attachtype',attachtype);
            var response = {
                "attachment": {
                    "type": attachtype,
                    "payload": {
                        "url": attachment,
                        "is_reusable": true
                    }
                }
            };
            // Construct the message body
            let requestBody = {
                'recipient': {
                    'id': receiverid
                },
                'message': response
            };
            // Send the HTTP request to the Messenger Platform
            request({
                'uri': process.env.FBGRAPHAPIVERSION + 'me/messages',
                'qs': { 'access_token': PAGE_ACCESS_TOKEN },
                'method': 'POST',
                'host': '31.13.79.18',
                'port': '443',
                'json': requestBody
            }, (err, _res, _body) => {
                console.log(err);
                console.log(_res);
                if (!err) {
                    return res.status(200).send({ "msg": "Message Sent!" });
                  
                } else {
                    console.error('Unable to send message:' + err);
                    return res.status(200).send({ "msg": "Unable to send message", "iserror": true });
                }
            });
        }else{
            return res.status(200).send({ "msg": "Please type message or upload attachment!", "iserror": true });
        }
    } 
    else if (channel_media == 'instagram') {
        //var PAGE_ACCESS_TOKEN = req.body.token
        if (msg != '') {
            console.log('Insta msg work')
            response = {
                'text': msg
            };
            // Construct the message body
            let requestBody = {
                'recipient': {
                    'id': receiverid
                },
                'message': response
            };
            // Send the HTTP request to the Messenger Platform
            console.log(requestBody)
            request({
                'uri': process.env.FBGRAPHAPIVERSION + 'me/messages',
                'qs': { 'access_token': PAGE_ACCESS_TOKEN },
                'method': 'POST',
                'json': requestBody
            }, (err, _res, _body) => {
                if (!err) {
                    console.log(_body);
                    return res.status(200).send({ "msg": "Message Sent!" });
                } else {
                    console.error('Unable to send message:' + err);
                    return res.status(200).send({ "msg": "Unable to send message", "iserror": true });
                }
            });
        }else if (attachment != '') {
            console.log('instagram Attacment work')
            var attachtype = 'image';
            if (attachmentType.includes('video')) {
                attachtype = 'video'
            }
            response = {
                "attachment": {
                    "type": attachtype,
                    "payload": {
                        "url": attachment,
                        "is_reusable": true
                    }
                }
            };
            // Construct the message body
            let requestBody = {
                'recipient': {
                    'id': receiverid
                },
                'message': response
            };
            // Send the HTTP request to the Messenger Platform
            request({
                'uri': process.env.FBGRAPHAPIVERSION + 'me/messages',
                'qs': { 'access_token': PAGE_ACCESS_TOKEN },
                'method': 'POST',
                'json': requestBody
            }, (err, _res, _body) => {
                if (!err) {
                    return res.status(200).send({ "msg": "Message Sent!" });
                   
                } else {
                    console.error('Unable to send message:' + err);
                    return res.status(200).send({ "msg": "Unable to send message", "iserror": true });
                }
            });
        }else{
            return res.status(200).send({ "msg": "Please type message or upload attachment!", "iserror": true });
        }
    }
    else if(channel_media == 'whatsapp'){
        if (attachment != '') {
            msg = attachment;
        }
        var account_id = req.query.tknuserid;
        var userrole = req.query.tknuserrole;
        if (userrole == 1) {
            var managerid = await helper.GetManagerIdByAgent(account_id)
            account_id = managerid
        }
        //req.body.setting_name = "whatsup_api";
        ERP.getwhatsupapidetail({account_id:account_id}, async function (err, rows) {
            if (err) {
                console.log(err);
                return res.status(200).send({ 'msg': 'Whatsapp api not found!' });
            }
            else {
                if (rows.length > 0) {
                    console.log('rows',rows);
                    var apidata = rows[0]
                    var url = apidata.api_endpoint
                    var attachurl = apidata.api_endpoint
                   // var msg = req.body.message;
                    var mobile = senderid; //req.body.mobile.substr(-10)
                    if(url!=null && url!=''){
                        url = url.replace('{mobile}', mobile).replace('{text}', msg);
                        var method = apidata.api_method
                        var payload = apidata.api_payload != null ? apidata.api_payload.replace('{mobile}', mobile).replace('{text}', req.body.message).replace('{link}', '') : {}
                        var header = apidata.api_header != null ? apidata.api_header : {}
                        var headertype = apidata.api_header_type
                    
                        var request = require('request');
                        if (headertype == 'json') {
                            var options = {
                                'method': method,
                                'url': url,
                                'headers': header,
                                body: JSON.stringify(payload)
                            };
                        } else {
                            var options = {
                                'method': method,
                                'url': url,
                                'headers': header,
                                form: JSON.parse(payload)
                            };
                        }
                        request(options, async function (error, response) {
                            console.log(error);
                            console.log(response.body);
                            var sdata = { account_id: req.query.tknuserid, message: msg, mobile: mobile,live_status:1 }
                            await helper.AddWhatsappChat(sdata);
                            await helper.ChatUpdateInLive(sdata);
                        
                            return res.status(200).send({ 'msg': 'Messgae sent!' });
                        
                        });
                    }else{
                        return res.status(200).send({ 'msg': 'Whatsapp api not found!' });
                    }
                } else {
                    return res.status(200).send({ 'msg': 'Whatsapp api not found!' });
                }
            }
        });
        /*
        var options = {
            
            method: 'GET',
            url: 'https://panel.rapiwha.com/send_message.php',
            qs: {apikey: process.env.WHATSAPP_TOKEN, number: senderid, text: msg}
          };
          request(options, function (error, response, body) {
            if (error) throw new Error(error);
             console.log('whatsapp.com',body);
          });
          */
    }else{
        return res.status(200).send({ 'msg': 'Channel not found!' });
    }
});

router.post("/memberchatlist", authorize, (req, res, next) => {
    var senderid = req.body.senderid;
    Digital.get_message_data_sender(senderid, function (error, data) {
        if (error) {
            return res.status(200).send({ 'msg': error });
        } else {
            return res.status(200).send({ 'data': data });
        }
    })
})

router.post('/uploadthumbnail',multer().single('file'),authorize,async function (req, res) {
    var userrole = req.query.tknuserrole;
    var user_id = req.query.tknuserid;
    if(userrole==1){
        user_id = await helper.GetManagerIdByAgent(user_id)
    }
    // if telemedia folder is not found then create directory 
    if (!fs.existsSync(path.join(__dirname, '/../telemedia/'))) {
        fs.mkdir(path.join(__dirname, '/../telemedia/'), (err) => {
            if (err) {
                 console.error(err);
            }
        });
    }

    // create directory user wise
    if (!fs.existsSync(path.join(__dirname, '/../telemedia/'+user_id))) {
        fs.mkdir(path.join(__dirname, '/../telemedia/'+user_id), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    if (!fs.existsSync(path.join(__dirname, '/../telemedia/'+user_id+'/default'))) {
        fs.mkdir(path.join(__dirname, '/../telemedia/'+user_id+'/default'), (err) => {
            if (err) {
                console.log(err);
            }
            else{
                var media = {}
                media.access_customer_id = user_id
                media.name =  'default'
                media.temp_name = 'default'
                media.temp_path =user_id+'/default'
                Digital.create_bucket(media, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        });
    }
    var m = new Date();
    var fileid = 'media' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    Digital.list_bucket_default(user_id,'default',function (err, result) {
        if (err) {
            console.log(err);
            res.status(200).json({
                msg: err
            })
        } else {
            if (result.length) {
                var filename = fileid+ '.' +mime.getExtension(req.file.mimetype);
                var folder_name = result[0].temp_path;
                var imagepreview = folder_name+'/'+filename;
                const filePath = path.join(__dirname, '../telemedia/'+folder_name, `${filename}`);
                var wstream = fs.createWriteStream(filePath);
                wstream.write(req.file.buffer);
                let data = {}
                data.bucket_id = result[0].B_id
                data.access_customer_id = user_id
                data.file_name = filename
                data.file_size = req.file.size
                data.file_type = req.file.mimetype
                data.thumbnail = req.body.thumbnail
            // var change = presignedUrl
                data.file_preview = folder_name
                Digital.create_bucket_file(data, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.status(200).json({
                            msg: err
                        })
                    } else {
                        res.status(200).json({
                            msg: 'File successfully Upload.',
                            filePath:imagepreview,
                            F_id:result.insertId,
                            file_type:req.file.mimetype
                        })
                    }
                })
            }else{
                console.log(err); 
                res.status(200).json({
                    msg: 'bucket not found.'
                }) 
            }
        }
    })
})

router.post('/create_folder', authorize, async function (req, res) {
    // if telemedia folder is not found then create directory 
    if (!fs.existsSync(path.join(__dirname, '/../telemedia/'))) {
        fs.mkdir(path.join(__dirname, '/../telemedia'), (err) => {
            if (err) {
                 console.error(err);
            }
        });
    }

    // create directory user wise
    if (!fs.existsSync(path.join(__dirname, '/../telemedia/'+req.body.user_id))) {
        fs.mkdir(path.join(__dirname, '/../telemedia/'+req.body.user_id), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }

    if (fs.existsSync(path.join(__dirname, '/../telemedia/'+req.body.user_id+'/'+req.body.name))) {
        res.status(200).json({
            message: 'Folder already exists.'
        })
        return ;
    }else{
        fs.mkdir(path.join(__dirname, '/../telemedia/'+req.body.user_id+'/'+req.body.name), (err) => {
            if (err) {
                return console.error(err);
            }
            else{
                var media = {}
                media.access_customer_id = req.body.user_id
                media.name =  req.body.name
                media.temp_name = req.body.name
                media.temp_path =req.body.user_id+'/'+req.body.name
                Digital.create_bucket(media, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.status(200).json({
                            message: err
                        })
                    } else {
                        res.status(200).json({
                            message: 'Created Folder successfully.'
                        })
                    }
                })
            }
        });
    }
})

router.get('/get_folder', authorize, async function (req, res) {
    Digital.get_bucket(req.query.tknuserid, function (err, result) {
        if (err) {
            res.status(404).json({
                message: err
            })
        } else {
            res.status(200).json({
                data: result
            })
        }
    })
})

router.post('/delete_folder', authorize, async function (req, res) {
    console.log(req.body);
    Digital.delete_bucket(req.query.tknuserid, req.body.id, function (err, result) {
        if (err) {
            res.status(404).json({
                message: err
            })
        } else {
            res.status(200).json({
                message: 'Delete Folder successfully.'
            })
        }
    })
})

router.post('/get_folder_name', authorize, async function (req, res) {
    Digital.list_bucket(req.body.bucket_id, function (err, result) {
        if (err) {
            res.status(404).json({
                msg: err
            })
        } else {
            res.status(200).json({
                data: result
            })
        }
    })
})

router.post('/get_file', authorize, async function (req, res) {
     Digital.get_bucket_file(req.body.bucket_id, req.query.tknuserid, function (err, result) {
         if (err) {
             res.status(404).json({
                 msg: err
             })
         } else {
             res.status(200).json({
                 data: result
             })
         }
     })
})

router.post('/delete_file', authorize, async function (req, res) {
    var data = req.body
    //console.log(data);
    // return
    Digital.list_bucket(req.body.bucket_id, function (err, result) {
        if (err) {
            res.status(404).json({
                message: err
            })
        } else {
            if (result.length) {
                    var folder_name = result[0].name
                    Digital.delete_bucket_file(data.file_name, data.bucket_id, data.file_type, req.query.tknuserid, function (err, result) {
                        if (err) {
                            res.status(200).json({
                                message: err
                            })
                        } else {
                            res.status(200).json({
                                message: 'Delete File successfully.'
                            })
                        }
                    })
            }else{
                res.status(200).json({
                    message: 'File not found.'
                })
            }
        }
    })

})

router.post('/upload_media_file', multer().single('file'), authorize, async function (req, res) {
    var name=req.body.name;
    //console.log(req.body);
    //console.log(req.file);
    var m = new Date();
    var fileid = 'media' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
    Digital.list_bucket(req.body.bucket_id, function (err, result) {
        if (err) {
            console.log(err);
            res.status(200).json({
                message: err
            })
        } else {
            if (result.length) {
                var filename=fileid+ '.' +mime.getExtension(req.file.mimetype);
                var folder_name = result[0].temp_path;
                const filePath = path.join(__dirname, '../telemedia/'+folder_name, `${filename}`);
                // create directory user wise
                console.log(folder_name);
                if (!fs.existsSync(path.join(__dirname, '/../telemedia/'+folder_name))) {
                    fs.mkdir(path.join(__dirname, '/../telemedia/'+folder_name), (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
                var wstream = fs.createWriteStream(filePath);
                wstream.write(req.file.buffer);

                let data = {}
                data.bucket_id = req.body.bucket_id
                data.access_customer_id = req.query.tknuserid
                data.file_name = filename
                data.file_size = req.file.size
                data.file_type = req.file.mimetype
                data.thumbnail = req.body.thumbnail
               // var change = presignedUrl
                data.file_preview = folder_name
                Digital.create_bucket_file(data, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.status(200).json({
                            message: err
                        })
                    } else {
                        res.status(200).json({
                            message: 'File successfully Upload.'
                        })
                    }
                })
            }else{
                console.log(err); 
                res.status(200).json({
                    message: 'Folder not found.Please create folder first.'
                })
            }
        }
    })    
})

router.get('/gethuntgroup/:id', authorize, function (req, res) {
    //console.log(req.params.id);gethuntgroup
    Digital.gethuntgroup(req.params.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
})

router.post('/assign_group_channel', authorize, async function (req, res) {
    console.log(req.body);
    Digital.assign_chat_channels(req.body.group, req.body.channel_id, function (err, srows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            res.status(200).json({
                message: "Channel Assign For Chat",
            })
        }
    })
})

router.post('/update_message_user', async function (req, res) {
    console.log(req.body)
    console.log("Start")
    var chat_id = req.body.chat_id
    delete req.body.u_id
    console.log(req.body)
    Digital.update_user_message(req.body, chat_id, function (err, rows) {
        if (err) {
            console.log(err)
            res.status(200).send({ "msg": 'Something went wrong!' });
        }
        else {
            console.log(rows)
            return res.status(200).send({ "msg": "Data updated successfully." });
        }
    })

})

router.post('/assign_chat', authorize, function (req, res) {
    const agent_id = req.body.agent_id
    const chat_id = req.body.chat_id
    console.log(req.body.u_id)
    Digital.assign_message_user(agent_id, chat_id, function (err, result) {
        if (err) {
            return res.status(200).json({ 'data': err});
        } else {
            return res.status(200).json({ 'data': 'Chat Assign sucessfully.' });
        }
    })
})

router.post('/add_lead', authorize, async function (req, res) {
    console.log('body',req.body);
    var userdata ={};
    var account_id = req.query.tknuserid
    var role = req.query.tknuserrole
    var agentid = 0
    if (role == 1) {
        agentid = account_id
        account_id = await helper.GetManagerIdByAgent(account_id)
    }
    userdata.account_id = account_id;
    userdata.mobile = req.body.mobile?req.body.mobile:''
    userdata.name = req.body.first_name?req.body.first_name:''
    userdata.email = req.body.email?req.body.email:''
    userdata.lead_source = 'Chat'
    userdata.city = req.body.city?req.body.city:''
    userdata.notes = req.body.description?req.body.description:''
    userdata.chat_id = req.body.chat_id
    if (agentid > 0) {
        userdata.agent_id = agentid;
    }
    var leadstatus = await helper.GenerateLead(userdata)
    console.log('leadstatus',leadstatus)
    Digital.update_user_message(req.body, req.body.chat_id, function (err, rows) {
        if (err) {
            console.log(err)
        }
        else {
            console.log(rows)
        }
    })
    return res.status(200).send({ "data": "Lead created successfully" });
})

router.post('/saved_leads_campaign', authorize, function (req, res) {
    customerid = req.query.tknuserid
    Digital.sync_ads_automation(customerid,function(err , rows){
        if(err){
            console.log(err)
            return res.status(200).send({ 'data': [] });
        }else{
            if(rows.length>0){
                return res.status(200).send({ 'data': rows });
            }else{
                return res.status(200).send({ 'data': [] });
            }
        }
    })
});

// Get Google ads oAuth Link
router.route('/googleadslink',authorize).get((req, res) => {
    res.status(200).send({ 'url': googlead.generateAuthenticationUrl() });
})

router.post('/saved_leads_campaign_google', authorize, function (req, res) {
    customerid = req.query.tknuserid;
    Digital.sync_ads_automation_google(customerid,function(err , rows){
        if(err){
            console.log(err)
            return res.status(200).send({ 'data': [] });
        }else{
            if(rows.length>0){
                return res.status(200).send({ 'data': rows });
            }else{
                return res.status(200).send({ 'data': [] });
            }
        }
    })
})

router.post('/change_campaign_status', authorize, function (req, res) {
    var customerid = req.body.userid;
    var campaignid = req.body.campaign_id
    var status = req.body.status
    console.log(req.body)
    Digital.getchannelByUserIdAccessMedia({ access_customer_id: customerid, access_media: 'facebook' }, function (err, useraccess) {
        if (useraccess && useraccess.length > 0) {
            console.log();
            var access_fbtoken = (useraccess[0].accessToken);
            urllib.request(process.env.FBGRAPHAPIVERSION + campaignid + '?status=' + status + '&access_token=' + access_fbtoken, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, function (error, resp) {
                if (error) {
                    return res.status(200).json({ 'error': error });
                }
                else {

                    var result = JSON.parse(resp);
                    console.log(result.success)
                    if (result.success == true) {
                        console.log("done")
                        var campaign = {};
                        campaign.campaign_status = status;
                        Digital.CampaignUpdateMany({ campaign_id: campaignid }, campaign).then((response) => {
                            res.status(201).json({
                                message: "Social User Updated successfully !",
                                result: response
                            });
                        }).catch(error => {
                            res.status(500).json({
                                error: error
                            });
                        });
                    }
                    // return res.status(200).send(result);

                }
            });

        }
        else {
            return res.status(200).send('error ' + err);

        }
    });
});

router.post('/sync_facebook_leads', authorize, function (req, res) {
    var user_id =  req.query.tknuserid;
    var adid = req.body.ads_id
    var page_id = req.body.page_id
    Digital.get_adsbyid(adid,user_id,async function(err , arows){
        //console.log(arows)
        if (err) {
            return res.status(200).send({ 'msg': 'Invalid Ad ID' });
        }else{
            if(arows.length>0){
                var adsconfig = arows[0]
                var ads_id = adsconfig['ads_id']
                Digital.check_channel_data(page_id,user_id,'facebook',async function(err , rows){
                    if (err) {
                        return res.status(200).send({ 'msg': 'Invalid Channel' });
                    }else{
                        //console.log(rows)
                        if(rows.length>0){
                            var channeldata = rows[0]
                            var accessToken = channeldata['accessToken']
                            console.log(process.env.FBGRAPHAPIVERSION+ ads_id + '/leads?limit=1000&access_token=' + accessToken)
                            urllib.request(process.env.FBGRAPHAPIVERSION + ads_id + '/leads?limit=500&access_token=' + accessToken, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            },async function (error, resp) {
                                console.log(error)
                                console.log(JSON.parse(resp))
                                if (error) {
                                    return res.status(200).send({ 'msg': error });
                                }
                                else {
                                    var leads = JSON.parse(resp).data;
                                    console.log(resp)
                                    if(leads.length>0){
                                        var lcnt = 1
                                        leads.forEach(async lead => {
                                            console.log(lead)
                                            var leadgen_id = lead['id']
                                            var leadgen_data = lead['field_data']
                                            var created_time = lead['created_time']
                                            var cnt = 1
                                            var leadarr = {}
                                            var lead = {};
                                            await leadgen_data.forEach(function(obj){
                                                //console.log("-->"+obj)
                                                if(obj.name==='EMAIL' || obj.name==='email' || obj.name==='email-id'  || obj.name==='LEAD_EMAIL' || obj.name==='email_id' ){
                                                    lead.email_id=obj.values[0];
                                                }
                                                else if (obj.name==='PHONE' || obj.name==='phone' || obj.name==='phone_number' || obj.name==='contact_number' || obj.name==='LEAD_PHONE'  || obj.name==='contact_number_' ){
                                                    lead.mobile_no=obj.values[0].substr(-10);
                                                }
                                                else if (obj.name==='FULL_NAME' || obj.name==='full_name' || obj.name==='name_' || obj.name==='LEAD_NAME'){
                                                    lead.lead_name=obj.values[0].replace(/[^a-zA-Z ]/g, "");
                                                }
                                                else if (obj.name==='COMPANY_NAME' || obj.name ==='company_name'){
                                                    lead.company_name=obj.values[0];
                                                }
                                                leadarr[obj.name] = obj.values[0]
                                                if(cnt==leadgen_data.length){
                                                    console.log(leadarr)
                                                    var leaddata = {mobile:lead.mobile_no,email:lead.email_id,name:lead.lead_name,leaddata:JSON.stringify(leadarr)}
                                                    Digital.checkadslead(leadgen_id,function(err,rows){
                                                        var payload = {};
                                                        payload.lead_source='facebook';
                                                        payload.extraparams = leadarr;
                                                        if (lead.mobile_no){
                                                            payload.mobile=lead.mobile_no;
                                                        }
                                                        if (lead.email_id){
                                                            payload.email=lead.email_id;
                                                        }
                                                        if(lead.lead_name){
                                                            payload.name=lead.lead_name;
                                                        }
                                                        if(rows.length>0){
                                                            var leadrow =rows[0]
                                                            var lmsstatus = leadrow['lms_status']
                                                            var adleadid = leadrow['lid']
                                                            Digital.updateadslead(leaddata,leadgen_id,function(err,rows){
                                                                console.log('update lead::'+leadgen_id)
                                                            })
                                                            console.log(lmsstatus);
                                                            if(lmsstatus==0){
                                                                var ads_name = adsconfig.ads_name?adsconfig.ads_name:''
                                                                var categoryid = adsconfig.automationSegmentID?adsconfig.automationSegmentID:''
                                                                var agentgroupid = adsconfig.AgentGroupID?adsconfig.AgentGroupID:''
                                                                var newleaddata = {account_id:user_id,mobile:payload.mobile,email:payload.email,name:payload.name,lead_source:payload.lead_source,category:categoryid,agentgroupid:agentgroupid,ads_id:ads_id,ad_leadid:adleadid,ads_name:ads_name,extraparams:payload.extraparams}
                                                                if(agentgroupid!='' && agentgroupid!=null)
                                                                    helper.GenerateLead(newleaddata)
                                                            }
                                                        }else{
                                                            console.log('new lead::'+leadgen_id)   
                                                            leaddata.leadgen_id = leadgen_id
                                                            leaddata.ads_id = ads_id
                                                            leaddata.page_id = page_id
                                                            leaddata.created_time = new Date()
                                                            Digital.insertadslead(leaddata,function(err,rows){
                                                                var adleadid = rows.insertId
                                                                var ads_name = adsconfig.ads_name?adsconfig.ads_name:''
                                                                var categoryid = adsconfig.automationSegmentID?adsconfig.automationSegmentID:''
                                                                var agentgroupid = adsconfig.AgentGroupID?adsconfig.AgentGroupID:''
                                                                var newleaddata = {account_id:user_id,mobile:payload.mobile,email:payload.email,name:payload.name,lead_source:payload.lead_source,category:categoryid,agentgroupid:agentgroupid,ads_id:ads_id,ad_leadid:adleadid,ads_name:ads_name,extraparams:payload.extraparams}
                                                                if(agentgroupid!='' && agentgroupid!=null)
                                                                    helper.GenerateLead(newleaddata)
                                                            })
                                                        }
                                                    })
                                                    if(lcnt==leads.length){
                                                        return res.status(200).send({ 'msg': 'Lead updated successfully.' });
                                                    }        
                                                    lcnt = lcnt + 1
                                                }
                                                cnt = cnt + 1
                                            });
                                        });
                                    }else{
                                        return res.status(200).send({ 'msg': 'No lead found' });
                                    }
                                }
                            })
                        }else{
                            return res.status(200).send({ 'msg': 'Invalid Channel' });
                        }
                    }
                })            
            }else{
                return res.status(200).send({ 'msg': 'Invalid Ad ID' });
            }
        }
    })
});

router.post('/google_create_key',authorize, async function (req, res) {
    let data = {}
    data.user_id = req.query.tknuserid;
    data.key = await helper.randomString(10);
    Digital.Savewebhookurl(data,function(error,rows){
        if(error){
            return res.status(404).send({ 'msg': error});
        }
        else{
            return res.status(200).send({ 'key': data.key});
        }
    })
            
})

router.post('/saved_campaign', authorize, function (req, res) {
    customerid = req.body.userid;
    console.log("dONME" + customerid)
    Digital.CampaignFindByAccessCustomerId({ access_customer_id: customerid }, function (err, useraccess) {
        if (useraccess && useraccess.length > 0) {
            return res.status(200).send({ 'data': useraccess });
        }
        else {
            return res.status(200).send('error ' + err);

        }
    });
});

router.post('/sync_campaign', authorize, function (req, res) {
    var customerid = req.query.tknuserid;
    var campaignid = req.body.campaign_id
    var page_id = req.body.page_id
    Digital.getchannelByUserIdAccessMediaPageId({ user_id: customerid,page_id:page_id,access_media:'facebook'}, function (err, useraccess) {
        console.log('getchannelByUserIdAccessMediaPageId',useraccess);
        if (useraccess && useraccess.length > 0) {
            var access_fbtoken = (useraccess[0].accessToken);
            urllib.request(process.env.FBGRAPHAPIVERSION12+campaignid + '/insights?fields{reach,spend,cost_per_conversion,cost_per_action_type,social_spend,inline_post_engagement,cpm,cpc,frequency,clicks,unique_ctr,inline_link_clicks,impressions,cost_per_inline_link_click}&access_token=' + access_fbtoken, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, function (error, resp) {
                if (error) {
                    return res.status(200).json({ 'error': error });
                }
                else {
                    
                    var result = JSON.parse(resp);
                   // console.log('sync_campaign',result);
                    //console.log('data0',result['data'][0])
                   
                    let insights = result['data'][0]
                    let data_list = {}
                    data_list.reach = insights['reach'];
                    data_list.spend = insights.spend;
                    data_list.cost_per_action_type = JSON.stringify(insights.cost_per_action_type);
                    data_list.social_spend = insights.social_spend;
                    data_list.inline_post_engagement = insights.inline_post_engagement;
                    data_list.cpm = insights.cpm;
                    data_list.cpc = insights.cpc;
                    data_list.frequency = insights.frequency;
                    data_list.clicks = insights.clicks;
                    data_list.unique_ctr = insights.unique_ctr;
                    data_list.inline_link_clicks = insights.inline_link_clicks;
                    data_list.impressions = insights.impressions;
                    data_list.cost_per_inline_link_click = insights.cost_per_inline_link_click;
                    data_list.date_start = insights.date_start;
                    data_list.date_stop = insights.date_stop;
                    Digital.check_ads_insights(campaignid, customerid, function (err, rows) {
                        if (err) {
                            console.log(err)
                        } else {
                            if (rows.length > 0) {
                                Digital.update_insights(data_list,rows[0].i_id, function (err, rows1) {
                                    if (err) {
                                        return res.status(404).send({ 'Error': err });
                                    } else {
                                        return res.status(200).send(result);
                                    }
                                })
                            }else{
                                data_list.access_customer_id = customerid;
                                data_list.ads_id = campaignid
                                data_list.page_id = useraccess[0].page_id
                                Digital.create_insights(data_list, function (err, rows2) {
                                    if (err) {
                                        return res.status(404).send({ 'Error': err });
                                    } else {
                                        return res.status(200).send(result);
                                    }
                                })
                            }
                        }
                    })
                  
                }
            });

        }
        else {
            return res.status(200).send('error ' + err);

        }
    });
});

router.post("/getuserbalance", authorize, (req, res, next) => {
    urllib.request('https://auth.cloudX.in/api/tfapi/getmanageraccountbalance', {
        method: 'POST',
        timeout: 50000,
        data: {
            username: req.body.userid,
        },
        headers: {
            'Content-Type': 'application/json'
        }
    }, async function (error, resp) {
        if (error) {
            console.log("Get Account Balance Error");
            console.log(error);
        }
        else {
            console.log("Module Access Response :"+resp);
            // var parsedResp = JSON.parse(resp);
            var parsedResp = JSON.parse(resp)
            //console.log(parsedResp);
            var balance = { balance: parsedResp.balance }
           // var parsedResp = (resp);
            //console.log(parsedResp);
            // balance = JSON.parse('{"Digital_ID":"DIG20218454132854","brand_no":4,"channel_no":4,"member_no":20,"group_no":2,"monitor_no":0,"hashtag_no":1,"messanger":1,"user":1,"bot":1,"mediaspace":5,"Digital_Startdate":"2021-08-04T18:30:00.000Z","Digital_Expire":"2021-09-03T18:30:00.000Z","Ads_ID":"ADS20218454244208","Ads_Startdate":"2021-08-06T18:30:00.000Z","Ads_User_Balance":5000,"Ads_Value":5000,"Ads_User_Used":0}');
            return res.status(200).json({ 'balance': parsedResp.balance });
            //return res.status(200).json({ 'balance': '{"Digital_ID":"DIG20218454132854","brand_no":1,"channel_no":4,"member_no":20,"group_no":1,"monitor_no":1,"hashtag_no":1,"messanger":1,"user":1,"bot":1,"mediaspace":5,"Digital_Startdate":"2021-08-04T18:30:00.000Z","Digital_Expire":"2021-09-03T18:30:00.000Z","Ads_ID":"ADS20218454244208","Ads_Startdate":"2021-08-06T18:30:00.000Z","Ads_User_Balance":5000,"Ads_Value":5000,"Ads_User_Used":0}' });

        }
    }
    );
});

router.post('/automation_segments', authorize, async function (req, res) {
    var user_id = req.query.tknuserid;      
    Digital.getSegment(user_id, async function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })    
});

router.post('/ad_pages_list', authorize ,async function(req,res){
    var user_id =  req.query.tknuserid;
    var brand_id = req.body.brand_id;
    console.log('ad_pages_list',user_id);

        Digital.getchannelByUserId(user_id,'facebook',function (err, result1) { 
            if (err) {
                return res.status(400).send({ 'error': err.toString() });
            }else{
                return res.status(200).send(result1);
            }        
    });
            
});

router.post('/get_adaccount',authorize, (req, res) => {
    var customerid = req.query.tknuserid;
    var token = req.body.token
    var options = {'method': 'GET',
    'url':process.env.FBGRAPHAPIVERSION12+'/me?fields=adaccounts{id,name}&access_token='+token+''
    };
    request(options, function (error, response) {
      if (error){
        console.log(error)
      } 
      var data = JSON.parse(response.body)
      console.log('get_adaccount',data);
      var adaccounts = data['adaccounts']
      console.log(adaccounts)
      res.status(200).send(adaccounts)
    });
  
})

router.post('/fb_sync_campaign',authorize,(req,res)=>{
    var customerid = req.query.tknuserid;
    var token = req.body.token
    var adaccount = req.body.adaccount
    var page = req.body.page
    var data = []
    var options = {'method': 'GET',
    'url':process.env.FBGRAPHAPIVERSION12+adaccount+'/ads?fields=name,id,account_id,campaign_id,adset_id,status&limit=1000&filtering=[{\'field\': \'ad.effective_status\',\'operator\':\'IN\',\'value\':[\'ACTIVE\']}]&access_token='+token
    };
    request(options,async function (error, response) {
        if (error){
            console.log(error)
        }else{
          let count = 0
          var data = JSON.parse(response.body)
          console.log('fb_sync_campaign',response.body)
          if(data['error']){
            return res.status(200).json({'error':'please select add account'});
          }
          if(data['data'].length>0){
            var adsdata = data['data']
            async.forEachOf(adsdata,async (data, i, callback)=>{
              console.log(data['status'] + (data['name']) + data['adset_id'])
              var data2 = {}
              data2.access_customer_id = customerid;
              data2.ads_name = data.name
              data2.ads_adset_id = data.adset_id
              data2.ads_status = data.status
              data2.ads_id = data.id
              data2.leadgen_form_page = page
              Digital.check_ads(data.id, customerid, function (err, rows) {
                  if (err) {
                      console.log(err)
                  } else {
                      if (rows.length > 0) {
                          Digital.update_ads(data2, data.id, customerid, function (err, rows2) {
                              if (err) {
                                  console.log(err)
                              } else {
                                  console.log("Update:::::::::::::Ads")
                                  //resolve(response.body)
                              }
                          })
  
                      } else {
                          Digital.save_ads(data2, function (err, rows) {
                              if (err) {
                                  console.log(err);
                              } else {
                                  console.log("Data Done Ads")
                                  //resolve(response.body)
                              }
                          })
                      }
                  }
                  if(adsdata.length==i+1){
                    res.status(200).send({'data':adaccount})
                  }    
              })
              
            })
          }
        }
    });
})

router.post('/saved_ads', authorize, function (req, res) {
    var customerid = req.query.tknuserid;
    var page_id = req.body.page_id
    Digital.check_ads_id(customerid,page_id,function(err , rows){
        if (err){
            return res.status(200).json({'error':err});
        }else{
            return res.status(200).send({ 'data': rows });
        }

    })
});

router.post('/automation_agentgroup', authorize, async function (req, res) {
    var managerid = req.query.tknuserid;
    API.getAgentGroup(managerid, async function (err, rows) {
        if (err) {
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
});

router.post('/lead_ad_create_manual', authorize, function (req, res) {
    console.log("start")
    // console.log(req.body)
    var customerid = req.query.tknuserid;
    var ads_id = req.body.page_data['ads_id']
    var voiceCampaignID = req.body.voice_campaign_id;
    var automationSegmentID = req.body.segment;
    var smsCampaignID = req.body.sms_campaign_id;
    var emailCampiagnID = req.body.mail_campaign_id;
    var agentgroupCampaignID = req.body.agentgroup;
    var Ads_data = {}
    Ads_data.access_customer_id = customerid;
    // Ads_data.ads_id = req.body.ads_id
    Ads_data.voiceCampaignID = voiceCampaignID;
    Ads_data.smsCampaignID = smsCampaignID;
    Ads_data.AgentGroupID = agentgroupCampaignID;
    Ads_data.mailCampaignID = emailCampiagnID;
    Ads_data.automationSegmentID = automationSegmentID
    // Ads_data.adcreative_page_id = req.body.page_id;
    Ads_data.is_automation = "yes"
    //console.log(Ads_data,ads_id)
    Digital.update_ads(Ads_data,ads_id,customerid,function(err, rows2){
        if(err){
            console.log(err)
        } else {
            console.log("Update:::::::::::::Ads")
            // return res.status(200).send({ 'data': rows2 });
            Digital.check_ads(ads_id, customerid, function (err, rows3) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("list data:::::::::::::Ads")
                    console.log(rows3)
                    // return res.status(200).send({ 'data': rows2 });
                    delete rows3[0].Ad_id
                    // console.log(rows3[0].Ad_id)

                    Digital.getAdsFindByUserIdAndAdsId({ access_customer_id: customerid, ads_id: ads_id }, function (err, useraccess) {
                        console.log('getAdsFindByUserIdAndAdsId',useraccess)
                        if (useraccess && useraccess.length > 0) {
                            Digital.adsUpdateUserIdAndAdsId({ access_customer_id: customerid, ads_id: ads_id }, rows3[0],function (err, response) {
                                res.status(201).json({
                                    message: "Ad Id Update",
                                    result: response
                                });
                            })

                        } else if (useraccess.length == 0) {
                            Digital.adsCreate(rows3[0], function (error, response) {
                                if (response) {
                                    res.status(201).json({
                                        message: "Manual Set Ad Id",
                                        result: response
                                    })
                                }
                                else {
                                    res.status(500).json({
                                        error: error
                                    });
                                }

                            })
                        }
                    })
                }
            })
        }
    })


});

router.post('/lead_ad_create_automation', authorize, function (req, res) {
    var customerid = req.query.tknuserid;
    var voiceCampaignID = req.body.voice_campaign_id;
    var automationSegmentID = req.body.segment;
    var smsCampaignID = req.body.sms_campaign_id;
    var emailCampiagnID = req.body.mail_campaign_id;
    var agentgroupCampaignID = req.body.agentgroup;
    var Ads_data = {}
    Ads_data.access_customer_id = customerid;
    Ads_data.ads_id = req.body.ads_id
    Ads_data.voiceCampaignID = voiceCampaignID;
    Ads_data.smsCampaignID = smsCampaignID;
    Ads_data.AgentGroupID = agentgroupCampaignID;
    Ads_data.mailCampaignID = emailCampiagnID;
    Ads_data.automationSegmentID = automationSegmentID
    Ads_data.is_automation = "yes"
    Ads_data.media_type = "google"
    console.log(Ads_data);
    Digital.check_ads(Ads_data.ads_id, customerid, function (err, rows3) {
        if(err){
            console.log(err);
        }else{
            console.log(rows3.length);
            if (rows3.length == 0) {
                Digital.save_ads(Ads_data, function (err, rows) {
                    if (err) {
                        return res.status(404).send({ 'msg': err});
                    } else {
                        console.log("Data Done Ads")
                        return res.status(200).send({ 'data': rows});
                    }
                })
            }else{
                Digital.update_ads(Ads_data,Ads_data.ads_id, customerid, function (err, rows) {
                    if (err) {
                        return res.status(404).send({ 'msg': err});
                    } else {
                        console.log("Data Done Ads update")
                        return res.status(200).send({ 'data': rows});
                    }
                })

            }
        }
    })
    

})

router.post('/saveSchedulePosts', authorize, function (req, res) {
    console.log("Reached to save!");
    var user_id = req.query.tknuserid;
    var brand_id = req.body.brand_id;
    var message = req.body.message;
    var videoDesc = req.body.videoDesc;
    var channel_arr = req.body.channel_arr;
    var media = req.body.media;
    var type = req.body.type;
    var schedule_time = req.body.schedule_time;
    schedule_time = new Date(schedule_time).getTime();
    console.log(req.body);
    console.log('schedule_time',schedule_time);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    var media_link = []
    var media_name = []
    var media_mime = []
    
    console.log('media',media);
    media.forEach(element => {
        if(element.file_type){
            if(element.file_type.includes("image")){
                type = 'image'
            }
            if(element.file_type.includes("video")){
                type = 'video'
            }
        }
    });
    
  
    Digital.getbrand(brand_id, function (err, result) {
        console.log(result);
        if (err) {
            return res.status(200).send({ 'error': err.toString() });
        } else {
            var sdata = { brand_id: brand_id, user_id: user_id, channel_arr: JSON.stringify(channel_arr), message: message, videoDesc: videoDesc, schedule_time: schedule_time, created_time: new Date(), status: 0, youtube_category: req.body.category, post_type: type, videotitle: req.body.title }
            console.log(sdata);
            Digital.insertschedulepost(sdata, function (err, rows) {
                if (err) {
                    return res.status(200).send({ 'error': err.toString() });
                    //res.status(200).send({ "msg": 'server error' });
                }
                else {
                    console.log(rows)
                    var post_id = rows.insertId
                    channel_arr.forEach(channel => {
                        var cdata = { post_id: post_id, channel_id: channel }
                        Digital.insertschedulepostchannel(cdata, function (err, rows) {
                            if (err) {
                                res.status(200).send({ 'error': err.toString() })
                            } else {

                            }
                        })
                    });

                    media.forEach(media => {
                        var cdata = { schedule_post_id: post_id, bucket_file_id: media.F_id }
                        Digital.insertschedulepostfile(cdata, function (err, rows) {
                            if (err) {
                                res.status(200).send({ 'error': err.toString() })
                            } else {

                            }
                        })
                    });

                   
                    res.status(200).send({ 'message': 'Post saved successfully!' });
                }
            })
        }
        // }else{
        //     return res.status(200).send({error:"Brand and Requesting User Mismatch"});
        // }
    })
});

router.post('/update_SchedulePosts', authorize, function (req, res) {
    console.log("Reached to save!");
    console.log(req.body);
    var user_id = req.query.tknuserid;
    var brand_id = req.body.brand_id;
    var message = req.body.message;
    var videoDesc = req.body.videoDesc;
    var channel_arr = req.body.channel_arr;
    var media = req.body.media;
   // var medianame = req.body.medianame;
   // var mime = req.body.mime;
    var sid = req.body.sid
    var schedule_time = req.body.schedule_time;
    schedule_time = new Date(schedule_time).getTime();
    console.log('schedule_time',schedule_time);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    /*
    var media_link = []
    var media_name = []
    var media_mime = []
    
    media.forEach(element => {
        media_link.push(element.id)
        media_name.push(element.name)
        media_mime.push(element.type)
    });
     console.log(media_link);
    console.log(media_name);
    console.log(media_mime);
    */
   
    Digital.getbrand(brand_id, function (err, result) {
        console.log(result);
        if (err) {
            res.status(200).send({ 'error': err.toString() });
        } else {
            var sdata = { brand_id: brand_id, user_id: user_id, channel_arr: JSON.stringify(channel_arr), message: message, videoDesc: videoDesc, schedule_time: schedule_time, created_time: new Date(), status: 0, youtube_category: req.body.category }
            Digital.insertschedulepost_update(sdata, sid, function (err, rows) {
                if (err) {
                    res.status(200).send({ 'error': err.toString() });
                    //res.status(200).send({ "msg": 'server error' });
                }
                else {
                    console.log('rows')
                    var post_id = sid
                    Digital.deleteschedulepostchannel(post_id, function (err, data) {
                        if (err) {
                            res.status(200).send({ 'error': err.toString() });
                        } else {
                            console.log('delete');
                            console.log(data);
                            channel_arr.forEach(channel => {
                                var cdata = { post_id: post_id, channel_id: channel }
                                Digital.insertschedulepostchannel(cdata, function (err, rows) {
                                    if (err) {
                                        res.status(200).send({ 'error': err.toString() });
                                    } else {
                                        console.log(rows);
                                    }
                                })
                            });
                             console.log('post_id',post_id);
                            Digital.deleteschedulepostfile(post_id,function (err, rows) {
                                if (err) {
                                    res.status(200).send({ 'error': err.toString() });
                                } else {
                                    console.log('media',media);
                                    media.forEach(media => {
                                        var cdata = { schedule_post_id: post_id, bucket_file_id: media.F_id }
                                        Digital.insertschedulepostfile(cdata,function (err, rows) {
                                            if (err) {
                                                res.status(200).send({ 'error': err.toString() })
                                            } else {
                                    
                                            }
                                        })
                                    });
                                }
                            });

                         
                            res.status(200).send({ 'message': 'Post update saved successfully!' });
                        }
                    });

                }
            })
        }
        // }else{
        //     return res.status(200).send({error:"Brand and Requesting User Mismatch"});
        // }
    })
});

router.post('/getSchedulePostfile', authorize, async function (req, res) {
    var user_id = req.query.tknuserid;
    var s_id = req.body.s_id;
    Digital.getSchedulePostfile(user_id,s_id, async function (err, rows) {
        if (err) {
            return res.status(200).send({ 'error': err.toString() });
        }
        else {
            data = [];

            return res.status(200).send({ data: rows });
        }
    })
   
});

router.post('/get_schedule_posts', authorize, async function (req, res) {
    var user_id = req.query.tknuserid;
    var brand_id = req.body.brand_id;
    Digital.getschedulepost(user_id, brand_id, async function (err, rows) {
        if (err) {
            return res.status(200).send({ 'error': err.toString() });
        }
        else {
            data = [];

            return res.status(200).send({ data: rows });
        }
    })
   
});

router.get('/deleteschedulepost/:id', function (req, res) {
    var id = req.params.id;
    Digital.deleteschedulepost(id, function (err, count) {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.json({ 'msg': 'Schedule Post deleted sucessfully.' });
        }
    })

});

router.post('/pst_mngmt/user_timeline', authorize, async function (req, res) {
    var channel_id = req.body.channel_id;
    await Digital.getTwitPageFeed(channel_id, async (error, data) => {
        if (error) {
            return res.status(200).send({ 'msg': error });
        } else {
            return res.status(200).send({ 'data': data });
        }
    })
});

router.post('/get_feed', authorize, async function (req, res) {
    var channel_id = req.body.channel_id;
    await Digital.getLinkedinPageFeed(channel_id, async (error, data) => {
        if (error) {
            return res.status(200).send({ 'msg': error });
        } else {
            return res.status(200).send({ 'data': data });
        }
    })
});

router.post('/get_comments', authorize, (req, res) => {
    var channel_id = req.body.channel_id;
    var media_id = req.body.media_id;
    Digital.getchannelbyid(channel_id, async function (err, result) {
        if (err) {
            return res.status(200).send('error ' + err);

        }
        else if (result && result.length > 0) {
            var request = require('request');
            var options = {
                'method': 'GET',
                'url': process.env.FBGRAPHAPIVERSION + media_id + '/comments?fields=text,like_count,timestamp,username,replies{user{id{profile_picture_url}},username,text,like_count,timestamp}&access_token=' + result[0].accessToken,
                'headers': {
                }
            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
                console.log(error);

                return res.status(200).send(JSON.parse(response.body));
            });
        }
        else {
            return res.status(404).send("Channel not found!");

        }
    });
});

router.post('/post_comment', authorize, async function (req, res) {
    var channel_id = req.body.channel_id;
    var media_id = req.body.media_id;
    var message = encodeURIComponent(req.body.message);
    Digital.getchannelbyid(channel_id, async function (err, result) {
        if (err) {
            res.status(200).send({ 'msg': error });
        }
        else if (result && result.length > 0) {
            var request = require('request');
            var options = {
                'method': 'POST',
                'url': process.env.FBGRAPHAPIVERSION + media_id + '/comments?message=' + message + '&access_token=' + result[0].accessToken,
                'headers': {
                }
            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
                console.log(error);

                return res.status(200).send(JSON.parse(response.body));
            });


        }
        else {
            return res.status(404).send("Channel not found!");

        }
    })
});

router.post('/post_comment_reply', authorize, async function (req, res) {
    var channel_id = req.body.channel_id;
    var comment_id = req.body.comment_id;
    var message = encodeURIComponent(req.body.message);
    Digital.getchannelbyid(channel_id, async function (err, result) {
        if (err) {
            res.status(200).send({ 'msg': error });
        } else if (result && result.length > 0) {
            var request = require('request');
            var options = {
                'method': 'POST',
                'url': process.env.FBGRAPHAPIVERSION + comment_id + '/replies?message=' + message + '&access_token=' + result[0].accessToken,
                'headers': {
                }
            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
                console.log(error);

                return res.status(200).send(JSON.parse(response.body));
            });


        }
        else {
            return res.status(404).send("Channel not found!");

        }
    });
});

router.post('page/publish_like', authorize, async function (req, res) {
    var channel_id = req.body.channel_id;
    var object_to_like = req.body.object_id;
    Digital.getchannelbyid(channel_id, async function (err, result) {
        if (err) {
            return res.status(400).send({ 'error': err.toString() });
        }
        else if (result && result.length > 0) {
            urllib.request(process.env.FBGRAPHAPIVERSION + object_to_like + '/likes', {
                data: {
                    access_token: result[0].accessToken,
                },
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            },
                function (error, resp) {
                    if (error) {
                        return res.status(200).json({ 'error': error });
                    }
                    else {
                        str_resp = JSON.parse(resp);
                        return res.status(200).json(str_resp);
                    }
                });
        }
        else {
            return res.status(404).send("Channel not found!");

        }
    });
});

router.post('/delete_like', authorize, async function (req, res) {
    var channel_id = req.body.channel_id;
    var object_to_like = req.body.object_id;
    Digital.getchannelbyid(channel_id, async function (err, result) {
        if (err) {
            return res.status(400).send({ 'error': err.toString() });
        }
        else if (result && result.length > 0) {
            urllib.request(process.env.FBGRAPHAPIVERSION + object_to_like + '/likes', {
                data: {
                    access_token: result[0].accessToken,
                },
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            },
                function (error, resp) {
                    if (error) {
                        return res.status(200).json({ 'error': error });
                    }
                    else {
                        str_resp = JSON.parse(resp);
                        return res.status(200).json(str_resp);
                    }
                });
        }
        else {
            return res.status(404).send("Channel not found!");

        }
    });
});

router.post('/comment_publish', authorize, async function (req, res) {
    var channel_id = req.body.channel_id;
    var object_to_comment_on = req.body.object_id;
    Digital.getchannelbyid(channel_id, async function (err, result) {
        if (err) {
            return res.status(400).send({ 'error': err.toString() });
        }
        else if (result && result.length > 0) {
            urllib.request(process.env.FBGRAPHAPIVERSION + object_to_comment_on + '/comments', {
                data: {
                    message: req.body.message,
                    access_token: result[0].accessToken,
                },
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, function (error, resp) {
                if (error) {
                    return res.status(200).json({ 'error': error });
                }
                else {
                    str_resp = JSON.parse(resp);
                    return res.status(200).json(str_resp['id']);
                }
            });
        }
        else {
            return res.status(404).send("Channel not found!");

        }
    });
});

router.post('/get_social_actions', authorize, async function (req, res) {
    var channel_id = req.body.channel_id;
    var activity_id = req.body.activity_id;
    Digital.getchannelbyid(channel_id, async function (err, result) {
        if (err) {
            return res.status(400).send({ 'error': err.toString() });
        }
        else if (result && result.length > 0) {
            var aToken = result[0].accessToken;
            urllib.request('https://api.linkedin.com/v2/socialActions/' + activity_id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + aToken,
                }
            }, function (error, resp) {
                if (error) {
                    return res.status(400).json({ 'error': error });
                }
                else {
                    return res.status(200).send(resp);
                }
            }
            );
        }
        else {
            return res.status(404).send("Channel not found!");
        }
    }
    );
});

router.post('/get_social_actions_comments', authorize, async function (req, res) {
    var channel_id = req.body.channel_id;
    var activity_id = req.body.activity_id;
    Digital.getchannelbyid(channel_id, async function (err, result) {
        if (err) {
            return res.status(400).send({ 'error': err.toString() });
        }
        else if (result && result.length > 0) {
            var aToken = result[0].accessToken;
            urllib.request('https://api.linkedin.com/v2/socialActions/' + activity_id + '/comments?projection=(elements(*(*,actor~(*,profilePicture(displayImage~:playableStreams),logoV2(original~:playableStreams)))))', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + aToken,
                }
            }, function (error, resp) {
                if (error) {
                    return res.status(400).json({ 'error': error });
                }
                else {
                    return res.status(200).send(resp);
                }
            }
            );
        }
        else {
            return res.status(404).send("Channel not found!");
        }
    }
    );
});

router.post('/get_shareId', authorize, function (req, res) {
    var channel_id = req.body.channel_id;
    var activity_id = req.body.activity_id;
    Digital.getchannelbyid(channel_id, async function (err, result) {
        if (err) {
            return res.status(400).send({ 'error': err.toString() });
        }
        else if (result && result.length > 0) {
            var aToken = result[0].accessToken;
            urllib.request('https://api.linkedin.com/v2/activities/?ids=' + activity_id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + aToken,
                }
            }, function (error, resp) {
                if (error) {
                    return res.status(400).json({ 'error': error });
                }
                else {
                    jResp = JSON.parse(resp);
                    return res.status(200).send(jResp.results["" + activity_id]);
                }
            }
            );
        }
        else {
            return res.status(404).send("Channel not found!");
        }
    }
    );
});

router.post('/get_share_insights', authorize, function (req, res) {
    var channel_id = req.body.channel_id;
    var shareString = req.body.share_id;
    Digital.getchannelbyid(channel_id, async function (err, result) {
        if (err) {
            return res.status(400).send({ 'error': err.toString() });
        }
        else if (result && result.length > 0) {
            var aToken = result[0].accessToken;
            urllib.request('https://api.linkedin.com/v2/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=' + result[0].page_id + '&shares[0]=' + shareString, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + aToken,
                }
            }, function (error, resp) {
                if (error) {
                    return res.status(400).json({ 'error': error });
                }
                else {
                    return res.status(200).send(resp);
                }
            }
            );
        }
        else {
            return res.status(404).send("Channel not found!");
        }
    }
    );
});

router.post('/get_media_insights', authorize, (req, res) => {
    var channel_id = req.body.channel_id;
    var media_id = req.body.media_id;
    Digital.getchannelbyid(channel_id, async function (err, result) {
        if (err) {
            console.log("db err");
            return res.status(200).send('error ' + err);

        }
        else if (result && result.length > 0) {
            var request = require('request');
            var options = {
                'method': 'GET',
                'url': process.env.FBGRAPHAPIVERSION + media_id + '/insights?metric=reach,engagement,impressions,saved&access_token=' + result[0].accessToken,
                'headers': {
                }
            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
                return res.status(200).send(JSON.parse(response.body));
            });


        }
        else {
            return res.status(404).send("Channel not found!");

        }
    });
});

router.post('/post_social_actions_comments', authorize, function (req, res) {
    var channel_id = req.body.channel_id;
    var activity_id = req.body.activity_id;
    var payload = req.body.body;
    Digital.getchannelbyid(channel_id, async function (err, result) {
        if (err) {
            return res.status(400).send({ 'error': err.toString() });
        }
        else if (result && result.length > 0) {
            var aToken = result[0].accessToken;
            payload.actor = result[0].page_id;
            urllib.request('https://api.linkedin.com/v2/socialActions/' + activity_id + '/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + aToken,
                },
                data: payload,
            }, function (error, resp) {
                if (error) {
                    return res.status(400).json({ 'error': error });
                }
                else {
                    // console.log(JSON.parse(resp));
                    return res.status(200).send(resp);
                }
            }
            );
        }
        else {
            return res.status(404).send("Channel not found!");
        }
    }
    );
});

router.post('/post_social_actions_likes', authorize, function (req, res) {
    var channel_id = req.body.channel_id;
    var activity_id = req.body.activity_id;
    var payload = req.body.body;
    Digital.getchannelbyid(channel_id, async function (err, result) {
        if (err) {
            return res.status(400).send({ 'error': err.toString() });
        }
        else if (result && result.length > 0) {
            var aToken = result[0].accessToken;
            payload.actor = result[0].page_id;
            urllib.request('https://api.linkedin.com/v2/socialActions/' + activity_id + '/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + aToken,
                },
                data: payload,
            }, function (error, resp) {
                if (error) {
                    return res.status(400).json({ 'error': error });
                }
                else {
                    return res.status(200).send(resp);
                }
            }
            );
        }
        else {
            return res.status(404).send("Channel not found!");
        }
    }
    );
});

router.post('/like_tweet', authorize, function (req, res) {
    var channel_id = req.body.channel_id;
    var tweet_id = req.body.tweet_id;
    Digital.getchannelbyid(channel_id, async function (err, result) {
        if (err) {
            return res.status(400).send({ 'error': err.toString() });
        }
        else if (result && result.length > 0) {
            config.access_token = result[0].accessToken;
            config.access_token_secret = result[0].accessTokenSecret;
            var T = new Twit(config);
            T.post('favorites/create', { id: tweet_id }, function (err, data, response) {
                if (data && data.length > 0) {
                    return res.status(200).send(data);
                } else {

                    return res.status(200).json({ 'error': err });

                }
            });
        }
        else {
            return res.status(404).send("Channel not found!");
        }
    });

});

router.post('/unlike_tweet', authorize, function (req, res) {
    var channel_id = req.body.channel_id;
    var tweet_id = req.body.tweet_id;
    Digital.getchannelbyid(channel_id, async function (err, result) {
        if (err) {
            return res.status(400).send({ 'error': err.toString() });
        }
        else if (result && result.length > 0 && user_id == result[0].under_brand[0].user_id) {
            config.access_token = result[0].accessToken;
            config.access_token_secret = result[0].accessTokenSecret;
            var T = new Twit(config);
            T.post('favorites/destroy', { id: tweet_id }, function (err, data, response) {
                if (data && data.length > 0) {
                    return res.status(200).send(data);
                } else {

                    return res.status(200).json({ 'error': err });

                }
            });
        }
        else {
            return res.status(404).send("Channel not found!");
        }
    });

});

router.post('/post_tweet_reply', authorize, function (req, res) {
    var tweetmsg = req.body.message;
    var tweet_id = req.body.tweet_id;
    var channel_id = req.body.channel_id;
    Digital.getchannelbyid(channel_id, async function (err, result) {
        if (err) {
            return res.status(400).send({ 'error': err.toString() });
        }
        else if (result && result.length > 0) {
            var new_config = {};
            for (let key in t_config) {
                new_config[key] = t_config[key];
            }
            new_config.access_token = result[0].accessToken;
            new_config.access_token_secret = result[0].accessTokenSecret;
            var T = new Twit(new_config);
            T.post('statuses/update', { status: tweetmsg, in_reply_to_status_id: tweet_id, auto_populate_reply_metadata: true }, function (err, data, response) {
                if (err) {
                    ;
                    return res.status(400).send({ 'errormsg': err.message });
                }
                if (data) {
                    return res.status(200).send({ 'msg': 'Tweet created successfully!' });
                }
            })
        } else {
            return res.status(404).send("Channel not found!");
        }
    });
});

router.post('/get_me', authorize, (req, res) => {   //Dont think this is in use anymore, implemented in auth flow
    var channel_id = req.body.channel_id;
    Digital.getchannelbyid(channel_id, async function (err, result) {
        if (result && result.length > 0) {
            var access_fbtoken = (result[0].accessToken);
            urllib.request('https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&projection=(elements*(*,roleAssignee~(localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams)),organization~(localizedName,logoV2(original~:playableStreams))))', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + access_fbtoken,
                }
            }, function (error, resp) {
                if (error) {
                    return res.status(400).json({ 'error': error });
                }
                else {
                    jResp = JSON.parse(resp)

                    return res.status(200).send(jResp['elements']);
                }
            }
            );

        }
        else {
            return res.status(404).send("Channel not found!");

        }

    });
});

router.post('/paging', authorize, function (req, res) {
    var channel_id = req.body.channel_id;
    Digital.getchannelbyid(channel_id, async function (err, result) {
        if (err) {
            return res.status(400).send({ 'error': err.toString() });
        }
        else if (result && result.length > 0) {
            urllib.request(req.body.link, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, function (error, resp) {
                if (error) {
                    return res.status(400).json({ 'error': error });
                }
                else {
                    str_resp = JSON.parse(resp);
                    return res.status(200).json(str_resp);
                }
            });

        }
        else {
            return res.status(404).send("Channel not found!");
        }

    });
});

router.post('/delete_posttweet', authorize, function (req, res) {
    var channel_id = req.body.channel_id;
    var post_id = req.body.post_id;
    Digital.getchannelbyid(channel_id, async function (err, result) {
        if (err) {
            return res.status(200).send({ 'error': err.toString() });
        }
        else if (result && result.length > 0) {
            var new_config = {};
            for (let key in config) {
                new_config[key] = config[key];
            }
            new_config.access_token = result[0].accessToken;
            new_config.access_token_secret = result[0].accessTokenSecret;
            var T = new Twit(new_config);
            T.post('statuses/destroy', { id: post_id }, function (err, data, response) {
                if (err) {
                    return res.status(200).send({ 'error': err.message });
                }
                if (data) {
                    return res.status(200).send({ 'msg': 'Tweet Delete successfully!' });
                }
            })
        } else {
            return res.status(200).send({ 'error': "Channel not found!" });
        }
    });
});

router.post('/delete_post', authorize, function (req, res) {
    var channel_id = req.body.channel_id;
    var post_id = req.body.post_id;
    Digital.getchannelbyid(channel_id, async function (err, result) {
        if (err) {
            return res.status(200).send({ 'msg': err.toString() });
        }
        else if (result && result.length > 0) {
            var options = {
                'method': 'DELETE',
                'url': '' + process.env.FBGRAPHAPIVERSION + '' + post_id + '?access_token=' + result[0].accessToken + '',
                'headers': {
                }
            };
            request(options, function (error, response) {
                console.log('fb error',error)
                console.log('fb response',response.body)
                if (error) {
                    return res.status(200).send({ 'msg': error.toString() });
                } else {
                    Digital.deletepost(post_id, function (err, data) {
                        return res.status(200).send({ 'msg': 'Deleted successfully.' });
                    })
                }
            })
        } else {
            return res.status(200).send({ 'msg': "Channel not found!" });
        }
    });
});

router.post('/post_insight', authorize, async function (req, res) {
    var channel_id = req.body.channel_id;
    Digital.getchannelbyid(channel_id, async function (err, result) {
        if (err) {
            return res.status(400).send({ 'error': err.toString() });
        }
        else if (result && result.length > 0) {
            var post_id = req.body.post_id;
            var fb_page_aToken = result[0].accessToken;//+post_id+'/insights/?metric='+metric
            var req2 = post_id + "?fields=shares,likes.summary(true),comments.summary(true).filter(toplevel){can_remove,can_like,can_comment,like_count,message,application,from{picture,name},reactions,created_time,user_likes,comments{application,message,can_comment,like_count,can_like,can_remove,from{picture,name},reactions,created_time,user_likes}}"; //Gets comments with fields fields=stream/toplevel (stream, ~most relevant), OG query: post_id+'%2Fcomments%3Ffields%3Dcan_remove%2Ccan_like%2Ccan_comment%2Clike_count%2Cmessage%2Capplication%2Ccomments%7Bapplication%2Cmessage%7D%26summary%3D1%26filter%3Dtoplevel' (OG qry must be encoded cuz '&')
            var req3 = post_id + '%2Fcomments%3Fsummary%3Dtrue%26filter%3Dstream'
            var metric = 'post_reactions_by_type_total,post_impressions_unique,post_engaged_users,post_clicks,post_impressions';
            var req1 = post_id + '/insights/?metric=' + metric;
            urllib.request('https://graph.facebook.com/me?batch=[{"method": "GET", "relative_url":"' + req1 + '"},{"method": "GET", "relative_url":"' + req2 + '"},{"method": "GET", "relative_url":"' + req3 + '"}]&include_headers=false&access_token=' + fb_page_aToken,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }, function (error, resp) {
                    if (error) {
                        return res.status(400).json({ 'error': error });
                    }
                    else {
                        var jResp = JSON.parse(resp);
                        return res.status(200).send(jResp);
                    }
                });
        }
        else {
            return res.status(404).send("Channel not found!");

        }

    });
});

router.post('/get_media', authorize, async function (req, res) {
    var channel_id = req.body.channel_id;
    await Digital.getInstaPageFeed(channel_id, async (error, data) => {
        if (error) {
            return res.status(200).send({ 'msg': error });
        } else {
            return res.status(200).send({ 'data': data });
        }
    })
});

router.post('/getpagefeed', async function (req, res) {
    var channel_id = req.body.channel_id;
    await Digital.getFbPageFeed(channel_id, async (error, data) => {
        if (error) {
            return res.status(200).send({ 'msg': error });
        } else {
            return res.status(200).send({ 'data': data });
        }
    })
});

function handleFeed(pageid,postid,change){
    //channelSchema.findOne({page_id: pageid,access_media:'facebook'}).exec(async function (err, result){
    Digital.getchannelbymedia(pageid,'facebook',async function (err, result) {
        if (err){
            console.log(err);
        }else{
            if(result.length>0){
                if(change.published){
                    console.log(pageid+'==> page found')
                    var brand = result[0].brand_id
                    var userid = result[0].username
                    const account_active= await helper.checkAccountExpiry(userid);
                    if(account_active){
                        var Post = {};
                        Post.channel_id = result[0].channel_id
                        Post.brand_id = result[0].brand_id
                        Post.message = change.message?change.message:''
                        Post.post_id = change.post_id
                        Post.created_time = new Date(change.created_time * 1000)
                        Post.channel_type = 'facebook'
                        Post.full_picture = change.link?change.link:''
                        Post.account_id=userid
                        Digital.insertpublishpost(Post, async function (err, rows) {
                            if (err) {
                                console.log(err)
                                //res.status(200).send({ "msg": 'server error' });
                            }
                            else {
                                console.log(rows)
                            }
                        })
                    }else{
                        console.log('account expired')
                    }
                    //FacebookAutoShare(postid,userid,brand,change.message)
                }else{
                    console.log('post not published')
                }
            }else{
                console.log('No page found')
            }
        }
    })
}

function handleFeedReaction(pageid,postid,change){
    if(change.item=='reaction'){
        Digital.checkpost(change.post_id, async function (err, rows) {
            if (err) {
                console.log(err) 
            }
            else {
                if(rows.length>0){
                    var Post = {};
                    Post.pageid = pageid
                    Post.post_id = postid
                    Post.created_time = new Date(change.created_time * 1000)
                    Post.reaction_type = change.reaction_type
                    Post.userid = change.from.id
                    Post.username = change.from.name
                    // Digital.insertpublishpostreaction(Post, async function (err, rows) {
                    //     if (err) {
                    //         console.log(err) 
                    //         //res.status(200).send({ "msg": 'server error' });
                    //     }
                    //     else {
                    //         console.log(rows)
                    //     }
                    // })
                }
            }
        })
    }
}

function handleFeedComment(change){
    //console.log(change.post)
    Digital.checkpost(change.post_id, async function (err, rows) {
        if (err) {
            console.log(err) 
        }
        else {
            if(rows.length>0){
                var Post = {};
                Post.post_id = change.post_id
                Post.comment_id = change.comment_id
                Post.created_time = new Date(change.created_time * 1000)
                Post.message = change.message?change.message:''
                Post.photo_link = change.photo?change.photo:''
                Post.parent_id = change.parent_id
                Post.userid = change.from.id
                Post.username = change.from.name
                Digital.insertpublishpostcomment(Post, async function (err, rows) {
                    if (err) {
                        console.log(err) 
                        //res.status(200).send({ "msg": 'server error' });
                    }
                    else {
                        console.log(rows)
                    }
                })
            }
        }
    })    
}

function handleFeedShare(change){
    console.log(change.post)
    Digital.checkpost(change.post_id, async function (err, rows) {
        if (err) {
            console.log(err) 
        }
        else {
            if(rows.length>0){
                var Post = {};
                Post.post_id = change.post_id
                Post.share_id = change.share_id
                Post.created_time = new Date(change.created_time * 1000)
                Post.link = change.link?change.link:''
                Post.userid = change.from.id
                Post.username = change.from.name
                Digital.insertpublishpostshare(Post, async function (err, rows) {
                    if (err) {
                        console.log(err) 
                        //res.status(200).send({ "msg": 'server error' });
                    }
                    else {
                        console.log(rows)
                    }
                })
            }
        }
    })    
}

router.get('/twitter', async function (req, res) {
    tw.login((err, tokenSecret, url) => {
        if (err) {
            console.log(err);
            // Handle the error your way
        }
        console.log(tokenSecret);
        console.log(url);
        res.json({ 'url': url, 'tokenSecret': tokenSecret });
    })
});

router.post('/twitter', async function (req, res) {
    const tw = new LoginWithTwitter({
        consumerKey: process.env.TWITTER_CONSUMERKEY,
        consumerSecret: process.env.TWITTER_CONSUMERSECRET,
        callbackUrl: req.body.callbackurl
    })

    tw.login((err, tokenSecret, url) => {
        if (err) {
            console.log(err);
            // Handle the error your way
        }
        console.log(tokenSecret);
        console.log(url);
        res.json({ 'url': url, 'tokenSecret': tokenSecret });
    })
});
router.post('/social_twitter',authorize, async function(req, res){
    console.log("BODY:")
    console.log(req.body);
    var user_id = req.body.user_id;
    var brand_id = req.body.brand_id;
    var media = 'twitter'
    Digital.getsocial_access(user_id,media,brand_id,async function (err, result) {
        if(err){
            res.status(404).json({
                msg: 'Something went wrong!'
            })
        }else{
            console.log("here");
            console.log(result.length);
            if(result.length == 0){
                tw.callback({
                    oauth_token: req.body.oauth_token,
                    oauth_verifier: req.body.oauth_verifier
                }, req.body.tokenSecret, (err, twuser) => {
                    if (err) {
                        return res.status(400).json({ 'msg': err.toString() });
                    }
                    console.log("hello");
                    console.log(result);
                    var social = {};
                    social.id = twuser.userId;
                    social.name = twuser.userName;
                    social.access_customer_id = user_id
                    social.access_media = media
                    social.access_brand = brand_id
                    var new_config = {};
                    for (let key in t_config) {
                        new_config[key] = t_config[key];
                    }
                    new_config.access_token = twuser.userToken;
                    new_config.access_token_secret = twuser.userTokenSecret;
                    social.access_token_secret = twuser.userTokenSecret;
                    social.accessToken = twuser.userToken;
                    console.log(social)
                    Digital.savesocialaccess(social,async function (err, result) {
                        if(err){
                            console.log(err);
                            res.status(404).json({
                                msg: err
                            })
                        }else{
                            console.log("Save");
                            res.status(200).json({
                                msg: 'Access token saved successfully.'
                            })
                        }
                    })
                })
            }else{
                tw.callback({
                    oauth_token: req.body.oauth_token,
                    oauth_verifier: req.body.oauth_verifier
                }, req.body.tokenSecret, (err, twuser) => {
                    if (err) {
                        return res.status(400).json({ 'msg': err.toString() });
                    }
                    console.log(result);
                    var social = {};
                    var new_config = {};
                    for (let key in t_config) {
                        new_config[key] = t_config[key];
                    }
                    social.id = twuser.userId;
                    social.name = twuser.userName;
                    new_config.access_token = twuser.userToken;
                    new_config.access_token_secret = twuser.userTokenSecret;
                    social.access_token_secret = twuser.userTokenSecret;
                    social.accessToken = twuser.userToken;
                    console.log(social)
                    Digital.updatesocial_access(social,user_id,result[0].a_id,async function (err, result) {
                        if(err){
                            res.status(404).json({
                                msg: err
                            })
                        }else{
                            res.status(200).json({
                                msg: 'Access token update successfully.'
                            })
                        }
                    })
                })
                
                
            }
        }
    })
});
router.get('/linkedin', (req, res) => {
    console.log('linkedin');
    Linkedin.auth.setCallback(process.env.ACCOUNT_ACCESS_PATH);
    var auth_url = Linkedin.auth.authorize(lscope);
    res.json({ 'url': auth_url });
});
router.post('/social_linkdin', async function(req, res){
    console.log("BODY:")
    console.log(req.body);
    var user_id = req.body.userid;
    var brand_id = req.body.brand_id;
    var media = 'linkdin'
    Digital.getsocial_access(user_id,media,brand_id,async function (err, result) {
        if(err){
            res.status(404).json({
                msg: 'Something went wrong!'
            })
        }else{
            console.log("here");
            console.log(result.length);
            if(result.length == 0){
                Linkedin.auth.getAccessToken(res, req.body.params.code, req.body.params.state, function (err, result) {
                    console.log(result);
                    var channel = {};
                    channel.accessToken = result.access_token;
                    channel.access_customer_id = user_id
                    channel.access_media = media
                    channel.access_brand = brand_id
                    channel.access_media_refresh_token = result.refresh_token
                    channel.expiry_date = result.refresh_token_expires_in
                    console.log(channel);
                    Digital.savesocialaccess(channel,async function (err, result) {
                        if(err){
                            console.log(err);
                            res.status(404).json({
                                msg: err
                            })
                        }else{
                            console.log("Save");
                            res.status(200).json({
                                msg: 'Access token saved successfully.'
                            })
                        }
                    })
                })
                
               
                
        
            }else{
                Linkedin.auth.getAccessToken(res, req.body.params.code, req.body.params.state, function (err, result1) {
                    console.log(result1);
                    var channel = {};
                    channel.accessToken = result1.access_token;
                    channel.access_media_refresh_token = result1.refresh_token
                    channel.expiry_date = result1.refresh_token_expires_in
                    Digital.updatesocial_access(channel,user_id,result[0].a_id,async function (err, result) {
                        if(err){
                            res.status(404).json({
                                msg: err
                            })
                        }else{
                            res.status(200).json({
                                msg: 'Access token update successfully.'
                            })
                        }
                    })
                })
            }
        }
    })
});
router.post('/TwAccessToken', authorize, (req, res) => {
    var user_id = req.query.tknuserid;
    var brand_id = req.body.brand_id;
    var media = 'twitter'
    Digital.getsocial_access(user_id,media,brand_id, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "msg": 'server error', 'data': [] });
        }
        else {
            if (rows.length > 0) {
                res.status(200).send({ "msg": 'data found', 'data': rows[0] });
            } else {
                res.status(200).send({ "msg": 'No access token found', 'data': [] });
            }
        }
    })
})
router.post('/sync_twitter_social', authorize, async function (req, res) {
    console.log('body',req.body);
    var user_id = req.body.userid;
    var new_config = {};
    var channel = {}
    var userid = req.query.tknuserid;
    for (let key in t_config) {
        new_config[key] = t_config[key];
    }
    new_config.access_token = req.body.accessToken;
    new_config.access_token_secret = req.body.access_token_secret;
    var T = new Twit(new_config);
    T.get('users/show', { user_id: req.body.id }, function (err, data, response) {
        if (data.name != '') {
            console.log(data);
            channel.brand_id = req.body.access_brand
            channel.access_media = 'twitter'
            // if telemedia folder is not found then create directory 
            if (!fs.existsSync(path.join(__dirname, '/../telemedia/'))) {
                fs.mkdir(path.join(__dirname, '/../telemedia/'), (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
            // create directory user wise
            if (!fs.existsSync(path.join(__dirname, '/../telemedia/'+userid))) {
                fs.mkdir(path.join(__dirname, '/../telemedia/'+userid), (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
            var m = new Date();
            var fileid = 'channel_profile_twitter' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
            var filename=path.join(__dirname, '/../telemedia/'+userid+'/')+fileid+'.png';                                 
            page_profile = userid+'/'+fileid+'.png'
            download(data.profile_image_url_https, filename, function(){
            });
            channel.channel_thumbnail = page_profile;
            channel.accessToken = req.body.accessToken;
            channel.accessTokenSecret = req.body.access_token_secret;
            channel.access_media = 'twitter'
            channel.page_id = req.body.id
            channel.channel_name = req.body.name
            channel.username = userid;
            Digital.savechannel(channel, function (err, srows) {
                if (err) {
                    console.log(err);
                    res.status(200).send({ "msg": 'server error' });
                }
                else {
                    res.status(200).send(
                        { "msg": 'Channel successfully created!'
                        ,channel_id:srows.insertId 
                    });
                }
            });
        }
        else {
            res.status(500).json({
                error: error
            });
        }
    });
})
router.post('/sync_linkedin_social', authorize, async function (req, res) {
    var accessToken = req.body.accessToken
    urllib.request('https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&projection=(elements*(*,roleAssignee~(localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams)),organization~(localizedName,logoV2(original~:playableStreams))))', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
        }
    }, function (error, resp) {
        if (error) {
            return res.status(400).json({ 'error': error });
        }
        else {
            jResp = JSON.parse(resp);
            return res.status(200).json({ pages: jResp['elements'] });
        }
    })
})
router.post('/linkedin_page_select', authorize, (req, res) => { //completes auth flow with page selection
    var user_id = req.query.tknuserid;
    var brand_id = req.body.brand_id;
    var auth = req.body.auth;
    console.log(brand_id);
    Digital.getchannel(user_id, brand_id, 'linkedin', req.body.page.organization, function (err, srows) {
        if (err) {
            console.log(err);
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            console.log(srows[0]);
            if (srows.length == 0) {
                var channel = {};
                channel.brand_id = brand_id;
                channel.access_media = 'linkedin';
                channel.accessToken = auth.access_token;
                channel.access_expiry_date = auth.expires_in;
                channel.access_refresh_token = auth.refresh_token;
                channel.access_refresh_expiry_date = auth.refresh_token_expires_in;
                channel.channel_name = req.body.page['organization~']['localizedName'];
                channel.page_id = req.body.page.organization;
                if (req.body.page["organization~"].logoV2) {
                    // if telemedia folder is not found then create directory 
                        if (!fs.existsSync(path.join(__dirname, '/../telemedia/'))) {
                            fs.mkdir(path.join(__dirname, '/../telemedia/'), (err) => {
                                if (err) {
                                    console.error(err);
                                }
                            });
                        }

                        // create directory user wise
                        if (!fs.existsSync(path.join(__dirname, '/../telemedia/'+user_id))) {
                            fs.mkdir(path.join(__dirname, '/../telemedia/'+user_id), (err) => {
                                if (err) {
                                    console.error(err);
                                }
                            });
                        }
                        var m = new Date();
                        var fileid = 'channel_profile_linkdin' + m.getUTCFullYear() + "" + (m.getUTCMonth() + 1) + "" + m.getUTCDate() + "" + m.getUTCHours() + "" + m.getUTCMinutes() + "" + m.getUTCSeconds() + m.getMilliseconds();
                        var filename=path.join(__dirname, '/../telemedia/'+user_id+'/')+fileid+'.png';                                 
                        page_profile = user_id+'/'+fileid+'.png'
                        download(req.body.page["organization~"].logoV2["original~"].elements[2].identifiers[0].identifier, filename, function(){
                        });
                        channel.channel_thumbnail = page_profile;
                }
                else {
                    channel.channel_thumbnail = 'assets/images/icon/profile.png';//replace blank with an image representing default
                }
                console.log(channel);
                channel.username = user_id
                Digital.savechannel(channel, function (err, srows) {
                    if (err) {
                        res.status(200).send({ "msg": 'server error' });
                    }
                    else {
                        res.status(201).json({
                            message: "Social User Access successfully Created!",
                            channel_id:srows.insertId
                        })
                    }
                });
            }
        }
    })
});
router.get('/getLinkdinAndTwiterPost', authorize, async(req, res) => {
    var user_id = req.query.tknuserid;
    var user_role = req.query.tknuserrole;
    if(user_role==2){
        console.log('getLinkdinAndTwiterPost',user_id)
        helperDigital.get_twitter_post({user_id:user_id})
        helperDigital.get_linkedin_post({user_id:user_id})
        helperDigital.get_fb_post({user_id:user_id})
        helperDigital.get_insta_post({user_id:user_id})
    }
    res.status(200).json({
        message: "fetch successfully!",
        user_id:user_id
    })
})
var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){    
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

router.get('/get_media_by_id', authorize, async(req, res) => {
    //Digital.getMediaById();
    var user_id = req.query.tknuserid;
    console.log(req.query.id)
    Digital.getMediaById(req.query.id, function (err, rows) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send({ "data": rows });
        }
    })
    
})

router.post('/createbulkschedulepost/', authorize, async function (req, res) {
    console.log('createbulkschedulepost',req.body);
    var userid = req.body.userid;
    var date = new Date();
    var settingDetail = req.body.settingDetail;
    valuearray = []

    for (var i = 0; i < ((settingDetail).length); i++) {
        var detail = settingDetail[i];
        var channelArr = [];
        var mediaArr = [];
        var medianameArr = [];
        var mediaextArr = [];
        //console.log(detail);
        if (detail['channelid'] != '') {
            media = detail['media'];
            channelid = detail['channelid'];
            description = detail['description'];
            scheduledate = detail['scheduledate'];
            if(detail['scheduledate']){
                schedule_time = new Date(scheduledate).getTime();
            }else{
                schedule_time = null; 
            }            
            channelArr.push(channelid)
            var mediadetail = await helper.GetMediaDetail(media);
            mediaArr.push(media)
            medianameArr.push(mediadetail['file_name'])
            mediaextArr.push(mediadetail['file_type'])
            var type = mediadetail['file_type'].split("/");
            let date_ob = new Date();

            // current date
            // adjust 0 before single digit date
            let date = ("0" + date_ob.getDate()).slice(-2);

            // current month
            let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

            // current year
            let year = date_ob.getFullYear();

            // current hours
            let hours = date_ob.getHours();

            // current minutes
            let minutes = date_ob.getMinutes();

            // current seconds
            let seconds = date_ob.getSeconds();
            var currentdate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

            data = { user_id: userid, brand_id: detail['brandid'], channel_arr: JSON.stringify(channelArr), message: description, schedule_time: schedule_time, created_time: currentdate, post_type: type[0] };
            //valuearray.push(data);
            console.log('savebulkschedulepost',data);
            const schedule_insertid=await Digital.savebulkschedulepost(data, userid);
            if(schedule_insertid){
                var cdata = { schedule_post_id: schedule_insertid, bucket_file_id: detail['media'] }
                        
                Digital.insertschedulepostfile(cdata, function (err, rows) {
                    if (err) {
                        res.status(200).send({ 'error': err.toString() })
                    } else {

                    }
                })
            }
        }
    }
    res.status(200).send({ "msg": 'Schedule post saved successfully!!!' });
    
})

router.post('/movetoarchive/', authorize, async function (req, res) {
    Digital.moveToarchive(req.body.params.id, function (err, srows) {
        if (err) {
            res.status(200).send({ "msg": 'server error' });
        }
        else {
            res.status(200).json({
                msg: "Chat update successfully!",
                channel_id:srows.insertId
            })
        }
    });
})

router.post('/delete_fb_data', authorize, function (req, res) {
    console.log(req.body);
    Digital.delete_fb_data(req.body,function(err , rows){
        if(err){
            console.log(err)
            return res.status(200).send({ 'data': [] });
        }else{
                return res.status(200).send({ 'data': 'Deleted sccuessfull !!' });
            
        }
    })
});
module.exports = router;