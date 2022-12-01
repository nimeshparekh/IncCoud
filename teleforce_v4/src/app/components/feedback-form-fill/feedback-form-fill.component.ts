import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from "../../user.service";
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-feedback-form-fill',
  templateUrl: './feedback-form-fill.component.html',
  styleUrls: ['./feedback-form-fill.component.css']
})
export class FeedbackFormFillComponent implements OnInit {
  addForm: FormGroup;
  items: FormArray;
  metaArray = []
  feedbackforms = []
  constructor(
    public dialogRef: MatDialogRef<FeedbackFormFillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private userservice: UserService,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    console.log(this.data);

    this.addForm = this.fb.group({
      formsid: ['', [Validators.required]],
      items: this.fb.array([]),
    });
    this.userservice.getFormsData().then(
      data => {
        //console.log(data['data']);
        this.feedbackforms = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  loadform() {
    let data: any = Object.assign(this.addForm.value);
    console.log(this.data.callrefid);
    if (data.formsid > 0) {
      this.userservice.getFormsDataById(data.formsid).then(
        data => {
          console.log(data);
          if (data['metadata'].length > 0) {
            this.metaArray = data['metadata']
            data['metadata'].forEach(element => {
              this.items = this.addForm.get('items') as FormArray;
              this.items.push(this.fb.group({
                formmetaid: [element.mid],
                formid: [element.form_id],
                formtitle: [element.form_title, [Validators.required]],
                formvalue: [''],
                cdrid: [this.data.callrefid],
              }));
            });
          }
        },
        err => {
          console.log('error');
        }
      );
    }
  }
  formsubmit() {
    if (this.addForm.invalid == true) {
      return;
    }
    else {

      let data: any = Object.assign(this.addForm.value);
      console.log(data)
      this.http.post(environment.apiUrl + '/call/savefeedbackdata', data).subscribe((data: any) => {
        if (data.msg) {
          this._snackBar.open('Feedback saved successfully', '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.dialogRef.close({ event: 'Add' });
        }
      });
    }
  }

}
