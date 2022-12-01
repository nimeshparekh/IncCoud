import { Component, OnInit,ChangeDetectionStrategy,Input ,ElementRef,ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators,AbstractControl} from "@angular/forms";
import { HttpClient ,HttpHeaders} from "@angular/common/http";
import {Router,ActivatedRoute} from "@angular/router";
import { environment } from '../../../environments/environment';
import {ToastrService} from "ngx-toastr";
import { AuthService } from '../../auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import {finalize , delay} from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CreateSourceComponent} from '../create-source/create-source.component';
import { CrudService } from '../../crud.service';
import { UserService } from '../../user.service';
@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.css']
})
export class SourceComponent implements OnInit {

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
  displayedColumns = ["id","uid","name","action"];
  contactLength = 0;
  isLoadingcon = true;
  public addCusForm: FormGroup;
  isLoading =true;
  kyc;
  constructor(private formBuilder: FormBuilder,private http: HttpClient, private router: Router,private toastr: ToastrService,private authAPIservice: AuthService,private sanitizer: DomSanitizer,private el: ElementRef,private route:ActivatedRoute,public dialog: MatDialog,private userservice: CrudService,private Userservice: UserService) { 
    this.source_list();   
    this.config = {
      itemsPerPage: 50,
      currentPage: 1,
      totalItems: this.collection.count
    };
  }
  @ViewChild('contactpaginator') contactpaginator: MatPaginator;
  ngOnInit() {
    var userid = localStorage.getItem('access_id');
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
    const dialogRef = this.dialog.open(CreateSourceComponent,{
      disableClose: true 
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.source_list();
      }
    });
  }
  async updateagentdialog(cont_id) {
    
    const dialogRef = this.dialog.open(CreateSourceComponent,{
      disableClose: true,data:cont_id
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Update'){
        this.source_list();
      }
    });
      
  }

  deleteagentdialog(cont_id): void {
    const dialogRef = this.dialog.open(CreateSourceComponent,{
      disableClose: true,data:{action:'delete',s_id:cont_id.s_id,username:cont_id.name} 
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        this.source_list();
      }
    });
  }
  
  async source_list(){
    await this.userservice.source_list().then(data => {
      if(data){
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

  
  public doFilter = (value: string) => {
    this.contactdataSource.filter = value.trim().toLocaleLowerCase();
  }

  

}
