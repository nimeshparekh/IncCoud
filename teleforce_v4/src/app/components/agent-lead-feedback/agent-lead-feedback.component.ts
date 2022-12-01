import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-agent-lead-feedback',
  templateUrl: './agent-lead-feedback.component.html',
  styleUrls: ['./agent-lead-feedback.component.css']
})
export class AgentLeadFeedbackComponent implements OnInit {
  public feedbackform: FormGroup;
  addmode=true;
  schedule=false;

  constructor( 
    private fb: FormBuilder,    
    public dialogRef: MatDialogRef<AgentLeadFeedbackComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,    
    private userservice: UserService,
    private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {

    this.feedbackform = this.fb.group({
      id:[this.data],
      scheduledate: [],
      feedback: ['null',[Validators.required]],
      note:[null]
    });
    this.getAgentleadFeedback(this.data);
    
  }
  async getAgentleadFeedback(id){
    await this.userservice.getAgentleadFeedback(id).then(
      data => {
        //console.log(data['data'][0].feedback);
        this.feedbackform = this.fb.group({
          id:[data['data'][0].id],
          scheduledate: [data['data'][0].scheduledate],
          feedback: [data['data'][0].feedback,[Validators.required]],
          note:[data['data'][0].note]
        });
        this.showSchedule(data['data'][0].feedback);
      },
      err => {
        console.log('error');
      }
    );
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
      //console.log(data);
      this.userservice.updateAgentleadFeedback(data).then(
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
  showSchedule(value){
   if(value=='schedule'){
    this.schedule=true;
   }else{
    this.schedule=false;
   }

  }

}
