import { Injectable } from "@angular/core";
import { Subject, Observer, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class WebsocketService {
  url = "localhost:8999";
  websocketConnected = false;
  private socket: Subject<any>;
  constructor(public http: HttpClient) {}

  public createWebsocket(): Subject<MessageEvent> {
    if (this.websocketConnected) {
      console.log('Already connected - send socket');
      return this.socket;
    }
    let socket = new WebSocket("ws://" + this.url);
    console.log(socket);
    let observable = Observable.create((observer: Observer<MessageEvent>) => {
      socket.onmessage = observer.next.bind(observer);
      socket.onerror = observer.error.bind(observer);
      socket.onclose = observer.complete.bind(observer);
      return socket.close.bind(socket);
    });
    let observer = {
      next: (data: Object) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(data));
        }
      }
    };
    this.socket = Subject.create(observer, observable);
    this.websocketConnected = true;
    return this.socket;
  }

  makeSnapshot(): Observable<any> {
    const toRet = this.http.get("http://" + this.url + "/make-snapshot");
    console.log(toRet);
    return toRet;
  }

  dismiss(): Observable<any> {
    const toRet = this.http.get("http://" + this.url + "/dismiss");
    console.log(toRet);
    return toRet;
  }
}
