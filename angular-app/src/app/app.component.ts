import { Component } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpEventType,
  HttpEvent,
  HttpProgressEvent
} from '@angular/common/http';
import ImageTools from './image-tools';
import { trigger, style, animate, transition } from '@angular/animations';

interface NamedProb {
  name: string;
  prob: number;
}
@Component({
  selector: 'app-root',
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(300px)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-app';
  selectedFile: File;
  url = 'https://venus.isma.xyz/image';
  imageSrc: string | ArrayBuffer;
  results: NamedProb[];
  loading: HttpProgressEvent;
  loadingComplete = false;

  constructor(private http: HttpClient) {}

  onFileChanged(event: File) {
    if (event) {
      this.selectedFile = event;
      const reader = new FileReader();
      reader.onload = e => (this.imageSrc = reader.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onUpload() {
    this.loading = { type: 0, loaded: 0, total: 100 };
    const imgTool = new ImageTools();
    imgTool
      .resize(this.selectedFile, { width: 640, height: 480 })
      .then((result: File) => this.performUpload(result));
  }

  performUpload(file: File) {
    const uploadData = new FormData();
    uploadData.append('file', file, this.selectedFile.name);
    this.http
      .post(this.url, uploadData, {
        reportProgress: true,
        observe: 'events'
      })
      .subscribe((event: HttpEvent<NamedProb[]>) => {
        console.log(event);
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.loading = event;
            break;
          default:
            break;
        }

        if (event instanceof HttpResponse) {
          this.results = <NamedProb[]>event.body;
          this.results.sort((a, b) => b.prob - a.prob);
          this.loading = null;
          this.loadingComplete = true;
        }
      });
  }

  reset() {
    this.selectedFile = null;
    this.imageSrc = '';
    this.results = [];
    this.loading = null;
    this.loadingComplete = false;
  }
}
