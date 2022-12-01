import { Component, OnInit,ViewChild,Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AgentCallFeedbackComponent } from '../agent-call-feedback/agent-call-feedback.component';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {Router} from "@angular/router";


@Component({
  selector: 'app-miss-call',
  templateUrl: './miss-call.component.html',
  styleUrls: ['./miss-call.component.css']
})
export class MissCallComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
 displayedColumns: string[] = ['id', 'did',  'calltime','name', 'number', 'duration','action'];//'feedback'
  Length = 0;
  isLoading = true
  public searchform: FormGroup;
  callstatus=[];
  didarr=[];
  agents=[];
  callername=[];
  calltype=[];
  lastdestination=[];  
  kyc;
  constructor(
    private userservice: UserService,
    public dialog: MatDialog,    
    private fb: FormBuilder,
    private router: Router
  ) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.checkkyc(userid);
    this.dataSource = new MatTableDataSource(); // create new object
    //this.getCallLog(userid) /* show all call log*/
    this.getCallDID(userid);
    var currentdate = new Date();
    this.searchform = this.fb.group({
      userid:[userid],
      startdate: [currentdate],
      enddate: [currentdate],
      did:[],
      callerno:[],
    });
    this.searchData();/* show current date call log*/

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  
  

  searchData(){
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    console.log(data);
    this.userservice.searchMissCallLog(data).then(
      data => {
        console.log(data['data']);
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false
      },
      err => {
        console.log('error');
      }
    );
  }
  async getCallDID(userid) {
    await this.userservice.getCallDID(userid).then(
      data => {
        this.didarr = data['data'];       
      },
      err => {
        console.log('error');
      }
    );
  }
  

  resetform(){
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      userid:[userid],
      startdate: [null],
      enddate: [null],
      did:[],
      callerno:[],
    });
    this.searchData();
  }

  feedbackdialog(id): void {
    const dialogRef = this.dialog.open(AgentCallFeedbackComponent, {
      width: '300px', disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {
       this.searchData();
      }
    });
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

}
