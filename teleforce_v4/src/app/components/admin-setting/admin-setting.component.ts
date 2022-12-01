import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { ManagerService } from '../../manager.service';
import { FormBuilder,FormArray, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { from } from 'rxjs';
import{CampaignService} from '../../campaign.service';

@Component({
  selector: 'app-admin-setting',
  templateUrl: './admin-setting.component.html',
  styleUrls: ['./admin-setting.component.css']
})
export class AdminSettingComponent implements OnInit {

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
      let arr = [];
      for (let i = 0; i < 1; i++) {
       // console.log(this.BuildFormDynamic(i));
        arr.push(this.BuildFormDynamic(i))
      }
      this.addForm = this.fb.group({
        userid: [userid],      
        settingDetail: this.fb.array(arr)
      });
      this.getSetting();
    }
    BuildFormDynamic(product): FormGroup {
      if (product == 0) {
        var name = 'ticket_assign_agentgroup';
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
      this.userservice.getAdminAccessSetting(userid).then(
        data => {
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
      this.userservice.save_admin_setting(data).then(
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
  
  
  
    async getagentgroup() {
      let userinfo = 48;
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
