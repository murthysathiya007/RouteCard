import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRouteCard } from './route-cards';

@Injectable({
  providedIn:'root'
})
export class RoutecardService {

    status: string[] = ['PROCESS', 'INPROCESS', 'PENDING'];

    routecardNames: string[] = [
        "MACHINING",
        "DRILL TAP",
        "BORE FINISHING",
        "E-COATING"
    ];

    constructor(private http: HttpClient) { }

    getRouteCards() {
        return this.http.get<any>('assets/data.json')
        .toPromise()
        .then(res => <IRouteCard[]>res.data)
        .then(data => { return data; });
    }

}
