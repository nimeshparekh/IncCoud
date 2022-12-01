import { Component, OnInit,ViewChild,Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UserService } from '../../user.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Router} from "@angular/router";

@Component({
  selector: 'app-click-to-call',
  templateUrl: './click-to-call.component.html',
  styleUrls: ['./click-to-call.component.css']
})
export class ClickToCallComponent implements OnInit {
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'scriptname', 'domain','agentgroup', 'button_position', 'action'];
  Length = 0;
  isLoading = true;
  public addForm: FormGroup;
  agentgroups = []
  kyc;
  constructor(
    private fb: FormBuilder,
    private userservice: UserService,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    public dialog: MatDialog,
    private router: Router
  ) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.checkkyc(userid);
    this.dataSource = new MatTableDataSource(); // create new object
    this.getClicktoCallScriptList(userid);
    this.addForm = this.fb.group({
      scriptname: [null, [Validators.required]],
      domain: [null, [Validators.required]],
      agentgroup:[null, [Validators.required]],
      userid: [userid],
      button_position: ['right', [Validators.required]],
    });
    this.getagentgroup()
  }
  submit() {
    if (this.addForm.invalid == true) {
      // console.log(form.value);
      return;
    }
    else {
      let data: any = Object.assign(this.addForm.value);
      this.userservice.saveClicktoCallScript(data).then(
        data => {
          //console.log(data['data']);
          this._snackBar.open(data['data'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          let userid = localStorage.getItem('access_id');
          this.addForm = this.fb.group({
            scriptname: [null, [Validators.required]],
            domain: [null, [Validators.required]],
            agentgroup:[null, [Validators.required]],
            userid: [userid],
            button_position: ['right', [Validators.required]],
          });
          this.getClicktoCallScriptList(userid);
        },
        err => {
          console.log('error');
        }
      );
    }
  }
  async getClicktoCallScriptList(userid){
    await this.userservice.getClicktoCallScriptList(userid).then(
      data => {
        this.dataSource.data=data['data'];
        this.Length = data['data'].length;
        this.isLoading = false;        
      },
      err => {
        console.log('error');
      }
    );
  }

  deleteData(clickid){
    if (confirm("Are you sure to delete this ?")) {
      this.userservice.deleteClicktoCallScript(clickid).then(
        data => {
          let userid = localStorage.getItem('access_id');          
          this.getClicktoCallScriptList(userid);       
        },
        err => {
          console.log('error');
        }
      );
    }

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  async getagentgroup() {
    let userinfo = localStorage.getItem('access_id');
    await this.userservice.getHuntgroup(userinfo).then(data => {
      if (data) {
        this.agentgroups = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }

  viewData(id){
    const dialogRef = this.dialog.open(CodeCallComponent, {
      width: '640px', disableClose: true, data: id
    });
  }
  async checkkyc(id){
    //console.log(id);   
    await this.userservice.getKYCStatus(id).then(
      data => {
        if(data['data'][0].kyc_status==1 || data['data'][0].status==1){
          
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

// Show Code
@Component({
  selector: 'app-click-to-call',
  templateUrl: './code-call.component.html',
  styleUrls: ['./click-to-call.component.css']
})
export class CodeCallComponent implements OnInit {
  clickid = ''
  constructor(
    public dialogRef: MatDialogRef<CodeCallComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private adminservice:UserService,
  ) { }

  ngOnInit(): void {
    if(this.data!='' && this.data!=null){
      this.clickid = this.data
      console.log(this.clickid)

    }
  }
  cancelDialog(): void {
      this.dialog.closeAll();
  }
 
}
