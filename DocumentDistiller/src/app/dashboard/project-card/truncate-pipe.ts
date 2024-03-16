import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | undefined, limit = 100, completeWords = false, ellipsis = '...'): string {
    if (!value) return '';
    if (completeWords && value.length > limit) {
      let newLimit = value.slice(0, limit).lastIndexOf(' ');
      // Ensure newLimit is not -1, indicating no space was found in the substring
      newLimit = newLimit > 0 ? newLimit : limit;
      return value.length > newLimit ? value.slice(0, newLimit) + ellipsis : value;
    }
    return value.length > limit ? value.slice(0, limit) + ellipsis : value;
  }
}
