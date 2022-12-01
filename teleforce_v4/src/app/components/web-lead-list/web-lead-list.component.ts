import { Component, OnInit , ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { MatDialog } from '@angular/material/dialog';
import { AgentLeadFeedbackComponent } from '../agent-lead-feedback/agent-lead-feedback.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-web-lead-list',
  templateUrl: './web-lead-list.component.html',
  styleUrls: ['./web-lead-list.component.css']
})
export class WebLeadListComponent implements OnInit {

  public searchform: FormGroup;
  public interestdataSource: MatTableDataSource<any>;
  public notinterestdataSource: MatTableDataSource<any>;
  public scheduledataSource: MatTableDataSource<any>;
  public contactedataSource: MatTableDataSource<any>;
  public notcontactedataSource: MatTableDataSource<any>;
  public convertedataSource: MatTableDataSource<any>;
  public closedataSource: MatTableDataSource<any>;

  interestColumns: string[] = ['id', 'name', 'mobile', 'email','action'];  
  interestLength = 0;
  isLoading = true;
  constructor(
    private fb: FormBuilder,
    private userservice: UserService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router,
    private basecomponent: BaseComponent

  ) { }
  @ViewChild('interestpaginator') interestpaginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {

    var currentdate = new Date();
    var userid = localStorage.getItem('access_id');
   // console.log(localStorage.getItem('access_id'));
    this.interestdataSource = new MatTableDataSource(); // create new object
     // create new object
    this.getData();
  }
  clicktocall(agentid,mobile){
    if(confirm("Are you sure to call ?")) {
      var voipstatus = localStorage.getItem('voipstatus')
      if(voipstatus=='true'){
        this.basecomponent.voipcall(mobile)
      }else{
        this.userservice.agentOutgoingCall(agentid,mobile).then(
          data => {
            if(data['err']==false){
              this._snackBar.open(data['msg'], '', {
                duration: 2000,verticalPosition: 'top'
              });
            }
          },
          err => {
            console.log('error');
          }
        );  
      }
    }
  }

  async getData() {
    var userid = localStorage.getItem('access_id');
    await this.userservice.getAgentAssignLead(userid).then(
      data => {
       this.interestdataSource.data = data['data'];
        this.interestLength = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );
  }
 

  ngAfterViewInit() {
    this.interestdataSource.paginator = this.interestpaginator;    //
  
    this.interestdataSource.sort = this.sort;
   
  }


}
