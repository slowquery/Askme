import { Component, OnInit } from "@angular/core";
import { chatService } from "../../../socket/socketService";
import { Observable } from "rxjs";

@Component({
  selector: "body-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"]
})
export class ServiceBodyListComponent implements OnInit {
  constructor(public chat: chatService) { }

  ngOnInit() {
    this.chat.sendMessage("QUESTION",{subtype: "VIEW"});
    this.chat.socketPostList();
  }

  public onScroll() {
    this.chat.sendMessage("QUESTION",{id: this.chat.qnas[this.chat.qnas.length-1]["board_id"], subtype: "VIEW"});
  }
}
