import {Component, Input} from '@angular/core';
import {MenuItem} from "../../models/menu-item.interface";

@Component({
  selector: 'app-menu-item',
  template: `
    <div class="flex flex-col">
      <div
        class="flex gap-3 items-center w-full cursor-pointer px-5 py-2 rounded-lg hover:bg-button hover:text-text-light">
        <i>
          <ng-content></ng-content>
        </i>
        <a class="text-lg">{{ title }}</a>

        <div *ngIf="children.length > 0" class="ml-auto">
          <i>
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24">
              <path fill="#c0c0c0"
                    d="M15.88 9.29L12 13.17L8.12 9.29a.996.996 0 1 0-1.41 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 0 0 0-1.41c-.39-.38-1.03-.39-1.42 0"/>
            </svg>
          </i>
        </div>
      </div>

      <div *ngIf="children.length > 0" class="flex flex-col gap-2 px-5">
        <app-menu-item *ngFor="let child of children" [title]="child.title" (click)="child.onClick?.()">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 256 256">
            <path fill="#c0c0c0"
                  d="m213.66 66.34l-40-40A8 8 0 0 0 168 24H88a16 16 0 0 0-16 16v16H56a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h112a16 16 0 0 0 16-16v-16h16a16 16 0 0 0 16-16V72a8 8 0 0 0-2.34-5.66M168 216H56V72h76.69L168 107.31v84.85zm32-32h-16v-80a8 8 0 0 0-2.34-5.66l-40-40A8 8 0 0 0 136 56H88V40h76.69L200 75.31Zm-56-32a8 8 0 0 1-8 8H88a8 8 0 0 1 0-16h48a8 8 0 0 1 8 8m0 32a8 8 0 0 1-8 8H88a8 8 0 0 1 0-16h48a8 8 0 0 1 8 8"/>
          </svg>
        </app-menu-item>
      </div>
    </div>`
})
export class MenuItemComponent {
  @Input() title = '';
  @Input() children: MenuItem[] = [];

  constructor() {
  }
}
