import { Component, OnInit } from '@angular/core';
import { ManagerService } from "../../manager.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  public clock;
  AllowAccess = false;
  UserData = {
    username: '',
    role: ''
  };
  custom_api=false;
  did_routing=false;
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
  constructor(    private managerservice: ManagerService,
    ) { }

  ngOnInit(): void {
    this.getManagerDetail(localStorage.getItem('access_id'))
  }
  async getManagerDetail(managerid) {
   
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
        this.did_routing=false;
        this.custom_api=false;
        // console.log("feedback_vales");
        // console.log(data['data']['feedback_vales']);
        this.planexpiredate = data['data']['expiry_date'];
        this.obdbalance = data['data']['obdbalance'];
        if (data['data']['feedback_vales'] !== undefined) {
          this.feedbaclvalues = data['data']['feedback_vales'].split(',');
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
            }else if(services[i]=='19'){
              this.did_routing =true;
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
}
