import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

const userRe: RegExp = /^[a-zA-Z0-9_.+-]+$/;

export function EmailUserValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = userRe.test(control.value);
    return !isValid ? { isValidCurp: true } : null;
  };
}
