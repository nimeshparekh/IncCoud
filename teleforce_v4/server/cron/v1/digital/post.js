
var cron = require('node-cron');
var async = require("async");
const path = require('path')
var requestify = require('requestify'); 
var request = require('request');
const fs = require('fs');
var Twit = require('twit');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
var Url = require('url');
var Path = require('path');
var validUrl = require('valid-url');
var helperDigital = require("../../../helper/digital");
var helper = require("../../../helper/common");
const config = {
    consumer_key:         'qw1rm5VzbngwI7IIZLGxEl098',
    consumer_secret:      'F2eMA5iAtnHhTcptVb2Tvn5R0Y7yYOVio0k5vwR3fEyDC9ykAP',
    access_token:         '',
    access_token_secret:  '',
  
};
// var T = new Twit(config);
// T.post('statuses/retweet/:id', {id : '1240925319709655045'}, function(err, data, response) {   
//     if(err){
//         console.log(err)
//     }
//     if(data){   
//         console.log(data)
//     }
// })
var db = require('../.././../database/db');
var urllib = require('urllib');
require("dotenv").config({ path: path.resolve(__dirname, '../../../.env') });
function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}
//console.log(new Date(1625720400000))
function checkUpload(asset_id,accessToken,count){
    return new Promise((resolve, reject) => {
        console.log("checking upload");
        const request_data = {
            url: process.env.FBGRAPHAPIVERSION+asset_id+'?fields=status_code&access_token='+accessToken,
            method: 'GET',
        }
        request(
            {
                url: request_data.url,
                method: request_data.method,
            },
            function(error, response, body) {
                if (error){
                    console.log("checking err");
                    reject(error);
                }
                else if (body){
                    var jResp = JSON.parse(body);
                    console.log("MEDIA CHECK:  ");
                    console.log(jResp);
                    if (jResp.status_code == 'FINISHED'){
                        resolve({'id': jResp.id});
                    }
                    else if (jResp.status_code=='IN_PROGRESS'){ 
                        // console.log(count);
                        if (count>=5){ //How many times it should check 
                            console.log("Rejecting count: "+ count);
                            reject(error);
                        }
                        else
                        {
                            var seconds = 30 
                            if (count==0){
                                var seconds = 10
                            }
                            var waitTill = new Date(new Date().getTime() + seconds * 1000); // Number of Seconds before rechecking (recommended: No more than once per minute for no more than 5 minutes)
                            while(waitTill > new Date()){}
                            checkUpload(asset_id,accessToken,count + 1).then(
                                data=>{resolve({'id': jResp.id})},
                            err=>{
                                console.log("Rejecting inner: "+ count);
                                reject("Took too long");
                            });
                        }        
                    }
                    else{
                        console.log("Rejecting outer: "+ count);
                        reject(error); 
                    }                    
                }
            }
        )
    });
}

function linked_in_upload_req(aToken,page_id,video){
    var payload = {
        "registerUploadRequest":{
           "owner": page_id,
           "recipes":[
              "urn:li:digitalmediaRecipe:feedshare-image"
           ],
           "serviceRelationships":[
              {
                 "identifier":"urn:li:userGeneratedContent",
                 "relationshipType":"OWNER"
              }
           ],
           "supportedUploadMechanism":[
              "SYNCHRONOUS_UPLOAD"
           ]
        }
     }
     if (video){
         payload.registerUploadRequest.recipes = ['urn:li:digitalmediaRecipe:feedshare-video'];
         delete payload.registerUploadRequest.supportedUploadMechanism;
         console.log(payload);
     }
    return new Promise((resolve, reject) => {
            urllib.request('https://api.linkedin.com/v2/assets?action=registerUpload',{
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer '+ aToken,
                },
                data: payload,
                timeout: 50000 
                }, function(error, resp) {
                    if (error){
                        console.log("_E____R________R_____O________R___");
                        reject({'error':error});
                    }
                    else{
                        // console.log(JSON.parse(resp));
                        console.log("_S____C________C_____E________S___");
                        resolve(resp);
                    }
                }
            );
    });
}

function linked_in_upload_img(aToken,url,element){
    return new Promise((resolve, reject) => {
        console.log(url);
        console.log(element);
        fs.createReadStream(element).pipe(request.put(url,{
                method: 'PUT',
                headers: { Authorization: 'Bearer '+ aToken},
            }
            ,function(err, httpsResponse, body){
                if ( err ) {
                    console.log('err', err);
                    reject(err);
                } else if (httpsResponse.statusCode==201) { //201 expected when upload complete, body is empty
                    resolve(201);
                }
                // else {
                //     console.log(httpsResponse);
                // }
            })
        );
    });
}

function linked_in_upload_vid(aToken,url,file_path,asset_arr){
    return new Promise((resolve, reject) => {
        const fileBuffer = fs.readFileSync(file_path); // Set filename here..
        const options = {
            uri: url, /* Set url here. */
            body: fileBuffer,
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        };        
        request.post(options, (err, response, body) =>{
            if ( err ) {
                console.log('err', err);
                reject(err);
            } else  if (response.statusCode==200) {
                //200 expected when upload complete, body is empty
                //console.log(response.headers);
                //console.log(response.statusCode);
                checkUploadLinkedin(aToken,asset_arr,0).then(
                    data=>{
                        console.log("UPLOAD RESOLVED");
                        resolve('UPLOADED');
                    },
                    err=>{
                        console.log(err);
                        reject(err);
                    }
                );
                
            }
        });
    });
}
function checkUploadLinkedin(aToken,asset_arr,count){
    console.log(asset_arr)
    return new Promise((resolve, reject) => {
        urllib.request('https://api.linkedin.com/v2/assets/'+asset_arr[0].split(":")[3],{ //replaced .substing(25) with .split[":"][3]
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer '+ aToken,
            }
            }, function(error, resp) {
                if (error){
                    console.log("Rejecting request err: "+ count);
                    reject({'error':error});
                }
                else{
                    jResp= JSON.parse(resp);
                    console.log(jResp.recipes[0].status);
                    if (jResp.recipes[0].status=='AVAILABLE'){
                        resolve(jResp);                    
                    }
                    else if (jResp.recipes[0].status=='PROCESSING' ){ 
                        // console.log(count);
                        if (count>=5){ //How many times it should check 
                            console.log("Rejecting count: "+ count);
                            reject(error);
                        }
                        else
                        { 
                            var waitTill = new Date(new Date().getTime() + 3 * 1000); // Number of Seconds before rechecking
                            while(waitTill > new Date()){}
                            checkUploadLinkedin(aToken,asset_arr,count + 1).then(
                                data=>{resolve(jResp)},
                            err=>{
                                console.log("Rejecting inner: "+ count);
                                reject("Took too long");
                            });
                        }
                    }
                    else{
                        console.log("Rejecting outer: "+ count);
                        reject(error); 
                    }
                }            
            }        
        );
    });
}

function getimagepath(link,name){
    return new Promise(function(resolve, reject){
        var cnt = 0
        var newlink = []
        var download = function(uri, fname, callback){
            request.head(uri, function(err, res, body){     
              request(uri).pipe(fs.createWriteStream(fname)).on('close', callback);
            });
        };
        // link.forEach(element => {    
        async.forEachOf(link,async (element,key, callback) => {    
            var uploadpath = path.resolve(__dirname, '../../')
            console.log(key)
            var fileurl = await getmediafileurl(element)
            download(fileurl, uploadpath+'/uploads'+name[key], function(data){
                newlink[key] = uploadpath+'/uploads'+name[key]
                cnt = cnt + 1
                if(cnt==link.length){
                    resolve(newlink)
                }
            })
        });
    })
}

function getivideopath(link,name){
    return new Promise(async function(resolve, reject){
        var cnt = 1
        var newlink = []
        var download = function(uri, fname, callback){
            request.head(uri, function(err, res, body){              
              request(uri).pipe(fs.createWriteStream(fname)).on('close', callback);
            });
        };
        var fileurl = await getmediafileurl(link)
        var uploadpath = path.resolve(__dirname, '../../')
        download(fileurl, uploadpath+'/uploads'+name, function(data){
            resolve(uploadpath+'/uploads'+name)
        })
    })
}

function checkUploadTwitter(config,asset_id,count){
    return new Promise((resolve, reject) => {
        console.log("checking upload");
        const oauth = OAuth({
            consumer: { key: config.consumer_key, secret: config.consumer_secret },
            signature_method: 'HMAC-SHA1',
            hash_function(base_string, key) {
                return crypto
                    .createHmac('sha1', key)
                    .update(base_string)
                    .digest('base64')
            },
        });
        const request_data = {
            url: 'https://upload.twitter.com/1.1/media/upload.json?command=STATUS&media_id='+asset_id,
            method: 'GET',
        }
        const token = {
            key: config.access_token,
            secret: config.access_token_secret,
        }
        request(
            {
                url: request_data.url,
                method: request_data.method,
                form: request_data.data,
                headers: oauth.toHeader(oauth.authorize(request_data, token)),
            },
            function(error, response, body) {
                if (error){
                    console.log("checking err");
                    reject(error);
                }
                else if (body){
                    var jResp = JSON.parse(body);
                    console.log("MEDIA CHECK:  ");
                    console.log(jResp);
                    if (jResp.processing_info.state == 'succeeded'){
                        resolve({'media_id_string': jResp.media_id_string , 'media_key': jResp.media_key});
                    }
                    else if (jResp.processing_info.state=='pending' || jResp.processing_info.state=='in_progress'){ 
                        // console.log(count);
                        if (count>=3){ //How many times it should check 
                            console.log("Rejecting count: "+ count);
                            reject(error);
                        }
                        else
                        { 
                        var waitTill = new Date(new Date().getTime() + 3 * 1000); // Number of Seconds before rechecking
                        while(waitTill > new Date()){}
                        checkUploadTwitter(config,asset_id,count + 1).then(
                            data=>{resolve({'media_id_string': jResp.media_id_string ,'media_key': jResp.media_key})},
                        err=>{
                            console.log("Rejecting inner: "+ count);
                            reject("Took too long");
                        });
                        }
        
                    }
                    else{
                        console.log("Rejecting outer: "+ count);
                        reject(error); 
                    }
                    
                }
            }
        )
    });
}

//Bucket file path
function getmediafileurl(fid){
    return new Promise(function(resolve, reject){
        db.query('SELECT * FROM `td_bucket_file` WHERE F_id = ?', [fid],async function (error, results) {    
            if(results.length>0){
                resolve(results[0]['file_preview'])
            }else{
                resolve('')
            }
        })
    })
}

//Bucket file path
function getmediafilelocalurl(fid){
    return new Promise(function(resolve, reject){
        db.query('SELECT * FROM `td_bucket_file` WHERE F_id = ?', [fid],async function (error, results) {    
            if(results.length>0){
                resolve('https://digital.cloudX.in/api/uploads/'+results[0]['thumbnail'])
            }else{
                resolve('')
            }
        })
    })
}

//Share Post
function FacebookAutoShare(postid,userid,brand){
    db.query('Select * from td_brand where brand_id=?', [brand], function (error, brandArr) {
        if (error) {
            console.log('db error=>'+error)
        } else {
            console.log(brandArr)
            if(brandArr.length>0){
                if(brandArr.length>0){
                    var autoshare = brandArr[0].auto_share
                    if(autoshare=='yes'){
                        var hashtag = ''
                        //Default.findmemberbycategory(hashtag,userid, async function (err, results) {
                        db.query('SELECT username FROM `td_users` WHERE parent_id = ? and role = 2', [userid],function (err, results) {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                console.log(results)
                                var users = results.map(function(user){return user.username});
                                console.log(users)
                                if(users.length>0){
                                    db.query('select * from td_channels where username IN (?) AND brand_id = ? AND access_media = "facebook"  ORDER BY `td_channels`.`channel_id` ASC', [users,brand],function (err, result) {
                                        if (err) {
                                            console.log('db error=>'+err)
                                        }
                                        else if (result && result.length) {
                                            if(result.length>0){
                                                result.forEach(user => {
                                                    urllib.request(process.env.FBGRAPHAPIVERSION+user.page_id+'/feed' ,{
                                                        timeout: 100000,
                                                        data: {
                                                            // message: req.body.message,
                                                            access_token: user.accessToken,
                                                            published: 'true',
                                                            link : 'https://www.facebook.com/'+postid
                                                        },
                                                        method: 'POST',
                                                        headers: {
                                                        'Content-Type': 'application/json'
                                                        }
                                                    }, function(error, resp) {
                                                                if (error){
                                                                    console.log('fb error=>'+error)
                                                                }
                                                                else
                                                                {
                                                                    str_resp = JSON.parse(resp);
                                                                    console.log(user.user_id+'yes==>'+'https://www.facebook.com/'+postid);
                                                                    console.log(str_resp); 
                                                                }
                                                        }
                                                    );
                                                })
                                            }
                                        }  
                                        else
                                        {
                                            console.log('Channel not found!')
                                        }                  
                                    });
                                }
                            }
                        })
                    }
                }
            }
        }
    })
}

function LinkedinAutoShare(postid,userid,brand){
    db.query('Select * from td_brand where brand_id=?', [brand], function (error, brandArr) {
        if (error) {
            console.log('db error=>'+error)
        } else {
            console.log(brandArr)
            if(brandArr.length>0){
                if(brandArr.length>0){
                    var autoshare = brandArr[0].auto_share
                    if(autoshare=='yes'){
                        var hashtag = ''
                        //Default.findmemberbycategory(hashtag,userid, async function (err, results) {
                        db.query('SELECT username FROM `td_users` WHERE parent_id = ? and role = 2', [userid],function (err, results) {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                console.log(results)
                                var users = results.map(function(user){return user.username});
                                console.log(users)
                                if(users.length>0){
                                    db.query('select * from td_channels where username IN (?) AND brand_id = ? AND access_media = "linkedin"  ORDER BY `td_channels`.`channel_id` ASC', [users,brand],function (err, result) {
                                        if (err) {
                                            console.log('db error=>'+err)
                                        }
                                        else if (result && result.length) {
                                            if(result.length>0){
                                                result.forEach(user => {
                                                    urllib.request('https://api.linkedin.com/v2/socialActions/'+postid+'/likes',{
                                                        method: 'POST',
                                                        headers: {
                                                        'Content-Type': 'application/json',
                                                        Authorization: 'Bearer '+ user.accessToken,
                                                        },
                                                        data: {
                                                            "actor": user.page_id,
                                                            "object": postid
                                                        },
                                                        }, function(error, resp) {
                                                            if (error){
                                                                console.log(error)
                                                            }
                                                            else{   
                                                                var resp = JSON.parse(resp)
                                                                console.log(resp)
                                                            }
                                                        }
                                                    );
                                                })
                                            }
                                        }  
                                        else
                                        {
                                            console.log('Channel not found!')
                                        }                  
                                    });
                                }
                            }
                        })
                    }
                }
            }
        }
    })
}

function TwitterAutoShare(postid,userid,brand){
    db.query('Select * from td_brand where brand_id=?', [brand], function (error, brandArr) {
        if (error) {
            console.log('db error=>'+error)
        } else {
            console.log(brandArr)
            if(brandArr.length>0){
                if(brandArr.length>0){
                    var autoshare = brandArr[0].auto_share
                    if(autoshare=='yes'){
                        var hashtag = ''
                        //Default.findmemberbycategory(hashtag,userid, async function (err, results) {
                        db.query('SELECT username FROM `td_users` WHERE parent_id = ? and role = 2', [userid],function (err, results) {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                console.log(results)
                                var users = results.map(function(user){return user.username});
                                console.log(users)
                                if(users.length>0){
                                    db.query('select * from td_channels where username IN (?) AND brand_id = ? AND access_media = "twitter"  ORDER BY `td_channels`.`channel_id` ASC', [users,brand],function (err, result) {
                                        if (err) {
                                            console.log('db error=>'+err)
                                        }
                                        else if (result && result.length) {
                                            if(result.length>0){
                                                result.forEach(user => {
                                                    var new_config = {};       
                                                    for (let key in config) {
                                                        new_config[key] = config[key];
                                                    }
                                                    new_config.access_token = user.accessToken;
                                                    new_config.access_token_secret = user.accessTokenSecret;
                                                    var T = new Twit(new_config);
                                                    T.post('statuses/retweet/'+postid,  {},function(err, data, response) {
                                                        if(err){
                                                            console.log(err)
                                                        }
                                                        if(data){   
                                                            console.log(data)
                                                            //console.log(response)
                                                        }
                                                    })
                                                })
                                            }
                                        }  
                                        else
                                        {
                                            console.log('Channel not found!')
                                        }                  
                                    });
                                }
                            }
                        })
                    }
                }
            }
        }
    })
}

function InstagramAutoShare(post_type,message,mediaArr,userid,brand){
    db.query('Select * from td_brand where brand_id=?', [brand], function (error, brandArr) {
        if (error) {
            console.log('db error=>'+error)
        } else {
            console.log(brandArr)
            if(brandArr.length>0){
                if(brandArr.length>0){
                    var autoshare = brandArr[0].auto_share
                    if(autoshare=='yes'){
                        var hashtag = ''
                        //Default.findmemberbycategory(hashtag,userid, async function (err, results) {
                        db.query('SELECT username FROM `td_users` WHERE parent_id = ? and role = 2', [userid],function (err, results) {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                console.log(results)
                                var users = results.map(function(user){return user.username});
                                console.log(users)
                                if(users.length>0){
                                    db.query('select * from td_channels where username IN (?) AND brand_id = ? AND access_media = "instagram"  ORDER BY `td_channels`.`channel_id` ASC', [users,brand],function (err, result) {
                                        if (err) {
                                            console.log('db error=>'+err)
                                        }
                                        else if (result && result.length) {
                                            if(result.length>0){
                                                result.forEach(async user => {
                                                    var encoded = encodeURIComponent(message);
                                                    if(post_type=='video'){ //Video Post
                                                        var fileurl = await getmediafilelocalurl(mediaArr[0])
                                                        var options = {
                                                            'method': 'POST',
                                                            'url': process.env.FBGRAPHAPIVERSION+user.page_id+'/media?media_type=VIDEO&video_url='+fileurl+'&caption='+encoded+'&access_token='+user.accessToken,
                                                            'headers': {
                                                            }
                                                        };
                                                        request(options, function (error, response) {
                                                            if (error){
                                                                console.log(error)
                                                                // db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                            }
                                                            else
                                                            {
                                                                checkUpload(JSON.parse(response['body']).id,user.accessToken,0).then(
                                                                    data2=>{
                                                                        console.log("UPLOAD RESOLVED");
                                                                        console.log(data2)
                                                                        var access_fbtoken =user.accessToken;
                                                                        requestify.request(process.env.FBGRAPHAPIVERSION+user.page_id+'/media_publish?creation_id='+data2["id"]+'&access_token='+ access_fbtoken, {
                                                                            method: 'POST',
                                                                            headers: {
                                                                                'Content-Type': 'application/json'
                                                                            }
                                                                        }).then(function(response) {
                                                                            result = JSON.parse(response.body)
                                                                            console.log(result);
                                                                            //db.query('update td_schedule_post_channel set status=2,response="success" where post_id= ? and channel_id=?', [sid,channel]);
                                                                        })
                                                                        .fail(function(response) {
                                                                            console.log(response);
                                                                            //db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                                            //return res.status(200).json({'error':response});
                                                                        });
                                                                    },
                                                                    err=>{
                                                                        console.log(err);
                                                                        //db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                                    }
                                                                );
                                                            }
                                                        });
                                                    }
                                                    if(post_type=='image'){ //Image Post
                                                        var fileurl = await getmediafilelocalurl(mediaArr[0])
                                                        var options = {
                                                            'method': 'POST',
                                                            'url': process.env.FBGRAPHAPIVERSION+user.page_id+'/media?image_url='+fileurl+'&caption='+encoded+'&access_token='+user.accessToken,
                                                            'headers': {
                                                            }
                                                        };
                                                        request(options, function (error, response) {
                                                            if (error){
                                                                console.log(error)
                                                                //db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                            }else{
                                                                console.log(JSON.parse(response['body']));
                                                                checkUpload(JSON.parse(response['body']).id,user.accessToken,0).then(
                                                                    data2=>{
                                                                        console.log("UPLOAD RESOLVED");
                                                                        console.log(data2)
                                                                        var access_fbtoken =user.accessToken;
                                                                        requestify.request(process.env.FBGRAPHAPIVERSION+user.page_id+'/media_publish?creation_id='+data2["id"]+'&access_token='+ access_fbtoken, {
                                                                            method: 'POST',
                                                                            headers: {
                                                                                'Content-Type': 'application/json'
                                                                            }
                                                                        }).then(function(response) {
                                                                            result = JSON.parse(response.body)
                                                                            console.log(result);
                                                                            //db.query('update td_schedule_post_channel set status=2,response="success" where post_id= ? and channel_id=?', [sid,channel]);
                                                                        })
                                                                        .fail(function(response) {
                                                                            console.log(response);
                                                                            //db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                                            //return res.status(200).json({'error':response});
                                                                        });
                                                                    },
                                                                    err=>{
                                                                        console.log(err);
                                                                        //db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                                    }
                                                                );
                                                            }
                                                        });
                                                    }
                                                })
                                            }
                                        }  
                                        else
                                        {
                                            console.log('Channel not found!')
                                        }                  
                                    });
                                }
                            }
                        })
                    }
                }
            }
        }
    })
}

// var e = timeConverter(1625551241)
// console.log(e)
cron.schedule('*/60 * * * * *', () => {
    //new Date(year, month, day, hours, minutes, seconds, milliseconds)
    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    console.log('running a task every 60 second auto post==> ' + date_ob.getTime() + ' ' + hours + ':' + minutes);
    //SchedulePost.find({schedule_time:{$gte: new Date().getTime(),$lt: new Date().getTime()+ 1000 * 60}},(error, dataArr) => {
    var time1 = new Date().getTime()
    var time2 = new Date().getTime()+ 1000 * 60
    console.log('date_ob',new Date());
    console.log('SELECT * FROM `td_schedule_post` WHERE schedule_time>=? AND schedule_time<?', [time1,time2]);
   
    db.query('SELECT * FROM `td_schedule_post` WHERE schedule_time>=? AND schedule_time<?', [time1,time2], function (error, dataArr) {
        if (error) {
            console.log('db error=>'+error)
        } else {
            console.log('td_schedule_post',dataArr);
            if(dataArr.length>0){
               
                console.log('dataa',dataArr);
                async.forEachOf(dataArr,async (post,key, callback) => {
                    var channelArr = JSON.parse(post.channel_arr) 
                    //var mediaArr = JSON.parse(post.media)
                    //var medianameArr = JSON.parse(post.medianame)
                   // var mediamimeArr = JSON.parse(post.mime)
                    var message = post.message
                    var videodesc = post.videoDesc
                    var brandid = post.brand_id
                    var sid = post.sid
                    var post_type = post.post_type
                    var user_id = post.user_id
                    const account_active= await helper.checkAccountExpiry(user_id);
                    if(account_active){
                        db.query('update td_schedule_post set status=1 where sid= ?', [sid]);
                        async.forEachOf(channelArr,async (channel,key, callback) => {
                            //console.log(channel)
                            // channelSchema.findOne({channel_id: channel}).then(async function (result) {
                            db.query('SELECT * FROM `td_channels` WHERE channel_id = ?', [channel],async function (error, results) {    
                                //console.log(results)
                                if (results.length>0) {
                                    var result = results[0]
                                    console.log(result.access_media)
                                    // Facebook Post
                                    db.query('SELECT bf.* FROM td_schedule_post_file as spf LEFT JOIN td_bucket_file as bf on spf.bucket_file_id=bf.F_id WHERE spf.schedule_post_id=?', [sid], function (error, mediaArr) {
                                    if(result.access_media=='facebook'){
                                        if(post_type=='text'){ // Text post
                                            urllib.request(process.env.FBGRAPHAPIVERSION+result.page_id+'/feed' ,{
                                                data: {
                                                    message: message,
                                                    access_token: result.accessToken,
                                                    published: 'true',
                                                },
                                                method: 'POST',
                                                headers: {
                                                'Content-Type': 'application/json'
                                                }}, async function(error, resp) {
                                                    if (error){
                                                        console.log(error); 
                                                        db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                    }
                                                    else
                                                    {
                                                        str_resp = JSON.parse(resp);
                                                        //console.log('yes');
                                                        //console.log(str_resp); 
                                                        if(str_resp.error){
                                                            console.log(str_resp.error.error_user_msg); 
                                                            db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                        }else{
                                                            console.log(str_resp['id']);
                                                            FacebookAutoShare(str_resp['id'],result.username,result.brand_id)
                                                            db.query('update td_schedule_post_channel set status=2,response="success" where post_id= ? and channel_id=?', [sid,channel]);
                                                            await helperDigital.get_fb_post({user_id:user_id});
                                                        }
                                                    }
                                                }
                                            );
                                        }else if(post_type=='image'){ // Image post
                                        
                                                if (mediaArr.length>0) {
                                                var mediaIdArr = []
                                                    var cnt = 0
                                                    async.forEachOf(mediaArr,async (media,key, callback) => {
                                                    fileurl=process.env.MEDIA_PATH+media.file_preview+'/'+media.file_name
                                                        // mediaArr.forEach(media => {
                                                        //var fileurl = await getmediafileurl(media)
                                                        var zdata = {
                                                            message: message,
                                                            published: 'false',
                                                            temporary: 'false',
                                                            access_token: result.accessToken,
                                                            url:fileurl
                                                        }
                                                        requestify.request(process.env.FBGRAPHAPI+result.page_id+'/photos', {
                                                            method: 'POST',
                                                            body: zdata,
                                                            dataType: 'form-url-encoded',
                                                        }).then(function(response) {
                                                            cnt = cnt + 1
                                                            var rs = JSON.parse(response.body)
                                                            var str_resp = rs
                                                            console.log('yes');
                                                            console.log(str_resp);
                                                            if(str_resp.error){
                                                                console.log(str_resp.error.error_user_msg);
                                                            }else{
                                                                console.log(str_resp['id']);
                                                                mediaIdArr[key] = str_resp['id']
                                                            }
                                                            if(mediaArr.length==cnt){
                                                                var schedule_str = '';
                                                                var published_str = '';
                                                                var encoded_message =  encodeURIComponent(message)    
                                                                var mediakey ='';
                                                                console.log(mediaIdArr)
                                                                mediaIdArr.map((element,index) => {
                                                                    mediakey = mediakey + "&attached_media["+index+"]={media_fbid:"+element+"}";
                                                                });                  
                                                                console.log(mediakey) 
                                                                urllib.request(process.env.FBGRAPHAPIVERSION+result.page_id+'/feed?+access_token='+result.accessToken+published_str+'&message='+encoded_message+mediakey+schedule_str ,{
                                                                    method: 'POST',
                                                                    headers: {
                                                                        'Content-Type': 'application/json'
                                                                    }
                                                                }, async function(error, resp) {
                                                                    if (error){
                                                                        db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                                        //return res.status(200).json({'error':error});
                                                                    }
                                                                    else
                                                                    {
                                                                        var str_resp = JSON.parse(resp);
                                                                        console.log('yes');
                                                                        console.log(str_resp); 
                                                                        if(str_resp.error){
                                                                            console.log(str_resp.error.error_user_msg); 
                                                                            db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                                        }else{
                                                                            console.log(str_resp['id']);
                                                                            FacebookAutoShare(str_resp['id'],result.username,result.brand_id)
                                                                            db.query('update td_schedule_post_channel set status=2,response="success" where post_id= ? and channel_id=?', [sid,channel]);
                                                                            await helperDigital.get_fb_post({user_id:user_id});
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        })
                                                        .fail(function(response) {
                                                            cnt = cnt + 1
                                                            console.log(response.body.error.message);
                                                            db.query('update td_schedule_post_channel set status=1,response="'+response.body.error.message+'" where post_id= ? and channel_id=?', [sid,channel]);
                                                            if(response.body.error.type=='OAuthException'){
                                                                db.query('update td_schedule_post set reason="access token expired or invalid" where sid= ?', [sid]);
                                                            }
                                                        });
                                                
                                                    });   
                                                }
                                                                                
                                        }else if(post_type=='video'){ // Video post
                                                if (mediaArr.length>0) {
                                                    async.forEachOf(mediaArr,async (media,key, callback) => {
                                                        fileurl=process.env.MEDIA_PATH+media.file_preview+'/'+media.file_name
                                                        console.log('fileurl',fileurl);
                                                        var options = {
                                                            'method': 'POST',
                                                            'url': process.env.FBGRAPHAPIVERSION+result.page_id+"/videos",
                                                            'headers': {
                                                            },
                                                            form:{
                                                                'file_url': fileurl,
                                                                'title': videodesc,
                                                                'description': message,
                                                                'access_token': result.accessToken,
                                                            }
                                                        };
                                                        request(options, async function (error, response) {
                                                            if (error){
                                                                console.log(error)
                                                                db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                                await helperDigital.get_fb_post({user_id:user_id});
                                                            }else{
                                                                console.log(JSON.parse(response['body'])['id']);
                                                                FacebookAutoShare(JSON.parse(response['body'])['id'],result.username,result.brand_id)
                                                                db.query('update td_schedule_post_channel set status=2,response="success" where post_id= ? and channel_id=?', [sid,channel]);
                                                            } 
                                                        });
                                                    }); 
                                                }
                                            
                                        }
                                    }
                                    // Instagram Post
                                    if(result.access_media=='instagram'){
                                        if(mediaArr.length>0){
                                            var encoded = encodeURIComponent(message);
                                            if(post_type=='video'){ 
                                                //Video Post
                                                async.forEachOf(mediaArr,async (media,key, callback) => {
                                                    fileurl=process.env.MEDIA_PATH+media.file_preview+'/'+media.file_name
                                                        var options = {
                                                            'method': 'POST',
                                                            'url': process.env.FBGRAPHAPIVERSION+result.page_id+'/media?media_type=VIDEO&video_url='+fileurl+'&caption='+encoded+'&access_token='+result.accessToken,
                                                            'headers': {
                                                            }
                                                        };
                                                        request(options, function (error, response) {
                                                            if (error){
                                                                console.log(error)
                                                                db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                            }
                                                            else
                                                            {
                                                                checkUpload(JSON.parse(response['body']).id,result.accessToken,0).then(
                                                                    data2=>{
                                                                        console.log("UPLOAD RESOLVED");
                                                                        console.log(data2)
                                                                        var access_fbtoken =result.accessToken;
                                                                        requestify.request(process.env.FBGRAPHAPIVERSION+result.page_id+'/media_publish?creation_id='+data2["id"]+'&access_token='+ access_fbtoken, {
                                                                            method: 'POST',
                                                                            headers: {
                                                                                'Content-Type': 'application/json'
                                                                            }
                                                                        }).then(async function(response) {
                                                                            var rsdata = JSON.parse(response.body)
                                                                            console.log(rsdata);
                                                                            InstagramAutoShare(post_type,message,mediaArr,result.username,result.brand_id)
                                                                            db.query('update td_schedule_post_channel set status=2,response="success" where post_id= ? and channel_id=?', [sid,channel]);
                                                                            await helperDigital.get_insta_post({user_id:user_id});
                                                                        })
                                                                        .fail(function(response) {
                                                                            console.log(response);
                                                                            db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                                            //return res.status(200).json({'error':response});
                                                                        });
                                                                    },
                                                                    err=>{
                                                                        console.log(err);
                                                                        db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                                    }
                                                                );
                                                            }
                                                        });
                                            
                                                });
                                            }
                                            if(post_type=='image'){ 
                                                //Image Post
                                                async.forEachOf(mediaArr,async (media,key, callback) => {
                                                    fileurl=process.env.MEDIA_PATH+media.file_preview+'/'+media.file_name
                                                    //var fileurl = await getmediafilelocalurl(mediaArr[0])
                                                    console.log(fileurl)
                                                    var options = {
                                                        'method': 'POST',
                                                        'url': process.env.FBGRAPHAPIVERSION+result.page_id+'/media?image_url='+fileurl+'&caption='+encoded+'&access_token='+result.accessToken,
                                                        'headers': {
                                                        }
                                                    };
                                                    request(options, function (error, response) {
                                                        if (error){
                                                            console.log(error)
                                                            db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                        }else{
                                                            console.log(JSON.parse(response['body']));
                                                            checkUpload(JSON.parse(response['body']).id,result.accessToken,0).then(
                                                                data2=>{
                                                                    console.log("UPLOAD RESOLVED");
                                                                    console.log(data2)
                                                                    var access_fbtoken =result.accessToken;
                                                                    requestify.request(process.env.FBGRAPHAPIVERSION+result.page_id+'/media_publish?creation_id='+data2["id"]+'&access_token='+ access_fbtoken, {
                                                                        method: 'POST',
                                                                        headers: {
                                                                            'Content-Type': 'application/json'
                                                                        }
                                                                    }).then(async function(response) {
                                                                        var rsdata = JSON.parse(response.body)
                                                                        console.log(rsdata);
                                                                        console.log('call auto share');
                                                                        InstagramAutoShare(post_type,message,mediaArr,result.username,result.brand_id)
                                                                        db.query('update td_schedule_post_channel set status=2,response="success" where post_id= ? and channel_id=?', [sid,channel]);
                                                                        await helperDigital.get_insta_post({user_id:user_id});
                                                                    })
                                                                    .fail(function(response) {
                                                                        console.log('not call auto share');
                                                                        console.log(response);
                                                                        db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                                        //return res.status(200).json({'error':response});
                                                                    });
                                                                },
                                                                err=>{
                                                                    console.log(err);
                                                                    db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                                }
                                                            );
                                                        }
                                                    });
                                                
                                            });
                                            }
                                        }
                                    }
                                
                                    //Linkedin Post
                                    if (result.access_media=='linkedin'){
                                        if(post_type=='text'){ // Text post
                                            var aToken = result.accessToken;
                                            var LI_post_json =  {
                                                "distribution": {
                                                    "linkedInDistributionTarget": {}
                                                },
                                                "owner": result.page_id,
                                                "subject": message + ' Subject',
                                                "text": {
                                                    "text": message
                                                }
                                            }
                                            urllib.request('https://api.linkedin.com/v2/shares',{
                                                method: 'POST',
                                                headers: {
                                                'Content-Type': 'application/json',
                                                Authorization: 'Bearer '+ aToken,
                                                },
                                                data: LI_post_json,
                                                }, async function(error, resp) {
                                                    if (error){
                                                        console.log(error)
                                                        db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                    }
                                                    else{   
                                                        var resp = JSON.parse(resp)
                                                        console.log(resp)
                                                        if(resp.activity){
                                                            LinkedinAutoShare(resp.activity,result.username,result.brand_id)
                                                        }
                                                        db.query('update td_schedule_post_channel set status=2,response="success" where post_id= ? and channel_id=?', [sid,channel]);
                                                        await helperDigital.get_linkedin_post({user_id:user_id});
                                                    }
                                                }
                                            );
                                        }else if(post_type=='image'){ // Image post
                                            var mediaIdArr = []
                                            var cnt = 0
                                            var count = 0;
                                            var count_u = 0;
                                            var upload_url =[];
                                            var asset_arr=[];
                                            var aToken = result.accessToken;
                                            var image_arr = []
                                            async.forEachOf(mediaArr,async (media,key, callback) => {
                                                console.log(key,media.file_name)
                                                var uploadpath = path.resolve(__dirname, '../../../telemedia')
                                                image_arr[key]=uploadpath+'/'+media.file_preview+'/'+media.file_name
                                            });
                                            console.log('image_arr',image_arr)
                                            //var image_arr = await getimagepath(mediaArr,medianameArr)
                                            image_arr.map((element,i)=>{
                                                linked_in_upload_req(aToken,result.page_id,false).then(
                                                    data=>{
                                                        count = count + 1;
                                                        data = JSON.parse(data);
                                                        console.log(data)
                                                        try {
                                                          upload_url[i]=data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl; // Saving URL and Asset ID for Uploading and reference
                                                        } catch (err) {
                                                            console.log('instagram_error',err);
                                                            if(data.status==401){
                                                                db.query('update td_schedule_post_channel set status=1,response="'+data.message+'" where post_id= ? and channel_id=?', [sid,channel]);
                                                                db.query('update td_schedule_post set reason="access token expired or invalid" where sid= ?', [sid]);
                                                            }
                                                        }
                                                        asset_arr[i]=data.value.asset;
                                                        console.log("Asset_arr: "+asset_arr[i]);
                                                        if (count==image_arr.length){ // checking if number of upload requsts created are adequate
                                                            image_arr.map((element,i)=>{
                                                                console.log(upload_url[i])
                                                                linked_in_upload_img(aToken,upload_url[i],element).then(
                                                                data=>{ // Doesn't check for data value as a Status(201) is expected as upload confirmation
                                                                    // console.log("After");    
                                                                    // console.log(data);
                                                                    console.log("Count_u: "+count_u);
                                                                    count_u = count_u + 1;
                                                                    if (count_u == image_arr.length)
                                                                    {
                                                                        console.log(asset_arr);
                                                                        //
                                                                        var LI_post_json =  {
                                                                            "distribution": {
                                                                                "linkedInDistributionTarget": {}
                                                                            },
                                                                            "owner": result.page_id,
                                                                            "subject": message + ' Subject',
                                                                            "text": {
                                                                                "text": message
                                                                            }
                                                                        }
                                                                        var entity=[];
                                                                        asset_arr.map((element,i)=>{
                                                                        var x = {'entity': element}
                                                                            entity.push(x);
                                                                        });
                                                                        LI_post_json['content'] = {
                                                                            "contentEntities": entity,
                                                                            "title": message + ' Title',
                                                                            "shareMediaCategory": "IMAGE"
                                                                        }
                                                                        urllib.request('https://api.linkedin.com/v2/shares',{
                                                                            method: 'POST',
                                                                            headers: {
                                                                            'Content-Type': 'application/json',
                                                                            Authorization: 'Bearer '+ aToken,
                                                                            },
                                                                            data: LI_post_json,
                                                                            }, async function(error, resp) {
                                                                                if (error){
                                                                                    console.log(error)
                                                                                    db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                                                }
                                                                                else{   
                                                                                    var resp = JSON.parse(resp)
                                                                                    console.log(resp)
                                                                                    if(resp.activity){
                                                                                        LinkedinAutoShare(resp.activity,result.username,result.brand_id)
                                                                                    }
                                                                                    db.query('update td_schedule_post_channel set status=2,response="success" where post_id= ? and channel_id=?', [sid,channel]);
                                                                                    await helperDigital.get_linkedin_post({user_id:user_id});
                                                                                }
                                                                            }
                                                                        );
                                                                    }
                                                                },
                                                                err=>{
                                                                    console.log(err);
                                                                    db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                                }   
                                                            )
                                                            });
                                                        }
                                                    },
                                                    err=>{
                                                        console.log(err);
                                                    }
                                                );
                                            })
                                        }
                                        else if(post_type=='video'){ // Video post
                                            //var video_file = await getivideopath(mediaArr[0],medianameArr[0])
                                            async.forEachOf(mediaArr,async (media,key, callback) => {
                                                var uploadpath = path.resolve(__dirname, '../../../telemedia')
                                                video_file=uploadpath+'/'+media.file_preview+'/'+media.file_name
                                            });
                                            console.log("VIDEO FILE:  "+ video_file);
                                            var asset_arr=[];
                                            var upload_url =[];
                                            var aToken = result.accessToken;
                                            linked_in_upload_req(aToken,result.page_id,true).then(
                                                data=>{
                                                    data = JSON.parse(data);
                                                    upload_url[0]=data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl; // Saving URL and Asset ID for Uploading and reference
                                                    asset_arr[0]=data.value.asset;
                                                    console.log(asset_arr)
                                                    linked_in_upload_vid(aToken,upload_url[0],video_file,asset_arr).then(
                                                        data=>{ // Doesn't check for data value as a Status(200) is expected as upload confirmation
                                                            // console.log(data);
                                                            console.log(asset_arr);
                                                            var LI_post_json ={
                                                                "author": result.page_id, // will be appended at backend after populating channel_id
                                                                "lifecycleState": "PUBLISHED",
                                                                "specificContent": {
                                                                    "com.linkedin.ugc.ShareContent": {
                                                                        "media": [
                                                                            {
                                                                                "media": asset_arr[0],
                                                                                "status": "READY",
                                                                                "title": {
                                                                                    "attributes": [],
                                                                                    "text": message
                                                                                }
                                                                            }
                                                                        ],
                                                                        "shareCommentary": {
                                                                            "attributes": [],
                                                                            "text": videodesc
                                                                        },
                                                                        "shareMediaCategory": "VIDEO"
                                                                    }
                                                                },
                                                                "visibility": {
                                                                    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                                                                }
                                                            }; 
                                                            urllib.request('https://api.linkedin.com/v2/ugcPosts',{
                                                                method: 'POST',
                                                                headers: {
                                                                'Content-Type': 'application/json',
                                                                Authorization: 'Bearer '+ aToken,
                                                                },
                                                                data: LI_post_json,
                                                                timeout: 50000 
                                                                }, async function(error, resp) {
                                                                    if (error){
                                                                        console.log(error)
                                                                        db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                                    }
                                                                    else{
                                                                        jResp= JSON.parse(resp)
                                                                        console.log("UGC Message:")
                                                                        console.log(jResp);
                                                                        var statuscode;
                                                                        if (jResp.status){
                                                                            statuscode=jResp.status;
                                                                            db.query('update td_schedule_post_channel set status=2,response="success" where post_id= ? and channel_id=?', [sid,channel]);
                                                                            if(jResp.activity){
                                                                                LinkedinAutoShare(jResp.activity,result.username,result.brand_id)
                                                                            }
                                                                            await helperDigital.get_linkedin_post({user_id:user_id});
                                                                        }
                                                                        else {
                                                                            statuscode = 200;
                                                                        }
                                                                        console.log(statuscode)
                                                                        //return res.status(statuscode).send(jResp);
                                                                    }
                                                                }
                                                            );
                                                        },
                                                        err=>{
                                                            console.log("+____________________________+_______"+err);
                                                        }   
                                                    )
                                                },
                                                err=>{
                                                    console.log(err);
                                                }
                                            );
                                        }
                                    }
                                
                                    //Twitter Post
                                    if (result.access_media=='twitter'){
                                        var new_config = {};       
                                        for (let key in config) {
                                            new_config[key] = config[key];
                                        }
                                        new_config.access_token = result.accessToken;
                                        new_config.access_token_secret = result.accessTokenSecret;
                                        var T = new Twit(new_config);
                                        if(post_type=='text'){ // Text post
                                            T.post('statuses/update',  {status: message},async function(err, data, response) {
                                                if(err){
                                                    console.log(err)
                                                    db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                }
                                                if(data){   
                                                    console.log(data)
                                                    TwitterAutoShare(data.id_str,result.username,result.brand_id)
                                                    db.query('update td_schedule_post_channel set status=2,response="success" where post_id= ? and channel_id=?', [sid,channel]);
                                                    await helperDigital.get_twitter_post({user_id:user_id});
                                                }
                                            })
                                        }else if(post_type=='image'){ // Image post
                                            //var image_arr = await getimagepath(mediaArr,medianameArr)
                                            var image_arr = []
                                            async.forEachOf(mediaArr,async (media,key, callback) => {
                                                console.log(key,media.file_name)
                                                var uploadpath = path.resolve(__dirname, '../../../telemedia')
                                                image_arr[key]=uploadpath+'/'+media.file_preview+'/'+media.file_name
                                            });
                                            console.log('image_arr',image_arr)
                                            var media_arr =[];
                                            var cnt = 1
                                            image_arr.map((element,i)=>{
                                                T.postMediaChunked({ file_path: element }, function (err, data, response) {
                                                    if (err){
                                                        console.log(err);
                                                        db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                    }
                                                    if (data){
                                                        console.log(data);
                                                        media_arr.push(data.media_id_string);
                                                        // return res.status(200).send({'media_id_string': data.media_id_string,'media_key': data.media_key});
                                                    }
                                                    if (image_arr.length==cnt){
                                                        var mediaStr = "";
                                                        media_arr.map((element,i)=>
                                                        {
                                                            mediaStr = mediaStr.concat(element);
                                                            if (i < (media_arr.length-1))
                                                            {mediaStr = mediaStr + ",";}
                                                        });
                                                        T.post('statuses/update',  {status: message,media_ids:mediaStr},async function(err, data, response) {
                                                            if(err){
                                                                console.log(err)
                                                                db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                            }
                                                            if(data){   
                                                                console.log(data)
                                                                TwitterAutoShare(data.id_str,result.username,result.brand_id)
                                                                db.query('update td_schedule_post_channel set status=2,response="success" where post_id= ? and channel_id=?', [sid,channel]);
                                                                await helperDigital.get_twitter_post({user_id:user_id});
                                                            }
                                                        })
                                                    }
                                                    cnt = cnt + 1
                                                });
                                            })
                                        }else if(post_type=='video'){ // Video post
                                        // var video_file = await getivideopath(mediaArr[0],medianameArr[0])
                                        async.forEachOf(mediaArr,async (media,key, callback) => {
                                                    var uploadpath = path.resolve(__dirname, '../../../telemedia')
                                                    video_file=uploadpath+'/'+media.file_preview+'/'+media.file_name
                                            });
                                        
                                        console.log(video_file)
                                            var media_arr =[];
                                            var cnt = 1
                                            T.postMediaChunked({ file_path: video_file }, function (err, data, response) {
                                                if (err){
                                                    console.log(err);
                                                }
                                                if (data){
                                                    console.log(data);
                                                    checkUploadTwitter(new_config,data.media_id_string,0).then(
                                                        data2=>{
                                                            console.log("UPLOAD RESOLVED");
                                                            console.log(data2)
                                                            // resolve('UPLOADED');
                                                            media_arr.push(data2.media_id_string);
                                                            var mediaStr = "";
                                                            media_arr.map((element,i)=>
                                                            {
                                                                mediaStr = mediaStr.concat(element);
                                                                if (i < (media_arr.length-1))
                                                                {mediaStr = mediaStr + ",";}
                                                            });
                                                            T.post('statuses/update',  {status: message,media_ids:mediaStr},async function(err, data, response) {
                                                                if(err){
                                                                    console.log(err)
                                                                    db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                                }
                                                                if(data){   
                                                                    console.log(data)
                                                                    TwitterAutoShare(data.id_str,result.username,result.brand_id)
                                                                    db.query('update td_schedule_post_channel set status=2,response="success" where post_id= ? and channel_id=?', [sid,channel]);
                                                                    await helperDigital.get_twitter_post({user_id:user_id});
                                                                }
                                                            })
                                                        },
                                                        err=>{
                                                            console.log(err);
                                                            db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                        }
                                                    );
                                                }
                                            });
                                        }
                                    }
                                    /*
                                    //Youtube Post
                                    if (result.access_media=='youtube'){
                                        if(post_type=='video'){
                                            var video_file = await getivideopath(mediaArr[0],medianameArr[0])
                                            console.log(video_file)
                                            var accesstoekn = await helper.getsocialaccesstoken(user_id,'youtube')
                                            console.log(accesstoekn)
                                            var options = {
                                                'method': 'POST',
                                                'url':  process.env.YT_URL+'upload/youtube/v3/videos?snippet={"categoryId":"22","description":'+message+',"title":'+message+'}&part=snippet',
                                                'headers': {
                                                'Accept': 'video/*, application/octet-stream',
                                                'Authorization': 'Bearer '+accesstoekn.token+''
                                                },
                                                formData: {
                                                'media_file': {
                                                    'value': fs.createReadStream(video_file),
                                                    'options': {
                                                    'filename': medianameArr[0],
                                                    'contentType': null
                                                    }
                                                }
                                                }
                                            };
                                            request(options, function (error, response) {
                                                if (error) {    
                                                    console.log(error)        
                                                    db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                }else{
                                                    let additaional_info = JSON.parse(response.body)
                                                    console.log(additaional_info)        
                                                    if(additaional_info['error']){
                                                        db.query('update td_schedule_post_channel set status=1,response="failed" where post_id= ? and channel_id=?', [sid,channel]);
                                                    }else{
                                                        db.query('update td_schedule_post_channel set status=2,response="success" where post_id= ? and channel_id=?', [sid,channel]);
                                                    } 
                                                }   
                                            }) 
                                        }
                                    }
                                    */
                                
                                });
                                }else {   
                                    console.log("Channel not found! #="+channel);
                                }
                            });
                        })
                    }else{
                        console.log('account expire');
                    }
                })
                
            }
        }
    })
   
    //Check post status
    db.query('SELECT * FROM `td_schedule_post` WHERE status=1', [], function (error, dataArr) {
        if (error) {
            console.log('db error=>'+error)
        } else {
            if(dataArr.length>0){
                async.forEachOf(dataArr,async (post,key, callback) => {
                    var sid = post.sid
                    var user_id = post.user_id
                    const account_active= await helper.checkAccountExpiry(user_id);
                    if(account_active){
                        db.query('SELECT * FROM `td_schedule_post_channel` WHERE status IN (0,1) and post_id=?', [sid], function (error, rows) {
                            if (error) {
                                console.log('db error=>'+error)
                            } else {
                                if(rows.length>0){

                                }else{
                                    db.query('update td_schedule_post set status=2 where sid= ?', [sid]);
                                }
                            }
                        })
                    }else{
                        console.log('account expire');
                    }
                })
            }
        }
    })

})
