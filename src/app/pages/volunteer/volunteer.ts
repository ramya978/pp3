import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
  private readonly API_URL = 'https://ascendingsoftware.com/api/volunteerRegistration.php';

  occupations: string[] = ['Student', 'Corporate Employee', 'Social Worker', 'Freelancer', 'Other'];

  form: VolunteerForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    occupation: '',
    message: '',
  };

  errorMsg = '';
  isSubmitting = false;

  // Toast state
  showToast = false;
  toastType: 'success' | 'error' = 'success';
  toastMessage = '';
  toastTimeout: any = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

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
    if (!this.form.phone.trim() || !/^[0-9]{10}$/.test(this.form.phone.trim())) {
      this.errorMsg = 'Please enter a valid 10-digit phone number.';
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

    this.isSubmitting = true;

    const payload: VolunteerForm = {
      firstName: this.form.firstName.trim(),
      lastName: this.form.lastName.trim(),
      email: this.form.email.trim(),
      phone: this.form.phone.trim(),
      occupation: this.form.occupation,
      message: this.form.message.trim(),
    };

    this.http.post(this.API_URL, payload).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;

        // Server JSON ah string ah anuppirundha parse pannunga
        let data = res;
        console.log(data);
        
        if (typeof res === 'string') {
          try {
            data = JSON.parse(res);
          } catch {
            data = null;
          }
        }

        // Success ah illa error ah nu check pannanum
        // Server returns {success:true,...} -> success
        // Server returns {success:false,...} OR {code:"invalid_json",message:"..."} -> error
        if (data && data.success === true) {
          // success toast
          this.showToastMessage(
            'success',
            data.message || "We've received your details and will get in touch with you shortly."
          );
          this.clearForm();
        } else {
          // error toast - success:false OR no success field at all (e.g. {code:"invalid_json",...})
          this.showToastMessage(
            'error',
            data?.message || data?.error || 'Something went wrong. Please try again.'
          );
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Volunteer API error:', err);

        // Non-2xx status ah server JSON anuppirundha, err.error la irukkum
        let serverMsg: string | undefined;

        if (err?.error) {
          if (typeof err.error === 'string') {
            try {
              const parsed = JSON.parse(err.error);
              serverMsg = parsed?.message;
            } catch {
              serverMsg = err.error;
            }
          } else if (typeof err.error === 'object') {
            serverMsg = err.error.message;
          }
        }

        this.showToastMessage(
          'error',
          serverMsg || 'Unable to submit the form right now. Please try again later.'
        );
      },
    });
  }

  private showToastMessage(type: 'success' | 'error', message: string): void {
    // Clear any existing timeout
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastType = type;
    this.toastMessage = message;
    this.showToast = true;

    // Force Angular change detection
    this.cdr.detectChanges();

    // Auto-hide after 4 seconds
    this.toastTimeout = setTimeout(() => {
      this.showToast = false;
      this.toastTimeout = null;
      this.cdr.detectChanges();
    }, 4000);
  }

  closeToast(): void {
    this.showToast = false;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
  }

  private clearForm(): void {
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