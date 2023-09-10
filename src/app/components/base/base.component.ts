import { Component } from '@angular/core';
export interface Chart{
  label:string;
  key:string
}

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent {
  chartsList:Chart[] = [
    {
      label: 'Day Wise',
      key: 'byDay',
    },
    {
      label: 'Hour Wise',
      key: 'byHour',
    },
    {
      label: 'By Day And Hour Wise',
      key: 'byDayAndHour',
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
}
