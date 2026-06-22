import { Component, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Person {
  id: number;
  name: string;
  tag: string;
  bio: string;
  photo: string;
}

@Component({
  selector: 'app-peoples',
  imports: [CommonModule],
  templateUrl: './peoples.html',
  styleUrl: './peoples.css',
})
export class PeoplesComponent {
  current = signal(0);
  expandedBio = signal(false);

  people: Person[] = [
    {
      id: 1,
      name: 'Padmashree Sri Resul Pookutty',
      tag: 'Padma Shri Awardee',
      photo: 'assets/images/people_planets/Peoples/peo1.png',
      bio: "It is an honor to contribute to this incredible initiative aimed at nurturing our planet's future through the planting of one million trees. As someone deeply passionate about preserving the environment, I am thrilled to support a project that not only addresses the urgent need for ecological conservation but also highlights the power of collective action. Having witnessed firsthand the profound impact that environmental awareness and activism can have, I firmly believe that each tree planted is a step toward healing our earth. With deforestation continuing to threaten biodiversity and climate stability, this project stands as a beacon of hope. India, with its rich diversity of landscapes and ecosystems, is in desperate need of a more sustainable approach to development. Through this tree plantation drive, we are not only mitigating the effects of climate change but also enriching the lives of future generations. I urge everyone to get involved — together, we can ensure that the roots of tomorrow's future grow strong and deep.",
    },
    {
      id: 2,
      name: 'Sri NA Haris',
      tag: 'Community Leader',
      photo: 'assets/images/people_planets/Peoples/peo2.jpg',
      bio: "As a city, we face numerous environmental challenges, and it is initiatives like these that help us take meaningful action. This tree-planting drive not only contributes to improving air quality and reducing carbon emissions but also fosters a sense of community responsibility. I wholeheartedly encourage citizens to actively participate in this noble cause and join hands with People's Planet, BDA, and the NA Haris Foundation to ensure that Bangalore continues to grow as a vibrant, sustainable urban space. I am delighted to support People's Planet for its remarkable mission to plant one million trees in Bangalore — a crucial step towards building a greener, healthier, and more sustainable city. Together, let us make a lasting impact and create a greener future for our children.",
    },
    {
      id: 3,
      name: 'Dr. NVR Nathan',
      tag: 'Strategic Advisor',
      photo: 'assets/images/people_planets/Peoples/peo4.jpg',
      bio: 'With over 38 years of diverse experience in Strategic Management, Operations, Business Development, and Channel Management, he has excelled in both manufacturing and service industries. A recipient of the Bharat Gaurav and Samaja Shri Award, Dr. Nathan brings decades of strategic insight and leadership to People\'s Planet\'s mission. His guidance has helped shape the organization\'s long-term direction, ensuring that the drive to plant one million trees is grounded in sound strategy, community engagement, and measurable environmental impact.',
    },
    {
      id: 4,
      name: 'Vadayakkandy Narayan',
      tag: 'Environmentalist & Educator',
      photo: 'assets/images/people_planets/Peoples/peo5.jpg',
      bio: 'Mr. Narayanan is a highly respected retired educator with over 30 years of dedicated service in the field of teaching. Beyond academics, he is widely recognized as a committed environmentalist, actively advocating for sustainable living and ecological conservation. His contributions to both education and the environment have earned him several prestigious honors, including the Vanamithra Award, the National Teacher Innovation Award, and his leadership role as President of the Millet Mission, where he promotes traditional, sustainable food systems for better health and environmental balance.',
    },
    {
      id: 5,
      name: 'Dr. Annapoorna Nagendra',
      tag: 'Environmental Scholar',
      photo: 'assets/images/people_planets/Peoples/peo6.jpg',
      bio: 'Dr. Annapoorna is a distinguished scholar recognized for her deep expertise in environmental science, combining academic excellence with meaningful societal impact. With a strong educational foundation and advanced credentials, she has built a reputation for rigorous research, critical insight, and innovative thinking. Driven by a vision to use knowledge as a catalyst for progress, Dr. Annapoorna continues to contribute to academic advancement while actively supporting initiatives that promote intellectual growth and sustainable development.',
    },
    {
      id: 6,
      name: 'Arthanareeswaran Kumaraswamy',
      tag: 'Agriculture Expert',
      photo: 'assets/images/people_planets/Peoples/peo7.jpg',
      bio: 'A distinguished post-graduate in Agriculture from TNAU Coimbatore and a Gold Medalist, he also holds a degree from the Indian Institute of Bankers. His rare combination of agricultural expertise and financial acumen makes him an invaluable strategic voice for People\'s Planet. His guidance has helped align tree-planting programs with sustainable agricultural practices, creating ecosystems that benefit farmers, communities, and the environment alike.',
    },
  ];

  total = computed(() => this.people.length);
  activePerson = computed(() => this.people[this.current()]);
  isFirst = computed(() => this.current() === 0);
  isLast = computed(() => this.current() === this.total() - 1);
  counterLabel = computed(() => `${this.current() + 1} / ${this.total()}`);

  goTo(index: number): void {
    if (index < 0 || index >= this.total()) return;
    this.current.set(index);
    this.expandedBio.set(false);
  }

  prev(): void { this.goTo(this.current() - 1); }
  next(): void { this.goTo(this.current() + 1); }
  toggleBio(): void { this.expandedBio.update(v => !v); }

  // Touch swipe
  private touchStartX = 0;

  onTouchStart(e: TouchEvent): void {
    this.touchStartX = e.touches[0].clientX;
  }

  onTouchEnd(e: TouchEvent): void {
    const dx = e.changedTouches[0].clientX - this.touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? this.next() : this.prev();
  }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (e.key === 'ArrowRight') this.next();
    if (e.key === 'ArrowLeft') this.prev();
  }
}