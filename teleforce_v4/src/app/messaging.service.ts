import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs'
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable()
export class MessagingService {
currentMessage = new BehaviorSubject(null);
constructor(private angularFireMessaging: AngularFireMessaging,private http: HttpClient) {
this.angularFireMessaging.messaging.subscribe(
(_messaging) => {
_messaging.onMessage = _messaging.onMessage.bind(_messaging);
_messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
}
)
}
requestPermission() {
this.angularFireMessaging.requestToken.subscribe(
(token) => {
console.log(token);
 var data = {token:token}
 this.http.post(environment.apiUrl + '/default/updatewebtoken/', data).subscribe((data: any) => {
    
  }, error => {
    
  });
},
(err) => {
console.error('Unable to get permission to notify.', err);
}
);
}
receiveMessage() {
this.angularFireMessaging.messages.subscribe(
(payload) => {
console.log("new message received. ", payload);
this.currentMessage.next(payload);
})
}
}