import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../user.service';
import { ManagerService } from '../../manager.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgentCallFeedbackComponent } from '../agent-call-feedback/agent-call-feedback.component';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { CrudService } from '../../crud.service';
import { merge, fromEvent } from "rxjs";
import { catchError, last, map, tap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { ViewFeedbackComponent } from '../view-feedback/view-feedback.component';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-requested-report',
  templateUrl: './requested-report.component.html',
  styleUrls: ['./requested-report.component.css']
})
export class RequestedReportComponent implements OnInit {
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'reportname', 'startdate', 'enddate', 'requestdate','action'];
  Length = 0;
  isLoading = false
  apiUrl: string;
  baseUrl: string;
  constructor(private userservice: UserService,
    private managerservice: ManagerService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private userservicee: CrudService,
    private router: Router) {
      this.apiUrl = environment.apiUrl;
    this.baseUrl = window.location.origin;
     }

  
    @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.dataSource = new MatTableDataSource();
    this.getrequestedreport(userid);
  }
  getrequestedreport(id) {
    this.isLoading = true;
    this.userservice.getrequestedreport(id).then(
      sdata => {
        console.log("DATA");
        console.log(JSON.stringify(sdata));
         this.dataSource.data = sdata['data'];
        this.Length = sdata['data'].length;
        this.isLoading = false
      },
      err => {
        console.log('error');
      }
    );
  }

}
