import { Pipe, PipeTransform } from '@angular/core';
import { CONFIG } from '../../app/app-config';

/**
 * Generated class for the CurrencyPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'currency',
})
export class CurrencyPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string) {
    return CONFIG.currencySymbol + value;
  }
}
