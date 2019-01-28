import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-wrapper',
  template: `
    <img [src]="src"
    alt=""
    class="upload-image" />
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      padding: 10px;
    }

    .upload-image {
      max-width: 300px;
      max-height: 300px;
      box-shadow: 0px 3px 10px rgba(0, 0, 0, 1);
    }
  `]
})
export class ImageWrapperComponent {
  @Input() src:string;
}
