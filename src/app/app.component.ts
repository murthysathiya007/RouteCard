import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { from, range } from 'rxjs';
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

  rowCount: FormControl = new FormControl();

  constructor(
    private routecardService: RoutecardService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit() {

    const count: number = 7;

    const [...array] = Array(count).keys();

    this.routecards= this.routecardService.makeRowData(array);

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
    let outbomCount = 0;
    let inbomCount = 0;


    let alertMsg: any[] = [];
    let breakOutbomIndex: any[] = [];

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

        let outBomArray: any[] = []
        let inBomArray: any[] = []
        this.routecards.map((ib,indx) => {
          outBomArray.push(ib.outbom)
          inBomArray.push(ib.inbom)
        });




       const bomLength = outBomArray.length - 1;

        let endIndexOfInBom: number ;
        let endIndexOfInBomFlag = false;

        outBomArray.forEach((outbom,startIndex) => {  //hole outbom each
            if(outbom === true){

              //logic

              inBomArray.forEach((element,inbomIndex) => {
                if(bomLength > startIndex && inbomIndex >= startIndex){
                  if(element === true && !endIndexOfInBomFlag){
                    endIndexOfInBom = inbomIndex;
                    endIndexOfInBomFlag = true;
                  }
                }
              });   //get Successfully end index of inbom select


              /* To find startIndex and endIndex have any true IN "OUTBOM"  */

            let breakOutbomflag: boolean = false;
              outBomArray.forEach((out,i) => {
                if(i >= startIndex){
                  if(i <= endIndexOfInBom){
                     if( !(startIndex == i) && out === true && !breakOutbomflag){
                      breakOutbomIndex.push(i);
                      breakOutbomflag = true;
                     }else{

                      if(this.routecards[i].outbom !== true){
                        if(this.routecards[i].outbom !== false){
                          const a = {
                            type:'outbom',
                            message: `Please set outbom Cross ${i+1} `
                          }
                          alertMsg.push(a);
                        }
                      }

                      if(this.routecards[i].inbom !== true){
                        if(this.routecards[i].inbom !== false){
                          const a = {
                            type:'inbom',
                            message:  `Please set the inbom Cross ${i+1} `
                          }
                          alertMsg.push(a);
                        }
                      }
                     }
                  }
                }
              });
            }
            endIndexOfInBomFlag = false;
        });

        if(breakOutbomIndex.length === 0 ){
          if(alertMsg.length === 0){
            this.showToast('success', 'Success', 'Form submit successfully!');
          }else{
            this.showToast('error', 'Error', `${alertMsg[0].message}`);
          }
        }else{
            this.showToast('error', 'Error', `${breakOutbomIndex[0]} remove that`);
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



  makeTableData(): any{
    const count: number = this.rowCount.value;
    const [...array] = Array(count).keys();
    this.routecards= this.routecardService.makeRowData(array);
  }
}

       //-----------------------------------------//
        // this.routecards.map((ib,indx) => {
        //   if(ib.outbom === true){

        //     if(ib.inbom === true){

        //     }else{

        //       let inbomFlag = true;
        //       let notCrossedIndex;
        //       let notCrossedBoolean = false;
        //       this.routecards.forEach((item, index) => {

        //         if(index > indx && inbomFlag && !notCrossedBoolean){

        //           if(item.inbom === true)
        //           inbomFlag = false;

        //           let a = someFn(item,index,indx)

        //           console.log(a,'sam')

        //           if(a === 'notCrossed'){
        //             notCrossedIndex = index;
        //             notCrossedBoolean = true;
        //             return ;
        //           }

        //         }
        //       })
        //     }
        //   }
        // })

        //-----------------------------------------//

        // //Continuous Outward
        // let lastInwardCheck = true;
        // let endPreviousInwardIndex;
        // let isOrderTrueArray: any[] = [];
        // this.routecards.map((x, index) => {
        //   if (x.outbom === true) {
        //     isOrderTrueArray.push(index); //push continious outbom true index values
        //   } else {
        //     if (isOrderTrueArray.length < 2) {
        //       // is not be consecutive || is first time outbom false
        //       isOrderTrueArray = [];
        //     } else {
        //       let lastTrueIndex = isOrderTrueArray[isOrderTrueArray.length - 1]; //if outbom consecutive get last index of outbom

        //       if (this.routecards[lastTrueIndex - 1].inbom !== true) {
        //         //check previous value inbom value
        //         lastInwardCheck = false;
        //         endPreviousInwardIndex = lastTrueIndex;
        //       }

        //       isOrderTrueArray = []; //Again set inital empty array
        //     }
        //   }
        // });

        // if (lastInwardCheck) {
        //   this.showToast('success', 'Success', 'Form submit successfully!');
        // } else {
        //   this.showToast(
        //     'error',
        //     'Error',
        //     `Row ${endPreviousInwardIndex} inbom must be check`
        //   );
        // }
