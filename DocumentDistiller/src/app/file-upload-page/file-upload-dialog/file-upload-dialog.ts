import {Component} from "@angular/core";
import {DialogComponent} from "../../dialog/dialog.component";

@Component({
  selector: 'app-file-upload-dialog',
  standalone: true,
  imports: [
    DialogComponent
  ],
  template: `
    <app-dialog [title]="'Upload File'" [minWidth]="'75vw'">
      <section class="flex flex-col gap-3">
        <h4 class="text-2xl">Upload and attach files</h4>
        <p class="text-xl text-gray-500">Upload and attach files to this project.</p>
        <label class="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer">
          <input type="file" class="w-full opacity-0 cursor-pointer"/>
          <div class="flex flex-col justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 24 24">
              <path fill="currentColor"
                    d="M11.5 17.77h1v-4.695l2.1 2.1l.708-.713L12 11.154l-3.308 3.308l.714.707l2.094-2.094zM6.615 21q-.69 0-1.152-.462Q5 20.075 5 19.385V4.615q0-.69.463-1.152Q5.925 3 6.615 3H14.5L19 7.5v11.885q0 .69-.462 1.152q-.463.463-1.153.463zM14 8V4H6.615q-.23 0-.423.192Q6 4.385 6 4.615v14.77q0 .23.192.423q.193.192.423.192h10.77q.23 0 .423-.192q.192-.193.192-.423V8zM6 4v4zv16z"/>
            </svg>
            <div class="">
              <span class="underline mr-1">Click to upload</span>
              <span>or drag and drop to upload a file</span>
            </div>
          </div>
        </label>
        <div class="flex p-3 rounded-lg border-solid border-black border-[1px]">
          <i></i>
          <div class="flex flex-col p-3">
            <p>this-is-the-first-file.pdf</p>
            <p>1.2MB</p>
            <p></p>
          </div>
        </div>

        <div class="flex p-3 rounded-lg border-solid bborder-gray-300 border-[1px]">
          <i></i>
          <div class="flex flex-col p-3">
            <p>this-is-the-second-file.pdf</p>
            <p>1.2MB</p>
            <p></p>
          </div>
        </div>

        <div class="flex p-3 rounded-lg border-solid border-gray-300 border-[1px]">
          <i></i>
          <div class="flex flex-col p-3">
            <p>this-is-the-third-file.pdf</p>
            <p>1.2MB</p>
            <p></p>
          </div>
        </div>

        <div class="flex justify-end">
          <button class="p-3 bg-blue-500 text-white rounded-lg">Upload</button>
        </div>
      </section>
    </app-dialog>
  `,
})

export class FileUploadDialogComponent {
  constructor() {
  }
}
