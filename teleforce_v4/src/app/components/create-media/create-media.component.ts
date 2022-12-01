import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Router} from "@angular/router";
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl } from "@angular/forms";
import { DigitalService } from '../../digital.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-media',
  templateUrl: './create-media.component.html',
  styleUrls: ['./create-media.component.css']
})
export class CreateMediaComponent implements OnInit {
  public AdGroupForm: FormGroup;
  spin = false;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateMediaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private formBuilder: FormBuilder,
    private digitalService: DigitalService,private _snackBar: MatSnackBar) { }

  async ngOnInit() {
    this.AdGroupForm = this.formBuilder.group({
      name:['',[Validators.required]],
    })
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  create_folder(){
    if (this.AdGroupForm['valid'] == false) {
      return
    }else{
      this.spin = true;
      var user_id = localStorage.getItem("access_id");
      let data: any = Object.assign(this.AdGroupForm.value);
      data.user_id=user_id;
      if(data.name != data.name.toLowerCase()){ // check validation only lower case
        this._snackBar.open('Folder name only allow lower case','OK',{
          duration: 5000,
        });
        return
      }else{
        if (/\s/.test(data.name)) { // check validation folder name space
          this._snackBar.open('Folder name space Not allow','OK',{
            duration: 5000,
          });
          return
        }else{
          this.digitalService.create_folder(data).then(
            data=>{
              this.dialogRef.close();
              this._snackBar.open(data['message'], 'Close', {
                  duration: 2000,
              });
              this.spin = false;
            },
            err => {
              console.log(JSON.stringify(err));
              this.spin = false;
            }
            
          );
        }
      }      
    }
    
  }
}
