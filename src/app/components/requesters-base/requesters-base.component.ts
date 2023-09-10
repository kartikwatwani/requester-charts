import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from '../base/base.component';
import { ChartService } from 'src/app/services/chart.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-requesters-base',
  templateUrl: './requesters-base.component.html',
  styleUrls: ['./requesters-base.component.scss'],
})
export class RequestersBaseComponent implements OnInit,OnDestroy {
  key: string = '';
  chartData: any = {};
  filterKey: string = '';
  chartsList: Chart[] = [
    {
      label: 'Top 10 Requester By Day',
      key: 'top10RequestersByDay',
    },
    {
      label: 'Top 10 Requester By Hour',
      key: 'top10RequestersByHour',
    },
    {
      label: 'Top 10 Requester By Day And Hour',
      key: 'top10RequestersByDayAndHour',
    },
  ];
  constructor(
    private route: ActivatedRoute,
    private chartService: ChartService
  ) {}

  ngOnInit(): void {
    this.key = this.route.snapshot.params['id'];
    this.chartData = JSON.parse(localStorage.getItem('requesters-detail'))
  }

  ngOnDestroy() {
    localStorage.removeItem('requesters-detail')
  }

}
