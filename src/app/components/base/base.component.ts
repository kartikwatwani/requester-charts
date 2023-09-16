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
      label: 'Comparison of Hours Across All Days',
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


// TODO: Add a "by Day And Hour" Chart For all requesters. This should have a day selection. For each day selection, there should be a chart with 24 bars, one for each hour. Each bar should show the percentage. For any x axis position, the value will be calculated using this logic, The numerator will be sum of counts for that paticular hour on that day * 100. The denominator will be sum of counts for all hours on that day. For example, if the user selects Monday, then the first bar will show the percentage of counts for Monday 12 AM. The second bar will show the percentage of counts for Monday 1 AM. The third bar will show the percentage of counts for Monday 2 AM. And so on. The last bar will show the percentage of counts for Monday 11 PM.