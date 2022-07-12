import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { newStudent } from '../../../models/addStudent.model';
import { student } from '../../../models/student/student.model';
import { StudentService } from 'src/app/services/student.service';
@Component({
  selector: 'app-add-student-form',
  templateUrl: './add-student-form.component.html',
  styleUrls: ['./add-student-form.component.css']
})
export class AddStudentFormComponent implements OnInit {


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
  password : AbstractControl
  confirmPassword : AbstractControl
  constructor(private fb:FormBuilder , private stService : StudentService) { }

  ngOnInit(): void {
    this.stService.getStudents().subscribe(res => {
      this.students = res;
    })
    this.students = this.stService.students;

    this.addStudentForm = this.fb.group({
      firstName:['',[Validators.required,Validators.minLength(3)]],
      lastName:['',[Validators.required,Validators.minLength(3)]],
      adress:['',[Validators.required,Validators.minLength(3)]],
      email:['',[Validators.required,Validators.minLength(3),Validators.email , this.emailValidator.bind(this) ]],
      confirmEmail:['',[Validators.required,Validators.minLength(3)]],
      password:['',[Validators.required,Validators.minLength(3),this.passwordValidator]],
      confirmPassword:['',[Validators.required]],

    },{validators : [this.confirmPasswordValidator , this.ConfirmEmailValidator ]})


    this.firstName = this.addStudentForm.get('firstName')
    this.lastName = this.addStudentForm.get('lastName')
    this.adress = this.addStudentForm.get('adress')
    this.email = this.addStudentForm.get('email')
    this.confirmEmail = this.addStudentForm.get('confirmEmail')
    this.password = this.addStudentForm.get('password')
    this.confirmPassword = this.addStudentForm.get('confirmPassword')
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

  invalidPassword() {
    const errors = this.password.errors
    if (errors?.['required']) {
      return 'You must enter password.'
    }
    if(errors?.['minlength']) {
      return 'Last name must be at least 4 characters.'
    }
    if(errors?.['passwordinvalid']){
      return 'Password must include digits.'
    }
    else{
      return ''
    }
  }
  invalidConfirmPassword() {

    if (this.confirmPassword.errors?.['required']) {
      return 'You must enter password.'
    }
    if(this.addStudentForm.errors?.['passwordnotrepeated']) {
      return 'Two passwords must ne identical.'
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

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const isIncludesWhiteSpace = control.value.includes(' ')
    const isIncludesDigits = (/\d/).exec(control.value)
    const invalid = !isIncludesDigits || isIncludesWhiteSpace
    return invalid ? { 'passwordinvalid': true } : null
  }
  confirmPasswordValidator(control: FormGroup): ValidationErrors | null {
    const Password = control.get('password').value
    const ConfirmPassword = control.get('confirmPassword').value
    return Password !== ConfirmPassword ? { 'passwordnotrepeated': true } : null
  }

  emailValidator(control : AbstractControl) :ValidationErrors | null {
    let Email = control.value
    console.log(this.students.find(s => s.email === Email))
    return this.students.find(s => s.email === Email) !== undefined ? {'emailAlreadyExist' : true} : null
  }

  doesStudentExist(email:string){
    return this.students.find(s => s.email === email) !== null
  }

  onAddingNewStudent(){
    if (this.addStudentForm.valid){
      this.studentToAdd= {
        id : '',
        firstName : this.addStudentForm.get('firstName').value,
        lastName : this.addStudentForm.get('lastName').value,
        adress :this.addStudentForm.get('adress').value,
        email : this.addStudentForm.get('email').value

      }
      this.stService.postStudent(this.firstName.value,
        this.lastName.value,this.adress.value,
        this.email.value,this.confirmEmail.value,
        this.password.value,this.confirmPassword.value).subscribe(res => {
          if(res === true) {
            this.passStudent.emit(this.studentToAdd)
          }
          console.log(res);
        },
        (err) => {
          this.errorMessage = err
          this.isError = true
        })

    }
  }
  onExit(){
    this.passStudent.emit()
  }
}


