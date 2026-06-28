import { Component, computed, signal } from '@angular/core';
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
  amounts: number[] = [1500, 2500, 5000, 10000];

  // ── Signals (state) ──────────────────────────────────────────
  // Signals automatically tell Angular "something changed, re-render".
  // This works even when the value is set from OUTSIDE Angular's zone
  // (like Razorpay's callback), so we don't need NgZone at all.
  selectedAmount = signal<number | null>(1500);
  isCustom = signal(false);
  customAmount = signal<number | null>(null);
  coverFee = signal(true);
  errorMsg = signal('');
  isProcessing = signal(false);

  successData = signal<{
    amount: number;
    paymentId: string;
    feeCovered: boolean;
    feeAmount: number;
  } | null>(null);

  failData = signal<{ message: string } | null>(null);

  private readonly FEE_RATE = 0.029; // 2.9% transaction fee

  // Razorpay test/live key - replace with your actual key
  private readonly RAZORPAY_KEY = 'rzp_test_T4FCjEOGW8kDvb';

  // ── Computed signals (derived state) ─────────────────────────
  feeAmount = computed(() => {
    const amt = this.selectedAmount();
    if (!amt) return 0;
    return Math.round(amt * this.FEE_RATE * 100) / 100;
  });

  totalAmount = computed(() => {
    const amt = this.selectedAmount();
    if (!amt) return 0;
    return this.coverFee()
      ? Math.round((amt + this.feeAmount()) * 100) / 100
      : amt;
  });

  canCoverFee = computed(() => {
    const amt = this.selectedAmount();
    return !!amt && amt >= 1500;
  });

  displayAmount = computed(() => {
    const amt = this.selectedAmount();
    if (!amt) return '';
    return '₹' + this.totalAmount().toLocaleString('en-IN');
  });

  ngOnInit(): void {
    this.loadRazorpayScript();
    this.selectedAmount.set(1500);
    this.coverFee.set(true);
  }

  private loadRazorpayScript(): void {
    if (document.getElementById('razorpay-checkout-js')) return;
    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);
  }

  selectAmount(value: number): void {
    this.isCustom.set(false);
    this.selectedAmount.set(value);
    this.customAmount.set(null);
    this.errorMsg.set('');
  }

  selectCustom(): void {
    this.isCustom.set(true);
    this.selectedAmount.set(null);
    this.errorMsg.set('');
  }

  blockMinus(event: KeyboardEvent): void {
    // Block '-' and 'e' (scientific notation) keys from being typed
    if (event.key === '-' || event.key === 'e' || event.key === 'E' || event.key === '+') {
      event.preventDefault();
    }
  }

  onCustomAmountChange(value: number | null): void {
    // Block negative values - do not let them flow into selectedAmount at all
    if (value !== null && value < 0) {
      this.customAmount.set(null);
      this.selectedAmount.set(null);
      this.errorMsg.set('Amount cannot be negative.');
      return;
    }

    this.customAmount.set(value);

    if (value && value > 0) {
      this.selectedAmount.set(value);
      this.errorMsg.set('');
    } else {
      this.selectedAmount.set(null);
    }
  }

  toggleCoverFee(checked: boolean): void {
    this.coverFee.set(checked);
  }

  validate(): boolean {
    this.errorMsg.set('');

    const amt = this.selectedAmount();

    if (amt !== null && amt < 0) {
      this.errorMsg.set('Amount cannot be negative.');
      return false;
    }
    if (!amt || amt < 1) {
      this.errorMsg.set("Enter the amount you'd like to donate.");
      return false;
    }
    if (amt < 1500) {
      this.errorMsg.set('We only take donations from ₹1,500.');
      return false;
    }
    return true;
  }

  pay(): void {
    if (!this.validate()) return;

    this.isProcessing.set(true);

    const finalAmount = this.totalAmount();
    const baseAmount = this.selectedAmount() as number;
    const fee = this.feeAmount();
    const fCovered = this.coverFee();

    const options: any = {
      key: this.RAZORPAY_KEY,
      amount: Math.round(finalAmount * 100),
      currency: 'INR',
      name: 'Peoples Planet',
      description: fCovered
        ? `Donation ₹${baseAmount.toLocaleString('en-IN')} + ₹${fee.toLocaleString('en-IN')} fee`
        : 'Environmental Conservation Donation',
      notes: {
        base_amount: String(baseAmount),
        fee_covered: fCovered ? 'Yes' : 'No',
        fee_amount: String(fee),
      },
      theme: { color: '#2e7d32' },
      // No NgZone needed here — these callbacks run outside Angular's zone
      // (Razorpay's checkout.js is a plain external script), but since we
      // use signal.set(...) below, Angular still picks up the change and
      // re-renders the view immediately. No manual change-detection trigger required.
      handler: (response: any) => {
        this.isProcessing.set(false);
        this.failData.set(null);
        this.successData.set({
          amount: baseAmount,
          paymentId: response.razorpay_payment_id,
          feeCovered: fCovered,
          feeAmount: fee,
        });
      },
      modal: {
        ondismiss: () => {
          this.isProcessing.set(false);
        },
      },
    };

    try {
      const rzp = new Razorpay(options);
      rzp.on('payment.failed', (resp: any) => {
        this.isProcessing.set(false);
        this.failData.set({
          message: resp.error.description || 'Your payment could not be processed.',
        });
      });
      rzp.open();
    } catch (e) {
      this.isProcessing.set(false);
      this.failData.set({ message: 'Unable to load payment gateway. Please try again.' });
    }
  }

  closeFail(): void {
    this.failData.set(null);
  }

  resetForm(): void {
    this.successData.set(null);
    this.failData.set(null);
    this.selectedAmount.set(1500);
    this.isCustom.set(false);
    this.customAmount.set(null);
    this.coverFee.set(true);
  }
}