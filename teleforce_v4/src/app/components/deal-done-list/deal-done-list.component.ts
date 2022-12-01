import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CreateAdminEmailComponent } from '../create-admin-email/create-admin-email.component'
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-deal-done-list',
  templateUrl: './deal-done-list.component.html',
  styleUrls: ['./deal-done-list.component.css']
})
export class DealDoneListComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'date', 'lead_name', 'companyname','project','plotvalue','booking_amount','payment_date','source'];
  Length = 0;
  isLoading = true;
  public searchform: FormGroup;
  constructor(private userservice: UserService, public dialog: MatDialog,
    private fb: FormBuilder,) { }
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('paginator') paginator: MatPaginator;


  /*constructor(
    private fb: FormBuilder,
    private adminservice: AdminService,
    private _snackBar: MatSnackBar,
    private http: HttpClient) { }*/

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    //var userid = 2703;
    this.searchform = this.fb.group({
      agent_id: [userid],
      startdate: [new Date()],
      enddate: [new Date()],

    });
    this.getdata();
    /*this.dataSource.data = [{"id":"186","name":"Pc -Suraj P Jain","email":"jainsuraj29@gmail.com","mobile":"9687796144","officialmobile":"","area":"","city":"Ahmedabad","gender":"Male","username":"9687796144","password":"9687796144","joiningdate":"2018-04-02","status":"Active","parent":"0","state":"","acrmemployeeid":""}];
        this.Length = 1;
        this.isLoading = false;*/
  }

  /*Createdialog() {
    const dialogRef = this.dialog.open(CreateConsultantComponent, {
      width: '1200px', disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getdata();
    });
  }
  updatedialog(id) {
    const dialogRef = this.dialog.open(CreateConsultantComponent, {
      width: '1200px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getdata();
    });
  }*/

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  getdata() {
    let data: any = Object.assign(this.searchform.value);
    this.userservice.getDholeraAgentDealDoneData(data).then(
      data => {
        //console.log(data['data']['data']);
        if(data['data']){
          this.dataSource.data = data['data'];
          this.Length = data['data'].length;
        }

        this.isLoading = false;
       
      },
      err => {
        console.log('error');
      }
    );
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  resetform() {
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      agent_id: [userid],
      startdate: [],
      enddate: [],
    });
    this.getdata();
  }
  searchData(){
    this.getdata();
  }

}
