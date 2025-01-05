import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DetailComponent } from './detail/detail.component';
import { AuthService } from '../../service/auth/auth.service';
import { UserService } from '../../service/user/user.service';
import { VideoService } from '../../service/video/video.service';
import { FooterComponent } from './footer/footer.component';
import { SignupComponent } from './signup/signup.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HeaderComponent } from './admin/header/header.component';
import { SidebarComponent } from './admin/sidebar/sidebar.component';
import { EditVideoComponent } from './admin/edit-video/edit-video.component';
import { ContentComponent } from './admin/content/content.component';
import { AddNewComponent } from './admin/add-new/add-new.component';
import { MessageListComponent } from './admin/message-list/message-list.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    DetailComponent,
    FooterComponent,
    AboutComponent,
    ContactComponent,
    AdminLayoutComponent,
    MainLayoutComponent,
    HeaderComponent,
    SidebarComponent,
    EditVideoComponent,
    ContentComponent,
    AddNewComponent,
    MessageListComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [AuthService],
  bootstrap: [AppComponent],
  
})
export class AppModule {}
