import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-dynamic-form-select',
  templateUrl: './dynamic-form-select.component.html',
  styleUrls: ['./dynamic-form-select.component.scss']
})
export class DynamicFormSelectComponent implements OnInit {
  @Input() formData: UntypedFormGroup = new UntypedFormGroup({});
  @Input() inputName: string = 'Select';
  @Input() formControl: string = 'formControl';
  @Input() placeholder: string = 'placeholder';
  @Input() isMultiple: boolean = false;
  @Input() options: Array<any> = [];
  @Input() groupLabelFunc: (item: any, index: any) => string = (item: any, index: any) => '';
  @Input() optionValueFunc: (item: any) => string = (item: any) => '';
  @Input() optionLabelFunc: (item: any) => string = (item: any) => '';

  constructor() { }

  ngOnInit(): void {
  }

}
