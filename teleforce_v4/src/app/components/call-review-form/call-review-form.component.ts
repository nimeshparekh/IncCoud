import { Component, OnInit , ViewChild, Inject, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-call-review-form',
  templateUrl: './call-review-form.component.html',
  styleUrls: ['./call-review-form.component.css']
})
export class CallReviewFormComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'smsplan', 'action'];
  Length = 0;
  isLoading = true;

  constructor(private userservice: UserService, public dialog: MatDialog) { }

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    var userid =  localStorage.getItem('access_id');
    this.getForm(userid);
  }

  async getForm(userid) {
    await this.userservice.getManagerCallReviewForm(userid).then(
      data => {
        console.log(data['data']);
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );
  }

  Createdialog(): void {
    const dialogRef = this.dialog.open(CreateReviewFormComponent, {
      width: '640px', disableClose: true, maxHeight: '800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        var userid =  localStorage.getItem('access_id');
        this.getForm(userid);
      }
    });
  }



  updatedialog(id): void {
    //console.log(id);
    this.userservice.getCallReviewFormDetail(id).then(
      data => {
       // console.log(data['data'][0]);
        const dialogRef = this.dialog.open(CreateReviewFormComponent, {
          width: '640px', disableClose: true, data: data['data'][0]
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.event == 'Update') {
            var userid =  localStorage.getItem('access_id');
            this.getForm(userid);
          }
        });
      },
      err => {
        console.log('error');
      }
    );
  }

  async deleteData(id) {
    const dialogRef = this.dialog.open(CreateReviewFormComponent, {
      width: '640px', disableClose: true, data: { action: 'delete', id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        var userid =  localStorage.getItem('access_id');
        this.getForm(userid);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


}




@Component({
  selector: 'app-call-review-form',
  templateUrl: './create-review-form.component.html',
  styleUrls: ['./call-review-form.component.css']
})
export class CreateReviewFormComponent implements OnInit {
  @ViewChild('parent') parent: ElementRef;
  form: FormGroup;
  submitted = false;
  addmode = true;
  editmode = false;
  packageid = '';
  deletemode = false;
  packagevalue = 0;

  serviceErrors: any = {};
  public breakpoint: number; // Breakpoint observer code
  public fname: string = `Ramesh`;
  public lname: string = `Suresh`;
  public addForm: FormGroup;
  wasFormChanged = false;
  private debouncedTimeout;

  constructor(
    public dialogRef: MatDialogRef<CreateReviewFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CallReviewFormComponent,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private userservice: UserService,
    private _snackBar: MatSnackBar,
  ) { }

  public ngOnInit(): void {
    //console.log(this.data);
    let userinfo = localStorage.getItem('access_id');
    if (this.data && this.data != null) {
      if (this.data['action'] == 'delete') {
        this.packageid = this.data['id'];
        this.deletemode = true;
        this.addmode = false;
      } else {
        this.packageid = '';
        this.editmode = true;
        this.addmode = false;
      }
      var date = new Date();
      this.addForm = this.fb.group({
        account_id: [userinfo],
        form_id: [this.data['form_id']],
        form_parameter: [this.data['form_parameter'], [Validators.required]],
        update_date: [date]
      });

    } else {
      this.addmode = true
      this.editmode = false
      this.addForm = this.fb.group({
        account_id: [userinfo],
        form_parameter: [null, [Validators.required]],
        create_date: [new Date()]
      });
    }
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; // Breakpoint observer code    
  }

  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  // tslint:disable-next-line:no-any
  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }

  formChanged() {
    this.wasFormChanged = true;
  }
  submit() {
    this.submitted = true;
    if (this.addForm.invalid == true) {
      return;
    }
    else {

      let data: any = Object.assign(this.addForm.value);
      if (this.editmode) {
        this.userservice.updateCallReviewFormData(data).then(data => {
          if (data) {
            // this.toastr.success(data['msg']);
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close({ event: 'Update' });
          }
        },
          err => {
            console.log('error');
          })
      } else {
        this.userservice.saveCallReviewFormData(data).then(data => {
          if (data) {
            //this.toastr.success(data['msg']);
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close({ event: 'Add' });
          }
        },
          err => {
            console.log('error');
          })

      }
    }

  }

  async deleteData(id) {
     console.log(id);   
    await this.userservice.deleteCallReviewFormData(id).then(
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
  countPackageValue() {
    let data: any = Object.assign(this.addForm.value);
    //console.log(data);
    var rate = data.rate;
    var no = data.no;
    this.packagevalue = (rate * no);
    this.addForm.get('value').setValue(this.packagevalue);
  }

}
