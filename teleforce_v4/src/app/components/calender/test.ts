import { Component, OnInit, Inject, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { extend } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import {
  View, TimeScaleModel, PopupOpenEventArgs, AgendaService, EventRenderedArgs, ScheduleComponent, MonthService, DayService, WeekService, WorkWeekService, EventSettingsModel, ResizeService, DragAndDropService
} from '@syncfusion/ej2-angular-schedule';
import { environment } from './../../../environments/environment';
import { DataManager, WebApiAdaptor, UrlAdaptor, Query } from '@syncfusion/ej2-data';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../user.service';
//import { doctorsEventData } from './data';
//import { eventData } from './datasource';
/**
 * Schedule editor template sample
 */

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css'],
  encapsulation: ViewEncapsulation.None
  // styles: [`    
  //   .custom-event-editor .e-textlabel {
  //       padding-right: 15px;
  //       text-align: right;
  //   }

  //   .custom-event-editor td {
  //       padding: 7px;
  //       padding-right: 16px;
  //   }`],
  //   providers: [MonthService, DayService, WeekService, WorkWeekService, ResizeService, DragAndDropService],
  // encapsulation: ViewEncapsulation.None,
})

export class CalenderComponent implements OnInit {
  //   public eventSettings: EventSettingsModel = {
  //     dataSource: eventData
  // };
  apiUrl = environment.apiUrl;
  public timeScale: TimeScaleModel = { enable: true, interval: 60, slotCount: 4 };

  private dataManger: DataManager = new DataManager({
    // url: 'https://ej2services.syncfusion.com/production/web-services/api/Schedule',
    url: this.apiUrl + '/tfapi/Schedule',
    adaptor: new UrlAdaptor,
    crossDomain: true
  });



  public dataQuery: Query = new Query().addParams('customer_id', localStorage.getItem('access_id'));
  
  public data: object[] = [{
    Id: 2,
    Subject: 'Paris',
    StartTime: new Date(2021, 5, 28, 10, 0),
    EndTime: new Date(2021, 5, 28, 12, 30)
  }];

  

  //public data: object[] = [{"Id":1,"EventType":"Video","Subject":"sonali","Description":"test","Location":"sonali@cloudX.in","OwnerId":"234567901","StartTime":"2021-05-25T13:45:00.000Z","EndTime":"2021-05-25T14:00:00.000Z"}];
  
  
  public eventSettings: EventSettingsModel = { dataSource: this.data }

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
    console.log("step 3");
    this.getScheduleList();
    this.eventSettings  = {
      dataSource: this.dataManger, query: this.dataQuery
    }; 
    
    
  }
  constructor(private userservice: UserService,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    console.log('step 1');
    this.getScheduleList();
  }

  async getScheduleList() {
    var access_id = localStorage.getItem('access_id');
    await this.userservice.getScheduleList(access_id).then(
      data => {
        console.log("sonali data step 2");
        console.log(JSON.stringify(data));
        //this.data = data['data'];
        this.data.push(data['data']);
      },
      err => {
        console.log('error');
      }
    );
  }
}