import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[appArrow]'
})
export class AppArrowDirective {
    constructor(private el: ElementRef) {
        setTimeout(() => {
            document.querySelector('ion-select').shadowRoot.querySelector('.select-icon').setAttribute('style', 'display: none');
            this.el.nativeElement.shadowRoot.querySelector('.ion-select').setAttribute('style', 'display: none !important');
            console.log("11111111111");
        }, 3000);
    }
}
