import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmsLogComponent } from './sms-log.component';

const routes: Routes = [
    {path: '',component: SmsLogComponent},
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SmsLogRoutingModule {}
