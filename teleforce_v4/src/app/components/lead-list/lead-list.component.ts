import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { MatDialog } from '@angular/material/dialog';
import { AgentCallFeedbackComponent } from '../agent-call-feedback/agent-call-feedback.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';


@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.css']
})
export class LeadListComponent implements OnInit {
  public searchform: FormGroup;

  public interestdataSource: MatTableDataSource<any>;
  public notinterestdataSource: MatTableDataSource<any>;
  public scheduledataSource: MatTableDataSource<any>;

  interestColumns: string[] = ['id', 'calltime', 'callername', 'callerno', 'duration', 'type', 'status', 'agent', 'feedback', 'note', 'action'];
  notinterestColumns: string[] = ['id', 'calltime', 'callername', 'callerno', 'duration', 'type', 'status', 'agent', 'feedback', 'note', 'action'];
  scheduleColumns: string[] = ['id', 'calltime', 'callername', 'callerno', 'duration', 'type', 'status', 'agent', 'feedback', 'note', 'scheduledate', 'action'];
  interestLength = 0;
  notinterestLength = 0;
  scheduleLength = 0;
  isLoading = false;
  kyc;
  agents = [];
  feedbacklist=[]
  constructor(
    private fb: FormBuilder,
    private userservice: UserService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }

  @ViewChild('interestpaginator') interestpaginator: MatPaginator;
  @ViewChild('notinterestpaginator') notinterestpaginator: MatPaginator;
  @ViewChild('schedulepaginator') schedulepaginator: MatPaginator;

  ngOnInit(): void {
    var currentdate = new Date();
    this.feedbacklist = JSON.parse(localStorage.getItem('feedback'));
    var userid = localStorage.getItem('access_id');
    console.log(localStorage.getItem('access_id'));
    this.searchform = this.fb.group({
      userid: [userid],
      startdate: [currentdate],
      enddate: [currentdate],
      agentid: [''],
      callerno: [''],
      feedback: ['']

    });
    this.checkkyc(userid);
    this.interestdataSource = new MatTableDataSource(); // create new object
    this.notinterestdataSource = new MatTableDataSource(); // create new object
    this.scheduledataSource = new MatTableDataSource(); // create new object
    //this.getInterestedLead();

    this.getAgents(userid);
    //this.feedback_list(userid);


  }
  async getAgents(userid) {
    await this.userservice.getAgents(userid).then(
      data => {
        this.agents = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }
  searchData() {
    this.isLoading = true;
    this.getInterestedLead()


  }
  resetform() {
    var currentdate = new Date();

    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      userid: [userid],
      startdate: [currentdate],
      enddate: [currentdate],
      callerno: [''],
      agentid: [''],
      feedback: ['']

    });
    this.getInterestedLead();

  }

  async feedback_list(userid) {
    console.log('userid :' + userid);
    await this.userservice.getCallFeedback(userid).then(
      data => {      

        this.feedbacklist = data['data']
          
        console.log(this.feedbacklist);
        
      },
      err => {
        console.log('error');
      }
    );
  }
  async getInterestedLead() {
    let data: any = Object.assign(this.searchform.value);
    // Object.assign(data, {feedback: feedback});

    await this.userservice.getManagerLead(data).then(
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
    this.interestdataSource.paginator = this.interestpaginator;

  }

  interestfeedbackdialog(id): void {
    const dialogRef = this.dialog.open(AgentCallFeedbackComponent, {
      width: '300px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {
        var userid = localStorage.getItem('access_id');
        // this.getInterestedLead('interested');
        this.getInterestedLead()
      }
    });
  }
  clicktocall(agentid, mobile) {
    if (confirm("Are you sure to call ?")) {
      this.userservice.agentOutgoingCall(agentid, mobile).then(
        data => {
          if (data['err'] == false) {
            this._snackBar.open(data['msg'], '', {
              duration: 2000, verticalPosition: 'top'
            });
          }
        },
        err => {
          console.log('error');
        }
      );
    }
  }

  async checkkyc(id) {
    //console.log(id);   
    await this.userservice.getKYCStatus(id).then(
      data => {
        if (data['data'][0].kyc_status == 1 || data['data'][0].status == 1) {

        } else {
          this.router.navigate(['/kyc-document-upload']);
        }
      },
      err => {
        console.log('error');
      }
    );
  }


}
