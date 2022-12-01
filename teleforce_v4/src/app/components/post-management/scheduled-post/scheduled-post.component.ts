import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from "@angular/router";
//import { PlatformService } from '../../digitalservices/platform.service';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { ImageService } from "../../digitalservices/image.service";
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '../../../../environments/environment';
import { DigitalService } from '../../../digital.service';
import { ManagerService } from"../../../manager.service";

export interface DialogData1 {
  post_id: String,
  fb_page_aToken: String,
}
@Component({
  selector: 'app-scheduled-post',
  templateUrl: './scheduled-post.component.html',
  styleUrls: ['./scheduled-post.component.css']
})
export class ScheduledPostComponent implements OnInit {
  public dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['no', 'createdtime', 'channels', 'media', 'postContent', 'scheduledtime', 'action'];
  saveArr: any = []
  image_to_show = [];
  all_channels = [];
  deletepost = false
  media_path=environment.media_path
  previews: string[] = [];
  previews_type: string[] = [];
  constructor(
     private digitalService: DigitalService,
     private _snackBar: MatSnackBar, private router: Router, private managerservice: ManagerService,
     public dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.getchannelsAll();
    this.getSchedulePost();
    //this.checkUserExists()
    //this.getMenuAccess();
    this.accesssetting();
  } 
  doesFileExist(urlToFile) {
    //console.log(urlToFile); 
      var xhr = new XMLHttpRequest();
      xhr.open('HEAD', urlToFile, false);
      xhr.send();
      //console.log(xhr); 
      if (xhr.status == 404 || xhr.status == 500) {
          return false;
      } else {
          return true;
      }
  }

  checkimagepath(path){
    //console.log(this.media_path+path)
    return './assets/img/social-channel.png'
    var fileexist = this.doesFileExist(this.media_path+path)
    console.log('fileexist check',fileexist)
    if(fileexist){
      return path
    }else{
      return './assets/img/social-channel.png'
    }
  }
  async accesssetting() {
    var userid = localStorage.getItem('access_id');

    await this.managerservice.getManagerDetail(userid).then(
      data => {
      
        var services = JSON.parse(data['data']['services']);
        console.log(services);
        if(services.includes('16')){
            
        }else{ 
          this.router.navigate(['/dashboard']);

        }

        // if (services.length > 0) {
        //   for (var i = 0; i < services.length; i++) {
        //     if (services[i] == '16') {
        //       console.log("yes");
              
        //     }else{

        //       this.router.navigate(['/dashboard']);

        //     }
        //   }
        // }


       
      },
      err => {
        console.log('error');
      })
  }
  getMenuAccess() {
    this.digitalService.getMenuAccess().then(
      data => {
        var accessdata = data['menuaccess']!=undefined?data['menuaccess']:[];
        //console.log(data['access']['menuaccess']);
        if (accessdata.includes('post')) {
          //this.router.navigate(['/dashboard']);
        } else {
          //this.router.navigate(['/dashboard']);
        }

      },
      err => {
        console.log(err);

      }
    );
  }


  /*checkUserExists() {
    console.log('User exists?');
    this.authService.userExists().then(
      data => {
        cons
        if (data['useraccess']) {
          var useraccess = data['useraccess'][0]
          if (useraccess.role == 0) {
            this.deletepost = true;
          }
        }
      },
      err => {
        console.log(err);
      }
    );
  }*/
  getchannelsAll() {
    var data_n = { 'brand_id': localStorage.getItem('current_brand_id') }
    this.digitalService.get_channels_all(data_n).then(
      data1 => {
        this.all_channels = data1['data'];
        console.log(this.all_channels);
        console.log(data1);
        this.getSchedulePost();
      },
      err => { }
    )
  }

  async getSchedulePost() {
    this.digitalService.getSchedulePost(localStorage.getItem('current_brand_id')).then(
      data => {
        if(data){
          data['data'].map((element, i) => {
            console.log('element',element);
            var i_count = 0;
            element.channel_arr = JSON.parse(element.channel_arr)
            //element.media = JSON.parse(element.media)
            //element.medianame = JSON.parse(element.medianame)
            //element.mime = JSON.parse(element.mime)
            element.channel_arr.map((ele2, i2) => {
              console.log(ele2);
              var result = this.all_channels.find(ele3 => ele3.channel_id === ele2);
              if (result == undefined) {
              }
              else {
                data['data'][i]['channel_arr'][i_count] = result;
                i_count = i_count + 1;
              }
              console.log(data['data']);
            });
          });
          this.saveArr = data['data'];
          this.dataSource.data = data['data'];
          for (let index = 0; index < Object.keys(this.saveArr).length; index++) {
            this.image_to_show[index] = this.getImageFromService(this.saveArr[index].media, this.saveArr[index].mime, index);
          }
        }
        
      },
      err => {
        console.log(err);
        /*this._snackBar.open('Error in getting saved posts', 'Close', {
          duration: 5000,
        });*/
      }
    );

  }

  thumbnailCheck(index) {
    if (this.saveArr[index].media[0]) {
      return true;
    }
    else {
      return false;
    }
  }


  async loadSavedPost(index,id) {
    
    console.log('saveArr',index);
    console.log(this.saveArr);
    await this.saveArr[index].channel_arr.map((element, i) => {
      this.saveArr[index]['channel_arr'][i] = element.channel_id;
    });
    console.log('saveArr',this.saveArr[index]);
    this.digitalService.setSavedPostData(this.saveArr[index]);

    
    this.digitalService.getSchedulePostfile(id).then(
      data => {
        if(data){
          console.log('getSchedulePostByid',data);
          this.previews.push(`${this.media_path}`+data['filePath'])
        } 
      },
      err => {
        console.log(err);
        /*this._snackBar.open('Error in getting saved posts', 'Close', {
          duration: 5000,
        });*/
      }
    );
    this.router.navigateByUrl('/createpost');
  }

  getImageFromService(img_names, mimeType, index) {
    this.image_to_show[index] = img_names;
    // this.createImageFromBlob(img_names[index],index);
    // this.imageService.getImage(img_names,mimeType).subscribe(data => {
    //   this.createImageFromBlob(data,index);
    // }, error => {
    //   console.log(error);
    // });
  }
  createImageFromBlob(image: Blob, index) {
    this.image_to_show[index] = image;
    // let reader = new FileReader();
    // console.log(this.image_to_show);
    // reader.addEventListener("load", () => {
    //   this.image_to_show[index]=reader.result;
    // }, false);

    // if (image) {
    //   // console.log("IF=yes in createimagefromblob");
    //   reader.readAsDataURL(image);
    // }
  }

  delUserDraft(index) {
    var _id = index;//this.saveArr[index]._id;
    this.digitalService.delSchedulePost(_id).then(
      data => {
        console.log(data);
        this._snackBar.open('Succesfully deleted posts', 'Close', {
          duration: 5000,
        });
        this.getSchedulePost();
        // this.showSavedPosts();
      },
      err => {
        console.log(err);
        this._snackBar.open('Error in getting saved posts', 'Close', {
          duration: 5000,
        });
      }
    );
  }

  DeleteConfirm(index) {
    const dialogRef = this.dialog.open(SchedulepostdeleteComponent, { data: { index: index } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('The dialog was closed');
        //this.delUserDraft(result.index)
        this.getSchedulePost();
      }
    });
  }
}

@Component({
  selector: 'schedulepostdelete',
  templateUrl: 'schedulepostdelete.component.html',
  styleUrls: ['./scheduled-post.component.css']
})
export class SchedulepostdeleteComponent {

  constructor(
    private digitalService: DigitalService,
    private _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SchedulepostdeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData1) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteschedulepost(){
    console.log();
    this.digitalService.deleteschedulepost(this.data['index']).then(
      data => {
        console.log(data);
        
        this._snackBar.open('Succesfully deleted posts', 'Close', {
          duration: 5000,
        });
        this.dialogRef.close({event:'delete'});
        //this.dialogRef.close();
        //this.getSchedulePost();
        // this.showSavedPosts();
      },
      err => {
        console.log(err);
        this._snackBar.open('Error in getting saved posts', 'Close', {
          duration: 5000,
        });
      }
    );

  }
}