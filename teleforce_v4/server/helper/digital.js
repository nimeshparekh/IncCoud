var db = require('../database/db');
var async = require("async");
var admin = require("firebase-admin");
var Digital = require('../model/digital');
var validUrl = require('valid-url');
var Path = require('path');
var Url = require('url');
require("dotenv").config();
require("dotenv").config({ path: Path.resolve(__dirname, '../.env') });
const dateFormat = require('dateformat');
var todaysDate = dateFormat(new Date(), 'yyyy-mm-dd');
var urllib = require('urllib');
var request = require('request');
var Twit = require('twit');
const config = {
    consumer_key:         process.env.TWITTER_CONSUMERKEY,
    consumer_secret:      process.env.TWITTER_CONSUMERSECRET,
    access_token:         '',
    access_token_secret:  '',
  
};
var helperDigital = {
    get_linkedin_post: async function (data) {
        var  that=this
        return new Promise(function (resolve, reject) {
            Digital.get_linkedin_post(todaysDate,data.user_id,async function(err , rows){
                if (err) {
                    resolve(0);
                }
                else{
                    if(rows.length>0){
                        console.log('helperDigital',rows[0]);
                        let channel = rows[0]
                        if(channel){
                            var sync = await that.sync_linkedin(channel)
                            resolve(0)
                        }
                    }else{
                        resolve(0);
                    }
                }
            })
       })
    },
    sync_linkedin: async function (data) {
       var  that=this;
       this.LinkdinTokenExpiryCheck(data);
        return new Promise(function(resolve, reject) {
            var options = {
                'method': 'GET',
                'url': 'https://api.linkedin.com/v2/shares?q=owners&owners='+data.page_id+'&sortBy=LAST_MODIFIED&sharesPerOwner=1000&count=25',
                'headers': {
                    'Authorization': 'Bearer '+data.accessToken,
                }
            };
            request(options, async function (error, response) {
                if (error) {
                    console.log('error_linkdin',error)
                    that.update(data.channel_id)
                }else{
                    
                    var data_post = JSON.parse(response.body) 
                    console.log('data_post',data_post['elements']);               
                    var post = data_post['elements']
                    if(data_post['serviceErrorCode']){
                        that.update(data.channel_id)
                    }else{
                        if(post.length == 0){
                            that.update(data.channel_id)
                        }else{
                            post.forEach(element => {
                                console.log('content',element['content']);
                                var post = {}
                                post.likes = 0
                                post.shares = 0
                                post.message = element['text']['text']
                                post.post_id = element.id
                                post.channel_id = data.channel_id
                                post.brand_id = data.brand_id
                                post.channel_type = 'linkedin'
                                post.publish_time = new Date(element.created.time)
                                post.account_id = data.username
                                post.activity=element.activity
                                if( typeof element['content'] !== 'undefined' &&  element['content']){
                                    post.full_picture = element['content']['contentEntities'][0]['entityLocation']                         
                                }
                                Digital.checkpost(element.id, async function (err, rows) {
                                    if (err) {
                                        that.update(data.channel_id)
                                    }
                                    else {
                                        if(rows.length>0){
                                            Digital.updatepublishpost(post,element.id, async function (err, rows) {
                                                if (err) {
                                                    that.update(data.channel_id)
                                                }
                                                else {
                                                }
                                            })
                                        }else{
                                            Digital.insertpublishpost(post, async function (err, rows) {
                                                if (err) {
                                                    that.update(data.channel_id)
                                                }
                                                else {
                                                }
                                            })
                                        }
                                    }
                                })
                            });
                            that.update(data.channel_id)
                        }
                    }
                    
                }
            })
        })
    },
    update: function (channel_id) {
        return new Promise(function(resolve, reject) {
            var cost = {}
            cost.last_post_sync = dateFormat(new Date(), 'yyyy-mm-dd');
            db.query('UPDATE `td_channels` SET ? WHERE `td_channels`.`channel_id` = ?', [cost,channel_id],async function (err, results) {
                if (err) {
                    reject(0)
                }else{
                    console.log("Channel last sync update & channel id is "+channel_id)
                    resolve(0)
                }
            })
        })
    },
    get_twitter_post: async function (data) {
        var  that=this;
        return new Promise(function (resolve, reject) {
            Digital.get_twitter_post(todaysDate,data.user_id,async function(err , rows){
                if (err) {
                    console.log(err);
                    resolve(0)
                }
                else{
                    if(rows.length>0){
                        let channel = rows[0]
                        if(channel){
                            var sync = await that.sync_twitter(channel)
                            resolve(0)
                        }
                    }else{
                        resolve(0)
                    }
                }
            })
        })
    },
    sync_twitter: async function (data) {
        var  that=this;
        return new Promise(function(resolve, reject) {
            config.access_token = data.accessToken;
            config.access_token_secret = data.accessTokenSecret;
            var T = new Twit(config);
            T.get('statuses/user_timeline', {user_id: data.page_id,count:25,include_extended_entities: true,tweet_mode: 'extended'}, function(err, Data, response) {   
                if(err){
                    if(err.allErrors.length>0){
                        if(err.allErrors[0].code=215 && typeof(err.allErrors[0].message) !== 'undefined'){
                            db.query('UPDATE `td_channels` SET token_expire=? WHERE `td_channels`.`channel_id` = ?', ['The token used in the request has expired',data.channel_id],async function (err, results) {
                                if (err) {
                                    resolve(0);
                                }else{
                                    resolve(1)
                                }
                            })
                        }
                    }                    
                   that.update(data.channel_id)
                }else{
                    var Post = Data
                    if(Post.length == 0){
                        that.update(data.channel_id)
                    }else{
                        Post.forEach(element => {
                            var post = {}
                            post.likes = 0
                            post.shares = 0
                            post.message = element.full_text
                            post.post_id = element.id_str
                            post.channel_id = data.channel_id
                            post.brand_id = data.brand_id
                            post.channel_type = 'twitter'
                            post.publish_time = new Date(element.created_at)
                            post.likes = element.favorite_count
                            post.account_id = data.username
                            if(element.extended_entities){
                                var media = element.extended_entities['media']
                                var link = []
                                const main_picpure= full_picture= media[0].media_url;
                                for (let i = 0; i < media.length; i++) {
                                    link.push(media[i].media_url)                                
                                }
                                // media.forEach(element => {
                                //     link.push(element.media_url)
                                // });
                                post.full_picture =main_picpure
                                //JSON.stringify(link)
                            }
    
                            Digital.checkpost(element.id, async function (err, rows) {
                                if (err) {
                                    that.update(data.channel_id)
                                }
                                else {
                                    if(rows.length>0){
                                        Digital.updatepublishpost(post,element.id, async function (err, rows) {
                                            if (err) {
                                                that.update(data.channel_id)
                                            }
                                            else {
                                                
                                            }
                                        })
                                    }else{
                                        Digital.insertpublishpost(post, async function (err, rows) {
                                            if (err) {
                                                that.update(data.channel_id)
                                            }
                                            else {
                                                for (let i = 0; i < link.length; i++) {
                                                    db.query('INSERT INTO `td_publish_posts_attachments` SET post_id=?,image_src=?', [rows.insertId,link[i]],async function (err, results) {
                                                        if (err) {
                                                            console.log(err);
                                                        }else{
                                                           
                                                        }
                                                    })                              
                                                }
                                            }


                                        })
                                    }

                                }
                            })
                        });
                        that.update(data.channel_id)
                    }
                    db.query('UPDATE `td_channels` SET token_expire=? WHERE `td_channels`.`channel_id` = ?', ['',data.channel_id],async function (err, results) {
                        if (err) {
                            resolve(0);
                        }else{
                            resolve(1)
                        }
                    })
                }
            });
        })
    },
    get_fb_post: async function (data) {
        var  that=this
        return new Promise(function (resolve, reject) {
            Digital.get_fb_post(todaysDate,data.user_id,async function(err , rows){
                if (err) {
                    console.log(err);
                    resolve(0);
                }
                else{
                    if(rows.length>0){
                        let channel = rows[0]
                        if(channel){
                            var sync = await that.sync_fb(channel)
                            resolve(0);
                        }
                    }else{
                        resolve(0);
                    }
                }
            })
        });
    },
    sync_fb:async function (data) {
        var  that=this;
        this.FbTokenExpiryCheck(data);
        return new Promise(function(resolve, reject) {
            var options = {
                'method': 'GET',
                'url':  process.env.FBGRAPHAPIVERSION+'/me/posts?fields=full_picture,message,scheduled_publish_time,created_time,application,attachments,likes.summary(true),shares.summary(true)&period=days_28&limit=100&access_token=' + data.accessToken + '',
                'headers': {
                }
            };
            request(options, function (error, response) {
                if (error) {
                    that.update(data.channel_id)
                }else{
                    var data_post = JSON.parse(response.body)
                    if(data_post['error']){
                        that.update(data.channel_id)
                    }else{
                        var post = data_post['data']
                        if(post.length == 0){
                            that.update(data.channel_id)
                        }else{
                            post.forEach(element => {
                                var post = {}
                                post.likes = 0
                                post.shares = 0
                                post.message = element.message
                                post.post_id = element.id
                                post.channel_id = data.channel_id
                                post.brand_id = data.brand_id
                                post.channel_type = 'facebook'
                                post.publish_time = element.created_time
                                post.account_id = data.username
                                if(element.application){
                                    post.application = element.application.name
                                }
                                if(element.likes){
                                    post.likes = element.likes.summary.total_count
                                }
                                if(element.shares){
                                    post.shares = element.shares.count
                                }
                                if(element.shares){
                                    post.shares = element.shares
                                }
                                if(element.attachments){
                                    post.message = element.attachments['data'][0].description
                                    if(element.attachments['data'][0]['media']){
                                        if(element.attachments['data'][0]['media']['image']['src']){
                                            post.full_picture = element.attachments['data'][0]['media']['image']['src']
                                        }
                                    }
                                }
                                Digital.checkpost(element.id, async function (err, rows) {
                                    if (err) {
                                        that.update(data.channel_id)
                                    }
                                    else {
                                        if(rows.length>0){
                                            Digital.updatepublishpost(post,element.id, async function (err, rows) {
                                                if (err) {
                                                    that.update(data.channel_id)
                                                }
                                                else {
                                                }
                                            })
                                        }else{
                                            Digital.insertpublishpost(post, async function (err, rows) {
                                                if (err) {
                                                    that.update(data.channel_id)
                                                }
                                                else {
                                                }
                                            })
                                        }
                                    }
                                })
                            });
                            that.update(data.channel_id)
                        }
                    }
                }
            })
        })
    },
    get_insta_post: async function (data) {
        var  that=this
        return new Promise(function (resolve, reject) {
            Digital.get_insta_post(todaysDate,data.user_id,async function(err , rows){
                if (err) {
                    console.log(err);
                    resolve(0)
                }
                else{
                    if(rows.length>0){
                        let channel = rows[0]
                        if(channel){
                            var sync = await that.sync_insta(channel)
                            resolve(0)
                        }
                    }else{
                        resolve(0)
                    }
                }
            })
        })
    },
    sync_insta: async function (data) {
        var  that=this
        this.FbTokenExpiryCheck(data);
        return new Promise(function(resolve, reject) {
            var options = {
                'method': 'GET',
                'url': process.env.FBGRAPHAPIVERSION+data.page_id+'/media?fields=caption,id,media_type,media_url,owner,timestamp,thumbnail_url,like_count,comments_count,application,permalink&period=days_28&limit=100&access_token=' + data.accessToken + '',
                'headers': {
                }
            };
            request(options, function (error, response) {
                if (error) {
                    that.update(data.channel_id)
                }else{
                    var data_post = JSON.parse(response.body)
                    if(data_post['error']){
                        that.update(data.channel_id)
                    }else{
                        var Post = data_post['data']
                        if(Post.length == 0){
                            that.update(data.channel_id)
                        }else{
                            Post.forEach(element => {
                                var post = {}
                                post.likes = 0
                                post.shares = 0
                                post.message = element.caption
                                post.post_id = element.id
                                post.channel_id = data.channel_id
                                post.brand_id = data.brand_id
                                post.channel_type = 'instagram'
                                post.publish_time = element.timestamp
                                post.account_id = data.username
                                post.post_link = element.permalink
                                if(element.like_count){
                                    post.likes = element.like_count
                                }
                                if(element.media_url){
                                    post.full_picture = element.media_url
                                }
                                Digital.checkpost(element.id, async function (err, rows) {
                                    if (err) {
                                        that.update(data.channel_id)
                                    }
                                    else {
                                        if(rows.length>0){
                                            Digital.updatepublishpost(post,element.id, async function (err, rows) {
                                                if (err) {
                                                    that.update(data.channel_id)
                                                }
                                                else {
                                                }
                                            })
                                        }else{
                                            Digital.insertpublishpost(post, async function (err, rows) {
                                                if (err) {
                                                    that.update(data.channel_id)
                                                }
                                                else {
                                                }
                                            })
                                        }
                                    }
                                })
                            });
                            that.update(data.channel_id)
                        }
                    }
                }
            })
        })
    },
    LinkdinTokenExpiryCheck: async function (data) {
        return new Promise(function (resolve, reject) {
            var options = {
                'method': 'GET',
                'url': 'https://api.linkedin.com/v2/me?oauth2_access_token='+data.accessToken,
                'headers': {
                }
            };
            request(options, function (error, response) {
                if (error) {
                    console.log('error_linkdin',error)
                }else{
                    if(response.status=-401 && response.body.message){
                        db.query('UPDATE `td_channels` SET token_expire=? WHERE `td_channels`.`channel_id` = ?', [response.body.message,data.channel_id],async function (err, results) {
                            if (err) {
                                resolve(0)
                            }else{
                                resolve(1)
                            }
                        })
                    }
                    else{
                        db.query('UPDATE `td_channels` SET token_expire=? WHERE `td_channels`.`channel_id` = ?', ['',data.channel_id],async function (err, results) {
                            if (err) {
                                resolve(0);
                            }else{
                                resolve(1)
                            }
                        })
                    }
                }
            })
        })
    },
    FbTokenExpiryCheck: async function (data) {
        return new Promise(function (resolve, reject) {
            var options = {
                'method': 'GET',
                'url': process.env.FBGRAPHAPI+'/me?access_token='+data.accessToken,
                'headers': {
                }
            };
            request(options, function (error, response) {
                if (error) {
                    console.log('error_linkdin',error)
                    //that.update(data.channel_id)
                }else{
                    const result=JSON.parse(response.body)
                    console.log('facebook',JSON.parse(response.body))
                    if(result.error){
                        db.query('UPDATE `td_channels` SET token_expire=? WHERE `td_channels`.`channel_id` = ?', ['The token used in the request has expired',data.channel_id],async function (err, results) {
                            if (err) {
                                resolve(0);
                            }else{
                                resolve(1)
                            }
                        })
                    }else{
                        db.query('UPDATE `td_channels` SET token_expire=? WHERE `td_channels`.`channel_id` = ?', ['',data.channel_id],async function (err, results) {
                            if (err) {
                                resolve(0);
                            }else{
                                resolve(1)
                            }
                        })
                    }
                }
            })
        })
    }
    

}
module.exports = helperDigital;