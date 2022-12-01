import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  ScheduledPostRoutingModule } from './scheduled-post-routing.module';
import { ScheduledPostComponent,SchedulepostdeleteComponent} from './scheduled-post.component';
import {APP_BASE_HREF,HashLocationStrategy,LocationStrategy} from '@angular/common';
import { MatTableModule } from '@angular/material/table' 
import { MaterialModule } from '../../../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    ScheduledPostRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MaterialModule,
    FormsModule
  ],
  declarations: [
    ScheduledPostComponent,
    SchedulepostdeleteComponent
  ],
  providers:[
    {provide: APP_BASE_HREF, useValue: ''},
    {provide:LocationStrategy, useClass:HashLocationStrategy},
  ]
})
export class ScheduledPostModule {
    
 }
