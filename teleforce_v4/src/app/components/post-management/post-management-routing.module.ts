import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostManagementComponent } from './post-management.component';

const routes: Routes = [
    {path: '',component: PostManagementComponent},
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostManagementRoutingModule {}
