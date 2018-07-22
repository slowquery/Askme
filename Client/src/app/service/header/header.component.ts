import { Component, OnInit } from "@angular/core";
import { SuiMessageModule } from "ng2-semantic-ui";

import { chatService } from "../../socket/socketService";

@Component({
  selector: "service-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class ServiceHeaderComponent implements OnInit {
  constructor(public chat: chatService, private message: SuiMessageModule) { }

  ngOnInit() {
    this.chat.sendMessage("QUESTION", {subtype: "COUNT"});
  }

}
