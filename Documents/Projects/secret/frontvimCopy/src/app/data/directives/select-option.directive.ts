import { UntypedFormControl } from '@angular/forms';
import { SelectOptionType } from '../types';

/**
 * Validate select option form input
 * @param formControl 
 * @returns An error object, or null in case the value is valid.
 */
export function SelectOptionValidator(formControl: UntypedFormControl) {
  const value: SelectOptionType = formControl.value;
  // Check codigo and descripcion has a value
  if (value.codigo && value.descripcion) {
    // Check if the option has respuesta key
    if ('respuesta' in value) {
      // if has the respuesta key, check the value
      if (value.respuesta) {
        return null;
      } else {
        return {
          validateSelectOption: {
            valid: false,
          },
        };
      }
    } else { // if don't has it, return valid
      return null;
    }
  }

  return {
    validateSelectOption: {
      valid: false,
    },
  };
}
