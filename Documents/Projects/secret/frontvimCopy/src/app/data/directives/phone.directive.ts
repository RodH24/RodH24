import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

const phoneRegex: RegExp = /^\d{10}$/g;

export function PhoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = phoneRegex.test(control.value);
    return !isValid ? { isValidPhone: true } : null;
  };
}
