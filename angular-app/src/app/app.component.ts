import { Component } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

type NamedProb = {name:string, prob: number};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-app';
  selectedFile: File;
  url = 'https://venus.isma.xyz/image'
  imageSrc;
  results: NamedProb[];
  loading:any;

  constructor(private http: HttpClient) {

  }
  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = e => this.imageSrc = reader.result;
    reader.readAsDataURL(this.selectedFile);
  }

  onUpload() {
    const uploadData = new FormData();
    uploadData.append('file', this.selectedFile, this.selectedFile.name);
    this.http.post(this.url, uploadData, {
      reportProgress: true,
      observe: 'events',
    })
      .subscribe((event:any) => {
        if(event.type === 1) {
          this.loading = event;
        }

        console.log(event); // handle event here
        if(event instanceof HttpResponse) {
          this.results =  <NamedProb[]>event.body;
          this.results.sort((a,b) => b.prob - a.prob)
          this.loading = null;
        }
      });
  }
}
