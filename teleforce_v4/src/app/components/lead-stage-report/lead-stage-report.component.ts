import { Component, OnInit , ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { LmsreportService } from '../../lmsreport.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../user.service';
import { AuthService } from '../../auth.service';
import { ErpService } from '../../erp.service';

@Component({
  selector: 'app-lead-stage-report',
  templateUrl: './lead-stage-report.component.html',
  styleUrls: ['./lead-stage-report.component.css']
})
export class LeadStageReportComponent implements OnInit {
  isDisabled=false;
  displayedColumns: string[] = ['position','creation', 'agent', 'mobile_no', 'lead_name', 'email_id', 'source', 'status','stage'];
  public dataSource: MatTableDataSource<any>;
  isLoading = false;
  public searchform: FormGroup;
  agentarr = [];
  stageArr = [];
  stageleads = [];
  UserData;
  source = [];
  constructor(
    private fb: FormBuilder,
    public erpservice: ErpService,
    private userservice: UserService,
    public AuthService: AuthService,
    private lmsreportservice :LmsreportService) { }
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
      startdate: [new Date(),Validators.required],
      enddate: [new Date(),Validators.required],
      agent: [''],
      stage: ['']
    });
    this.searchData();
    this.getStages();
  }

  
  getAgent(userid) {
    let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
    if(agentrole=="supervisor"){
       this.userservice.getAssignedSupervisorAgents(userid).then(
        data => {
          this.agentarr = data['data'];
      
        },
        err => {
          console.log('error');
        }
      );
    }
    else{
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
  }

  async searchData() {
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
  
    this.isDisabled=true;
    let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
    if(agentrole=="supervisor"){
        await this.lmsreportservice.get_supervisoir_leadstagereport(data).then(
          data => {
            console.log("Get Lead");
            console.log(data["data"]);
            this.dataSource.data = data['data'];
            // this.Length = data['data'].length;
            this.isLoading = false;
            this.isDisabled = false;
          },
          err => {
            console.log('error');
          }
        );
        await this.lmsreportservice.get_supervisior_lead_by_stage_report(data).then(
          data => {
          
            this.stageleads = data['data'];

          },
          err => {
            console.log('error');
          }
        );
    }
    else{
      await this.lmsreportservice.getLeadStageReport(data).then(
        data => {
          console.log("Get Lead");
          console.log(data["data"]);
          this.dataSource.data = data['data'];
          // this.Length = data['data'].length;
          this.isLoading = false;
          this.isDisabled = false;
        },
        err => {
          console.log('error');
        }
      );
      await this.lmsreportservice.getLeadByStageReport(data).then(
        data => {
        
          this.stageleads = data['data'];

        },
        err => {
          console.log('error');
        }
      );

    }
    }
    resetform(){
      var userid = localStorage.getItem('access_id');
      this.searchform = this.fb.group({
        userid: [userid],
        startdate: [new Date(),Validators.required],
        enddate: [new Date(),Validators.required],
        agent: [''],
        stage: ['']
      });
    }
    async getStages(){
      var userid = localStorage.getItem('access_id');
      let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
      if(agentrole=="supervisor"){
      await this.erpservice.get_supervisor_Stages(userid).then(data => {
        if(data){
          this.stageArr=data['data'];
        }
      },
      err => {
        console.log('error');
      })
    }
      else{
        await this.erpservice.getStages(userid).then(data => {
          if(data){
            this.stageArr=data['data'];
          }
        },
        err => {
          console.log('error');
        })
      }
    }
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }


}
