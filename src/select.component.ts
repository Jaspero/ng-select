import {Component, Input, forwardRef, HostListener} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
    selector: 'jaspero-select',
    templateUrl: 'select.html',
    styleUrls: ['select.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectComponent),
            multi: true
        }
    ]
})
export class SelectComponent implements ControlValueAccessor {
    constructor() { }

    @Input() selected: any;

    @Input() set options(sel: any[]) {
        this.selection = sel;
        this.formatedSelection = sel.map(item => item);
    }

    @Input() key: string = 'name';
    @Input() set multi(to: boolean) {
        this.isMulti = to;
        if (to) this.selected = this.selected || [];
    }

    isMulti: boolean = false;
    active: boolean = false;

    selection: any[] = [];
    formatedSelection: any[] = [];

    @HostListener('document:click') close() {
        this.active = false;
    }

    select(index: number, event): void {
        event.stopPropagation();
        if (this.isMulti) {
            this.selected = [...this.selected, this.formatedSelection[index]];
            console.log(this.selected);
            this.formatedSelection.splice(index, 1);
        }
        else {
            this.selected = this.selection[index];
            this.active = false;
        }
        this.propagateChange(this.selected);
    }

    remove(index: number, event): void {
        event.stopPropagation();
        if (this.isMulti) {
            this.formatedSelection.push(this.selected[index]);
            this.selected.splice(index, 1);
        }
        else this.selected = null;
        this.propagateChange(this.selected);
    }

    openActive(event) {
        event.stopPropagation();
        this.active = !this.active;
    }

    /*
     Form Control Value Accessor
     */
    writeValue(value: any) {
        if (value !== undefined) this.selected = value;
    }

    propagateChange = (_: any) => {};

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched() {}
}