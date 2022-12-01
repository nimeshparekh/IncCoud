import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { UserService } from '../../user.service';
import { CreateAgentsComponent } from '../create-agents/create-agents.component';
import { AgentLiveStatusComponent } from '../agent-live-status/agent-live-status.component';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {Router} from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManagerService } from '../../manager.service';


@Component({
  selector: 'app-agents-groups',
  templateUrl: './agents-groups.component.html',
  styleUrls: ['./agents-groups.component.css']
})
export class AgentsGroupsComponent implements OnInit {
  isDisabled=false;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'account_name','account_id', 'email', 'mobile','authorised_person_name','current_status','is_loggedin','action'];
  Length = 0;
  isLoading = true;
  public inactivedataSource: MatTableDataSource<any>;
  inactivedisplayedColumns: string[] = ['id', 'account_name','account_id', 'email', 'mobile','authorised_person_name','current_status','is_loggedin','action'];
  inactiveLength = 0;
  inactiveisLoading = true;
  public deletedataSource: MatTableDataSource<any>;
  deletedisplayedColumns: string[] = ['id', 'account_name','account_id', 'email', 'mobile','authorised_person_name','current_status','is_loggedin','lead_count','action'];
  deleteLength = 0;
  deleteisLoading = true;
  userlimit = 0;
  didarr=[];
  kyc;
  agentcount = 0;
  public searchform: FormGroup;
  currentab ="Active"

  constructor(private userservice: UserService,
    public dialog: MatDialog,
    private fb: FormBuilder,private router: Router,
    private _snackBar: MatSnackBar,
    private managerservice: ManagerService

    ) { }

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('inactivepaginator') inactivepaginator: MatPaginator;

  @ViewChild('deletepaginator') deletepaginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); 
    this.inactivedataSource = new MatTableDataSource();
    this.deletedataSource = new MatTableDataSource();// create new object
    var userid = localStorage.getItem('access_id');
    this.checkkyc(userid);
    this.getAgents(userid)
    this.getCallDID(userid);
    this.getUserLimit(userid)
    this.searchform = this.fb.group({
      did:[''],
      customer_id:[userid],
      agentname:[''],
      agentnumber:[''],
      //current_status:['']
    });
    //this.agentlocation();
    this.getActiveAgents(userid)

  }
  async getUserLimit(userid) {
    await this.userservice.Getuserlimit(userid).then(
      data => {
       this.userlimit = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  async getAgents(userid) {
    this.isDisabled=true;
    await this.userservice.getAgents(userid).then(
      data => {
       this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading=false;
        this.isDisabled=false;
      },
      err => {
        console.log('error');
      }
    );
  }
  async getinactiveAgents(userid) {
    this.isDisabled=true;
    await this.userservice.getinactiveAgents(userid).then(
      data => {
       this.inactivedataSource.data = data['data'];
        this.inactiveLength = data['data'].length;
        this.inactiveisLoading=false;
        this.isDisabled=false;
      },
      err => {
        console.log('error');
      }
    );
  }
  async getdeleteAgentdata(userid) {
    this.isDisabled=true;
    await this.userservice.getdeleteAgentdata(userid).then(
      data => {
       this.deletedataSource.data = data['data'];
        this.deleteLength = data['data'].length;
        this.deleteisLoading=false;
        this.isDisabled=false;
      },
      err => {
        console.log('error');
      }
    );
  }
  async getActiveAgents(userid) {
    await this.userservice.getActiveAgents(userid).then(
      data => {
       
        this.agentcount = data['data'].length;
        //this.isLoading=false;
      },
      err => {
        console.log('error');
      }
    );
  }


  Createdialog(): void {
    const dialogRef = this.dialog.open(CreateAgentsComponent, {
      width: '640px', disableClose: true,maxHeight:'800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        var userid = localStorage.getItem('access_id');
      //  this.getAgents(userid);
        this.getActiveAgents(userid)
        this.searchData();
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.inactivedataSource.paginator = this.inactivepaginator;

    this.deletedataSource.paginator = this.deletepaginator;

    this.dataSource.sort = this.sort;
    this.inactivedataSource.sort = this.sort;

    this.deletedataSource.sort = this.sort;

  }

  updatedialog(id): void {
    const dialogRef = this.dialog.open(CreateAgentsComponent, {
      width: '640px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        var userid = localStorage.getItem('access_id');
      //  this.getAgents(userid);
        this.getActiveAgents(userid);
        this.searchData();
      }
    });
  }

  menudialog(id): void {
    const dialogRef = this.dialog.open(AgentLiveStatusComponent, {
      width: '640px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        var userid = localStorage.getItem('access_id');
       // this.getAgents(userid);
       this.searchData();
      }
    });
  }


  async deleteData(id){
    const dialogRef = this.dialog.open(CreateAgentsComponent, {
      width: '640px', disableClose: true, data: {action:'delete',id:id}
    });  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        var userid = localStorage.getItem('access_id');
       // this.getAgents(userid);
       this.searchData();
      }
    });
  }
  
  async changepassword(id){
    const dialogRef = this.dialog.open(CreateAgentsComponent, {
      width: '300px', disableClose: true, data: {action:'password',id:id}
    });  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Password'){
        var userid = localStorage.getItem('access_id');
        this.getAgents(userid);
      }
    });
  }

  async getCallDID(userid) {
    var user = localStorage.getItem('access_id');
    await this.userservice.getCallDID(userid).then(
      data => {
        this.didarr = data['data'];  
      },
      err => {
        console.log('error');
      }
    );
  }
  onTabClick(event) {
    //console.log(event);
    var userid = localStorage.getItem('access_id');
    let data: any = Object.assign(this.searchform.value);
    this.currentab = event.tab.textLabel;
  
      this.searchData();
    


  }

  async searchData(){
    if (this.currentab == "InActive") {
      this.serachInactiveagent();
    } else if (this.currentab == "Deleted") {
      this.serachdeleteagent();
    } else {
      this.serachactiveagent();
    }

  }
serachactiveagent(){
  this.isLoading = true;
  let data: any = Object.assign(this.searchform.value);
  data.deleted = "no";
  data.status  = 0;

  this.userservice.searchAgent(data).then(
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
serachInactiveagent(){
  this.isLoading = true;
  let data: any = Object.assign(this.searchform.value);
  data.status = 1;
  data.deleted = "no";

  this.userservice.searchAgent(data).then(
    data => {
      this.inactivedataSource.data = data['data'];
      this.inactiveLength = data['data'].length;
      this.inactiveisLoading = false
    },
    err => {
      console.log('error');
    }
  );

}
serachdeleteagent(){
  this.isLoading = true;
  let data: any = Object.assign(this.searchform.value);
  data.deleted = "yes";
  data.status = null;
  this.userservice.searchAgent(data).then(
    data => {
      this.deletedataSource.data = data['data'];
      this.deleteLength = data['data'].length;
      this.deleteisLoading = false
    },
    err => {
      console.log('error');
    }
  );

}
  resetform(){
    this.isLoading = true;
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      customer_id:[userid],
      did:[''],
      agentname:[''],
      agentnumber:[''],
      current_status:['']
    });
   // this.getAgents(userid);
   this.searchData();
   
  }
  async checkkyc(id){
    //console.log(id);   
    await this.userservice.getKYCStatus(id).then(
      data => {
        if(data['data'][0].kyc_status==1 || data['data'][0].status==1){
          
        }else{
          this.router.navigate(['/kyc-document-upload']);
        }        
      },
      err => {
        console.log('error');
      }
    );
  }
 /* async agentlocation() {
    let data: any = Object.assign(this.searchform.value);
    data.agent_id=122;
    data.lat = 22.0292;
    data.long = 77.4494;
    data.number = 'A-12';
    data.address = 'Rajesh Nagar Society'
    data.state = 'Gujarat';
    data.city = 'Ahmedabad';
    data.areaname = 'Bapunagar';
    data.country = 'India';
    data.pincode = 382370;
    console.log(data);
    await this.userservice.agentlocation(data).then(
      data => {
      console.log(data['data']);
      },
      err => {
        console.log('error');
      }
    );
  }*/

  forcelogout(userid){
    if (confirm('Are you sure to logout ?')) {
      this.userservice.forcelogout(userid).then(
        data => {
          this._snackBar.open(data['msg'], '', {
            duration: 2000,
          });
          var userid = localStorage.getItem('access_id');
          this.getAgents(userid)
        },
        err => {
          console.log('error');
        }
      );
    }
  }
  assignagents(id) {
    this.router.navigate(['supervisor-assign-agent/' + id]);
  }
  async assignleads(id){
    const dialogRef = this.dialog.open(AssignLeadsActiveAgentsComponent, {
      width: '300px', disableClose: true, data: {id:id}
    });  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.searchData();
      }
    });
  }
  directlogin(username) {
    this.managerservice.supervisiordirectLogin({managername:username,isadmin:true}).then(
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
}


@Component({
  selector: 'app-assign-laeds-agent',
  templateUrl: './assign-leads-activeagent.component.html',
  styleUrls: ['./agents-groups.component.css']
})
export class AssignLeadsActiveAgentsComponent implements OnInit {
  submitted = false;
  public addConForm: FormGroup;
  agents = []
  constructor(
    public dialogRef: MatDialogRef<AssignLeadsActiveAgentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private userservice: UserService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {     
    var userid = localStorage.getItem('access_id');
    this.addConForm = this.fb.group({
      account_id: [this.data.id],
      agentid: [null,[Validators.required]],
    });   
    this.getagents();
  }
  
  async getagents() {
    let userinfo = localStorage.getItem('access_id');
    await this.userservice.getActiveAgents(userinfo).then(data => {
      if (data) {
        this.agents = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }

submit() {
    let cdata: any = Object.assign(this.addConForm.value);
    if (this.addConForm.invalid == true ) {
      return;
    }
    else {
      console.log(cdata);
      this.userservice.assignAgentLeadstoAgent(cdata).then(
        data => {
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.dialogRef.close({ event: 'Add' });
        },
        err => {
          console.log('error');
        }
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }


}