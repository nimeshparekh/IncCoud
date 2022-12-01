import { Component, OnInit, Inject, ViewChild, ViewEncapsulation, ElementRef, Input, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest, HttpEventType, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { extend } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import {
  Schedule, View, TimeScaleModel, PopupOpenEventArgs, AgendaService, EventRenderedArgs, ScheduleComponent, MonthService, DayService, WeekService, WorkWeekService, EventSettingsModel, ResizeService, DragAndDropService, DragEventArgs, ResizeEventArgs, ActionEventArgs
} from '@syncfusion/ej2-angular-schedule';
import { environment } from './../../../environments/environment';
import { DataManager, WebApiAdaptor, UrlAdaptor, Query, Predicate } from '@syncfusion/ej2-data';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../user.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import * as jwt_decode from 'jwt-decode';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { BaseComponent } from '../base/base.component';
import { MeetingNotesComponent } from '../meeting-notes/meeting-notes.component';
import { AgentFileListComponent } from '../agent-file-list/agent-file-list.component';
import { Subscription, of, from } from 'rxjs';
import { catchError, last, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css'],
  providers: [DayService, WeekService, WorkWeekService, MonthService, ResizeService, DragAndDropService],
  //encapsulation: ViewEncapsulation.None
})
export class SchedulerComponent implements OnInit {
  @ViewChild('scheduleObj')
  public scheduleObj: ScheduleComponent;

  public searchform: FormGroup;
  selected_seg = false;
  segselect = '';
  agents = [];
  popupstatus = 0;
  isagent = false;
  ismanager = true;
  name;
  loading = false;
  apiUrl = environment.apiUrl;
  meetinglist = [];
  agentmeetinglist = [];
  public timeScale: TimeScaleModel = { enable: true, interval: 60, slotCount: 4 };
  public selectedDate: Date = new Date();
  private dataManger: DataManager = new DataManager({
    // url: 'https://ej2services.syncfusion.com/production/web-services/api/Schedule',
    url: this.apiUrl + '/tfapi/ManagerSchedule',
    adaptor: new UrlAdaptor,
    crossDomain: true
  });

  //public readonly: Boolean = true;
  public currentView: View = 'Week';
  public dataQuery: Query = new Query().addParams('customer_id', localStorage.getItem('access_id'));

  public eventSettings: EventSettingsModel = { dataSource: [], query: this.dataQuery }

  not = 'not_sel';
  /** Link text */
  @Input() text = 'Upload CSV';
  /** Name used in form which will be sent in HTTP request. */
  @Input() param = 'file';
  /** Target URL for file uploading. */
  @Input() target = environment.apiUrl + '/default/agentupload';
  /** File extension that accepted, same as 'accept' of <input type="file" />. 
      By the default, it's set to 'image/*'. */
  @Input() accept = '.csv';
  /** Allow you to add handler after its completion. Bubble up response text from remote. */
  @Output() complete = new EventEmitter<string>();

  public files: Array<FileUploadModel> = [];

  public startHour: string = '08:00';
  public endHour: string = '20:00';

  public onPopupOpen(args: PopupOpenEventArgs): void {
    console.log("this.popupstatus : " + this.popupstatus);
    // if ((args.target && !args.target.classList.contains('e-appointment') && (args.type === 'QuickInfo')) || (args.type === 'Editor')) {
    //   args.cancel = this.onEventCheck(args);
    // }

    if (this.popupstatus > 0) {
      if ((args.target && !args.target.classList.contains('e-appointment') && (args.type === 'QuickInfo')) || (args.type === 'Editor')) {
        let statusElement: HTMLInputElement = args.element.querySelector(
          "#EventType"
        ) as HTMLInputElement;
        if (!statusElement.classList.contains("e-dropdownlist")) {
          let dropDownListObject: DropDownList = new DropDownList({
            placeholder: "Choose Meeting Type",
            value: statusElement.value,
            dataSource: ["Video", "Call"]
          });
          dropDownListObject.appendTo(statusElement);
          statusElement.setAttribute("name", "EventType");
        }
        let startElement: HTMLInputElement = args.element.querySelector(
          "#StartTime"
        ) as HTMLInputElement;
        if (!startElement.classList.contains("e-datetimepicker")) {
          new DateTimePicker(
            { value: new Date(startElement.value) || new Date() },
            startElement
          );
        }
        let endElement: HTMLInputElement = args.element.querySelector(
          "#EndTime"
        ) as HTMLInputElement;
        if (!endElement.classList.contains("e-datetimepicker")) {
          new DateTimePicker(
            { value: new Date(endElement.value) || new Date() },
            endElement
          );
        }
      }
    } else {
      if ((args.target && !args.target.classList.contains('e-appointment') && (args.type === 'QuickInfo')) || (args.type === 'Editor')) {
        args.cancel = this.onEventCheck(args);
        this.selected_seg = false;
      }
    }

  }

  public onEventCheck(args: any): boolean {
    let eventObj: any = args.data instanceof Array ? args.data[0] : args.data;
    return eventObj;
    //return (eventObj.StartTime < new Date());
  }
  onActionComplete(args): void {
    this.eventSettings = {
      dataSource: this.dataManger, query: this.dataQuery
    };
    this.getScheduleList();
    if (args.data) {
      this.searchform.controls['agentid'].setValue("");
      this.selected_seg = false;
    }

  }


  constructor(private userservice: UserService,
    private basecomponent: BaseComponent,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpClient,
    private _http: HttpClient) { }

  ngOnInit(): void {
    let tokenInfo = this.getDecodedAccessToken(localStorage.getItem('access_token'));

    this.dataQuery.addParams('secret', tokenInfo.secret);

    this.getScheduleList();

    var userid = localStorage.getItem('access_id');
    this.getAgents(userid);
    this.searchform = this.fb.group({
      agentid: [''],
    });
    //this.popupstatus = 0;

    this.getManagerTime(userid);
  }

  async getManagerTime(userid) {
    await this.userservice.getManagerTime(userid).then(
      data => {
        if (data['data'].length > 0) {
          this.startHour = data['data'][0]['metavalue'];
          this.endHour = data['data'][1]['metavalue'];
        }
      },
      err => {
        console.log('error');
      }
    );
  }


  async getAgents(userid) {
    await this.userservice.getAgents(userid).then(
      data => {
        this.agents = data['data'];
      },
      err => {
        console.log('error');
      }
    );
  }


  change2(agentid) {
    this.loading = true;
    if (agentid > 0) {
      this.selected_seg = true;
      this.segselect = agentid;

      this.isagent = true;
      this.ismanager = false;
      this.getCustomerScheduleList(agentid);
      //this.dataQuery.addParams('customer_id', agentid);
      let predicate: Predicate;
      predicate = new Predicate('customer_id', 'equal', agentid);

      this.eventSettings = {
        dataSource: this.dataManger, query: new Query().where(predicate).addParams('customer_id', agentid)
      };
      this.popupstatus = 1;
      //this.searchform.controls['agentid'].setValue("");
      //this.selected_seg = false;
    } else {
      this.eventSettings = {
        dataSource: this.dataManger, query: this.dataQuery
      };
      this.getScheduleList();
      this.selected_seg = false;
    }

  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    }
    catch (Error) {
      return null;
    }
  }

  joinmeeting(link, customer_id) {
    console.log("link :::" + link);
    console.log("customer_id :::" + customer_id);
    const dialogRef = this.dialog.open(PatientMeetingComponent, {
      width: '100%', data: { link: link, customer_id: customer_id }

    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  async getCustomerScheduleList(agentid) {
    await this.userservice.getScheduleCustomerListManager(agentid).then(
      data => {
        console.log("data");
        console.log(JSON.stringify(data));
        this.agentmeetinglist = data['data'];
        this.loading = false;
      },
      err => {
        console.log('error');
      }
    );
  }

  async getScheduleList() {
    this.popupstatus = 0;

    var access_id = localStorage.getItem('access_id');
    await this.userservice.getScheduleManagerList(access_id).then(
      data => {
        this.isagent = false;
        this.ismanager = true;
        // console.log("data");
        // console.log(JSON.stringify(data));
        this.meetinglist = data['data'];
        this.loading = false;
      },
      err => {
        console.log('error');
      }
    );
  }

  async callmeeting(mobile, agentid) {

    if (confirm("Are you sure to call ?")) {
      var voipstatus = localStorage.getItem('voipstatus');
      console.log("voipstatus :" + voipstatus);
      if (voipstatus == 'true') {
        this.basecomponent.voipcall(mobile)
      } else {
        console.log("send here !!");
        this.userservice.agentScheduleOutgoingCall(agentid, mobile).then(
          data => {
            if (data['err'] == false) {
              this._snackBar.open(data['msg'], '', {
                duration: 2000, verticalPosition: 'top'
              });
            }
          },
          err => {
            console.log('error');
          }
        );
      }
    }
  }

  selectedSegment(value) {
    if (value != undefined) {
      this.selected_seg = true;
      this.segselect = value
    } else {
      this.selected_seg = false;
    }
  }

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

  createfiledialog(): void {
    const dialogRef = this.dialog.open(AgentFileListComponent, {
      width: '640px', disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
      }
    });
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
    params_data = params_data.append('agentid', this.segselect);
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
          this.selected_seg = false;
          this.getScheduleList();
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

  public onDragStop(args: DragEventArgs): void {
    args.cancel = this.onEventCheck(args);
  }
  public onResizeStop(args: ResizeEventArgs): void {
    args.cancel = this.onEventCheck(args);
  }

}

@Component({
  selector: 'meeting',
  templateUrl: 'patientmeeting.component.html',
  styleUrls: ['./patientmeeting.component.css']

})
export class PatientMeetingComponent {
  hidedetails: boolean = true;
  userloginForm: FormGroup
  isotpsend = false;
  patientdetail;
  meetinglink = ''
  constructor(
    public dialogRef: MatDialogRef<PatientMeetingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ScheduleComponent,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private userservice: UserService,
    public dialog: MatDialog,
    private router: Router,
  ) { }
  @ViewChild('iframe') iframe: ElementRef

  onNoClick(): void {
    this.dialogRef.close();
  }

  ChangeView() {
    this.hidedetails = !this.hidedetails;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    //console.log("A A A" + JSON.stringify(this.data));
    this.getCustomerBasicDetail(this.data['lead_id']);
  }
  ngAfterViewInit() {
    this.iframe.nativeElement.setAttribute('src', this.data['link']);
  }

  add_Notes() {
    const dialogRef = this.dialog.open(MeetingNotesComponent, {
      width: '300px', data: { lead_id: this.data['lead_id'], customer_id: this.data['customer_id'] }

    });
  }

  getCustomerBasicDetail(id) {
    this.userservice.getCustomerBasicDetail(id).then(
      data => {
        console.log("data");
        console.log(JSON.stringify(data['data'][0]));
        this.patientdetail = data['data'][0];
      },
      err => {
        console.log('error');
      })
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