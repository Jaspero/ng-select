import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectComponent} from './src/select.component';
import {FormsModule} from '@angular/forms';

export * from './src/select.component';

@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [SelectComponent],
    exports: [SelectComponent]
})
export class JasperoSelectModule {}
