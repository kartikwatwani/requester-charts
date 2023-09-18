import { Component, OnDestroy, OnInit } from '@angular/core';
import {  ActivatedRoute, Router } from '@angular/router';
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
  requestersName:string=''
  chartsList: Chart[] = [
    {
      label: 'By Day',
      key: 'top10RequestersByDay',
    },
    {
      label: 'By Hour',
      key: 'top10RequestersByHour',
    },
    {
      label: 'By Day And Hour',
      key: 'top10RequestersByDayAndHour',
    },
  ];
  constructor(private router: Router, private chartService: ChartService,private route:ActivatedRoute) {}

  ngOnInit(): void {
 this.requestersName=this.route.snapshot.queryParams['name']
    this.key = this.route.snapshot.url[1].path;
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
        this.chartData = data[0] || {};
      });
  }
}
