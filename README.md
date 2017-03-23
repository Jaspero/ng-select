[![Build Status](https://travis-ci.org/Jaspero/ng2-select.svg?branch=master)](https://travis-ci.org/jaspero/ng2-select)
[![NPM Version](https://img.shields.io/npm/v/@jaspero/ng2-select.svg)](https://www.npmjs.com/package/@jaspero/ng2-select)
# NG2 Select
A select library for Angular 2, with both single and multiple functionality.

```
npm install --save @jaspero/ng2-select
```

## Setup
Import `JasperoSelectModule` in your `@NgModule`:

```ts
@NgModule({
    imports: [
        JasperoSelectModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}
```

## How To Use
To use the library simply add the component in your templates:
```typescript
<jaspero-select></jaspero-select>
```

## Options

You can pass the following inputs to the component:

|Name|Type|Description|Default|
|---|---|---|---|
|options|An array of options for the select dropdown|any[]|[]|
|key|The key from the options object to be used as the name of the option|string|name|
|multi|Should more options be selectable at once|boolean|false|

This component also support Angular 2 template driven and reactive forms.
 
