import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  SmsCampaignRoutingModule } from './sms-campaign-routing.module';
import { SmsCampaignComponent,CreateSmsCampaignComponent } from './sms-campaign.component';
import {APP_BASE_HREF,HashLocationStrategy,LocationStrategy} from '@angular/common';
import { MatTableModule } from '@angular/material/table'; 
import { MaterialModule } from '../../../../app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import {  NgxMatDatetimePickerModule} from '@angular-material-components/datetime-picker';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  imports: [
    CommonModule,
    SmsCampaignRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MaterialModule,    
    NgxMatDatetimePickerModule,
    ChartsModule
  ],
  declarations: [
    SmsCampaignComponent,
    CreateSmsCampaignComponent
  ],
  providers:[
    {provide: APP_BASE_HREF, useValue: ''},
    {provide:LocationStrategy, useClass:HashLocationStrategy},
  ],
  entryComponents:  [
    CreateSmsCampaignComponent
  ]
})
export class SmsCampaignModule {
    
 }
