import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-asterisk-server',
  templateUrl: './asterisk-server.component.html',
  styleUrls: ['./asterisk-server.component.css']
})
export class AsteriskServerComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'server_name', 'mysql_username', 'action'];
  Length = 0;
  isLoading = true;

  constructor(private adminservice: AdminService, public dialog: MatDialog) { }

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    //var userid = localStorage.getItem('access_id');
    this.getEmailServerData();
  }
  async getEmailServerData() {
    await this.adminservice.getAsteriskServerData().then(
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
    const dialogRef = this.dialog.open(CreateAsteriskServerComponent, {
      width: '640px', disableClose: true, maxHeight: '800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        // var userid = localStorage.getItem('access_id');
        this.getEmailServerData();
      }
    });
  }



  updatedialog(id): void {
    this.adminservice.getAsteriskServerDetail(id).then(data => {
      if (data) {
        const dialogRef = this.dialog.open(CreateAsteriskServerComponent, {
          width: '640px', disableClose: true, data: data['data'][0]
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.event == 'Update') {
            //var userid = localStorage.getItem('access_id');
            this.getEmailServerData();
          }
        });
      }
    },
      err => {
        console.log('error');
      })
  }

  async deleteData(id) {
    const dialogRef = this.dialog.open(CreateAsteriskServerComponent, {
      width: '340px', disableClose: true, data: { action: 'delete', id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        //var userid = localStorage.getItem('access_id');
        this.getEmailServerData();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}

@Component({
  selector: 'app-asterisk-server',
  templateUrl: './create-asterisk-server.component.html',
  styleUrls: ['./asterisk-server.component.css']
})
export class CreateAsteriskServerComponent implements OnInit {
  @ViewChild('parent') parent: ElementRef;
  form: FormGroup;
  submitted = false;
  addmode = true;
  editmode = false;
  deletemode = false;
  serverid = 0;

  serviceErrors: any = {};
  public breakpoint: number; // Breakpoint observer code

  public addForm: FormGroup;
  wasFormChanged = false;
  private debouncedTimeout;

  constructor(
    public dialogRef: MatDialogRef<CreateAsteriskServerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AsteriskServerComponent,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private adminservice: AdminService,
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
          server_name: [this.data['server_name']],
          server_ip: [this.data['server_ip'], [Validators.required]],
          server_username: [this.data['server_username'], [Validators.required]],
          server_password: [this.data['server_password'], [Validators.required]],  
          mysql_username: [this.data['server_mysql_username'], [Validators.required]],
          mysql_password: [this.data['server_mysql_password'], [Validators.required]],
          database_name: [this.data['server_database_name'], [Validators.required]],
          mysql_host: [this.data['server_mysql_host'], [Validators.required]],
          sip_host: [this.data['sip_host'], [Validators.required]],
          ari_url: [this.data['ari_url'], [Validators.required]],
          ari_username: [this.data['ari_username'], [Validators.required]],
          ari_password: [this.data['ari_password'], [Validators.required]],
          live_domain: [this.data['live_domain']],
          account_id: [userinfo],
        });
      }


    } else {
      this.addmode = true
      this.editmode = false
      this.addForm = this.fb.group({
        server_name: [null, [Validators.required]],
        server_ip: [null, [Validators.required]],
        server_username: [null, [Validators.required]],
        server_password: [null, [Validators.required]],
        mysql_username: [null, [Validators.required]],
        mysql_password: [null, [Validators.required]],
        database_name: [null, [Validators.required]],
        mysql_host: [null, [Validators.required]],
        sip_host: [null, [Validators.required]],
        ari_url: [null, [Validators.required]],
        ari_username: [null, [Validators.required]],
        ari_password: [null, [Validators.required]],
        live_domain: [null],
        account_id: [userinfo],
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
        this.adminservice.updateAsteriskserverData(data).then(data => {
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
        this.adminservice.saveAsteriskServerData(data).then(data => {
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
    await this.adminservice.deleteAsteriskServerData(id).then(
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

