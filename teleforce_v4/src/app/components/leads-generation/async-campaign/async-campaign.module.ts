import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  AsyncCampaignRoutingModule } from './async-campaign-routing.module';
import { AsyncCampaignComponent } from './async-campaign.component';
import { ReactiveFormsModule } from '@angular/forms';
import {APP_BASE_HREF,HashLocationStrategy,LocationStrategy} from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from '../../../material/material.module';
@NgModule({
  imports: [
    CommonModule,
    AsyncCampaignRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MaterialModule
  ],
  declarations: [
    AsyncCampaignComponent,
  ],
  providers:[
    {provide: APP_BASE_HREF, useValue: ''},
    {provide:LocationStrategy, useClass:HashLocationStrategy},
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AsyncCampaignModule {
    
 }
