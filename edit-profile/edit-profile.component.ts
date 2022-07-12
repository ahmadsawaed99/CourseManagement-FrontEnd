import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { waitForAsync } from '@angular/core/testing';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { student } from 'src/app/models/student/student.model';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  isError : boolean = false
  errorMessage : any
  studentToAdd : student
  students : student[] = []
  @Output() passStudent = new EventEmitter<student>();

  addStudentForm:FormGroup;
  firstName : AbstractControl
  lastName : AbstractControl
  adress : AbstractControl
  email : AbstractControl
  confirmEmail : AbstractControl

  user : student
  constructor(private fb:FormBuilder , private stService : StudentService , private route : ActivatedRoute , private router : Router) { }

  ngOnInit(): void {

   this.stService.getStudents().subscribe(res => {
     this.students = res
     console.log(res)
   })


    this.user = this.route.snapshot.data['user']

    this.students.filter(s => s.email !== this.user.email)

    this.addStudentForm = this.fb.group({
      firstName:[this.user.firstName,[Validators.required,Validators.minLength(3)]],
      lastName:[this.user.lastName,[Validators.required,Validators.minLength(3)]],
      adress:[this.user.adress,[Validators.required,Validators.minLength(3)]],
      email:[this.user.email,[Validators.required,Validators.minLength(3),Validators.email , this.emailValidator.bind(this) ]],
      confirmEmail:[this.user.email,[Validators.required,Validators.minLength(3)]],

    },{validators : [this.ConfirmEmailValidator ]})


    this.firstName = this.addStudentForm.get('firstName')
    this.lastName = this.addStudentForm.get('lastName')
    this.adress = this.addStudentForm.get('adress')
    this.email = this.addStudentForm.get('email')
    this.confirmEmail = this.addStudentForm.get('confirmEmail')
  }

  onSubmit(){
    if (this.addStudentForm.valid){
      const newUser : student = {
        id : '',
        firstName : this.addStudentForm.get('firstName').value,
        lastName :this.addStudentForm.get('lastName').value,
        adress : this.addStudentForm.get('adress').value,
        email : this.addStudentForm.get('email').value

      }
      this.stService.updateProfile(this.user.id ,newUser).subscribe(res => {
        console.log(res)
        window.location.reload()

      },
      err =>{
        console.log(err)
      }
      )
      this.router.navigate(['/home'])
    }
  }


  invalidFirstNameMessage() {
    const errors = this.firstName.errors
    if (errors?.['required']) {
      return 'You must enter your first name.'
    }
    if(errors?.['minlength']) {
      return 'First name must be at least 4 characters.'
    }
    else{
      return ''
    }

  }
  invalidLastNameMessage() {
    const errors = this.firstName.errors
    if (errors?.['required']) {
      return 'You must enter a Email.'
    }
    if(errors?.['minlength']) {
      return 'Last name must have at least 4 characters.'
    }
    else{
      return ''
    }

  }


  invalidAdress(){
    if (this.adress.errors?.['required']) {
      return 'You must enter your adress.'
    }
    return ''
  }

  invalidEmail(){
    if (this.email.errors?.['required']) {
      return 'You must enter your email.'
    }
    if (this.email.errors?.['email']) {
      return 'Incorrect email.'
    }
    if(this.email.errors?.['emailAlreadyExist']) {
      return 'Email adress already in use.'
    }
    return ''
  }

  invalidConfirmEmail() {

    if (this.confirmEmail.errors?.['required']) {
      return 'You must enter your email.'
    }
    if(this.addStudentForm.errors?.['emailNotRepeated']) {
      return 'Two emails must ne identical.'
    }
    else{
      return ''
    }
  }

  ConfirmEmailValidator(control : FormGroup) :ValidationErrors | null {
    const Email = control.get('email').value
    const ConfirmEmail = control.get('confirmEmail').value

    return Email !== ConfirmEmail ? {'emailNotRepeated':true} : null

  }


  emailValidator(control : AbstractControl) :ValidationErrors | null {
    const Email = control.value
    console.log(this.students.find(s => s.email === Email))
    return this.doesStudentExist(Email) ? {'emailAlreadyExist' : true} : null
  }

  doesStudentExist(email:string){
    return this.students.find(s => s.email === email && s.id !== this.user.id) !== undefined
  }

}



