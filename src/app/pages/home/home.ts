import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl:'./home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('bannerVideo', { static: false }) bannerVideo!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    const video = this.bannerVideo?.nativeElement;
    if (video) {
      video.muted = true;
      video.play().catch((err: any) => {
        console.warn('Banner video autoplay failed:', err);
      });
    }
  }
}
