import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  EmailCampaignRoutingModule } from './email-campaign-routing.module';
import { EmailCampaignComponent,CreateEmailCampaignComponent } from './email-campaign.component';
import {APP_BASE_HREF,HashLocationStrategy,LocationStrategy} from '@angular/common';
import { MatTableModule } from '@angular/material/table'; 
import { MaterialModule } from '../../../../app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import {  NgxMatDatetimePickerModule} from '@angular-material-components/datetime-picker';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  imports: [
    CommonModule,
    EmailCampaignRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MaterialModule,    
    NgxMatDatetimePickerModule,
    ChartsModule
  ],
  declarations: [
    EmailCampaignComponent,
    CreateEmailCampaignComponent
  ],
  providers:[
    {provide: APP_BASE_HREF, useValue: ''},
    {provide:LocationStrategy, useClass:HashLocationStrategy},
  ],
  entryComponents:  [
    CreateEmailCampaignComponent
  ]
})
export class EmailCampaignModule {
    
 }
