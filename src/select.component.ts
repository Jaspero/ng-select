import {Component, Input, forwardRef, HostListener, ViewChild, ElementRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
    selector: 'jaspero-select',
    template: `
        <div [ngSwitch]="isMulti" class="items" (click)="openActive($event)" [class.multi]="isMulti">
            <ng-template [ngSwitchCase]="true">
                <div class="item" *ngFor="let item of selected; let i = index">
                    <span (click)="remove(i, $event)">{{item[key]}}</span>
                </div>
            </ng-template>
            <ng-template [ngSwitchCase]="false">
                <div class="item" *ngIf="selected">{{selected[key]}}</div>
            </ng-template>
            <input type="text" name="search" autocomplete="off" #inp [(ngModel)]="search" (keyup)="keyUpHandler($event)"
                   (keydown)="keyDownHandler($event)" (ngModelChange)="filterHandler()">
        </div>
        <div class="dropdown" *ngIf="filteredSelection.length" [class.active]="active">
            <div class="dropdown-content">
                <div class="option" *ngFor="let item of filteredSelection; let i = index" (click)="select(i, $event)"
                     (mouseenter)="activeIndex = i" [class.selected]="i === activeIndex">
                    {{item[key]}}
                </div>
            </div>
        </div>
    `,
    styles: [`
        :host .items {
            font-size: 14px;
            font-family:inherit;
            box-sizing: border-box;
            border: none;
            box-shadow: none;
            outline: none;
            background: transparent;
            width: 100%;
            padding: 0 10px;
            line-height: 40px;
            height: 40px;
            position: relative;
            box-shadow: 0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12);
        }

        :host .items:after {
            position: absolute;
            top: 50%;
            right: 15px;
            display: block;
            width: 0;
            height: 0;
            border-color: #808080 transparent transparent transparent;
            border-style: solid;
            border-width: 5px 5px 0 5px;
            content: '';
            -webkit-transform: translateY(-50%);
            -moz-transform: translateY(-50%);
            -ms-transform: translateY(-50%);
            -o-transform: translateY(-50%);
            transform: translateY(-50%);
        }

        :host .items .item {
            float: left;
            margin: 0 3px 3px 0;
            cursor: pointer;
            display: inline-block;
            vertical-align: baseline;
            zoom: 1;
        }

        :host .items.multi .item {
            cursor: default;
            border-radius: 16px;
            display: block;
            height: 30px;
            line-height: 30px;
            margin: 5px 8px 0 0;
            padding: 0 12px;
            float: left;
            box-sizing: border-box;
            max-width: 100%;
            position: relative;
            background: rgb(224,224,224);
            color: rgb(66,66,66);
        }

        :host input[type="text"] {
            background: none;
            border:none;
            outline:none;
            float: left;
            min-height: 20px;
            vertical-align: middle;
            position: relative;
            top: 50%;
            font-family:inherit;
            -webkit-transform: translateY(-50%);
            -moz-transform: translateY(-50%);
            -ms-transform: translateY(-50%);
            -o-transform: translateY(-50%);
            transform: translateY(-50%);
            border:none;
            box-shadow: none;
            padding:0;
            display: inline-block;
            width:auto;
        }

        :host .dropdown {
            position: absolute;
            z-index: 10;
            margin: -1px 0 0 0;
            background: #ffffff;
            border-top: 0 none;
            display: none;
            width: 100%;
            box-shadow: 0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12);
        }

        .dropdown.active {
            display: block;
        }

        :host .dropdown .dropdown-content {
            max-height: 200px;
            overflow-x: hidden;
            overflow-y: auto;
            width: 100%;
        }

        :host .dropdown .dropdown-content .option {
            padding: 8px;
            cursor: pointer;
        }

        :host .dropdown .dropdown-content .option:hover {
            background-color: #f9f9f9;
        }
    `],
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

    @Input() matchFromStart = false;
    @Input() key = 'name';
    @Input() set multi(to: boolean) {
        this.isMulti = to;
        if (to) this.selected = this.selected || [];
    }

    @ViewChild('inp') inpEl: ElementRef;

    search = '';
    activeIndex: any = null;
    isMulti = false;
    active = false;

    selection: any[] = [];
    formatedSelection: any[] = [];
    filteredSelection: any[] = [];

    @HostListener('document:click') close() {
        this.active = false;
    }

    select(index: any, event?: any): void {
        if (event) event.stopPropagation();
        if (this.isMulti) this.selected = [...this.selected, this.filteredSelection[index]];
        else {
            if (this.selected) {
                this.formatedSelection.push(this.selected);
                this.filteredSelection.push(this.selected);
            }
            this.selected = this.filteredSelection[index];
            this.active = false;
        }

        // TODO: Find a better option this is just a temp fix
        this.formatedSelection.splice(this.formatedSelection.findIndex(item => this.filteredSelection[index][this.key] === item[this.key]), 1);
        this.filteredSelection.splice(index, 1);

        this.search = '';
        this.propagateChange(this.selected);
    }

    remove(index: number, event?: any): void {
        if (event) event.stopPropagation();
        if (this.isMulti) {
            this.formatedSelection.push(this.selected[index]);
            this.filteredSelection.push(this.selected[index]);
            this.selected.splice(index, 1);
        } else this.selected = null;
        this.propagateChange(this.selected);
    }

    openActive(event: any) {
        event.stopPropagation();
        this.inpEl.nativeElement.focus();
        this.active = !this.active;
        this.activeIndex = this.active ? 0 : null;
    }

    keyUpHandler(event: any) {
        event.stopPropagation();

        switch (event.keyCode) {
            case 38:
                if (!this.active) {
                    this.activeIndex = this.filteredSelection.length - 1;
                    this.active = true;
                } else this.activeIndex = this.activeIndex > 0 ? this.activeIndex - 1 : this.filteredSelection.length - 1;
                return;

            case 40:
                if (!this.active) {
                    this.activeIndex = 0;
                    this.active = true;
                } else this.activeIndex = this.activeIndex < this.filteredSelection.length - 1 ? this.activeIndex + 1 : 0;
                return;

            case 13:
                if (this.activeIndex === null || !this.filteredSelection.length) return;
                this.active = false;
                this.select(this.activeIndex);
                this.activeIndex = null;
                return;
        }
    }

    keyDownHandler(event: any) {
        if (event.keyCode !== 8) return;
        if (this.isMulti && this.search === '' && this.selected.length) this.remove(this.selected.length - 1);
    }

    filterHandler() {
        if (this.search === '') {
            this.filteredSelection = this.formatedSelection.map(a => a);
        } else {
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
                this.selected.forEach((item: any) => {
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

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched() {}

    /*
     End of Form Control
     */
}
