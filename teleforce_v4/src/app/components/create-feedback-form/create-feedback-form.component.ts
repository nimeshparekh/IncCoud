import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../user.service';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';

@Component({
  selector: 'app-create-feedback-form',
  templateUrl: './create-feedback-form.component.html',
  styleUrls: ['./create-feedback-form.component.css']
})
export class CreateFeedbackFormComponent implements OnInit {

  submitted = false;
  addmode = true;
  editmode = false;
  deletemode = false;
  delagentid = '';
  delagentname = '';
  page_data = [];
  category = [];
  otherfileds = [{ key: 'otherkey1', value: 'othervalue1' }]
  addForm: FormGroup;
  callogid = '';
  items: FormArray;
  formid;
  adminid;
  constructor(
    public dialogRef: MatDialogRef<CreateFeedbackFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private userservice: UserService,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
  ) { }


  ngOnInit(): void {
    if (this.data != '' && this.data != null) {
      if (this.data.action == 'delete') {
        this.adminid = this.data.id;
        console.log( this.adminid);
        this.deletemode = true;
        this.addmode = false;
      } else {
        this.addmode = false
        this.userservice.getFormsDataById(this.data).then(
          data => {
            console.log(data);
            this.editmode = true
            this.addForm = this.fb.group({
              name: [data['data'][0]['form_name'], [Validators.required]],
              items: this.fb.array([]),
            });
            if (data['metadata'].length > 0) {
              data['metadata'].forEach(element => {
                this.items = this.addForm.get('items') as FormArray;
                this.items.push(this.fb.group({
                  formtitle: [element.form_title, [Validators.required]],
                  formtype: [element.form_type, [Validators.required]],
                  formvalue: [element.form_value],
                  formid: [element.mid],
                }));
              });
            }
          },
          err => {
            console.log('error');
          }
        );
      }
    } else {
      this.addForm = this.fb.group({
        name: [null, [Validators.required]],
        items: this.fb.array([this.createItem()]),
      });
    }
  }
  createItem(): FormGroup {
    return this.fb.group({
      formtitle: [null, [Validators.required]],
      formtype: [null, [Validators.required]],
      formvalue: [null],
      formid: [null]
    });
  }
  addItem(): void {
    this.items = this.addForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }
  removetem(group: FormGroup, index: number) {
    (this.addForm.get('items') as FormArray).removeAt(index)
  }
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  formsubmit() {
    this.submitted = true;
    if (this.addForm.invalid == true) {
      return;
    }
    else {
      let data: any = Object.assign(this.addForm.value);
      if (this.editmode) {
        data['fid'] = this.data;
        this.http.post(environment.apiUrl + '/setting/updatefeedbackform', data).subscribe((data: any) => {
          if (data.msg) {
            this._snackBar.open('Form Updated Successfully', '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close({ event: 'Add' });
          }
        });

      } else {
        this.http.post(environment.apiUrl + '/setting/createfeedbackform', data).subscribe((data: any) => {
          if (data.msg) {
            this._snackBar.open('Form Created Successfully', '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close({ event: 'Add' });
          }
        });
      }
    }
  }
  async deleteData(id) {
    // console.log(id);   
    this.http.get(environment.apiUrl + '/setting/deletefeedbackform/'+id).subscribe((data: any) => {
      if (data) {
        this._snackBar.open('Form Deleted Successfully', '', {
          duration: 2000, verticalPosition: 'top'
        });
        this.dialogRef.close({ event: 'Delete' });
      }
    });
  }
}
