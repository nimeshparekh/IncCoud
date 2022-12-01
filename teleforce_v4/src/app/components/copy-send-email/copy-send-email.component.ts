import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-copy-send-email',
  templateUrl: './copy-send-email.component.html',
  styleUrls: ['./copy-send-email.component.css']
})
export class CopySendEmailComponent implements OnInit {
  public addForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<CopySendEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userservice: UserService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    //Get data from email template
    
    let userid = localStorage.getItem('access_id');
    this.addForm = this.fb.group({
      //segmentid : [null,Validators.required],
      subject : [null,Validators.required],
      template_name: [null, Validators.required],
      userid: [userid],
      template_id : [this.data]
    });
  }
  
  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  async submit(){
    if (this.addForm.invalid == true) {
      // console.log(form.value);
      return;
    }else{
      let data: any = Object.assign(this.addForm.value);
      this.userservice.saveTemplate(data).then(
        data => {
          //console.log(data['data']);
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.dialogRef.close({ event: 'add' });
        });
    }
  }

}
