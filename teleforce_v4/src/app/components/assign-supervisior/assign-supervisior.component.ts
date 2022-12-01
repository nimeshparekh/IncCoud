import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-assign-supervisior',
  templateUrl: './assign-supervisior.component.html',
  styleUrls: ['./assign-supervisior.component.css']
})
export class AssignSupervisiorComponent implements OnInit {


  addmode = true;
  editmode = false;
  deletemode = false;
  detailid = '';
  groupid = '';
  submitted = false;
  public addForm: FormGroup;
  agents = [];

  constructor(
    public dialogRef: MatDialogRef<AssignSupervisiorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userservice: UserService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    //console.log('id'+this.route.snapshot.paramMap.get('id'));
    let userid = localStorage.getItem('access_id');
    if (this.data != '' && this.data != null) {
      if (this.data.action == 'delete') {
        this.detailid = this.data.id;
        this.deletemode = true;
        this.addmode = false;
      } else if (this.data.action == 'add') {
        this.groupid = this.data.id;
        this.deletemode = false;
        this.editmode = false;
      } else {
         this.editmode = false;
        this.addmode = false;
      }

    }
    this.addForm = this.fb.group({
      groupid: [this.groupid],
      agentid: [null, [Validators.required]],
      userid: [userid]
    });
    this.AssignAgentsList(userid,this.groupid)
    
  }

  async AssignAgentsList(userid,groupid) {
    await this.userservice.Notassignsupervisior(userid,groupid).then(
      data => {
       // console.log(data['data']);
        this.agents = data['data'];
      },
      err => {
        console.log('error');
      }
    );
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
      let data: any = Object.assign(this.addForm.value);
      //console.log(data);
      if (this.data != '' && this.data != null && this.data.action == 'add') {

        this.userservice.save_assign_to_supervisior(data).then(
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
      } else {
      
      }

    }
  }
  
  async deleteData(id) {
    // console.log(id);   
    await this.userservice.deleteassignsupervisior(id).then(
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
