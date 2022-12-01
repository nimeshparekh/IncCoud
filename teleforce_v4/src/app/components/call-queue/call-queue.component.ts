import { Component, OnInit,Inject} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { environment } from '../../../environments/environment';
import { HttpClient ,HttpHeaders} from "@angular/common/http";
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from "../../user.service";
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-call-queue',
  templateUrl: './call-queue.component.html',
  styleUrls: ['./call-queue.component.css']
})
export class CallQueueComponent implements OnInit {
  queuelist = []
  allagentlist = []
  queueevent = []
  queueagent = []
  constructor(
    public dialogRef: MatDialogRef<CallQueueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private userservice: UserService,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getAgentQueue()
    this.getAllAgents()
  }

  closeDialog(): void {
    this.dialogRef.close({event:'Cancel'});
  }
  async getAgentQueue(){
    await this.userservice.getAgentQueue().then(
      data => {
        this.queuelist = data['data']
      },
      err => {
        console.log('error');
      })
  }
  getqueueduration(date){
    var startTime = new Date(date); 
    var endTime = new Date();
    var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
    var resultInMinutes = Math.round(difference / 60000);
    return resultInMinutes;
  }
  async getAllAgents(){
    await this.userservice.getAllAgents().then(
      data => {
        this.allagentlist = data['data']
      },
      err => {
        console.log('error');
      })
  }
  setqueueagent(value,cdrid){
    //console.log(cdrid)
    this.queueagent[cdrid] = value
  }
  setqueueevent(value,cdrid){
    //console.log(cdrid)
    this.queueevent[cdrid] = value
  }
  callactionsubmit(cdrid){
    var qevent = this.queueevent[cdrid]
    var qagent = this.queueagent[cdrid]
    console.log(qevent+"=="+qagent)
    var data = {}
    if(qevent>0){      
      if(qagent>0){
        data = {action:qevent,transfer_agent:qagent,cdrid:cdrid}
      }else{
        data = {action:qevent,cdrid:cdrid}
      }
      this.userservice.updatequeuecall(data).then(
        data => {
          if(data['msg']){
            this._snackBar.open('Request sent successfully.', '', {
              duration: 2000,verticalPosition: 'top'
            });
            
          }
        },
        err => {
          console.log('error');
        })
    }
  }
}
