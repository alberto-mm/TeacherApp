import { Component, OnInit } from '@angular/core';
import { City } from 'src/app/interfaces/city.interface';
import { Province } from 'src/app/interfaces/province.interface';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {LocationsService } from 'src/app/services/locations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsService } from 'src/app/services/students.service';
import { UsersService } from 'src/app/services/users.service';
import { LoginAuthService } from 'src/app/services/login-auth.service';
import { Student } from 'src/app/interfaces/student.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {

  studentForm:FormGroup;
  student_role_id = 3
  provinces: Province[] = [];
  cities: City[] = [];
  citiesbyProvince: City[] = []
  accion:string = "Registrar"
  storedStudent: any
  userLat: number | undefined = undefined
  userLon: number | undefined = undefined

  constructor( 
    private locationsService: LocationsService,
    private studentsService: StudentsService,
    private usersService: UsersService,
    private activatedRoute:ActivatedRoute,
    private loginAuthService: LoginAuthService,
    private router: Router) { 
    this.studentForm  = new FormGroup({
      role_id: new FormControl(this.student_role_id,[]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
      ]),
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/)
      ]),
      surname: new FormControl('',[
        Validators.required,
        Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/)
      ]),
      password: new FormControl('',[
        Validators.required,
        Validators.minLength(8)
      ]),
      passwordConfirm: new FormControl('',[
        Validators.required
      ]),
      address: new FormControl('',[]),
      phone: new FormControl('',[Validators.required,
        Validators.pattern(/^[+][0-9]+$/),
        Validators.maxLength(13),
        Validators.minLength(11)]),
      province_id: new FormControl('',[Validators.required]),
      city_id: new FormControl('',[Validators.required]),
      avatar: new FormControl('',[])
    }, [this.checkPassword]);
  }

  async ngOnInit(): Promise<void> {

    try {

        this.provinces = await this.locationsService.getAllProvince();
        this.cities = await this.locationsService.getAllCities();

        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords;
          this.userLat = latitude;
          this.userLon = longitude;
        })

        this.activatedRoute.params.subscribe(async (params: any) => {
    
          if (params.studentId) {
            this.accion = "Actualizar"
            this.storedStudent = await this.studentsService.getById(params.studentId)            
            this.citiesbyProvince = this.cities.filter(c => c.province_id == parseInt(this.storedStudent.province_id))
    
            this.studentForm.patchValue({
              name: this.storedStudent.name,
              surname: this.storedStudent.surname,
              email: this.storedStudent.email,
              address: this.storedStudent.address,
              avatar: this.storedStudent.avatar,
              phone: this.storedStudent.phone,
              city_id: this.storedStudent.city_id,
              province_id: this.storedStudent.province_id
            });
            
          }
        })   
    }
    catch (error: any) {
      const msgErrorLoad = error.error['fatal'];        
      Swal.fire({
        icon: 'error',
        title: '\'' + error.status + ' -' + error.statusText + '\' Error al cargar el formulario',
        html: `<div style="text-align: left;">
                <p>Ha ocurrido un error, inténtelo de nuevo más tarde</p>
                <p>Detalles: ${msgErrorLoad}</p>
              </div>`
      });
      this.router.navigate(['/landing-page']);
    }

  }

  onSelected(e:any){
    try{
      this.citiesbyProvince = this.cities.filter(c => c.province_id == parseInt(e.target.value))
    } catch(error){
      console.log (`FATAL : ${{error}}`)
    }
  }

  async getDataForm() {
    if (this.studentForm.status === "VALID") {
      if ('geolocation' in navigator) {
     
    }
      this.activatedRoute.params.subscribe(async (params: any) => {
        const user = await this.usersService.findByEmail(this.studentForm.value.email)
        let response!: Student | any
        let student = this.studentForm.value

        if (!params.studentId) {
          if (user != null) {
            Swal.fire({
              icon: 'error',
              title: 'Error al registrar',
              text: 'El correo utilizado ya existe.',
            })
          } else {
            if (this.userLat != undefined) {
              student.latitude = this.userLat
              student.longitude = this.userLon
            }
            try {
              response = await this.studentsService.create(student)

              if (response.id) {
                Swal.fire({
                  icon: 'success',
                  title: 'El Usuario ha sido creado correctamente.',
                  showConfirmButton: false,
                  timer: 1800
                })
                this.router.navigate(['/login'])
              }
            } catch (error: any) {
              let msgErrorForm: string = "";
                if (error.error!== undefined) {
                  for(var json in error.error){
                    if (error.error[json].msg!== undefined) {
                      msgErrorForm+= "<p> * " + error.error[json].msg + "</p>";
                    }
                    else {
                      msgErrorForm+= "<p> Error general en TeacherApp: " + error.error[json] + ". Contacte con el administrador de la aplicación</p>";
                    }
                  }  
                }
                else {
                  msgErrorForm += 'Ha ocurrido un error inténtelo de nuevo más tarde';
                }

                Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: '\'' + error.status + ' -' + error.statusText + '\' Error al registrarse en TeacherApp',
                  html: `<div style="text-align: left;">${msgErrorForm}</div>`
                });
            }
          }
        } else {
          this.storedStudent.name = student.name,
            this.storedStudent.surname = student.surname,
            this.storedStudent.email = student.email,
            this.storedStudent.password = student.password,
            this.storedStudent.address = student.address,
            this.storedStudent.avatar = student.avatar,
            this.storedStudent.phone = student.phone,
            this.storedStudent.city_id = student.city_id,
            this.storedStudent.province_id = student.province_id,
            this.storedStudent.role_id = this.student_role_id,
          this.storedStudent.latitude = student.latitude,
            this.storedStudent.longitude = student.longitude
          if (this.userLat != undefined) {
            this.storedStudent.latitude = this.userLat
            this.storedStudent.longitude = this.userLon
          }
          try {
            const response = await this.studentsService.update(this.storedStudent);
            if (response.id) {
              Swal.fire({
                icon: 'success',
                title: 'Datos actualizados.',
                showConfirmButton: false,
                timer: 1800
              })
            }
            this.router.navigate(['/perfil']);
          } catch (error: any) {
            let msgErrorForm: string = "";
                if (error.error!== undefined) {
                  for(var json in error.error){
                    if (error.error[json].msg!== undefined) {
                      msgErrorForm+= "<p> * " + error.error[json].msg + "</p>";
                    }
                    else {
                      msgErrorForm+= "<p> Error general en TeacherApp: " + error.error[json] + ". Contacte con el administrador de la aplicación</p>";
                    }
                  }  
                }
                else {
                  msgErrorForm += 'Ha ocurrido un error inténtelo de nuevo más tarde';
                }
                Swal.fire({
                  icon: 'error',
                  title: '\'' + error.status + ' -' + error.statusText + '\' Error al actualizar los datos en TeacherApp',                  
                  html: `<div style="text-align: left;">${msgErrorForm}</div>`                  
                })
          }
        }
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error del formulario',
        text: 'Los datos introducidos son incorrectos. Por favor revise la información introducida.',
      })
    }
  }

  checkControl(controlName: string, Error: string): boolean{
    let noErrors = false;
    if (this.studentForm.get(controlName)?.hasError(Error) && this.studentForm.get(controlName)?.touched) {
      noErrors = true;
    }
    return noErrors;
  }

  checkValidControl(controlName: string): boolean{
    let valid = true
    if (this.studentForm.get(controlName)?.status==="INVALID" && this.studentForm.get(controlName)?.touched){
      valid = false
    }
    return valid;
  }

  checkPassword(pFormValue: AbstractControl) {
    const password: string = pFormValue.get('password')?.value;
    const passwordConfirm: string = pFormValue.get('passwordConfirm')?.value;
    if (password !== passwordConfirm) {
      return { 'checkpassword': true }
    } else {
      return null
    }
  }
}



