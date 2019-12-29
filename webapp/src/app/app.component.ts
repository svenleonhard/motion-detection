import { Component } from "@angular/core";
import { Subject, Observable, Subscription } from "rxjs";
import { WebsocketService } from "./websocket.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "webapp";
  image;
  state = "alert alert-success";
  detected = false;
  cctvMessage = 'No motion detected';


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

      if (this.message != "connected") {
        const img = "data:image/jpg;base64," + this.message;
        this.image = this.sanitizer.bypassSecurityTrustResourceUrl(img);

        this.state = "alert alert-danger";
        this.detected = true;
        this.cctvMessage = 'We detected a motion!'
      }
    });
  }

  onDismiss() {
    this.cctvMessage = 'No motion detected';
    this.state = "alert alert-success";

    this.detected = false
  }

  onSnapshot() {
    this.websocketService.makeSnapshot().subscribe(response => {
      console.log('response')
      console.log(response);
    });
  }
}
