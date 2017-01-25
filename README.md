[![Build Status](https://travis-ci.org/Jaspero/ng2-select.svg?branch=master)](https://travis-ci.org/jaspero/ng2-select)
[![NPM Version](https://img.shields.io/npm/v/@jaspero/ng2-select.svg)](https://www.npmjs.com/package/@jaspero/ng2-select)
# NG2 Select
An easy to use alert library for Angular 2.

## Setup
Import `JasperoAlertsModule` in your `@NgModule`: 

```ts
@NgModule({
    imports: [
        JasperoAlertsModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}
```

Then create the component in a root component (you can create it anywhere but you can only use it in that component on any lower ones).

```html
<jaspero-alerts [defaultSettings]="options"></jaspero-alerts>
```

## How To Use 
You need to import the `AlertsService` in your component:
 
```typescript
constructor(private _alert: AlertsService) {}
```

Then use the `create(type: 'success' | 'error' | 'wearning', 'info', message: string, settings: AlertSettings)` method to initiate an alert.

```typescript
open(type: AlertType) {
    this._alert.create(type, 'This is a message');
}
```

## Options

Available settings: 

```typescript
export interface AlertSettings {
    overlay?: boolean;
    overlayClickToClose?: boolean;
    showCloseButton?: boolean;
    duration?: number;
}
```

You can provide the settings as input to the `<jaspero-alerts></jaspero-alerts>` component.
Making the settings default for each created alert. However you can also override the settings by
passing them in the `create()` method.

 
