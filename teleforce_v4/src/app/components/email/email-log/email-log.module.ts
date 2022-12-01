import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  EmailLogRoutingModule } from './email-log-routing.module';
import { EmailLogComponent } from './email-log.component';
import {APP_BASE_HREF,HashLocationStrategy,LocationStrategy} from '@angular/common';
import { MatTableModule } from '@angular/material/table'; 
import { MaterialModule } from '../../../../app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    EmailLogRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MaterialModule
    
  ],
  declarations: [
    EmailLogComponent,
  ],
  providers:[
    {provide: APP_BASE_HREF, useValue: ''},
    {provide:LocationStrategy, useClass:HashLocationStrategy},
  ]
})
export class EmailLogModule {
    
 }
