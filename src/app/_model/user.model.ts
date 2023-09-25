import { EmailValidator } from "@angular/forms";

export class User {

  id: number;
  firstname: string;
  lastname: string;
  email: EmailValidator;
  phoneno: number;
  roles: string;
  password: string;


  constructor(id: number, firstname: string, lastname: string, email: EmailValidator, phoneno: number, roles: string, password: string) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.phoneno = phoneno;
    this.roles = roles;
    this.password = password;
  }

}