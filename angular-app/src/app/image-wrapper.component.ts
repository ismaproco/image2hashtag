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
      max-width: 290px;
      max-height: 290px;
      box-shadow: 0px 3px 10px rgba(0, 0, 0, 1);
    }

    @media only screen and (min-device-width : 768px) {
      .upload-image {
        max-width: 490px;
        max-height: 490px;
        box-shadow: 0px 3px 10px rgba(0, 0, 0, 1);
      }
    }
  `]
})
export class ImageWrapperComponent {
  @Input() src:string;
}
