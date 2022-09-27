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
        "E-COATING",
        "Chakra Bracelet",
        "Galaxy Earrings",
        "Game Controller",
        "Gaming Set",
        "Gold Phone Case",
        "Green Earbuds",
        "Green T-Shirt",
        "Grey T-Shirt",
        "Headphones",
        "Light Green T-Shirt",
        "Lime Band",
        "Mini Speakers",
        "Painted Phone Case",
        "Pink Band",
        "Pink Purse",
        "Purple Band",
        "Purple Gemstone Necklace",
        "Purple T-Shirt",
        "Shoes",
        "Sneakers",
        "Teal T-Shirt",
        "Yellow Earbuds",
        "Yoga Mat",
    ];

    typeNames: string[] = [
      "operation",
      "operation1",
      "operation2",
    ]


    constructor(private http: HttpClient) { }


    makeRowData(array: any) {
      let data: any[] = [];
      array.forEach((element: any) => {
        data.push(this.generateRouteCard());
      });

      return data;
  }

    getRouteCards() {
        return this.http.get<any>('assets/data.json')
        .toPromise()
        .then(res => <IRouteCard[]>res.data)
        .then(data => { return data; });
    }

    generateRouteCard(): IRouteCard {
      const routeCard: IRouteCard =  {
            id: this.generateId(),
            name: this.generateName(),
            process: this.generateName(),
            outbom :null,
            inbom :null,
            type: this.generateType(),
            start_date: this.randomDate(new Date(2012, 0, 1), new Date()),
            end_date: this.randomDate(new Date(2012, 0, 1), new Date()),
            assignee : this.generateName(),
            status:this.generateStatus()
      };

      return routeCard;
  }

    generateId() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    generateName() {
        return this.routecardNames[Math.floor(Math.random() * Math.floor(30))];
    }

    generateType() {
      return this.typeNames[Math.floor(Math.random() * Math.floor(20))];
  }

    generateStatus() {
        return this.status[Math.floor(Math.random() * Math.floor(3))];
    }

    randomDate(start: any, end: any) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }




}
