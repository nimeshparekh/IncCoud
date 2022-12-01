import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadsGenerationComponent } from './leads-generation.component';

const routes: Routes = [
    {path: '',component: LeadsGenerationComponent},
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LeadsGenerationRoutingModule {}
