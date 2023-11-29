import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs-interfaces';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList : Gif[] = [];

 private _tagsHistory: string[] = [];
 private apiKey: string = '7Zl7qArY7XGUUZpw0ryYvdQAdYlAEZgc';
 private serviceUrl:string = 'https://api.giphy.com/v1/gifs';

  constructor( private http: HttpClient) {
    this.loadLocalStorage();
    console.log('Gifs Service Ready...');
  }


  get tagsHistory() {
    return [...this._tagsHistory]; //crea una copia para que no pase por referencia
  }

  private organizeHistory(tag:string) {
    tag = tag.toLowerCase();

    if(this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter( (oldtag) => oldtag!== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this.tagsHistory.splice(0,10);
    this.saveLocalStorage();
  }

  private loadLocalStorage():void {
     if( !localStorage.getItem('History'))    return;
    this._tagsHistory = JSON.parse( localStorage.getItem('History')! ); //puede ser la primera vez

    if ( this.tagsHistory.length===0) return;

    this.searchTag( this._tagsHistory[0]);
  }


  private saveLocalStorage():void {
    localStorage.setItem('History',  JSON.stringify(this._tagsHistory) );
  }

  searchTag(tag:string):void {

    if (tag.length===0) return;
    this.organizeHistory(tag);

    // fetch('https://api.giphy.com/v1/gifs/search?api_key=7Zl7qArY7XGUUZpw0ryYvdQAdYlAEZgc&q=valorant&limit=10')
    // .then( resp => resp.json() )
    // .then ( data => console.log(data) );

    // const resp = await fetch('https://api.giphy.com/v1/gifs/search?api_key=7Zl7qArY7XGUUZpw0ryYvdQAdYlAEZgc&q=valorant&limit=10');
    // const data = await resp.json();
    // console.log(data);
    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q', tag);

    //es un observable emite valores a lo largo del tiempo subscribirse es escuchar
    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params })
    .subscribe( resp => {

      this.gifList = resp.data;
      // console.log({ gifs: this.gifList });
    })

  }


}


