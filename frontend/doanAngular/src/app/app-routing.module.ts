import { MessageListComponent } from './admin/message-list/message-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DetailComponent } from './detail/detail.component';
import { AddNewComponent } from './admin/add-new/add-new.component';


import{EditVideoComponent} from './admin/edit-video/edit-video.component';
import { ContentComponent } from './admin/content/content.component';



const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'home', component: HomeComponent },
      {path: 'detail/:video_id', component: DetailComponent},
     
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {path: "admin", component: AdminLayoutComponent},
      { path: 'edit-video/video_id', component: EditVideoComponent },
      {path: 'content', component: ContentComponent},
      {path:'add-new', component: AddNewComponent},
      {path: 'message-list', component: MessageListComponent},
      // Thêm các route khác cho admin ở đây
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
