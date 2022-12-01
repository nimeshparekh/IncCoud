import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { LmsreportService } from '../../lmsreport.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../user.service';
import { AuthService } from '../../auth.service';
import { ErpService } from '../../erp.service';

@Component({
  selector: 'app-untouch-lead-report',
  templateUrl: './untouch-lead-report.component.html',
  styleUrls: ['./untouch-lead-report.component.css']
})
export class UntouchLeadReportComponent implements OnInit {
  isDisabled =false;
  displayedColumns: string[] = ['position', 'creation', 'modified', 'agent', 'mobile_no', 'lead_name', 'email_id', 'source', 'status'];
  public dataSource: MatTableDataSource<any>;
  isLoading = false;
  public searchform: FormGroup;
  agentarr = [];
  daysArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
  UserData;
  source = [];
  status=[];
  constructor(
    private fb: FormBuilder,
    public erpservice: ErpService,
    private userservice: UserService,
    public AuthService: AuthService,
    private lmsreportservice: LmsreportService) { }
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;


  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object
    var userid = localStorage.getItem('access_id');
    this.getAgent(userid);
    this.AuthService.getRole(localStorage.getItem('access_id')).then(
      data => {
        this.UserData = data['data']['account_type'];
        //console.log(data['data']['account_type'])
      }
    )
    var currentdate = new Date();
    this.searchform = this.fb.group({
      userid: [userid],
      days: ['', Validators.required],
      agent: [''],
      status:['']
    });
    //this.searchData();
    this.get_lead_stage_status();
  }
  getAgent(userid) {
    this.erpservice.getAgents(userid).then(
      data => {
        //console.log(data['data'])
        this.agentarr = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  async get_lead_stage_status() {
    await this.erpservice.get_lead_stage_status().then(
      data => {
        if(data['data'].length>0){
          this.status  = data['data']
        }else{
        }
      },
      err => {
        console.log('error');
      }
    );
  }

  async searchData() {    
    if (this.searchform.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {
      this.isLoading = true;
      this.isDisabled =true;
      let data: any = Object.assign(this.searchform.value);
      let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
      if(agentrole=="supervisor"){
          await this.lmsreportservice.get_supervisior_UntouchLeadReport(data).then(
            data => {
              this.dataSource.data = data['data'];
              // this.Length = data['data'].length;
              this.isLoading = false;
              this.isDisabled =false;
            },
            err => {
              console.log('error');
            }
          );
      }else{
        await this.lmsreportservice.getUntouchLeadReport(data).then(
          data => {
            this.dataSource.data = data['data'];
            // this.Length = data['data'].length;
            this.isLoading = false;
            this.isDisabled =false;
          },
          err => {
            console.log('error');
          }
        );
      }
    }
  }

  resetform() {
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      userid: [userid],
      days: ['',Validators.required],
      agent: [''],
      status:['']
    });
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }



}
