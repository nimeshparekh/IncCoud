import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from "../environments/environment"
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class DigitalService {
    private savedPostLoad;
    private ultrasharepost;
    private savedCampaignLoad;
    private savedCampaignid;
    private savedpgid;
    private savedadid;
    apiUrl = environment.apiUrl;
    headers = new HttpHeaders().set('Content-Type', 'application/json');
    constructor(private http: HttpClient,
      public router: Router) { }

    get_folder(user_id) {
        return new Promise((resolve, reject) => {
          const headers = new Headers();
          this.http.get(`${this.apiUrl}/digital/get_folder`,{
            params: {
              user_id: user_id,
            }
          }).subscribe((data: any) => {
            resolve(data);
          }, error => {
            reject(error);
          });
        });
    }
    create_folder(params){    
        console.log('create_folder',params);
        return new Promise((resolve, reject) => {
          const headers = new Headers();
          this.http.post(`${this.apiUrl}/digital/create_folder/`,params).subscribe((data: any) => {
            resolve(data);
          }, error => {
            reject(error);
          });
        });
    }
    delete_folder(param) {
        return new Promise((resolve, reject) => {
          this.http.post(`${this.apiUrl}/digital/delete_folder`,param).subscribe((data: any) => {
            resolve(data);
          }, error => {
            reject(error);
          });
        });
    }
    get_brands(params) {
        return new Promise((resolve, reject) => {
          const headers = new Headers();
          this.http.post(`${this.apiUrl}/digital/get_brands`, params).subscribe((data: any) => {
            resolve(data);
          }, error => {
            reject(error);
          });
        });
    }
    get_brand(params) {
    return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/digital/get_brand`, params).subscribe((data: any) => {
        resolve(data);
        }, error => {
        reject(error);
        });
    });
    }
    
    brand_delete(params) {
    return new Promise((resolve, reject) => {
        const headers = new Headers();
        var data = { brand_id: params }
        this.http.post(`${this.apiUrl}/digital/delete_brand`, data).subscribe((data: any) => {
        resolve(data);
        }, error => {
        console.log('error ::' + JSON.stringify(error));
        reject(error);
        });
    });
    }
    
    brand_update(params) {
    return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/digital/brand_update`, params).subscribe((data: any) => {
        resolve(data);
        }, error => {
        reject(error);
        });
    });
    }
    brand_create(params) {
      return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/digital/brand_create`, params).subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      });
    }
    get_channels_all(params) {
      return new Promise((resolve, reject) => {
        this.http.post(`${this.apiUrl}/digital/getChannelsAll`, params).subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      });
    }
    get_channel_count(brand_id) {
      console.log('get_channel_count',brand_id);
      return new Promise((resolve, reject) => {
        this.http.get(`${this.apiUrl}/manager/digital/channel/get_channel_count`, {
          params: {
            brand_id: brand_id,
          }
        }).subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      });
    }
    get_member_count(brand_id) {
      console.log('get_channel_count',brand_id);
      return new Promise((resolve, reject) => {
        this.http.get(`${this.apiUrl}/manager/digital/channel/get_member_count`, {
          params: {
            brand_id: brand_id,
          }
        }).subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      });
    }
    get_total_posts(brand_id) {
      return new Promise((resolve, reject) => {
        this.http.get(`${this.apiUrl}/manager/digital/channel/get_total_posts`, {
          params: {
            brand_id: brand_id,
          }
        }).subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      });
    }
    get_total_schedule_posts(brand_id) {
      return new Promise((resolve, reject) => {
        this.http.get(`${this.apiUrl}/manager/digital/channel/get_total_schedule_posts`, {
          params: {
            brand_id: brand_id,
          }
        }).subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      });
    }
    get_all_channel_recent_posts(brand_id) {
      return new Promise((resolve, reject) => {
        this.http.get(`${this.apiUrl}/manager/digital/channel/get_all_channel_recent_posts`, {
          params: {
            brand_id: brand_id,
          }
        }).subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      });
    }
    page_dashbord_insights(params,i) {
      console.log('page_dashbord_insights',params);
      return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/manager/digital/channel/`+params.access_media+`_page_dashbord_insights`,params).subscribe((data: any) => {
          data.index = i;
          resolve(data);
        }, error => {
          reject(error);
        });
  
      });
    }
    social_fb(params){
      return new Promise((resolve, reject) => {
        return this.http.post(`${this.apiUrl}/digital/social_fb`,params).toPromise().then(response => {
          resolve(response);
        }).catch(() => reject());
      });
    }
    twitterlogin(): Observable<any> {
      return this.http.get(`${this.apiUrl}/digital/twitter`, {})
        .pipe(
         // catchError(this.handleError)
        );
    }
    linkedin_access(): Observable<any> {
      return this.http.get(`${this.apiUrl}/digital/linkedin`, {})
        .pipe(
          //catchError(this.handleError)
        );
    }
    twitter_callback(params) {
      return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/digital/twitter_callback`, params).subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      });
    }
    /**New User Login & Signin */
    async storeData(data) {
      localStorage.setItem('userData', JSON.stringify(data));
      return this.router.navigate(['home']);
    }
    
    linkedin_callback(params) {
      console.log('linkedin_callback',params);
      return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/digital/social_linkdin`, params).subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      });
    }
    social_list(brand_id)
    {
      var params = {brand_id: brand_id}
      return new Promise((resolve, reject) => {
        return this.http.post(`${this.apiUrl}/digital/social_list`,params).toPromise().then(response => {
          resolve(response);
        }).catch(() => reject());
      });
    }
    sync_fb_social(params){
      return new Promise((resolve, reject) => {
        return this.http.post(`${this.apiUrl}/digital/sync_fb_social`,params).toPromise().then(response => {
          resolve(response);
        }).catch(() => reject());
      });
    }
    linkedin_page_select(params) {
      return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/digital/linkedin_page_select`, params).subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      });
    }
    get_linkedin_post(params){
      return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/manager/digital/channel/get_linkedin_post`, params).subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      });
    }
    sync_twitter_social(params){
      console.log('sync_twitter_social',params);
      return new Promise((resolve, reject) => {
        return this.http.post(`${this.apiUrl}/digital/sync_twitter_social`,params).toPromise().then(response => {
          resolve(response);
        }).catch(() => reject());
      });
    }
    fb_access(params) {
      return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/digital/FbAccess`, params).subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      });
    }
    get_instagram_post(params){
      return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/manager/digital/channel/get_instagram_post`, params).subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      });
    }
    get_fb_post(params){
      return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/manager/digital/channel/get_fb_post`, params).subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      });
    }
    get_twitter_post(params){
      return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/manager/digital/channel/get_twitter_post`, params).subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      });
    }
    sync_instagram_social(params){
      return new Promise((resolve, reject) => {
        return this.http.post(`${this.apiUrl}/digital/sync_instagram_social`,params).toPromise().then(response => {
          resolve(response);
        }).catch(() => reject());
      });
    }
    sync_linkedin_social(params){
      return new Promise((resolve, reject) => {
        return this.http.post(`${this.apiUrl}/digital/sync_linkedin_social`,params).toPromise().then(response => {
          resolve(response);
        }).catch(() => reject());
      });
    }
    get_menu_access() {
      return new Promise((resolve, reject) => {
        this.http.get(`${this.apiUrl}/manager/digital/channel/get_menu_access`,{}).subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      });
    }
    get_saved_post_data(){
      let temp = this.savedPostLoad;
      this.clear_saved_post_data();
      return temp;
    }
    clear_saved_post_data(){
      this.savedPostLoad = undefined;
    }
    getschedulepost_file(brand_id)
    {
      var params = {brand_id: brand_id}
      console.log("getService");
      return new Promise((resolve, reject) => {
        return this.http.post(`${this.apiUrl}/schedulePosts/getschedulepost_file`,params).toPromise().then(response => {
          resolve(response);
        }).catch(() => reject());
      });
    }
    get_schedule_post_file(id){
      var params = {id: id}
      console.log("getService");
      return new Promise((resolve, reject) => {
        return this.http.post(`${this.apiUrl}/manager/digital/post/get_schedule_post_file`,params).toPromise().then(response => {
          resolve(response);
        }).catch(() => reject());
      });
    }
    
    file_upload(params){
      console.log("File Upload");
      return new Promise((resolve, reject) => {
        return this.http.post(`${this.apiUrl}/digital/uploadthumbnail`,params).toPromise().then(response => {
          resolve(response);
        }).catch(() => reject());
      });
    }
    get_folder_name(params){
      return new Promise((resolve, reject) => {
        return this.http.post(`${this.apiUrl}/digital/get_folder_name`,params).toPromise().then(response => {
          resolve(response);
        }).catch(() => reject());
      });
    }
    get_file(params){
      return new Promise((resolve, reject) => {
        return this.http.post(`${this.apiUrl}/digital/get_file`,params).toPromise().then(response => {
          resolve(response);
        }).catch(() => reject());
      });
    }
    youtube_category(channel_id)
    {
      var params = {channel_id: channel_id}
      console.log("getService");
      return new Promise((resolve, reject) => {
        return this.http.post(`${this.apiUrl}/google/youtube_category`,params).toPromise().then(response => {
          resolve(response);
        }).catch(() => reject());
      });
    }
    update_schedule_posts(params)
    {
      return new Promise((resolve, reject) => {
        return this.http.post(`${this.apiUrl}/manager/digital/post/update_schedule_posts`,params).toPromise().then(response => {
          resolve(response);
        }).catch(() => reject());
      });
    }
    save_schedule_post(params)
    {
      console.log("SaveService");
      return new Promise((resolve, reject) => {
        return this.http.post(`${this.apiUrl}/manager/digital/post/save_schedule_posts`,params).toPromise().then(response => {
          resolve(response);
        }).catch(() => reject());
      });
    }
    uploadmediafile(params){
      return new Promise((resolve, reject) => {
        //const headers = new Headers();
        this.http.post(`${this.apiUrl}/digital/upload_media_file`,params).subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      });
    }
    deleteMedia(payload){
      console.log(payload)
      var params = {media_arr: payload}
      return new Promise((resolve, reject) => {
        return this.http.post(`${this.apiUrl}/savepost/deleteMedia`,params).toPromise().then(response => {
          resolve(response);
        }).catch(() => reject());
      });
    }
    delete_file(params){    
      return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/digital/delete_file`, {
            bucket_id:params.bucket_id,
            user_id:params.access_customer_id,
            file_name:params.file_name,
            file_type:params.file_type
          }
        ).subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      });
    }
    getMediaById(id) { 
      return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.get(`${this.apiUrl}/digital/get_media_by_id/`,
        {params: {id:id}}).subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      });
    }
    createBulkSchedulePost(data) { 
      return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/digital/createbulkschedulepost/`,data).subscribe((data: any) => {
          resolve(data);
        }, error => {
          reject(error);
        });
      });
    }
    fb_paging(params){
      return new Promise((resolve, reject) => {
        const headers = new Headers();
        // var params = {page_id : params}
        this.http.post(`${this.apiUrl}/digital/paging`, params).subscribe((data: any) => {
            resolve(data);
        }, error => {
            console.log('error ::' + JSON.stringify(error));
            reject(error);
        });
     });
    }
    setSavedPostData(data){
      this.savedPostLoad = data;
    }
    delete_posttweet(channel_id,post_id) {
      return new Promise((resolve, reject) => {
          const headers = new Headers();
          var params = { channel_id:channel_id,post_id:post_id}
          this.http.post(`${this.apiUrl}/digital/delete_posttweet`, params).subscribe((data: any) => {
              resolve(data);
          }, error => {
              console.log('error ::' + JSON.stringify(error));
              reject(error);
          });
      });
    }
    delete_post(params) {
      return new Promise((resolve, reject) => {
          const headers = new Headers();
          this.http.post(`${this.apiUrl}/digital/delete_post`, params).subscribe((data: any) => {
              resolve(data);
          }, error => {
              console.log('error ::' + JSON.stringify(error));
              reject(error);
          });
      });
    }
    fb_get_post_insights(params,i?){
      return new Promise((resolve, reject) => {
        const headers = new Headers();
        // var params = {page_id : params}
        this.http.post(`${this.apiUrl}/digital/post_insight`, params).subscribe((data: any) => {
            if(i!=null){
              data.index = i
            }
            resolve(data);
        }, error => {
            console.log('error ::' + JSON.stringify(error));
            reject(error);
        });
    });
    }
    get_media(channel_id,i?) {
      var params = {channel_id: channel_id};
      return new Promise((resolve, reject) => {
          const headers = new Headers();
          this.http.post(`${this.apiUrl}/digital/get_media`, params).subscribe((data: any) => {
            if(i!=null){
              data.index=i;
            }
              resolve(data);
          }, error => {
              console.log('error ::' + JSON.stringify(error));
              reject(error);
          });
      });
    }
  linked_in_get_me(c_id)
  {
    var params = {customer_id: c_id}
    console.log("Params: "+params);
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/get_me`, params).subscribe((data: any) => {
          resolve(data);
      }, error => {
          console.log('error ::' + JSON.stringify(error));
          reject(error);
      });
    });
  }
  get_published_post(params,i?){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {page_id : params}
      this.http.post(`${this.apiUrl}/manager/digital/post/get_fb_published_post`, params).subscribe((data: any) => {
          if(i!=null){
            data.index = i
          }
          resolve(data);
      }, error => {
          console.log('error ::' + JSON.stringify(error));
          reject(error);
      });
    });
  }
  pst_mngmt_user_timeline(channel_id,i?){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = {channel_id: channel_id}
      this.http.post(environment.apiUrl+'/digital/pst_mngmt/user_timeline', params).subscribe((data:any) => {
        if(i!=null){
          data.index = i
        }
        resolve(data);
      }, error =>
      {
        reject(error);
      });
    });
  }
  linked_in_get_feed(channel_id,i?)
  {
    var params = {channel_id: channel_id}
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/get_feed`, params).subscribe((data: any) => {
        if(i!=null){
          data.index = i
        }
          resolve(data);
      }, error => {
          console.log('error ::' + JSON.stringify(error));
          reject(error);
      });
    })
  }
  YT_video_list(channel_id,i?)
  {
    var params = {channel_id: channel_id}
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/youtube_upload_list`, params).subscribe((data: any) => {
        if(i!=null){
          data.index = i
        }
          resolve(data);
      }, error => {
          console.log('error ::' + JSON.stringify(error));
          reject(error);
      });
    });
  }
  get_comments(channel_id,media_id) {
    var params = {channel_id: channel_id,media_id: media_id};
    return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/digital/get_comments`, params).subscribe((data: any) => {
            resolve(data);
        }, error => {
            console.log('error ::' + JSON.stringify(error));
            reject(error);
        });
    });
  }
  post_comment(channel_id,media_id,message) {
    var params = {channel_id: channel_id,media_id: media_id,message: message};
    return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/digital/post_comment`, params).subscribe((data: any) => {
            resolve(data);
        }, error => {
            console.log('error ::' + JSON.stringify(error));
            reject(error);
        });
    });
  }
  post_comment_reply(channel_id,comment_id,message) {
    var params = {channel_id: channel_id,comment_id: comment_id,message: message};
    return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/digital/post_comment_reply`, params).subscribe((data: any) => {
            resolve(data);
        }, error => {
            console.log('error ::' + JSON.stringify(error));
            reject(error);
        });
    });
  }
  fb_like(params) {
    return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/digital/page/publish_like`, params).subscribe((data: any) => {
            resolve(data);
        }, error => {
            console.log('error ::' + JSON.stringify(error));
            reject(error);
        });
    });
  }
  fb_unlike(params) {
    return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/digital/delete_like`, params).subscribe((data: any) => {
            resolve(data);
        }, error => {
            console.log('error ::' + JSON.stringify(error));
            reject(error);
        });
    });
  }
  fb_comment_post(params) {
    return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/digital/comment_publish`, params).subscribe((data: any) => {
            resolve(data);
        }, error => {
            console.log('error ::' + JSON.stringify(error));
            reject(error);
        });
    });
  }
  linked_in_get_socialActions(channel_id,activity_id,i?)
  {
    var params = {channel_id: channel_id, activity_id: activity_id}
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/get_social_actions`, params).subscribe((data: any) => {
        if(i!=null){
          data.index = i
        }
          resolve(data);
      }, error => {
          console.log('error ::' + JSON.stringify(error));
          reject(error);
      });
    });
  }
  linked_in_get_socialActions_comments(channel_id,activity_id,i?)
  {
    var params = {channel_id: channel_id, activity_id: activity_id}
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/get_social_actions_comments`, params).subscribe((data: any) => {
        if(i!=null){
          data.index = i
        }
          resolve(data);
      }, error => {
          console.log('error ::' + JSON.stringify(error));
          reject(error);
      });
    });
  }
  linked_in_get_shareId(channel_id,activity_id,i?)
  {
    var params = {channel_id: channel_id, activity_id: activity_id}
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/get_shareId`, params).subscribe((data: any) => {
        if(i!=null){
          data.index = i
        }
          resolve(data);
      }, error => {
          console.log('error ::' + error);
          resolve(error);
      });
    });
  }
  linked_in_get_share_insights(channel_id,share_id,i?)
  {
    var params = {channel_id: channel_id, share_id: share_id}
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/get_share_insights`, params).subscribe((data: any) => {
        if(i!=null){
          data.index = i
        }
          resolve(data);
      }, error => {
          console.log('error ::' + error);
          resolve(error);
      });
    });
  }
  get_media_insights(channel_id,media_id,i?) {
    var params = {channel_id: channel_id,media_id:media_id};
    return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/digital/get_media_insights`, params).subscribe((data: any) => {
          if(i!=null){
            data.index=i;
          }
            resolve(data);
        }, error => {
            console.log('error ::' + JSON.stringify(error));
            reject(error);
        });
    });
  }
  youtube_video_details(channel_id,video_id) {
    var params = {channel_id: channel_id,video_id: video_id};
    return new Promise((resolve, reject) => {
        const headers = new Headers();
        this.http.post(`${this.apiUrl}/digital/youtube_video_details`, params).subscribe((data: any) => {
            resolve(data);
        }, error => {
            console.log('error ::' + JSON.stringify(error));
            reject(error);
        });
    });
  }
  linked_in_post_socialActions_comments(channel_id,activity_id,body)
  {
    var params = {channel_id: channel_id, activity_id: activity_id,body: body}
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/post_social_actions_comments`, params).subscribe((data: any) => {
          resolve(data);
      }, error => {
          console.log('error ::' + JSON.stringify(error));
          reject(error);
      });
    });
  }
  linked_in_post_socialActions_likes(channel_id,activity_id,body)
  {
    var params = {channel_id: channel_id, activity_id: activity_id,body: body}
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/post_social_actions_likes`, params).subscribe((data: any) => {
          resolve(data);
      }, error => {
          console.log('error ::' + JSON.stringify(error));
          reject(error);
      });
    });
  }
  setHypersharePostData(data){
    this.ultrasharepost = data;
  }
  like_tweet(channel_id,tweet_id){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = {channel_id: channel_id, tweet_id: tweet_id};
      this.http.post(environment.apiUrl+'/digital/like_tweet', params).subscribe((data:any) => {
        resolve(data);
      }, error =>
      {
        reject(error);
      });
    });
  }
  unlike_tweet(channel_id,tweet_id){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = {channel_id: channel_id, tweet_id: tweet_id};
      this.http.post(environment.apiUrl+'/digital/unlike_tweet', params).subscribe((data:any) => {
        resolve(data);
      }, error =>
      {
        reject(error);
      });
    });
  }
  post_tweet_reply(channel_id,tweet_id,message){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      var params = {channel_id: channel_id, tweet_id: tweet_id,message: message};
      this.http.post(environment.apiUrl+'/digital/post_tweet_reply', params).subscribe((data:any) => {
        resolve(data);
      }, error =>
      {
        reject(error);
      });
    });
  }
  getImage(imageUrl: string,mimeType) {
    // console.log("Image Service Invoked");
    // console.log("URL: "+this.apiUrl+'/'+ imageUrl);
    return this.http.get(imageUrl, { responseType: 'blob' })
    //return this.http.get(`${this.apiUrl}`+'/'+ imageUrl, { responseType: 'blob' })
    .pipe(
      map((res: any) => {
        // console.log(res);
        return new Blob([res], { type: mimeType })
      })); 
  }
  getSchedulePost(brand_id){
    var params = {brand_id: brand_id}
    return new Promise((resolve, reject) => {
      return this.http.post(`${this.apiUrl}/digital/get_schedule_posts`,params).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }
  delete_schedule_post(id){
    return new Promise((resolve, reject) => {
      return this.http.get(`${this.apiUrl}/manager/digital/post/delete_schedule_post/`,{
        params: {
          id: id,
        }
      }).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }
  delete_channels(params) {
    console.log('delete_channels',params);
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/delete_channels`, params).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getChatMembers(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/chatmemberlist`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  chatmemberlist_insta(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/chatmemberlist_insta`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  assign_chat(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/assign_chat`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getMemberChatList(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/memberchatlist`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  sendchatmessage(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/sendchatmessage`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  update_message_user(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/update_message_user`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  get_system_user_assign_lead() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(environment.apiUrl + '/erp/get_system_user_assign_lead', {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getRole(id) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/signin/getrole/`).subscribe((data: any) => {
        //console.log(data['data'][0]);
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getChatUser(params){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/getChatUser`, params).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getChatUserArchive(params){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/getChatUserArchive`, params).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getChatUserNew(params){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/getChatUserNew`, params).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getCahtUserLive(params){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/getCahtUserLive`, params).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getChatdetails(data){
    console.log('getChatdetails',data);
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/getChatdetails`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  gethuntgroup(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/digital/gethuntgroup/` + data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  assign_group_channel(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/assign_group_channel`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  add_lead(data) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/add_lead`, data).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  saved_leads_campaign(brand_id)
  {
    var params = {brand_id: brand_id}
    console.log("getService");
    return new Promise((resolve, reject) => {
      return this.http.post(`${this.apiUrl}/digital/saved_leads_campaign`,params).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }
  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
  googleadsaccesslink(): Observable<any> {
    return this.http.get(`${this.apiUrl}/googleadslink`, {})
      .pipe(
        catchError(this.handleError)
      );
  }
  saved_leads_campaign_google(brand_id)
  {
    var params = {brand_id: brand_id}
    console.log("getService");
    return new Promise((resolve, reject) => {
      return this.http.post(`${this.apiUrl}/digital/saved_leads_campaign_google`,params).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }
  setSavedCampaignData(data){
    this.savedCampaignLoad = data;
  }
  setSavedCampaignid(data){
    this.savedCampaignid = data;
  }
  change_campaign_status(params){
    return new Promise((resolve, reject) => {
      return this.http.post(`${this.apiUrl}/digital/change_campaign_status`,params).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }
  sync_facebook_leads(params){
    return new Promise((resolve, reject) => {
      return this.http.post(`${this.apiUrl}/digital/sync_facebook_leads`,params).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }
  get_webhook_key(){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      //var params = { channel_id: channel_id}
      this.http.post(`${this.apiUrl}/digital/google_create_key`, {}).subscribe((data: any) => {
          resolve(data);
      }, error => {
          reject(error);
      });
    });
  }
  saved_campaign(brand_id)
  {
    var params = {brand_id: brand_id}
    console.log("getService");
    return new Promise((resolve, reject) => {
      return this.http.post(`${this.apiUrl}/digital/saved_campaign`,params).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }
  getSavedCampiagnid(){
    let temp = this.savedCampaignid;
    this.clearSavedCampaignid();
    return temp;
  }
  clearSavedCampaignid(){
    this.savedCampaignid = undefined;
  }
  sync_insights(params)
  {
    return new Promise((resolve, reject) => {
      return this.http.post(`${this.apiUrl}/digital/sync_campaign`,params).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }
  getUserBalance() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/getuserbalance`,{}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getAutomationSegments(data){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/automation_segments`, data).subscribe((data:any) => {
        resolve(data);
      }, error =>
      {
        reject(error);
      });
    });
  }
  getAutomationVoice(data){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/facebook/automation_voiceCamp`, data).subscribe((data:any) => {
        resolve(data);
      }, error =>
      {
        reject(error);
      });
    });
  }
  getAutomationSMS(data){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/facebook/automation_smsCamp`, data).subscribe((data:any) => {
        resolve(data);
      }, error =>
      {
        reject(error);
      });
    });
  }
  getAutomationMail(data){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/facebook/automation_mailCamp`, data).subscribe((data:any) => {
        resolve(data);
      }, error =>
      {
        reject(error);
      });
    });
  }
  get_audience()
  {
    return new Promise((resolve, reject) => {
      return this.http.post(`${this.apiUrl}/audience/get_audience`,{}).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }
  getAutomationagentgroup(data){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/automation_agentgroup`, data).subscribe((data:any) => {
        resolve(data);
      }, error =>
      {
        reject(error);
      });
    });
  }
  ad_pages() {
    return new Promise((resolve, reject) => {
        const headers = new Headers();
        var params = { brand_id: localStorage.getItem('current_brand_id') }
        console.log("Ad Pages");
        this.http.post(`${this.apiUrl}/facebook/page/ad_pages`, params).subscribe((data: any) => {
            resolve(data);
        }, error => {
            console.log('error ::' + JSON.stringify(error));
            reject(error);
        });
    });
  }
  language_list() {
    return new Promise((resolve, reject) => {
        const headers = new Headers();

        var params = { customerid: localStorage.getItem('access_id') }
        this.http.post(`${this.apiUrl}/facebook/language`, params).subscribe((data: any) => {
            resolve(data);
        }, error => {
            console.log('error ::' + JSON.stringify(error));
            reject(error);
        });
    });
  }
  audience_saved() {
    return new Promise((resolve, reject) => {
        const headers = new Headers();

        var params = { customerid: localStorage.getItem('access_id') }
        this.http.post(`${this.apiUrl}/facebook/audience_saved`, params).subscribe((data: any) => {
            resolve(data);
        }, error => {
            console.log('error ::' + JSON.stringify(error));
            reject(error);
        });
    });
  }
  ads_pixel_list() {
    return new Promise((resolve, reject) => {
        const headers = new Headers();

        var params = { customerid: localStorage.getItem('access_id') }
        this.http.post(`${this.apiUrl}/facebook/ads_pixel_list`, params).subscribe((data: any) => {
            resolve(data);
        }, error => {
            console.log('error ::' + JSON.stringify(error));
            reject(error);
        });
    });
  }
  createLeadsAd(params){
    return new Promise((resolve, reject) => {
      return this.http.post(`${this.apiUrl}/facebook/lead_ad_create`,params).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }
  getSavedCampiagnData(){
    let temp = this.savedCampaignLoad;
    this.clearSavedCampaignData();
    return temp;
  }
  clearSavedCampaignData(){
    this.savedCampaignLoad = undefined;
  }
  ad_set_data(params){
    return new Promise((resolve, reject) => {
      this.http.post(`${this.apiUrl}/facebook/ad_set_data`, params).subscribe((data: any) => {
        resolve(data);
    }, error => {
        console.log('error ::' + JSON.stringify(error));
        reject(error);
    });
      // return this.http.post(`${this.apiUrl}/facebook/ad_set_data`,params).toPromise().then(response => {
      //   resolve(response);
      // }).catch(() => reject());
    });
  }
  ad_set_create(params){
    return new Promise((resolve, reject) => {
      return this.http.post(`${this.apiUrl}/facebook/ad_set_create`,params).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }
  getMenuAccess() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/tfapi/getdigitalmenuaccess`,{}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getmedia(){
    var params = {}
    return new Promise((resolve, reject) => {
      return this.http.post(`${this.apiUrl}/savepost/getmedia`,params).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }
  get_adaccount(data){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/get_adaccount`, data).subscribe((data:any) => {
        resolve(data);
      }, error =>
      {
        reject(error);
      });
    });
  }
  ad_pages_list() {
    return new Promise((resolve, reject) => {
        const headers = new Headers();
        var params = { brand_id: localStorage.getItem('current_brand_id') }
        console.log("Ad Pages");
        this.http.post(`${this.apiUrl}/digital/ad_pages_list`, params).subscribe((data: any) => {
            resolve(data);
        }, error => {
            console.log('error ::' + JSON.stringify(error));
            reject(error);
        });
    });
  }
  sync_all_campaign(params){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/fb_sync_campaign`, params).subscribe((data: any) => {
        console.log(data)
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  setSavedpgid(data){
    this.savedpgid = data;
  }
  saved_ads_id(params)
  {
    return new Promise((resolve, reject) => {
      return this.http.post(`${this.apiUrl}/digital/saved_ads`,params).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }
  change_ads_status(params){
    return new Promise((resolve, reject) => {
      return this.http.post(`${this.apiUrl}/facebook/change_ads_status`,params).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }
  setSavedadid(data){
    this.savedadid = data;
  }
  createLeadsAd_manual(params){
    return new Promise((resolve, reject) => {
      return this.http.post(`${this.apiUrl}/digital/lead_ad_create_manual`,params).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }
  lead_ad_create_automation(params){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/lead_ad_create_automation`, params).subscribe((data: any) => {
        console.log(data)
        resolve(data);
      }, error => {
        reject(error);
      });
    });

  }
  saveSchedulePost(params)
  {
    console.log("SaveService");
    return new Promise((resolve, reject) => {
      return this.http.post(`${this.apiUrl}/digital/saveSchedulePosts`,params).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }
  update_SchedulePosts(params)
  {
    return new Promise((resolve, reject) => {
      return this.http.post(`${this.apiUrl}/digital/update_SchedulePosts`,params).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }
  getSchedulePostfile(id){
    var params = {s_id: id}
    console.log("getService");
    return new Promise((resolve, reject) => {
      return this.http.post(`${this.apiUrl}/digital/getSchedulePostfile`,params).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }
  delSchedulePost(_id)
  {
    var params = {_id: _id}
    console.log("getService");
    return new Promise((resolve, reject) => {
      return this.http.post(`${this.apiUrl}/digital/deleteSchedulePosts`,params).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }
  deleteschedulepost(id){
    console.log("getService");
    return new Promise((resolve, reject) => {
      return this.http.get(`${this.apiUrl}/digital/deleteschedulepost/`+id).toPromise().then(response => {
        resolve(response);
      }).catch(() => reject());
    });
  }
  fb_get_posts_db(params,i?){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      // var params = {page_id : params}
      this.http.post(`${this.apiUrl}/digital/getpagefeed`, params).subscribe((data: any) => {
          if(i!=null){
            data.index = i
          }
          resolve(data);
      }, error => {
          console.log('error ::' + JSON.stringify(error));
          reject(error);
      });
    });
  }
  twittercallback(params) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/social_twitter`, params).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  TwAccessToken() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/TwAccessToken`, {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  twittercallbackcutomer(params) {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/twitter_callback_customer`, params).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  getLinkdinAndTwiterPost(){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.get(`${this.apiUrl}/digital/getLinkdinAndTwiterPost`, {}).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  movetoarchive(id){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/movetoarchive`, {
        params: {
          id: id,
        }
      }).subscribe((data: any) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
  delete_fb_req(data){
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      this.http.post(`${this.apiUrl}/digital/delete_fb_data`, data).subscribe((data:any) => {
        resolve(data);
      }, error =>
      {
        reject(error);
      });
    });
  }
  
}