import { Component, OnInit , ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';


@Component({
  selector: 'app-lead-tag-assign-agent',
  templateUrl: './lead-tag-assign-agent.component.html',
  styleUrls: ['./lead-tag-assign-agent.component.css']
})
export class LeadTagAssignAgentComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'name', 'action'];
  Length = 0;
  userid = this.route.snapshot.paramMap.get('id');
  groupname = '';
  isLoading = true;
  public searchform: FormGroup;
  agents=[]


  constructor(private userservice: UserService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,) { }

    @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.getAssignedSupervisorAgents(this.userid);
    this.dataSource = new MatTableDataSource();
    this.getAgentDetail(this.userid);

    this.searchform = this.fb.group({
      tag_id:[this.userid],
      account_id:[localStorage.getItem('access_id')],
      agent_id:['']
    });
    this.UnassignLeadTagAgentsList(localStorage.getItem('access_id'),this.userid)
  }
  async getAssignedSupervisorAgents(id) {
    await this.userservice.getLeadTagAssignAgents(id).then(
      data => {
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading=false;
      },
      err => {
        console.log('error');
      }
    );
  }
  

  async deleteData(id) {
    if(confirm('Are you sure to delete this assign agent?')){
      this.userservice.deleteLeadTagAssignAgent(id).then(
        data => {
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          // this.toastr.success(data['data']);
          this.getAssignedSupervisorAgents(this.userid);
          this.UnassignLeadTagAgentsList(localStorage.getItem('access_id'),this.userid);
          this.searchform.get('AgentID').setValue('');
        },
        err => {
          console.log('error');
        }
      );

    }
  }

  getAgentDetail(id) {
    this.userservice.getAgentDetail(id).then(
      data => {
        console.log(data['data']);
        this.groupname = data['data'].account_name;
      },
      err => {
        console.log('error');
      }
    );
  } 

  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async UnassignLeadTagAgentsList(userid,tagid) {    
    await this.userservice.UnassignLeadTagAgentsList(userid,tagid).then(
      data => {
       // console.log(data['data']);
        this.agents = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  searchData(){
    if (this.searchform.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {
      let data: any = Object.assign(this.searchform.value);
      //console.log(data);
        this.userservice.saveLeadTagAssignAgent(data).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.getAssignedSupervisorAgents(this.userid);
            this.UnassignLeadTagAgentsList(localStorage.getItem('access_id'),this.userid);
          },
          err => {
            console.log('error');
          }
        );
      
    }
  }



}
