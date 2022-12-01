import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-hold-calling-reason',
  templateUrl: './hold-calling-reason.component.html',
  styleUrls: ['./hold-calling-reason.component.css']
})
export class HoldCallingReasonComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name', 'action'];
  Length = 0;
  isLoading = true;

  constructor(private userservice: UserService, public dialog: MatDialog) { }

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort; 

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    this.getReasonData(userid);
  }
  async getReasonData(id) {
    await this.userservice.getReasonData(id).then(
      data => {
        // console.log(data['data']);
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
    const dialogRef = this.dialog.open(CreateReasonComponent, {
      width: '250px', disableClose: true, maxHeight: '800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        var userid = localStorage.getItem('access_id');
        this.getReasonData(userid);
      }
    });
  }



  updatedialog(id): void {
    this.userservice.getReasonDetailData(id).then(data => {
      if (data) {
        const dialogRef = this.dialog.open(CreateReasonComponent, {
          width: '250px', disableClose: true, data: data['data']
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.event == 'Update') {
            var userid = localStorage.getItem('access_id');
            this.getReasonData(userid);
          }
        });
      }
    },
      err => {
        console.log('error');
      })
  }

  async deleteData(id) {
    const dialogRef = this.dialog.open(CreateReasonComponent, {
      width: '340px', disableClose: true, data: { action: 'delete', id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        var userid = localStorage.getItem('access_id');
        this.getReasonData(userid);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

}

@Component({
  selector: 'app-create-reason',
  templateUrl: './create-reason.component.html',
  styleUrls: ['./hold-calling-reason.component.css']
})
export class CreateReasonComponent implements OnInit {
  @ViewChild('parent') parent: ElementRef;
  form: FormGroup;
  submitted = false;
  addmode = true;
  editmode = false;
  deletemode = false;
  serverid=0;

  serviceErrors: any = {};
  public breakpoint: number; // Breakpoint observer code

  public addForm: FormGroup;
  wasFormChanged = false;
  private debouncedTimeout;

  constructor(
    public dialogRef: MatDialogRef<CreateReasonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HoldCallingReasonComponent,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private userservice: UserService,
    private _snackBar: MatSnackBar,
  ) { }

  public ngOnInit(): void {
    console.log(this.data);
    let userinfo = localStorage.getItem('access_id');
    if (this.data && this.data != null) {
      if (this.data['action'] == 'delete') {
        this.deletemode = true;
        this.addmode = false;
        this.serverid = this.data['id'];
      } else {
        this.serverid = 0;
        this.editmode = true;
        this.addmode = false;
        this.addForm = this.fb.group({
          reason_id: [this.data['reason_id']],
          reason_name:[this.data['reason_name']],
          
        });
      }


    } else {
      this.addmode = true
      this.editmode = false
      this.addForm = this.fb.group({
        reason_name: [null, [Validators.required]],
        agent_id: [userinfo]
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
        this.userservice.updateReasonData(data).then(data => {
          if (data) {
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
        this.userservice.saveHoldCallingReasonData(data).then(data => {
          if (data) {
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
    // console.log(id);   
    await this.userservice.deleteReasonData(id).then(
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
