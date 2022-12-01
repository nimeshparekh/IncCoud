import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  BrandManagementRoutingModule } from './brand-management-routing.module';
import { BrandManagementComponent } from './brand-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import {APP_BASE_HREF,HashLocationStrategy,LocationStrategy} from '@angular/common';
import { MatTableModule } from '@angular/material/table' 
import { MaterialModule } from '../../../app/material/material.module';
import { BrandCreationComponent } from '../brand-creation/brand-creation.component'; 
@NgModule({
  imports: [
    CommonModule,
    BrandManagementRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MaterialModule
  ],
  declarations: [
    BrandManagementComponent,
    BrandCreationComponent,
  ],
  providers:[
    {provide: APP_BASE_HREF, useValue: ''},
    {provide:LocationStrategy, useClass:HashLocationStrategy},
  ]
})
export class BrandManagementModule {
    
 }
