import { Component, OnInit, ChangeDetectionStrategy, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReportService } from '../../report.service';
import { UserService } from '../../user.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from "@angular/router";
import { Subscription, of, from } from 'rxjs';
import { catchError, last, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpEventType, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-recording-download',
  templateUrl: './recording-download.component.html',
  styleUrls: ['./recording-download.component.css']
})
export class RecordingDownloadComponent implements OnInit {

  public searchform: FormGroup;
  startdate;
  enddate;
  isLoading = false;
  agents = [];
  datalist = [];
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['id','date', 'mobile', 'status'];
  Length = 0;
  kyc;
  date2;
  date1;
  msg = '';
  name;
  loading = false
  /** Link text */
  @Input() text = 'Upload CSV';
  /** Name used in form which will be sent in HTTP request. */
  @Input() param = 'file';
  /** Target URL for file uploading. */
  @Input() target = environment.apiUrl + '/report/uploadrequest';
  /** File extension that accepted, same as 'accept' of <input type="file" />. 
      By the default, it's set to 'image/*'. */
  @Input() accept = '.csv';
  /** Allow you to add handler after its completion. Bubble up response text from remote. */
  @Output() complete = new EventEmitter<string>();

  public files: Array<FileUploadModel> = [];
  
  constructor(
    private reportservice: ReportService,
    private userservice: UserService,
    private fb: FormBuilder,
    private router: Router,
    private _http: HttpClient,
    private _snackBar: MatSnackBar,
  ) { }

  @ViewChild('paginator') paginator: MatPaginator;

  ngOnInit(): void {
    let date = new Date();

    var userid = localStorage.getItem('access_id');
    this.dataSource = new MatTableDataSource();
    this.searchform = this.fb.group({
      userid: [userid],
      date: [date],
      mobile: [null],
      startdate:[date],
      enddate:[date],

    });
    //this.calculateDateTimeDiff();
    this.getRecordingDownloadRequest(userid);
  }
 
  async getRecordingDownloadRequest(userid) {
    this.isLoading = true;
    await this.reportservice.recordingrequestlist(userid).then(
      data => {
        this.dataSource.data = data['data'];
        this.Length = data['data'].length;
        this.isLoading = false;
      },
      err => {
        console.log('error');
      }
    );
  }

  async submitData() {

    let data: any = Object.assign(this.searchform.value);
    console.log(data);
    if (this.searchform.invalid == true) {
      console.log(data);
      return;
    }
    else {
      this.reportservice.recordingrequest(data).then(
        data => {
          console.log(JSON.stringify(data));
          this._snackBar.open(data['msg'], '', {
            duration: 2000, verticalPosition: 'top'
          });
          var userid = localStorage.getItem('access_id');
          this.getRecordingDownloadRequest(userid);
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

  onUploadCsv(){
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

  private uploadFiles() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.value = '';

    this.files.forEach(file => {
      // console.log("file "+JSON.stringify(file));
      this.uploadFile(file);
    });
  }

  private uploadFile(file: FileUploadModel) {
    let userinfo = localStorage.getItem('access_id');
    let dname = this.name;
    let params_data = new HttpParams();
    params_data = params_data.append('customer_id', userinfo);
    params_data = params_data.append('namm', this.name);

    let fd = new FormData();
    fd.append('image_files', file.data);
    fd.append('file_name', dname);
    fd.append('customer_id', userinfo);

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
        }
      }
    );
  }

  private removeFileFromArray(file: FileUploadModel) {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
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