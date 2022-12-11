import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Student } from '../interfaces/student.interface';
import { LoginAuthService } from './login-auth.service';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {

  baseUrl = 'http://localhost:3000/api/students/';

  constructor(
    private httpClient: HttpClient,
    private loginAuthService: LoginAuthService
  ) { }

  getAll(): Promise<any> {
    return lastValueFrom(
      this.httpClient.get<any>(this.baseUrl, this.loginAuthService.getTokenHeader())
    );
  }

  getById(studentId: number): Promise<any> {
    return lastValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}${studentId}`, this.loginAuthService.getTokenHeader())
    );
  }

  create(student: Student): Promise<Student> {
    return lastValueFrom(this.httpClient.post<Student>(this.baseUrl, student));
  }

  delete(studenId: number): Promise<any> {
    return lastValueFrom(
      this.httpClient.delete<any>(`${this.baseUrl}${studenId}`, this.loginAuthService.getTokenHeader())
    );
  }

  update(student: any): Promise<any> {
    return lastValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}${student.id}`, student, this.loginAuthService.getTokenHeader())
    );
  }

  activate(studentId: number): Promise<any> {
    return lastValueFrom(
      this.httpClient.put<any>(`${this.baseUrl}${studentId}/activate`, this.loginAuthService.getTokenHeader())
    );
  }

  getActiveStudent(): Promise<any> {
    return lastValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}status/active`, this.loginAuthService.getTokenHeader())
    );
  }

  getInactiveStudent(): Promise<any> {
    return lastValueFrom(
      this.httpClient.get<any>(`${this.baseUrl}status/inactive`, this.loginAuthService.getTokenHeader())
    );
  }
}
