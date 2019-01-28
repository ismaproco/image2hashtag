import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FileDropModule } from 'ngx-file-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileDropComponent } from './file-drop/file-drop.component';
import { ImageWrapperComponent } from './image-wrapper.component';

@NgModule({
  declarations: [AppComponent, FileDropComponent, ImageWrapperComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FileDropModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
