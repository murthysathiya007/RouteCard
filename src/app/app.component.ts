import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { from, range } from 'rxjs';
import { IRouteCard } from './route-cards';

import { RoutecardService } from './routecardservice';

export interface IAlert{
  type: 'inbom'|'outbom',
  message: string;
}

export class Alert{
  type: string;
  message: string;
  constructor(type: 'inbom'|'outbom' ,message: string){
    this.type = type;
    this.message = message;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
})
export class AppComponent {
  routecards: IRouteCard[] = [];
  cols: any[] = [];

  rowCount: FormControl = new FormControl();

  constructor(
    private routecardService: RoutecardService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit() {
    const count: number = 7;

    const [...array] = Array(count).keys();

    this.routecards = this.routecardService.makeRowData(array);

    this.primengConfig.ripple = true;
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

  submit(): void {

    const outbomCount = this.routecards.filter(
      (value) => value.outbom === true
    ).length;

    const inbomCount = this.routecards.filter(
      (value) => value.inbom === true
    ).length;

    let alertMessages: any[] = [];
    let breakOutbomIndex: any[] = [];

    if (inbomCount === outbomCount) {  //Inward & Outward BOM check count to be equal

      if (
        this.routecards[0].outbom === true &&
        this.routecards[this.routecards.length - 1].inbom === true
      ) {

      // 1st process Outward and last process Inward BOM Equal

        let outBomArray: any[] = [];
        let inBomArray: any[] = [];

        this.routecards.map((ib) => {
          outBomArray.push(ib.outbom);
          inBomArray.push(ib.inbom);
        });

        let endIndexOfInBom: number;
        let endIndexOfInBomFlag = false;

        outBomArray.forEach((outbom, startIndex) => {
          if (outbom === true) {

            // find each end index of inbom based on outbom selection

            inBomArray.forEach((element, inbomIndex) => {
              if (
                (outBomArray.length - 1) > startIndex &&
                inbomIndex >= startIndex
              ) {
                if ((element === true) && !endIndexOfInBomFlag) {
                  endIndexOfInBom = inbomIndex;
                  endIndexOfInBomFlag = true;
                }
              }
            });

            /* To find startIndex and endIndex have any true IN "OUTBOM"  */

            let breakOutbomflag: boolean = false;
            outBomArray.forEach((out, i) => {
              if (i >= startIndex && i <= endIndexOfInBom) {
                  if (!(startIndex == i) && (out === true) && !breakOutbomflag) {
                    breakOutbomIndex.push(i);          // if we select outbom must be select inbom . in between outbom again select mean find that index values
                    breakOutbomflag = true;
                  } else {
                    if (this.routecards[i].outbom === null) {
                        alertMessages.push(new Alert('outbom',`Please set outbom Cross ${i + 1}`));
                    }

                    if (this.routecards[i].inbom === null) {
                      alertMessages.push(new Alert('inbom',`Please set inbom Cross ${i + 1}`));
                    }
                  }
              }
            });
          }
          endIndexOfInBomFlag = false;
        });

        if (breakOutbomIndex.length === 0) {
          if (alertMessages.length === 0) {
            this.showToast('success', 'Success', 'Form submit successfully!');
          } else {
            this.showToast('error', 'Error', `${alertMessages[0].message}`);
          }
        } else {
          this.showToast(
            'error',
            'Error',
            `${breakOutbomIndex[0]} remove that`
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

  makeTableData(): any {
    const count: number = this.rowCount.value;
    const [...array] = Array(count).keys();
    this.routecards = this.routecardService.makeRowData(array);
  }
}
