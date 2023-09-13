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


//TODO : Wherever there is a select option to select the day or hour for the chart or the top 10 table, show the data in table and chart for the current day/hour/day&hour by default. Currently, the first day(Monday) or hour(12AM-1AM) is selected by default.

//TODO: Add padding of 16px to the left and right of the table and chart. Currently, the table and chart are touching the left and right edges of the screen.

//TODO: