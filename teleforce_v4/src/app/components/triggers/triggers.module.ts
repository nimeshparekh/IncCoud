import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  TriggersRoutingModule } from './triggers.routing.module';
import { TriggersComponent } from './triggers.component';
import {APP_BASE_HREF,HashLocationStrategy,LocationStrategy} from '@angular/common';
import { MatTableModule } from '@angular/material/table'; 
import { MaterialModule } from '../../../app/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TriggersRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MaterialModule
    
  ],
  declarations: [
    TriggersComponent,
  ],
  providers:[
    {provide: APP_BASE_HREF, useValue: ''},
    {provide:LocationStrategy, useClass:HashLocationStrategy},
  ]
})
export class TriggersModule {
    
 }
