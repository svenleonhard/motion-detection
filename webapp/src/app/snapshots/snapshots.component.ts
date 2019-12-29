import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { WebsocketService } from "../websocket.service";

@Component({
  selector: 'app-snapshots',
  templateUrl: './snapshots.component.html',
  styleUrls: ['./snapshots.component.css']
})
export class SnapshotsComponent implements OnInit {

  snapshots = [];
  constructor(private websocketService: WebsocketService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.websocketService.getSnapshots().subscribe(snaphots => {
      console.log(snaphots);
      this.snapshots = snaphots.map(snapshot=>{

        const img = "data:image/jpg;base64," + snapshot.frame;
        const image = this.sanitizer.bypassSecurityTrustResourceUrl(img);

        return {
          datetime: snapshot.datetime,
          frame: image
        }

      })

      console.log(this.snapshots);
    });
  }

}
