import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DigitalService } from '../../digital.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {

  whasappincomingwebhook = ''
  fbchannels = []
  pageid = ''
  constructor(
    private PFService: DigitalService
    ) { }

  ngOnInit(): void {
    var userid = localStorage.getItem('access_id');
    this.whasappincomingwebhook = environment.media_path+'tfapi/whatsapp/'+userid
    this.getchannelsAll()
  }

  getchannelsAll(){
    var data_n = {'brand_id':localStorage.getItem('current_brand_id')}
    this.PFService.get_channels_all(data_n).then(
      data1 => {
        var data = data1['data']
        data.forEach(element => {
          if(element.access_media == 'facebook'){
            this.fbchannels.push(element)
          }
        });
        console.log('fbchannels',this.fbchannels);

      },
      err=> {}
    )
  }

  selectfbpage(event: any){
    console.log(event.value)
    this.pageid = event.value
  }
}
