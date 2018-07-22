import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { chatService } from "../../../socket/socketService";

@Component({
  selector: "body-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.css"]
})
export class ServiceBodyPostComponent implements OnInit {
  form: FormGroup;

  constructor(private chat: chatService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      user_nick: [null, [Validators.required]],
      content: [null, Validators.required]
    });
  }

  public onSubmit() {
    this.chat.sendMessage("QUESTION", {user_nick: this.form["value"]["user_nick"], content: this.form["value"]["content"], subtype: "POST"});
    this.form.reset();
  }
}
