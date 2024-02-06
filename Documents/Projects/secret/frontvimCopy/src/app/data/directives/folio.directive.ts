import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

const folioRe: RegExp = /[A,F]20[2-9]{2}Q[0-9]{10,12}$/;

export function FolioValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = folioRe.test(control.value);
    return !isValid ? { isValidFolio: true } : null;
  };
}
