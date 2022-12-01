import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  EmailDetailAnalyticsRoutingModule } from './email-detail-analytics-routing.module';
import { EmailDetailAnalyticsComponent} from './email-detail-analytics.component';
import { EmailServerComponent} from '../../email-server/email-server.component';
import {APP_BASE_HREF,HashLocationStrategy,LocationStrategy} from '@angular/common';
import { MatTableModule } from '@angular/material/table'; 
import { MaterialModule } from '../../../../app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    EmailDetailAnalyticsRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MaterialModule,
    ChartsModule
    
  ],
  declarations: [
    EmailDetailAnalyticsComponent,
    EmailServerComponent
  ],
  providers:[
    {provide: APP_BASE_HREF, useValue: ''},
    {provide:LocationStrategy, useClass:HashLocationStrategy},
  ]
})
export class EmailDetailAnalyticsModule {
    
 }
