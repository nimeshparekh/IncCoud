import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  LeadsGenerationRoutingModule } from './leads-generation-routing.module';
import { LeadsGenerationComponent } from './leads-generation.component';
import { ReactiveFormsModule } from '@angular/forms';
import {APP_BASE_HREF,HashLocationStrategy,LocationStrategy} from '@angular/common';
import { MatTableModule } from '@angular/material/table' 
import { PostMediaComponent } from '../post-media/post-media.component';
import { MaterialModule } from '../../../../app/material/material.module';
@NgModule({
  imports: [
    CommonModule,
    LeadsGenerationRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MaterialModule
  ],
  declarations: [
    LeadsGenerationComponent,
    PostMediaComponent
  ],
  providers:[
    {provide: APP_BASE_HREF, useValue: ''},
    {provide:LocationStrategy, useClass:HashLocationStrategy},
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class LeadsGenerationModule {
    
 }
