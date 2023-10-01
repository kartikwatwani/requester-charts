import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from '../requesters-analysis/requesters-analysis';
import { ChartService } from '../../services/chart.service';
import { ChartConstant } from '../../constant';

@Component({
  selector: 'app-requesters-base',
  templateUrl: './requester-base.component.html',
  styleUrls: ['./requester-base.component.scss'],
})
export class RequesterBaseComponent implements OnInit, OnDestroy {
  requesterID: string = '';
  acceptData: any = {};
  submitData: any = {};
  wageRateData: any = {};
  reactionsData: any = {};
  requestersName: string = '';
  chartsList: Chart[] = [
    {
      label: 'Summary',
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
      xAxisLabels: ChartConstant.hourChartLabels,
    },
  ];
  constructor(
    private chartService: ChartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.requestersName = this.route.snapshot.queryParams['name'];
    this.requesterID = this.route.snapshot.url[1].path;
    this.getData();
  }

  ngOnDestroy() {}

  async getData() {
    this.acceptData = {};
    const acceptData = await this.chartService.getAcceptCounts(
      `byRequesterID/${this.requesterID}`,
      true
    );

    if (acceptData.length > 0) {
      this.acceptData = acceptData[0];
    }

    const submitData = await this.chartService.getSubmitCounts(
      `byRequesterID/${this.requesterID}`,
      true
    );

    if (submitData.length > 0) {
      this.submitData = submitData[0];
    }

    const requestersReaction = await this.chartService.getDataAtPath(
      `reacts/requester/${this.requesterID}`
    );

    if (requestersReaction.length > 0) {
      this.reactionsData = requestersReaction[0];
    }
    this.wageRateData = (
      await this.chartService.getDataAtPath(`reqs`)
    ).filter((item) => item.key == this.requesterID)[0];
  }
}
