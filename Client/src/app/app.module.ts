import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { ServiceComponent } from "./service/service.component";
import { ServiceHeaderComponent } from "./service/header/header.component";
import { ServiceFooterComponent } from "./service/footer/footer.component";
import { ServiceBodyComponent } from "./service/body/body.component";
import { ServiceBodyListComponent } from "./service/body/list/list.component";
import { ServiceBodyPostComponent } from "./service/body/post/post.component";

import { SuiModule } from "ng2-semantic-ui";
import { MDBBootstrapModule } from "angular-bootstrap-md";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { SocketIoModule } from "ngx-socket-io";
import { chatService } from "./socket/socketService";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastNotificationClientModule, ToastNotificationCoreModule } from "ngx-toast-notifications";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimeAgoPipe } from 'time-ago-pipe';


@NgModule({
  declarations: [
    AppComponent,
    ServiceComponent,
    ServiceHeaderComponent,
    ServiceFooterComponent,
    ServiceBodyComponent,
    ServiceBodyListComponent,
    ServiceBodyPostComponent,
    TimeAgoPipe
  ],
  imports: [
    BrowserModule,
    SuiModule,
    MDBBootstrapModule,
    InfiniteScrollModule,
    SocketIoModule.forRoot({
      url: "https://api.ask.imustdo.work",
      options: {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax : 5000,
        reconnectionAttempts: 99999
      }
    }),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastNotificationCoreModule.forRoot({lifetime: 10000}),
    ToastNotificationClientModule
  ],
  providers: [
    chatService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
