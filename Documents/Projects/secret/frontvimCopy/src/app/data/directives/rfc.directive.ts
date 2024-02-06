import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

const rfcRe: RegExp = /^([A-Z]{3,4})(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]))([A-Z\d]{2}(?:[A\d]))?$/;

export function RfcValidator(shortRfc: string = ''): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    const fullRfc = control.value;
    if (shortRfc.length > 0 && fullRfc.slice(0, 10) != shortRfc) {
      return { isValidRfc: true };
    }
    const isValid = rfcRe.test(control.value);

    if(fullRfc.length === 0){
      return null;
    }
    else{
      return !isValid ? { isValidRfc: true } : null;
    }
  };
}
