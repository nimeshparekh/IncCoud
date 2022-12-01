import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../user.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-agent-live-status',
  templateUrl: './agent-live-status.component.html',
  styleUrls: ['./agent-live-status.component.css']
})

export class AgentLiveStatusComponent implements OnInit {

  
  is_loggedin;
  break;
  callhold;
  oncall;
  callerinfo ;

  constructor(
    public dialogRef: MatDialogRef<AgentLiveStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userservice: UserService,
    private _snackBar: MatSnackBar,
    private el: ElementRef,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    var id = this.data;
    this.getLiveStatus(this.data);
  }

  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  async getLiveStatus(id) {
    await this.userservice.getLiveStatus(id).then(
      data => {
        console.log("here i am");
        console.log(JSON.stringify(data['data'][0]));
        this.is_loggedin = data['data'][0]['is_loggedin'];
        this.break = data['data'][0]['break'];
        this.callhold = data['data'][0]['callhold'];
        this.oncall = data['data'][0]['oncall'];
        
        if(data['data'][0]['oncall'] == 2){
           this.userservice.getOnCall(id).then(
            data => {
              this.callerinfo = '( Number :'+ data['data'][0]['CallerNumber']+',Name :'+data['data'][0]['CallerName']+')';
            },
            err => {
              console.log('error');
            })  
        }
      },
      err => {
        console.log('error');
      })
  }

  checklogin(id){
    if(id == 'yes'){
      return 'YES';
    }else{
      return 'NO';
    }
  }

  checkbreak(id){
    if(id == null){
      return 'OFF';
    }else{
      return 'ON';
    }
  }

  checkcallhold(id){
    if(id == null){
      return 'OFF';
    }else{
      return 'ON';
    }
  }

  checkoncall(id){
    if (id == 2){
      return  'ON CALL'+ this.callerinfo;
    }else if (id == 1 || id == 3){
      return 'CALL INITIATIVE';
    }else{
      return 'IDLE';
    }
  }

}
