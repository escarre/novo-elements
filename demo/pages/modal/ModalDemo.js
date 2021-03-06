import { Component } from '@angular/core';
import {
    ModalRef,
    ModalService,
    NOVO_MODAL_ELEMENTS,
    NOVO_BUTTON_ELEMENTS,
    NOVO_HEADER_ELEMENTS
} from './../../../src/novo-elements';

import { CodeSnippet } from '../../elements/codesnippet/CodeSnippet';

import ModalAddDemoTpl from './templates/ModalAddDemo.html';
import ModalEditDemoTpl from './templates/ModalEditDemo.html';
import ModalErrorDemoTpl from './templates/ModalErrorDemo.html';
import ModalSuccessDemoTpl from './templates/ModalSuccessDemo.html';
import ModalWarningDemoTpl from './templates/ModalWarningDemo.html';

const template = `
<div class="container">
    <h1>Modals <small><a target="_blank" href="https://github.com/bullhorn/novo-elements/tree/master/src/elements/modal">(source)</a></small></h1>
    <p>Modals are pop-up dialogues designed to grab attention and inform the user of something critical, force a decision, or extend a workflow. There are two categories of modals: notification and workflow. Regardless of type, a modal should have a maximum of two main buttons.</p>

    <h2>Notification Modals</h2>

    <h5>Success</h5>
    <p>This modal uses only a primary action button. It is a confirmation that an action has been completed when the result is not immediately apparent. A workflow modal often transitions into a success modal.</p>
    <div class="example modal-demo"><button theme="secondary" (click)="showSuccess()">Show Me :)</button></div>
    <code-snippet [code]="ModalSuccessDemoTpl"></code-snippet>

    <h5>Warning</h5>
    <p>Warning modals ask for additional confirmation to complete an action because the action is either irreversible or there is an exception. The first line should always clarify the action or eventual result.</p>
      <div class="example modal-demo"><button theme="secondary" (click)="showWarning()">Show Me :)</button></div>
    <code-snippet [code]="ModalWarningDemoTpl"></code-snippet>

    <h5>Error</h5>
    <p>Error modals indicate that an attempted action has failed. The first line should apologize and state the what happened. The second line should quickly attempt to explain to the user why this has happened, and instruct the user on the best course of action.</p>
    <div class="example modal-demo"><button theme="secondary" (click)="showError()">Show Me :)</button></div>
    <code-snippet [code]="ModalErrorDemoTpl"></code-snippet>

    <h2>Workflow Modals</h2>

    <h5>Add</h5>
    <p>Add modals have a colored title bar based on the record type being created. Additionally, due to a greater than average amount of content, they have fixed footers.</p>
    <div class="example modal-demo"><button theme="secondary" (click)="showAdd()">Show Me :)</button></div>
    <code-snippet [code]="ModalAddDemoTpl"></code-snippet>

    <h5>Edit & Send</h5>
    <p>Edit, Send, and non-Add workflow modals possess a plain header to remind the user of the action they are taking. They generally have a neutralizing button, and a primary button.</p>
    <div class="example modal-demo"><button data-automation-id="modal-trigger" theme="secondary" (click)="showEdit()">Show Me :)</button></div>
    <code-snippet [code]="ModalEditDemoTpl"></code-snippet>
</div>
`;

@Component({
    selector: 'modal-success-demo',
    template: ModalSuccessDemoTpl,
    directives: [NOVO_MODAL_ELEMENTS]
})
export class ModalSuccessDemo {
    constructor(modalRef:ModalRef) {
        this.modalRef = modalRef;
    }

    close() {
        this.modalRef.close();
    }
}

@Component({
    selector: 'modal-warning-demo',
    template: ModalWarningDemoTpl,
    directives: [NOVO_MODAL_ELEMENTS]
})
export class ModalWarningDemo {
    constructor(modalRef:ModalRef) {
        this.modalRef = modalRef;
    }

    close() {
        this.modalRef.close();
    }
}

@Component({
    selector: 'modal-error-demo',
    template: ModalErrorDemoTpl,
    directives: [NOVO_MODAL_ELEMENTS]
})
export class ModalErrorDemo {
    constructor(modalRef:ModalRef) {
        this.modalRef = modalRef;
    }

    close() {
        this.modalRef.close();
    }
}

@Component({
    selector: 'modal-add-demo',
    template: ModalAddDemoTpl,
    directives: [NOVO_MODAL_ELEMENTS]
})
export class ModalAddDemo {
    constructor(modalRef:ModalRef) {
        this.modalRef = modalRef;
    }

    close() {
        this.modalRef.close();
    }
}

@Component({
    selector: 'modal-edit-demo',
    template: ModalEditDemoTpl,
    directives: [NOVO_MODAL_ELEMENTS]
})
export class ModalEditDemo {
    constructor(modalRef:ModalRef) {
        this.modalRef = modalRef;
    }

    close() {
        this.modalRef.close();
    }
}

@Component({
    selector: 'modal-demo',
    directives: [NOVO_MODAL_ELEMENTS, NOVO_BUTTON_ELEMENTS, NOVO_BUTTON_ELEMENTS, NOVO_HEADER_ELEMENTS, CodeSnippet],
    template: template
})
export class ModalDemo {
    constructor(modalService:ModalService) {
        this.modalService = modalService;

        this.ModalAddDemoTpl = ModalAddDemoTpl;
        this.ModalEditDemoTpl = ModalEditDemoTpl;
        this.ModalErrorDemoTpl = ModalErrorDemoTpl;
        this.ModalSuccessDemoTpl = ModalSuccessDemoTpl;
        this.ModalWarningDemoTpl = ModalWarningDemoTpl;
    }

    showSuccess() {
        this.modalService.open(ModalSuccessDemo);
    }

    showWarning() {
        this.modalService.open(ModalWarningDemo);
    }

    showError() {
        this.modalService.open(ModalErrorDemo);
    }

    showAdd() {
        this.modalService.open(ModalAddDemo);
    }

    showEdit() {
        this.modalService.open(ModalEditDemo);
    }
}
