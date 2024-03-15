import {environment} from "../../../../environment/environment";

export class ServerUrls {
  private static baseUrl = environment.baseUrl;

  // Auth
  static readonly LOGIN = this.baseUrl + '/login';
  static readonly REGISTER = this.baseUrl + '/register';
}

export class DocumentActions {
  private static baseUrl = environment.baseUrl + '/document';
  static readonly SUMMARISE = this.baseUrl + '/summarise';
  static readonly KEY_SENTENCES = this.baseUrl + '/keysentences';
  static readonly KEY_POINTS = this.baseUrl + '/keypoints';
  static readonly TRANSLATE = this.baseUrl + '/translate';
  static readonly SAVE_RESULT = this.baseUrl + '/save-result';
  static readonly RECENT = this.baseUrl + '/recent';
  static readonly DELETE = this.baseUrl + '/delete/'; // requires documentGuid
  static readonly EDIT = this.baseUrl + '/update';
}

export class ProjectActions {
  private static baseUrl = environment.baseUrl + '/project';
  static readonly CREATE = this.baseUrl + '/create';
  static readonly BASE = this.baseUrl;
  static readonly UPDATE = this.baseUrl + '/update';
}
