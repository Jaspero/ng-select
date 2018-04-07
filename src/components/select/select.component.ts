import {DOCUMENT} from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input, OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2, TemplateRef,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {filter, skip, takeUntil, withLatestFrom} from 'rxjs/operators';
import {Subject} from 'rxjs/Subject';
import {KeyCode} from '../../enums/key-code.enum';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
  selector: 'jaspero-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true
  }]
})
export class SelectComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnChanges, OnDestroy {
  constructor(
    private _renderer: Renderer2,
    private _cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private _document: any
  ) { }

  @ViewChild('input') inputEl: ElementRef;

  @Input() key = 'name';
  @Input() options: any[];
  @Input() multiSelect: boolean;
  @Input() theTabIndex: number;
  @Input() matchFromStart = false;
  @Input() returnOnlyKey = false;
  @Input() selected: any;
  @Input() selectTemplate: TemplateRef<any>;
  @Input() dropDownTemplate: TemplateRef<any>;

  @Output() toggled = new EventEmitter<boolean>();

  propagateChange;
  onTouched;

  open$ = new Subject<boolean>();
  destroyed$ = new Subject();

  isMulti$ = new BehaviorSubject(false);
  activeIndex$ = new BehaviorSubject(null);
  selection$ = new BehaviorSubject(null);

  selectToUse: Function = this.select;
  outputToUse: Function = this.output;
  removeToUse: Function = this.remove;
  mapMethodToUse: Function = this.output;

  blockEmit = false;

  ngOnInit() {
    this.open$.pipe(
      takeUntil(this.destroyed$)
    )
      .subscribe(value => {
        this.toggled.emit(value);
      });

    this.selection$.pipe(
      takeUntil(this.destroyed$),
      skip(1),
      filter(() => !this.blockEmit)
    )
      .subscribe(value => {
        this.propagateChange(this.outputToUse(value));
      });
  }

  ngAfterViewInit() {
    fromEvent(this._document.documentElement, 'click')
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        this.open$.next(false);
      });

    fromEvent(this.inputEl.nativeElement, 'blur')
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        this.onTouched();
      });

    fromEvent<KeyboardEvent>(this.inputEl.nativeElement, 'keyup')
      .pipe(
        takeUntil(this.destroyed$),
        withLatestFrom(this.open$, this.activeIndex$)
      )
      .subscribe(data => {
        data[0].stopPropagation();

        switch (data[0].keyCode) {
          case KeyCode.UpArrow:
            if (!data[1]) {
              this.activeIndex$.next(this.options.length - 1);
              this.open$.next(true);
            } else {
              this.activeIndex$.next(data[2] > 0 ? data[2] - 1 : this.options.length - 1);
            }

            break;

          case KeyCode.DownArrow:
            if (!data[1]) {
              this.activeIndex$.next(0);
              this.open$.next(true);
            } else {
              this.activeIndex$.next(data[2] < this.options.length - 1 ? data[2] + 1 : 0);
            }

            break;

          case KeyCode.Enter:
            if (data[2] === null || !this.options.length) {
              return;
            }

            this.open$.next(false);
            this.selectToUse(data[2]);
            this.activeIndex$.next(null);

            break;

          case KeyCode.Escape:
            if (data[1]) {
              this.activeIndex$.next(null);
              this.open$.next(false);
            }
            break;
        }
      });
  }

  ngOnChanges(change) {

    if (change.multiSelect) {
      this.isMulti$.next(change.multiSelect.currentValue);

      if (change.multiSelect.currentValue) {
        this.outputToUse = this.returnOnlyKey ? this.outputOnlyKeyMulti : this.output;
        this.removeToUse = this.removeMulti;
        this.selectToUse = this.selectMulti;
      } else {
        this.outputToUse = this.returnOnlyKey ? this.outputOnlyKey : this.output;
        this.removeToUse = this.remove;
        this.selectToUse = this.select;
      }
    }

    if (change.returnOnlyKey) {
      const multiCurrent = this.isMulti$.getValue();

      if (change.returnOnlyKey.currentValue) {

        if (multiCurrent) {
          this.outputToUse = this.outputOnlyKeyMulti;
          this.mapMethodToUse = this.mapOnlyKeyMulti;
        } else {
          this.outputToUse = this.outputOnlyKey;
          this.mapMethodToUse = this.mapOnlyKey;
        }

      } else {
        this.outputToUse = this.output;
        this.mapMethodToUse = this.output;
      }
    }

    if (change.options) {

    }

    console.log('the change', change);
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  setObservable(name: string, value: any) {
    this[name].next(value);
  }

  open(event: KeyboardEvent) {
    event.stopPropagation();
    this.inputEl.nativeElement.focus();
    this.open$.next(true);
  }

  output(value: any) {
    return value;
  }

  outputOnlyKey(value: any) {
    return value[this.key];
  }

  outputOnlyKeyMulti(value: any[]) {
    return value.map(val => val[this.key]);
  }

  mapOnlyKey(value: any) {
    return this.options.find(option => option[this.key] === value);
  }

  mapOnlyKeyMulti(value: any) {
    return value.map(val => {
      return this.options.find(option => option[this.key] === val)
    });
  }

  select(index: number) {
    this.selection$.next(this.options[index]);
  }

  selectMulti(value: any) {}

  remove() {
    this.selection$.next(null);
  }

  removeMulti(value: any) {}

  writeValue(value: any) {
    this.blockEmit = true;
    this.selection$.next(this.mapMethodToUse(value));
    this.blockEmit = false;
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  setDisabledState(isDisabled) {
    this._renderer.setProperty(this.inputEl.nativeElement, 'disabled', isDisabled);
    this.open$.next(false);
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }
}
