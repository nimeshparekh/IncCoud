import { Component, OnInit , ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';


@Component({
  selector: 'app-supervisor-assign-agent',
  templateUrl: './supervisor-assign-agent.component.html',
  styleUrls: ['./supervisor-assign-agent.component.css']
})
export class SupervisorAssignAgentComponent implements OnInit {

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
      supervisor_account_id:[this.userid],
      UserID:[localStorage.getItem('access_id')],
      AgentID:['']
    });
    this.UnassignSupervisorAgentsList(localStorage.getItem('access_id'),this.userid)
  }
  async getAssignedSupervisorAgents(id) {
    await this.userservice.getAssignedSupervisorAgents(id).then(
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
      this.userservice.deleteSupervisorAssignAgent(id).then(
        data => {
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          // this.toastr.success(data['data']);
          this.getAssignedSupervisorAgents(this.userid);
          this.UnassignSupervisorAgentsList(localStorage.getItem('access_id'),this.userid);
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

  async UnassignSupervisorAgentsList(userid,groupid) {    
    await this.userservice.UnassignSupervisorAgentsList(userid,groupid).then(
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
        this.userservice.saveSupervisorAssignAgent(data).then(
          data => {
            //console.log(data['data']);
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.getAssignedSupervisorAgents(this.userid);
            this.UnassignSupervisorAgentsList(localStorage.getItem('access_id'),this.userid);
          },
          err => {
            console.log('error');
          }
        );
      
    }
  }



}
