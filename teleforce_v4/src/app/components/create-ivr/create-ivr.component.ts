import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder,FormArray, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../user.service';
import { ManagerService } from '../../manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TemplateService } from '../../template.service';

@Component({
  selector: 'app-create-ivr',
  templateUrl: './create-ivr.component.html',
  styleUrls: ['./create-ivr.component.css']
})
export class CreateIvrComponent implements OnInit {
  isDisabled=false;
  isLoading =false;
  addmode = true;
  editmode = false;
  deletemode = false;
  playfilemode = false;
  dtmfmode = false;
  inputmode = false;
  ivrid = '';
  public addForm: FormGroup;
  sounds = [];
  digitactionarr = [];
  actionarr = [];
  misscallservice=false;
  ivr=false;
  smstemp = [];
  emailtemp = [];
  apitemp = []
  constructor(
    public dialogRef: MatDialogRef<CreateIvrComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userservice: UserService,
    private managerservice: ManagerService,
    private _snackBar: MatSnackBar,
    private templateservice: TemplateService,
  ) { }
  get dtmfarr(): FormArray {
		return this.addForm.get('dtmfDetails') as FormArray;
	}
  get playarr(): FormArray {
		return this.addForm.get('callstatues') as FormArray;
	}
  ngOnInit(): void {
    let userid = localStorage.getItem('access_id');
    this.changeaction(0,'invalid')
    this.changeaction(0,'timeout')
    this.changeaction(0,'default')
    if(this.data!='' && this.data!=null){
      if(this.data.action=='delete'){
        this.ivrid=this.data.id;
        this.deletemode=true;
        this.addmode=false;
      }else{
        this.ivrid=this.data
        this.editmode=true;
        this.addmode=false;
        this.getIVRDetail(this.data);
      }
    }
    this.getSound(userid);
    this.getApproveSMSTemplate(userid);
    this.getApproveEmailTemplate();
    this.getApprovedAPI();
    let arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push(this.BuildFormDynamic(i))
    }
    let arr2 =[]
    for (let i = 0; i < 2; i++) {
      arr2.push(this.BuildFormDynamic2(i))
    }
    this.addForm = this.fb.group({
      ivrname: [null, [Validators.required]],
      ivrdesc: [null, [Validators.required]],
      announcement: [null, [Validators.required]],
      type: [null, [Validators.required]],
      hitapi: [0],
      noinputdigit:[3],
      timeout: [0],
      timeoutrecording: [0],
      invalidretryrecording: [0],
      invalidrecording: [0],
      invalidretries: [0],
      timeoutretries: [0],
      timeoutretryrecording: [0],
      invaliddestinationtype: [0],
      timeoutdestinationtype: [0],
      invaliddestinationaction: [0],
      timeoutdestinationaction: [0],
      defaultdestinationtype: [0],
      defaultdestinationaction: [0],
      user_id: [userid],
      dtmfDetails: this.fb.array(arr),
      callstatues:this.fb.array(arr2)
    });
    this.getManagerDetail(userid);
  }

  BuildFormDynamic(product): FormGroup {
    return this.fb.group({
      dtmf: [''],
      dtmftype: [''],
      dtmfaction: [''],
      dtmfsms: [null],
      dtmfemail:[null],
      dtmfapi:[null],
    })
  }

  BuildFormDynamic2(product): FormGroup {
    return this.fb.group({
      dtmf: [''],
      dtmftype: [''],
      dtmfaction: [''],
      dtmfsms: [null],
      dtmfemail:[null],
      dtmfapi:[null],
    })
  }
  getIVRDetail(id) {
    let userid = localStorage.getItem('access_id');
    this.userservice.getIVRDetail(id).then(
      data => {
        console.log(data['ivrext']);
        this.addForm.get("ivrname").setValue(data['ivrdata'].IvrName);
        this.addForm.get("ivrdesc").setValue(data['ivrdata'].IvrDesc);
        this.addForm.get("announcement").setValue(data['ivrdata'].AnnouncementID);
        this.addForm.get("type").setValue(data['ivrdata'].AnnouncementType);
        this.addForm.get("timeout").setValue(data['ivrdata'].TimeOut);
        this.addForm.get("hitapi").setValue(data['ivrdata'].ApiID);
        this.addForm.get("noinputdigit").setValue(data['ivrdata'].noinputdigit);
        this.addForm.get("timeoutrecording").setValue(data['ivrdata'].NoInputAnnouncementID); 
        this.addForm.get("timeoutretries").setValue(data['ivrdata'].NoInputRetryCount); 
        this.addForm.get("timeoutretryrecording").setValue(data['ivrdata'].NoInputRetryAnnouncementID); 
        this.addForm.get("invalidretryrecording").setValue(data['ivrdata'].InvalidRetryAnnouncementID);
        this.addForm.get("invalidrecording").setValue(data['ivrdata'].InvalidAnnounceMentID);
        this.addForm.get("invalidretries").setValue(data['ivrdata'].InvalidRetryCount);
        this.addForm.get("invaliddestinationtype").setValue(data['ivrdata'].InvalidDestinationType);
        this.addForm.get("invaliddestinationaction").setValue(data['ivrdata'].InvalidDestinationAction);
        this.addForm.get("timeoutdestinationtype").setValue(data['ivrdata'].NoInputDestinationType);
        this.addForm.get("timeoutdestinationaction").setValue(data['ivrdata'].NoInputDestinationAction);
        this.addForm.get("defaultdestinationtype").setValue(data['ivrdata'].DefaultDestinationType);
        this.addForm.get("defaultdestinationaction").setValue(data['ivrdata'].DefaultDestinationAction);
        var totalext = data['ivrext'].length
        this.changeaction(data['ivrdata'].InvalidDestinationType,'invalid')
        this.changeaction(data['ivrdata'].NoInputDestinationType,'timeout')
        this.changeaction(data['ivrdata'].DefaultDestinationType,'default')
        let arr = [];
        let arr2=[];
        if(data['ivrdata'].AnnouncementType == 1){
          console.log("ddddd");
          
          for (let i = 0; i < totalext; i++) {
            this.changedigitaction(data['ivrext'][i].DestinationType,i)
            var ext = data['ivrext'][i].Extension==0?11:data['ivrext'][i].Extension
            arr.push({dtmf:ext,dtmftype:data['ivrext'][i].DestinationType,dtmfaction:data['ivrext'][i].DestinationAction,dtmfsms:data['ivrext'][i].DestinationSMS,dtmfemail:data['ivrext'][i].DestinationEmail,dtmfapi:data['ivrext'][i].DestinationAPI})
          }
          for (let i = 0; i < 10-totalext; i++) {
            arr.push({dtmf:'',dtmftype:0,dtmfaction:0,dtmfsms:0,dtmfemail:0,dtmfapi:0})
          }
          this.dtmfarr.setValue(arr);

        }else{
          console.log("12345");
          
          for (let i = 0; i < totalext; i++) {
            this.changedigitaction(data['ivrext'][i].DestinationType,i)
            var ext = data['ivrext'][i].Extension==0?3:data['ivrext'][i].Extension
            arr2.push({dtmf:ext,dtmftype:data['ivrext'][i].DestinationType,dtmfaction:data['ivrext'][i].DestinationAction,dtmfsms:data['ivrext'][i].DestinationSMS,dtmfemail:data['ivrext'][i].DestinationEmail,dtmfapi:data['ivrext'][i].DestinationAPI})
          }
          console.log(arr2);
          
          for (let i = 0; i < 2-totalext; i++) {
            arr2.push({dtmf:'',dtmftype:0,dtmfaction:0,dtmfsms:0,dtmfemail:0,dtmfapi:0})
          }
          this.playarr.setValue(arr2)

        }
      
       
        this.typeChange({value:data['ivrdata'].AnnouncementType})
      },
      err => {
        console.log('error');
      }
    );
  }

  async getSound(userid) {
    await this.userservice.getApproveSoundList(userid).then(
      data => {
        //console.log(data['data']);
        this.sounds = data['data'];

      },
      err => {
        console.log('error');
      }
    );
  }
  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  submit() {
    if (this.addForm.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {
      let data: any = Object.assign(this.addForm.value);

      this.isDisabled=true;
      this.isLoading=true;
      if(this.data!='' && this.data!=null){
        data = Object.assign({ivrid:this.ivrid}, data);
        this.userservice.updateIVR(data).then(
          data => {
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close({ event: 'Add' });

             this.isDisabled=false;
            this.isLoading=false;
          },
          err => {
            console.log('error');
          }
        );
      }else{
        this.userservice.saveIVR(data).then(
          data => {
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close({ event: 'Add' });

            this.isDisabled=false;
            this.isLoading=false;
          },
          err => {
            console.log('error');
          }
        );
      }
    }
  }
  typeChange(event) {
    if (event.value == 0) {
      this.playfilemode = true;
      this.dtmfmode = false;
      this.inputmode = false;
    } else if (event.value == 1) {
      this.dtmfmode = true;
      this.playfilemode = false;
      this.inputmode = false;
    } else if (event.value == 2) {
      this.dtmfmode = false;
      this.playfilemode = false;
      this.inputmode = true;
    }

  }
  async changedigitaction(type,group){
    console.log(type+'=='+group)
    let userid = localStorage.getItem('access_id');
    this.digitactionarr[group] = new Array({name:'Hang Up',value:0})
    //Announcement or VoiceMail
    if(type==1 || type==4){
      await this.userservice.getApproveSoundList(userid).then(
        data => {
          var sdata = data['data'];  
          var rs = Object.values(sdata).map(function(k){return {name:k['originalfilename'],value:k['id']}})
          this.digitactionarr[group] = rs
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
          this.digitactionarr[group] = rs
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
          this.digitactionarr[group] = rs
        },
        err => {
          console.log('error');
        }
      );
    }
  }
  async changeaction(type,group){
    console.log(type+'=='+group)
    let userid = localStorage.getItem('access_id');
    this.actionarr[group] = new Array({name:'Hang Up',value:0})
    //Announcement or VoiceMail
    if(type==1 || type==4){
      await this.userservice.getApproveSoundList(userid).then(
        data => {
          var sdata = data['data'];  
          var rs = Object.values(sdata).map(function(k){return {name:k['originalfilename'],value:k['id']}})
          this.actionarr[group] = rs
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
          this.actionarr[group] = rs
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
          this.actionarr[group] = rs
        },
        err => {
          console.log('error');
        }
      );
    }
  }
  ivrdelete(id){
    this.userservice.deleteIVR(id).then(
      data => {
        this._snackBar.open(data['data'], '', {
          duration: 2000,verticalPosition: 'top'
        });
       // this.toastr.success(data['data']);
        this.dialogRef.close({event:'Delete'});
      },
      err => {
        console.log('error');
      }
    );
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
          }
        }else{
          var service = data['data']['services'];
          if(service=='1'){
            this.misscallservice = true;
          }
          if(service=='0'){
            this.ivr = true;
          }
        }  
      },
      err => {
        console.log('error');
      }
    );
  }

  async getApproveSMSTemplate(userid) {
    await this.templateservice.getApproveSMSList(userid).then(data => {
      if (data) {
        //console.log('sms:'+data['data']);
        this.smstemp = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }
  async getApproveEmailTemplate() {
    await this.templateservice.getApproveEmailList().then(data => {
      if (data) {
        //console.log('sms:'+data['data']);
        this.emailtemp = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }
  async getApprovedAPI() {
    await this.templateservice.getApprovedAPI().then(data => {
      if (data) {
        //console.log('sms:'+data['data']);
        this.apitemp = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }
}
