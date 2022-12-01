import { Component, OnInit, Inject,ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators,AbstractControl,FormArray,ValidationErrors } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { ManagerService } from"../../../manager.service";
import { Router } from '@angular/router';
import { BaseComponent } from '../../base/base.component';

//import  {PlatformService} from  '../../../digitalservices/platform.service';
import { DigitalService } from '../../../digital.service';
import * as io from 'socket.io-client';
@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements OnInit {
  userlist = []
  connection_info = null
  currenrchatusername = ''
  currentchatuserid = ''
  currentchatlist = []
  chatForm : FormGroup;
  memberForm : FormGroup;
  updateForm : FormGroup;
  loadingfile = false
  loading = false
  attachfilelink = ''
  send_id;
  assignagent = [];
  chat_media;
  socket;
  all_channels = []
  access_media;
  isagent = false
  islead = false
  token
  loop = false
  all_chat_user = [];
  all_chat_user_new = [];
  //all_chat_user_live:any
  all_chat_user_archive = [];
  all_chat_details:any
  chat_user:any
  textareaValue = ''
  chat_id = 0
  media_path=environment.media_path;
  previews
  file_type
  angentselected = ''
  isload = false
  constructor(public dialog: MatDialog,private formBuilder: FormBuilder,private _snackBar: MatSnackBar,private managerservice: ManagerService,private router: Router,
    private PFService: DigitalService,@Inject(FormBuilder) fb: FormBuilder,private basecomponent: BaseComponent) {
      this.chatForm = fb.group({
        message: [''],
        senderid:[''],
        receiverid:[''],
        token: [''],
        attachment: [''],
        attachmentType: [''],
      });
      this.updateForm = fb.group({
        first_name: ['',Validators.required],
        email: [''],
        mobile:['',Validators.required],
        website:[''],
        city: [''],
        description: [''],
      });
     }


  async ngOnInit() {
    var userid = localStorage.getItem('access_id');
    this.getrole()

    this.basecomponent.chatincomingObservable.subscribe((res) => {
      console.log('chatdata',JSON.parse(res.chatdata))
      this.getChatUserNew();
      this.getChatUserArchive();
      this.getChatdetails(res.chatid,JSON.parse(res.chatdata))
      var incomingaudioObj = new Audio();
      incomingaudioObj.src = 'assets/sounds/message_tone.mp3'
      incomingaudioObj.play();
    });

    //await this.getChatUser();
    // this.getChatUserNew();
      //await this.getCahtUserLive();
    //await this.getCahtUserArchive();
      //getCahtUserArchive
    // this.get_system_user_assign_lead()
    // this.getChatMembers('100984188367500')
    this.memberForm = this.formBuilder.group({
      agent_id:[''],
      u_id:[''],
      chat_id:['']
    });
    
    this.accesssetting();
    // this.socket = io(environment.CHAT_SOCKET_ENDPOINT, {
    //   query: {
    //     token: localStorage.getItem('access_id')
    //   }
    // });
    // // this.socket.emit('onClientMsg', { user: '88', msg:'dfsd' })
    // this.socket.on('message_list', (data) => {
    //   console.log('message_list',data)
    //   console.log("DATA HERE")
    //   //this.ngOnInit();
    //   //this.getChatdetails(this.chat_id,this.chat_user);
    //   //this.openchat(data.senderPsid,'a',0)
    // });
    // this.socket.emit('my message', 'Hello there from Angular.');
    // this.socket.emit('onClientMsg' , 'hey')
    //this.getChatdetails(this.chat_id,this.chat_user);
  }

  doTextareaValueChange(ev) {
    console.log(ev.target.value)
    try {
      this.textareaValue = ev.target.value;
    } catch(e) {
      console.info('could not set textarea-value');
    }
  }

  getchannelsAll(){
    var data_n = {'brand_id':localStorage.getItem('current_brand_id')}
    this.PFService.get_channels_all(data_n).then(
      data1 => {
        console.log('getchannelsAll',data1);
        var data = data1['data']
        data.forEach(element => {
          if(element.access_media == 'facebook'){
            this.all_channels.push(element)
          }
          if(element.access_media == 'instagram'){
            this.all_channels.push(element)
          }
        });
        console.log("getchannelsAll");
        
        console.log(this.all_channels);
        this.loop = false
        
        this.all_channels.forEach(async(element) => {
          console.log(this.loop)
          if(this.loop == false){    
            this.chat_media = element.access_media
            this.send_id = element.page_id
            this.access_media = element.access_media
            this.token = element.token 
            console.log(element.access_media);
             
            if(element.access_media == 'facebook'){
              console.log(element.access_media);
              // this.getChatMembers(element.page_id)
              var data = {channelid:element.page_id}
              await this.PFService.getChatMembers(data).then(
                async data => {
                  console.log('fb'+element.page_id);
                  console.log(data['data']);
                  if(this.loop == false){
                    var chatmembers = data['data']
                    this.userlist = chatmembers
                    if(data['data'].length > 0 && this.loop == false){
                      this.loop = true
                      await this.openchat(chatmembers[0].sendepsid,chatmembers[0].firstName+' '+chatmembers[0].lastName,0)
                      return
                    }else{
                      this.loop = false
                    }
                  }
                },
                err => {
                  console.log('error');
                }
              );
            }
            else{
              // this.getChatMembers_instagram(element.page_id)
              console.log(element.access_media);
              var data = {channelid:element.page_id}
              await this.PFService.chatmemberlist_insta(data).then(
                async data => {
                  console.log('insta'+element.page_id);
                  console.log(data['data']);
                  console.log(this.loop);
                  if(this.loop == false){
                    var chatmembers = data['data']
                    this.userlist = chatmembers
                    if(data['data'].length > 0){
                     await this.openchat(chatmembers[0].sendepsid,chatmembers[0].firstName+' '+chatmembers[0].lastName,0)
                      this.loop = true
                      return
                    }else{
                      this.loop = false
                    }
                  }
                },
                err => {
                  console.log('error');
                }
              );
            }
          }
              
        });
      },
      err=> {}
    )
  }

  

  createassign(){
    console.log('currentchatuserid',this.chat_id);
    this.memberForm.get('chat_id').setValue(this.chat_id)
    let data: any = Object.assign(this.memberForm.value);
    console.log(data);
    this.PFService.assign_chat(data).then(
      data2 =>{
        console.log('chat');
        
        console.log(data2)
        this._snackBar.open(data2['data'],'Close',{
          duration: 5000,
        })
        this.get_system_user_assign_lead()
      }
    )
    
  }

  async getChatMembers(cid) {
    var data = {channelid:cid}
    await this.PFService.getChatMembers(data).then(
      data => {
        console.log(data['data'].length);
        var chatmembers = data['data']
        this.userlist = chatmembers
        if(data['data'].length > 0){
          this.openchat(chatmembers[0].sendepsid,chatmembers[0].firstName+' '+chatmembers[0].lastName,0)
        }
      },
      err => {
        console.log('error');
      }
    );
  }

  async openchat(senderid,sendername,index){
    console.log('senderid',senderid);
    this.memberForm.reset(); // or form.reset();
    this.currentchatuserid = null
    console.log(senderid,sendername,index)
   // console.log(this.userlist[index].agent_id)
   
    this.memberForm = this.formBuilder.group({
      //agent_id:[this.userlist[index].agent_id],
      chat_id:['']
    })
    
    this.currenrchatusername = sendername
    this.currentchatuserid = senderid
    var data = {senderid:senderid}
    this.chatForm.get('receiverid').setValue(senderid)
    await this.PFService.getMemberChatList(data).then(
      data => {
        console.log(data['data']);
        this.currentchatlist = data['data']
        this.connection_info = this.userlist[index]
        /*
        this.updateForm.get('mobile_number').setValue(this.connection_info.mobile_number)
        this.updateForm.get('email').setValue(this.connection_info.email)
        this.updateForm.get('website').setValue(this.connection_info.website)
        this.updateForm.get('city').setValue(this.connection_info.city)
        this.updateForm.get('description').setValue(this.connection_info.description)
        */


      },
      err => {
        console.log('error');
      }
    );
  }

  async sendmessage(){
    console.log(this.send_id);
    this.loadingfile = true
    if(this.chatForm.invalid == true)
    {
      console.log('sendMessage_if',this.chatForm.value);
      this.loadingfile = false
      return;
    }
    else
    {
      console.log('sendMessage_else',this.chatForm.value);
      let data: any = Object.assign(this.chatForm.value);
      console.log(data)
      // if(data.message == null){
      //   data.message = ''
      // }
      data.message = this.textareaValue
      data.channel_media = this.chat_media
      data.senderid = this.send_id
      //data.token = this.token
      data.receiverid =  this.send_id
      await this.PFService.sendchatmessage(data).then(
        data => {
          //console.log(data);
          this.loadingfile = false
          //this.chatForm.reset()
          this.textareaValue = ''
          this.chatForm.get('message').setValue('')
          this.chatForm.get('attachment').setValue('')
          this.chatForm.get('attachmentType').setValue('')
          this.chatForm.controls['message'].reset()
          this.attachfilelink = ''
          this.previews=''
          this.file_type=''
          if(data){
            this.openchat(this.send_id,this.currenrchatusername,0)
            //this.ngOnInit();
            this.getChatdetails(this.chat_id,this.chat_user)
          }
        },
        err => {
          console.log('error');
          this.loadingfile = false
        }
      );
    }
  }

  uploadattachnent(element){
    const file: File = element.target.files[0];
    // console.log('size', file.size);
    // console.log('type', file.type);
    // console.log("Called Upload");
     console.log('file_type',file.type);
    if(file.type=='image/jpeg' || file.type=='image/gif' || file.type=='image/png' || file.type=='video/mp4' || file.type=='application/pdf' || file.type=='application/vnd.openxmlformats-officedocument.presentationml.presentation'){
      this.loadingfile = true
      var formData = new FormData();
      // formData.append('brand_id', localStorage.getItem('current_brand_id') );
      // formData.append('file', element.target.files[0], localStorage.getItem('current_brand_id') );
      formData.append('name',element.target.files[0].name)
      formData.append('file', element.target.files[0],localStorage.getItem('current_brand_id'));
      formData.append('user_id',localStorage.getItem('access_id') )
      this.PFService.file_upload(formData).then(
        data=>{
          // let response = JSON.parse(data); //success server response
          console.log('file_upload',data);
          if(data['filePath']){
            this.previews = `${this.media_path}`+data['filePath']
            this.attachfilelink = this.previews //data['link']
            this.chatForm.get('attachment').setValue(this.previews)
            this.chatForm.get('attachmentType').setValue(data['file_type'])
            this.file_type=this.getFileType(file);
          }
          //console.log('file_type',this.file_type);
          this.loadingfile = false
          this._snackBar.open(data['msg'],'Close',{
            duration: 5000,
          });
        },
        err=>{
          this.loadingfile = false
          console.log(err);
          this._snackBar.open('Something went wrong.please try again!','Close',{
            duration: 5000,
          });
        }
      )
    }else{
      this.loadingfile = false
      this._snackBar.open('File format invalid!','Close',{
        duration: 5000,
      });
    }
  } 


  async getChatMembers_instagram(cid) {
    var data = {channelid:cid}
    await this.PFService.chatmemberlist_insta(data).then(
      data => {
        console.log(data['data']);
        var chatmembers = data['data']
        this.userlist = chatmembers
        if(data['data'].length > 0){
          this.openchat(chatmembers[0].sendepsid,chatmembers[0].firstName+' '+chatmembers[0].lastName,0)
        }
      },
      err => {
        console.log('error');
      }
    );
  }


  async update_connection(){
    let data: any = Object.assign(this.updateForm.value);
    data.chat_id = this.chat_id;
    console.log('data',data);
    await this.PFService.update_message_user(data).then(
      data => {
        console.log(data);
        this._snackBar.open(data['msg'],'Close',{
          duration: 5000,
        })
      },
      err => {
        console.log('error');
      }
    );
  }

  async cancel_connection(){
   // this.updateForm.reset(); // or form.reset();
  }


  async get_system_user_assign_lead() {
    await this.PFService.get_system_user_assign_lead().then(
      data => {
        //console.log(data['data'])
        this.assignagent = data['data']
      },
      err => {
        console.log('error');
      }
    );
  }

  async getrole(){
   await this.PFService.getRole(localStorage.getItem('access_id')).then(
      data => {
        console.log(data['data'])
        //this.getchannelsAll()
        if (data['data']['account_type'] == '1') {
          this.isagent = true
        }
        this.getChatUserNew();
        this.getChatUserArchive();
        this.get_system_user_assign_lead()
      },
      err => {
        console.log('error');
      }
    );
  }
  async getChatUser(){
    await this.PFService.getChatUser(localStorage.getItem('access_id')).then(
      data => {
        console.log('getChatUser',data['data']);
        this.all_chat_user = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  async getChatUserNew(){
    await this.PFService.getChatUserNew(localStorage.getItem('access_id')).then(
      data => {
        //console.log('getChatUser',data['data']);
        this.all_chat_user_new = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  /*
  async getCahtUserLive(){
    await this.PFService.getCahtUserLive(localStorage.getItem('access_id')).then(
      data => {
        console.log('getChatUser',data['data']);
        this.all_chat_user_live=data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  */
  async getChatUserArchive (){
    await this.PFService.getChatUserArchive(localStorage.getItem('access_id')).then(
      data => {
        //console.log('getChatUser',data['data']);
        this.all_chat_user_archive = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  onTabClick(event) {
    //console.log(event);
    var currentab = event.tab.textLabel;
    console.log(currentab);
    if(currentab=='new'){
      this.getChatUserNew();
    }
    if(currentab=='archive'){
      this.getChatUserArchive()
    }
  }

  getChatdetails(chat_id,chat_user){
    this.loading = true
    var data = {chat_id:chat_id}
    this.chat_id = chat_id
    this.PFService.getChatdetails(data).then(
      data => {
        console.log('getChatUser',data['data']);
        chat_user = data['chatuser']?data['chatuser']:chat_user;
        console.log('chat_user',chat_user);
        this.chat_user = chat_user;
        console.log('sender-id',chat_user.sender_id);
        this.send_id = chat_user.sender_id;
        this.chat_media = chat_user.channel_type;
        this.token = chat_user.accessToken;
        this.all_chat_details = data['data'];
        this.loading = false
        //
        console.log('chat_user_mobile',chat_user.agent_id);
        this.updateForm.get('first_name').setValue(this.chat_user.first_name)
        this.updateForm.get('mobile').setValue(this.chat_user.mobile)
        this.updateForm.get('email').setValue(this.chat_user.email)
        this.updateForm.get('website').setValue(this.chat_user.website)
        this.updateForm.get('city').setValue(this.chat_user.city)
        this.updateForm.get('description').setValue(this.chat_user.description)
        this.angentselected ='';
        if(this.chat_user.agent_id){
          this.angentselected= this.chat_user.agent_id
          //this.memberForm.get('agent_id').setValue(this.chat_user.agent_id)
        }
        if(this.chat_user.lead_id>0){
          this.islead = true
        }    
      },
      err => {
        console.log('error');
        this.loading = false
      }
    );
  }

  getFileType(file) {
    if(file.type.match('image.*'))
      return 'image';
  
    if(file.type.match('video.*'))
      return 'video';
  
    if(file.type.match('audio.*'))
      return 'audio';
    // etc...
    return 'other';
  }

  async add_lead(){
    let data: any = Object.assign(this.updateForm.value);
    data.chat_id = this.chat_id;
    console.log('data',data);
    this.isload = true
    await this.PFService.add_lead(data).then(
      data => {
        this.isload = false
        this._snackBar.open(data['data'],'Close',{
          duration: 5000,
        })
        //this.ngOnInit();
      },
      err => {
        this.isload = false
        console.log('error');
      }
    );
  }
  isValidURL(string) {
     
  };
  async accesssetting() {
    var userid = localStorage.getItem('access_id');

    await this.managerservice.getManagerDetail(userid).then(
      data => {
      
        var services = JSON.parse(data['data']['services']);
        console.log(services);

        if(services.includes('15')){
            
        }else{ 
          this.router.navigate(['/dashboard']);

        }
        // if (services.length > 0) {
        //   for (var i = 0; i < services.length; i++) {
        //     if (services[i] == '15') {
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
  moveToarchive(chat_user){
    if(confirm('Are you sure to archive this chat?')){
      this.PFService.movetoarchive(chat_user.chat_id).then(
        data => {
          this._snackBar.open(data['msg'],'Close',{
            duration: 5000,
          })
          this.ngOnInit();
        },
        err => {
          console.log('error');
        }
      );
    }
  }

  leaddetailpage(){
    var leadid = this.chat_user.lead_id
    this.router.navigateByUrl('/lead-details/'+leadid);
  }

  mediaPreview(media) {
    console.log(media);

    const dialogRef = this.dialog.open(ChatimagePreviewComponent, {
      width: '450px', data: { media_obj: media }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}

//IMAGE PREVIEW COMPONENT
@Component({
  selector: 'app-chat-message',
  templateUrl: 'image_preview.component.html',
})
export class ChatimagePreviewComponent {
  media_link;
  media_type;
  img_base_path;
  media_path=environment.media_path;
  constructor(
    public dialogRef: MatDialogRef<ChatimagePreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageData) { console.log(data) }

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
    
  ngOnInit() {
    console.log(this.data);
    this.media_type = 'image';
    this.img_base_path = this.data['media_obj'];
    var checkpath = this.doesFileExist(this.img_base_path)
    console.log(checkpath);
    console.log(this.media_type);
    if(checkpath){

    }else{
      this.img_base_path = './assets/img/notfound.jpeg';
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
