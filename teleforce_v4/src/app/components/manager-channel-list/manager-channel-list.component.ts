import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ManagerService } from '../../manager.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-manager-channel-list',
  templateUrl: './manager-channel-list.component.html',
  styleUrls: ['./manager-channel-list.component.css']
})
export class ManagerChannelListComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'did', 'status', 'action'];
  Length = 0;
  public addConForm: FormGroup;
  channellist = [];
  managerid='';
  managername='';
  isLoading = true;
  constructor(
    private managerservice: ManagerService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    ) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.managerid = this.route.snapshot.paramMap.get('id');
    this.dataSource = new MatTableDataSource(); // create new object
    this.getManagerChannels(this.managerid);
    this.addConForm = this.fb.group({
      userid:[this.managerid],
      channelForm: [null, [Validators.required]],
    });
    this.assignedChannelList(this.managerid);
    this.getManagerName(this.managerid);
  }

  async getManagerChannels(managerid) {
    await this.managerservice.getManagerChannels(managerid).then(
      data => {
        console.log(data['data']);
       this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading =false;
      },
      err => {
        console.log('error');
      }
    );
  }

  async getManagerName(managerid) {
    await this.managerservice.getManagerDetail(managerid).then(
      data => {
       this.managername = data['data']['account_name'];
      
      },
      err => {
        console.log('error');
      }
    );
  }

  assignedChannelList(managerid) {
    this.managerservice.getAssignChannel(managerid).then(
      data => {
       this.channellist=data['data'];       
      },
      err => {
        console.log('error');
      }
    );
  }
  
  channelsubmit() {
    let data: any = Object.assign(this.addConForm.value);
    this.managerservice.saveManagerChannel(data).then(
      data => {  

        this._snackBar.open(data['data'], '', {
          duration: 2000, verticalPosition: 'top'
        });
        this.getManagerChannels(this.managerid);
        this.assignedChannelList(this.managerid);   
        
      },
      err => {
        console.log('error');
      }
    );
  }

  changeStatus(status,id) {
    this.managerservice.changeStatus(status,id).then(
      data => {
        this._snackBar.open(data['data'], '', {
          duration: 2000, verticalPosition: 'top'
        });  
       this.getManagerChannels(this.managerid);       
      },
      err => {
        console.log('error');
      }
    );
  }
  
  async deleteData(id) {
    if(confirm('Are you sure to delete this ?')){
      await this.managerservice.deleteAssignChannel(id).then(
        data => {
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });  
          this.getManagerChannels(this.managerid);
          this.assignedChannelList(this.managerid);
        },
        err => {
          console.log('error');
        }
      );
    }   
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
