import { Component, OnInit, ViewChild ,Inject} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import { ManagerService } from '../../manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mamager-login',
  templateUrl: './mamager-login.component.html',
  styleUrls: ['./mamager-login.component.css']
})
export class MamagerLoginComponent implements OnInit {
  public searchform: FormGroup;

  constructor(private fb: FormBuilder,
    private adminservice: AdminService,
    public dialog: MatDialog,
    private managerservice: ManagerService,
    private _snackBar: MatSnackBar,
    public router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      account_id:[userid],
      managername:[null,[Validators.required]],
      password:[null,[Validators.required]]
    });
  }
  searchData(){
    let data: any = Object.assign(this.searchform.value);
    console.log(data)
    if (this.searchform.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {
      this.managerservice.directLogin(data).then(
        data => {
          console.log(data);
          if(data['islogin']==true){
            this._snackBar.open('Login Successful !!', '', {
              duration: 2000,
            });
            const path = '/dashboard/';
            this.router.navigate([path]);
            window.location.href = '/dashboard/';  
          }else{
            this._snackBar.open(data['msg'], '', {
              duration: 2000,
            });
          }
        },
        err => {
          console.log('error');
          this._snackBar.open('Authentication Failed !!', '', {
            duration: 2000,
          });
          localStorage.removeItem('access_token');
          localStorage.clear();

        });
    }
  }
}
