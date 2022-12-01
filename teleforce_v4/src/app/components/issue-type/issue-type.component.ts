import { Component, OnInit ,Inject,ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManagerService } from '../../manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../user.service';
import {MatSort} from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-issue-type',
  templateUrl: './issue-type.component.html',
  styleUrls: ['./issue-type.component.css']
})
export class IssueTypeComponent implements OnInit {

  constructor(private ManagerService: ManagerService,private userservice: UserService,public dialog: MatDialog,  
    private fb: FormBuilder,
  ) { } 
  public dataSource: MatTableDataSource<any>;
  Length = 0;
  isLoading = true;
  public searchform: FormGroup;

  displayedColumns: string[] = ['id', 'name','action'];
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit() {
    var currentdate = new Date();

    this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    this.getIssueType(userid)
  

  }
  async getIssueType(userid) {
    await this.userservice.getIssueTypeList(userid).then(
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
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
   
    this.dataSource.sort = this.sort;  }

  
    Createdialog(): void {
      const dialogRef = this.dialog.open(CreateIssueTypeComponent, {
        width: '300px', disableClose: true,maxHeight:'800px',
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result.event == 'Add'){
          var userid = localStorage.getItem('access_id');
          this.getIssueType(userid);
        }
      });
    }
  
  
  
    updatedialog(id): void {
      const dialogRef = this.dialog.open(CreateIssueTypeComponent, {
        width: '300px', disableClose: true, data: id
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result.event == 'Update'){
          var userid = localStorage.getItem('access_id');
          this.getIssueType(userid);
        }
      });
    }
  
    async deleteData(id){
      const dialogRef = this.dialog.open(CreateIssueTypeComponent, {
        width: '640px', disableClose: true, data: {action:'delete',id:id}
      });  
      dialogRef.afterClosed().subscribe(result => {
        if(result.event == 'Delete'){
          var userid = localStorage.getItem('access_id');
          this.getIssueType(userid);
        }
      });
    }

 

}

@Component({
  selector: 'app-create-issue-type',
  templateUrl: './create-issue-type.component.html',
  styleUrls: ['./issue-type.component.css']
})
export class CreateIssueTypeComponent implements OnInit {
  addmode = true;
  editmode = false;
  deletemode = false;
  did_id = '';
  submitted = false;
  public addForm: FormGroup;
  schedule=false;
  constructor(
    public dialogRef: MatDialogRef<CreateIssueTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userservice: UserService,
    private _snackBar: MatSnackBar,
  ) { }
 

  ngOnInit(): void {
   // console.log(this.data);
    
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
        this.getissuetypedetail(this.data);
      }

    }
    this.addForm = this.fb.group({
      name: ['', [Validators.required]],
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
        this.userservice.updateIssueTypeData(data).then(
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
        this.userservice.saveIssueTypeData(data).then(
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
  getissuetypedetail(id) {
    this.userservice.getIssueTypeById(id).then(
      data => {
        this.addForm = this.fb.group({
          issue_id: [data['data'][0].issue_id],
          name: [data['data'][0].issue_name, [Validators.required]]
        });        
      },
      err => {
        console.log('error');
      }
    );
  }
  async deleteData(id) {
    // console.log(id);   
    await this.userservice.deleteIssueTypeData(id).then(
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