import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectComponent} from './src/select.component';

export * from './src/select.component';

@NgModule({
    imports: [CommonModule],
    declarations: [SelectComponent],
    exports: [SelectComponent]
})
export class JasperoSelectModule {}
