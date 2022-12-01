import { Component, OnInit } from '@angular/core';
import { ErpService } from './../../erp.service';

@Component({
  selector: 'app-erp-module-new',
  templateUrl: './erp-module-new.component.html',
  styleUrls: ['./erp-module-new.component.css']
})
export class ErpModuleNewComponent implements OnInit {

  constructor(public authService: ErpService) { }
stage
stage_name = []
data = []
erp_list_isLoading = true
  ngOnInit(): void {
    this.stage_collum_status()
  }

  async stage_collum_status() {
    this.erp_list_isLoading = true;
    await this.authService.dynamic_lead_lists(10).then(
      data => {
        if(data['data'].length>0){
          console.log(data['data'])
          this.stage = data['data']
          this.erp_list_isLoading = false;
        }
        else{
          this.erp_list_isLoading = false;
        }
      },
      err => {
        console.log('error');
      }
    );
  }

  clicktoemail(value) {
    console.log(value)
    // var dat = {'status':value._elementRef.nativeElement.id,'status_open':true}
    // const dialogRef = this.dialog.open(CreateLeadErpComponent,{data : dat,
    //   disableClose: true
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result.event == 'Add') {
    //     //this.getpromsnalcam();
    //   }
    //   this.get_lead_status_lead();
    //   this.get_lead_status_notlead();
    // });
  }

}



