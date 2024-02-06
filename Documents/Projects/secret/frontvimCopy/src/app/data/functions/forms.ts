/**
 * Functions to handle angular forms easily
 */
import { formatCurrency } from '@angular/common';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  MinLengthValidator,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ConditionalValidator } from '../directives';
import { SelectOptionType, DynamicFieldType } from '../types';
import { CurrencyFunctions } from './';

/**
 * Retrieve a list of field with the 'required' validator for fill a formGroup
 * @param {Array<any>} fieldList : Array of names to get the field list. Has to be an object array with 'formControlName' key to use the function
 * @param {any} defaultValue : Default value for the fields
 * @return {any} group: Group of fields to fill the  formGroup
 * @usageNotes
 * For example, to get
 * {
 *  name: ['', [Validators.required]],
 *  password: ['', [Validators.required]]
 * }:
 * formGroupFieldsOnlyRequired([{ formControlName: 'name' }, { formControlName: 'password' }], '')
 *
 */

export function formGroupFieldsOnlyRequired(
  fieldList: Array<string>,
  defaultValue: any = ''
): any {
  const group: any = {};
  for (const field of fieldList) {
    group[field] = [defaultValue, [Validators.required]];
  }
  return group;
}

export function getTemplateInputList(
  list: Array<{ titulo: string, campos: Array<DynamicFieldType> }>,
  this_: any,
  defaultOptions: { [titulo: string]: Array<any> } = {}) {
  return list.map(element => {
    return {
      ...element,
      campos: getTemplateCamposList(element, this_, defaultOptions)
    }
  })
}

export function getTemplateCamposList(
  field: { titulo: string, campos: Array<DynamicFieldType> },
  this_: any,
  defaultOptions: { [titulo: string]: Array<any> } = {}) {
  // const list = [];
  // for(const element of field.campos) {
  //   list.push({
  //     ...element,
  //     options: element.title in defaultOptions && defaultOptions[element.title].length ? defaultOptions[element.title] : element.options ?? [],
  //     type: this_[element.type]
  //   })
  // }
  return field.campos.map(element => ({
    ...element,
    options: element.title in defaultOptions && defaultOptions[element.title].length ? defaultOptions[element.title] : element.options ?? [],
    type: this_[element.type]
  }));
}

export function getSelectClassItemLength(list: Array<any>) {
  return `multiline-${list.length}-radio-button`;
}

export function formGroupFields(
  formBuilder: any,
  fieldList: Array<DynamicFieldType>,
  initData: any
): any {
  const group: any = {};
  let validatorsTmp: any = [];
  for (let field of fieldList) {
    if (field.validators) {
      for (let itemVali of field.validators) {
        const itemVali2Type: keyof typeof Validators = itemVali.type
        const itemVali2Value: any = itemVali.value;
        if (itemVali.value !== null) {
          validatorsTmp.push(Validators[itemVali2Type](itemVali2Value));
        } else {
          validatorsTmp.push(Validators[itemVali.type]);
        }
      }
    }
    //
    if (field.isFormArray) {
      const arrayValue = [];

      if (field.key in initData) {
        for(const element of initData[field.key]) {
          arrayValue.push(formBuilder.group({
            descripcion: [element.descripcion, [...validatorsTmp, Validators.required]],
            tipo: [element.tipo, [ Validators.required]]
          }))
        }
      }
      group[field.key] = new UntypedFormArray(arrayValue);
    } else {
      group[field.key] = [field.key in initData ? initData[field.key] : field.defaultValue, validatorsTmp];
    }
    validatorsTmp = [];
  }
  return group;
}

/**
 * Return an form group array to control all the switchs
 * @param { FormBuilder } form builder class to create the form group
 * @param { Array<SelectOptionType> } list: array of all keys
 * @param { number | null } selectedIndex (optional) index default selected option
 * @returns {  Array<FormControl> } control: object with all keys on the list
 */
export function fillFormArraySelectOptionType(
  formBuilder: UntypedFormBuilder,
  list: Array<SelectOptionType>,
  selectedIndex: number | null = null
): Array<UntypedFormControl> {
  const group: any = [];
  let i = 0;
  for (const element of list) {
    const status = i === (selectedIndex ?? -1);
    i++;
    group.push(
      formBuilder.group({
        respuesta: [status, [Validators.required]],
        codigo: [element.codigo, [Validators.required]],
        descripcion: [element.descripcion, [Validators.required]],
      })
    );
  }
  return group;
}

/**
 * Subscripcion para controlar la seleccion cuando l apcion "Ninguna" esta disponible
 * @param subscriptionField Form array to subscribe
 */
export function setSubscriptionSwitchOption(
  this_: any,
  toastr: any,
  subscriptionField: UntypedFormArray
) {
  const subscribeArray = [];
  const lastIndex = subscriptionField.controls.length - 1;
  for (let i = 0; i <= lastIndex; i++) {
    let subscribeFunc = onOptionSelect;
    if (i === lastIndex) {
      // the 'none' option
      subscribeFunc = onNoneOptionSelect;
    }
    subscribeArray.push(
      subscriptionField.controls[i].valueChanges.subscribe(
        subscribeFunc.bind(this_, subscriptionField, toastr)
      )
    );
  }

  return subscribeArray;
}

/**
 * Subscribe to value change to update description
 * @param subscriptionField field to subscribe
 */
export function setSelectSubscription(
  formData: any,
  subscriptionField: string,
  catalog: Array<any>,
  fieldList: Array<string>,
  subscripctionFieldKey: string = 'codigo'
) {
  formData
    .get(`${subscriptionField}.${subscripctionFieldKey}`)
    ?.valueChanges.subscribe((value: any) => {
      for (const item of fieldList) {
        const filteredList = catalog.filter(
          (element) => element[subscripctionFieldKey] === value
        );
        const firstValue: any =
          filteredList.length > 0 ? filteredList[0] : null;
        const newValue = firstValue ? firstValue[item] : '';
        formData.get(`${subscriptionField}.${item}`)?.setValue(newValue);
      }
    });
}

export function setCurrencyInputSubscription(
  formData: UntypedFormGroup,
  subscriptionField: string,
  time: number = 3000
): Subscription | undefined {
  return formData
    .get(subscriptionField)
    ?.valueChanges.pipe(debounceTime(time))
    .subscribe((value) => {
      let amount = formData.get(subscriptionField)?.value;
      if (isNaN(parseFloat(amount))) {
        formData.get(subscriptionField)?.setValue(0);
      }
      amount = CurrencyFunctions.priceToNumber(
        formData.get(subscriptionField)?.value
      );
      formData
        .get(subscriptionField)
        ?.setValue(formatCurrency(amount, 'en-US', '', 'MXN'), {
          emitEvent: false,
        });
    });
}

/**
 * If an option is selected, the "none option" switch is set to false
 * @param subscriptionField Parent of the subscription's item
 * @param value Subscription's item value
 */
const onOptionSelect = (
  subscriptionField: UntypedFormArray,
  toastr: any, // No se usa, pero debe recibir los mismos parametros que onNoneOptionSelect
  value: SelectOptionType
) => {
  const lastIndex = subscriptionField.controls.length - 1;
  if (value.respuesta) {
    const item = subscriptionField.controls[lastIndex];
    item.get('respuesta')?.setValue(false);
  }
};

/**
 * If "none option" switch is selected, the other are setted to false
 * @param subscriptionField Parent of the subscription's item
 * @param value Subscription's item value
 */
const onNoneOptionSelect = (
  subscriptionField: UntypedFormArray,
  toastr: any,
  value: SelectOptionType
) => {
  const formControls = subscriptionField.controls;
  const lastIndex = formControls.length - 1;

  if (value.respuesta) {
    for (let i = 0; i < lastIndex; i++) {
      const item = formControls[i];
      item.get('respuesta')?.setValue(false);
    }
  } else {
    if (!isOptionSelected(formControls)) {
      toastr.warning('Debe haber al menos una opción seleccionada.');
      const item = formControls[lastIndex];
      item.get('respuesta')?.setValue(true);
    }
  }
};

/**
 * Recorre el arreglo de formControls y busca si hay al menos una opcion seleccionada
 * @param optionList
 * @returns
 */
function isOptionSelected(optionList: any): boolean {
  for (const option of optionList) {
    if (option.get('respuesta').value) {
      return true;
    }
  }
  return false;
}

export function showFormErrors(formData: UntypedFormGroup): boolean {
  formData.markAllAsTouched();
  if (formData.valid) {
    return true;
  }

  Object.values(formData.controls).forEach((control) => {
    showFormArrayErrors(control as any);
    if (control.invalid) {
      control.markAsDirty();
      control.updateValueAndValidity({ onlySelf: true });
    }
  });
  window.scrollTo({ top: 200, behavior: 'smooth' });
  return false;
}

function showFormArrayErrors(form: any): void {
  if ('controls' in form) {
    const control = form.controls;
    Object.values(control).forEach((subcontrol: any) => {
      showFormArrayErrors(subcontrol as any);
      if (subcontrol.invalid) {
        subcontrol.markAsDirty();
        subcontrol.updateValueAndValidity({ onlySelf: true });
      }
    });
  }
}
