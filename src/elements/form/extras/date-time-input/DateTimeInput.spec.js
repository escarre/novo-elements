// // import {DOM} from 'angular2/src/platform/dom/dom_adapter';
// import { Component } from '@angular/core';
// import { By } from 'angular2/platform/common_dom';
// import { beforeEach, expect, describe, it } from 'angular2/testing';
// import { createTestContext } from '../../../../testing/TestContext';
// import { FormInput, DateTimeInput } from '../FormExtras';
//
// @Component({
//     selector: 'test-cmp',
//     directives: [FormInput, DateTimeInput],
//     template: `
//     <form-input type="datetime"></form-input>
// `
// })
// class TestCmp {
//     constructor() {
//     }
// }
//
// describe('Element: DateTimeInput', () => {
//     let ctx;
//     let instance;
//     let cmpElement;
//     let cmpInstance;
//
//     beforeEach(createTestContext(_ctx => ctx = _ctx));
//
//     beforeEach(done => {
//         ctx.init(TestCmp)
//             .finally(done)
//             .subscribe(() => {
//                 instance = ctx.fixture.componentInstance;
//             });
//     });
//
//     beforeEach(done => {
//         setTimeout(() => {
//             const cmpDebugElement = ctx.fixture.debugElement.query(By.directive(DateTimeInput));
//             cmpElement = cmpDebugElement.nativeElement;
//             cmpInstance = cmpDebugElement.componentInstance;
//             done();
//         }, 50);
//     });
//
//     it('should have the instance and cmpElement defined', () => {
//         expect(instance).toBeDefined();
//         expect(cmpInstance).toBeDefined();
//         expect(cmpElement).toBeDefined();
//     });
// });
