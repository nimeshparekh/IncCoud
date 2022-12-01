import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { UserService } from '../../user.service';
import { ManagerService } from '../../manager.service';
import { ToastrService } from "ngx-toastr";
import { MatSnackBar } from '@angular/material/snack-bar';
import { newArray } from '@angular/compiler/src/util';

@Component({
  selector: 'app-edit-did-config',
  templateUrl: './edit-did-config.component.html',
  styleUrls: ['./edit-did-config.component.css']
})
export class EditDidConfigComponent implements OnInit {

  feedbackform: FormGroup;
  actionarr = [];
  misscallservice = false;
  ivr=false;
  conference=false;
  clicktocall=false;
  dialer=false;

  constructor(
    public dialogRef: MatDialogRef<EditDidConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private userservice: UserService,
    private managerservice: ManagerService,
    private toastr: ToastrService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.actionarr.push({name:'Hang Up',value:0})
    this.feedbackform = this.formBuilder.group({
      did_id: [this.data],
      type: ['', [Validators.required]],
      action: ['', [Validators.required]],
    });
    this.getDIDdetail(this.data);

    var userid = localStorage.getItem('access_id');
    this.getManagerDetail(userid);
  }
  getDIDdetail(did_id){
    this.userservice.getDIDdetail(did_id).then(
      data => {
       // console.log(data['data']);
       this.changeaction(data['data']['Type'])
       this.feedbackform = this.formBuilder.group({
          did_id: [this.data],
          type: [data['data']['Type'], [Validators.required]],
          action: [data['data']['Action'], [Validators.required]],
        });
      },
      err => {
        console.log('error');
      }
    );
  }
  async changeaction(type){
    let userid = localStorage.getItem('access_id');
    this.actionarr = new Array({name:'Hang Up',value:0})
    //Announcement or VoiceMail
    if(type==1 || type==4){
      await this.userservice.getApproveSoundList(userid).then(
        data => {
          var sdata = data['data'];  
          var rs = Object.values(sdata).map(function(k){return {name:k['originalfilename'],value:k['id']}})
          this.actionarr = rs
        },
        err => {
          console.log('error');
        }
      );
    }
    //HuntGroup
    if(type==2){
      await this.userservice.getHuntgroup(userid).then(
        data => {
          var sdata = data['data'];
          var rs = Object.values(sdata).map(function(k){return {name:k['GroupName'],value:k['GroupID']}})
          this.actionarr = rs
        },
        err => {
          console.log('error');
        }
      );
    }
    //IVR
    if(type==3){
      await this.userservice.getIVR(userid).then(
        data => {
          var sdata = data['data'];
          var rs = Object.values(sdata).map(function(k){return {name:k['IvrName'],value:k['BuilderID']}})
          this.actionarr = rs
        },
        err => {
          console.log('error');
        }
      );
    }    
    //Click to Call
    if(type==8){
      await this.userservice.getClicktoCallScriptList(userid).then(
        data => {
          var sdata = data['data'];
          var rs = Object.values(sdata).map(function(k){return {name:k['script_name'],value:k['clickid']}})
          this.actionarr = rs
        },
        err => {
          console.log('error');
        }
      );
    } 
    //Conference
    if(type==7){
      await this.userservice.getConferenceCall(userid).then(
        data => {
          var sdata = data['data'];
          var rs = Object.values(sdata).map(function(k){return {name:k['conf_name'],value:k['conf_id']}})
          rs.push({name:'All',value:0})
          this.actionarr = rs
        },
        err => {
          console.log('error');
        }
      );
    } 
    if(type==9){
      await this.userservice.getIVR(userid).then(
        data => {
          var sdata = data['data'];
          console.log(sdata);
          var rs = Object.values(sdata).map(function(k){return {name:k['IvrName'],value:k['BuilderID']}})
          this.actionarr = rs
        },
        err => {
          console.log('error');
        }
      );
    }    
  }
  submit(){
    if(this.feedbackform.invalid == true)
  	{
      // console.log(form.value);
  		return;
  	}
  	else
  	{
      let data: any = Object.assign(this.feedbackform.value);
      this.userservice.updateDIDconfig(data).then(
        data => {
          //console.log(data['data']);
          //this.toastr.success(data['data']);
          this._snackBar.open(data['data'], '', {
            duration: 2000,verticalPosition: 'top'
          });
          this.dialogRef.close({event:'Update'});
        },
        err => {
          console.log('error');
        }
      );
    }
  }
  openDialog(): void {
    this.dialogRef.close({event:'Cancel'});
  }
  async getManagerDetail(userid){
    await this.managerservice.getManagerDetail(userid).then(
      data => {
       console.log(data['data']['services']);
       if (data['data']['services'].length > 1) {
        //if(data['data']['package_service'].indexOf(0)==-1){
          var serviceArr = JSON.parse(data['data']['services']);
          for(var i=0;i<data['data']['services'].length;i++ ){
            if(serviceArr[i]=='1'){
              this.misscallservice = true;
            }
            if(serviceArr[i]=='0'){
              this.ivr = true;
            }
            if(serviceArr[i]=='0'){
              this.ivr = true;
            }
            if(serviceArr[i]=='2'){
              this.conference = true;
            }
            if(serviceArr[i]=='3'){
              this.dialer = true;
            }
            if(serviceArr[i]=='4'){
              this.clicktocall = true;
            }
          }
        }else{
          var service = data['data']['services'];
          if(service=='1'){
            this.misscallservice = true;
          }
          if(service=='0'){
            this.ivr = true;
          }
          if(service=='2'){
            this.conference = true;
          }
          if(service=='3'){
            this.dialer = true;
          }
          if(service=='4'){
            this.clicktocall = true;
          }
        }  
      },
      err => {
        console.log('error');
      }
    );
  }

}
