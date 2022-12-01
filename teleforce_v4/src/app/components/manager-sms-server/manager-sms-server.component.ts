import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ManagerService } from '../../manager.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-manager-sms-server',
  templateUrl: './manager-sms-server.component.html',
  styleUrls: ['./manager-sms-server.component.css']
})
export class ManagerSmsServerComponent implements OnInit {

  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'servername','servertype', 'action'];
  Length = 0;
  public addConForm: FormGroup;
  smsserverlist = [];
  managerid='';
  managername='';
  isLoading = true;  

  constructor(
    private managerservice: ManagerService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.managerid = this.route.snapshot.paramMap.get('id');
    this.dataSource = new MatTableDataSource(); // create new object
    this.getManagerSmsServer(this.managerid);
    this.addConForm = this.fb.group({
      userid:[this.managerid],
      serverForm: [null, [Validators.required]],
    });
    this.assignedSMSserverList(this.managerid);
    this.getManagerName(this.managerid);
  }
  async getManagerSmsServer(managerid) {
    await this.managerservice.getManagerSmsServer(managerid).then(
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

  assignedSMSserverList(managerid) {
    this.managerservice.getAssignSmsServer(managerid).then(
      data => {
        console.log(data['data']);
       this.smsserverlist=data['data'];       
      },
      err => {
        console.log('error');
      }
    );
  }
  
  submit() {
    let data: any = Object.assign(this.addConForm.value);
    this.managerservice.saveManagerSmsServer(data).then(
      data => { 
        this._snackBar.open(data['data'], '', {
          duration: 2000, verticalPosition: 'top'
        });
        this.getManagerSmsServer(this.managerid);
        this.assignedSMSserverList(this.managerid);        
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
       this.getManagerSmsServer(this.managerid);       
      },
      err => {
        console.log('error');
      }
    );
  }
  
  async deleteData(id) {
    if(confirm('Are you sure to delete this ?')){
      await this.managerservice.deleteAssignSmsServer(id).then(
        data => {
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });  
          this.getManagerSmsServer(this.managerid);
          this.assignedSMSserverList(this.managerid);
        },
        err => {
          console.log('error');
        }
      );
    }   
  }


}
