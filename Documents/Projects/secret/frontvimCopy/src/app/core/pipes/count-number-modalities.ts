import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'countNumberModalities'
})
export class CountNumberModalitiesPipe implements PipeTransform {

    transform(value: any): any {
        let arr_modalities = value['modalidades'];
        let length = arr_modalities.length;
        if(length == 1){
            return length + ' Modalidad'
        }
        else{
            return length + ' Modalidades'
        }
    }
}
