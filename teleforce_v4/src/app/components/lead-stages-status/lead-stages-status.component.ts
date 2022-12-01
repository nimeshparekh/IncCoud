import { Component, OnInit,ChangeDetectionStrategy,Input ,ElementRef,ViewChild,Inject} from '@angular/core';
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
import {CreateStageComponent} from '../create-stage/create-stage.component';
import {CreateLeadStagesStatusComponent} from '../create-lead-stages-status/create-lead-stages-status.component'
import { ErpService } from '../../erp.service';
import { from } from 'rxjs';
@Component({
  selector: 'app-lead-stages-status',
  templateUrl: './lead-stages-status.component.html',
  styleUrls: ['./lead-stages-status.component.css']
})
export class LeadStagesStatusComponent implements OnInit {


  public contactdataSource: MatTableDataSource<any>;
  displayedColumns = ["id","stage_status","status","action"];
  contactLength = 0;
  isLoadingcon = true;
  public addCusForm: FormGroup;
  isLoading =true;
  constructor( public dialogRef: MatDialogRef<LeadStagesStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,private http: HttpClient, 
    private router: Router,private toastr: ToastrService,
    private authAPIservice: AuthService,
    private sanitizer: DomSanitizer,private el: ElementRef,
    private route:ActivatedRoute,public dialog: MatDialog,
    private erpservice : ErpService) 
  { }
  @ViewChild('contactpaginator') contactpaginator: MatPaginator;


  ngOnInit(): void {
    console.log(this.data);
    
    var userid = localStorage.getItem('access_id');
    this.contactdataSource   = new MatTableDataSource(); // create new object
this.getStages()
  }
  ngAfterViewInit() {
    this.contactdataSource.paginator = this.contactpaginator;
  }
  createcontactdialog(): void {
    const dialogRef = this.dialog.open(CreateLeadStagesStatusComponent,{
      disableClose: true 
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Add'){
        this.getStages();
      }
    });
  }
  async updateagentdialog(cont_id) {
    await this.erpservice.getstagestatusbyid(cont_id).then(data => {
      if(data){
        const dialogRef = this.dialog.open(CreateLeadStagesStatusComponent,{
         disableClose: true,data:{data:data['data'],action:'update'}
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result.event == 'Update'){
            this.getStages();
          }
        });
      }
    },
    err => {
      console.log('error');
    })
  }

  deleteData(s_id): void {
    const dialogRef = this.dialog.open(CreateLeadStagesStatusComponent,{
      disableClose: true,data:{action:'delete',s_id:s_id} 
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event == 'Delete'){
        this.getStages();
      }
    });
  }
  openDialog(): void {
    this.dialogRef.close({event:'Cancel'});
  }
  
  async getStages(){
    var userid = localStorage.getItem('access_id');

    await this.erpservice.getStagesstatus(this.data).then(data => {
      if(data){
            
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
