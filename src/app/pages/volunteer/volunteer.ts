import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface VolunteerForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  occupation: string;
  message: string;
}

@Component({
  selector: 'app-volunteer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './volunteer.html',
  styleUrl: './volunteer.css',
})
export class VolunteerComponent {
  occupations: string[] = ['Student', 'Corporate Employee', 'Social Worker', 'Freelancer', 'Other'];

  form: VolunteerForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    occupation: '',
    message: '',
  };

  submitted = false;
  errorMsg = '';

  onSubmit(): void {
    this.errorMsg = '';

    if (!this.form.firstName.trim() || !this.form.lastName.trim()) {
      this.errorMsg = 'Please enter your first and last name.';
      return;
    }
    if (!this.form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
      this.errorMsg = 'Please enter a valid email address.';
      return;
    }
    if (!this.form.phone.trim()) {
      this.errorMsg = 'Please enter your phone number.';
      return;
    }
    if (!this.form.occupation) {
      this.errorMsg = 'Please select your occupation.';
      return;
    }
    if (!this.form.message.trim()) {
      this.errorMsg = 'Please tell us a bit about why you want to volunteer.';
      return;
    }

    // TODO: replace with actual API call
    console.log('Volunteer form submitted:', this.form);
    this.submitted = true;
  }

  resetForm(): void {
    this.submitted = false;
    this.form = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      occupation: '',
      message: '',
    };
  }
}
