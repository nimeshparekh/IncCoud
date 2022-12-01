import { Component, OnInit, Inject, ViewChild, AfterViewInit} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { DigitalService } from '../../digital.service';
import { MatStepper } from '@angular/material/stepper';
import { Observable } from 'rxjs';
export interface DialogData {
  brandcheck: Boolean;
  channelcheck: Boolean;
  close_button: Boolean;
}
@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.css']
})

export class AddChannelComponent implements OnInit {
  
 
    constructor(
      public digitalService: DigitalService,
      public dialogRef: MatDialogRef<AddChannelComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
    
      private formBuilder: FormBuilder,
      private _snackBar: MatSnackBar,public dialog: MatDialog,
    ) {}

      welcomeform: FormGroup;
      close_button = false;
      back_button = true;
      spin = false;
      fbactive = true;
      fbactivetick = false;
      linkdinactive = true;
      linkdinactivetick = false;
      instadinactive = true;
      instactivetick = false;
      activepage = false;
      activepageinsta = false;
      activegooglemanager = false
      pagelist;
      instapagelist;
      instapage = [];
      page_id;
      page_name;
      page_token;
      page_profile;
      page_insta_id;
      page_insta_name;
      media_type;
      obj = [];
      fb_obj;
      ins_obj;
      mgb;
      fb_submitted;
      ins_submitted;
      gms_submitted;
      channelscreate = false
      PageOption = "Select Your Facebook Page";
      brandform: FormGroup;
      fbtokenerror = ''
      twaccess = false
      twaccessdata = []
      google_m;
      twtokenerror = '';
      msg = '';
      cmsg = '';
      @ViewChild('stepper', { static: true }) stepper: MatStepper;
      ngOnInit() {
        this.fbLibrary()
        //this.fbaccesstoken()
        this.twaccesstoken()
        console.log('data',this.data);
        this.welcomeform = this.formBuilder.group({
          mobile: ['', [Validators.required, Validators.maxLength, Validators.minLength, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
          name: ['', Validators.required],
          email: ['', Validators.required],
        });
        this.brandform = this.formBuilder.group({
          brand_name: ['', Validators.required],
    
        });
    
        if (!this.data.brandcheck) {
          //this.stepper.selectedIndex = 2;
        }
        if (this.data.channelcheck == true) {
          //this.stepper.selectedIndex = 3;
          this.back_button = false
          this.close_button = true;
          //this.checkchannelimit();
        }
        if (this.data.close_button) {
          this.close_button = true;
        }
       // this.checkbrandlimit();
      }
      /*
      checkbrandlimit() {
        this.digitalService.userExists().then(
          data => {
            var brandlength = data['brand_val'].length;
            this.digitalService.getUserBalance().then(
              data => {
                //console.log(data['balance'].brand_no);
                var brandlimit = ((data['balance']).brand_no);
                if (brandlimit == 0) {
                  this.msg = "You do not add more brand!";
    
                } else if (brandlength < brandlimit) {
                  this.msg = "";
                } else {
                  this.msg = "You add only " + brandlimit + " brand !";
                }
              },
              err => {
                console.log(err);
              }
            );
          },
          err => {
            console.log(err);
          }
        );
      }
      
      checkchannelimit() {
        this.digitalService.getchannelsCount().then(
          data1 => {
            var channelength = (data1['data'].length);
            this.digitalService.getUserBalance().then(
              data => {
                //console.log(data['balance'].brand_no);
                var channelimit = ((data['balance']).channel_no);
                if (channelimit == 0) {
                  this.cmsg = "You do not add more channel!";
    
                } else if (channelength < channelimit) {
                  this.cmsg = "";
                } else {
                  this.cmsg = "You add only " + channelimit + " channel !";
                }
              },
              err => {
                console.log(err);
              }
            );
           
          },
          err=> {}
        )
        /*this.digitalService.userExists().then(
          data => {
            var brandlength = data['brand_val'].length;
            this.digitalService.getUserBalance().then(
              data => {
                //console.log(data['balance'].brand_no);
                var brandlimit = ((data['balance']).brand_no);
                if (brandlimit == 0) {
                  this.msg = "You do not add more brand!";
    
                } else if (brandlength < brandlimit) {
                  this.msg = "";
                } else {
                  this.msg = "You add only " + brandlimit + " brand !";
                }
              },
              err => {
                console.log(err);
              }
            );
          },
          err => {
            console.log(err);
          }
        );*/
        /*
      }
      fbaccesstoken() {
        var cmid = localStorage.getItem('current_brand_id');
        this.digitalService.FbAccessToken()
          .then(
            (data) => {
              //console.log(data);
              if (data['data']['token']) {
                this.fbactivetick = true;
                this.fbactive = false;
                this.activepage = true;
                this.spin = false
                this.pagelist = data['data']['accounts']['data'];
                var obj = {
                  'usertoken': data['token'],
                  'expiry_date': '',
                  'userID': '',
                  'first_name': data['data'].first_name,
                  'last_name': data['data'].last_name,
                  'email': data['data'].email,
                  'brand_id': cmid,
                };
                this.obj.push(obj)
              } else {
                this.fbtokenerror = data['msg']
              }
            }
          );
      }
     */
      twaccesstoken() {
        var cmid = localStorage.getItem('current_brand_id');
        this.digitalService.TwAccessToken()
          .then(
            (data) => {
              console.log(data['data']['accessToken']);
              if (data['data']['accessToken']) {
                this.twaccess = true;
                this.twaccessdata = data['data']
              } else {
    
              }
              console.log(this.twaccess)
            }
          );
      }
    
      addtwitterchannel() {
        var brand_id = localStorage.getItem('current_brand_id');
        const newObj = { userid: this.twaccessdata['customer_id'], tokenSecret: this.twaccessdata['accessToken'], brand_id: brand_id, oauth_token: this.twaccessdata['oauth_token'], oauth_verifier: this.twaccessdata['oauth_verifier'] }
        this.digitalService.twittercallbackcutomer(newObj).then(
          data => {
            console.log(data);
            this.twtokenerror = data['msg']
          },
          err => {
            console.log(err);
          }
        );
      }
    
      linkedinlogin() {
        this.digitalService.linkedin_access()
          .subscribe(
            (data) => {
              console.log("linkedin login ::");
              console.log(JSON.stringify(data));
              //window.open(data['url'],'_blank')
              this.OpenPopupCenter(data['url'], 'Linkedin Login', 800, 600)
            }
          );
      }
     /*
      goooglelogin(){
        this.digitalService.gmb()
          .subscribe(
            (data) => {
              //console.log(data);
              if (data['url']) {
                //localStorage.setItem('tokenSecret', data['tokenSecret']);
                //window.open(data['url'],'_blank')
                this.OpenPopupCenter(data['url'], 'gmb Login', 800, 600)
              }
            }
          );
      //   const options = {
      //     scope: 'https://www.googleapis.com/auth/plus.business.manage', 
      //     width: 250,
      //     height: 50,
      //     longtitle: true,
      //     theme: 'dark',
      //     onsuccess: (googleUser => {
      //       console.log("welcome");
            
      //       console.log(googleUser);
            
      //       let profile = googleUser.getBasicProfile();
      //       console.log('Token || ' + googleUser.getAuthResponse().access_token);
      //       this.mgb ={'access_token':googleUser.getAuthResponse().access_token,thumbnails:profile.getImageUrl()}
      //       console.log('ID: ' + profile.getId());
      //       console.log('Name: ' + profile.getName());
      //       console.log('Image URL: ' + profile.getImageUrl());
      //       console.log('Email: ' + profile.getEmail());
      //       let newObj = {'id':profile.getId(),'token':googleUser.getAuthResponse().access_token}        
      //       this.digitalService.load_account(newObj).then(
      //         data => {
      //           console.log(data['data']);
      //           if(data['data'].length > 0){
      //             this.activegooglemanager = true
      //             this.google_m = data['data']
      //           }
      //         },
      //         err => {
      //           console.log(err);
      //         }
      //       );
       
      //  // your-code-goes-here
           
      //     }),
      //     onfailure: ((error) => {
      //       console.log('failure', error);
      //     })
      //   };
      //   gapi.signin2.render('googleBtn', options);
      }
    
    */

      OpenPopupCenter(pageURL, title, w, h) {
        var left = (screen.width - w) / 2;
        var top = (screen.height - h) / 4;  // for 25% - devide by 4  |  for 33% - devide by 3
        var targetWin = window.open(pageURL, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
        if(targetWin.close){
          this.dialogRef.close();
        }
      }
      

      twitterlogin() {
        this.digitalService.twitterlogin()
          .subscribe(
            (data) => {
              console.log(data);
              if (data['url']) {
                localStorage.setItem('tokenSecret', data['tokenSecret']);
                //window.open(data['url'],'_blank')
                this.OpenPopupCenter(data['url'], 'Twitter Login', 800, 600)
              }
            }
          );
      }
     
      fbLibrary() {
        (window as any).fbAsyncInit = function () {
          window['FB'].init({
            appId: environment.fb_appId,
            // appId:'194054191696270',
            cookie: true,
            xfbml: true,
            version: 'v8.0'
          });
          window['FB'].AppEvents.logPageView();
        };
    
        (function (d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) { return; }
          js = d.createElement(s); js.id = id;
          js.src = "https://connect.facebook.net/en_US/sdk.js";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    
      }

      fblogin() {
        // this.spin = true
        console.log('login response');
        var cmid = localStorage.getItem('current_brand_id');
        var access_id =localStorage.getItem('access_id');
        window['FB'].login((response) => {
          console.log('login');
          console.log('login response', response);
          if (response.authResponse) {
            console.log('response.authResponse :' + JSON.stringify(response.authResponse));
            var accessToken = response.authResponse.accessToken;
            var expiry_date = response.authResponse.data_access_expiration_time;
            var userID = response.authResponse.userID;
            this.fbactivetick = true;
            this.fbactive = false;
            window['FB'].api('/me', {
              fields: 'last_name,first_name,email,accounts.limit(500){best_page,name,access_token,picture{url}}',//access_token
            }, async(userInfo) => {
              console.log(userInfo);
              console.log("user information");
              //console.log('account',userInfo['accounts']);
              try{
                this.pagelist = userInfo['accounts']['data'];
              } catch(err){
                this._snackBar.open('page not found in your account!', 'Close', {
                  duration: 5000,
                });
              }
              this.spin = false
              var obj = {
                'usertoken': accessToken,
                'expiry_date': expiry_date,
                'userID': userID,
                'first_name': userInfo.first_name,
                'last_name': userInfo.last_name,
                'email': userInfo.email,
                 'brand_id': cmid,
                'media_type': 'facebook',
                'user_id' :access_id,
              };
              console.log('obj',obj);
              var data = await this.fb_submit(obj)
              this.dialogRef.close();
              
            });
    
          } else {
            this.spin = false
            console.log('User login failed');
          }
        },
          //  {scope: 'email , user_hometown , user_posts , user_age_range , user_likes , user_status , user_birthday , user_link , user_tagged_places , user_friends , user_location , user_videos , user_gender , user_photos , ads_management , pages_manage_cta , publish_pages , ads_read , pages_manage_instant_articles , publish_to_groups , attribution_read , pages_messaging , read_page_mailboxes , business_management , pages_messaging_phone_number , user_events , groups_access_member_info , pages_messaging_subscriptions , manage_pages , pages_show_list , catalog_management , instagram_manage_insights , read_insights , instagram_basic , leads_retrieval , whatsapp_business_management , instagram_manage_comments , publish_video'});
          { scope: 'email , ads_management , pages_manage_cta , ads_read , pages_manage_instant_articles , publish_to_groups , attribution_read , pages_messaging , read_page_mailboxes , business_management , pages_messaging_phone_number , groups_access_member_info , pages_messaging_subscriptions , pages_show_list , catalog_management , instagram_manage_insights , read_insights , instagram_basic , leads_retrieval , whatsapp_business_management , instagram_manage_comments , publish_video, pages_read_engagement,  pages_read_user_content, pages_manage_posts, instagram_content_publish, public_profile, pages_manage_engagement,pages_manage_metadata' });
      }
    
      instagramlogin() {
        this.spin = true
        console.log('login response');
        var cmid = localStorage.getItem('current_brand_id');
        var access_id =localStorage.getItem('access_id');
        window['FB'].login((response) => {
          console.log('login response', response);
          if (response.authResponse) {
            console.log('response.authResponse :' + JSON.stringify(response.authResponse));
            var accessToken = response.authResponse.accessToken;
            var expiry_date = response.authResponse.data_access_expiration_time;
            var userID = response.authResponse.userID;
            this.instactivetick = true;
            this.instadinactive = false;
            
            window['FB'].api('/me', {
              fields: 'last_name, first_name, email , accounts{instagram_business_account{name},name,access_token,picture{url}}'
            }, async(userInfo) => {
              try{
                this.instapagelist = userInfo['accounts']['data'];
              } catch(err){
                this._snackBar.open('page not found in your account!', 'Close', {
                  duration: 5000,
                });
              }
              
              this.instapagelist.map((element, i) => {
                if (element.instagram_business_account) {
                  this.instapage.push(element)
                  this.spin = false
                }
              })
            
              this.spin = false
              var obj = {
                'usertoken': accessToken,
                'expiry_date': expiry_date,
                'userID': userID,
                'first_name': userInfo.first_name,
                'last_name': userInfo.last_name,
                'email': userInfo.email,
                'brand_id': cmid,
                'media_type': 'instagram',
                'user_id' :access_id
              };
              var data = await this.fb_submit(obj)
              this.dialogRef.close();
    
            });
    
          } else {
            this.spin = false
            console.log('User login failed');
          }
        },
          //  {scope: 'email , user_hometown , user_posts , user_age_range , user_likes , user_status , user_birthday , user_link , user_tagged_places , user_friends , user_location , user_videos , user_gender , user_photos , ads_management , pages_manage_cta , publish_pages , ads_read , pages_manage_instant_articles , publish_to_groups , attribution_read , pages_messaging , read_page_mailboxes , business_management , pages_messaging_phone_number , user_events , groups_access_member_info , pages_messaging_subscriptions , manage_pages , pages_show_list , catalog_management , instagram_manage_insights , read_insights , instagram_basic , leads_retrieval , whatsapp_business_management , instagram_manage_comments , publish_video'});
          { scope: 'email , ads_management , pages_manage_cta , ads_read , pages_manage_instant_articles , publish_to_groups , attribution_read , pages_messaging , read_page_mailboxes , business_management , pages_messaging_phone_number , groups_access_member_info , pages_messaging_subscriptions , pages_show_list , catalog_management , instagram_manage_insights , read_insights , instagram_basic , leads_retrieval , whatsapp_business_management , instagram_manage_comments , publish_video, pages_read_engagement,  pages_read_user_content, pages_manage_posts, instagram_content_publish, public_profile' });
    
      }
      get f() {
        return this.welcomeform.controls;
      }
    /*
      youtubelogin() {
        this.digitalService.youtubelogin()
          .subscribe(
            (data) => {
              //console.log(data);
              if (data['url']) {
                //localStorage.setItem('tokenSecret', data['tokenSecret']);
                //window.open(data['url'],'_blank')
                this.OpenPopupCenter(data['url'], 'Youtube Login', 800, 600)
              }
            }
          );
      }
    
      googlelogin() {
        this.digitalService.googleaccess()
          .subscribe(
            (data) => {
              //console.log(data);
              if (data['url']) {
                //localStorage.setItem('tokenSecret', data['tokenSecret']);
                //window.open(data['url'],'_blank')
                this.OpenPopupCenter(data['url'], 'Youtube Login', 800, 600)
              }
            }
          );
      }
    */
      onNoClick(): void {
        this.dialogRef.close();
      }
    
    /*
      async createuser() {
        if (this.welcomeform.invalid == true) {
          return;
        } else {
          this.digitalService.userCreate(this.welcomeform.value).then(
            data => {
              console.log(data['msg']);
            }
          )
        }
      }
    
      channels() {
        window.location.href = '/dashboard';
      }
    
    */
      fb_submit(data) {
        // fb submitted values=  1: init, 2 = fail, 3 = done, 4 = progress
        this.digitalService.social_fb(data).then(
          data => {
            console.log(data);
            this.spin = false
            this.dialogRef.close();
            this.onNoClick()
            this._snackBar.open(data['msg'], 'Close', {
              duration: 5000,
            });
          },
          err => {
            console.log(err);
            this.onNoClick()
            this.spin = false
            this._snackBar.open(data['msg'], 'Close', {
              duration: 5000,
            });
          }
        )
      }
      /*
      ins_submit() {
        console.log()
        // this.digitalService.FbAccess(this.ins_obj).subscribe((res) => {
        //   console.log("Instagram message ::");
    
        //   if (res.result) {
        //     console.log(res.result);
        //     this.ins_submitted = 3;
        //     // window.location.href = '/dashboard/';
        //   }
        //   else {
        //     this.ins_submitted = 2;
        //   }
        // });
      }
    
      savePage(index) {
        console.log(this.obj[0].usertoken)
        var obj = { 'page_id': this.pagelist[index].id, 'page_name': this.pagelist[index].name, 'accessToken': this.pagelist[index].access_token, 'page_profile': this.pagelist[index].picture['data']['url'], 'media_type': 'facebook', brand_id: localStorage.getItem('current_brand_id'), 'user_token': this.obj[0].usertoken }
        this.fb_obj = obj;
        // console.log(this.pagelist[index]);
        // this.page_id =this.pagelist[index].id;
        // this.page_name =this.pagelist[index].name;
        // this.page_token =this.pagelist[index].access_token;
        // this.page_profile =this.pagelist[index].picture['data']['url'];
        // this.media_type = 'facebook'
        console.log(this.page_profile);
        this.channelscreate = true
      }
    
      savePagee(index) {
        console.log(this.instapage[index]);
        this.ins_obj = { 'page_id': this.instapage[index].instagram_business_account.id, 'page_name': this.instapage[index].instagram_business_account.name, 'accessToken': this.instapage[index].access_token, 'page_profile': this.instapage[index].picture['data']['url'], 'media_type': 'instagram', brand_id: localStorage.getItem('current_brand_id') }
        console.log(this.page_id)
        this.channelscreate = true
      }
    
      savepage_gmb(index){
        console.log(this.google_m[index]);
        let token = this.mgb['access_token']
        let thumbnails = this.mgb['thumbnails']
        this.mgb = {brand_id:localStorage.getItem('current_brand_id'),channel_name:this.google_m[index].locationName,page_id:this.google_m[index].name,access_token:token,thumbnails:thumbnails}
        console.log(this.mgb)
      }
    
      gmb_submit(){
        console.log("gmb_submit");
        this.digitalService.My_bussiness_google(this.mgb).then(
          data => {
            console.log(data);
            if (data['result']) {
              console.log(data['result']);
              this.gms_submitted = 3;
              // window.location.href = '/dashboard/';
            }
            else {
              this.gms_submitted = 2;
            }
          },
          err => {
            console.log(err);
          }
        );
        
      }
    
      async createbrand() {
        
        if (this.brandform.invalid == true) {
          return;
        } else {
          this.checkchannelimit();
          this.digitalService.brandCreate(this.brandform.value).then(
            data => {
              console.log(data['result']['brand_id']);
              localStorage.setItem('current_brand_id', data['result']['brand_id']);
              localStorage.setItem('current_brand_name', (data['result']['brand_name']));          
            },
            err => {
              console.log(err);
              this._snackBar.open(err.error['msg'], 'Close', {
                duration: 5000,
              });
            }
          )
        }
      }
     */

}
