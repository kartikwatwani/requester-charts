import { Component, Input, OnInit } from '@angular/core';
import { ChartConstant } from '../../constant';

@Component({
  selector: 'app-requesters-presence',
  templateUrl: './requesters-presence.component.html',
  styleUrls: ['./requesters-presence.component.scss'],
})
export class RequestersPresenceComponent implements OnInit {
  @Input() requesterIDToNameMapping = '';
  presenceType = ChartConstant.tableTypes.accept;
  chartsList=[
    {
      label: 'Day Wise',
      key: 'byDay',
      width: '450px',
      xAxisLabels: ChartConstant.dayChartLabels,
    },
    {
      label: 'Hour Wise',
      key: 'byHour',
      width: '650px',
      xAxisLabels: ChartConstant.hourChartLabels,
    },
    {
      label: 'Hour Comparison Across All Days',
      key: 'byDayAndHour',
      width: '550px',
      xAxisLabels: ChartConstant.dayChartLabels,
    },
    {
      label: 'By Day And Hour',
      key: 'byDayAndHourForAllRequesters',
      width: '650px',
      xAxisLabels: ChartConstant.hourChartLabels,
    },
    {
      label: 'Top Requesters By Day',
      key: 'topRequestersByDay',
      width: '550px',
    },
    {
      label: 'Top Requesters By Hour',
      key: 'topRequestersByHour',
      width: '550px',
    },
    {
      label: 'Top Requesters By Day And Hour',
      key: 'topRequestersByDayAndHour',
      width: '650px',
    },
  ];
  constructor(){}

  ngOnInit() {

  }
}
