import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-menu-item',
  template: `
    <div class="flex gap-3 items-center w-full">
      <i>
        <ng-content></ng-content>
      </i>
      <a class="text-lg">{{title}}</a>
    </div>`
})
export class MenuItemComponent {
  @Input() title = '';
}
