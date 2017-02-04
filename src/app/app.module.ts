import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { JasperoSelectModule } from '@jaspero/ng2-select';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        JasperoSelectModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
