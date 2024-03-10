import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
})
export class DialogComponent {
  @Input()  title: string = "Dialog Title";
  @Input() minWidth: string = "w-[50vw]";

  @Output() closeDialogEmitter = new EventEmitter<boolean>();
}


