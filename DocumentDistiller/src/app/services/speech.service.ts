import {Injectable} from '@angular/core';
import ReconnectingWebSocket from "reconnecting-websocket";

@Injectable()
export class SpeechService {

  public rws: ReconnectingWebSocket;

  constructor() {
    this.rws = new ReconnectingWebSocket('ws://localhost:8181');
    this.rws.onopen = (() => {
      console.log("Connected to server");
    });
    this.rws.onmessage = ((ev: MessageEvent<any>) => {
      this.handleEvent(ev)
    });
  }

  handleEvent(event: MessageEvent) {
    const data = JSON.parse(event.data) as BaseDto<any>;
    // @ts-ignore
    this[data.eventType].call(this, data);
  }

  PrepareToReceiveAudio(dto: ServerWillSendSpeech) {
    console.log("Server will send audio in " + dto.Format + " format and " + dto.Length + " bytes");
  }
}

export class BaseDto<T> {
  EventType: string;

  constructor(init?: Partial<T>) {
    this.EventType = this.constructor.name;
    Object.assign(this, init);
  }
}

export class ServerWillSendSpeech extends BaseDto<ServerWillSendSpeech> {
  Format: string = "";
  Length: number = 0;
}


