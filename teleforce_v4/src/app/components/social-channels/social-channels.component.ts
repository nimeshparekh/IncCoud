import { Component, OnInit, Inject ,Injectable} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DigitalService } from '../../digital.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddChannelComponent } from '../add-channel/add-channel.component';
import { FormBuilder, FormControl, FormGroup, Validators,AbstractControl,FormArray,ValidationErrors } from '@angular/forms';
import { ManagerService } from"../../manager.service";
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-social-channels',
  templateUrl: './social-channels.component.html',
  styleUrls: ['./social-channels.component.css']
})
export class SocialChannelsComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar,private managerservice: ManagerService,private router: Router,
    public dialog: MatDialog,private digitalService: DigitalService) { }
  list
  facebook = null;
  facebook_channel = []
  twitter_channel = []
  instagram_channel = []
  linkdin_channel = []
  youtube_channel = []
  google_channel = []
  all_channels
  twitter = null;
  instagram = null;
  linkdin = null;
  youtube = null;
  google = null;
  gmb = null;
  channelcheck=true;
  brand_names:any;
  current_brand:any;
  ngOnInit() {
    this.getchannelsAll()
    this.social_list()
    this.getBrandAll()
    this.accesssetting();
  }
  async accesssetting() {
    var userid = localStorage.getItem('access_id');

    await this.managerservice.getManagerDetail(userid).then(
      data => {
      
        var services = JSON.parse(data['data']['services']);
        console.log(services);

        if(services.includes('16')){
            
        }else{ 
          this.router.navigate(['/dashboard']);

        }
        // if (services.length > 0) {
        //   for (var i = 0; i < services.length; i++) {
        //     if (services[i] == '16') {
        //       console.log("yes");
              
        //     }else{

        //       this.router.navigate(['/dashboard']);

        //     }
        //   }
        // }


       
      },
      err => {
        console.log('error');
      })
  }
  openDialog(data1,media): void {
    if(media == 'twitter'){
      const dialogRef = this.dialog.open(ConnectComponent, {
        width: '650px',data:{data1,media}
      });
      dialogRef.afterClosed().subscribe(() => {
        this.getchannelsAll()
      });
      // this.authAPIService.sync_twitter_social(data1).then(
      //   data=>{
      //     console.log(data);
          
      //     this._snackBar.open(data['msg'],'Close',{
      //       duration: 5000,
      //     });
      //     const dialogRef = this.dialog.open(ConnectComponent, {
      //       width: '650px',data:{data1,media}
      //     });
      //     dialogRef.afterClosed().subscribe(() => {
      //       this.getchannelsAll()
      //     });
      //   })
    }else{
      const dialogRef = this.dialog.open(ConnectComponent, {
        width: '650px',data:{data1,media}
      });
      dialogRef.afterClosed().subscribe(() => {
        this.getchannelsAll()
      });
    }
  }

  getchannelsAll(){
    var data_n = {'brand_id':localStorage.getItem('current_brand_id')}
     console.log("okok");
    this.facebook_channel = []
    this.instagram_channel = []
    this.twitter_channel = []
    this.linkdin_channel = []
    this.youtube_channel = []
    this.google_channel = []
    this.digitalService.get_channels_all(data_n).then(
      data1 => {
        if(data1['data']){
          this.all_channels = data1['data'];
          if(this.all_channels){
              this.all_channels.forEach(element => {
                if(element.token_expire){
                  this._snackBar.open(element.access_media+':'+element.token_expire,'Close',{
                    duration: 5000,
                  });
                }	
                if(element.access_media == 'facebook'){
                  this.facebook_channel.push(element.channel_name)
                }
                if(element.access_media == 'twitter'){
                  this.twitter_channel.push(element.channel_name)
                }
                if(element.access_media == 'instagram'){
                  this.instagram_channel.push(element.channel_name)
                }
                if(element.access_media == 'linkedin'){
                  this.linkdin_channel.push(element.channel_name)
                }
                if(element.access_media == 'youtube'){
                  this.youtube_channel.push(element.channel_name)
                }
                if(element.access_media == 'google'){
                  this.google_channel.push(element.channel_name)
                }
              })
          }
        }
       // console.log(this.facebook_channel);
        
      },
      err=> {}
    )
  }
  
  social_list(){
    this.digitalService.social_list(localStorage.getItem('current_brand_id')).then(
      data => {
        console.log("list here");
        console.log(data['data']);
        
          this.list = data['data']
        this.list.forEach(element => {
          if(element.access_media == 'facebook'){
            this.facebook = element
          }
          if(element.access_media == 'twitter'){
            this.twitter = element
          }
          if(element.access_media == 'instagram'){
            this.instagram = element
          }
          if(element.access_media == 'linkdin'){
            this.linkdin = element
          }
          if(element.access_media == 'youtube'){
            this.youtube = element
          }
          if(element.access_media == 'google'){
            this.google = element
          }
        });
        console.log('fb'+JSON.stringify(this.facebook));
        
      }
    )
  }
  
  openDialog_channel(): void {
    this.channelcheck = true 
    const dialogRef = this.dialog.open(AddChannelComponent, { data: { channelcheck: this.channelcheck } });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  getBrandAll() {
    let data = {'user_id':localStorage.getItem('access_id')}
    this.digitalService.get_brands(data).then(
      data => {
        console.log('getBrandAll',data);
        if(data['data'].length>0){
          this.brand_names = data['data'];
          console.log('brand_names',this.brand_names);
          if (localStorage.getItem('current_brand_id') == null) {          
            localStorage.setItem("current_brand_name", this.brand_names[0].brand_name);
            localStorage.setItem("current_brand_id", this.brand_names[0].brand_id);
          }
          this.current_brand = localStorage.getItem('current_brand_name');
        }
      }
    )
  }
 
  savePage(index) {
    localStorage.setItem("current_brand_name", this.brand_names[index].brand_name);
    localStorage.setItem("current_brand_id", this.brand_names[index].brand_id);
    this.current_brand = localStorage.getItem('current_brand_name');
    //this.gettotalchannels();
    window.location.href = "/social-channels";
  }
}

@Component({
  selector: 'connect',
  templateUrl: 'connect.component.html',
  styleUrls: ['./social-channels.component.css']
})
export class ConnectComponent {
  pagelist = []
  pagelist_verify = []
  public media:any = {};
  pagelist_image = []
  all_channels
  auth
  constructor(
    public dialogRef: MatDialogRef<ConnectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SocialChannelsComponent,public dialog: MatDialog,private _snackBar: MatSnackBar,private digitalService: DigitalService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    console.log(this.data);
    this.getchannelsAll()
  }


  twitter(){
    console.log('twiiter');
    let data_n = {'accessToken':this.data['data1']['accessToken']}
    this.pagelist_verify = []
    this.pagelist = []
    console.log(this.data['data1']);
    var pagelist = []
    pagelist.push(this.data['data1'])
    this.media = 'twitter'
    pagelist.forEach(element => {
        console.log(element);
        this.pagelist.push(element)
    }); 
    this.pagelist.map((ele2, i2) => {
      var result = this.all_channels.find(ele3 => ele3.page_id === ele2.id);
      console.log(result);
      if(result != undefined){
        ele2.already = true
        ele2.channel_id = result.channel_id
      }
      this.pagelist_verify.push(ele2)
    });  
    //console.log(this.pagelist_verify);

  }
 /*
  youtube(){
    let data_n = {'accessToken':this.data['data1']['accessToken']}
    this.pagelist_verify = []
    this.pagelist = []
    this.auth = {'access_token':this.data['data1']['accessToken'],'expires_in':this.data['data1']['expiry_date'],'refresh_token':this.data['data1']['access_media_refresh_token']}
    this.authAPIService.sync_youtube_social(data_n).then(
      data=>{
        var pagelist = data['channels']
        this.media = 'youtube'
        pagelist.forEach(element => {
          this.pagelist.push(element)
          this.pagelist_image.push(element.snippet.thumbnails.medium.url)
        })        
        this.pagelist.map((ele2, i2) => {
          var result = this.all_channels.find(ele3 => ele3.page_id === ele2.id);
          if(result != undefined){
            ele2.already = true
            ele2.channel_id = result.channel_id
          }
          this.pagelist_verify.push(ele2)
        });  
      })
  }
  */

  instagram(){
    let data_n = {'accessToken':this.data['data1']['accessToken']}
    this.pagelist_verify = []
    this.pagelist = []
    this.digitalService.sync_instagram_social(data_n).then(
      data=>{
        console.log(data['data']);
        
        var pagelist = data['data']['accounts']['data'];
        this.media = 'instagram'
        pagelist.forEach(element => {
          if (element.instagram_business_account) {
            this.pagelist.push(element)
            this.pagelist_image.push(element.picture.data.url)
          }
        });

        this.pagelist.map((ele2, i2) => {
          var result = this.all_channels.find(ele3 => ele3.page_id === ele2.instagram_business_account.id);
          if(result != undefined){
            ele2.already = true
            ele2.channel_id = result.channel_id
          }
          this.pagelist_verify.push(ele2)
        });        
      }
    )
  }

  linkedin(){
    let data_n = {'accessToken':this.data['data1']['accessToken']}
    console.log(this.data['data1']);
    this.auth = {'access_token':this.data['data1']['accessToken'],'expires_in':this.data['data1']['expiry_date'],'refresh_token':this.data['data1']['access_media_refresh_token']}
    this.pagelist_verify = []
    this.pagelist = []
    this.digitalService.sync_linkedin_social(data_n).then(
      data=>{
        
        console.log('linkedin',data);
        
        var pagelist = data['pages']
        this.media = 'linkedin'
        pagelist.forEach(element => {
          if (element.organization) {            
            this.pagelist.push(element)
            if(element['organization~']['logoV2']){
              this.pagelist_image.push(element['organization~']['logoV2']["original~"].elements[1].identifiers[0].identifier)
            }
          }
        });

        this.pagelist.map((ele2, i2) => {
          var result = this.all_channels.find(ele3 => ele3.page_id === ele2.organization);
          if(result != undefined){
            ele2.already = true
            ele2.channel_id = result.channel_id
          }
          this.pagelist_verify.push(ele2)
        });                        
      }
    )
  }
/*
  google(){
    let data_n = {'id':this.data['data1']['id']}
    this.pagelist_verify = []
    this.pagelist = []
    this.authAPIService.sync_gmb_social(data_n).then(
      data=>{
        console.log(data);
        this.pagelist = data['data']
        this.media = 'google'
        this.pagelist.map((ele2, i2) => {
          var result = this.all_channels.find(ele3 => ele3.page_id === ele2.name);
          if(result != undefined){
            ele2.already = true
            ele2.channel_id = result.channel_id
          }
          this.pagelist_verify.push(ele2)
        });
      }
    )
  }
 */
  facebook(){
    let data_n = {'accessToken':this.data['data1']['accessToken']}
    this.pagelist_verify = []
    this.pagelist = []
    console.log(data_n);
    this.digitalService.sync_fb_social(data_n).then(
      data=>{
        console.log(data);
        console.log(data['data']['accounts']);
        
        this.pagelist = data['data']['accounts']['data'];
        this.media = 'facebook'
        this.pagelist.forEach(element => {
            this.pagelist_image.push(element.picture.data.url)
        });
        console.log(this.pagelist);
        
        this.pagelist.map((ele2, i2) => {
          if(this.all_channels){
              var result = this.all_channels.find(ele3 => ele3.page_id === ele2.id);
              if(result != undefined){
                ele2.already = true
                ele2.channel_id = result.channel_id
              }
            }
            this.pagelist_verify.push(ele2)
        });
        console.log('pagelist_verify',this.pagelist_verify);
        console.log('media',this.media);
      },
      err => {
        console.log(JSON.stringify(err));
      }
      
    );
  }

  DeleteConfirm(channel) {
    console.log('channel',channel);
    console.log(channel.channel_id);
    var data = {'id':channel.channel_id}
    this.digitalService.delete_channels(data).then(
      data=>{
        if(data['msg']){
          this._snackBar.open("Successfully Deleted",'Close',{
            duration: 5000,
          });
          this.getchannelsAll();
        }
      })
  }
 
  getchannelsAll(){
    var data_n = {'brand_id':localStorage.getItem('current_brand_id')}
    this.digitalService.get_channels_all(data_n).then(
      data1 => {
        console.log(data1['data']);
        this.all_channels = data1['data'];
        if(this.data['media'] == 'facebook'){
          this.facebook()
        }
        if(this.data['media'] == 'instagram'){
          this.instagram()
        }
        if(this.data['media'] == 'linkdin'){
          this.linkedin()
        }
        if(this.data['media'] == 'youtube'){
          //this.youtube()
        }
        if(this.data['media'] == 'twitter'){
          this.twitter()
        }
        if(this.data['media'] == 'google'){
          //this.google()
        }
      },
      err=> {}
    )
  }

  
  selectfb(index){
    console.log(this.pagelist[index]);
    // return
    if(this.media == 'linkedin'){
      var params={'page' :this.pagelist[index], 'auth': this.auth, 'brand_id': localStorage.getItem('current_brand_id')}
      this.digitalService.linkedin_page_select(params).then(
        data=>{
          console.log(data);
          window.close();
          this.dialogRef.close();
          this._snackBar.open(data['data']['message'],'Close',{
            duration: 5000,
          });
          params['channel_id']=data['channel_id']
          this.digitalService.get_linkedin_post(params).then($data1=>{
          },
          err=>{
            console.log(err);
          })
        },
        err=>{
          console.log(err);
        }
      )
    }else if (this.media == 'twitter'){
    this.digitalService.sync_twitter_social(this.data['data1']).then(
      data=>{
        console.log(data);
        this.dialogRef.close();
        this._snackBar.open(data['data']['message'],'Close',{
          duration: 5000,
        });
        var params={'channel_id' :data['channel_id'],'user_id': localStorage.getItem('access_id'),'brand_id': localStorage.getItem('current_brand_id')};
        this.digitalService.get_twitter_post(params).then($data1=>{
        },
        err=>{
          console.log(err);
        })
      })
    }
    /*
    else if(this.media == 'youtube'){
      var param={'channel' :this.pagelist[index], 'auth': this.auth, 'brand_id': localStorage.getItem('current_brand_id')}
      this.digitalService.youtube_channel_select(param).then(
        data=>{
          console.log(data);
          this.dialogRef.close();
        },
        err=>{
          console.log(err);
        }
      )
    
    }else if(this.media == 'google'){
      var params_g = {brand_id:localStorage.getItem('current_brand_id'),channel_name:this.pagelist[index].locationName,page_id:this.pagelist[index].name,access_token:this.data['data1'].accessToken}
      console.log(params_g);
      this.digitalService.sync_gmb_social_channel(params_g).then(
        data=>{
          console.log(data);
          this.dialogRef.close();
        },
        err=>{
          console.log(err);
        }
      )
      
    }*/
    else{
      console.log(this.media);
      if(this.media == 'instagram'){
        var obj = { 'page_id':this.pagelist[index]['instagram_business_account'].id, 'page_name':this.pagelist[index].name, 'accessToken': this.pagelist[index].access_token, 'page_profile': this.pagelist[index].picture['data']['url'], 'media_type': this.media, brand_id: localStorage.getItem('current_brand_id'), 'user_token': this.data['data1']['accessToken']}
      }else{
        var obj = { 'page_id': this.pagelist[index].id, 'page_name': this.pagelist[index].name, 'accessToken': this.pagelist[index].access_token, 'page_profile': this.pagelist[index].picture['data']['url'], 'media_type': this.media, brand_id: localStorage.getItem('current_brand_id'), 'user_token': this.data['data1']['accessToken']}
      }
      // this.digitalService.FbAccess(obj).subscribe((res) => {
      //   console.log("facebook message ::");

      //   console.log(res);
      //   this.dialogRef.close();
      //   this._snackBar.open(res['message'],'Close',{
      //     duration: 5000,
      //   });
      // });


      this.digitalService.fb_access(obj).then(
        data=>{
          console.log('data',data);
          this.dialogRef.close();
          this._snackBar.open(data['data']['message'],'Close',{
            duration: 5000,
          });
            obj["channel_id"]=data['channel_id'];
            if(this.media == 'instagram'){
              this.digitalService.get_instagram_post(obj).then(data1=>{
                console.log('get_instagram_post',data1);
              }, err=>{
                console.log(err);
              })
            }else{
              this.digitalService.get_fb_post(obj).then(data1=>{
                console.log('get_fb_post',data1);
              },
              err=>{
                console.log(err);
              })
            }
           
        },
        err=>{
          console.log(err);
        }
      )
    }
  }
  
  assign(data){
    console.log(data.channel_id)
    this.dialogRef.close();
    const dialogRef = this.dialog.open(ChatassignComponent, {
      width: '500px',data:data
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }
  
}
@Component({
  selector: 'chatassign',
  templateUrl: 'chatassign.Component.html',
  styleUrls: ['./social-channels.component.css']
})
export class ChatassignComponent {
  memberForm : FormGroup;
  name;
  agentgroup
  constructor(
    public dialogRef: MatDialogRef<ChatassignComponent>,private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: SocialChannelsComponent,public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private digitalService: DigitalService) {}

    onNoClick(): void {
      this.dialogRef.close();
    }
  
  ngOnInit() {
    this.getagentgroup();
    console.log(this.data);
    this.name = this.data['name']
    this.memberForm = this.formBuilder.group({
      group: [null],
      channel_id:[null]
    })
    
    console.log('agentgroup',this.agentgroup);
  }


  async getagentgroup() {
    let userinfo = localStorage.getItem('access_id');
    await this.digitalService.gethuntgroup(userinfo).then(data => {
      if (data) {
        this.agentgroup = data['data'];
        console.log('agentgroup1',this.agentgroup);
      }
    },
      err => {
        console.log('error');
      })
  }

  createassign(){
   
    let data: any = Object.assign(this.memberForm.value);
    if(data.group == null){
      this._snackBar.open('Please Select Agent Group','Alert',{
        duration: 5000,
      })
      return
    }else{
      data.channel_id = this.data['channel_id']
      console.log(data);
      this.digitalService.assign_group_channel(data).then(
        data2 =>{          
          console.log(data2)
          this.dialogRef.close();
          this.memberForm.reset()
          this._snackBar.open(data2['message'],'Close',{
            duration: 5000,
          })
        }
      )
    }
  }

}







