import { AbstractControl, ValidatorFn, Validators } from "@angular/forms";

/**
 *
 * @param condition if true the validator is apply
 * @param validator validator to apply, by default is required
 * @returns validator to apply
 */
export function ConditionalValidator(
  condition: () => boolean,
  trueValidator: Array<ValidatorFn> | any = Validators.required,
  falseValidator: Array<ValidatorFn> | any = null
) {
  return (formControl: AbstractControl) => {
    if (!formControl.parent) {
      return null;
    }
    if (condition()) {
      for (const validator of trueValidator) {
        if (validator(formControl)) return { isValid: true };
      }
      return null;
    } else if (falseValidator) {
      for (const validator of falseValidator) {
        if (validator(formControl)) return { isValid: true };
      }
      return null;
    }
    return null;
  };
}
