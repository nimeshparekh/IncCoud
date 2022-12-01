import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      var d = Number(seconds);
      var days = Math.floor(d / 86400);
      var hours = Math.floor((d % 86400) / 3600);
      var mins = Math.floor(((d % 86400) % 3600) / 60);
      var secs = ((d % 86400) % 3600) % 60;
      return (days > 0 ? days + 'd ' : '') + ('00' + hours).slice(-2) + ':' + ('00' + mins).slice(-2) + ':' + ('00' + secs).slice(-2);
    }
    return value;
  }

}
