import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { HttpClient ,HttpHeaders} from "@angular/common/http";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManagerService } from '../../manager.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-manager-number-history',
  templateUrl: './manager-number-history.component.html',
  styleUrls: ['./manager-number-history.component.css']
})
export class ManagerNumberHistoryComponent implements OnInit {

  public scheduledataSource: MatTableDataSource<any>;
  public dataSource: MatTableDataSource<any>;
  public ivrdataSource: MatTableDataSource<any>;
  ivrColumns: string[] = ['id', 'ivrid', 'ivrname', 'extension'];
  ivrLength =0

  scheduleColumns: string[] = ['id', 'calltime', 'callername', 'callerno', 'duration', 'type',  'status', 'agent', 'feedback', 'note'];
  dataColumns: string[] = ['id', 'name','callernumber', 'callstatus', 'calldate'];
  scheduleLength = 0;
  dataLength = 0;
  isLoading = true;
  calluserid;
  timezone = localStorage.getItem('timezone')?localStorage.getItem('timezone'):'+5:30'
  tablabel="History"
  calltype=this.data.calltype
  constructor(
    public dialogRef: MatDialogRef<ManagerNumberHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private managerservice: ManagerService,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
  ) { }
  @ViewChild('schedulepaginator') schedulepaginator: MatPaginator;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator') ivrpaginator: MatPaginator;


  ngOnInit(): void {
    //console.log("data",this.data);
    this.ivrdataSource = new MatTableDataSource()
    this.scheduledataSource = new MatTableDataSource(); // create new object
    this.dataSource = new MatTableDataSource(); // create new object
    this.getCalldetailhistory(this.data.id);    
  }
  async getCalldetailhistory(userid) {
    this.calluserid = userid;
    await this.managerservice.getCallloghistory(userid).then(
      data => {
        //console.log('manual:' + data['data']);
        this.scheduledataSource.data = data['data'];
        this.scheduleLength = data['data'].length;
        this.isLoading=false;
      },
      err => {
        console.log('error');
      }
    );
  }
  async getCallRoutingDetail(cdrid) {
    await this.managerservice.getCallRoutingDetail(cdrid).then(
      data => {
        //console.log('manual:' + data['data']);
        this.dataSource.data = data['data'];
        this.dataLength = data['data'].length;
        this.isLoading=false;
      },
      err => {
        console.log('error');
      }
    );
  }
  async getIVRRoutingDetail(cdrid) {
    await this.managerservice.getIVRRoutingDetail(cdrid).then(
      data => {
        //console.log('manual:' + data['data']);
        this.ivrdataSource.data = data['data'];
        this.ivrLength = data['data'].length;
        this.isLoading=false;
      },
      err => {
        console.log('error');
      }
    );
  }
  ngAfterViewInit() {
    this.scheduledataSource.paginator = this.schedulepaginator;
    this.dataSource.paginator = this.paginator;
    this.ivrdataSource.paginator = this.ivrpaginator;

  }
  openDialog(): void {
    this.dialogRef.close({event:'Cancel'});
  }
  onTabClick(event) {
    //console.log(event.tab.textLabel);
    this.tablabel = event.tab.textLabel;
    if (event.tab.textLabel == 'History') {
      this.getCalldetailhistory(this.data.id);  
    }
    if (event.tab.textLabel == 'Routing Detail') {
      this.getCallRoutingDetail(this.data.id);
    }
    if (event.tab.textLabel == 'IVR Routing Detail') {
      this.getIVRRoutingDetail(this.data.id);
    }
  }
  

  // async audiodownloadzip(){
  //   await this.managerservice.getcalllogaudio(this.calluserid).then(
  //     data => {
  //       //console.log('manual:' + data['data']);
  //     },
  //     err => {
  //       console.log('error');
  //     }
  //   );

  // }

}
