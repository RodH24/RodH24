import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'validateImpulseZone'
})
export class validateImpulseZonePipe implements PipeTransform {

    transform(data: any): string {
        if (typeof data != 'string') {
            return 'N/A'
        }
        else{
            return 'Zona Impulso'
        }
    }

}