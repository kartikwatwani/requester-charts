import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from '../base/base.component';
import { ChartService } from '../../services/chart.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-requesters-base',
  templateUrl: './requesters-base.component.html',
  styleUrls: ['./requesters-base.component.scss'],
})
export class RequestersBaseComponent implements OnInit, OnDestroy {
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
    private router: Router,
    private chartService: ChartService
  ) {}

  ngOnInit(): void {

    const splitUrl = this.router.url.split('/');
    this.key = splitUrl[splitUrl.length - 1];
    this.getData();
  }

  ngOnDestroy() {}

  getData() {
    this.chartData = {};
    this.chartService
      .getAll(`byRequesterID/${this.key}`)
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe((data) => {
        this.chartData = data[0]||{};
      });
  }
}
