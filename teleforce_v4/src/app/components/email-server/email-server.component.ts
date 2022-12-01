import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-email-server',
  templateUrl: './email-server.component.html',
  styleUrls: ['./email-server.component.css']
})
export class EmailServerComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'server_name','smtp_server', 'smtp_username',  'action'];
  Length = 0;
  isLoading = true;

  constructor(private userservice: UserService, public dialog: MatDialog) { }

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    this.getEmailServerData(userid);
  }
  async getEmailServerData(id) {
    await this.userservice.getEmailServerData(id).then(
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
    const dialogRef = this.dialog.open(CreateMemailServerComponent, {
      width: '640px', disableClose: true, maxHeight: '800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        var userid = localStorage.getItem('access_id');
        this.getEmailServerData(userid);
      }
    });
  }



  updatedialog(id): void {
    this.userservice.getEmailServerDetail(id).then(data => {
      if (data) {
        const dialogRef = this.dialog.open(CreateMemailServerComponent, {
          width: '640px', disableClose: true, data: data['data']
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.event == 'Update') {
            var userid = localStorage.getItem('access_id');
            this.getEmailServerData(userid);
          }
        });
      }
    },
      err => {
        console.log('error');
      })
  }

  async deleteData(id) {
    const dialogRef = this.dialog.open(CreateMemailServerComponent, {
      width: '340px', disableClose: true, data: { action: 'delete', id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        var userid = localStorage.getItem('access_id');
        this.getEmailServerData(userid);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}

@Component({
  selector: 'app-email-server',
  templateUrl: './create-memail-server.component.html',
  styleUrls: ['./email-server.component.css']
})
export class CreateMemailServerComponent implements OnInit {
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
  isDisabled=false;
  constructor(
    public dialogRef: MatDialogRef<CreateMemailServerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmailServerComponent,
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
          server_id: [this.data['server_id']],
          server_name:[this.data['server_name']],
          smtp_server: [this.data['smtp_server'], [Validators.required]],
          smtp_port: [this.data['smtp_port'], [Validators.required]],
          smtp_username: [this.data['smtp_username'], [Validators.required]],
          smtp_password: [this.data['smtp_password'], [Validators.required]],
          // perday_limit: [this.data['perday_limit'], [Validators.required]],
          // attachment_size: [this.data['attachment_size'], [Validators.required]],
          account_id: [userinfo],
          // imap_server: [this.data['imap_server'], [Validators.required]],
          // imap_port: [this.data['imap_port'], [Validators.required]],
          // imap_username: [this.data['imap_username'], [Validators.required]],
          // imap_password: [this.data['imap_password'], [Validators.required]],
        });
      }


    } else {
      this.addmode = true
      this.editmode = false
      this.addForm = this.fb.group({
        smtp_server: [null, [Validators.required]],
        smtp_port: [null, [Validators.required]],
        smtp_username: [null, [Validators.required]],
        smtp_password: [null, [Validators.required]],
        // perday_limit: [null, [Validators.required]],
        // attachment_size: [null, [Validators.required]],
        account_id: [userinfo],
        // imap_server: [null, [Validators.required]],
        // imap_port: [null, [Validators.required]],
        // imap_username: [null, [Validators.required]],
        // imap_password: [null, [Validators.required]],
        server_name:[null,[Validators.required]]
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
        this.userservice.updateEmailserverData(data).then(data => {
          if (data) {
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.isDisabled=false;
            this.dialogRef.close({ event: 'Update' });
          }
        },
          err => {
            console.log('error');
          })
      } else {
        this.userservice.saveEmailServerData(data).then(data => {
          if (data) {
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.isDisabled=false;
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
    await this.userservice.deleteEmailServerData(id).then(
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
