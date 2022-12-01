import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  EmailCampaignDetailRoutingModule } from './email-campaign-detail-routing.module';
import { EmailCampaignDetailComponent,RegenerateEmailCampaignComponent} from './email-campaign-detail.component';
import { EmailDetailAnalyticsComponent} from '../email-detail-analytics/email-detail-analytics.component';
import {APP_BASE_HREF,HashLocationStrategy,LocationStrategy} from '@angular/common';
import { MatTableModule } from '@angular/material/table'; 
import { MaterialModule } from '../../../../app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import {  NgxMatDatetimePickerModule} from '@angular-material-components/datetime-picker';

@NgModule({
  imports: [
    CommonModule,
    EmailCampaignDetailRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MaterialModule,
    ChartsModule,      
    NgxMatDatetimePickerModule
    
  ],
  declarations: [
    EmailCampaignDetailComponent,
    EmailDetailAnalyticsComponent,
    RegenerateEmailCampaignComponent
  ],
  providers:[
    {provide: APP_BASE_HREF, useValue: ''},
    {provide:LocationStrategy, useClass:HashLocationStrategy},
  ],
  entryComponents:  [
    RegenerateEmailCampaignComponent
  ]
})
export class EmailCampaignDetailModule {
    
 }
