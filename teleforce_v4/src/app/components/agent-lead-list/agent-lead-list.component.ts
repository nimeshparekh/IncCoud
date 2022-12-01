import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { ManagerService } from '../../manager.service';
import { MatDialog } from '@angular/material/dialog';
import { AgentCallFeedbackComponent } from '../agent-call-feedback/agent-call-feedback.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-agent-lead-list',
  templateUrl: './agent-lead-list.component.html',
  styleUrls: ['./agent-lead-list.component.css']
})
export class AgentLeadListComponent implements OnInit {
  public searchform: FormGroup;

  public interestdataSource: MatTableDataSource<any>;

  interestColumns: string[] = ['id', 'calltime', 'callername', 'callerno', 'duration', 'type', 'status', 'agent', 'feedback', 'note', 'action'];
  feedbacklist =[];
  interestLength = 0;
  isLoading = true;
  kyc;
  agents = [];
  stage=[];
  isCSV=false;
  constructor(
    private fb: FormBuilder,
    private userservice: UserService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }
  @ViewChild('interestpaginator') interestpaginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    var currentdate = new Date();
    this.feedbacklist = JSON.parse(localStorage.getItem('feedback'));
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      userid: [userid],
      startdate: [currentdate],
      enddate: [currentdate],
      callerno: [''],
      feedback: ['']

    });
    this.checkkyc(userid);
    this.interestdataSource = new MatTableDataSource(); // create new object
    //this.feedbacklist_data();
    this.getInterestedLead();
  }
  async accesssetting() {
    var userid = localStorage.getItem('access_id');

    await this.userservice.accesssetting(userid).then(
      data => {
        if (data["data"][8]["setting_value"] == 1) {
          this.isCSV=true;
        }

      },
      err => {
        console.log('error');
      }
    );
  }
 feedbacklist_data() {
  var userid = localStorage.getItem('access_id');
  this.userservice.getCallFeedback(userid).then(
      data => {       
          this.feedbacklist = data['data'];          
      },
      err => {
        console.log('error');
      }
    );
  }
  async getInterestedLead() {
    let data: any = Object.assign(this.searchform.value);
    // Object.assign(data, {feedback: feedback});

    await this.userservice.getAgentLeads(data).then(
      data => {
        this.interestdataSource.data = data['data'];
        this.interestLength = data['data'].length;
        this.isLoading = false;
      
      },
      err => {
        console.log('error');
      }
    );
   await this.userservice.change_feedback_view_card_data(data).then(
      data => {
        if (data['data'].length > 0) {
          console.log(data['data'])
          this.stage = data['data']
        }
        else {
        } },
        err => {
          console.log('error');
        }
      );
  }
  // async change_feedback_view_card_data() {
  //   await this.userservice.change_feedback_view_card_data().then(
  //     data => {
  //       if (data['data'].length > 0) {
  //         console.log(data['data'])
  //         this.stage = data['data']
  //       }
  //       else {
  //       }
  //     },
  //     err => {
  //       console.log('error');
  //     }
  //   );
  // }

  resetform() {
    var currentdate = new Date();
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      userid: [userid],
      startdate: [currentdate],
      enddate: [currentdate],
      callerno: [''],
      feedback: ['']
    });
    this.getInterestedLead();
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

  searchData() {
    this.isLoading = true;
    this.getInterestedLead()


  }


}
