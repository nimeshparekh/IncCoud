import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  PostManagementRoutingModule } from './post-management-routing.module';
import { PostManagementComponent,PostInsightComponent,Draftpostdelete} from './post-management.component';
import { ReactiveFormsModule } from '@angular/forms';
import {APP_BASE_HREF,HashLocationStrategy,LocationStrategy} from '@angular/common';
import { MatTableModule } from '@angular/material/table' 
import { MaterialModule } from '../../material/material.module';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    PostManagementRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MaterialModule,
    FormsModule
  ],
  declarations: [
    PostManagementComponent,
    PostInsightComponent,
    Draftpostdelete
  ],
  entryComponents: [
    PostManagementComponent,
    PostInsightComponent,
    Draftpostdelete
  ],
  providers:[
    {provide: APP_BASE_HREF, useValue: ''},
    {provide:LocationStrategy, useClass:HashLocationStrategy},
  ]
})
export class PostManagementModule {
    
 }
