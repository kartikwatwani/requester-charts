import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from '../base/base.component';
import { ChartService } from '../../services/chart.service';
import { ChartConstant } from '../../constant';

@Component({
  selector: 'app-requesters-base',
  templateUrl: './requesters-base.component.html',
  styleUrls: ['./requesters-base.component.scss'],
})
export class RequestersBaseComponent implements OnInit, OnDestroy {
  key: string = '';
  acceptData: any = {};
  submitData:any={};

  requestersName: string = '';
  chartsList: Chart[] = [
    {
      label: 'By Day',
      key: 'byDay',
      xAxisLabels:ChartConstant.dayChartLabels
    },
    {
      label: 'By Hour',
      key: 'byHour',
      xAxisLabels:ChartConstant.hourChartLabels
    },
    {
      label: 'By Day And Hour',
      key: 'byDayAndHour',
      xAxisLabels:ChartConstant.dayChartLabels
    },
  ];
  constructor(
    private router: Router,
    private chartService: ChartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.requestersName = this.route.snapshot.queryParams['name'];
    this.key = this.route.snapshot.url[1].path;
    this.getData();
  }

  ngOnDestroy() {}

  async getData() {
    this.acceptData = {};
    const acceptData = await this.chartService
      .getAcceptCounts(`byRequesterID/${this.key}`, true);
    
      if(acceptData.length>0){
        this.acceptData=acceptData[0];
      }

    const submitData = await this.chartService
      .getSubmitCounts(`byRequesterID/${this.key}`, true);
    
    if(submitData.length>0){
      this.submitData=submitData[0];

    }
  }
}


// TODO: When viewing a particular requester data, add a card to show details about requesters average, min and max wage rate. Also, add data about reactions.

//TODO: Rename the component RequestersBaseComponent to RequesterBaseComponent. Also, rename the folder and files from requesters-base to requester-base.



