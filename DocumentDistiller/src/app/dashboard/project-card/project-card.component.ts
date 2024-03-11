import {Component} from '@angular/core';

@Component({
  selector: 'app-project-card',
  template: `
    <div class="flex flex-col justify-between bg-background-card p-5 rounded-lg shadow-md gap-10">
      <h3 class="text-xl font-bold">The project's title</h3>
      <p>29th February 2024 </p>
    </div>`
})
export class ProjectCardComponent {


}
