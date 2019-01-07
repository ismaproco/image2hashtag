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
  url = 'http://localhost:5000/image'
  imageSrc;
  results: NamedProb[];

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
      .subscribe(event => {
        console.log(event); // handle event here
        if(event instanceof HttpResponse) {
          this.results =  <NamedProb[]>event.body;
          this.results.sort((a,b) => b.prob - a.prob)
        }
      });
  }
}
