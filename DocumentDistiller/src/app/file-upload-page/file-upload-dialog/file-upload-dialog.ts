import {Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {ControlValueAccessor, FormControl, Validators} from "@angular/forms";
import {ActionType, FrontendConstants} from "../../dashboard/constants/FrontendConstants";
import {FileStore} from "../../stores/file.store";
import {Subscription} from "rxjs";
import { FileService } from "src/app/services/file.service";
import {DialogStore} from "../../stores/dialog.store";
import {Select2, Select2Option, Select2UpdateValue} from "ng-select2-component";
import {ProjectStore} from "../../stores/project.store";

@Component({
  selector: 'app-file-upload-dialog',
  template: `
    <app-dialog [title]="''" [minWidth]="'50vw'" [maxWidth]="'50vw'" (closeDialogEmitter)="closeDialogEmitter.emit()">
      <section class="flex flex-col gap-3 w-full">
        <h4 class="text-2xl">Upload and attach files</h4>
        <p class="text-xl text-gray-500">Upload and attach files to {{ actionType?.toLowerCase() }}</p>
        @if (isWaitingForResponse) {
          <p>I am loading jesus christ give me some time</p>
        } @else if (fileStore.getResultValue()) {
          @for (sentence of getSentencesToDisplay(); track sentence) {
            <p>{{ sentence }}</p>
          }
          <div class="flex gap-2">
            <button class="p-3 flex-grow text-black rounded-lg border-solid border-gray-300 border-[1px]"
                    (click)="closeDialog()">Cancel
            </button>
            <button
              class="p-3 flex-grow bg-black text-white rounded-lg border-solid border-gray-300 border-[1px] disabled:opacity-60 disabled:cursor-not-allowed"
              (click)="saveResult()">Save
            </button>
          </div>
        } @else {
          <!-- File upload -->
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

          <!-- Note title -->
          <input class="p-1 border-[1px] border-solid border-gray-300 rounded-lg focus:border-black focus:outline-none"
                 type="text"
                 placeholder="Note title"
                 [formControl]="noteTitleFormControl">

          <!-- Project select -->
          <select2 class="p-1 border-[1px] border-solid border-gray-300 rounded-lg cursor-pointer"
                   [data]="selectOptions"
                   placeholder="Select a project"
                   [styleMode]="'noStyle'"
                   [resettable]="true"
                   (update)="onProjectChange($event)">
          </select2>

          <!-- Dialog buttons -->
          <div class="flex gap-2">
            <button class="p-3 flex-grow text-black rounded-lg border-solid border-gray-300 border-[1px]"
                    (click)="closeDialog()">Cancel
            </button>
            <button
              class="p-3 flex-grow bg-black text-white rounded-lg border-solid border-gray-300 border-[1px] disabled:opacity-60 disabled:cursor-not-allowed"
              (click)="uploadFileToServer()" [disabled]="!isUploadValid">Upload
            </button>
          </div>
        }
      </section>
    </app-dialog>
  `,
})

export class FileUploadDialogComponent implements ControlValueAccessor, OnDestroy {
  @Output() closeDialogEmitter = new EventEmitter<string>();

  protected loadingSubscription: Subscription;
  protected isWaitingForResponse: boolean = false;

  actionType: ActionType | null;
  selectOptions: Select2Option[] = [];
  selectedProjectId: string | null = null;
  noteTitleFormControl = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]);

  onChange: Function = () => {
  };
  file: File | null = null;

  constructor(private host: ElementRef<HTMLInputElement>,
              protected fileStore: FileStore,
              private fileService: FileService,
              protected dialogStore: DialogStore,
              private projectStore: ProjectStore) {
    this.loadingSubscription = this.fileStore.getIsWaitingForResponseObservable().subscribe((isWaiting: boolean) => {
      this.isWaitingForResponse = isWaiting;
    });
    this.actionType = this.dialogStore.getFileUploadDialogActionType();
    this.selectOptions = this.projectStore
      .getProjectsValue()
      .map(project => {
      return {
        value: project.id,
        label: project.name,
      };
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

  registerOnTouched(fn: Function) {
  }

  handleFileDeleted() {
    this.file = null;
  }

  closeDialog(message: string = '') {
    this.fileStore.resetFileStore();
    this.file = null;
    this.closeDialogEmitter.emit(message);
  }

  async saveResult() {
    this.fileStore.setProjectId(this.selectedProjectId);
    await this.fileService.saveResult();
    this.fileStore.resetFileStore();
    this.closeDialog(FrontendConstants.FileSaved);
  }

  async uploadFileToServer() {
    if (!this.file || !this.selectedProjectId) {
      return;
    }

    this.fileStore.setFileToUpload(this.file);
    this.fileStore.setNoteTitle(this.noteTitleFormControl.value);
    let response;
    switch (this.actionType) {
      case ActionType.Summarise:
        response = await this.fileService.summariseDocument();
        break;
      case ActionType.KeySentences:
        response = await this.fileService.getKeySentences();
        break;
      case ActionType.Translate:
        response = await this.fileService.translateDocument('sk');
        break;
      case ActionType.ImageToText:
        response = await this.fileService.imageToText();
        break;
      default:
        console.error('unknown action type');
    }
  }

  get isUploadValid() {
    return this.file !== null && this.selectedProjectId !== null && this.noteTitleFormControl.valid;
  }

  onProjectChange(value: Select2UpdateValue) {
    // @ts-ignore
    this.selectedProjectId = value.value;
  }

  getSentencesToDisplay() {
    return this.fileStore.getResultValue()?.result?.split('\n');
  }
}
