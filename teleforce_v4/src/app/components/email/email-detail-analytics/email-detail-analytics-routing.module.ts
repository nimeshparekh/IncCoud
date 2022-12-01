import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailDetailAnalyticsComponent } from './email-detail-analytics.component';

const routes: Routes = [
    {path: '',component: EmailDetailAnalyticsComponent},
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmailDetailAnalyticsRoutingModule {}
