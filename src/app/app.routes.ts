import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { DonationComponent } from './pages/donation/donation';
import { ProjectsComponent } from './pages/projects/projects';
import { ZeroComponent } from './pages/zero/zero';
import { VolunteerComponent } from './pages/volunteer/volunteer';
import { PeoplesComponent } from './pages/peoples/peoples';
import { CorporatesComponent } from './pages/corporates/corporates';
import { MissionmilliontreesComponent } from './pages/projects/missionmilliontrees/missionmilliontrees';
import { ZerowasteComponent } from './pages/projects/zerowaste/zerowaste';
import { Light4lifeComponent } from './pages/projects/light4life/light4life';
import { LivelihoodComponent } from './pages/projects/livelihood/livelihood';
import { FarmerfirstComponent } from './pages/projects/farmerfirst/farmerfirst';
import { AboutComponent } from './pages/about/about';
import { CsrComponent } from './pages/csr/csr';

export const routes: Routes = [

    {path:'',component:HomeComponent},
    {path:'home',component:HomeComponent},

    {path:'donation',component:DonationComponent},
    {path:'projects',component:ProjectsComponent},
    {path:'zero',component:ZeroComponent},
    {path:'volunteer',component:VolunteerComponent},
    {path:'peoples',component:PeoplesComponent},
    {path:'corporates',component:CorporatesComponent},
    {path:'missionmilliontrees',component:MissionmilliontreesComponent},
    {path:'zerowaste',component:ZerowasteComponent},
    {path:'light4life',component:Light4lifeComponent},
    {path:'livelihood',component:LivelihoodComponent},
    {path:'farmerfirst',component:FarmerfirstComponent},
    {path:'about',component:AboutComponent},
    {path:'csr',component:CsrComponent}



];
