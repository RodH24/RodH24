import { Pipe, PipeTransform } from "@angular/core";
import { object } from "underscore";

@Pipe({
  name: "notEmptyText",
})
export class NotEmptyTextPipe implements PipeTransform {
  transform(value: any, ...args: string[]): string {
    
    if(args.length) {
      let result = value;
      for (const key of args) {
        if(typeof result !== 'object') return '';
        result =
          result && result != null && key in result
            ? result[key as keyof typeof result]
            : "";
      }
      return result;
    } 
    return '';    
  }
}

