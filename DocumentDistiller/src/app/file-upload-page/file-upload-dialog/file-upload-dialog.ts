import {Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output} from "@angular/core";
import {ControlValueAccessor} from "@angular/forms";
import {ActionType} from "../../dashboard/constants/FrontendConstants";
import {FileStore} from "../../stores/file.store";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-file-upload-dialog',
  template: `
    <app-dialog [title]="''" [minWidth]="'50vw'" (closeDialogEmitter)="closeDialogEmitter.emit()">
      <section class="flex flex-col gap-3">
        @if (isWaitingForResponse) {
          <p>I am loading jesus christ give me some time</p>
        } @else if (fileStore.getResultValue()) {
          <p>Result: {{ fileStore.getResultValue() | json }}</p>
        } @else {
          <!-- File upload -->
          <h4 class="text-2xl">Upload and attach files</h4>
          <p class="text-xl text-gray-500">Upload and attach files to {{ actionType?.toLowerCase() }}</p>
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

          <!-- File list -->
          @if (file) {
            <app-file-row [file]="file"
                          (deleteFileEmitter)="handleFileDeleted()">
            </app-file-row>
          }

          <div class="flex gap-2">
            <button class="p-3 flex-grow text-black rounded-lg border-solid border-gray-300 border-[1px]"
                    (click)="closeDialogEmitter.emit()">Cancel
            </button>
            <button
              class="p-3 flex-grow bg-black text-white rounded-lg border-solid border-gray-300 border-[1px] disabled:opacity-60 disabled:cursor-not-allowed"
              (click)="uploadFile()" [disabled]="!file">Upload
            </button>
          </div>
        }
      </section>
    </app-dialog>
  `,
})

export class FileUploadDialogComponent implements ControlValueAccessor, OnDestroy {
  @Input() actionType: ActionType | undefined;
  @Output() closeDialogEmitter = new EventEmitter<boolean>();
  @Output() fileUploadedEmitter = new EventEmitter<void>();

  protected loadingSubscription: Subscription ;
  protected isWaitingForResponse: boolean = false;

  onChange: Function = () => {};
  file: File | null = null;

  constructor(private host: ElementRef<HTMLInputElement>, protected fileStore: FileStore) {
    this.loadingSubscription = this.fileStore.getIsWaitingForResponseObservable().subscribe((isWaiting: boolean) => {
      this.isWaitingForResponse = isWaiting;
    });
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const file = event && event.item(0);
    this.onChange(file);
    this.file = file;
  }

  writeValue(value: null) {
    // clear file input
    this.host.nativeElement.value = '';
    this.file = null;
  }

  registerOnChange(fn: Function) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function) {}

  uploadFile() {
    if (!this.file) {
      return;
    }

    this.fileStore.setFileToUpload(this.file);
    this.fileUploadedEmitter.emit();
  }

  handleFileDeleted() {
    this.file = null;
  }
}
