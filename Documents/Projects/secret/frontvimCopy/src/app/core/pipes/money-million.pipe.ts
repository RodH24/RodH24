import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'moneyMillion',
})
export class MoneyMillionPipe extends DecimalPipe implements PipeTransform {
  transform(
    value: any,
  ): any {
    const million = 1000000;
    let result: string | null = '';
    let unitCount: string = '';

    if (value > 10 * million) {
      value /= million;
      unitCount = ' mdp';
    }

    result = super.transform(value, '2.2-2', 'en-US');
    return `$ ${result}${unitCount}`;
  }
}
