import { Component } from '@angular/core';
import { IRouteCard } from './route-cards';

import { RoutecardService } from './routecardservice';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  routecards: IRouteCard[] = [];

  cols: any[] = [];


  checked: boolean = false;
  selectedOutbom: any[] = ["1000"];
  selectedInbom: any[] = [];

  constructor(private routecardService: RoutecardService) { }

  ngOnInit() {
      this.routecardService.getRouteCards().then(data => this.routecards = data);
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

  bomChange(type: 'inbom'| 'outbom',event: any,index: number): void{
    if(type === 'outbom'){
      this.routecards[index].outbom = !this.routecards[index].outbom;
    }else{
      this.routecards[index].inbom = !this.routecards[index].inbom;
    }

    // console.log(this.routecards,'this.routecards');
  }






  submit(): void{



    let outbomCount = 0;
    let inbomCount = 0;

    this.routecards.map(x => {

        if(x.inbom === true){
          inbomCount++;
        }

        if(x.outbom === true){
          outbomCount++;
        }
    });


    if(inbomCount === outbomCount){
      const lastIndex = this.routecards.length - 1;
      if (this.routecards[0].outbom === true && this.routecards[lastIndex].inbom === true ){   // 1st process Outward and last process Inward BOM Eq

        //Continuous Outward

        let finalArray = [];
        let lastInwardCheck = true;

        let continousOutBomFlag = true;

        let isTrueCount = 0;
          this.routecards.map((x,index) => {
            if(x.outbom === true){

              isTrueCount++;
              if(isTrueCount > 1 &&  continousOutBomFlag){
                //check previous value

                if(this.routecards[index-1].inbom === true){
                  //continue...
                }else{
                  lastInwardCheck = false;
                }

                //again set inital value
                isTrueCount = 0;
              }
            }else{
              if(isTrueCount === 1){
                isTrueCount = 0;
              }
            }
        });


        if(lastInwardCheck){
          alert('continue...');
        }else{
          console.log('3th Condition-(False) => [Continuous last Inward check must]');
        }


      }else{
        console.log('2nd Condition-(False) => [1st process & last process must be check]');
      }
    }else{
      console.log('1st Condition-(False) => [count Not Equal]');
    }



//     const lastIndex = this.routecards.length - 1;
//       if (this.routecards[0].outbom === true && this.routecards[lastIndex].inbom === true ){


// console.log('ok')
//       }else{
//         console.log('noo');
//       }
  }

}
