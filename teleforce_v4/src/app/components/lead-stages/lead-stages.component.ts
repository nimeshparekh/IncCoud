import { Component, OnInit, Inject, Input, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from "ngx-toastr";
import { AuthService } from '../../auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { finalize, delay } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateStageComponent } from '../create-stage/create-stage.component';
import { LeadStagesStatusComponent } from '../lead-stages-status/lead-stages-status.component';
import { CreateLeadStagesStatusComponent } from '../create-lead-stages-status/create-lead-stages-status.component'
import { ErpService } from '../../erp.service';
import { from } from 'rxjs';


@Component({
  selector: 'app-lead-stages',
  templateUrl: './lead-stages.component.html',
  styleUrls: ['./lead-stages.component.css']
})
export class LeadStagesComponent implements OnInit {
  public contactdataSource: MatTableDataSource<any>;
  displayedColumns = ["id", "stage_name", "action"];
  contactLength = 0;
  isLoadingcon = true;
  public addCusForm: FormGroup;
  isLoading = true;
  constructor(private formBuilder: FormBuilder, private http: HttpClient,
    private router: Router, private toastr: ToastrService,
    private authAPIservice: AuthService,
    private sanitizer: DomSanitizer, private el: ElementRef,
    private route: ActivatedRoute, public dialog: MatDialog,
    private erpservice: ErpService) { }
  @ViewChild('contactpaginator') contactpaginator: MatPaginator;


  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.contactdataSource = new MatTableDataSource(); // create new object
    this.getStages()
  }
  ngAfterViewInit() {
    this.contactdataSource.paginator = this.contactpaginator;
  }
  createcontactdialog(): void {
    const dialogRef = this.dialog.open(CreateStageComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getStages();
      }
    });
  }
  createleadstatus(): void {
    const dialogRef = this.dialog.open(CreateLeadStatusComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getStages();
      }
    });
  }

  async updateagentdialog(cont_id) {
    await this.erpservice.updatestages(cont_id).then(data => {
      if (data) {
        const dialogRef = this.dialog.open(CreateStageComponent, {
          disableClose: true, data: data['data']
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.event == 'Update') {
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
    const dialogRef = this.dialog.open(CreateStageComponent, {
      disableClose: true, data: { action: 'delete', s_id: s_id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
        this.getStages();
      }
    });
  }
  createstatusdialog(id): void {
    const dialogRef = this.dialog.open(CreateLeadStagesStatusComponent, {
      disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getStages();
      }
    });
  }
  createupdatedialog(id): void {
    const dialogRef = this.dialog.open(LeadStagesStatusComponent, {
      disableClose: true, data: id
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.getStages();
      }
    });
  }

  async getStages() {
    var userid = localStorage.getItem('access_id');

    await this.erpservice.getStages(userid).then(data => {
      if (data) {

        this.contactdataSource.data = data['data'];
        this.contactLength = data['data'].length;
        this.isLoadingcon = false;
        this.isLoading = false;
      }
    },
      err => {
        console.log('error');
      })
  }


}

@Component({
  selector: 'app-lead-stages',
  templateUrl: './create-lead-status.component.html',
  styleUrls: ['./lead-stages.component.css']
})
export class CreateLeadStatusComponent implements OnInit {
  isDisabled = false;
  isLoading = false;
  submitted = false;
  public addConForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateLeadStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private erpservice: ErpService,
    private _snackBar: MatSnackBar,
  ) { }

  public ngOnInit(): void {
    let userinfo = localStorage.getItem('access_id');
    this.addConForm = this.fb.group({
      name: [null, [Validators.required]]
    })
  }

  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  // tslint:disable-next-line:no-any
 
  contactsubmit() {
    this.submitted = true;
    if (this.addConForm.invalid == true) {
      return;
    }
    else {
      let data: any = Object.assign(this.addConForm.value);
      this.erpservice.saveleadstatus(data).then(data => {
        if (data) {          
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.dialogRef.close({ event: 'Add' });
        }
      },
        err => {
          console.log('error' + err);
        })
    }

  }
  async checkleadstatus(name){
    this.erpservice.checkleadstatus(name).then(data => {
      if (data) {  
        if(data['data'].length>0){
          this._snackBar.open('Lead Status already exist!!', '', {
            duration: 2000, verticalPosition: 'top'
          });
          this.isDisabled=true;
        }else{
          this.isDisabled=false;
        }       
       
      }
    },
      err => {
        console.log('error' + err);
      })
  }
  /*async contactdelete(cont_id) {
    await this.userservice.deleteallsegments(cont_id).then(data => {
      if (data) {
        this.toastr.success('Segment Delete succesfully.');
        this.dialogRef.close({ event: 'Delete' });
      }
    },
      err => {
        console.log('error' + err);
      })
  }*/ 
}

