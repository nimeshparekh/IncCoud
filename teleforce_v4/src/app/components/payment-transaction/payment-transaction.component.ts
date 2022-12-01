import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentService } from '../../payment.service';
import {Router} from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-payment-transaction',
  templateUrl: './payment-transaction.component.html',
  styleUrls: ['./payment-transaction.component.css']
})
export class PaymentTransactionComponent implements OnInit {

  isLoading=true;
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id','date','amount','txnid','productinfo', 'firstname', 'mobile','bankrefno','payumoneyid','mihpayid','resphash'];
  Length = 0;
  public searchform: FormGroup;

  constructor(
    private paymentservice: PaymentService,
    private router: Router,       
    private fb: FormBuilder,) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(); // create new object 

    var currentdate = new Date();
    this.searchform = this.fb.group({
      startdate: [currentdate],
      enddate: [currentdate],
      txnid:[],
      firstname:[],
      bankrefno:[],
      payumoneyid:[],
      mihpayid:[],
      mobile:[]
    });
    
   // this.getData();// getting all data
    this.searchData();// getting current date data
  }
  async getData(){
    this.isLoading = true;
    this.paymentservice.getPaymentData().then(
      data => {       
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading=false;        
      },
      err => {
        console.log('error');
      }
    );
  }
  resetform(){
    this.searchform = this.fb.group({
      startdate: [null],
      enddate: [null],
      txnid:[],
      firstname:[],
      bankrefno:[],
      payumoneyid:[],
      mihpayid:[],
      mobile:[],
    });   
    this.getData(); 
  }
  searchData(){
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    this.paymentservice.searchPaymentTransaction(data).then(
      data => {
         this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false
      },
      err => {
        console.log('error');
      }
    );
  }


  
}
