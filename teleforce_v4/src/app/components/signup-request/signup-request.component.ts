import { Component, OnInit, ViewChild ,Inject} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {MatSort} from '@angular/material/sort';



@Component({
  selector: 'app-signup-request',
  templateUrl: './signup-request.component.html',
  styleUrls: ['./signup-request.component.css']
})
export class SignupRequestComponent implements OnInit {
  public searchform: FormGroup;

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name','email','mobile','username','password','services','created_at'];
  Length = 0;
  isLoading = true;
  constructor(
    private fb: FormBuilder,
    private adminservice: AdminService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) { }
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');

    this.dataSource = new MatTableDataSource();
    this.getsignRequest();
    this.searchform = this.fb.group({
      account_id:[userid],
      startdate: [],
      name: [],
      mobile:[],
      username:[],
      services:[]
    });

  }
  searchData(){
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    
    this.adminservice.searchsignReqData(data).then(
      data => {
      //  console.log(data['data']);
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
       
        this.isLoading = false
      },
      err => {
        console.log('error');
      }
    );
  }
  resetform(){
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      userid:[userid],
      startdate: [null],
      mobile:[],
      services:[],
      name:[],
      username:[],
      
    });
    this.getsignRequest();
  }
  async getsignRequest() {
    await this.adminservice.getsignRequest().then(
      data => {
        console.log("data",data);
        
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
