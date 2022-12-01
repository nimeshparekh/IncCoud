import { Component, OnInit, VERSION, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-meeting-notes',
  templateUrl: './meeting-notes.component.html',
  styleUrls: ['./meeting-notes.component.css']
})
export class MeetingNotesComponent implements OnInit {
  submitted = false;
  public addConForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<MeetingNotesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private authAPIservice: AuthService,
    private http: HttpClient,
    private toastr: ToastrService,
    private userservice: UserService) { }


  ngOnInit(): void {
    //this.getFormsData();
    this.addConForm = this.fb.group({
      note: [null, [Validators.required]],
    });
  }

  sendnotes() {
    this.submitted = true;
    if (this.addConForm.invalid == true) {
      // console.log(form.value);
      return;
    } else {
      var lead_id = this.data['lead_id'];
      var customer_id = this.data['customer_id'];
      let data: any = Object.assign(this.addConForm.value); //console.log(data);
      data['customer_id'] = customer_id;
      data['lead_id'] = lead_id;
      console.log('submit data 222');
      console.log(JSON.stringify(data));


      this.userservice.saveNote(data).then(
        data => {
          //console.log(data['data']);
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          // this.toastr.success(data['data']);
          this.dialogRef.close({ event: 'Add' });
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


}

