import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  SmsLogRoutingModule } from './sms-log-routing.module';
import { SmsLogComponent } from './sms-log.component';
import {APP_BASE_HREF,HashLocationStrategy,LocationStrategy} from '@angular/common';
import { MatTableModule } from '@angular/material/table'; 
import { MaterialModule } from '../../../../app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SmsLogRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MaterialModule
    
  ],
  declarations: [
    SmsLogComponent,
  ],
  providers:[
    {provide: APP_BASE_HREF, useValue: ''},
    {provide:LocationStrategy, useClass:HashLocationStrategy},
  ]
})
export class SmsLogModule {
    
 }
