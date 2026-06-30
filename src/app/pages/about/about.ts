import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl:'./about.html',
  styleUrl: './about.css',
})
export class AboutComponent implements AfterViewInit {
  @ViewChild('bannerVideo') bannerVideo!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    const video = this.bannerVideo?.nativeElement;
    if (video) {
      video.muted = true; // always required for autoplay in modern browsers
      video.play().catch((err) => {
        // Autoplay was prevented; silently fall back
        console.warn('Banner video autoplay failed:', err);
      });
    }
  }
}