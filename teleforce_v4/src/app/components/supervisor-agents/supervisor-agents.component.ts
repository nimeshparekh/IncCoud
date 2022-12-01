import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { AuthService } from '../../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgentLiveStatusComponent } from '../agent-live-status/agent-live-status.component';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';


@Component({
  selector: 'app-supervisor-agents',
  templateUrl: './supervisor-agents.component.html',
  styleUrls: ['./supervisor-agents.component.css']
})
export class SupervisorAgentsComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'account_name','account_id', 'email', 'mobile','authorised_person_name','current_status','is_loggedin','action'];
  Length = 0;
  userid = localStorage.getItem("access_id");
  groupname = '';
  isLoading = true;
  public searchform: FormGroup;
  agents = []
  isDisabled = false;
  constructor(
    private userservice: UserService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    public authService: AuthService) { 
      this.getrole()
    }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    //this.getrole();
    this.getAssignedSupervisorAgents(this.userid);
    this.dataSource = new MatTableDataSource(); 
    this.searchform = this.fb.group({
      customer_id:[this.userid],
      agentname:[''],
      agentnumber:[''],
      // current_status:['']
    });  
  }
  async getAssignedSupervisorAgents(id) {
    await this.userservice.getAssignedSupervisorAgents(id).then(
      data => {
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
  }
  async getrole() {
    await this.authService.getRole(localStorage.getItem('access_id')).then(
      data => {
        if(localStorage.getItem('agent_role')=='agent') {        
          window.location.href = '/dashboard';
        }
      }).catch(function (error) {

      });
  }
  menudialog(id): void {
    const dialogRef = this.dialog.open(AgentLiveStatusComponent, {
      width: '640px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        var userid = localStorage.getItem('access_id');
        this.getAssignedSupervisorAgents(userid);
      }
    });
  }
  resetform(){
    this.isLoading = true;
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      customer_id:[userid],
      agentname:[''],
      agentnumber:[''],
      current_status:['']
    });
    this.getAssignedSupervisorAgents(userid);   
  }
  async searchData(){
    this.isLoading = true;
    this.isDisabled = true;
    let data: any = Object.assign(this.searchform.value);
    this.userservice.searchSupervisorAgent(data).then(
      data => {
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false
        this.isDisabled = false;
      },
      err => {
        console.log('error');
      }
    );
  }
  

}
