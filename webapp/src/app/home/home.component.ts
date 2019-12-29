import { Component, OnInit } from "@angular/core";
import { Subject, Observable, Subscription } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";
import { WebsocketService } from "../websocket.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  image;
  state = "alert alert-success";
  detected = false;
  cctvMessage = "No motion detected";

  private socket: Subject<any>;
  private counterSubscription: Subscription;
  private message: string;
  private sentMessage: string;
  constructor(
    private websocketService: WebsocketService,
    private sanitizer: DomSanitizer
  ) {

      this.socket = websocketService.createWebsocket();

  }

  ngOnInit() {
    this.socket.subscribe(message => {
      this.message = message.data;

      if (this.message == "empty") {
        this.cctvMessage = "No motion detected";
        this.state = "alert alert-success";
        this.detected = false;
      }
      else{
        const img = "data:image/jpg;base64," + this.message;
        this.image = this.sanitizer.bypassSecurityTrustResourceUrl(img);

        this.state = "alert alert-danger";
        this.detected = true;
        this.cctvMessage = "We detected a motion!";
      }
    });
  }

  onDismiss() {
    this.websocketService.dismiss().subscribe(response => {
      console.log("response");
      console.log(response);
    });
  }

  onSnapshot() {
    this.websocketService.makeSnapshot().subscribe(response => {
      console.log("response");
      console.log(response);
    });
  }
}
