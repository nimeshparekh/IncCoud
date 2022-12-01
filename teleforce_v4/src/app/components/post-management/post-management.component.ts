import { Component, OnInit ,Inject,ViewChild} from '@angular/core';
import {MatDialog,MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ArrayType, ConstantPool } from '@angular/compiler';
import { DigitalService } from '../../digital.service';
import { MatTableDataSource } from '@angular/material/table';
import { isArray } from 'util';
import {MatPaginator} from '@angular/material/paginator';
import { ManagerService } from"../../manager.service";
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
export interface DialogData {
  post_id: String,
  channel_id: String,
}
export interface DialogData1 {
  post_id: String,
  fb_page_aToken: String,
}

export interface PeriodicElement {
  publishedOn: string;
  postContent: string;
  interaction: string;
  publishedBy: string;
  action: string;
}
const ELEMENT_DATA: PeriodicElement[] = [

  {publishedOn: 's', postContent: 'Hydrogen', interaction: 'd', publishedBy: 'publishedBy', action:'gg'},

];

@Component({
  selector: 'app-post-management',
  templateUrl: './post-management.component.html',
  styleUrls: ['./post-management.component.css','../../../assets/css/heart.scss']
})
export class PostManagementComponent implements OnInit {
  public dataSource: MatTableDataSource<any>;
  public contactdataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['publishedOn', 'postContent', 'interaction', 'publishedBy', 'action'];
  contactLength = 0;

  saveForm : FormGroup;
  postArr; // FB get posts saved here
  insArr;
  saveArr; 
  schedArr;
  dispArr;
  tweetArr;
  li_page_id;
  liArr;
  fb_page_account;
  fb_page_id;
  fb_page_aToken;
  fb_insight;
  fb_reacts;
  fb_mention_from_list=[];
  fb_mention_list=[];
  fb_mentionee_index;
  media_path=environment.media_path;
  mentionees= new FormControl();
  PageOption="Select Your Facebook Page";
  LI_PageOption = 'Select Your LinkedIn Page';
  showingSocial = true;
  showingSaved= false;
  showingSched= false;
  spin=false
  image_to_show = [];
  commonPostData;
  page_count=0;
  currentDisp;
  social_select;
  linked_in_acc;
  ins_comments;
  yt_details
  all_channels;
  current_channel_id;
  selected_channel;
  ins_post_insights;
  linkedIn_post_insights={
    clickCount: '-',
    commentCount: '-',
    engagement: '-',
    impressionCount: '-',
    likeCount: '-',
    shareCount: '-',
  };
  isLoading = false
  tabchannelmedia = ''
  createpost = false
  previewdata = { access_media: '', name: '', pfp_thumbnail: '', create_time: '', message: '', likes: '', comments: [], image: '', c_count: '' , element : {} as any, channel: {} as any,video: ''};
  yt_data
  @ViewChild('contactpaginator',{static: false}) contactpaginator: MatPaginator;  

  constructor(public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar, 
    private digitalService:DigitalService,private managerservice: ManagerService,private router: Router,

 
    ) { }

  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }
  
  doesFileExist(urlToFile) {
    //console.log(urlToFile); 
      var xhr = new XMLHttpRequest();
      xhr.open('HEAD', urlToFile, false);
      xhr.send();
      //console.log(xhr); 
      if (xhr.status == 404 || xhr.status == 500) {
          return false;
      } else {
          return true;
      }
  }

  checkimagepath(path){
    return './assets/img/social-channel.png'
    // var fileexist = this.doesFileExist(path)
    // if(fileexist){
    //   return path
    // }else{
    //   return './assets/img/social-channel.png'
    // }
  }
  ngOnInit() {
    
   // this.loadScript('assets/js/right-side-bar.js');

    console.log(this.previewdata)
    this.dataSource = new MatTableDataSource(); // create new object
    let customerid = localStorage.getItem('access_id');
    this.saveForm = this.formBuilder.group({
      customer_id: customerid,
      message:[''],
      media :[],
      mime:[],
      twitter: false,
      facebook: false,
      schedule:[''],
    })
    
   this.accesssetting();
    this.getchannelsAll();
    //this.showSocialposts();
    //this.linkedIn_get();
    this.getMenuAccess();
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
  // checkUserExists(){
  //   console.log('User exists?');
  //   this.authService.userExists().then(
  //     data=>{
  //       if (data['useraccess']){
  //         var useraccess = data['useraccess'][0]
  //         if(useraccess.role==0 || useraccess.role==2){
  //           this.createpost = true;
  //         }
  //       }
  //     },
  //     err=>{
  //       console.log(err);
  //     }
  //   );
  // }
  getMenuAccess() {
    this.digitalService.getMenuAccess().then(
      data => {
        var accessdata = data['menuaccess']!=undefined?data['menuaccess']:[];
        //console.log(data['access']['menuaccess']);
        if (accessdata.includes('post')) {
          
        } else {
          //this.router.navigate(['/dashboard']);
        }
        
      },
      err => {
        console.log(err);

      }
    );
    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.contactpaginator;
  }
  async posttabClick(tab){
    var channeinfo = tab.tab.textLabel.split('-')    
    var channelid = channeinfo[0]
    var channelmedia = channeinfo[1]
    this.tabchannelmedia = channelmedia
    console.log(this.dataSource);
    console.log(channelid+'=='+channelmedia)
    if (channelmedia=='facebook'){
      this.isLoading = true
      this.getFbPosts(channelid);
    }
    if (channelmedia=='instagram'){
      this.isLoading = true
      this.getInstagramPosts(channelid);
    }
    if (channelmedia=='twitter'){
      this.isLoading = true
       this.getTwitterPosts(channelid);
    }
    if (channelmedia=='linkedin'){
      this.isLoading = true
       this.getLIPosts(channelid);
    }
    if (channelmedia=='youtube'){
      this.isLoading = true
      //this.getYTPosts(channelid);
    }
  }

  getInstagramPosts(channel_id){//channel_id
    this.dataSource = new MatTableDataSource(); // create new object
    this.digitalService.get_media(channel_id).then(
      data=>{
        console.log(data);
        this.isLoading = false
        this.dataSource.data = data['data'];
        this.contactLength = data['data'].length;
        this.dataSource.paginator = this.contactpaginator;
      },
      err=>
      {
        console.log(err);
      }
    );
    
  }

  getFbPosts(channel_id){//channel_id
    this.dataSource = new MatTableDataSource(); // create new object
    this.digitalService.fb_get_posts_db({channel_id: channel_id}).then(
      data=>{
        console.log("facebook data new");
        console.log(data);
        this.isLoading = false
        this.dataSource.data = data['data'];
        this.contactLength = data['data'].length;
        this.dataSource.paginator = this.contactpaginator;
      },
      err=>
      {
        console.log(err);
      }
    );
    
  }

  getTwitterPosts(channel_id){
    this.dataSource = new MatTableDataSource(); // create new object
    this.digitalService.pst_mngmt_user_timeline(channel_id).then(
      data=>{
        console.log('twitter',data);
        this.isLoading = false
        this.dataSource.data = data['data'];
        this.contactLength = data['data'].length;
        this.dataSource.paginator = this.contactpaginator;
        // this.tweetArr=data;
        // this.tweetArr.map((element,i)=>
        //   {
        //    this.tweetArr[i].message = element.full_text;
        //    var lm_time =  new Date (this.tweetArr[i].created_at) ;
        //    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        //    this.tweetArr[i].created_at =  lm_time.toLocaleDateString(undefined ,options)+"  "+ lm_time.toLocaleTimeString();
        //   });
      },
      err=>
      {
        console.log(err);
      }
    )
  }

  getLIPosts(channel_id){
    this.dataSource = new MatTableDataSource(); // create new object
    this.digitalService.linked_in_get_feed(channel_id).then(
      data=>{
        console.log(data);
        this.isLoading = false
        this.dataSource.data = data['data'];
        this.contactLength = data['data'].length;
        this.dataSource.paginator = this.contactpaginator;
      },
      err=>
      {
        console.log(err);
      }
    )
  }

/*
  getYTPosts(channel_id){
    this.LIservice.YT_video_list(channel_id).then(
      data=>{
        console.log(data);
        this.isLoading = false
        this.dataSource.data = data['data'];
        this.contactLength = data['data'].length;
      },
      err=>
      {
        console.log(err);
      }
    )
  }
*/
  //Instagram Calls
  instagram_get_comments(channel_id,media_id){
    
    this.digitalService.get_comments(channel_id,media_id).then(
      data=>{
        console.log(data);
        this.ins_comments=data['data'];
      },
      err=>{
        console.log(err);
      }
    )
  
  }
  
  instagram_post_comment(channel_id,media_id){
    
    this.digitalService.post_comment(channel_id,media_id,document.getElementById('txtid_'+media_id)['value']).then(
      data=>{
        console.log(data);
        this.ins_comments=data['data'];
        document.getElementById('txtid_'+media_id)['value']='';
        this.openRightComponent(this.previewdata.element,'instagram',this.previewdata.channel);
      },
      err=>{
        console.log(err);
      }
    )
    
  }

  instagram_post_comment_reply(channel_id,media_id,comment_id){
    this.digitalService.post_comment_reply(channel_id,comment_id,document.getElementById('txtid_'+comment_id)['value']).then(
      data=>{
        console.log(data);
        this.ins_comments=data['data'];
        document.getElementById('txtid_'+media_id)['value']='';
        this.openRightComponent(this.previewdata.element,'instagram',this.previewdata.channel);
      },
      err=>{
        console.log(err);
      }
    )
    
  }


  fb_publish_like(object_id){
    var params = {channel_id: this.previewdata.channel['channel_id'], object_id : object_id}
    this.digitalService.fb_like(params).then(
      data=>{
        console.log(data);
        if(data['success']){
          this._snackBar.open("Successfully liked!",'Close',{
            duration: 5000,
          });
          this.openRightComponent(this.previewdata.element,'facebook',this.previewdata.channel);
        }
        else{
          // this._snackBar.open("Something went wrong",'Close',{
          //   duration: 5000,
          // });
        }
        
      },
      err=>{
        console.log(err);
      }
    )
    
  }

  fb_unlike(object_id){
    var params = {channel_id:  this.previewdata.channel['channel_id'], object_id : object_id}
    this.digitalService.fb_unlike(params).then(
      data=>{
        console.log(data);
        if(data['success']){
          this._snackBar.open("Successfully unliked!",'Close',{
            duration: 5000,
          });
        }
        else{
          // this._snackBar.open("Something went wrong",'Close',{
          //   duration: 5000,
          // });
        }
        
        this.openRightComponent(this.previewdata.element,'facebook',this.previewdata.channel);
      },
      err=>{
        console.log(err);
      }
    ) 
  }

  selectMentionee(index){
    this.fb_mentionee_index=index;
  }
  fb_mention_toggle(id){
    this.fb_mention_list =[];
    this.fb_mention_from_list=[];
    this.mentionees = new FormControl(); //resetting for so doesnt conflict for different posts
    console.log(document.getElementById(id).style);
    if (document.getElementById(id).style.display=='none'){
      var unique=[];
      this.previewdata.comments.map(
      (element,i)=>{
        if (unique.find(ele2 => ele2==element.from.id)){
        }
        else{
          this.fb_mention_from_list.push(element.from);
          this.fb_mention_list.push(element.from.name);
          unique.push(element.from.id);
        }
      }
      )
      document.getElementById(id).style.display='block'
    
    }
    else{
      document.getElementById(id).style.display = 'none';
    }
  }

  async postComment_FB(object_id,from){
    var comment_string='';
    if ( isArray(from) ){
      from.map((element,i)=>{
        comment_string=comment_string + '@['+this.fb_mention_from_list[element]['id']+'] '
      });
      comment_string=comment_string+document.getElementById('txtid_'+object_id)['value'];
    }
    else{  
        if (document.getElementById('mention_'+object_id)['checked']){
          comment_string='@['+from.id+'] '+document.getElementById('txtid_'+object_id)['value'];
        }
        else{
          comment_string=document.getElementById('txtid_'+object_id)['value'];
        }
      }
    console.log(document.getElementById('txtid_'+object_id)['value']);
   
    await this.digitalService.fb_comment_post({object_id: object_id, channel_id: this.previewdata.channel['channel_id'] ,message: comment_string}).then(
      data=>{
        console.log(data);
        if (data['error']){
          this._snackBar.open("Error: "+data['Error']['headers']['name'],'Close',{
            duration: 5000,
          });
        }
        document.getElementById('txtid_'+object_id)['value']='';
        this.openRightComponent(this.previewdata.element,'facebook',this.previewdata.channel);
      },
      err=>{
        console.log(err);
      }
    );  
    
  }

  openLinktoPost(element,channel_type){
    console.log('openLinktoPost',element);
    console.log('openLinktoPost',channel_type);
    if(channel_type=='facebook'){
      window.open('https://www.facebook.com/'+element.id,'_blank')
    }
    else if(channel_type=='instagram'){
      if(element.post_link!=null)
        window.open(element.post_link,'_blank')
    }
    else if(channel_type=='linkedin'){
      window.open('https://www.linkedin.com/feed/update/'+element.activity,'_blank')
    }
    else if (channel_type=='twitter'){
      window.open('https://twitter.com/'+element['channel_name']+'/status/'+element['id'],'_blank')
    }
  }

  async openRightComponent(element,channel_type,channel){
    console.log(element);
    console.log(channel_type);
    console.log(channel);
    
    if (channel_type == 'facebook'){
      await this.digitalService.fb_get_post_insights({channel_id: channel.channel_id,post_id: element.id}).then(
        data4=>{
          console.log(data4);
          // console.log(JSON.parse(data4[0].body));
          // console.log(JSON.parse(data4[1].body));
          this.fb_insight =  [JSON.parse(data4[0].body), JSON.parse(data4[1].body), JSON.parse(data4[2].body)];
          this.fb_reacts=JSON.stringify(this.fb_insight[0]['data'][0]['values'][0]['value']);
          console.log(this.fb_insight);
        },
        err=>{
          console.log("Post insight Error :" + JSON.stringify(err));
        }
      );
      if(this.fb_insight[1].likes.summary.has_liked){
        document.getElementById('checkbox')['checked']=true;
      }
      else{
        //document.getElementById('checkbox')['checked']=false;
      }
      console.log(element.id);
      this.previewdata={ 
        access_media: channel_type,
        name:  channel.channel_name,
        pfp_thumbnail: channel.channel_thumbnail,
        create_time: element.created_time,
        message: element.message,
        likes: this.fb_insight[1].likes.summary.total_count,
        comments: this.fb_insight[1].comments.data,
        c_count: this.fb_insight[2].summary.total_count,
        image: '',
        element: element,
        channel: channel,
        video: '',
      }
      console.log(this.previewdata)
      this.fb_mention_list =[];
      this.fb_mention_from_list=[];
      if(element.full_picture){
        if (element.attachments){
          if (element.attachments.data[0].type=='video_inline'){
            this.previewdata.video=element.attachments.data[0].media.source;
          }else{
            this.previewdata.image=element.full_picture;
            this.previewdata.message=element.attachments.data[0].description;
          }
        }
        else{
          this.previewdata.image=element.full_picture;
        }
      }
      else if(element.attachments){
        this.previewdata.image=element.attachments.data[0].media.image.src;
        this.previewdata.message=element.attachments.data[0].description;
      }
      document.getElementById("right-sidenav-postmng").style.width = "500px";
      document.getElementById("overlay").style.display = "block";
    }
    else if(channel_type == 'linkedin'){
      console.log(element);
      this.previewdata={ 
        access_media: channel_type,
        name:  channel.channel_name,
        pfp_thumbnail: channel.channel_thumbnail,
        create_time: element.created_time,
        message: element.message,
        likes : '',
        comments: [],
        c_count:'',
        image: '',
        element: element,
        channel: channel,
        video: '',
      }
      this.digitalService.linked_in_get_socialActions(channel.channel_id,element.activity).then(
        data=>{
          console.log(data);
          this.previewdata.likes=data['likesSummary']['aggregatedTotalLikes'];
          this.previewdata.c_count = data['commentsSummary']['aggregatedTotalComments'];
        },
        err=>{
          console.log(err);
        }
      );
      this.digitalService.linked_in_get_socialActions_comments(channel.channel_id,element.activity).then(
        data=>{
          console.log(data);
          this.previewdata.comments = data['elements'];
          
        },
        err=>{
          console.log(err);
        }
      );
      this.digitalService.linked_in_get_shareId(channel.channel_id,element.activity).then(
        data=>{
          console.log(data);
          this.digitalService.linked_in_get_share_insights(channel.channel_id,data['domainEntity']).then(
            data=>{
              console.log(data);
              this.linkedIn_post_insights=data['elements'][0]['totalShareStatistics'];
            },
            err=>{
              console.log(err);
            }
          );
        },
        err=>{
          console.log(err);
          }
        
      );

      if (element.text)
      {
        this.previewdata.message= element.text.text;
      }
      if (element.content)
      {
        this.previewdata.image = element.content.contentEntities[0].thumbnails[0].resolvedUrl;
      }
      document.getElementById("right-sidenav-postmng").style.width = "500px";
      document.getElementById("overlay").style.display = "block";
    }
    else if(channel_type == 'instagram'){
      console.log(element);
      await this.digitalService.get_comments(channel.channel_id,element.id).then(
        data=>{
          console.log(data);
          this.ins_comments=data['data'];
        },
        err=>{
          console.log(err);
        }
      );
      await this.digitalService.get_media_insights(channel.channel_id,element.id).then(
        data=>{
          console.log(data);
          this.ins_post_insights=data['data'];
          console.log(this.ins_post_insights[0]);
        },
        err=>{
          console.log(err);
        }
      );
      this.previewdata={ 
        access_media: channel_type,
        name:  channel.channel_name,
        pfp_thumbnail: channel.channel_thumbnail,
        create_time: element.timestamp,
        message: element.caption,
        likes: element.like_count,
        comments: this.ins_comments,
        image: element.media_url,
        c_count: element.comments_count,
        element: element,
        channel: channel,
        video: '',
      }
      if (element.media_type=='VIDEO'){
        this.previewdata['video']=element.media_url;
        console.log("VIDEO");
        console.log(this.previewdata);
      }
      else{
        this.previewdata.image= element.media_url;
      }
      document.getElementById("right-sidenav-postmng").style.width = "500px";
      document.getElementById("overlay").style.display = "block";
    }
    else if(channel_type == 'twitter'){
      this.previewdata={ 
        access_media: channel_type,
        name:  channel.channel_name,
        pfp_thumbnail: channel.channel_thumbnail,
        create_time: element.created_at,
        message: element.full_text,
        likes: element.favorite_count,
        comments: [],
        image: '',
        c_count:'',
        element: element,
        channel: channel,
        video: '',
      }

      if (element.extended_entities)
      {
        if (element.extended_entities.media[0].type=='photo'){
          this.previewdata.image = element.extended_entities.media[0].media_url_https;
        }
        else if(element.extended_entities.media[0].type=='video'){
          this.previewdata.video = element.extended_entities.media[0].video_info.variants[1].url;;
        }
      }
      if (element.favorited){
        document.getElementById('checkbox')['checked']=true;
      }
      else{
        document.getElementById('checkbox')['checked']=false;
      }
      document.getElementById("right-sidenav-postmng").style.width = "500px";
      document.getElementById("overlay").style.display = "block";
    }
    /*
    else if(channel_type == 'youtube'){
      this.previewdata={ 
        access_media: channel_type,
        name:  channel.channel_name,
        pfp_thumbnail: channel.channel_thumbnail,
        create_time: element.contentDetails.videoPublishedAt,
        message: 'heeee',
        likes: '0',
        comments: [],
        image: 'https://scontent-maa2-1.xx.fbcdn.net/v/t1.6435-9/s720x720/117177396_151667103278830_2999908408975401871_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=110474&_nc_ohc=TB4WkIoamQsAX8javtz&_nc_ht=scontent-maa2-1.xx&edm=AKIiGfEEAAAA&oh=8927e52d03d8f9071a31ec3ff4d1f5d6&oe=616BB279',
        c_count:'3',
        element: element,
        channel: channel,
        video: '',
        }
      // this.yt_data = data
      console.log(this.previewdata);
      
      await this.InstagramService.youtube_video_details(channel.channel_id,element.contentDetails.videoId).then(
        data=>{
          console.log(data['data']);
          this.yt_details=data['data'];
        },
        err=>{
          console.log(err);
        }
      );
    }
    */
    
  }

  postComment_LI(object_id,channel_id){
    var body ={
      "actor":'',
      "object": object_id,
      "message":{
         "text": document.getElementById('txtid_'+object_id)['value']
      }
      // "content":[
      //    {
      //       "entity":{
      //          "digitalmediaAsset":"urn:li:digitalmediaAsset:C552CAQGu16obsGZENQ"
      //       },
      //       "type":"IMAGE"
      //    }
      // ]
   }
   if (object_id.split(':')[2]=='comment'){
     body['parentComment']= object_id;
   }
   console.log(object_id);
   
    this.digitalService.linked_in_post_socialActions_comments(channel_id ,object_id,body).then(
      data=>{
        console.log(data);
        document.getElementById('txtid_'+object_id)['value']='';
        this.openRightComponent(this.previewdata.element,'linkedin',this.previewdata.channel);
      },
      err=>{
        console.log(err);
      }
    );
    
  }
  
  li_like(object_id,channel_id,channel){
    var body ={
      "actor":'',
      "object": object_id,
   }
   console.log(object_id);
    this.digitalService.linked_in_post_socialActions_likes(channel_id ,object_id,body).then(
      data=>{
        console.log(data);
        this.openRightComponent(this.previewdata.element,'linkedin',channel);
        if(data['status']==409){
          this._snackBar.open("You have already liked this",'Close',{
            duration: 5000,
          });
        }
        else if(data['$URN']){
          this._snackBar.open("Successfully liked!",'Close',{
            duration: 5000,
          });
        }
      },
      err=>{
        console.log(err);
      }
    );
  }

  removeTags(str){
    if ((str===null) || (str==='')){ 
      return false;
    }
    else{
      str = str.toString();
      return str.replace( /(<([^>]+)>)/ig, '');
    }
  }
  //old code
  ultrashare(index){
    console.log(this.postArr[index]);
   // this.PFservice.setHypersharePostData(this.postArr[index]);
    this.router.navigateByUrl('/hypershare');
  }

  clickedLike(id,channel_type){
    document.getElementById('likeBtn_'+id);
    console.log(document.getElementById('checkbox')['checked']);
    console.log(id);
    if (document.getElementById('checkbox')['checked']){
      if (channel_type=='facebook'){
        var params = {channel_id: this.previewdata.channel['channel_id'], object_id : id}
        
        this.digitalService.fb_like(params).then(
          data=>{
            console.log(data);
            if(data['success']){
              this._snackBar.open("Successfully liked!",'Close',{
                duration: 5000,
              });
              this.openRightComponent(this.previewdata.element,'facebook',this.previewdata.channel);
            }
            else{
              // this._snackBar.open("Something went wrong",'Close',{
              //   duration: 5000,
              // });
            }
            
          },
          err=>{
            console.log(err);
          }
        );
        
      }
      else if(channel_type=='twitter'){
        console.log("twitter Called")
        //this.like_tweet(this.previewdata.channel['channel_id'],this.previewdata.element['id_str']);
      }
    }
    else{
      if(channel_type=='facebook'){
        params = {channel_id:  this.previewdata.channel['channel_id'], object_id : id}
        this.digitalService.fb_unlike(params).then(
          data=>{
            console.log(data);
            if(data['success']){
              this._snackBar.open("Successfully unliked!",'Close',{
                duration: 5000,
              });
            }
            else{
              // this._snackBar.open("Something went wrong",'Close',{
              //   duration: 5000,
              // });
            }
            
            this.openRightComponent(this.previewdata.element,'facebook',this.previewdata.channel);
          },
          err=>{
            console.log(err);
          }
        ) 
        
      }
      else if(channel_type=='twitter'){
        //this.unlike_tweet(this.previewdata.channel['channel_id'],this.previewdata.element['id_str']);
      }
    }
  }

  replyToggle(id){
    if (document.getElementById('replyID_'+id).style.display=='none'){
      document.getElementById('replyID_'+id).style.display='block'
    }
    else{
      document.getElementById('replyID_'+id).style.display = 'none';
    }
  }

  replyHide(id){
    document.getElementById('replyID_'+id).style.display = 'none';
  }

  getchannelsAll(){
    var data_n = {'brand_id':localStorage.getItem('current_brand_id')}
    
    this.digitalService.get_channels_all(data_n).then(
      data1 => {
        this.all_channels = data1['data'];
        console.log(this.all_channels)
        this.all_channels.forEach((element,i) => {
            if(element.token_expire){
              this._snackBar.open(element.access_media+':'+element.token_expire,'Close',{
                duration: 5000,
              });
            }
            if(element.access_media == 'google'){
              console.log(i);
              this.all_channels.splice(i,1)
            }
        });
      },
      err=> {}
    )
    
  }

  like_tweet(channel_id,tweet_id){
    this.digitalService.like_tweet(channel_id,tweet_id).then(
      data=>{
        console.log(data);
        if (data['error'])
        {
          this._snackBar.open(data['error']['message'],'Close',{
            duration: 5000,
          });
        }
        else{
          this._snackBar.open("Successfully liked",'Close',{
            duration: 5000,
          });
        }
      },
      err=>{
        console.log(err);
        this._snackBar.open(err.error['message'],'Close',{
          duration: 5000,
        });
        this.getTwitterPosts(channel_id);
        document.getElementById('checkbox')['checked']=false;
      }
    ) 
  }

  unlike_tweet(channel_id,tweet_id){
    this.digitalService.unlike_tweet(channel_id,tweet_id).then(
      data=>{
        console.log(data);
        if (data['error'])
        {
          this._snackBar.open(data['error']['message'],'Close',{
            duration: 5000,
          });
        }
        else{
          this._snackBar.open("Successfully unliked",'Close',{
            duration: 5000,
          });
        }
      },
      err=>{
        console.log(err);
        this._snackBar.open(err.error['message'],'Close',{
          duration: 5000,
        });
        this.getTwitterPosts(channel_id);
        document.getElementById('checkbox')['checked']=true;
      }
    )
  }

  twitter_reply(channel_id,media_id){
    console.log(media_id)
    this.digitalService.post_tweet_reply(channel_id,media_id,document.getElementById( 'txtid_'+media_id)['value']).then(
      data=>{
        console.log(data);
        document.getElementById( 'txtid_'+media_id)['value']='';
        this._snackBar.open(data['msg'],'Close',{
          duration: 5000,
        });
      },
      err=>{
        console.log(err);
        this._snackBar.open(err.error['msg'],'Close',{
          duration: 5000,
        });
      }
    )
  }
  
  selectChannel(channel){
    if (channel.access_media=='facebook'){
      this.getFbPosts(channel.channel_id);
      this.current_channel_id=channel.channel_id;
      this.social_select=1;
    }
    
    if (channel.access_media=='twitter'){
      this.getTwitterPosts(channel.channel_id);
      this.current_channel_id=channel.channel_id;
      this.social_select=2;
    }
    if (channel.access_media=='linkedin'){
      this.getLIPosts(channel.channel_id);
      this.current_channel_id=channel.channel_id;
      this.social_select=3;
    }
    
    if (channel.access_media=='instagram'){
      this.getInstagramPosts(channel.channel_id);
      this.current_channel_id=channel.channel_id;
      this.social_select=4;
    }
  }

  selectSocial(value){
    this.social_select= value;
  }

  thumbnailCheck(index){
    if (this.currentDisp=='Draft Posts'){
      if (this.saveArr[index].media[0]){
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  getImageFromService(img_names,mimeType,index) {
    // this.isImageLoading = true;
    
    this.digitalService.getImage(img_names,mimeType).subscribe(data => {
      // console.log("Mimetype:");
      // console.log(mimeType);
      // if (mimeType.substring(0,5)=='video'){
      //   this.createVideoFromBlob(data);
      // }
      // else{
      this.createImageFromBlob(data,index);
      // }
      // this.isImageLoading = false;
    }, error => {
      // this.isImageLoading = false;
      console.log(error);
    });
    
  }


  createImageFromBlob(image: Blob,index) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      // console.log("file in post count: "+this.file_in_post_count);
      this.image_to_show[index]=reader.result;
      // this.file_in_post_count+=1;
    }, false);

    if (image) {
      // console.log("IF=yes in createimagefromblob");
      reader.readAsDataURL(image);
    }
  }   

  // getUserDraft(){
  //     this.PFservice.getUserDraft(localStorage.getItem('current_brand_id')).then(
  //       data=>{
  //         console.log(data);
  //         this.saveArr = data;
  //         // this.saveForm.get('message').setValue(data['message']);
  //         // this.saveForm.get('media').setValue(data['media']);
  //         // this.saveForm.get('facebook').setValue(data['facebook']);
  //         // this.saveForm.get('twitter').setValue(data['twitter']);
  //         for(let index=0;index<Object.keys(this.saveArr).length;index++){
  //           this.image_to_show[index]= this.getImageFromService(this.saveArr[index].media,this.saveArr[index].mime,index);
  //         }
  //       },
  //       err=>{
  //         console.log(err);
  //         this._snackBar.open('Error in getting saved posts','Close',{
  //           duration: 5000,
  //         });
  //       }
  //     );
      
  // }

  // delUserDraft(index){
  //   var _id = this.saveArr[index]._id;
  //   this.PFservice.delUserDraft(localStorage.getItem('access_id'),_id).then(
  //     data=>{
  //       console.log(data);
  //       this._snackBar.open('Succesfully deleted posts','Close',{
  //         duration: 5000,
  //       });
  //       this.getUserDraft();  
  //       // this.showSavedPosts();
  //     },
  //     err=>{
  //       console.log(err);
  //       this._snackBar.open('Error in getting saved posts','Close',{
  //         duration: 5000,
  //       });
  //     }
  //   );
  // }

  linkedIn_get(){

    this.digitalService.linked_in_get_me(localStorage.getItem('access_id')).then( data=>
      {
        console.log(data);
        this.linked_in_acc=data['elements'];
    },
    err =>{
      console.log(err);
    }
    );
  }


  //------------------UNUSED GET SCHEDULED FB POSTS FROM DB--------
  // getScheduledFBPosts(){ //posts sent to Facebook for scheduling
  //   this.PFservice.getScheduledFB(localStorage.getItem('access_id')).then(
  //     data=>{
  //       console.log(data);
  //       this.schedArr=data;
  //       this.schedArr.map( (element,i)=>{
  //         this.schedArr[i].body= JSON.parse(element.body);
  //         if (this.schedArr[i].body.scheduled_publish_time){
  //           var sched_time =  new Date (this.schedArr[i].body.scheduled_publish_time*1000) ;//multiplied by thousand for UNIX in ms
  //           const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  //           this.schedArr[i].body.scheduled_publish_time =  sched_time.toLocaleDateString(undefined ,options)+"  "+ sched_time.toLocaleTimeString();
  //         }
  //         else{ //adjustment for sched time given in created_time for sched videos 
  //           var sched_time =  new Date (this.schedArr[i].body.created_time);
  //           const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  //           this.schedArr[i].body.scheduled_publish_time =  sched_time.toLocaleDateString(undefined ,options)+"  "+ sched_time.toLocaleTimeString();
  //         }
  //       });
  //     },
  //     err=>{
  //       console.log(err);
  //       this._snackBar.open('Error in getting Facebook scheduled posts','Close',{
  //         duration: 5000,
  //       });
  //     }
  //   );
  // }

  //fb_page_data_save
  // savePage(index){
  //   console.log(index);
  //   console.log("called Save");
  //   this.getFbPosts();
  // }
 
  saveLIPage(index){
    console.log(index);
    // if (index==0){
    //   this.getLIPosts(this.linked_in_acc[0].roleAssignee);
    //   console.log(this.linked_in_acc[0].roleAssignee);
    // }
    // else{
      this.getLIPosts(this.linked_in_acc[index].organization);
      console.log(this.linked_in_acc[index].organization);
    // }
    
  }
  

  

  

  ifPrev(){
    if (this.commonPostData && this.commonPostData['paging']['previous']){
      return true;
    }
    else {
      return false;
    }
  }
  ifNext(){
    if (this.commonPostData && this.commonPostData['paging']['next']){
      return true;
    }
    else {
      return false;
    }
  }
  prev_page(){
    console.log("prev");
  
    this.digitalService.fb_paging({link: this.commonPostData.paging.previous,channel_id: this.current_channel_id}).then(
      data=>{
        this.commonPostData=data;
        this.page_count -= 1; 
        this.postArr=data['data'];
      },
      err=>{
        console.log(err);
      }
    )
    
  }

  next_page(){
    console.log("NEXT");
    
    this.digitalService.fb_paging({link: this.commonPostData.paging.next,channel_id: this.current_channel_id}).then(
      data=>{
        this.commonPostData=data;
        this.page_count += 1; 
        this.postArr=data['data'];
      },
      err=>{
        console.log(err);
      }
    )
   
  }


  showing(param){
    if (param==1)
    {
      if (this.currentDisp="All Posts")
      {
        return true;
      }
      else {return false;}
    }
    else if (param==2)
    {
      if (this.currentDisp="Draft Posts")
      {
        console.log("dead");
        return true;
      }
      else {return false;}
    }
    else {return false;}
  }

  fbIfImage(index){
    if (this.postArr[index].full_picture){
      return true;
    }
    else{
      return false;
    }
  }

  twitterIfImage(index){
    if (this.tweetArr[index].entities.media){
      return true;
    }
    else{
      return false;
    }
  }

  showSocialposts(){
    this.currentDisp="All posts";
    //this.getTwitterPosts();
    //this.dispArr = this.postArr;
    this.showingSocial= true;
    this.showingSaved=false;
    this.showingSched=false;
  }
  showSavedPosts(){
    this.currentDisp="Draft Posts";
    console.log("Showing saved");
    this.dispArr= this.saveArr;
    this.showingSocial= false;
    this.showingSaved= true;
    this.showingSched=false;
  }

  showSchedPosts(){
    //this.getScheduledFBPosts();
    this.currentDisp="Scheduled Posts";
    console.log("Showing Scheduled");
    this.dispArr= this.schedArr;
    this.showingSocial= false;
    this.showingSaved= false;
    this.showingSched=true;
  }

  loadSavedPost(index){
    
    this.digitalService.setSavedPostData(this.saveArr[index]);
    this.router.navigateByUrl('/create-post');
    
  }
  openDialog(index) {
    this.dialog.open(PostInsightComponent, {data: {post_id: this.postArr[index].id, channel_id: this.current_channel_id}});

  }

  DeleteConfirm(index) {
    const dialogRef =  this.dialog.open(Draftpostdelete, {data: {index: index}});  
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        console.log('The dialog was closed');
        // this.delUserDraft(result.index)
      }
    });
  }

  RightSidenavPostmngClose()
  {
    document.getElementById("right-sidenav-postmng").style.width = "0";
    document.getElementById("overlay").style.display = "none";
  }
  
  delete_twitter(data,channel){
    this.spin = true
    this.digitalService.delete_posttweet(channel,data.id_str).then(
      data=>{
        this.spin = false
        this.getTwitterPosts(channel)
      },
      err=>
      {
        this.spin = false
        console.log(err);
      }
    )
  }
  

  delete_fb(data,channel){
    this.isLoading = true
    if (confirm('Are you sure to delete this post?')) {
      var params = {channel_id: channel, post_id : data.post_id}
      this.digitalService.delete_post(params).then(
        data=>{
          console.log(data)
          this.isLoading = false
          this.getFbPosts(channel)
          this._snackBar.open(data['msg'],'Close',{
            duration: 5000,
          });
        },
        err=>
        {
          this.isLoading = false
          console.log(err);
          this._snackBar.open(err,'Close',{
            duration: 5000,
          });
        }
      )    
    }
  }

}

@Component({
  selector: 'post-insight',
  templateUrl: 'post-insight.component.html',
  styleUrls: ['./post-management.component.css']
})
export class PostInsightComponent {
  constructor(public dialogRef: MatDialogRef<PostInsightComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private digitalService: DigitalService
    ) {}
    params = {post_id: this.data.post_id, channel_id: this.data.channel_id};
    result;
    reacts;
    like;
    reach;
    engagement;
    comment_count;
    share_count;

    ngOnInit() {
      this.getFbPostInsights()
    }


    getFbPostInsights(){
      
      this.digitalService.fb_get_post_insights(this.params).then(
        data=>{
          console.log(JSON.parse(data[1].body));
          this.result = JSON.parse(data[0].body).data;
          this.reacts = this.result[0].values[0].value;
          this.like = this.result[0].values[0].value.like;
          this.reach = this.result[1].values[0].value;
          this.engagement = this.result[2].values[0].value;
          this.comment_count= JSON.parse(data[1].body).comments.summary.total_count;
          this.share_count = JSON.parse(data[1].body).shares;
        },
        err=>{
          console.log(err);
        }
      );
      
    }

    onNoClick(): void {
      this.dialogRef.close();
    }
  
}


@Component({
  selector: 'draftpostdelete',
  templateUrl: 'draftpostdelete.component.html',
})
export class Draftpostdelete {

  constructor(
    public dialogRef: MatDialogRef<Draftpostdelete>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData1) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  

}