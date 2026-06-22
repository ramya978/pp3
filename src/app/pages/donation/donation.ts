import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var Razorpay: any;

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donation.html',
  styleUrl: './donation.css',
})
export class DonationComponent {
  amounts: number[] = [500, 1000, 2500, 5000, 10000];
  selectedAmount: number | null = null;
  isCustom = false;
  customAmount: number | null = null;

  name = '';
  email = '';
  phone = '';
  wants80G = false;

  errorMsg = '';
  successData: { name: string; amount: number; paymentId: string } | null = null;
  failData: { message: string } | null = null;
  isProcessing = false;

  // Razorpay test/live key - replace with your actual key
  private readonly RAZORPAY_KEY = 'rzp_test_T4FCjEOGW8kDvb';

  ngOnInit(): void {
    this.loadRazorpayScript();
  }

  private loadRazorpayScript(): void {
    if (document.getElementById('razorpay-checkout-js')) return;
    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);
  }

  selectAmount(value: number): void {
    this.isCustom = false;
    this.selectedAmount = value;
    this.customAmount = null;
    this.errorMsg = '';
  }

  selectCustom(): void {
    this.isCustom = true;
    this.selectedAmount = null;
    this.errorMsg = '';
  }

  onCustomAmountChange(value: number | null): void {
    this.customAmount = value;
    if (value && value > 0) {
      this.selectedAmount = value;
    } else {
      this.selectedAmount = null;
    }
  }

  get displayAmount(): string {
    if (!this.selectedAmount) return '';
    return '₹' + this.selectedAmount.toLocaleString('en-IN');
  }

  validate(): boolean {
    this.errorMsg = '';

    if (!this.selectedAmount || this.selectedAmount < 1) {
      this.errorMsg = 'Please select or enter a donation amount.';
      return false;
    }
    if (!this.name.trim()) {
      this.errorMsg = 'Please enter your full name.';
      return false;
    }
    if (!this.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.errorMsg = 'Please enter a valid email address.';
      return false;
    }
    return true;
  }

  pay(): void {
    if (!this.validate()) return;

    this.isProcessing = true;

    const options: any = {
      key: this.RAZORPAY_KEY,
      amount: (this.selectedAmount as number) * 100,
      currency: 'INR',
      name: 'Peoples Planet',
      description: 'Environmental Conservation Donation',
      image: 'https://static.wixstatic.com/media/5d820f_cc9780bcdd4a44d7bfffa0c5c09d639af000.jpg',
      prefill: {
        name: this.name,
        email: this.email,
        contact: this.phone.replace(/\s+/g, ''),
      },
      notes: {
        wants_80g: this.wants80G ? 'Yes' : 'No',
      },
      theme: { color: '#2e7d32' },
      handler: (response: any) => {
        this.isProcessing = false;
        this.failData = null;
        this.successData = {
          name: this.name,
          amount: this.selectedAmount as number,
          paymentId: response.razorpay_payment_id,
        };
      },
      modal: {
        ondismiss: () => {
          this.isProcessing = false;
        },
      },
    };

    try {
      const rzp = new Razorpay(options);
      rzp.on('payment.failed', (resp: any) => {
        this.isProcessing = false;
        this.failData = { message: resp.error.description || 'Your payment could not be processed.' };
      });
      rzp.open();
    } catch (e) {
      this.isProcessing = false;
      this.failData = { message: 'Unable to load payment gateway. Please try again.' };
    }
  }

  closeFail(): void {
    this.failData = null;
  }

  resetForm(): void {
    this.successData = null;
    this.failData = null;
    this.selectedAmount = null;
    this.isCustom = false;
    this.customAmount = null;
    this.name = '';
    this.email = '';
    this.phone = '';
    this.wants80G = false;
  }
}
