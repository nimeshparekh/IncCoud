import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduledPostComponent } from './scheduled-post.component';
const routes: Routes = [
    {path: '',component: ScheduledPostComponent},
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ScheduledPostRoutingModule {}
