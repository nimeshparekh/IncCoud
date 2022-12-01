import { Component, OnInit, ViewChild ,Inject} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import{DemoReqFeedbackComponent} from '../demo-req-feedback/demo-req-feedback.component';
import { CreateDemoreqLeadComponent } from '../create-demoreq-lead/create-demoreq-lead.component';


@Component({
  selector: 'app-demo-request',
  templateUrl: './demo-request.component.html',
  styleUrls: ['./demo-request.component.css']
})
export class DemoRequestComponent implements OnInit {
  public searchform: FormGroup;
  public dataSource: MatTableDataSource<any>;
  public manualdataSource: MatTableDataSource<any>;
  public erpSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'request_date','name','email','mobile','intrest','sms_send','email_send','auto_call','push_erp','deleted','feedback'];
  manualColumns :string []=['id', 'request_date','name','email','mobile','intrest','sms_send','email_send','auto_call','push_erp','feedback'];
  erpColumns :string []=['id', 'request_date','name','email','mobile','intrest','sms_send','email_send','feedback'];
  erpLength=0;
  manualLength=0;
  Length = 0;
  isLoading = true;

  constructor( 
    private fb: FormBuilder,
    private adminservice: AdminService,
    public dialog: MatDialog,
    private toastr: ToastrService) { }
  @ViewChild('erppaginator') erppaginator: MatPaginator;
  @ViewChild('manualpaginator') manualpaginator: MatPaginator;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit(): void {
    var currentdate = new Date();

    var userid = localStorage.getItem('access_id');

    this.manualdataSource=new MatTableDataSource();
    this.dataSource = new MatTableDataSource();
    this.erpSource=new MatTableDataSource();
    this.getDemoRequest();
    this.getDemoReqList();
    this.getERPlist();

    this.searchform = this.fb.group({
      account_id:[userid],
      startdate: [currentdate],
      enddate: [currentdate],
      mobile:[]
    });
    
  }
  searchData(){
    this.isLoading = true;
    let data: any = Object.assign(this.searchform.value);
    
    this.adminservice.searchReqData(data).then(
      data => {
      //  console.log(data['data']);
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.erpSource.data = data['erprows'];
        this.erpLength = data['erprows'].length;
        this.manualdataSource.data = data['deleterows'];
        this.manualLength = data['deleterows'].length;
        this.isLoading = false
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
      mobile:[],
      
    });
    //this.getDemoRequest();
  }
  async getERPlist() {
    await this.adminservice.getERPlist().then(
      data => {
       // console.log(data);
        
        this.erpSource.data = data['data'];
        this.erpLength = data['data'].length;
        this.isLoading = false
      },
      err => {
        console.log('error');
      }
    );
  }
  async getDemoReqList() {
    await this.adminservice.getDemoReqList().then(
      data => {
        //console.log(data);
        
        this.manualdataSource.data = data['data'];
        this.manualLength = data['data'].length;
        this.isLoading = false
      },
      err => {
        console.log('error');
      }
    );
  }

  async getDemoRequest() {
    await this.adminservice.getDemoRequest().then(
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
  pushtoerp(id){
    const dialogRef = this.dialog.open(CreateDemoreqLeadComponent, {
      width: '640px', disableClose: true, maxHeight: '800px', data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getDemoReqList();
        this.getERPlist();
      }
    });
    /*if(confirm("Are you sure to push ?")){
      this.isLoading=true;
      this.adminservice.pushtoerp(id).then(
        data=>{
          if(data['msg']=="success"){
            this.isLoading = false
            this.toastr.success('Lead added successfully.');
            this.getDemoRequest()
          }
        },
          err => {
            console.log('error');
          }

      )
    }*/
  }
  feedbackdialog(id): void {
    console.log(id);
    const dialogRef = this.dialog.open(DemoReqFeedbackComponent, {
      disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Update') {
        var userid = localStorage.getItem('access_id');
        this.getDemoRequest();
      }
    });
  }
  async deleteRequest(id){
    console.log(id);
    
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '640px', disableClose: true, data: {action:'delete',id:id}   
    }
    );  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        this.getDemoRequest();
      }
    });
  }
  ngAfterViewInit() {
    this.erpSource.paginator=this.erppaginator;
    this.dataSource.paginator = this.paginator;
    this.manualdataSource.paginator = this.manualpaginator;
    this.dataSource.sort = this.sort;
    this.erpSource.sort=this.sort;
    this.manualdataSource.sort = this.sort;

  }

}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {
  id = ''
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private adminservice: AdminService,
    private toastr: ToastrService) {}

    ngOnInit(): void {
      if(this.data!='' && this.data!=null){
        this.id = this.data.id
       
  
      }
   
  }
  async deleteRequest(id){
   
    await this.adminservice.deleteDemoRequest(id).then(
      data => {
        this.toastr.success(data['data']);
        this.dialogRef.close({event:'Delete'});
      },
      err => {
        console.log('error');
      }
    );
  }
  openDialog(): void {
    this.dialogRef.close({event:'Cancel'});
  }
}
