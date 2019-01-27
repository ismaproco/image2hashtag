import { Component } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import ImageTools from './image-tools';
type NamedProb = { name: string; prob: number };
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-app';
  selectedFile: File;
  url = 'https://venus.isma.xyz/image';
  imageSrc;
  results: NamedProb[];
  loading: any;
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
        observe: 'events',
      })
      .subscribe((event: any) => {
        if (event.type === 1) {
          this.loading = event;
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
