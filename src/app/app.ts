import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly NEWSLETTER_API = 'https://ascendingsoftware.com/api/emailSubscription.php';

  // Check if the given route is the current active page
  isActive(route: string): boolean {
    return window.location.pathname === '/' + route || 
           window.location.pathname === '/' + route + '/' ||
           (route === 'home' && (window.location.pathname === '/' || window.location.pathname === ''));
  }
 
  // Form fields
  newsletterEmail = '';
  newsletterConsent = false;
  isSubscribing = false;
 
  // Inline validation errors
  emailError = false;
  consentError = false;
 
  // Inline success message (below the form like the image)
  showSuccessInline = false;
 
  // Toast state
  showToast = false;
  toastType: 'success' | 'error' = 'success';
  toastMessage = '';
  toastTimeout: ReturnType<typeof setTimeout> | null = null;
 
  // Footer data
  currentYear = new Date().getFullYear();
  infoLinks = ['Home', 'Volunteer', 'Peoples', 'Donation'];
 
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}
 
  ngOnDestroy(): void {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
  }
 
  // ─── Validation helpers ───────────────────────────────────────────────────
 
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }
 
  clearEmailError(): void {
    if (this.emailError) this.emailError = false;
  }
 
  clearConsentError(): void {
    if (this.consentError) this.consentError = false;
  }
 
  validateEmailOnBlur(): void {
    const val = this.newsletterEmail.trim();
    if (val && !this.isValidEmail(val)) {
      this.emailError = true;
    }
  }
 
  // ─── Submit ───────────────────────────────────────────────────────────────
 
  onNewsletterSubmit(): void {
    // Reset previous state
    this.emailError = false;
    this.consentError = false;
    this.showSuccessInline = false;
 
    // Validate email
    if (!this.newsletterEmail.trim() || !this.isValidEmail(this.newsletterEmail)) {
      this.emailError = true;
      this.showToastMessage('error', 'Please enter a valid email address.');
      return;
    }
 
    // Validate consent
    if (!this.newsletterConsent) {
      this.consentError = true;
      this.showToastMessage('error', 'Please agree to receive our newsletter.');
      return;
    }
 
    this.isSubscribing = true;
 
    const payload = {
      email: this.newsletterEmail.trim(),
      consent: true
    };
 
    this.http.post(this.NEWSLETTER_API, payload).subscribe({
      next: (res: any) => {
        this.isSubscribing = false;
 
        let data = res;
        if (typeof res === 'string') {
          try { data = JSON.parse(res); } catch { data = null; }
        }
 
        if (data && data.success === true) {
          // Show inline success message (matches image: "Thanks, we received your submission.")
          this.showSuccessInline = true;
          this.showToastMessage('success', data.message || 'Successfully subscribed to our newsletter!');
          this.newsletterEmail = '';
          this.newsletterConsent = false;
          this.emailError = false;
          this.consentError = false;
        } else {
          this.showToastMessage('error', data?.message || data?.error || 'Subscription failed. Please try again.');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubscribing = false;
 
        let serverMsg: string | undefined;
        if (err?.error) {
          if (typeof err.error === 'string') {
            try { serverMsg = JSON.parse(err.error)?.message; } catch { serverMsg = err.error; }
          } else if (typeof err.error === 'object') {
            serverMsg = err.error.message;
          }
        }
 
        this.showToastMessage('error', serverMsg || 'Unable to subscribe right now. Please try again later.');
        this.cdr.detectChanges();
      }
    });
  }
 
  // ─── Toast ────────────────────────────────────────────────────────────────
 
  private showToastMessage(type: 'success' | 'error', message: string): void {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
 
    this.toastType = type;
    this.toastMessage = message;
    this.showToast = true;
    this.cdr.detectChanges();
 
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

}