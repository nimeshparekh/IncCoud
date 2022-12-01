import { Component, OnInit,ChangeDetectionStrategy,Input,Inject ,ElementRef,ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators,AbstractControl} from "@angular/forms";
import { HttpClient ,HttpHeaders} from "@angular/common/http";
import {Router,ActivatedRoute} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import { AuthService } from '../../auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CreateSegmentComponent} from '../create-segment/create-segment.component';
import { CrudService } from '../../crud.service';
import { UserService } from '../../user.service';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-segment-list',
  templateUrl: './segment-list.component.html',
  styleUrls: ['./segment-list.component.css']
})
export class SegmentListComponent implements OnInit {

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
  displayedColumns = ["id","created_date","uid","name","action"];
  contactLength = 0;
  isLoadingcon = true;
  public addCusForm: FormGroup;
  isLoading =true;
  kyc;
  constructor(private formBuilder: FormBuilder,private http: HttpClient, private router: Router,private toastr: ToastrService,private authAPIservice: AuthService,private sanitizer: DomSanitizer,private el: ElementRef,private route:ActivatedRoute,public dialog: MatDialog,private userservice: CrudService,private Userservice: UserService) { 
    this.getSegment();   
    this.config = {
      itemsPerPage: 50,
      currentPage: 1,
      totalItems: this.collection.count
    };
  }
  @ViewChild('contactpaginator') contactpaginator: MatPaginator;
  ngOnInit() {
    var userid = localStorage.getItem('access_id');
    this.checkkyc(userid);
    this.contactdataSource   = new MatTableDataSource(); // create new object
    this.fileUrl = this.sanitizer.bypassSecurityTrustUrl('/assets/contact.xlsx');
    let loginuserinfo = localStorage.getItem('access_id');
    this.addCusForm = this.formBuilder.group({      
      userid: loginuserinfo,      
      category: ['', [Validators.required]]
    })
    

  }
  ngAfterViewInit() {
    this.contactdataSource.paginator = this.contactpaginator;
  }
  createcontactdialog(): void {
    const dialogRef = this.dialog.open(CreateSegmentComponent,{
      disableClose: true 
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.getSegment();
      }
    });
  }
  async updateagentdialog(cont_id) {
    await this.userservice.updateallsegments(cont_id).then(data => {
      if(data){
        const dialogRef = this.dialog.open(CreateSegmentComponent,{
         disableClose: true,data:data['data']
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result.event == 'Update'){
            this.getSegment();
          }
        });
      }
    },
    err => {
      console.log('error');
    })
  }

  deleteagentdialog(cont_id): void {
    const dialogRef = this.dialog.open(CreateSegmentComponent,{
      disableClose: true,data:{action:'delete',cont_id:cont_id} 
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        this.getSegment();
      }
    });
  }
  
  async deleteRequest(id){
   // console.log(id);
    
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '640px', disableClose: true, data: {action:'delete',id:id}   
    }
    );  
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        this.getSegment();
      }
    });
  }
  async getSegment(){
    let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
    let userinfo = localStorage.getItem('access_id');
    if(agentrole=="supervisor"){
      await this.userservice.getallsupervisorsegments(userinfo).then(data => {
        if(data){
          //console.log(data['data']);          
          this.collection.count = data['count'];       
          this.collection.data = data['data'];       
          this.contactdataSource.data = data['data'];
          this.contactLength = data['data'].length;
          this.isLoadingcon = false; 
          this.isLoading =false;
        }
      },
      err => {
        console.log('error');
      })
    }else{
      await this.userservice.getallsegments(userinfo).then(data => {
        if(data){
          //console.log(data['data']);
          
          this.collection.count = data['count'];       
          this.collection.data = data['data'];       
          this.contactdataSource.data = data['data'];
          this.contactLength = data['data'].length;
          this.isLoadingcon = false; 
          this.isLoading =false;
        }
      },
      err => {
        console.log('error');
      })
    }
    
  }

  pageChanged(event){
    this.config.currentPage = event;
  }
 
  readFile(fileEvent: any) {
    const file = fileEvent.target.files[0];
    if(file.type=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){

    }else{
      this.toastr.error('File type you trying to upload is not allowed.');  
    }
  }
  public doFilter = (value: string) => {
    this.contactdataSource.filter = value.trim().toLocaleLowerCase();
  }

  async checkkyc(id){
    //console.log(id);   
    await this.Userservice.getKYCStatus(id).then(
      data => {
        if(data['data'].length>0){
          if(data['data'][0].kyc_status==1 || data['data'][0].status==1){
          
          }else{
            this.router.navigate(['/kyc-document-upload']);
          }
        }else{
          this.router.navigate(['/kyc-document-upload']);
        }
                
      },
      err => {
        console.log('error');
      }
    );
  }

}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./segment-list.component.css']

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
   
    await this.adminservice.deletesegemntreq(id).then(
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
