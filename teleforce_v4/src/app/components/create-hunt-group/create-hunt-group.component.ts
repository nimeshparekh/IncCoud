import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../user.service';
import { ManagerService } from '../../manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-hunt-group',
  templateUrl: './create-hunt-group.component.html',
  styleUrls: ['./create-hunt-group.component.css']
})
export class CreateHuntGroupComponent implements OnInit {
  isDisabled=false;

  addmode = true;
  editmode = false;
  deletemode = false;
  groupid = '';
  submitted = false;
  public addForm: FormGroup;
  sounds = [];
  digitactionarr = [];
  misscallservice=false;
  ivr=false;

  constructor(
    public dialogRef: MatDialogRef<CreateHuntGroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userservice: UserService,
    private managerservice: ManagerService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    let userid = localStorage.getItem('access_id');
    if (this.data != '' && this.data != null) {
      if (this.data.action == 'delete') {
        this.groupid = this.data.id;
        this.deletemode = true;
        this.addmode = false;
      } else {
        this.groupid = this.data
        this.editmode = true;
        this.addmode = false;
        this.getHuntgroupDetail(this.data);
      }

    }
    this.addForm = this.fb.group({
      userid: [userid],
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      calltype: [null, [Validators.required]],
      holdmusic: [0, [Validators.required]],
      queuetimeout: [null, [Validators.required]],
      agenttimeout: [null, [Validators.required]],
      wrapuptime: [null, [Validators.required]],
      hitapi: [0, [Validators.required]],
      callrecording: [false],
      sticky: [false],
      closed: [false],
      all: [false],
      mon: [false],
      tue: [false],
      wed: [false],
      thu: [false],
      fri: [false],
      sat: [false],
      sun: [false],
      starttime: [null, [Validators.required]],
      endtime: [null, [Validators.required]],
      destinationtype: [null],
      destinationaction: [null],
      trans_ext:[null,[Validators.required,Validators.pattern("^[0-9]{2,4}[:.,-]?$")]],
    });
    this.getSound(userid);
    this.getManagerDetail(userid);
  }

  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  submit() {
    this.submitted = true;
    let data: any = Object.assign(this.addForm.value);
    //console.log(data);
    if (this.addForm.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {
      //let data: any = Object.assign(this.addForm.value);
      let data: any = Object.assign(this.addForm.value); console.log(data);
      //console.log(data);
      this.isDisabled=true;

      if (this.data != '' && this.data != null) {
        this.userservice.updateHuntgroup(data).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.dialogRef.close({ event: 'Update' });
            this.isDisabled=false;

          },
          err => {
            console.log('error');
          }
        );
      } else {
        this.userservice.saveHuntgroup(data).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.dialogRef.close({ event: 'Add' });
            this.isDisabled=false;
          },
          err => {
            console.log('error');
          }
        );
      }

    }
  }
  getHuntgroupDetail(id) {
    this.userservice.getHuntgroupDetail(id).then(
      data => {
        console.log(data['data'].account_name);
        if (data['data'].CallRecording == 1) {
          var callrecording = true;
        } else {
          var callrecording = false;
        }
        if (data['data'].Sticky == 1) {
          var sticky = true;
        } else {
          var sticky = false;
        }
        if (data['data'].Closed == 1) {
          var closed = true;
        } else {
          var closed = false;
        }
        if (data['data'].Mon == 1 && data['data'].Tue==1 && data['data'].Wed == 1 && data['data'].Thu == 1 &&
        data['data'].Fri == 1 && data['data'].Sat == 1 && data['data'].Sun == 1) {
          var all = true;
        } else {
          var all = false;
          if (data['data'].Mon == 1) {
            var mon = true;
          } else {
            var mon = false;
          }
          if (data['data'].Tue == 1) {
            var tue = true;
          } else {
            var tue = false;
          }
          if (data['data'].Wed == 1) {
            var wed = true;
          } else {
            var wed = false;
          }
          if (data['data'].Thu == 1) {
            var thu = true;
          } else {
            var thus = false;
          }
          if (data['data'].Fri == 1) {
            var fri = true;
          } else {
            var fri = false;
          }
          if (data['data'].Sat == 1) {
            var sat = true;
          } else {
            var sat = false;
          }
          if (data['data'].Sun == 1) {
            var sun = true;
          } else {
            var sun = false;
          }
        }
        this.changedigitaction(data['data'].CloseType);
        let userid = localStorage.getItem('access_id');
        this.getSound(userid);
        
        this.addForm = this.fb.group({
          groupid: [data['data'].GroupID],
          name: [data['data'].GroupName, [Validators.required]],
          description: [data['data'].GroupDescription, [Validators.required]],
          calltype: [data['data'].CallType, [Validators.required]],
          holdmusic: [data['data'].MusicOnHoldID, [Validators.required]],
          queuetimeout: [data['data'].QueueTimeOut, [Validators.required]],
          agenttimeout: [data['data'].AgentTimeOut, [Validators.required]],
          wrapuptime: [data['data'].WrapUpTime, [Validators.required]],
          hitapi: [data['data'].ApiHit, [Validators.required]],
          callrecording: [callrecording],
          sticky: [sticky],
          closed: [closed],
          all: [all],
          mon: [mon],
          tue: [tue],
          wed: [wed],
          thu: [thu],
          fri: [fri],
          sat: [sat],
          sun: [sun],
          starttime: [data['data'].OpenTime, [Validators.required]],
          endtime: [data['data'].CloseTime, [Validators.required]],
          destinationtype: [data['data'].CloseType],
          destinationaction: [data['data'].CloseAction],
          trans_ext:[data['data']['transfer_extesion'],[Validators.required,Validators.pattern("^[0-9]{2,4}[:.,-]?$")]]
        });
      },
      err => {
        console.log('error');
      }
    );
  }
  async deleteData(id) {
    // console.log(id);   
    await this.userservice.deleteHuntgroup(id).then(
      data => {
        this._snackBar.open(data['data'], '', {
          duration: 2000, verticalPosition: 'top'
        });
        // this.toastr.success(data['data']);
        this.dialogRef.close({ event: 'Delete' });
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

  async changedigitaction(type) {
    let group = 0;
    console.log(type + '==' + group)
    let userid = localStorage.getItem('access_id');
    this.digitactionarr = new Array({ name: 'Hang Up', value: 0 })
    //Announcement or VoiceMail
    if (type == 1 || type == 4) {
      await this.userservice.getApproveSoundList(userid).then(
        data => {
          var sdata = data['data'];
          var rs = Object.values(sdata).map(function (k) { return { name: k['originalfilename'], value: k['id'] } })
          this.digitactionarr = rs
        },
        err => {
          console.log('error');
        }
      );
    }
    //HuntGroup
    if (type == 2) {
      await this.userservice.getHuntgroup(userid).then(
        data => {
          var sdata = data['data'];
          var rs = Object.values(sdata).map(function(k){return {name:k['GroupName'],value:k['GroupID']}})
          this.digitactionarr = rs
        },
        err => {
          console.log('error');
        }
      );
    }
    //IVR
    if (type == 3) {
      await this.userservice.getIVR(userid).then(
        data => {
          var sdata = data['data'];
          var rs = Object.values(sdata).map(function (k) { return { name: k['IvrName'], value: k['BuilderID'] } })
          this.digitactionarr = rs
        },
        err => {
          console.log('error');
        }
      );
    }
    console.log(this.digitactionarr[0]);
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

}
