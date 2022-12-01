import { Component, OnInit, Inject, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { extend, Internationalization } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import {
  Schedule, View, TimeScaleModel, PopupOpenEventArgs, AgendaService, EventRenderedArgs, ScheduleComponent, MonthService, DayService, WeekService, WorkWeekService, EventSettingsModel, ResizeService, DragAndDropService
} from '@syncfusion/ej2-angular-schedule';
import { environment } from './../../../environments/environment';
import { DataManager, WebApiAdaptor, UrlAdaptor, Query } from '@syncfusion/ej2-data';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../user.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import * as jwt_decode from 'jwt-decode';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { BaseComponent } from '../base/base.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MeetingNotesComponent } from '../meeting-notes/meeting-notes.component';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService],
})
export class AppointmentComponent implements OnInit {
  userid = this.route.snapshot.paramMap.get('id');
  time;
  startdate;
  enddate;
  agent;

  isLinear = false;
  apiUrl = environment.apiUrl;
  meetinglist = [];
  public timeScale: TimeScaleModel = { enable: true, interval: 60, slotCount: 4 };
  public selectedDate: Date = new Date();
  private dataManger: DataManager = new DataManager({
    // url: 'https://ej2services.syncfusion.com/production/web-services/api/Schedule',
    url: this.apiUrl + '/tfapi/CustomerSchedule',
    adaptor: new UrlAdaptor,
    crossDomain: true
  });

  public startHour: string = '05:00';
  public endHour: string = '20:00';

  public dataQuery: Query = new Query().addParams('customer_id', this.userid);

  public eventSettings: EventSettingsModel = { dataSource: [], query: this.dataQuery }
  public instance: Internationalization = new Internationalization();
  async getTime(id) {
    this.timeScale = { enable: true, interval: 60, slotCount: id };
    await this.userservice.getAgentTime(this.userid).then(
      data => {
        if (data['data'].length > 0) {
          this.startHour = data['data'][0]['start_time'].slice(0, -3);
          this.endHour = data['data'][0]['end_time'].slice(0, -3);
        }
      },
      err => {
        console.log('error');
      }
    );


  }
  onPopupOpen(args: PopupOpenEventArgs): void {
    if (args.type === "Editor") {
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
  }

  onActionComplete(args): void {
    //   eventSettings: EventSettingsModel = {
    //     dataSource: this.data, query: new Query(),
    // };
    //this.getScheduleList();
    //console.log("on action complete !!");
    //console.log(args.data);
    this.eventSettings = {
      dataSource: this.dataManger, query: this.dataQuery
    };
    this.getScheduleList();
    if(args.data){
      document.getElementById("nextbtn").click();
    }
    //document.getElementById("nextbtn").click();
  }

//   ngAfterViewInit(): void {
    
// }

  constructor(private userservice: UserService,
    private basecomponent: BaseComponent,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {

    this.getScheduleList();
  }


  async getScheduleList() {
    await this.userservice.getScheduleCustomerList(this.userid).then(
      data => {

        this.agent = data['data']['account_name'];
        this.startdate = data['data']['StartTime'];
        this.enddate = data['data']['EndTime'];
        this.time = data['data']['time'];

      },
      err => {
        console.log('error');
      }
    );
  }

  onNoClick() {
    console.log("test");
  }

}
