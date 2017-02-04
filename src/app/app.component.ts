import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    title = 'app works!';

    options = [{name: 'example-one'}, {name: 'example-two'}, {name: 'example-three'}]
}
