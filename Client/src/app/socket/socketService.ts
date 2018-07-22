import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import * as _ from "lodash";
import { ToastNotifications } from "ngx-toast-notifications";

@Injectable()
export class chatService {
  public qnas: Array<object> = [];
  public infiniteFlag: Boolean = true;
  public next: number = 0;
  public count: number = 0;

  constructor(private socket: Socket, private toasts: ToastNotifications) {

  }

  sendMessage(eventName: string, param: object) {
    this.socket.emit(eventName, param);
  }

  getMessage(eventName: string) {
    return this.socket.fromEvent(eventName);
  }

  private newPostAppend(data: object) {
    this.qnas.unshift(data["result"]);
    this.count += 1;
    this.toasts.next({text: data["result"]["content"].slice(0, 50), type: "info", caption: "새 질문이 추가되었습니다!"});
  }

  postList(data: object) {
    if(!data["result"]["next"]) {
      this.infiniteFlag = false;
    }

    for(const post of data["result"]["post"]) {
      this.qnas.push(post);
    }
  }

  private postComment(data: object) {
    const idx: number = _.findIndex(this.qnas, {board_id: parseInt(data["result"]["board_id"])});
    if(idx !== -1) {
      this.qnas[idx]["comment"] = data["result"]["comment"];
    }
    this.toasts.next({text: data["result"]["comment"].slice(0, 50), type: "success", caption: "새 답변이 추가되었습니다!"});
  }

  private removePost(data: object) {
    const idx: number = _.findIndex(this.qnas, {board_id: parseInt(data["result"]["board_id"])});
    if(idx !== -1) {
      this.qnas.splice(idx, 1);
    }
    this.toasts.next({text: "비방이나 욕설, 광고 등의 질문을 관리자님이 삭제하였습니다.", type: "danger", caption: "질문이 삭제되었습니다."});
  }

  public socketPostList() {
    return this.getMessage("QUESTION").subscribe(data => {
      switch(data["subtype"]) {
        case "NEWPOST":
          this.newPostAppend(data);
          break;
        case "LIST":
          this.postList(data);
          break;
        case "COUNT":
          this.count = data["result"]["count"];
          break;
        case "POSTCOMMENT":
          this.postComment(data);
          break;
        case "REMOVEPOST":
          this.removePost(data);
          break;
      }
    });
  }

  public socketError() {
    this.getMessage("socket_error")
      .subscribe(data => this.toasts.next({text: data["message"], type: "danger", caption: "에러가 발생하였습니다."}));
  }

}
