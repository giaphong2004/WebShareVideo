import { CategoryFormComponent } from './admin/category-form/category-form.component';
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
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { CategoryListComponent } from './admin/category-list/category-list.component';
import { UserFormComponent } from './admin/user-form/user-form.component';




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

      //Content
      {path: 'content', component: ContentComponent},
      { path: 'edit-video/:video_id', component: EditVideoComponent },
      {path:'add-new', component: AddNewComponent},

      //Feedback
      {path: 'message-list', component: MessageListComponent},

      //Category
      {path: 'category-list', component: CategoryListComponent},
      {path: 'category-form', component: CategoryFormComponent},
      {path: 'add-category', component: CategoryFormComponent},
      {path: 'edit-category/:id', component: CategoryFormComponent},

      //User
      {path: 'user-management', component: UserManagementComponent},
      {path: 'user-form', component: UserFormComponent},
      {path: 'add-user', component: UserFormComponent},
      {path: 'edit-user/:id', component: UserFormComponent},
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
