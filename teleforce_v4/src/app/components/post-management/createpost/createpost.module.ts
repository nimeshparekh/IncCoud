import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  CreatepostRoutingModule } from './cretetepost-routing.module';
import { CreatepostComponent,SelectMediaItemComponent,SelectMediaFolderComponent,CreatePostSchedualComponent} from './createpost.component';
import {APP_BASE_HREF,HashLocationStrategy,LocationStrategy} from '@angular/common';
import { MatTableModule } from '@angular/material/table' 
import { MaterialModule } from '../../../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    CreatepostRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MaterialModule,
    FormsModule
  ],
  declarations: [
    CreatepostComponent,
    SelectMediaItemComponent,
    SelectMediaFolderComponent,
    CreatePostSchedualComponent
  ],
  entryComponents:  [
    CreatepostComponent,
    SelectMediaItemComponent,
    SelectMediaFolderComponent,
    CreatePostSchedualComponent
  ],
  providers:[
    {provide: APP_BASE_HREF, useValue: ''},
    {provide:LocationStrategy, useClass:HashLocationStrategy},
  ]
})
export class CreatepostModule {
    
 }
