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
  selector: 'app-lead-source-report',
  templateUrl: './lead-source-report.component.html',
  styleUrls: ['./lead-source-report.component.css']
})
export class LeadSourceReportComponent implements OnInit {
  isDisabled =false;
  displayedColumns: string[] = ['position', 'creation', 'agent', 'mobile_no', 'lead_name', 'email_id', 'source', 'status'];
  public dataSource: MatTableDataSource<any>;
  isLoading = true;
  public searchform: FormGroup;
  agentarr = [];
  UserData;
  source = [];
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
    this.get_lead_stage_source();
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
      startdate: [new Date()],
      enddate: [new Date()],
      agent: [''],
      source: ['']
    });
    this.searchData();

  }

  async get_lead_stage_source() {
    await this.erpservice.get_lead_stage_source().then(
      data => {
        if (data['data'].length > 0) {
          this.source = data['data']
        } else {
        }
      },
      err => {
        console.log('error');
      }
    );
  }
    
  getAgent(userid) {
    this.erpservice.getAgents(userid).then(
      data => {
        console.log(data['data'])
        this.agentarr = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }

  async searchData() {
    this.isLoading = true;
    this.isDisabled =true;
    let data: any = Object.assign(this.searchform.value);
      let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
      if(agentrole=="supervisor"){
        await this.lmsreportservice.get_supervisior_LeadSourceReport(data).then(
          data => {
       
            this.dataSource.data = data['data'];
            this.isLoading = false;
            this.isDisabled =false;
    
          },
          err => {
            console.log('error');
          }
        );
      }
      else{
        await this.lmsreportservice.getLeadSourceReport(data).then(
          data => {
            // console.log("Get Lead");
            // console.log(JSON.stringify(data));
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
  resetform() {
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      userid: [userid],
      startdate: [],
      enddate: [],
      agent: [''],
      source: ['']
    });
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


}
