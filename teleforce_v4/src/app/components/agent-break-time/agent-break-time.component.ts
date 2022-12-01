import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";

@Component({
  selector: 'app-agent-break-time',
  templateUrl: './agent-break-time.component.html',
  styleUrls: ['./agent-break-time.component.css']
})
export class AgentBreakTimeComponent implements OnInit {

  stopmode = false;
  startmode = true;
  breakid = 0;
  breakstartime = '';
  breaks=[];
  reasonArr = [];
  holdform: FormGroup
  timezone = localStorage.getItem('timezone')?localStorage.getItem('timezone'):'+5:30'

  constructor(
    private userservice: UserService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar, ) { }

  ngOnInit(): void {
    this.getAgentStartBreakTime();
    this.getAgentTodayBreakTime();
    this.getReasonData(localStorage.getItem('access_id'));
    this.holdform = this.formBuilder.group({
      reason:['']
    });
  }

  start() {
    let data: any = Object.assign(this.holdform.value);
    //console.log(data);
    if(!data.reason){
      this._snackBar.open('Please select break reason', '', {
        duration: 3000, verticalPosition: 'top'
      });
      return;
    }
    if (confirm('Are you sure to start your break time?')) {
      var userid = localStorage.getItem("access_id");
      data.userid=userid;
      this.userservice.startAgentBreakTime(data).then(
        data => {
          //console.log(data['data']);
          //this.toastr.success(data['data']);
          if(data['datalength']>0){
            this._snackBar.open(data['data'], '', {
              duration: 3000, verticalPosition: 'top'
            });
          }else{
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
          }          
          this.getAgentStartBreakTime();
          this.getAgentTodayBreakTime();
        },
        err => {
          console.log('error');
        }
      );
    }
  }
  stop() {
    if (confirm('Are you sure to stop your break time?')) {
      var userid = localStorage.getItem("access_id");
      this.userservice.stopAgentBreakTime(userid,this.breakid).then(
        data => {
          //console.log(data['data']);
          //this.toastr.success(data['data']);
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.getAgentStartBreakTime();
          this.getAgentTodayBreakTime();
          this.holdform.get('reason').setValue('');
        },
        err => {
          console.log('error');
        }
      );
    }

  }
  getAgentStartBreakTime() {
    var userid = localStorage.getItem("access_id");
    this.userservice.getAgentStartBreakTime(userid).then(
      data => {
       if(data['data']){
        this.stopmode = true;
        this.startmode = false;
        this.breakid = data['data'].break_id;
        this.breakstartime = data['data'].start_time;
       // console.log(this.startmode);
       }else{
        this.stopmode = false;
        this.startmode = true;
       }
        
      },
      err => {
        console.log('error');
      }
    );
  }

  getAgentTodayBreakTime() {
    var userid = localStorage.getItem("access_id");
    this.userservice.getAgentTodayBreakTime(userid).then(
      data => {
       if(data['data']){
        // console.log( data['data']);
        this.breaks = data['data'];
       }        
      },
      err => {
        console.log('error');
      }
    );
  }
  async getReasonData(id) {
    await this.userservice.getReasonData(id).then(
      data => {
        this.reasonArr = data['data'];        
      },
      err => {
        console.log('error');
      }
    );

  }

}
