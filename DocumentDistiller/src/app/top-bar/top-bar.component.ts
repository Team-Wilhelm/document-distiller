import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
})
export class TopBarComponent {
  @Output() logoutEmitter = new EventEmitter<void>();
}
