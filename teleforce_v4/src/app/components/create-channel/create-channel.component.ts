import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.css']
})
export class CreateChannelComponent implements OnInit {

  addmode = true;
  editmode = false;
  deletemode = false;
  did_id = '';
  submitted = false;
  public addForm: FormGroup;
  schedule=false;
  constructor(
    public dialogRef: MatDialogRef<CreateChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private adminservice: AdminService,
    private _snackBar: MatSnackBar,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    var currentdate = new Date();
    let userid = localStorage.getItem('access_id');
    if (this.data != '' && this.data != null) {
      if (this.data.action == 'delete') {
        this.did_id = this.data.id;
        this.deletemode = true;
        this.addmode = false;
      } else {
        this.did_id = this.data
        this.editmode = true;
        this.addmode = false;
        this.getChannelDetail(this.data);
      }

    }
    this.addForm = this.fb.group({
      name: ['SM', [Validators.required]],
      didno: ['079', [Validators.required]],
      did: [null, [Validators.required]],
      status: ['active'],
      is_spam:['no'],
      spam_date:[currentdate],
    });
  }

  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  submit() {
    this.submitted = true;
    if (this.addForm.invalid == true) {
     
      return;
    }
    else {
      let data: any = Object.assign(this.addForm.value); //console.log(data);
      var name2 =data.name;
      var did2 =data.did;
      var didno2 = data.didno
      data.name =name2.replaceAll(" ","")
      data.did =did2.replaceAll(" ","")

      data.didno =didno2.replaceAll(" ","")

      if (this.data != '' && this.data != null) {
        this.adminservice.updateChannel(data).then(
          data => {
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
        this.adminservice.saveChannel(data).then(
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
  getChannelDetail(id) {
    this.adminservice.getChannelDetail(id).then(
      data => {
        console.log(data['data']);
        this.addForm = this.fb.group({
          did_id: [data['data'].id],
          name: [data['data'].did_name, [Validators.required]],
          didno: [data['data'].did_number, [Validators.required]],
          did: [data['data'].did, [Validators.required]],
          status: [data['data']['status']],
          is_spam:[data['data']['is_spam']],
          spam_date:[data['data'].spam_date]
        });
        
        this.showSchedule(data['data'].spam);
      },
      err => {
        console.log('error');
      }
    );
  }
  async deleteData(id) {
    // console.log(id);   
    await this.adminservice.deleteChannel(id).then(
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
  showSchedule(value){
    if(value=='yes'){
     this.schedule=true;
     console.log(this.schedule);
     
    }else{
     this.schedule=false;
    }
 
   }

}
