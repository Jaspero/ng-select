import {Component, Input, forwardRef, HostListener, ViewChild, ElementRef} from '@angular/core';
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
        if (sel) {
            this.selection = sel;
            this.formatedSelection = sel.map(item => item);
            this.filteredSelection = sel.map(item => item);
        }
    }

    @Input() matchFromStart: boolean = false;
    @Input() key: string = 'name';
    @Input() set multi(to: boolean) {
        this.isMulti = to;
        if (to) this.selected = this.selected || [];
    }

    @ViewChild('inp') inpEl: ElementRef;

    search: string = '';
    activeIndex: number = null;
    isMulti: boolean = false;
    active: boolean = false;

    selection: any[] = [];
    formatedSelection: any[] = [];
    filteredSelection: any[] = [];

    @HostListener('document:click') close() {
        this.active = false;
    }

    select(index: any, event?): void {
        if (event) event.stopPropagation();
        if (this.isMulti) {
            this.selected = [...this.selected, this.filteredSelection[index]];

            // TODO: Find a better option this is just a temp fix
            this.formatedSelection.splice(this.formatedSelection.findIndex(item => this.filteredSelection[index][this.key] === item[this.key]), 1);
            this.filteredSelection.splice(index, 1);
        }
        else {
            this.selected = this.selection[index];
            this.active = false;
        }

        this.search = '';
        this.propagateChange(this.selected);
    }

    remove(index: number, event?): void {
        if (event) event.stopPropagation();
        if (this.isMulti) {
            this.formatedSelection.push(this.selected[index]);
            this.filteredSelection.push(this.selected[index]);
            this.selected.splice(index, 1);
        }
        else this.selected = null;
        this.propagateChange(this.selected);
    }

    openActive(event) {
        event.stopPropagation();
        this.inpEl.nativeElement.focus();
        this.active = !this.active;
        this.activeIndex = this.active ? 0 : null;
    }

    keyUpHandler(event) {
        event.stopPropagation();
        switch (event.keyCode) {
            case 38:
                if (!this.active) {
                    this.activeIndex = this.filteredSelection.length - 1;
                    this.active = true;
                }
                else this.activeIndex = this.activeIndex > 0 ? this.activeIndex - 1 : this.filteredSelection.length - 1;
                return;

            case 40:
                if (!this.active) {
                    this.activeIndex = 0;
                    this.active = true;
                }
                else this.activeIndex = this.activeIndex < this.filteredSelection.length - 1 ? this.activeIndex + 1 : 0;
                return;

            case 13:
                if (this.activeIndex === null || !this.filteredSelection.length) return;
                this.active = false;
                this.select(this.activeIndex);
                this.activeIndex = null;
                return;
        }
    }

    keyDownHandler(event) {
        if (event.keyCode !== 8) return;
        if (this.isMulti && this.search === '' && this.selected.length) this.remove(this.selected.length - 1);
    }

    filterHandler() {
        if (this.search === '') {
            this.filteredSelection = this.formatedSelection.map(a => a);
        }
        else {
            if (!this.active) {
                this.activeIndex = 0;
                this.active = true;
            }

            if (this.matchFromStart) this.filteredSelection = this.formatedSelection.filter(value => value[this.key].indexOf(this.search) === 0);
            else this.filteredSelection = this.formatedSelection.filter(value => value[this.key].indexOf(this.search) !== -1)
        }
    }

    /*
     Form Control Value Accessor
     */
    writeValue(value: any) {
        if (value !== undefined) {
            this.selected = value;

            if (this.isMulti) {
                this.selected.forEach(item => {
                    let index = this.formatedSelection.findIndex(i => i[this.key] === item[this.key]);

                    if (index !== -1) {
                        this.formatedSelection.splice(index, 1);
                        this.filteredSelection.splice(index, 1);
                    }
                });
            }
        }
    }

    propagateChange = (_: any) => {};

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched() {}

    /*
     End of Form Control
     */
}
