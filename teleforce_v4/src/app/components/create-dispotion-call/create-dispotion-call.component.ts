import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ManagerService } from '../../manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-create-dispotion-call',
  templateUrl: './create-dispotion-call.component.html',
  styleUrls: ['./create-dispotion-call.component.css']
})
export class CreateDispotionCallComponent implements OnInit {
  addmode = true;
  editmode = false;
  deletemode = false;
  did_id = '';
  submitted = false;
  public addForm: FormGroup;
  schedule=false;
  constructor(
    public dialogRef: MatDialogRef<CreateDispotionCallComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private ManagerService: ManagerService,
    private _snackBar: MatSnackBar,
    private http: HttpClient
  ) { }
 

  ngOnInit(): void {
    console.log(this.data);
    
    var currentdate = new Date();
    let userid = localStorage.getItem('access_id');
    if (this.data != '' && this.data != null) {
      if (this.data.action == 'delete') {
        this.did_id = this.data;
        this.deletemode = true;
        this.addmode = false;
      } else {
        this.did_id = this.data
        this.editmode = true;
        this.addmode = false;
        this.getcustomapi(this.data);
      }

    }
    this.addForm = this.fb.group({
      name: ['', [Validators.required]],
      sub_disposition:['',Validators.required]
    });
  }

  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
  submit() {
    this.submitted = true;
    if (this.addForm.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {
      //let data: any = Object.assign(this.addForm.value);
      let data: any = Object.assign(this.addForm.value); //console.log(data);
      //console.log(data);
      if (this.data != '' && this.data != null) {
        this.ManagerService.updatedispotiondata(data).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.dialogRef.close({ event: 'Update' });
          },
          err => {
            console.log('error');
          }
        );
      } else {
        this.ManagerService.savedispotiondata(data).then(
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
  }
  getcustomapi(id) {
    this.ManagerService.getdispositionbyid(id).then(
      data => {
        console.log(data['data']);
        this.addForm = this.fb.group({
          id: [data['data'].id],
          name: [data['data'].disposition, [Validators.required]],
          sub_disposition:[data['data'].sub_disposition,[Validators.required, Validators.pattern("^[0-9a-zA-Z]+(,[0-9a-zA-Z]+)*$")]]

        });
        
      },
      err => {
        console.log('error');
      }
    );
  }
  async deleteData(id) {
    // console.log(id);   
    await this.ManagerService.deletedispositon(id).then(
      data => {
        this._snackBar.open(data['data'], '', {
          duration: 2000, verticalPosition: 'top'
        });
        // this.toastr.success(data['data']);
        this.dialogRef.close({ event: 'Delete' });
      },
      err => {
        console.log('error');
      }
    );
  }
}