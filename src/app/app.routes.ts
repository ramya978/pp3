import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { DonationComponent } from './pages/donation/donation';
import { ProjectsComponent } from './pages/projects/projects';
import { ZeroComponent } from './pages/zero/zero';
import { VolunteerComponent } from './pages/volunteer/volunteer';
import { PeoplesComponent } from './pages/peoples/peoples';
import { CorporatesComponent } from './pages/corporates/corporates';

export const routes: Routes = [

    {path:'',component:HomeComponent},
    {path:'home',component:HomeComponent},

    {path:'donation',component:DonationComponent},
    {path:'projects',component:ProjectsComponent},
    {path:'zero',component:ZeroComponent},
    {path:'volunteer',component:VolunteerComponent},
    {path:'peoples',component:PeoplesComponent},
    {path:'corporates',component:CorporatesComponent}




];
