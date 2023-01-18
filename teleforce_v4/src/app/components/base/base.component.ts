import { Component, OnInit, ElementRef, ViewChild,HostListener } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from "@angular/router";
import { ManagerService } from "../../manager.service";
import { UserService } from "../../user.service";
import { SocketioService } from '../../socketio.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable, timer,Subject } from "rxjs";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CallQueueComponent } from '../call-queue/call-queue.component'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CallHistoryComponent } from '../call-history/call-history.component';
import { GenerateContactComponent } from '../generate-contact/generate-contact.component';
import { ShareWhatsappComponent } from '../share-whatsapp/share-whatsapp.component';
import { CallTransferComponent } from '../call-transfer/call-transfer.component';
import { ContactInformationComponent } from '../contact-information/contact-information.component';
import { FeedbackFormFillComponent } from '../feedback-form-fill/feedback-form-fill.component';
import { AdminService } from "../../admin.service";
// import { UA, Socket, WebSocketInterface } from 'jssip';
import { ScheduleMeetingComponent } from '../schedule-meeting/schedule-meeting.component';
import { IdleTimeoutManager } from "idle-timer-manager";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ErpService } from './../../erp.service';
import { TicketRaisedComponent } from '../ticket-raised/ticket-raised.component';

const counter = timer(0, 1000);

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {
  @HostListener('window:beforeunload', [ '$event' ])
  async beforeUnloadHandler(event: Event) {
    event.preventDefault(); 
    //return event. = "Are you sure you want to exit?";
    //console.log("window:beforeunload");
    //await this.voipunregister()
    if(this.session != undefined)
      this.callhangup()
  }
  // @HostListener('window:unload', [ '$event' ])
  // unloadHandler(event: Event) {
  //   console.log("window:unload");
  //   var voipstatus = localStorage.getItem('voipstatus')
  //   if (voipstatus == 'true') {   
  //     this.voipunregister()
  //   }
  // }
  public clock;
  @ViewChild('scbtn') scbtn: ElementRef;
  AllowAccess = false;
  UserData = {
    username: '',
    role: ''
  };
  isHidden =false
  is_supervisor_only=false;
  custom_api=false;
  ivr = false;
  clicktocall = false;
  conference = false;
  campaign = false;
  obdcampaign = false;
  misscall = false;
  dialer = false;
  bulksms = false;
  zoho = false;
  lms = false;
  voicemail = false;
  status;
  leadstatus;
  zohoenable = false
  uname = ''
  scheduledata = {}
  planexpiredate = null;
  socket;
  callpopup = false
  callqueue = false
  callernumber = ''
  show_no_id = 0;
  callername = ''
  calleremail = ''
  callaction = ''
  calltype = ''
  timercount = 0;
  callForm: FormGroup
  callduration = ''
  totalcallqueue = 0
  callpopupmin = false
  managerid = '';
  notifications = [];
  callschedule = true
  feedbackformid = 0;
  minutetype = 0;
  isvoipsupport = false
  isvoipenable = false
  dialerform: FormGroup;
  tfPhone: any
  session: any
  callControl = true
  iscurrentcall = false
  isincomingcall = false
  callinfotext = ''
  callinfonumber = ''
  webrtcstatus = ''
  feedbaclvalues = []
  timer: any
  interval
  monitoragent = 0
  Lead_data;
  save_bt = false
  dialpademini: boolean = false;
  obdbalance = 0
  reasonArr = []
  selected_reason = false
  reason_value;
  color_bt = false
  callleadid = 0
  showid = false;
  whatsupaccess = false;
  callrunning = false
  mic_permission=false;
  settings = {}
  voipdomain = 'sbc2.(wrong)cloudX.in'
  socketdomain = 'socket.(wrong)cloudX.in'
  issupervisor = false
  userrole = 'agent'
  iswhatsappbutton=false;
  isfeedbackbutton=false;
  ismeetingbutton=false;
  istransfer=false;
  iscallhistory=false;
  iscreatecontact=false;
  chat =false;
  sms=false;
  email=false;
  digital=false;
  media_libaray=false;
  private ChatIncoming = new Subject<any>();
  chatincomingObservable = this.ChatIncoming.asObservable();
  contactArr = []
  constructor(
    public authService: AuthService,
    private router: Router,
    private managerservice: ManagerService,
    private adminservice: AdminService,
    private userservice: UserService,
    private socketService: SocketioService,
    private _snackBar: MatSnackBar,
    public fb: FormBuilder,
    public dialog: MatDialog,
    private http: HttpClient,
    public AuthService: ErpService
  ) {
  }
  Minidialpad() {
    this.dialpademini = !this.dialpademini;
  }
  ngOnInit(): void {
    this.loadScript('./assets/vendor/jquery/jquery.min.js');
    // this.loadScript('./assets/bootstrap/js/bootstrap.bundle.min.js');
    // this.loadScript('./assets/jquery-easing/jquery.easing.min.js');
    this.loadScript('./assets/js/sb-admin-2.min.js');
    //this.loadScript('./assets/js/move-drag.js');
    this.accesssetting();

    if (this.authService.isLoggedIn) {
      this.get_lead_stage_status()
      this.getNotifications()
      this.uname = localStorage.getItem('username');
      if (localStorage.getItem('username')) {

      }
      this.UserData.username = localStorage.getItem('username');
      if (localStorage.getItem('username') === 'undefined') {
        this.UserData.username = localStorage.getItem('user');
      }

      this.authService.getRole(localStorage.getItem('access_id')).then(
        data => {
          if(data['data']){
            this.UserData.role = data['data']['account_type'];
            this.voipdomain = data['data']['voipurl']!=''?data['data']['voipurl']:this.voipdomain;
            this.socketdomain = data['data']['sockerurl']!=''?data['data']['sockerurl']:this.socketdomain;
            if (this.UserData.role == '2') {
              this.getManagerDetail(localStorage.getItem('access_id'));
              this.checkkyc(localStorage.getItem('access_id'));
              this.feedback_list(localStorage.getItem('access_id'))
            }
            if (this.UserData.role == '1') {
              this.getAgentDetail(localStorage.getItem('access_id'));
              this.feedback_list(localStorage.getItem('access_id'))

              var voipstatus = localStorage.getItem('voipstatus')
              if(localStorage.getItem('agent_role')=='supervisor'){
               this.isHidden =true
              }else{
                this.isHidden=false
              }

              if (voipstatus == 'true') {
                this.isvoipenable = true
                this.callpopupmin = true
                this.callpopup = true
              }
              this.dialerform = this.fb.group({
                number: ['', Validators.required],
              });              
            }
            if (this.UserData.role == '1' || this.UserData.role == '2') {
              this.socket = io('https://'+this.socketdomain+'/', {
                query: {
                  token: localStorage.getItem('access_id')
                }
              });
              this.socket.on('callincoming', (data) => {
                //console.log(this.callrunning)
                if (this.callrunning) { } else {
                  this.timercount = 0
                  //console.log(data);
                  this.callpopup = true
                  this.callernumber = data.from
                  if (this.showid) {
                    this.callernumber = data.id;//"TF" + this.callernumber.substring(4, 3) + "3" + this.callernumber.substring(1, 3) + "2" + this.callernumber.substring(7, 3) + "1" + this.callernumber.substring(10, 3)
                  }
                  if(Number(data.fromname)){
                    this.callername = '';
                  }else{
                    this.callername = data.fromname
                  }
                  
                  this.calleremail = data.email
                  this.callaction = 'incoming'
                  this.calltype = data.type
                  this.callForm.get('callrefid').setValue(data.id)
                  this.callForm.get('calldesc').setValue('')
                  this.callForm.get('callresult').setValue('')
                  this.callForm.get('callleadid').setValue(data.leadid)
                  //this.isincomingcall = true
                  this.callControl = false
                  if (data.leadid > 0) {
                    this.callleadid = data.leadid
                    this.router.navigate(['/lead-details/' + data.leadid]);
                  } else {
                    this.callleadid = 0
                  }
                  //Contact Info
                  if(data.conid!=''){
                    this.getContactDetail(data.conid)
                  }
                }
              });
              this.socket.on('callanswer', (data) => {
                //console.log(data);
                // counter.subscribe(() => {
                //   this.time();
                // });
                this.interval = setInterval(() => {
                  this.time();
                }, 1000)
                this.callpopup = true
                this.callernumber = data.from
                if (this.showid) {
                  this.callernumber = data.id;//"TF" + this.callernumber.substring(4, 3) + "3" + this.callernumber.substring(1, 3) + "2" + this.callernumber.substring(7, 3) + "1" + this.callernumber.substring(10, 3)
                }
                this.callername = data.fromname
                this.calleremail = data.email
                this.callaction = 'answer'
                this.calltype = data.type
                this.feedbackformid = data.feedbackformid
                this.callForm.get('callrefid').setValue(data.id)
                this.iscurrentcall = true
                this.isincomingcall = false
                this.callControl = false
                //this.get_mobile_erp(data.from)
                //this.callpopupmin = true
                //Contact Info
                if(data.conid!=''){
                  this.getContactDetail(data.conid)
                }
              });
              this.socket.on('calldial', (data) => {
                this.timercount = 0
                //console.log(data);
                this.callpopup = true
                this.callernumber = data.from
                if (this.showid) {
                  this.callernumber = data.id;//"TF" + this.callernumber.substring(4, 3) + "3" + this.callernumber.substring(1, 3) + "2" + this.callernumber.substring(7, 3) + "1" + this.callernumber.substring(10, 3)
                }
                this.callername = data.fromname
                this.calleremail = data.email
                this.callaction = 'dial'
                this.calltype = data.type
                this.feedbackformid = data.feedbackformid
                this.callForm.get('callrefid').setValue(data.id)
                this.callForm.get('calldesc').setValue('')
                this.callForm.get('callresult').setValue('')
                this.callForm.get('callleadid').setValue(data.leadid)
                if (data.leadid > 0) {
                  this.callleadid = data.leadid
                  this.router.navigate(['/lead-details/' + data.leadid]);
                } else {
                  this.callleadid = 0
                }
                //Contact Info
                if(data.conid!=''){
                  this.getContactDetail(data.conid)
                }
              });
              this.socket.on('callend', (data) => {
                clearInterval(this.interval);
                this.totalduration();
                //this.callDiscontinue()
                this.timercount = 0
                this.callpopup = true
                this.callernumber = data.from
                if (this.showid) {
                  this.callernumber = data.id;//"TF" + this.callernumber.substring(4, 3) + "3" + this.callernumber.substring(1, 3) + "2" + this.callernumber.substring(7, 3) + "1" + this.callernumber.substring(10, 3)
                }
                this.callername = data.fromname
                this.calleremail = data.email
                this.callaction = 'end'
                this.calltype = data.type
                this.feedbackformid = data.feedbackformid
                this.callForm.get('callrefid').setValue(data.id)
                this.callControl = true
                this.iscurrentcall = false
                this.isincomingcall = false
                //this.contactArr = []
              });
              this.socket.on('agentcallqueue', (data) => {
                this.callqueue = true
                this.totalcallqueue = data.totalcall
        
              })
              this.socket.on('agentcallschedule', (data) => {
                //console.log(data);
                this.callschedule = true
                this.scheduledata = data
                this.scbtn.nativeElement.click();
              });
              this.socket.on('logout', (data) => {
                //console.log(data);
                this.logout()
              })
              //Chat Socket
              this.socket.on('chatincoming', (data) => {
                this.ChatIncoming.next(data);
              })
            }
            if(data['data']['agent_type']==2){
              this.userrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent'
              this.issupervisor = true
              if(this.userrole=='supervisor'){
                this.isvoipenable = true
                this.callpopup = false
              }
            }
            if(data['data']['agent_type']==2 && data['data']['supervisor_only']==1){
              this.userrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent'
              this.issupervisor = true
             this.is_supervisor_only =true;
              if(this.userrole=='supervisor'){
                this.isvoipenable = false
                this.callpopup = false
              }
            }
          }
        }).catch(function (error) {
          //console.log('fdsfdsfd=======')
          localStorage.removeItem('access_token');
          localStorage.removeItem('access_id');
          localStorage.removeItem('username');
          localStorage.removeItem('secret');
          localStorage.removeItem('feedback');

          window.location.href = '/signin';
        });

      //Agent socket
      this.callForm = this.fb.group({
        callrefid: [''],
        callconid: [''],
        calldesc: [''],
        callresult: [''],
        callscheduledate: [''],
        status: [''],
        callleadid: [''],
      });
      
      // this.socketService.setupSocketConnection(); 
      // this.socketService.SchedulecallObservable.subscribe((res) => {
      //   console.log(res+'dsd')
      //   this.scheduledata = res
      //   this.scbtn.nativeElement.click();
      // });   
      if (this.session && this.session.isEnded()) {
        this.callControl = true
        this.iscurrentcall = false
        this.isincomingcall = false
      }
      this.loadScript('./assets/js/move-drag.js');
      this.getReasonData()
      // this.getCallStopTime()
    }
  }
  ngOnDestroy() {
    this.timer.clear();
  }

  copyToClipboard(item) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    this._snackBar.open('copied!', '', {
      duration: 2000, verticalPosition: 'top'
    });
  }

  async getContactDetail(contid) {
    await this.userservice.getcontactdata(contid).then(
      data => {
        if(data['data']){
          this.contactArr = data['data'];
        }
        console.log(this.contactArr)
      },
      err => {
        console.log('error');
      }
    );
  }

  async accesssetting() {
    var userid = localStorage.getItem('access_id');

       await this.userservice.accesssetting(userid).then(
         data => {
          //console.log("Setthing",data["data"]);
          if(data['data'].length>0){
            if(data["data"][10]["setting_value"]==1){
              this.iswhatsappbutton=true;
            }
            if(data["data"][11]["setting_value"]==1){
              this.isfeedbackbutton=true;
            }
            if(data["data"][12]["setting_value"]==1){
              this.ismeetingbutton=true;
            }
            if(data["data"][13]["setting_value"]==1){
              this.istransfer=true;
            }
            if(data["data"][14]["setting_value"]==1){
              this.iscallhistory=true;
            }
            if(data["data"][15]["setting_value"]==1){
              this.iscreatecontact=true;
            }
          }
         },
         err => {
           console.log('error');
         }
       );
     }
  async getReasonData() {
    let id = localStorage.getItem('access_id');
    await this.userservice.getReasonData(id).then(
      data => {
        this.reasonArr = data['data'];
      },
      err => {
        console.log('error');
      }
    );

  }

  time() {
    this.clock = ''
    this.timercount += 1
    let date = new Date();
    // let second: number | string = date.getSeconds();
    // let minute: number | string = date.getMinutes();
    // let hour: number | string = date.getHours();
    let minute = Math.floor(this.timercount / 60);
    let second = this.timercount - minute * 60;

    // if (second < 10) {
    //   second = "0" + second;
    // }
    // if (minute < 0) {
    //   minute = "0" + minute;
    // }
    this.clock = minute + ":" + second;
    //console.log(this.clock)

  }
  totalduration() {
    let date = new Date();
    // let second: number | string = date.getSeconds();
    // let minute: number | string = date.getMinutes();
    // let hour: number | string = date.getHours();
    let minute = Math.floor(this.timercount / 60);
    let second = this.timercount - minute * 60;

    // if (second < 10) {
    //   second = "0" + second;
    // }
    // if (minute < 0) {
    //   minute = "0" + minute;
    // }
    this.callduration = minute + ":" + second;
  }
  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }
  onActivate(event) {
    window.scroll(0, 0);
    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)
  }

  logout() {
    var voipstatus = localStorage.getItem('voipstatus')
    if (voipstatus == 'true') {
      this.voipunregister()
    }
    this.authService.userlogout().then(
      data => {
        setTimeout(() => {
          window.location.href = '/signin';
        }, 500)
      },
      err => {
        console.log('logout error');
      })
    //window.location.href = '/signin';
  }

  clicktoschedulecall(agentid, mobile) {
    if (confirm("Are you sure to call ?")) {
      var voipstatus = localStorage.getItem('voipstatus')
      if (voipstatus == 'true') {
        this.voipcall(mobile)
      } else {
        this.userservice.agentOutgoingCall(agentid, mobile).then(
          data => {
            if (data['err'] == false) {
              this._snackBar.open(data['msg'], '', {
                duration: 2000, verticalPosition: 'top'
              });
            }
          },
          err => {
            console.log('error');
          }
        );
      }
    }
  }
  async getManagerDetail(managerid) {
    this.managerid=managerid;
    if (managerid == 1556) {
      setInterval(() => {
        this.checkwhitelistip(managerid)
      }, 500000);
    }
    // if(managerid==945){
    //   var timeout = 360
    // }else if(managerid==1556){
    //   var timeout = 7200
    // }
    // else{
    //   var timeout = 1800
    // }
    await this.managerservice.getManagerDetail(managerid).then(
      data => {
        // this.timer = new IdleTimeoutManager({
        //   timeout: timeout, //expired after 10 secs
        //   onExpired: () => {
        //     console.log("Expired");
        //     this.logout()
        //   }
        // });
        var settingsArr = data['settings']
        //console.log(this.settings);
        if(settingsArr.length > 0){
          var that = this
          settingsArr.map(function(elem){
            var name = elem.setting_name
            that.settings[name] = elem.setting_value
          });
        }
        //console.log(this.settings);
        var services = JSON.parse(data['data']['services']);
        localStorage.setItem('timezone', data['data']['timezone']);
        this.ivr = false;
        this.misscall = false;
        this.dialer = false;
        this.conference = false;
        this.clicktocall = false;
        this.campaign = false;
        this.obdcampaign = false;
        // console.log("feedback_vales");
        // console.log(data['data']['feedback_vales']);
        this.planexpiredate = data['data']['expiry_date'];
        this.obdbalance = data['data']['obdbalance'];
        if (data['data']['feedback_vales'] !== undefined) {
          this.feedbaclvalues = data['data']['feedback_vales'].split(',');
        }

        if (data['data']['package_id'] != 0 || data['data']['package_id'] != null) {
          this.getPackageDetail(data['data']['package_id']);
        }

        if (services.length > 0) {
          for (var i = 0; i < services.length; i++) {
            if (services[i] == '0') {
              this.ivr = true;
            } else if (services[i] == '1') {
              this.misscall = true;;
            } else if (services[i] == '2') {
              this.conference = true;
            } else if (services[i] == '3') {
              this.dialer = true;
            } else if (services[i] == '4') {
              this.clicktocall = true;
            } else if (services[i] == '5') {
              this.campaign = true;
            } else if (services[i] == '7') {
              this.bulksms = true;
            } else if (services[i] == '9') {
              this.obdcampaign = true;
            } else if (services[i] == '10') {
              this.zoho = true;
            } else if (services[i] == '11') {
              this.lms = true;
            } else if (services[i] == '12') {
              this.voicemail = true;
            }else if (services[i] == '13') {
              this.sms = true;
            }else if (services[i] == '14') {
              this.email = true;
            }else if (services[i] == '15') {
              this.chat = true;
            }else if (services[i] == '16') {
              this.digital = true;
            }else if (services[i] == '17') {
              this.media_libaray = true;
            }else if(services[i]=='18'){
              this.custom_api =true;
            }


          }

        }


        if (data['data']['zoho_enable'] == 'yes') {
          this.zohoenable = true
        } else {
          this.zohoenable = false
        }
      },
      err => {
        console.log('error');
      })
  }

  get_mobile_erp(data) {
    //console.log(data)
    let number = data
    //console.log(number.slice(number.length - 10)); //Outputs: Tabs1
    let last_ten = number.slice(number.length - 10)
    let mob = { 'mobile_no': last_ten }
    // this.AuthService.check_lead_by_number(mob).then(
    //   data => {
    //     console.log(data)
    //     this.Lead_data = data['data']
    //     this.save_bt = true
    //     this.callername = data['data'].lead_name
    //     this.calleremail = data['data'].email_id
    //     this.callernumber = data['data'].mobile_no
    //   },
    //   err => {
    //     console.log('error');
    //   }
    // );

  }
  async getAgentDetail(agentid) {
    
    await this.userservice.getAgentDatail(agentid).then(
      data => {
        //console.log('data::'+JSON.stringify(data['data']));
        if (data['data']['voip_status'] == 0) {
          var that = this
          this.isvoipsupport = true
          var voipstatus = localStorage.getItem('voipstatus')
          if (voipstatus == 'true') {
            //check microphone permission
            navigator.permissions.query(
            { name: 'microphone' }
            ).then(permissionStatus => {                
                //console.log(permissionStatus.state); // granted, denied, prompt
                if(permissionStatus.state != 'granted')
                {  
                  alert('Please allow your microphone');
                }
                else
                {
                  this.mic_permission=true;
                }
                let self=this;
                permissionStatus.onchange = function(){
                  if(this.state!='granted')
                  {
                    self.mic_permission=false;
                  }
                  //console.log("Permission changed to " + this.state);
                } 
            })
            // var socket = new WebSocketInterface('wss://'+this.voipdomain+':8089/ws');//wss://gaesip.cloudX.in:8089/ws
            var configuration = {
              // sockets: [socket],
              uri: 'sip:' + data['data']['account_name'] + '@'+this.voipdomain,
              password: 'garudavoip@dv'
            };
            // this.tfPhone = new UA(configuration);

            // this.tfPhone.on('connecting', function (e) {
            //   /* Your code here */
            //   console.log('connecting')
            //   that.callpopup = true
            // });

            // this.tfPhone.on('connected', function (e) {
            //   /* Your code here */
            //   //console.log('connected')
            //   that.callpopup = true
            // });

            // this.tfPhone.on('disconnected', function (e) {
            //   /* Your code here */
            //   //console.log('disconnected')
            //   that.callpopup = true
            // });
            // this.tfPhone.on('registered', function (e) {
            //   that.webrtcstatus = 'Registered'
            //   that.callpopup = true
            // });
            // this.tfPhone.on('unregistered', function (e) { /* Your code here */ });
            // this.tfPhone.on('registrationFailed', function (e) {
            //   that.webrtcstatus = 'Registration Failed'
            //   that.callpopup = true
            // });

            var calloptions = {
              'mediaConstraints': { 'audio': true }
            };
            // this.tfPhone.on('newRTCSession', function (e) {
            //   /* Your code here */
            //   this.session = e.session; // outgoing call session here
            //   that.setsession(e.session)
            //   let number = this.session._request.ruri['_user']
            //   console.log(e.session)
            //   var textboxText = number.replace(/^0+/, '')
            //   //that.get_mobile_erp(textboxText)
            //   //console.log(this.session)
            //   if (this.session.direction == "outgoing") {
            //     this.callinfotext = 'Ringing...'
            //     this.session.on("progress", function () {
            //       //the call has ended
            //       //console.log('call progress==')
            //       that.callpopup = true
            //     });
            //     this.session.on("confirmed", function (e) {
            //       //console.log('call confirmed')
            //       that.callpopup = true
            //     });
            //     this.session.on("ended", function () {
            //       //the call has ended
            //       //console.log('call ended')
            //       that.callControl = true
            //       that.iscurrentcall = false
            //       that.callpopup = true
            //       that.session = undefined
            //       that.acwagentcallhold(true)
            //     });
            //     this.session.on("failed", function () {
            //       //console.log('call failed')
            //       // unable to establish the call
            //       that.callControl = true
            //       that.iscurrentcall = false
            //       that.callpopup = true
            //       that.session = undefined
            //     });
            //     this.session.connection.addEventListener('addstream', (e) => {
            //       //console.log("Debug: addstream............");
            //       var audioObj = new Audio();
            //       audioObj.srcObject = e.stream
            //       audioObj.play();
            //     });
            //   }
            // });
            // this.tfPhone.start();
          }
        }
        if (data['data']['whatsup_access'] == 0) {
          this.whatsupaccess = true;
        }
        if (data['data']['show_no_id'] == 1) {
          this.showid = true
        }
        this.getManagerDetail(data['data']['created_by']);
        this.managerid = data['data']['created_by'];
        this.monitoragent = data['data']['monitor_agent'];
        if (this.managerid == '945') {
          var timeout = 7200
        } else if (this.managerid == '1556') {
          var timeout = 7200
        } else {
          var timeout = 7200
        }
        this.timer = new IdleTimeoutManager({
          timeout: timeout, //expired after 10 secs
          onExpired: () => {
            //console.log("Expired");
            this.logout()
          }
        });
      },
      err => {
        console.log('error');
      })
  }

  async getNotifications() {
    await this.userservice.getNotifications().then(
      data => {
        this.notifications = data['data'];
      },
      err => {
        console.log('error');
      })
  }
  async checkkyc(id) {
    //console.log(id);
    //console.log("kyc in");   
    await this.userservice.getKYCStatus(id).then(
      data => {
        if(data['data'].length>0){
          if ((data['data'][0].kyc_status == 1 || data['data'][0].status == 1)) {

          }   else{
            this.router.navigate(['/kyc-document-upload']);
          }         
        }
        else {
          this.router.navigate(['/kyc-document-upload']);
        }

      },
      err => {
        console.log('error');
      }
    );
  }
  //Call Form Submit
  callsubmit() {
    let data: any = Object.assign(this.callForm.value);
    //console.log(data)
    if (this.callForm.invalid == true) {
      return;
    } else {
      //console.log(data)
      //this.callDiscontinuenot()
      this.acwagentcallhold(false)
      this.callForm.get('calldesc').setValue('')
      this.callForm.get('callresult').setValue('')
      this.callForm.get('callscheduledate').setValue('')
      this.callForm.get('callleadid').setValue('')
      this.userservice.updateCallResult(data).then(
        data => {
          //console.log(data['data']);
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.closecallpopup()
          this.callernumber = ''
          this.callername = ''
          this.calleremail = ''
          this.callaction = ''
          this.contactArr = []
        },
        err => {
          console.log('error');
        }
      );
    }

  }
  closecallpopup() {
    this.callpopup = false
    //this.callpopupmin = true
  }

  popupmin() {
    this.callpopupmin = true
  }
  popupmax() {
    this.callpopupmin = false
  }
  callqueuemodal() {
    const dialogRef = this.dialog.open(CallQueueComponent, {
      data: 0
    });//disableClose: true,
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {

      }
    });
  }
  callhistorymodal(): void {
    let data: any = Object.assign(this.callForm.value);
    let data1: any = Object.assign(this.dialerform.value);
    const dialogRef = this.dialog.open(CallHistoryComponent, {
      data: { callrefid: data.callrefid,mobile:data1.number }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  contactdialog(): void {
    let data: any = Object.assign(this.callForm.value);
    const dialogRef = this.dialog.open(GenerateContactComponent, {
      width: '50%', disableClose: true, data: { id: data.callrefid, callernumber: this.callernumber, managerid: this.managerid }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update' || result.event == 'Add') {
      }
    });
  }
  whatsappdialog(): void {
    //console.log("show_no_id"+this.showid);
    let data: any = Object.assign(this.callForm.value);
   // console.log(data.callrefid);
    var show_no_id=0;
    if(this.showid == true){
       show_no_id=1;
    }else{
      show_no_id=0;
    }
    const dialogRef = this.dialog.open(ShareWhatsappComponent, {
      disableClose: true, data: { callernumber: this.callernumber, cdrid: data.callrefid,show_no_id:show_no_id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update' || result.event == 'Add') {
      }
    });
  }
  calltransfer(): void {
    let data: any = Object.assign(this.callForm.value);
    const dialogRef = this.dialog.open(CallTransferComponent, {
      data: { callrefid: data.callrefid }
    });
    dialogRef.afterClosed().subscribe(result => {
      //console.log(result)
      if (result.event == 'transfer') {
        var ext = result.ext
        this.sendDtmf(ext)
      }
    });
  }
  contactinfo(): void {
    let data: any = Object.assign(this.callForm.value);
    const dialogRef = this.dialog.open(ContactInformationComponent, {
      data: { callrefid: data.callrefid }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  ScheduleMeeting(): void {
    let data: any = Object.assign(this.callForm.value);
    //console.log('data::'+this.callernumber);
    const dialogRef = this.dialog.open(ScheduleMeetingComponent, {
      width: '340px', data: { contid: data.callconid, callernumber: this.callernumber, managerid: this.managerid }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  feedbackpopup() {
    let data: any = Object.assign(this.callForm.value);
    const dialogRef = this.dialog.open(FeedbackFormFillComponent, {
      disableClose: true, data: { callrefid: data.callrefid, feedbackformid: this.feedbackformid }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  async getPackageDetail(packageid) {
    await this.adminservice.getPackageDetail(packageid).then(
      data => {
        //console.log('package',data)
        if(data['data'])
          this.minutetype = data['data']['minute_type'];
      },
      err => {
        console.log('error');
      })
  }

  callDiscontinue() {
    let value = { 'holdcall': true, 'holdreason': '17' }
    //console.log("Start")
    if (this.managerid == '945' || this.managerid == '2075' || this.managerid == '1790' || this.managerid == '2307' || this.managerid == '42' || this.managerid == '2319') {
      this.userservice.acwAgentHoldTime(value).then(
        data => {
        },
        err => {
          console.log('error');
        }
      );
    }
  }


  callDiscontinuenot() {
    let value = { 'holdcall': false, 'holdreason': '17' }
    if (this.managerid == '945' || this.managerid == '2075' || this.managerid == '1790' || this.managerid == '2307' || this.managerid == '42' || this.managerid == '2319') {
      this.userservice.acwAgentHoldTime(value).then(
        data => {
          console.log('Stop')
        },
        err => {
          console.log('error');
        }
      );
    }
  }


  // getCallStopTime() {
  //   this.userservice.getCallStopTime().then(
  //     data => {
  //       if (data['data'].length > 0) { //console.log(data['data']);
  //         console.log(data['data'])
  //         this.color_bt=true;
  //         this.reason_value = {'holdcall':true,'holdreason':data['data'][0].reason_id}
  //         // this.holdform.get('holdreason').setValue(data['data'][0].reason_id)
  //         // this.holdform.get('holdcall').setValue('true')
  //       } else {
  //       }
  //     },
  //     err => {
  //       console.log('error');
  //     }
  //   );
  // }
  //voip
  setsession(session) {
    //console.log(this.session)
    if (this.session != undefined) {
      session = undefined
      this.callrunning = true
    } else {
      this.callrunning = false
      var that = this
      that.session = session
      if (session.direction == "incoming") {
        var incomingaudioObj = new Audio();
        incomingaudioObj.src = 'assets/sounds/incoming.mp3'
        incomingaudioObj.loop = true
        incomingaudioObj.play();
        that.isincomingcall = true
        that.callControl = false
        this.callpopup = true
        
        if(that.callaction=='end'){
          that.callernumber = ''
          that.callername = ''
          that.calleremail = ''
          that.callaction = ''  
        }

        //console.log(session._request)
        //   let number = session._request.from['_display_name']
        //  var textboxText= number.replace(/^0+/, '')
        //  this.get_mobile_erp(textboxText) 
        var autoanswerstatus = localStorage.getItem('autoanswer')
        if (autoanswerstatus == 'true') {
          setTimeout(() => {
            that.callanswer()
          }, 3000)
          
        }
        session.on("accepted", function () {
          // the call has answered
          //console.log(session)
          //console.log('call accepted')
          that.isincomingcall = false
          that.iscurrentcall = true
          incomingaudioObj.pause();
          that.callpopupmin = false
          that.callpopup = true
        });
        session.on("ended", function () {
          clearInterval(this.interval);
          //console.log('outside call ended')
          that.callControl = true
          that.iscurrentcall = false
          that.isincomingcall = false
          incomingaudioObj.pause();
          that.callpopup = true
          that.callaction = 'end'
          that.session = undefined
          //that.callDiscontinue()
          that.acwagentcallhold(true)
        });
        session.on("failed", function () {
          clearInterval(this.interval);
          //console.log('outside call failed')
          that.callControl = true
          that.iscurrentcall = false
          that.isincomingcall = false
          incomingaudioObj.pause();
          that.callpopup = true
          that.session = undefined
        });
      }
    }
  }
  connectcall() {
    if(this.mic_permission){
      this.callernumber = ''
      this.callername = ''
      this.calleremail = ''
      this.callaction = ''  
      this.save_bt = false
      let data: any = Object.assign(this.dialerform.value);
      var mobilenumber =data.number;
      var callernumber = mobilenumber.replaceAll(" ", "");
      //alert(callernumber);
      var options = {
        //'eventHandlers'    : eventHandlers,
        'mediaConstraints': { 'audio': true }
      };
      this.session = this.tfPhone.call('sip:' + callernumber + '@'+this.voipdomain, options);
      //this.session = this.tfPhone.call('sip:' + data.number + '@192.168.1.26', options);
      this.callControl = false
      this.iscurrentcall = true
      this.callinfonumber = this.session.remote_identity.uri.user
      this.callinfotext = 'Ringing...'
      this.callpopup = true
      let mob = { 'mobile_no': callernumber }
      this.callername = null
      this.calleremail = null
      this.callernumber = null
      this.AuthService.check_lead_by_number(mob).then(
        data => {
          //console.log(data)
          this.Lead_data = data['data']
          //this.save_bt = true
          this.callername = data['data'].lead_name
          this.calleremail = data['data'].email_id
          this.show_no_id = data['data'].show_no_id
          if(this.show_no_id){
            this.callernumber = data['data'].l_id
          }else{
            this.callernumber = data['data'].mobile_no
          }
          if (data['data'].l_id > 0) {
            this.callleadid = data['data'].l_id
            this.callForm.get('callleadid').setValue(this.callleadid)
            this.router.navigate(['/lead-details/' + this.callleadid]);
          }
        },
        err => {
          console.log('error');
        }
      );
    }else{
      alert("Please allow microphone permission")
    }
  }
  callhangup() {
    //console.log('callhangup')
    this.session.terminate()

  }
  callmute() {
    //console.log('MUTE CLICKED');
    if (this.session.isMuted().audio) {
      this.session.unmute({ audio: true });
    } else {
      this.session.mute({ audio: true });
    }
  }
  callhold() {
    //console.log('HOLD CLICKED');
    if (this.session.isOnHold().local) {
      this.session.unhold({ local: true });
    } else {
      this.session.hold({ local: true });
    }
  }
  callanswer() {
    var options = {
      'mediaConstraints': { 'audio': true }
    };
    this.session.answer(options)
    this.session.connection.addEventListener('addstream', (e) => {
      //console.log("Debug: addstream............");
      var audioObj = new Audio();
      audioObj.srcObject = e.stream
      audioObj.play();
    });
    this.iscurrentcall = true
    this.isincomingcall = false
  }
  sendDtmf(ext) {
    var tones = '#' + ext;

    var extraHeaders = ['X-Foo: foo', 'X-Bar: bar'];

    var options = {
      'duration': 160,
      'interToneGap': 1200,
      'extraHeaders': extraHeaders,
      'transportType': 'RFC2833'
    };

    this.session.sendDTMF(tones, options);
    this._snackBar.open('Transfer request send successfully.', '', {
      duration: 2000, verticalPosition: 'top'
    });
  }
  sendOnlyDtmf(ext) {
    //console.log('dtmf:==>' + ext)
    var incomingaudioObj = new Audio();
    incomingaudioObj.src = 'assets/sounds/dtmf.mp3'
    incomingaudioObj.play();
    var tones = ext;
    this.session.sendDTMF(tones);
  }
  voipcall(number) {
    this.callernumber = ''
    this.callername = ''
    this.calleremail = ''
    this.callaction = ''
    var options = {
      //'eventHandlers'    : eventHandlers,
      'mediaConstraints': { 'audio': true }
    };
    console.log(this.voipdomain)
    this.session = this.tfPhone.call('sip:' + number +'@'+ this.voipdomain, options);
    this.callControl = false
    this.iscurrentcall = true
    this.callinfonumber = this.session.remote_identity.uri.user
    this.callinfotext = 'Ringing...'
    let mob = { 'mobile_no': number }
    this.AuthService.check_lead_by_number(mob).then(
      data => {
        //console.log(data)
        this.Lead_data = data['data']
        //this.save_bt = true
        this.callername = data['data'].lead_name
        this.calleremail = data['data'].email_id
        this.callernumber = data['data'].mobile_no
        this.show_no_id = data['data'].show_no_id
        if(this.show_no_id){
          this.callernumber = data['data'].l_id
          this.callinfonumber = data['data'].l_id
        }else{
          this.callernumber = data['data'].mobile_no
        }
        if (data['data'].l_id > 0) {
          this.callleadid = data['data'].l_id
          this.callForm.get('callleadid').setValue(this.callleadid)
          this.router.navigate(['/lead-details/' + this.callleadid]);
        }
      },
      err => {
        console.log('error');
      }
    );
  }

  opencallpopup() {
    this.callpopup = true
    this.loadScript('./assets/js/move-drag.js');
  }

  checkwhitelistip(managerid) {
    if (managerid == 1556) {
      this.http.get("https://sbc2.(wrong)cloudX.in/ip.php").subscribe((res: any) => {
        //console.log(res.ip)
        if (res.ip == '103.144.119.141' || res.ip == '103.99.15.90') {
        } else {
          this._snackBar.open('Access from outside network not allowed!', '', {
            duration: 2000, verticalPosition: 'top'
          });
          localStorage.clear()
          localStorage.removeItem('access_token');
          localStorage.removeItem('access_id');
          localStorage.removeItem('username');
          localStorage.removeItem('secret');
          window.location.href = '/signin';
        }
      });
    }
  }


  commentsubmit() {

    let data: any = Object.assign(this.callForm.value);
    //console.log(data.calldesc.length)
    if (data.calldesc.length > 0) {
      let data2 = { 'note': data.calldesc, 'lead_id': this.Lead_data['l_id'], 'name': this.Lead_data['name'], 'comment_by': this.Lead_data['owner'] }
      this.AuthService.commentLeadNote(data2).then(
        data => {
          this.callForm.reset();
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
        },
        err => {
          console.log('error');
        }
      );
    }


  }

  submit_status() {
    let data: any = Object.assign(this.callForm.value);
    //console.log(data.status)
    let data2 = { 'name': this.Lead_data['name'], 'status': data.status }
    //console.log(data2)
    if (data.status.length > 0) {
      this.AuthService.updateLeadAll(data2).then(
        data1 => {

          this.callForm.reset();
          this._snackBar.open('status Update', '', {
            duration: 2000, verticalPosition: 'top'
          });

        },
        err => {
          console.log('error');
        })

    }

  }

  async get_lead_stage_status() {
    await this.AuthService.get_lead_stage_status().then(
      data => {
        if (data['data'].length > 0) {
          this.leadstatus = data['data']
        }
      },
      err => {
        console.log('error');
      }
    );
  }

  acwagentcallhold(status) {
    let value = {'holdcall':status,'holdreason': '17'}
    if(this.settings['acw_callhold']=='1'){
      this.userservice.acwAgentHoldTime(value).then(
        data => {
          console.log('acw',data);
        },
        err => {
          console.log('error');
        }
      );
    }
  }
  changeuserrole(role){
    localStorage.setItem('agent_role', role);
    window.location.href = '/dashboard'
  }
  raisedticketform(): void {
    const dialogRef = this.dialog.open(TicketRaisedComponent, {
      disableClose: true,"width":'700px'
    });
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }
  voipunregister(){
    console.log('voipunregister');
    var options = {
      all: true
    };
    
    this.tfPhone.unregister(options);
  }

  async feedback_list(userid) {
    console.log('userid :' + userid);
    await this.userservice.getCallFeedback(userid).then(
      data => {      

        localStorage.setItem('feedback', JSON.stringify(data['data']));
       // this.feedbacklist= data['data']
          
       // console.log(this.feedbacklist);
        
      },
      err => {
        console.log('error');
      }
    );
  }
 
}
