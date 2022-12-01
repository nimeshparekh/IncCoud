import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrandManagementComponent } from './brand-management.component';

const routes: Routes = [
    {path: '',component: BrandManagementComponent},
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BrandManagementRoutingModule {}
