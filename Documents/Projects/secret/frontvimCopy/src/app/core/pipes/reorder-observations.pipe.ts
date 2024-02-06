import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reorderObservations'
})
export class ReorderObservationsPipe implements PipeTransform {

  transform(observationList:Array<any>): any {
    // .valueOf() FOR NOT GIVING AN ERROR
    const sortedActivities = observationList.sort((a, b) => new Date(b.fecha).valueOf() - new Date(a.fecha).valueOf())
    return sortedActivities
  }

}
