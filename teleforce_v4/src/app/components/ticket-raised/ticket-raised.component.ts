import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { UserService } from '../../user.service';
import { ErpService } from '../../erp.service';
import { AuthService } from '../../auth.service';
import { ManagerService } from '../../manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-ticket-raised',
  templateUrl: './ticket-raised.component.html',
  styleUrls: ['./ticket-raised.component.css']
})
export class TicketRaisedComponent implements OnInit {

  @ViewChild('parent') parent: ElementRef;
  public addForm: FormGroup;
  customerlist = [];
  issuelist = [];
  projectlist = [];
  companylist = [];
  contactlist = [];
  leadlist = [];
  serviceagreementlist = [];
  emailaccountlist = [];
  issuetypelist = [];
  editmode = false;
  addmode = true;
  image = '';
  progressbar=false;
  apiUrl:string;
  baseUrl:string;
  managerid=0;
  managers=[];
  agents=[];

  constructor(
    public dialogRef: MatDialogRef<TicketRaisedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public userservice: UserService,
    public erpservice: ErpService,
    public managerservice: ManagerService,
    private _snackBar: MatSnackBar,
    private el: ElementRef,
    public authService:AuthService
  ) {
    this.apiUrl = environment.apiUrl;
    this.baseUrl = window.location.origin;
   }

  async ngOnInit() {    
    var userid = localStorage.getItem('access_id');
    await this.getManagerDetail();
    await this.authService.getRole(localStorage.getItem('access_id')).then(
      data => {
        
        //if(data['data']['account_type']==2 || (data['data']['account_type']==1 && (data['data']['account_id']==48||data['data']['created_by']==48))){
           
       // }
       
        if(data['data']['account_type']==2 && this.managerid!=48) {
          this.getAgents(localStorage.getItem('access_id'));
        }
        if(data['data']['account_type']==1 && this.managerid!=48) {
          this.managerid=0;
        }
        
      }).catch(function (error) {
        
      });
   
    //console.log(this.managerid);
    if(this.managerid==48){
      this.getManagers();
      this.addForm = this.fb.group({
        status: ["Open"],
        subject: [null, [Validators.required]],
        priority: [null, [Validators.required]],
        issue_type: [null, [Validators.required]],
        contact_no: [null, [Validators.required]],
        email: [null, [Validators.required]],
        raised_by: [userid],
        account_id: [null, [Validators.required]],
        agent_id: [''],
        description: [null],
      });
    }else{
      this.addForm = this.fb.group({
        status: ["Open"],
        subject: [null, [Validators.required]],
        priority: [null, [Validators.required]],
        issue_type: [null, [Validators.required]],
        contact_no: [null, [Validators.required]],
        email: [null, [Validators.required]],
        raised_by: [userid],
        account_id: [userid],
        agent_id: [''],
        description: [null],
      });
    }
      
    
    this.get_issuetype();
    
  }


  async get_issuetype() {
    await this.erpservice.get_issuetype().then(
      data => {
        //console.log(data)
        this.issuetypelist = data['data'];
        //console.log(this.emailaccountlist);
      },
      err => {
        console.log('error');
      }
    );
  }


  openDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  createissue() {
    // this.submitted = true;

    if (this.addForm.invalid == true) {
      return;
    }
    else {

      let data: any = Object.assign(this.addForm.value);
      //data.description = "<div>" + data.description + "</div>";
      if (this.editmode) {
        this.userservice.updateticket(data).then(data => {
          if (data) {
            this._snackBar.open('Ticket updated successfully', '', {
              duration: 2000, verticalPosition: 'top'
            });
            this.dialogRef.close({ event: 'Update' });
          }
        },
          err => {
            console.log('error');
          })
      } else {
        data.ticket_image=this.image;
        data.managerid = this.managerid;
        this.erpservice.saveIssue(data).then(data => {
          if (data) {
            this._snackBar.open(data['data'], '', {
              duration: 2000, verticalPosition: 'top'
            });

            this.dialogRef.close({ event: 'Add' });
          }
        },
          err => {
            console.log('error');
          })
      }
    }
  }
  onUploadHeaderImage() {
    const fileUpload = document.getElementById('fileupload') as HTMLInputElement;
    fileUpload.onchange = () => {
      let formData = new FormData();
      var userid = localStorage.getItem('access_id');
      formData.append('userid', userid);
      let headerinputEl: HTMLInputElement = this.el.nativeElement.querySelector('#fileupload')
      if (headerinputEl) {
        let fileCount1: number = headerinputEl.files.length;
        if (fileCount1 > 0) {
          formData.append('ticketimg', headerinputEl.files.item(0));
          let data: any = Object.assign(this.addForm.value);
          this.userservice.uploadticketfile(formData).then(
            (tdata) => {
              this.progressbar = false;
              //data.thimage = tdata['data'];
              this.image = tdata['data'];
            });

        }
      }

    };

    fileUpload.click();
  }
  removeimage() {
    if (confirm('Are your sure to delete image?')) {
      this.image = '';
      let data: any = Object.assign(this.addForm.value);
      data.ticket_image = null;
    }
  }

  async getManagerDetail(){
    await this.managerservice.getManagerDetail(localStorage.getItem('access_id')).then(data => {
      if (data) {
        this.managerid = data['data'].account_id;
      }
    },
      err => {
        console.log('error');
      })
  }
 async getManagers(){
   await this.erpservice.getManagers().then(data => {
      if (data) {
        this.managers = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }

  async getAgents(id){
    await this.userservice.getActiveAgents(id).then(data => {
      if (data) {
        this.agents = data['data'];
      }
    },
      err => {
        console.log('error');
      })
  }

}
