import { Component, OnInit , ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';
import { UserService } from '../../user.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-invoice-report',
  templateUrl: './invoice-report.component.html',
  styleUrls: ['./invoice-report.component.css']
})
export class InvoiceReportComponent implements OnInit {

  public searchform: FormGroup;
  startdate;
  enddate;

  constructor(
    private reportservice: ReportService,
    private fb: FormBuilder,
    private userservice: UserService
  ) { }

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      userid:[userid],
      startdate:[null,Validators.required],
      enddate:[null,Validators.required]
    });
  }
  
  
  async searchData(){
    let data: any = Object.assign(this.searchform.value);
  await this.reportservice.createinvoice(data).then(
    data => {
     console.log(data['data']);
    },
    err => {
      console.log('error');
    }
  );

  }

}
