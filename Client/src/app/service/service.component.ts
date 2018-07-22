import { Component, OnInit } from '@angular/core';

import { chatService } from "../socket/socketService";

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  constructor(private chat: chatService) { }

  ngOnInit() {
    this.chat.socketError();
  }

}
