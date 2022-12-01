import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-agent-call-feedback',
  templateUrl: './agent-call-feedback.component.html',
  styleUrls: ['./agent-call-feedback.component.css']
})
export class AgentCallFeedbackComponent implements OnInit {

  public feedbackform: FormGroup;
  addmode = true;
  schedule = false;
  feedbaclvalues = []
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AgentCallFeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userservice: UserService,
    private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {

    this.feedbackform = this.fb.group({
      id: [this.data],
      scheduledate: [],
      starttime: [],
      endtime: [],
      feedback: ['null', [Validators.required]],
      note: [null],
      email: [null],
      customer_name: [null],
      agentId: [null],
      mobile: [null]
    });
    this.getAgentCallFeedback(this.data);

  }
  async getAgentCallFeedback(id) {
    await this.userservice.getAgentCallFeedback(id).then(
      data => {
        //console.log(data);
        this.feedbaclvalues = data['feedbackvalues'];
        console.log(this.feedbaclvalues)
        this.feedbackform = this.fb.group({
          id: [data['data'][0].id],
          scheduledate: [data['data'][0].scheduledate],
          starttime: [new Date(data['data'][0].scheduledate).toLocaleTimeString()],
          endtime: [new Date(data['data'][0].scheduledate).toLocaleTimeString()],
          feedback: [data['data'][0].feedback, [Validators.required]],
          note: [data['data'][0].note],
          email: [null],
          customer_name: [data['data'][0].CallerName],
          agentId: [data['data'][0].AgentID],
          mobile: [data['data'][0].CallerNumber]
        });
        this.showSchedule(data['data'][0].feedback);
      },
      err => {
        console.log('error');
      }
    );
  }
  submit() {
    if (this.feedbackform.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {

      let data: any = Object.assign(this.feedbackform.value);
      //console.log(data);
      this.userservice.updateAgentCallFeedback(data).then(
        data => {
          //console.log(data['data']);
          //this.toastr.success(data['data']);
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.dialogRef.close({ event: 'Update' });
        },
        err => {
          console.log('error');
        }
      );
    }
  }
  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  showSchedule(value) {
    if (value == 'schedule') {
      this.schedule = true;
    } else {
      this.schedule = false;
    }

  }

}
