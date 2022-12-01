import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  LeadListRoutingModule } from './lead-list-routing.module';
import { LeadListComponent } from './lead-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import {APP_BASE_HREF,HashLocationStrategy,LocationStrategy} from '@angular/common';
import { MatTableModule } from '@angular/material/table' 
import { LeadManualComponent } from './lead-manual/lead-manual.component';
import { CreateAdComponent } from './create-ad/create-ad.component';
import { CampaignListComponent,FbPeoplereachDialogComponent } from './campaign-list/campaign-list.component';
import { MaterialModule } from '../../../app/material/material.module';
import { MatTabsModule } from '@angular/material/tabs';
@NgModule({
  imports: [
    CommonModule,
    LeadListRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MaterialModule,
    MatTabsModule
  ],
  declarations: [
    LeadListComponent,
    CreateAdComponent,
    LeadManualComponent,
    CampaignListComponent,
    FbPeoplereachDialogComponent
  ],
  providers:[
    {provide: APP_BASE_HREF, useValue: ''},
    {provide:LocationStrategy, useClass:HashLocationStrategy},
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class LeadListModule {
    
 }
