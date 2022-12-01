import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  SmsCampaignDetailRoutingModule } from './sms-campaign-detail-routing.module';
import { SmsCampaignDetailComponent} from './sms-campaign-detail.component';
import {APP_BASE_HREF,HashLocationStrategy,LocationStrategy} from '@angular/common';
import { MatTableModule } from '@angular/material/table'; 
import { MaterialModule } from '../../../../app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    SmsCampaignDetailRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MaterialModule,
    ChartsModule
  ],
  declarations: [
    SmsCampaignDetailComponent
  ],
  providers:[
    {provide: APP_BASE_HREF, useValue: ''},
    {provide:LocationStrategy, useClass:HashLocationStrategy},
  ]
})
export class SmsCampaignDetailModule {
    
 }
