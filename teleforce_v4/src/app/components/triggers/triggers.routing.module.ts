import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TriggersComponent } from './triggers.component';

const routes: Routes = [
    {path: '',component: TriggersComponent},
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TriggersRoutingModule {}
