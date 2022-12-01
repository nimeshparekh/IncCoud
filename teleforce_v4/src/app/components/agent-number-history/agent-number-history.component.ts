import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators,AbstractControl } from '@angular/forms';
import { HttpClient ,HttpHeaders} from "@angular/common/http";
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../user.service';
import { ManagerService } from '../../manager.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-agent-number-history',
  templateUrl: './agent-number-history.component.html',
  styleUrls: ['./agent-number-history.component.css']
})
export class AgentNumberHistoryComponent implements OnInit {
  public scheduledataSource: MatTableDataSource<any>;
  scheduleColumns: string[] = ['id', 'calltime', 'callername', 'callerno', 'duration', 'type',  'status', 'agent', 'feedback', 'note'];
  scheduleLength = 0;
  isLoading = true;
  settings=[];
  constructor(
    public dialogRef: MatDialogRef<AgentNumberHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private userservice: UserService,
    private managerservice: ManagerService,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
  ) { }
  @ViewChild('schedulepaginator') schedulepaginator: MatPaginator;

  ngOnInit(): void {
    console.log("data",this.data);
    this.scheduledataSource = new MatTableDataSource(); // create new object
    this.getCalldetailhistory(this.data.id); 
    this.getManagerDetail(localStorage.getItem('access_id'));
    
  }
  async getCalldetailhistory(userid) {
    console.log(userid);
    
    await this.userservice.getCalldetailhistory(userid).then(
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
  ngAfterViewInit() {
    this.scheduledataSource.paginator = this.schedulepaginator;
  }
  openDialog(): void {
    this.dialogRef.close({event:'Cancel'});
  }

  async getManagerDetail(managerid) {
    await this.managerservice.getManagerDetail(managerid).then(
      data => {
        var settingsArr = data['settings']
        //console.log(this.settings);
        if(settingsArr.length > 0){
          var that = this
          settingsArr.map(function(elem){
            var name = elem.setting_name
            that.settings[name] = elem.setting_value
          });
        }
        
      },
      err => {
        console.log('error');
      })
  }
}
