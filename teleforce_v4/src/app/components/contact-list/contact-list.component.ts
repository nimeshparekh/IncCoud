import { Component, OnInit, ChangeDetectionStrategy, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';

import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpEventType, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Router, ActivatedRoute } from "@angular/router";
import { environment } from '../../../environments/environment';
import { ToastrService } from "ngx-toastr";
import { AuthService } from '../../auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { finalize, delay } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateContactComponent } from '../create-contact/create-contact.component';
import { FileListComponent } from '../file-list/file-list.component';
import { CrudService } from '../../crud.service';
import { catchError, last, map, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription, of, from } from 'rxjs';
import { ContactDataSource } from "./contact.datasource";
import { merge, fromEvent } from "rxjs";
import { UserService } from '../../user.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 100 })),
      transition('* => void', [
        animate(300, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ContactListComponent implements OnInit {
  isDisabled=false;
  isLoading = true;
  registered = false;
  submitted = false;
  importExcelForm: FormGroup;
  serviceErrors: any = {};
  config: any;
  campaigns = [];
  groups = [];
  state = [];
  category = [];
  segname;
  search;
  selected_seg = false;
  segselect = '';
  loading = false
  collection = { count: 0, data: [] };
  fileUrl;
  name;
  conLength = 0
  kyc;
  public contactdataSource: ContactDataSource;
  // public condataSource: ContactDataSource;
  sortcolumn='category';
  sortdirection='ASC';


  // displayedColumns = ["id","name", "mobile","email","address","city","state","category","action"];
  displayedColumns: string[] = ['id', 'name', 'email', 'mobile', 'city', 'state', 'category', 'action'];

  contactLength = 0;
  isLoadingcon = true;
  public addCusForm: FormGroup;
  searchform: FormGroup;

  not = 'not_sel';
  /** Link text */
  @Input() text = 'Upload CSV';
  /** Name used in form which will be sent in HTTP request. */
  @Input() param = 'file';
  /** Target URL for file uploading. */
  @Input() target = environment.apiUrl + '/contacts/upload';
  /** File extension that accepted, same as 'accept' of <input type="file" />. 
      By the default, it's set to 'image/*'. */
  @Input() accept = '.csv';
  /** Allow you to add handler after its completion. Bubble up response text from remote. */
  @Output() complete = new EventEmitter<string>();

  public files: Array<FileUploadModel> = [];

  constructor(private _snackBar: MatSnackBar, private _http: HttpClient, private formBuilder: FormBuilder, private http: HttpClient, private router: Router, private toastr: ToastrService, private authAPIservice: AuthService, private sanitizer: DomSanitizer, private el: ElementRef, private route: ActivatedRoute, public dialog: MatDialog, private userservice: CrudService, private fb: FormBuilder,private Userservice: UserService) {
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
    this.getContactCategory();
    this.getstatedata();
    this.contactdataSource = new ContactDataSource(this.userservice);
    //this.contactdataSource.loadContacts({ segment: '' },this.sortcolumn,this.sortdirection, 0, 50);

    // this.contactdataSource   = new MatTableDataSource(); // create new object
    this.fileUrl = this.sanitizer.bypassSecurityTrustUrl('/assets/contact.xlsx');
    let loginuserinfo = localStorage.getItem('access_id');
    this.addCusForm = this.formBuilder.group({
      userid: loginuserinfo,
      category: ['', [Validators.required]]
    })

    let userinfo = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      customer_id: [userinfo],
      name: [''],
      mobile: [''],
      email: [''],
      city: [''],
      state: [''],
      category: [''],
    });
    //this.searchData()
  }
  ngAfterViewInit() {
    // this.contactdataSource.paginator = this.contactpaginator;
    merge(this.contactpaginator.page)
      .pipe(
        tap(() => this.loadContactPage())
      )
      .subscribe();
  }
  createcontactdialog(): void {
    const dialogRef = this.dialog.open(CreateContactComponent, {
      width: '640px', disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.loadContactPage();
      }
    });
  }
  createfiledialog(): void {
    const dialogRef = this.dialog.open(FileListComponent, {
      width: '640px', disableClose: true,data:'Contact'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
      }
    });
  }

  updateagentdialog(conid): void {
    this.http.get(environment.apiUrl + '/contacts/getcontactdetail/' + conid).subscribe((data: any) => {
      const dialogRef = this.dialog.open(CreateContactComponent, {
        width: '50%',disableClose: true, data: data['data']
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.event == 'Update') {
          this.loadContactPage();
        }
      });
    });
  }

  searchData() {
    this.isLoading = true;
    this.isDisabled =true;
    let data: any = Object.assign(this.searchform.value);
    //console.log(data);
    data.agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent'
    this.userservice.searchCallLog(data).then(
      data => {
        //console.log(data['data']);
        // this.contactdataSource = data['data'];
        this.conLength = data['data'][0].totalcontact;
        // this.isLoading = false
        // this.contactdataSource.loadContacts(data,0, 50);
        this.isDisabled =false;
      },
      err => {
        console.log('error');
      }
    );
  }

  resetform() {
    var userid = localStorage.getItem('access_id');
    this.searchform = this.fb.group({
      customer_id: [userid],
      name: [],
      mobile: [],
      email: [],
      city: [],
      state: [],
      category: [],
    });
    let data: any = Object.assign(this.searchform.value);
    // this.getContacts();
    data.agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent'
    this.contactdataSource.loadContacts(data,this.sortcolumn,this.sortdirection, 0, 50);

  }

  getContactCategory() {
    let userinfo = localStorage.getItem('access_id');
    let agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent';
    if(agentrole=='supervisor'){
      this.userservice.getsupervisorallsegments(userinfo).then(
        data => {
          this.category = data['data'];
        },
        err => {
          console.log('error');
        }
      );
    }else{
      this.http.get(environment.apiUrl + '/contacts/getCategorylist/' + userinfo).subscribe((data: any) => {
        this.category = data['data'];
        //console.log(this.category);
  
        //this.totalanonymous = data['data'].sccount; 
      });
    }    
  }
  getstatedata(){
    let userinfo = localStorage.getItem('access_id');
    this.http.get(environment.apiUrl + '/contacts/getStatedata/').subscribe((data: any) => {
      this.state = data['data']; 
    });
  }

  deleteagentdialog(cont_id, username): void {
    const dialogRef = this.dialog.open(CreateContactComponent, {
      width: '640px', disableClose: true, data: { action: 'delete', cont_id: cont_id, username: username }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Delete') {
      }
    });
  }
  // async getContacts(){
  //   let userinfo = localStorage.getItem('access_id');
  //   await this.userservice.getallcontacts(userinfo).then(data => {
  //     if(data){
  //       this.collection.count = data['count'];       
  //         this.collection.data = data['data'];       
  //         // this.contactdataSource = data['data'];
  //         this.search = data['data'];
  //         this.contactLength = data['data'].length;
  //         this.isLoading =false;
  //         this.segname = data;
  //         console.log("aavya"+(this.contactdataSource))

  //         // console.log("datttttttttta"+JSON.stringify(data))
  //     }
  //   },
  //   err => {
  //     console.log('error'+err);
  //   })
  // }


  pageChanged(event) {
    this.config.currentPage = event;
  }

  public doFilter = (value: string) => {
    // this.contactdataSource.filter = value.trim().toLocaleLowerCase();
  }

  selectedSegment(value) {
    if (value != undefined) {
      this.selected_seg = true;
      this.segselect = value
    } else {
      this.selected_seg = false;
    }
  }

  convertFile() {
    const input = document.getElementById('fileInput');

    const reader = new FileReader();
    reader.onload = () => {
      let text = reader.result;
    };
  };

  onUploadCsv() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.name = file.name;
        this.files.push({
          data: file, state: 'in',
          inProgress: false, progress: 0, canRetry: false, canCancel: true
        });
      }
      this.uploadFiles();
      this.loading = true
    };
    fileUpload.click();
  }

  loadContactPage() {
    let data: any = Object.assign(this.searchform.value);
    data.agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent'
    this.searchData();
    this.contactdataSource.loadContacts(data
      ,this.sortcolumn,this.sortdirection,
      this.contactpaginator.pageIndex,
      this.contactpaginator.pageSize);
  }

  Filtercontact() {
    let data: any = Object.assign(this.searchform.value);
    data.agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent'
    this.searchData();
    this.contactdataSource.loadContacts(data,this.sortcolumn,this.sortdirection, 0, 50);
  }

  cancelFile(file: FileUploadModel) {
    file.sub.unsubscribe();
    this.removeFileFromArray(file);
    this.loading = false
  }

  retryFile(file: FileUploadModel) {
    this.uploadFile(file);
    file.canRetry = false;
    this.loading = false
  }

  private uploadFile(file: FileUploadModel) {
    let userinfo = localStorage.getItem('access_id');
    let dname = this.name;
    let params_data = new HttpParams();
    params_data = params_data.append('customer_id', userinfo);
    params_data = params_data.append('segment', this.segselect);
    params_data = params_data.append('namm', this.name);

    let fd = new FormData();
    fd.append('image_files', file.data);
    fd.append('file_name', dname);
    fd.append('customer_id', userinfo);
    this.isDisabled=true;
    const req = new HttpRequest('POST', this.target, fd, {
      reportProgress: true,
      params: params_data,
    });

    file.inProgress = true;
    file.sub = this._http.request(req).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      tap(message => { }),
      last(),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        file.canRetry = true;
        return of(`${file.data.name} upload failed.`);
      })
    ).subscribe(
      (event: any) => {

        if (typeof (event) === 'object') {
          if (event.body.created) {
            //  this.getContacts();
          }
          this.removeFileFromArray(file);
          this.complete.emit(event.body);
          this._snackBar.open(event.body.msg, 'Dissmis', {
            duration: 10000,
          });
          this.loading = false;
          this.isDisabled=false;
        }
      }
    );
  }

  private uploadFiles() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.value = '';

    this.files.forEach(file => {
      // console.log("file "+JSON.stringify(file));
      this.uploadFile(file);
    });
  }

  private removeFileFromArray(file: FileUploadModel) {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }

  sortData(event) {
    let data: any = Object.assign(this.searchform.value);
    //console.log(data);
    this.sortcolumn=event['active'];
    this.sortdirection=event['direction'];
    data.agentrole = localStorage.getItem('agent_role')?localStorage.getItem('agent_role'):'agent'
    this.contactdataSource.loadContacts(data,event['active'],event['direction'], this.contactpaginator.pageIndex, this.contactpaginator.pageSize);
    //console.log(this.contactpaginator.pageIndex+'---'+this.contactpaginator.pageSize);
  }

  async checkkyc(id){
    //console.log(id);   
    await this.Userservice.getKYCStatus(id).then(
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
export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
} 