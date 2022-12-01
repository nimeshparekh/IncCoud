import { Component, OnInit ,Inject,ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { HttpClient ,HttpHeaders} from "@angular/common/http";
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SmscampaignService } from '../../smscampaign.service';


@Component({
  selector: 'app-sms-links',
  templateUrl: './sms-links.component.html',
  styleUrls: ['./sms-links.component.css']
})
export class SmsLinksComponent implements OnInit {
  searchForm: FormGroup;
  registered = false;
	submitted = false;
  importExcelForm: FormGroup;
  serviceErrors:any = {};
  config: any;
  campaigns = [];
  groups = [];
  state= [];
  category = [];
  collection = { count: 0, data: [] };
  fileUrl;
  public contactdataSource: MatTableDataSource<any>;
  displayedColumns = ["id","linkname","linkurl","action"];
  contactLength = 0;
  isLoadingcon = true;
  public addCusForm: FormGroup;
  isLoading =true;
  kyc;
  datasource=[];
  total=0;
  constructor(private formBuilder: FormBuilder,private http: HttpClient,private sanitizer: DomSanitizer,public dialog: MatDialog,private smscampaignservice:SmscampaignService) { 
    this.link_list();   
    this.config = {
      itemsPerPage: 50,
      currentPage: 1,
      totalItems: this.collection.count
    };
  }

  @ViewChild('contactpaginator') contactpaginator: MatPaginator;
  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    //this.contactdataSource   = new MatTableDataSource(); // create new object
    this.fileUrl = this.sanitizer.bypassSecurityTrustUrl('/assets/contact.xlsx');
    let loginuserinfo = localStorage.getItem('access_id');
    this.searchForm = this.formBuilder.group({
      name: [],
    });   
  }
  ngAfterViewInit() {
    this.contactdataSource.paginator = this.contactpaginator;
  }
  createcontactdialog(): void {
    const dialogRef = this.dialog.open(CreateLinkComponent,{
      disableClose: true 
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.link_list();
      }
    });
  }
  async updateagentdialog(cont_id) {    
    const dialogRef = this.dialog.open(CreateLinkComponent,{
      disableClose: true,data:cont_id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        this.link_list();
      }
    });
      
  }

  deleteagentdialog(data): void {
    const dialogRef = this.dialog.open(CreateLinkComponent,{
      width:"400px",disableClose: true,data:{action:'delete',sl_id:data.sl_id,username:data.sl_name} 
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        this.link_list();
      }
    });
  }
  
  async link_list(){
    await this.smscampaignservice.getSMSLinkList(localStorage.getItem("access_id")).then(data => {
      if(data){
        //console.log(data['data']);
        /*this.collection.count = data['count'];       
        this.collection.data = data['data'];       
        this.contactdataSource.data = data['data'];
        this.contactLength = data['data'].length;*/
        this.total = data['data'].length;
        //this.isLoadingcon = false; 
        this.isLoading =false;
        this.datasource=data['data'];
      }
    },
    err => {
      console.log('error');
    })
  }  
  Refresh(){
    this.isLoading=true;
    this.searchForm = this.formBuilder.group({
      name: [],
    });
    this.link_list();
  }
  search(){
    let data: any = Object.assign(this.searchForm.value); 
    this.smscampaignservice.searchsmslinkdata(data).then(
      data => {
        //console.log(data['data']);
        this.datasource = data['data'];
        this.total = data['data'].length;
        this.isLoading=false;
       // this.submitted=false;
      },
      err => {
        console.log('error');
      }
    );    
  }
  resetform(){
    this.searchForm.get('name').setValue('');
    this.search();
  }
  
}

@Component({
  selector: 'app-create-link',
  templateUrl: './create-link.component.html',
  styleUrls: ['./sms-links.component.css']
})
export class CreateLinkComponent implements OnInit {

  submitted = false;
  addmode = true;
  editmode = false;
  deletemode = false;
  sl_id = '';
  serviceErrors:any = {};
  public breakpoint: number; // Breakpoint observer code
  public fname: string = `Ramesh`;
  public lname: string = `Suresh`;
  public addConForm: FormGroup;
  wasFormChanged = false;
  private debouncedTimeout;

  constructor(
    public dialogRef: MatDialogRef<CreateLinkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private smscampaignservice: SmscampaignService
  ) { }

  public ngOnInit(): void {
    let userinfo = localStorage.getItem('access_id');
    if(this.data!='' && this.data!=null){
      this.addmode = false
      if(this.data.action=='delete'){
        this.deletemode = true
        this.sl_id = this.data.sl_id
      }else{
        this.editmode = true
        this.addConForm = this.fb.group({
          name: [this.data.sl_name, [Validators.required]],
          url: [this.data.sl_url, [Validators.required]],
          sl_id: [this.data.sl_id],
        })  
      }
    }else{
      this.addConForm = this.fb.group({
        name: [null, [Validators.required]],
        url: [null, [Validators.required]],
      });
    }
    this.breakpoint = window.innerWidth <= 600 ? 1 : 2; // Breakpoint observer code    
  }

  openDialog(): void {
    this.dialogRef.close({event:'Cancel'});
  }

  // tslint:disable-next-line:no-any
  public onResize(event: any): void {
    this.breakpoint = event.target.innerWidth <= 600 ? 1 : 2;
  }
  
  formChanged() {
    this.wasFormChanged = true;
  }
  contactsubmit(){
    this.submitted = true;
    if(this.addConForm.invalid == true)
  	{
  		return;
  	}
  	else
  	{  
      let data: any = Object.assign(this.addConForm.value);
      if(this.editmode){
        this.smscampaignservice.updateSMSLink(data).then(
          data => {
            this._snackBar.open(data['msg'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.dialogRef.close({ event: 'Update' });
          },
          err => {
            console.log('error');
          }
        );
      }else{
        this.smscampaignservice.saveSMSLink(data).then(
          data => {
            this._snackBar.open(data['msg'], '', {
              duration: 2000, verticalPosition: 'top'
            });
            // this.toastr.success(data['data']);
            this.dialogRef.close({ event: 'Add' });
          },
          err => {
            console.log('error');
          }
        );
      }
    }
    
  }
  async contactdelete(id){
    await this.smscampaignservice.deleteSMSLink(id).then(data => {
      if(data){
        this._snackBar.open(data['msg'], '', {
          duration: 2000, verticalPosition: 'top'
        });
        // this.toastr.success(data['data']);
        this.dialogRef.close({ event: 'Delete' });
      }
    },
    err => {
      console.log('error'+err);
    })
  }
}

