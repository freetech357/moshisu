import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormErrorComponent } from './form-error/form-error.component';
import { LoaderComponent } from './loader/loader.component';
import { ValidationFormatDirective } from '../directive/validation-format.directive';
import { ReadOnlyDirective } from '../directive/read-only.directive';

@NgModule({
  declarations: [
    FormErrorComponent,
    LoaderComponent,
    ValidationFormatDirective,
    ReadOnlyDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FormErrorComponent,
    LoaderComponent,
    ValidationFormatDirective,
    ReadOnlyDirective
  ]
})
export class SharedModule { }
