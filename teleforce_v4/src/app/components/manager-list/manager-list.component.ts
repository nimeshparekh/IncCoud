import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ManagerService } from '../../manager.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateManagerComponent } from '../create-manager/create-manager.component';
import { RenewPackageComponent } from '../renew-package/renew-package.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-manager-list',
  templateUrl: './manager-list.component.html',
  styleUrls: ['./manager-list.component.css']
})
export class ManagerListComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name','userid', 'email', 'mobile','channel','users','created_date', 'expirydate', 'action'];
  //displayedColumns: string[] = ['id', 'name', 'email', 'mobile','channel','users','usedduration', 'expirydate', 'action'];
  Length = 0;
  isLoading = true;
  public searchform: FormGroup;
  isDisabled=false;
  constructor(
    private managerservice: ManagerService,
    public dialog: MatDialog,    
    private _snackBar: MatSnackBar,
    public router: Router,
    private fb: FormBuilder,) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    this.getManagers(userid)
    this.searchform = this.fb.group({
      customer_id:[userid],
      agentname:[''],
      userid:[''],
      agentnumber:[''],
      its_demo:[''],
      startdate:[''],
      enddate:[''],
      email:[''],
      createdstart:[],
      createdend:[]

      //current_status:['']
    });
  }
  async getManagers(userid) {
    await this.managerservice.getManagers(userid).then(
      data => {
        //console.log(data['data']);
       this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading=false;
      },
      err => {
        console.log('error');
      }
    );
  }

  Createdialog(): void {
    const dialogRef = this.dialog.open(CreateManagerComponent, {
      width: '100%', disableClose: true,maxHeight:'1000px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        var userid = localStorage.getItem('access_id');
        this.getManagers(userid);
      }
    });
  }



  updatedialog(id): void {
    const dialogRef = this.dialog.open(CreateManagerComponent, {
      width: '100%', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        var userid = localStorage.getItem('access_id');
        this.getManagers(userid);
      }
    });
  }

  renewplandialog(id): void {
    const dialogRef = this.dialog.open(RenewPackageComponent, {
      width: '100%', disableClose: true, data: id,maxHeight:'700px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        var userid = localStorage.getItem('access_id');
        this.getManagers(userid);
      }
    });
  }

  async deleteData(id){
    const dialogRef = this.dialog.open(CreateManagerComponent, {
      width: '640px', disableClose: true, data: {action:'delete',id:id}
    });  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        var userid = localStorage.getItem('access_id');
        this.getManagers(userid);
      }
    });
  }
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  directlogin(username){
    this.managerservice.directLogin({managername:username,isadmin:true}).then(
      data => {
        console.log(data);
        this._snackBar.open('Login Successful !!', '', {
          duration: 2000,
        });
        const path = '/dashboard/';
        this.router.navigate([path]);
        window.location.href = '/dashboard/';
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
  getAuthKey(userid){
    //console.log(userid);
    if(confirm("Are you sure to generate key?")){
      this.managerservice.getAuthKey(userid).then(
        data => {
          //console.log('msg::'+data['msg']);
          this._snackBar.open(data['msg'], '', {
            duration: 2000,
          });        
        },
        err => {
          console.log('error');
        });
    }
  }
  resetform(){
    var userid = localStorage.getItem('access_id');

    this.searchform = this.fb.group({
      customer_id:[userid],
      agentname:[''],
      userid:[],
      agentnumber:[''],
      its_demo:[''],
      startdate:[''],
      enddate:[''],
      email:[''],
      createdstart:[],
      createdend:[]

      //current_status:['']
    });
    this.getManagers(userid);
  }
  searchData(){
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    
  
    this.managerservice.searchmanagaerdata(data).then(
      data => {
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false
      },
      err => {
        console.log('error');
      }
    );
  }
}
