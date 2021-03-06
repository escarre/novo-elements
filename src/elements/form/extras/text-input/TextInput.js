import { Component } from '@angular/core';
import { COMMON_DIRECTIVES } from '@angular/common';

import { BaseInput } from './../FormExtras';
import { NovoLabelService } from './../../../../novo-elements';

@Component({
    selector: 'text-input',
    inputs: ['name', 'placeholder', 'required'],
    directives: [COMMON_DIRECTIVES],
    template: `
        <i *ngIf="required" class="required-indicator" [ngClass]="{'bhi-circle': !control.valid, 'bhi-check': control.valid}"></i>
        <input [name]="name" type="text" [attr.id]="name" [placeholder]="placeholder" autocomplete="false" [(ngModel)]="value" [ngFormControl]="control"/>
        <span class="error-message" *ngIf="required && control.touched && control?.errors?.required">{{labels.required}}</span>
    `,
    host: {
        '(change)': 'update.emit(value)'
    }
})
export class TextInput extends BaseInput {
    constructor(labels:NovoLabelService) {
        super();
        this.labels = labels;
        this.value = '';
    }
}
