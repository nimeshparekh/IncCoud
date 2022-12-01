import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-agent-shift-break',
  templateUrl: './agent-shift-break.component.html',
  styleUrls: ['./agent-shift-break.component.css']
})
export class AgentShiftBreakComponent implements OnInit {

  stopmode = false;
  startmode = true;
  shiftid = 0;
  shiftstartime = '';
  shifts = [];
  timezone = localStorage.getItem('timezone')?localStorage.getItem('timezone'):'+5:30'
  constructor(
    private userservice: UserService,
    private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.getAgentStartShiftTime();
    this.getAgentTodayShiftTime();
  }

  start() {
    if (confirm('Are you sure to start your shift ?')) {
      var userid = localStorage.getItem("access_id");
      this.userservice.startAgentShiftTime(userid).then(
        data => {
          //console.log(data['data']);
          //this.toastr.success(data['data']);
          if (data['datalength'] > 0) {
            this._snackBar.open(data['data'], '', {
              duration: 3000, verticalPosition: 'top'
            });
          } else {
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
          }
          this.getAgentStartShiftTime();
          this.getAgentTodayShiftTime();
        },
        err => {
          console.log('error');
        }
      );
    }
  }

  stop() {
    if (confirm('Are you sure to stop your shift time?')) {
      var userid = localStorage.getItem("access_id");
      this.userservice.stopAgentShiftTime(userid, this.shiftid).then(
        data => {
          //console.log(data['data']);
          //this.toastr.success(data['data']);
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.getAgentStartShiftTime();
          this.getAgentTodayShiftTime();
        },
        err => {
          console.log('error');
        }
      );
    }

  }

  getAgentStartShiftTime() {
    console.log("Here");
    
    var userid = localStorage.getItem("access_id");
    this.userservice.getAgentStartShiftTime(userid).then(
      data => {
        

        if (data['data']) {
          this.stopmode = true;
          this.startmode = false;
          this.shiftid = data['data'].shift_id;
          this.shiftstartime = data['data'].start_time;
          // console.log(this.startmode);
        } else {
          this.stopmode = false;
          this.startmode = true;
        }

      },
      err => {
        console.log('error');
      }
    );
  }

  getAgentTodayShiftTime() {
    var userid = localStorage.getItem("access_id");
    this.userservice.getAgentTodayShiftTime(userid).then(
      data => {
        console.log("step 2");
        console.log(JSON.stringify(data));
        if (data['data']) {
          console.log(data['data']);
          this.shifts = data['data'];
        }
      },
      err => {
        console.log('error');
      }
    );
  }

}
