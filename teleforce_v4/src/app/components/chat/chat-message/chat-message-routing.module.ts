import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatMessageComponent } from './chat-message.component';

const routes: Routes = [
    {path: '',component: ChatMessageComponent},
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChatMessageRoutingModule {}
