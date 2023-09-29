import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from '../requesters-presence/requesters-presence';
import { ChartService } from '../../services/chart.service';
import { ChartConstant } from '../../constant';
import { firstValueFrom, map } from 'rxjs';

@Component({
  selector: 'app-requesters-base',
  templateUrl: './requester-base.component.html',
  styleUrls: ['./requester-base.component.scss'],
})
export class RequesterBaseComponent implements OnInit, OnDestroy {
  key: string = '';
  acceptData: any = {};
  submitData: any = {};
  wageData: any = {};
  reactionsData: any = {};
  requestersName: string = '';
  chartsList: Chart[] = [
    {
      label: 'Requesters Detail',
      key: 'requestersDetail',
    },
    {
      label: 'By Day',
      key: 'byDay',
      xAxisLabels: ChartConstant.dayChartLabels,
    },
    {
      label: 'By Hour',
      key: 'byHour',
      xAxisLabels: ChartConstant.hourChartLabels,
    },
    {
      label: 'By Day And Hour',
      key: 'byDayAndHour',
      xAxisLabels: ChartConstant.dayChartLabels,
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
    console.log(this.key);

    this.getData();
  }

  ngOnDestroy() {}

  async getData() {
    this.acceptData = {};
    const acceptData = await this.chartService.getAcceptCounts(
      `byRequesterID/${this.key}`,
      true
    );

    if (acceptData.length > 0) {
      this.acceptData = acceptData[0];
    }

    const submitData = await this.chartService.getSubmitCounts(
      `byRequesterID/${this.key}`,
      true
    );

    if (submitData.length > 0) {
      this.submitData = submitData[0];
    }

    const requestersReaction = await this.chartService.getOthersEmployeeData(
      `reacts/requester/${this.key}`
    );

    if (requestersReaction.length > 0) {
      this.reactionsData = requestersReaction[0];
    }
    this.wageData = (
      await this.chartService.getOthersEmployeeData(`reqs`)
    ).filter((item) => item.key == this.key)[0];
    console.log(this.wageData);
  }
}

// TODO: When viewing a particular requester data, add a card to show details about requesters average, min and max wage rate. Also, add data about reactions.

//TODO: Rename the component RequestersBaseComponent to RequesterBaseComponent. Also, rename the folder and files from requesters-base to requester-base.
