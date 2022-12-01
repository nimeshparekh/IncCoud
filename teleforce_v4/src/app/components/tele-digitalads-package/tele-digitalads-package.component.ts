import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tele-digitalads-package',
  templateUrl: './tele-digitalads-package.component.html',
  styleUrls: ['./tele-digitalads-package.component.css']
})
export class TeleDigitaladsPackageComponent implements OnInit {
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'smsplan', 'planvalue', 'action'];
  Length = 0;
  isLoading = true;
  constructor(private adminservice: AdminService, public dialog: MatDialog) { }
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    this.getAdsPackages()
  }
  async getAdsPackages() {
    await this.adminservice.getAdsPackages().then(
      data => {
        //console.log(data['data']);
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
    const dialogRef = this.dialog.open(CreateDigitaladsPackageComponent, {
      width: '640px', disableClose: true, maxHeight: '800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getAdsPackages();
      }
    });
  }



  updatedialog(id): void {
    //console.log(id);
    this.adminservice.getAdsPackageDetail(id).then(
      data => {
        //console.log(data['data'][0]);
        const dialogRef = this.dialog.open(CreateDigitaladsPackageComponent, {
          width: '640px', disableClose: true, data: data['data']
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.event == 'Update') {
            this.getAdsPackages();
          }
        });
      },
      err => {
        console.log('error');
      }
    );
  }

  async deleteData(id) {
    const dialogRef = this.dialog.open(CreateDigitaladsPackageComponent, {
      width: '640px', disableClose: true, data: { action: 'delete', id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        this.getAdsPackages();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }



}
@Component({
  selector: 'app-tele-digitalads-package',
  templateUrl: './create-digitalads-package.component.html',
  styleUrls: ['./tele-digitalads-package.component.css']
})
export class CreateDigitaladsPackageComponent implements OnInit {
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
    public dialogRef: MatDialogRef<CreateDigitaladsPackageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TeleDigitaladsPackageComponent,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private adminservice: AdminService,
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
      this.addForm = this.fb.group({
        adsid: [this.data['Adspackage_id']],
        name: [this.data['Adspackage_name'], [Validators.required]],
        value: [this.data['Adspackage_value'], [Validators.required]],
        Created_By: [userinfo]
      });

    } else {
      this.addmode = true

      this.editmode = false
      this.addForm = this.fb.group({
        name: [null, [Validators.required]],
        value: [null, [Validators.required]],
        Created_By: [userinfo]
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
        this.adminservice.updateAdsPackageData(data).then(data => {
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
        this.adminservice.saveAdsPackageData(data).then(data => {
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
    await this.adminservice.deleteAdsPackageData(id).then(
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

