import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { firstValueFrom, lastValueFrom, take } from 'rxjs';
import { CourseService } from '../../services/course.service';
import { AddCourse } from '../../models/add-course.model';
import { course } from '../../models/course/course.model';
import { day } from '../../models/day.model';
import { ClassesToAdd } from '../../models/daysAndHoursOfCourse.model';
import { Hour } from '../../models/Hour.model';

@Component({
  selector: 'app-add-course-form',
  templateUrl: './add-course-form.component.html',
  styleUrls: ['./add-course-form.component.css']
})
export class AddCourseFormComponent implements OnInit {

  Days : day[] = [{id : 1, day: 'sunday'},{id : 2, day: 'monday'},{id : 3, day: 'tuesday'},{id : 4, day: 'wedensday'},{id : 5, day: 'thirsday'},{id : 6, day: 'friday'},{id : 7, day: 'saturday'}]

  Hours : Hour[] = [
  { value: 8, hour: '8:00'},
  { value: 9, hour: '9:00'},
  { value: 10, hour: '10:00'},
  { value: 11, hour: '11:00'},
  { value: 12, hour: '12:00'},
  { value: 13, hour: '13:00'},
  { value: 14, hour: '14:00'},
  { value: 15, hour: '15:00'},
  { value: 16, hour: '16:00'},
  { value: 17, hour: '17:00'},
  { value: 18, hour: '18:00'}
]

  SundayValidEndHours : Hour[] = []
  MondayValidEndHours : Hour[] = []
  TuesdayValidEndHours : Hour[] = []
  WedensdayValidEndHours : Hour[] = []
  ThirsdayValidEndHours : Hour[] = []
  FridayValidEndHours : Hour[] = []
  SaturdayValidEndHours : Hour[] = []


  addCourseForm : FormGroup;

  courseName : AbstractControl
  startDate : AbstractControl
  endDate : AbstractControl
  sunday : AbstractControl
  monday : AbstractControl
  tuesday : AbstractControl
  wedensday : AbstractControl
  thirsday : AbstractControl
  friday : AbstractControl
  saturday : AbstractControl

  sundayStartHour : AbstractControl
  mondayStartHour : AbstractControl
  tuesdayStartHour : AbstractControl
  wedensdayStartHour : AbstractControl
  thirsdayStartHour : AbstractControl
  fridayStartHour : AbstractControl
  saturdayStartHour : AbstractControl

  sundayEndHour : AbstractControl
  mondayEndHour : AbstractControl
  tuesdayEndHour : AbstractControl
  wedensdayEndHour : AbstractControl
  thirsdayEndHour : AbstractControl
  fridayEndHour : AbstractControl
  saturdayEndHour : AbstractControl


  todayDate : Date = new Date();
  minStartDate : Date = new Date();
  maxStartDate : Date = new Date(this.todayDate.setDate(this.todayDate.getDate()+30))

  minEndDate : Date;
  maxEndDate : Date;


  todayString : string = new Date().toISOString();
  todayISOString : string = new Date().toDateString();

  newCourse : AddCourse
  course : course



  isCourseInDb :any = false

  @Output() passCourse = new EventEmitter<course>();
  @Output() closeWithoutAdding = new EventEmitter<string>();

  constructor(private fb:FormBuilder , private courseService : CourseService) { }

  ngOnInit(): void {
    this.addCourseForm = this.fb.group({
      courseName:[,[Validators.required,Validators.minLength(2)]],
      startDate:[,[Validators.required,Validators.minLength(3)]],
      endDate:[,[Validators.required,Validators.minLength(3)]],
      sunday:[false,[Validators.required,Validators.minLength(3)]],
      monday:[false,[Validators.required,Validators.minLength(3)]],
      tuesday:[false,[Validators.required,Validators.minLength(3)]],
      wedensday:[false,[Validators.required]],
      thirsday:[false,[Validators.required,Validators.minLength(3)]],
      friday:[false,[Validators.required,Validators.minLength(3)]],
      saturday:[false,[Validators.required]],

      sundayStartHour:[''],
      mondayStartHour:[''],
      tuesdayStartHour:[''],
      wedensdayStartHour:[''],
      thirsdayStartHour:[''],
      fridayStartHour:[''],
      saturdayStartHour:[''],

      sundayEndHour:[''],
      mondayEndHour:[''],
      tuesdayEndHour:[''],
      wedensdayEndHour:[''],
      thirsdayEndHour:[''],
      fridayEndHour:[''],
      saturdayEndHour:[''],


    })

    this.courseName = this.addCourseForm.get('courseName')
    this.startDate = this.addCourseForm.get('startDate')
    this.endDate = this.addCourseForm.get('endDate')
    this.sunday = this.addCourseForm.get('sunday')
    this.monday = this.addCourseForm.get('monday')
    this.tuesday = this.addCourseForm.get('tuesday')
    this.wedensday = this.addCourseForm.get('wedensday')
    this.thirsday = this.addCourseForm.get('thirsday')
    this.friday = this.addCourseForm.get('friday')
    this.saturday = this.addCourseForm.get('saturday')

    this.sundayStartHour = this.addCourseForm.get('sundayStartHour')
    this.mondayStartHour = this.addCourseForm.get('mondayStartHour')
    this.tuesdayStartHour = this.addCourseForm.get('tuesdayStartHour')
    this.wedensdayStartHour = this.addCourseForm.get('wedensdayStartHour')
    this.thirsdayStartHour = this.addCourseForm.get('thirsdayStartHour')
    this.fridayStartHour = this.addCourseForm.get('fridayStartHour')
    this.saturdayStartHour = this.addCourseForm.get('saturdayStartHour')

    this.sundayEndHour = this.addCourseForm.get('sundayEndHour')
    this.mondayEndHour = this.addCourseForm.get('mondayEndHour')
    this.tuesdayEndHour = this.addCourseForm.get('tuesdayEndHour')
    this.wedensdayEndHour = this.addCourseForm.get('wedensdayEndHour')
    this.thirsdayEndHour = this.addCourseForm.get('thirsdayEndHour')
    this.fridayEndHour = this.addCourseForm.get('fridayEndHour')
    this.saturdayEndHour = this.addCourseForm.get('saturdayEndHour')

    // console.log(this.startDate)


  }

  onSubmit(){
    if (this.addCourseForm.valid){

      this.newCourse = {

        name : this.addCourseForm.get('courseName').value,
        StartingDate :this.startDate.value,
        EndingDate : this.endDate.value,
        DaysAndHoursOfCourses : this.addClassesToCourse()

      }

      // console.log(lastValueFrom(this.courseService.isCourseInDb(this.newCourse.name)))

      this.courseService.isCourseInDb(this.newCourse.name).subscribe((res : any) =>{
        if (res){
          this.isCourseInDb = true
        }
        else{
          this.courseService.postCourse(this.newCourse).subscribe(res => {
            // console.log(res);
            if(Number.isInteger(res)){
              this.course = {
                id : parseInt(res.toString()),
                name :this.newCourse.name,
                startingDate : this.newCourse.StartingDate,
                endingDate : this.newCourse.EndingDate
              }
              this.passCourse.emit(this.course)
            }

          })
        }
      })
      console.log(this.isCourseInDb)
      // console.log(this.isCourseInDb)


    }

  }

  onSelectStartDate(){
    const StartDate = this.addCourseForm.get('startDate').value
    this.minEndDate = StartDate
  }

  onSelectStartHour(startHour,startHourElement){

    let startHourValue = Number.parseInt(startHour.target.value)

    switch (startHourElement){
      case 'sundayStartHour' :{
        this.SundayValidEndHours = this.Hours.filter(h => h.value > startHourValue)
        break
      }
      case 'mondayStartHour' :{
        this.MondayValidEndHours = this.Hours.filter(h => h.value > startHourValue)
        break
      }
      case 'tuesdayStartHour' :{
        this.TuesdayValidEndHours = this.Hours.filter(h => h.value > startHourValue)
        break
      }
      case 'wedensdayStartHour' :{
        this.WedensdayValidEndHours = this.Hours.filter(h => h.value > startHourValue)
        break
      }
      case 'thirsdayStartHour' :{
        this.ThirsdayValidEndHours = this.Hours.filter(h => h.value > startHourValue)
        break
      }
      case 'fridayStartHour' :{
        this.FridayValidEndHours = this.Hours.filter(h => h.value > startHourValue)
        break
      }
      case 'saturdayStartHour' :{
        this.SaturdayValidEndHours = this.Hours.filter(h => h.value > startHourValue)
        break
      }
    }
  }

  EndHourArray(day){
    switch (day){
      case 'sunday' :{
        return this.SundayValidEndHours
        break
      }
      case 'monday' :{
        return this.MondayValidEndHours
        break
      }
      case 'tuesday' :{
        return this.TuesdayValidEndHours
        break
      }
      case 'wedensday' :{
        return this.WedensdayValidEndHours
        break
      }
      case 'thirsday' :{
        return this.ThirsdayValidEndHours
        break
      }
      case 'friday' :{
        return this.FridayValidEndHours
        break
      }
      case 'saturday' :{
        return this.SaturdayValidEndHours
        break
      }
      default :{
        return this.Hours
      }
    }
  }

  checkStartDateValue(){
    const StartDate = this.addCourseForm.get('startDate').value

    if (StartDate === null)
    {
      return true
    }
    else {
      return false
    }

  }

  onExit(){
    this.closeWithoutAdding.emit();
  }


  addClassesToCourse(){

    let classes : ClassesToAdd[] = []

    for(let i=0; i<7 ; i++){
      let classToAdd : ClassesToAdd

      if (this.addCourseForm.get(this.Days[i].day).value){

        classToAdd = {
          day : this.Days[i].id,
          StartClassHour : this.addCourseForm.get(this.Days[i].day + 'StartHour').value / 1,
          EndClassHour : this.addCourseForm.get(this.Days[i].day + 'EndHour').value / 1
        }

        console.log(classToAdd)
        classes.push(classToAdd)

      }
    }

    return classes

  }


}
