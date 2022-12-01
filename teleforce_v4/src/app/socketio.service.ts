import { environment } from './../environments/environment';
import { Injectable ,ViewChild} from '@angular/core';
import * as io from 'socket.io-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  private customSubject = new Subject<any>();
  private Schedulecall = new Subject<any>();
  customObservable = this.customSubject.asObservable();
  SchedulecallObservable = this.Schedulecall.asObservable();
  socket;
  constructor() {   }

  setupSocketConnection() {
    var userid = localStorage.getItem('access_id');
    this.socket = io(environment.SOCKET_ENDPOINT, {
      query: {
        token: userid
      }
    });

    this.socket.emit('my message', 'Hello there from Angular.');

    this.socket.on('agentcallqueue', (data) => {
      console.log(data);
      this.customSubject.next(data);
    });
    this.socket.on('agentcallschedule', (data) => {
      console.log(data);
      this.Schedulecall.next(data);
    });
  }
}
