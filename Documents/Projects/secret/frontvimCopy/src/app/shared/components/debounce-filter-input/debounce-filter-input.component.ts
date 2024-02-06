import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-debounce-filter-input',
  templateUrl: './debounce-filter-input.component.html',
  styleUrls: ['./debounce-filter-input.component.scss']
})
export class DebounceFilterInputComponent implements OnInit {
  @Input() title: string = 'Filtrar';
  @Input() debounceTime: number = 1000;
  @Output() onFilterChange: EventEmitter<string> = new EventEmitter<string>();
  //
  public formData: UntypedFormGroup;
  public isFiltered: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder
  ) { 
    this.formData = this.formBuilder.group({
      filterWord: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.formData
    .get('filterWord')
    ?.valueChanges
    .pipe(debounceTime(this.debounceTime))
    .subscribe(value => {
      this.onFilterChange.emit(value);
      this.isFiltered = true;
    });
  }

  public onClearFilter(): void {
    this.isFiltered = false;
    this.formData.get('filterWord')?.setValue('');
    this.onFilterChange.emit('');
  }

}
