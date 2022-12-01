import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { ManagerService } from '../../manager.service';
import { FormBuilder,FormArray, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { from } from 'rxjs';
import{CampaignService} from '../../campaign.service';
@Component({
  selector: 'app-agent-lead-access',
  templateUrl: './agent-lead-access.component.html',
  styleUrls: ['./agent-lead-access.component.css']
})
export class AgentLeadAccessComponent implements OnInit {
sound = []
agentgroup=[];
  public addForm: FormGroup;
  public searchform:FormGroup;
  customapi=[];
  constructor(
    private userservice: UserService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private managerservice:ManagerService,
    private campaignservice: CampaignService,
    ) { }

    get configarr(): FormArray {
      return this.addForm.get('settingDetail') as FormArray;
    }

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.getagentgroup();
    this.getcustomapi(userid);
    let arr = [];
    for (let i = 0; i < 25; i++) {
     // console.log(this.BuildFormDynamic(i));
      arr.push(this.BuildFormDynamic(i))
    }
    this.addForm = this.fb.group({
      userid: [userid],      
      settingDetail: this.fb.array(arr)
    });
    this.getSetting();
    this.getsounddata(userid);
  }
  BuildFormDynamic(product): FormGroup {
    if (product == 0) {
      var name = 'lead_access';
    }
    if (product == 1) {
      var name = 'acw_callhold';
    }
    if (product == 4) {
      var name = 'dialer_prefix';
    }
    if (product == 3) {
      var name = 'incoming_call_redirection';
    }
    if (product == 2) {
      var name = 'connect_agent_method';
    }
    if (product == 5) {
      var name = 'call_queue_music';
    }
   
    if (product == 6) {
      var name = 'voip_call_auto_answer';
    }
    if (product == 7) {
      var name = 'show_call_hold_button';
    }
    if (product == 8) {
      var name = 'show_excel_button';
    }
    if (product == 10) {
      var name = 'show_whatsapp_button';
    }   
    if (product == 9) {
      var name = 'show_shoftphone_button';
    }
    if (product == 11) {
      var name = 'show_feedback_button';
    } if (product == 12) {
      var name = 'show_meeting_button';
    } if (product == 13) {
      var name = 'show_transfer_button';
    } if (product == 14) {
      var name = 'show_call_history_button';
    } if (product == 15) {
      var name = 'show_create_contact_button';
    } if (product == 16) {
      var name = 'show_call_auto_answer_button';
    } if (product == 17) {
      var name = 'show_voip_button';
    }if (product == 18) {
      var name = 'sent_whatsupmsg_by';
    }if (product == 19) {
      var name = 'whatsup_api';
    }
    if (product == 20) {
      var name = 'show_recording_button';
    }
    if (product == 21) {
      var name = 'agent_incoming_agent_group';
    }
    if (product == 22) {
      var name = 'show_lms_delete_button';
    }
    if (product == 23) {
      var name = 'duplicate_lead';
    }
    if (product == 24) {
      var name = 'incomming_call_agent_login';
    }
    return this.fb.group({
      setting_name: [name],
      setting_value: [0],
    })
  }


  async getSetting() {
    //console.log('hi');
    var userid = localStorage.getItem('access_id');
    let data: any = Object.assign(this.addForm.value);
    //console.log(data);
    this.userservice.getAgentAccessSetting(userid).then(
      data => {
        //console.log(data['data']);
       // console.log(this.configarr.value.length);
        if (data['data'].length > 0) {
          this.addForm.get("userid").setValue(data['data'][0].account_id);
          var totalcnt = data['data'].length
          let arr = [];
          if(totalcnt==(this.configarr.value.length)){
            console.log('same');
            for (let i = 0; i < (this.configarr.value.length); i++) {           
              // this.changedigitaction(data['ivrext'][i].DestinationType, i)
              //console.log(data['data'][i].setting_value);
              if(data['data'][i].setting_value.length==1 ){
                if(data['data'][i].setting_value=='0'){
                  var value = 0;
                }
                else if(data['data'][i].setting_value=='1'){
                  var value = 1;
                }  else{
                  //console.log('numm::'+data['data'][i].setting_value);
                  var value=Number(data['data'][i].setting_value);
                }              
              }else{
                if(Number(data['data'][i].setting_value)){
                  //console.log('numm::'+data['data'][i].setting_value)
                  var value=Number(data['data'][i].setting_value);
                }else{
                  //console.log('char::'+data['data'][i].setting_value);
                  var value=data['data'][i].setting_value;
                }
                
              }
              //console.log(value);
              arr.push({ setting_name: data['data'][i].setting_name, setting_value: value })
            }
            //console.log(arr);
          }else{
            console.log('diff');
            for (let i = 0; i < (this.configarr.value.length); i++) {           
              // this.changedigitaction(data['ivrext'][i].DestinationType, i)
              var name = this.configarr.value[i].setting_name;
              if(i<totalcnt){
                if(data['data'][i].setting_value.length==1 ){
                  if(data['data'][i].setting_value=='0'){
                    var value = 0;
                  }
                  else if(data['data'][i].setting_value=='1'){
                    var value = 1;
                  } else{
                    //console.log('numm::'+data['data'][i].setting_value);
                    var value=Number(data['data'][i].setting_value);
                  }                 
                }else{
                  if(Number(data['data'][i].setting_value)){
                    //console.log('numm::'+data['data'][i].setting_value)
                    var value=Number(data['data'][i].setting_value);
                  }else{
                    //console.log('char::'+data['data'][i].setting_value);
                    var value=data['data'][i].setting_value;
                  }
                }
              }else{
                var value=0;
              }
              //console.log(value);
              arr.push({ setting_name: name, setting_value: value })
            }
          }
          
          this.configarr.setValue(arr);
        }
      },
      err => {
        console.log('error');
      }
    );
  }
  
  async submit() {
    let data: any = Object.assign(this.addForm.value);
    this.userservice.saveAgentLeadAccessSetting(data).then(
      data => {
        this._snackBar.open(data['msg'], '', {
          duration: 2000, verticalPosition: 'top'
        });
        //this.getSetting();
      },
      err => {
        console.log('error');
      }
    );
  }

  async getsounddata(id) {
    await this.userservice.getsounddata(id).then(
      data => {
        this.sound = data['data'];
        
      },
      err => {
        console.log('error');
      }
    );

  }
  async getcustomapi(userid) {
    await this.managerservice.getcustomapi(userid).then(
      data => {
       // console.log(data['data']);
       this.customapi = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  async getagentgroup() {
    let userinfo = localStorage.getItem('access_id');
    await this.campaignservice.gethuntgroup(userinfo).then(data => {
      if (data) {
        this.agentgroup = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }
}
