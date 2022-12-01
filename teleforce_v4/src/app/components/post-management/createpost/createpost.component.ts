import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators,EmailValidator, SelectMultipleControlValueAccessor, Form } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog,MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
//import {CreatePostSchedualComponent} from '../create-post/create-post.component'
import { MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { DigitalService } from '../../../digital.service';
import { ManagerService } from"../../../manager.service";
@Component({
  selector: 'app-createpost',
  templateUrl: './createpost.component.html',
  styleUrls: ['./createpost.component.css']
})
export class CreatepostComponent implements OnInit {
  apiUrl = environment.apiUrl;
  media_path=environment.media_path;
  uploaded_file_data = []
  text = '';
  sid
  constructor(public dialog: MatDialog,private digitalService: DigitalService,private managerservice: ManagerService,
    private _snackBar: MatSnackBar,private formBuilder: FormBuilder,private http: HttpClient,
    public router: Router,
    private route: ActivatedRoute) { }
  all_channels=[];
  syc = false
  channel_checked= [];
  error = false
  already_syc = false
  savedPostData;
  postForm : FormGroup;
  previews: string[] = [];
  previews_type: string[] = [];
  message: string[] = [];
  progressInfos: any[] = [];
  spin = false
  selectedFiles?: FileList;
  images = [];
  youtube_category = false
  youtube_categoty_list
  title = false

  doesFileExist(urlToFile) {
    //console.log(urlToFile); 
      var xhr = new XMLHttpRequest();
      xhr.open('HEAD', urlToFile, false);
      xhr.send();
      if (xhr.status == 404 || xhr.status == 500) {
          return false;
      } else {
          return true;
      }
  }

  checkimagepathExists(path){
    console.log('checkimagepath called')
    return './assets/img/social-channel.png'
    var fileexist = this.doesFileExist(this.media_path+path)
    console.log('fileexist check',fileexist)
    if(fileexist){
      return path
    }else{
      return './assets/img/social-channel.png'
    }
  }

  ngOnInit() {
    this.getchannelsAll()
    var id=this.route.snapshot.queryParamMap.get('id');
    if(id){
      this.editScheduledPost(id);
    }
    this.postForm = this.formBuilder.group({
      message:[''],
      brand_id:[''],
      channel_arr:[],
      media :[],
      schedule_time:[''],
      category:[''],
      sid:[''],
      title:[''],
      dis:[''],
      type:['text']
    })

    
    this.accesssetting();
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
  onKeyUp(x) { // appending the updated value to the variable
    this.error = false
    this.text = x.target.value
    this.channel_checked.map((element,i)=>{
      if (element){
        if(this.all_channels[i].access_media == 'twitter' && this.text.length > 280){
          this.channel_checked[i]=false;        
          this._snackBar.open('Twitter Character Limit is 280 !! Unchecked Your Twitter channel.','Close',{
            duration: 5000,
          });
        }else if (this.all_channels[i].access_media == 'linkedin' && this.text.length > 400){
          this.channel_checked[i]=false;        
          this._snackBar.open('Linkedin Character Limit is 400 !! Unchecked Your Linkdin channel.','Close',{
            duration: 5000,
          });
        }
        else if (this.all_channels[i].access_media == 'youtube' && this.text.length > 100){
          this.channel_checked[i]=false;        
          this._snackBar.open('Youtube Title Character Limit is 100 !! Unchecked Your Youtube channel.','Close',{
            duration: 5000,
          });
        }
      }
    });
    
  }

  async selectFiles(element) {
    this.spin = true
    this.error = false
    const file: File = element.target.files[0];
    if(file.type=='image/jpeg' || file.type=='image/png' || file.type=='video/mp4'){
      var formData = new FormData();
      formData.append('file', element.target.files[0], localStorage.getItem('current_brand_id') );
      formData.append('name',file.name)
      formData.append('user_id',localStorage.getItem('access_id') )
      console.log('size', file.size);
      console.log('type', file.type);
      this.channel_checked.map((element,i)=>{
        if (element){
          if(this.all_channels[i].access_media == 'twitter' && file.size > 15728640 && file.type == 'video/mp4'){
            this.channel_checked[i]=false;        
            this._snackBar.open('Twitter Video Size Limit is 15 MB !! Unchecked Your Twitter channel.','Close',{
              duration: 5000,
            });
          }else if (this.all_channels[i].access_media == 'linkedin' && file.size > 209715200 && file.type == 'video/mp4'){
            this.channel_checked[i]=false;        
            this._snackBar.open('Twitter Video Size Limit is 200 MB !! Unchecked Your linkedin channel.','Close',{
              duration: 5000,
            });
          }
        }
      })
      
     // this.digitalService.check_default(formData).then(data=>{});
      this.digitalService.file_upload(formData).then(
        data=>{
          console.log(data);
          this._snackBar.open(data['msg'],'Close',{
            duration: 5000,
          });
          this.uploaded_file_data.push(data)
          console.log(this.uploaded_file_data);
          this.previews.push(`${this.media_path}`+data['filePath'])
          
          this.previews_type.push(file.type.substring(0,5))
          if(file.type.substring(0,5) == 'video'){
            this.title = true
          }
          
          this.spin = false
          console.log(this.previews_type);
          
          // this._snackBar.open(data['msg'],'Close',{
          //   duration: 5000,
          // });        
        },
        err=>{
          this.spin = false
          // console.log(err);
          this._snackBar.open(err['msg'],'Close',{
            duration: 5000,
          });
        }
      )
      
    }else{
      // this.spin = false
      // this._snackBar.open('File format invalid!','Close',{
      //   duration: 5000,
      // });
    }
    
  }

  remove_item(index){
    console.log(index);
    this.spin = true
    this.previews.splice(index,1);
    console.log(this.previews_type[index]);
    if(this.previews_type[index] == 'video'){
      this.title = false
    }
    this.previews_type.splice(index,1)
    this.previews_type.forEach(element => {
      if(element == 'video'){
        this.title = true
      }
    });
    this.uploaded_file_data.splice(index,1);
    this.spin = false
  }


  getchannelsAll(){
    var data_n = {'brand_id':localStorage.getItem('current_brand_id')}
 
    this.digitalService.get_channels_all(data_n).then(
      data1 => {
        this.all_channels = data1['data'];
        this.loadingSavedPost()
        console.log(this.all_channels);
        console.log(data1);
        this.all_channels.forEach((element,i) => {  //Temporary delete google my business channel
            if(element.access_media == 'google'){
              this.all_channels.splice(i,1)
            }
            
        });
        this.all_channels.map((element,i)=>{
          this.channel_checked[i]=false;
        });
        this.channel_checked[0]=true;
        console.log('savedPostData',this.savedPostData);
        if (this.savedPostData){ // selects channels if loading from draft
          this.channel_checked[0]=false;
        //----------------------OPTIMAZABLE---------------------
        this.savedPostData.channel_arr.map((element,index)=>{
          this.all_channels.map((element1,index1)=>{
            if (element1.channel_id==element){
              this.channel_checked[index1]=true;
            }
          });
        });
        }
        console.log('last check all channel',this.all_channels)
      },
      err=> {}
    )
  
  }

  openDialog3(): void {
    const dialogRef = this.dialog.open(SelectMediaFolderComponent, {
      width: '750px',
  
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log(result.data);
        // this.uploaded_file_data.push(result.data)
        result.data.forEach(element => {
          this.uploaded_file_data.push(element)
          this.previews.push(this.media_path+element.file_preview+'/'+element.file_name)
          if(element.file_type.substring(0,5) == 'video'){
            this.title = true
          }
          this.previews_type.push(element.file_type.substring(0,5))
        });   
        console.log("MEDIAA::::"+JSON.stringify(this.uploaded_file_data));
            
      }
    });
  }
  


  post_now(){
    var a = this.postForm.get('message').value
    console.log(this.uploaded_file_data.length);
    
    if(a.length == 0 && this.uploaded_file_data.length == 0){
      this.error = true
      this._snackBar.open('Please Fill Discription Or Upload Photo/Video','Close',{
        duration: 5000,
      });
    }else{
      this.channel_checked.map((element,i)=>{
        if (element){
          if(this.all_channels[i].access_media == 'twitter' && a.length > 280){
            this.channel_checked[i]=false;        
            this._snackBar.open('Twitter Message Character Limit is 280 !! Unchecked Your Twitter channel.','Close',{
              duration: 5000,
            });
          }else if (this.all_channels[i].access_media == 'linkedin' && a.length > 400){
            this.channel_checked[i]=false;        
            this._snackBar.open('Linkedin Message Character Limit is 400 !! Unchecked Your Linkdin channel.','Close',{
              duration: 5000,
            });
          }
          else if (this.all_channels[i].access_media == 'youtube' && a.length > 100){
            this.channel_checked[i]=false;        
            this._snackBar.open('Youtube Title Character Limit is 100 !! Unchecked Your Youtube channel.','Close',{
              duration: 5000,
            });
          }
        }
      });
      var savedChannel=[];
        var savedyoutube
        this.channel_checked.map((element,i)=>{
          if (element){
            savedChannel.push(this.all_channels[i].channel_id);
          }
        });
        this.postForm.get('brand_id').setValue(localStorage.getItem('current_brand_id'));
        this.postForm.get('message').setValue(this.postForm.get('message').value);
        this.postForm.get('channel_arr').setValue(savedChannel);
        this.postForm.get('media').setValue(this.uploaded_file_data);
        if(this.syc == false){
          this.postForm.get('schedule_time').setValue(new Date(new Date().getTime() + (60 * 1000)));
        }
        console.log(this.postForm);
        if(this.already_syc != true){
        
          this.digitalService.saveSchedulePost(this.postForm.value).then(
            data =>{
              if(data['message']){
                this._snackBar.open('Post saved successfully!','Close',{
                  duration: 5000,
                });
                this.postForm.get('message').setValue('');
                this.router.navigate(['post-management']);
              }else{            
                this._snackBar.open(data['error'],'Close',{
                  duration: 5000,
                });
              }
            },
            err =>{
              console.log(err);
              this._snackBar.open(err,'Close',{
                duration: 5000,
              });
            }
          )
          
        }else{
          console.log(this.sid);          
          this.postForm.get('sid').setValue(this.sid);
          this.digitalService.update_SchedulePosts(this.postForm.value).then(
            data =>{
              console.log(data);
              
              if(data['message']){
                this._snackBar.open('Post update successfully!','Close',{
                  duration: 5000,
                });
                this.postForm.get('message').setValue('');
                this.router.navigate(['post-management']);
              }else{            
                this._snackBar.open(data['error'],'Close',{
                  duration: 5000,
                });
              }
            },
            err =>{
              console.log(err);
              this._snackBar.open(err,'Close',{
                duration: 5000,
              });
            }
          )
          
        }
    }
    

  }

  onNativeChange(e,value) { // here e is a native event
    console.log(value.target.checked);
    if(e.access_media == 'youtube' && value.target.checked == true){
      this.youtube_category = true
      this.title = true
      /*
      this.PFService.youtube_category(e.channel_id).then(
        data=>{
          console.log(data['data']['items']);
         this.youtube_categoty_list =  data['data']['items']
        },
        err=>{
          console.log(err);
        }
      )
      */
    }else{
      this.youtube_category = false
      this.title = false
    }
  }


  openDialog() {
    const dialogRef =  this.dialog.open(CreatePostSchedualComponent, {disableClose: true,data: {scheduleTime: ''}});  
    
     dialogRef.afterClosed().subscribe(result => {
       if (result){
         console.log('The dialog was closed');
         this.postForm.get('schedule_time').setValue(result.scheduleTime);    
         console.log(result.scheduleTime);
         console.log(this.postForm.get('schedule_time').value);
         this.syc = true
         this.post_now()
    
         
       }
     }); 
  }


  loadingSavedPost(){
    //this.savedPostData=this.PFService.getSavedPostData();    
    if(this.savedPostData != undefined){
      this.already_syc = true
      this.sid = this.savedPostData.sid
      this.postForm.get('message').setValue(this.savedPostData.message);
      this.savedPostData.channel_arr.map((ele2, i2) => {
        console.log(ele2);
        var result = this.all_channels.find(ele3 => ele3.channel_id === ele2);
        console.log(result);
      });
      if(this.savedPostData.media.length != 0){
        /*
        this.PFService.getschedulepost_file(this.savedPostData.media).then(
          data => {
            data['data'].forEach(element => {
              this.previews.push(element.file_preview)
              this.uploaded_file_data.push(element)
            });
          }
        )
        */
      }
    }
   
  }
  
  editScheduledPost(id){
    this.digitalService.getSchedulePostfile(id).then(
      data => {
        if(data){
          console.log('getSchedulePostByid',data);
          this.already_syc = true;
          this.sid = id;
          data['data'].forEach(element => {
            console.log('element',element);
               
            
            if(element.file_name && element.file_type){
              var imagepreview=`${this.media_path}`+element.file_preview+'/'+element.file_name;
              var file_dta={'filePath':element.file_preview+'/'+element.file_name,'F_id':element.F_id};
              this.uploaded_file_data.push(file_dta);
              this.previews.push(imagepreview);
              this.previews_type.push(element.file_type.substring(0,5));
            }
            this.postForm.get('message').setValue(element.message);
             
            element.channel_arr=JSON.parse(element.channel_arr);
            element.channel_arr.map((element1,index)=>{
              console.log(element1);
              this.all_channels.map((element2,index1)=>{
                if (element2.channel_id==element1){
                  this.channel_checked[index1]=true;
                }
              });
            });
          })
        } 
      },
      err => {
        console.log(err);
      }
    );
  }
}

export interface PeriodicElement {
  position: number;
  name: string;
  create:string;
  action: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1 , name: 'Images',create:'',  action: '' },
];


@Component({
  selector: 'select-media-folder',
  templateUrl: 'select-media-folder.component.html',
  styleUrls: ['./createpost.component.css']
})

export class SelectMediaFolderComponent {
  list
  displayedColumns: string[] = ['position', 'name','create'];
  public dataSource: MatTableDataSource<any>;
  interestLength = 0;
  spin = false
  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<SelectMediaFolderComponent>,
    private digitalService:DigitalService,
    @Inject(MAT_DIALOG_DATA) public data: CreatepostComponent) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(); // create new object
    this.get_folder()
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  openDialog1(): void {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(SelectMediaItemComponent, {
      width: '750px',
  
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      
    });

  }
  click_file(data){ 
    console.log('data::'+data.B_id);
    const dialogRef = this.dialog.open(SelectMediaItemComponent, {
      width: '750px',data:data.B_id
  
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      this.dialogRef.close({ event: 'Add',data:result.data});
    });
  }
  get_folder() {
    this.spin = true
    var user_id=localStorage.getItem('access_id') 
    this.digitalService.get_folder(user_id).then(
      data => {
        console.log(data);
        this.spin = false
        this.dataSource.data = data['data'];
        this.interestLength = data['data'].length;
      },
      err => {
        this.spin = false
        console.log(err);
      }
    );
    
  }
}


@Component({
  selector: 'select-media-item',
  templateUrl: 'select-media-item.component.html',
  styleUrls: ['./createpost.component.css']
})
export class SelectMediaItemComponent {
  displayedColumns: string[] = ['position','name','media', 'modi', 'size'];
  selection = new SelectionModel<PeriodicElement>(true, []);
  public dataSource: MatTableDataSource<any>;
  interestLength = 0;
  filedata=[];
  loadingfile = false;
  imageSrc = 'api/uploads/'
  media_checked= [];
  media_link = [];
  enableSelection=false;
  mainloader=false;
  total_checked=0;
  folder_name = 'folder'
  spin = false
  sl = []
  media_path=environment.media_path;
  constructor(
    public dialogRef: MatDialogRef<SelectMediaItemComponent>,
    private digitalService: DigitalService,
    @Inject(MAT_DIALOG_DATA) public data: SelectMediaFolderComponent,private _snackBar: MatSnackBar,private router: Router) {}

  onNoClick1(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    console.log(this.data);
    this.dataSource = new MatTableDataSource(); // create new object
    this.folder()
    this.getmedia();
    //this.getMenuAccess();
  }

  folder(){
    var bucket = {'bucket_id':this.data}
    this.digitalService.get_folder_name(bucket).then(
      data=>{
        console.log(data);
        if(data['data']){
          this.folder_name = data['data'][0].temp_name
        }
      },
      err=>{
        this.loadingfile = false
        //console.log(err);
        this._snackBar.open('Something went wrong.please try again!','Close',{
          duration: 5000,
        });
      }
    )
    
  }

  getmedia(){
    // this.mainloader=true;
    this.spin = true
    var bucket = {'bucket_id':this.data}
    this.digitalService.get_file(bucket).then(
      data=>{
        console.log(data);
        this.spin = false
        this.dataSource.data = data['data'];
        this.interestLength = data['data'].length;
      },
      err=>{
        this.spin = false
        //console.log(err);
        this._snackBar.open('Something went wrong.please try again!','Close',{
          duration: 5000,
        });
      }
    )
    
  }

  getMenuAccess() {
  
    this.digitalService.getMenuAccess().then(
      data => {
        var accessdata = ((data['menuaccess']));
        //console.log(data['access']['menuaccess']);
        if (accessdata.includes('medialibrary')) {
          //this.router.navigate(['/dashboard']);
        } else {
         // this.router.navigate(['/dashboard']);
        }
      },
      err => {
        console.log(err);
      }
    );
    
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource.data.forEach(row => this.selection.select(row));
    
  }

  sub(){
    this.sl = []
    this.selection['_selected'].forEach(element => {
      console.log('element',element);
      this.sl.push(element);
    });
    console.log(this.sl);
    //this.senddata.selectdata(this.sl)
    this.dialogRef.close({ event: 'Add',data:this.sl});
    // @ViewChild(CreatepostComponent).selectdata(this.sl);
  }
}

export interface DialogData {
  scheduleTime: string;
  twitter_checked : boolean;
  TAdAccIndex : object;
  abc: string;
}


@Component({
  selector: 'createpost-schedual', 
  templateUrl: 'create-post-schedual.component.html', 
  styleUrls: ['./createpost.component.css']
})
export class CreatePostSchedualComponent {
  TAdAccOption = 'Select Your Twitter Ad Account';
  constructor(public dialogRef: MatDialogRef<CreatepostComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
  schedBtnValidation(){
    if (this.data.scheduleTime)
    {
      return true;
    }
    else {
      return false;
    }
  }
  saveTAdAcc(index){
    this.data.TAdAccIndex = index;
  }

  schedulepost(){
    //console.log(this.data.scheduleTime);
    this.dialogRef.close({ scheduleTime:this.data.scheduleTime });
  }

  onNoClick(): void {
    this.dialogRef.close();
  } 
 
}
