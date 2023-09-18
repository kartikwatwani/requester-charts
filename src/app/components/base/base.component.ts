import { Component, OnInit } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { ChartService } from '../../services/chart.service';
export interface Chart {
  label: string;
  key: string;
}

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent implements OnInit {
  ngOnInit() {
    this.getEmployeeName();
  }
  requesterList:any[]=[]
  chartsList: Chart[] = [
    {
      label: 'Day Wise',
      key: 'byDay',
    },
    {
      label: 'Hour Wise',
      key: 'byHour',
    },
    {
      label: 'Comparison of Hours Across All Days',
      key: 'byDayAndHour',
    },
    {
      label: 'By Day And Hour',
      key: 'byDayAndHourForAllRequesters',
    },
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

  constructor(private chartService: ChartService) {}

  getEmployeeName() {
    firstValueFrom(
      this.chartService
        .getEmployeeName()
        .snapshotChanges()
        .pipe(
          map((changes) =>
            changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
          )
        )
    ).then((data) => {
      this.requesterList=data
      console.log(data);
    });
  }
}

//TODO: Give a main title above all charts for all requesters. The title should be "Requester Charts By Accept Count".

//TODO: After all the charts and tables, add a new section with the title "Requester Charts By Submit Count". We will add more charts below it.
