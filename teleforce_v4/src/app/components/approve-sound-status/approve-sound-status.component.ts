import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ManagerService } from '../../manager.service';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-approve-sound-status',
  templateUrl: './approve-sound-status.component.html',
  styleUrls: ['./approve-sound-status.component.css']
})
export class ApproveSoundStatusComponent implements OnInit {

  form:FormGroup;
  submitted = false;
  constructor(
    public dialogRef: MatDialogRef<ApproveSoundStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private managerservice: ManagerService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private fb:FormBuilder
  ) { }

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    var username=localStorage.getItem('username');  
    this.getsoundapprovestatus(this.data);
    console.log(this.data);
    
    this.form =this.fb.group({
      id:this.data,
     
      status: ['', [Validators.required]],
      note:['']
    })
  }
  getsoundapprovestatus(id){
    var userid = localStorage.getItem('access_id');
    this.managerservice.getsoundapprovestatus(id).then(
      data => { 
        this.form =this.fb.group({
          id:this.data,
          status: [data['data'][0].status, [Validators.required]],
          note:[data['data'][0].note]
        })
      },
      err => {
        console.log('error');
      }
    );

  }
  approvedata(){
    let udata:any = Object.assign(this.form.value);
   
    
    this.managerservice.savesoundstatus(udata).then(
      data => {
        console.log(data['data']);
        this._snackBar.open(data['data'], '', {
          duration: 3000, verticalPosition: 'top'
        })
        this.dialogRef.close({ event: 'Update' });
        
      },
        err=> {
          console.log('error');
      })

  }

}
