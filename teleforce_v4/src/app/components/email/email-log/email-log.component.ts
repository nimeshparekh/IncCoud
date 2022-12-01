import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { EmailService } from '../../../email.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { merge } from "rxjs";
import { tap } from 'rxjs/operators';
import { LogDataSource } from "./log.datasource";
import { ManagerService } from "../../../manager.service";
import { Router, ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-email-log',
  templateUrl: './email-log.component.html',
  styleUrls: ['./email-log.component.css']
})
export class EmailLogComponent implements OnInit {

  displayedColumns: string[] = ['id', 'cname', 'date', 'deliverydate', 'email', 'status'];
  Length = 0;
  isLoading = true;
  public searchform: FormGroup;    
  public dataSource: LogDataSource;
  sortcolumn = 'date';
  sortdirection = 'DESC';
  constructor(private emailservice: EmailService,public router: Router,
    private fb: FormBuilder,  private managerservice: ManagerService,) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit() {
    this.dataSource = new LogDataSource(this.emailservice); // create new object
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      account_id: [userid],
      startdate: [new Date()],
      enddate: [new Date()],
      status:[],
      email:['']

    });
    this.getLog();
    this.accesssetting();
    //this.getSMStatus();
    let data: any = Object.assign(this.searchform.value);
    this.dataSource.loadContacts(data, this.sortcolumn, this.sortdirection, 0, 50);
  }

  async getLog() {
    //console.log(this.searchform);
    let data: any = Object.assign(this.searchform.value);
    //console.log(data);
    await this.emailservice.getEmailLog(data).then(
      data => {
        //this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );
  }


  /*async getSMStatus() {
    var userid = localStorage.getItem('access_id');
    await this.smservice.getSMStatus(userid).then(
      data => {
        this.smstatus = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }*/
  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
    merge(this.paginator.page)
      .pipe(
        tap(() => this.loadContactPage())

      )
      .subscribe();
  }


  loadContactPage() {
    let data: any = Object.assign(this.searchform.value);
    this.getLog();
    this.dataSource.loadContacts(data
      , this.sortcolumn, this.sortdirection,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }
  
  resetform() {
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      account_id: [userid],
      startdate: [''],
      enddate: [''],
      status:[],
      email:['']

    });
    this.getLog();
    let data: any = Object.assign(this.searchform.value);
    this.dataSource.loadContacts(data, this.sortcolumn, this.sortdirection, 0, 50);
  }
  searchData(){
    this.getLog();
    let data: any = Object.assign(this.searchform.value);
    this.dataSource.loadContacts(data, this.sortcolumn, this.sortdirection, 0, 50);
  }
  async accesssetting() {
    var userid = localStorage.getItem('access_id');

    await this.managerservice.getManagerDetail(userid).then(
      data => {
      
        var services = JSON.parse(data['data']['services']);
        console.log(services);
        if(services.includes('14')){
            
        }else{ 
          this.router.navigate(['/dashboard']);

        }

        // if (services.length > 0) {
        //   for (var i = 0; i < services.length; i++) {
        //     if (services[i] == '14') {
        //       console.log("yes");
              
        //     }else{

        //       this.router.navigate(['/dashboard']);

        //     }
        //   }
        // }


       
      },
      err => {
        console.log('error');
      })
  }
}

