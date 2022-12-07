import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Student } from 'src/app/interfaces/student.interface';
import { LoginAuthService } from 'src/app/services/login-auth.service';
import { StudentsService } from 'src/app/services/students.service';

@Component({
  selector: 'app-student-view',
  templateUrl: './student-view.component.html',
  styleUrls: ['./student-view.component.css']
})
export class StudentViewComponent implements OnInit {

  currentStudent: Student | any;

  studentId!: number;

  constructor(
    private studentsService: StudentsService,
    private loginAuthService: LoginAuthService,
    private router: Router
    ) {
      this.studentId = this.loginAuthService.getId();
    }

  async ngOnInit(): Promise<void> {
    try {
      this.currentStudent = await this.studentsService.getById(this.studentId);
    } catch (err: any) {
      console.log(err);
    }
  }

  logout() {
    this.loginAuthService.logout();
    this.router.navigate(['/login']);
  }
}
