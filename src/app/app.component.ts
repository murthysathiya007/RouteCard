import { Component } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { IRouteCard } from './route-cards';

import { RoutecardService } from './routecardservice';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
})
export class AppComponent {
  routecards: IRouteCard[] = [];
  cols: any[] = [];

  constructor(
    private routecardService: RoutecardService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.routecardService
      .getRouteCards()
      .then((data) => (this.routecards = data));
    this.cols = [
      { field: 'sno', header: 'SNO' },
      { field: 'process', header: 'PROCESS' },
      { field: 'outbom', header: 'OUTBOM' },
      { field: 'inbom', header: 'INBOM' },
      { field: 'type', header: 'TYPE' },
      { field: 'start_date', header: 'START DATE' },
      { field: 'end_date', header: 'END DATE' },
      { field: 'assignee', header: 'ASSIGNEE' },
      { field: 'status', header: 'STATUS' },
    ];
  }

  showToast(severity: 'success' | 'error', summary: string, detail: string) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
    });
  }

  bomChange(type: 'inbom' | 'outbom', event: any, index: number): void {
    type === 'outbom'
      ? (this.routecards[index].outbom = !this.routecards[index].outbom)
      : (this.routecards[index].inbom = !this.routecards[index].inbom);
  }

  submit(): void {
    let outbomCount = 0;
    let inbomCount = 0;
    const lastArrayIndex = this.routecards.length - 1; // Last array index

    this.routecards.forEach((x) => {
      x.inbom === true ? inbomCount++ : '';
      x.outbom === true ? outbomCount++ : '';
    });

    if (inbomCount === outbomCount) {
      //Inward & Outward BOM check count to be equal

      if (
        this.routecards[0].outbom === true &&
        this.routecards[lastArrayIndex].inbom === true
      ) {
        // 1st process Outward and last process Inward BOM Equal

        //Continuous Outward
        let lastInwardCheck = true;
        let endPreviousInwardIndex;
        let isOrderTrueArray: any[] = [];
        this.routecards.map((x, index) => {
          if (x.outbom === true) {
            isOrderTrueArray.push(index); //push continious outbom true index values
          } else {
            if (isOrderTrueArray.length < 2) {
              // is not be consecutive || is first time outbom false
              isOrderTrueArray = [];
            } else {
              let lastTrueIndex = isOrderTrueArray[isOrderTrueArray.length - 1]; //if outbom consecutive get last index of outbom

              if (this.routecards[lastTrueIndex - 1].inbom !== true) {
                //check previous value inbom value
                lastInwardCheck = false;
                endPreviousInwardIndex = lastTrueIndex;
              }

              isOrderTrueArray = []; //Again set inital empty array
            }
          }
        });

        if (lastInwardCheck) {
          this.showToast('success', 'Success', 'Form submit successfully!');
        } else {
          this.showToast(
            'error',
            'Error',
            `Row ${endPreviousInwardIndex} inbom must be check`
          );
        }
      } else {
        this.showToast(
          'error',
          'Error',
          `1st process & last process must be check`
        );
      }
    } else {
      this.showToast('error', 'Error', 'Inbom Outbom Count is Not Equal!');
    }
  }
}
