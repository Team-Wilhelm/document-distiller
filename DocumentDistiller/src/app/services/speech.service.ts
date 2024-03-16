import {Injectable} from '@angular/core';
import ReconnectingWebSocket from "reconnecting-websocket";
import {ServerWillSendSpeech} from "../models/events/speechEvents";
import {BaseDto} from "../models/events/speechEvents";

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

  ServerWillSendSpeech(dto: ServerWillSendSpeech) {
    const byteCharacters = atob(dto.data!);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: dto.type });

    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play().catch(error => console.error("Error playing the audio", error));
  }
}



