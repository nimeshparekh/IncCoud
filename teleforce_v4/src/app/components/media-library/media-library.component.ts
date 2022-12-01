import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DigitalService } from '../../digital.service.js';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { element } from 'protractor';
import { ElementSchemaRegistry, ThrowStmt } from '@angular/compiler';
import { Router, ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { environment } from "../../../environments/environment";
import {HttpClient, HttpResponse} from '@angular/common/http';
import { ManagerService } from "../../manager.service";

export interface PeriodicElement {
  position: number;
  name: string;
  modi: string;
  size: string;
  action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Images', modi: ' 1 AM', size: '1 kb', action: '' },
];


export interface DialogData1 {
  media_count: Number,
}

export interface ImageData {
  media_obj: {},
}

@Component({
  selector: 'app-media-library',
  templateUrl: './media-library.component.html',
  styleUrls: ['./media-library.component.css']
})
export class MediaLibraryComponent implements OnInit {

  displayedColumns: string[] = ['bulk', 'position', 'name', 'modi', 'size', 'action'];
  // dataSource= ELEMENT_DATA;
  public dataSource: MatTableDataSource<any>;
  interestLength = 0;
  constructor(private route: ActivatedRoute, 
    public dialog: MatDialog, private digitalService: DigitalService, 
    private _snackBar: MatSnackBar, 
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private managerservice: ManagerService
    ) { }
  filedata = [];
  loadingfile = false;
  media_checked = [];
  media_link = [];
  enableSelection = false;
  mainloader = false;
  total_checked = 0;
  folder_name = 'folder'
  spin = false
  fileArr = [];
  msg = false;
  form: FormGroup;
  ngOnInit() {
    this.dataSource = new MatTableDataSource(); // create new object
    this.folder()
    this.getmedia();
    this.accesssetting();
  }
  async accesssetting() {
    var userid = localStorage.getItem('access_id');

    await this.managerservice.getManagerDetail(userid).then(
      data => {
      
        var services = JSON.parse(data['data']['services']);
        console.log(services);

        if(services.includes('17')){
            
        }else{ 
          this.router.navigate(['/dashboard']);

        }
        // if (services.length > 0) {
        //   for (var i = 0; i < services.length; i++) {
        //     if (services[i] == '17') {
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
  folder() {
    var bucket = { 'bucket_id': this.route.snapshot.paramMap.get('id') }
    this.digitalService.get_folder_name(bucket).then(
      data => {
        console.log(data);
        if (data['data']) {
          this.folder_name = data['data'][0].temp_name
        }
      },
      err => {
        this.loadingfile = false
        //console.log(err);
        this._snackBar.open('Something went wrong.please try again!', 'Close', {
          duration: 5000,
        });
      }
    )
  }

  getmedia() {
    // this.mainloader=true;
    this.spin = true
    var bucket = { 'bucket_id': this.route.snapshot.paramMap.get('id') }
    this.digitalService.get_file(bucket).then(
      data => {
        console.log(data);
        this.spin = false
        this.dataSource.data = data['data'];
        this.interestLength = data['data'].length;
      },
      err => {
        this.spin = false
        //console.log(err);
        this._snackBar.open('Something went wrong.please try again!', 'Close', {
          duration: 5000,
        });
      }
    )
  }


  upload(element) {
    this.spin = true;
    const file: File = element.target.files[0];
    console.log('size', (file.size));
    console.log('type', file.type);
    console.log("Called Upload");
    console.log(file.name);
    if (file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'video/mp4') {
      this.loadingfile = true
      var formData = new FormData();
      var bucket_id = this.route.snapshot.paramMap.get('id');
      formData.append('file', element.target.files[0]);
      formData.append('bucket_id', bucket_id);
      formData.append('name', file.name);
      this.digitalService.uploadmediafile(formData).then(
        data => {
          this.spin = false
          this._snackBar.open(data['message'], 'Close', {
            duration: 5000,
          });
          this.getmedia();
        },
        err => {
          this.spin = false
          console.log(err);
          this._snackBar.open(err['message'], 'Close', {
            duration: 5000,
          });
        }
      )
    } else {
      this.spin = false
      this._snackBar.open('File format invalid!', 'Close', {
        duration: 5000,
      });
    }
    
  }
  document_upload(element) {
    this.spin = true;
    const file: File = element.target.files[0];
    console.log('size', (file.size));
    console.log('type', file.type);
    console.log("Called Upload");
    console.log(file.name);
    
    if (file.type == 'application/pdf' || file.type == 'application/vnd.ms-powerpoint' || file.type == 'application/msword' || file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.loadingfile = true
      var formData = new FormData();
      var bucket_id = this.route.snapshot.paramMap.get('id');
      formData.append('file', element.target.files[0]);
      formData.append('bucket_id', bucket_id);
      formData.append('name', file.name);
      this.digitalService.uploadmediafile(formData).then(
        data => {
          this.spin = false
          this._snackBar.open(data['message'], 'Close', {
            duration: 5000,
          });
          this.getmedia();
        },
        err => {
          this.spin = false
          console.log(err);
          this._snackBar.open(err['message'], 'Close', {
            duration: 5000,
          });
        }
      )
    } else {
      this.spin = false
      this._snackBar.open('File format invalid!', 'Close', {
        duration: 5000,
      });
    }
    
  }
  mediaPreview(media) {
    console.log(media);

    if (!this.enableSelection) {
      const dialogRef = this.dialog.open(imagePreviewComponent, {
        width: '450px', data: { media_obj: media }
      });

      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }

  totalChecked(checked) {
    if (checked) {
      this.total_checked = this.total_checked + 1;
    }
    else {
      this.total_checked = this.total_checked - 1;
    }
    console.log(this.total_checked);
  }

  select_enable() {
    if (this.enableSelection == false) {
      this.enableSelection = true;
    }
    else {
      this.enableSelection = false;
    }
  }


  deleteConfirm() {
    console.log(this.media_checked);
    const dialogRef = this.dialog.open(deleteConfirmComponent, {
      width: '450px', data: { media_count: this.total_checked }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delete();
      }

    });

  }


  async delete() {
    this.mainloader = true;
    var deletingArr = []
    await this.media_checked.map((element, i) => {
      if (element) {
        deletingArr.push(this.filedata[i].media_id);
      }
    });
    console.log(deletingArr);
    this.digitalService.deleteMedia(deletingArr).then(
      async data => {
        console.log(data);
        var scount = 0;
        var fcount = 0;
        this.mainloader = false;
        if (data['msg']) {
          this._snackBar.open(data['msg'], 'Close', {
            duration: 5000,
          });
        }
        // for (var key in data['deletedResponse']){
        //   if(data['deletedResponse'][key]){
        //     scount=scount+1;
        //   }
        //   else{
        //     fcount=fcount+1;
        //   }
        //   if (key==Object.keys(data['deletedResponse'])[Object.keys(data['deletedResponse']).length-1]){
        //     this._snackBar.open('Deleted '+scount+' file(s) successfully','Close',{
        //       duration: 5000,
        //     });
        //   }
        // }
        this.media_checked = [];
        this.enableSelection = false;
        this.filedata = [];
        this.getmedia();
      },
      err => {
        console.log(err);
      }
    )
  }

  delete_file(data) {
    console.log(data);
    const dialogRef = this.dialog.open(deleteConfirmComponent, {
      width: '450px', data: { media_count: data }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getmedia()


    });

  }

  refresh() {
    this.getmedia()
  }


  routingback() {
    this.router.navigate(['/digital/media-directory']);
  }

  addbulkschedule(fileid) {
    if (this.fileArr.length > 0) {
      var check = this.fileArr.includes(fileid);

      if (check == true) {
        for (var i = 0; i < this.fileArr.length; i++) {
          if (this.fileArr[i] == fileid) {
            this.fileArr.splice(i, 1);
          }
        }

      } else {
        this.fileArr.push(fileid);
      }

    } else {
      this.msg = true;
      this.fileArr.push(fileid);
    }
  }
  bulkschedule() {
    if (this.fileArr.length > 0) {
      //this.msg="";
      const dialogRef = this.dialog.open(BulkSchedualPostComponent, {
        width: '1000px', data: { mediaArr: this.fileArr }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.getmedia()
        this.fileArr=[];
        this.msg=false;
      });

    } else {
      //this.msg="Please select atleast one media file!!";
    }
  }
  downloadFiles(media){
    //data1['data'][0]['file_preview']
    console.log('downloadFiles',media);
    console.log('file_path',environment.media_path+media.file_preview+'/'+media.file_name);
    return this.http.get(environment.media_path+media.file_preview+'/'+media.file_name, {responseType: 'blob'});
  }
}

//Delete Confirm Component
@Component({
  selector: 'deleteConfirm',
  templateUrl: 'delete_confirm.component.html',
})
export class deleteConfirmComponent {
  num_of_media;
  constructor(
    public dialogRef: MatDialogRef<deleteConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData1, private digitalService: DigitalService, private _snackBar: MatSnackBar) {
    console.log(data)
  }


  ngOnInit() {
    console.log(this.data['media_count']);
    this.num_of_media = this.data['media_count'];
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  delete_file(data_details) {
    console.log(data_details);
    this.digitalService.delete_file(data_details).then(
      data => {
        console.log(data);
        this.dialogRef.close();
        this._snackBar.open(data['message'], 'Close', {
          duration: 5000,
        });
      },
      err => {
        console.log(err);
        this.dialogRef.close();
        this._snackBar.open('Something went wrong.please try again!', 'Close', {
          duration: 5000,
        });
      }
    )
  }
}

//IMAGE PREVIEW COMPONENT
@Component({
  selector: 'imagePreview',
  templateUrl: 'image_preview.component.html',
})
export class imagePreviewComponent {
  media_link;
  media_type;
  img_base_path;
  media_path=environment.media_path;
  constructor(
    public dialogRef: MatDialogRef<imagePreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageData) { console.log(data) }

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
    
  ngOnInit() {
    console.log(this.data);
    this.media_link = this.data['media_obj']['file_preview'];
    this.img_base_path=`${this.media_path}`+this.media_link+'/'+this.data['media_obj']['file_name'];
    var checkpath = this.doesFileExist(this.img_base_path)
    console.log(checkpath);
    if(checkpath){

    }else{
      this.img_base_path='./assets/img/notfound.jpeg';
    }
    var media = this.data['media_obj']['file_type'].substring(0, 5)
    console.log(media);
    this.media_type = media;
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'bulk-schedual',
  templateUrl: 'bulk-schedual-post.component.html',
  styleUrls: ['./media-library.component.css']
})
export class BulkSchedualPostComponent {

  public addForm: FormGroup;
  all_channels = [];
  mediapreview = [];
  constructor(public dialogRef: MatDialogRef<BulkSchedualPostComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, public digitalService: DigitalService,private _snackBar: MatSnackBar) { }
  get configarr(): FormArray {
    return this.addForm.get('settingDetail') as FormArray;
  }
  ngOnInit() {
    //console.log(this.data);
    var userid = localStorage.getItem("access_id");
    let arr = [];
    for (let i = 0; i < this.data['mediaArr'].length; i++) {
      // console.log(this.BuildFormDynamic(i));
      this.digitalService.getMediaById(this.data['mediaArr'][i]).then(
        data1 => {
          console.log(data1['data']);
          //this.all_channels = data1['data'];
          this.mediapreview.push(environment.media_path+data1['data'][0]['file_preview']+'/'+data1['data'][0]['file_name'])
          console.log('shedule_file',this.mediapreview);
        },
        err => { }
      )
      arr.push(this.fb.group({
        media: [this.data['mediaArr'][i]],
        channelid: [''],
        description: [''],
        scheduledate: [''],
        brandid:[localStorage.getItem('current_brand_id')]
      }))
    }
    this.addForm = this.fb.group({
      userid: [userid],
      settingDetail: this.fb.array(arr)
    });
    this.getchannelsAll();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  getchannelsAll() {
    var data_n = { 'brand_id': localStorage.getItem('current_brand_id') }
    this.digitalService.get_channels_all(data_n).then(
      data1 => {
        console.log(data1['data']);
        this.all_channels = data1['data'];

      },
      err => { }
    )
  }
  bulkpost() {
    let data: any = Object.assign(this.addForm.value);
    this.digitalService.createBulkSchedulePost(data).then(
      data => {
        //console.log(data['data']);
        this._snackBar.open(data['msg'], '', {
          duration: 2000, verticalPosition: 'top'
        });
        // this.toastr.success(data['data']);
        this.dialogRef.close({ event: 'Update' });
      },
      err => {
        console.log('error');
      }
    );

  }
  
}
