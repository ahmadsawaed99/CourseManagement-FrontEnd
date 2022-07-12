import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { authResponse } from 'src/app/models/authResponse';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  Form:FormGroup;
  currentPassword : AbstractControl
  newPassword : AbstractControl
  confirmNewPassword : AbstractControl
  response : authResponse = {token :'',userRoles:[] , userId : ''}
  isError : boolean = false
  ErrorMessage : string = 'Somthing Went Wrong Please Make Sure That Your Current Password Is Correct'

  constructor(private fb:FormBuilder , private authService : AuthService , private router : Router) { }

  ngOnInit(): void {

    this.Form = this.fb.group({
      currentPassword:['',[Validators.required]],
      newPassword:['',[Validators.required,Validators.minLength(3)]],
      confirmNewPassword:['',[Validators.required,Validators.minLength(3)]]
    })

    this.currentPassword = this.Form.get('currentPassword')
    this.newPassword = this.Form.get('newPassword')
    this.confirmNewPassword = this.Form.get('confirmNewPassword')


  }
  onSubmit(){


    const CurrentPassword = this.Form.get('currentPassword').value
    const NewPassword = this.Form.get('newPassword').value
    const ConfirmNewPassword = this.Form.get('confirmNewPassword').value

    if(NewPassword === ConfirmNewPassword){
      this.authService.changePassword(localStorage.getItem('userId'),CurrentPassword,NewPassword,ConfirmNewPassword).subscribe(res =>{
        this.router.navigate(['/home'])
        console.log(res)

      },
      err =>{
        console.log(err)
        this.isError = true
      }
      )
    }

  }

}
