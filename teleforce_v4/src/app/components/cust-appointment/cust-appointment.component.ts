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
  selector: 'app-cust-appointment',
  templateUrl: './cust-appointment.component.html',
  styleUrls: ['./cust-appointment.component.css'],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService],
})
export class CustAppointmentComponent implements OnInit {

  constructor(private userservice: UserService,
    private basecomponent: BaseComponent,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private route: ActivatedRoute,) { }

  userid = this.route.snapshot.paramMap.get('id');
  time;
  startdate;
  enddate;
  agent;
  account_id;
  isLinear = false;
  apiUrl = environment.apiUrl;
  meetinglist = [];
  public timeScale: TimeScaleModel = { enable: true, interval: 60, slotCount: 4 };
  public selectedDate: Date = new Date();

  private dataManger: DataManager = new DataManager({
    // url: 'https://ej2services.syncfusion.com/production/web-services/api/Schedule',
    url: this.apiUrl + '/tfapi/AppointmentSchedule',
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
    await this.userservice.getAgentTimeMeet(this.userid).then(
      data => {
        //console.log('here :' + JSON.stringify(data['data'][0]));
        if (data['data'].length > 0) {
          this.startHour = data['data'][0]['start_time'].slice(0, -3);
          this.endHour = data['data'][0]['end_time'].slice(0, -3);
          this.account_id = data['data'][0]['account_id'];
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
    if (args.data) {
      document.getElementById("nextbtn").click();
    }
    //document.getElementById("nextbtn").click();
  }


  ngOnInit(): void {
    //console.log("user id :::"+ this.userid);
    this.getScheduleList();
  }

  async getScheduleList() {
    await this.userservice.getScheduleCustomerListMeet(this.userid).then(
      data => {
        // console.log("getScheduleList");
        // console.log(JSON.stringify(data['data']));
        if (data) {
          
            this.agent = data['data']['account_name'];
            this.startdate = data['data']['StartTime'];
            this.enddate = data['data']['EndTime'];
            this.time = data['data']['time'];
         
        }

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
