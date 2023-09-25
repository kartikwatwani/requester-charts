import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { ChartService } from '../../services/chart.service';
export interface Chart {
  label: string;
  key: string;
  isShow?:boolean
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
  requesterList: any[] = [];
  chartsList: Chart[] = [
    {
      label: 'Day Wise',
      key: 'byDay',
      isShow:true,
    },
    {
      label: 'Hour Wise',
      key: 'byHour',
      isShow:true,
    },
    {
      label: 'Comparison of Hours Across All Days',
      key: 'byDayAndHour',
      isShow:true,
    },
    {
      label: 'By Day And Hour',
      key: 'byDayAndHourForAllRequesters',
      isShow:true,
    },
    {
      label: 'Top 10 Requester By Day  For Accept',
      key: 'top10RequestersByDay',
      isShow:true,
    },
    {
      label: 'Top 10 Requester By Hour  For Accept',
      key: 'top10RequestersByHour',
      isShow:true,
    },
    {
      label: 'Top 10 Requester By Day And Hour  For Accept',
      key: 'top10RequestersByDayAndHour',
      isShow:true,
    },
    {
      label: 'Top 10 Requester By Day For Submit',
      key: 'top10RequestersByDayForSubmit',
      isShow:false,
    },
    {
      label: 'Top 10 Requester By Hour  For Submit',
      key: 'top10RequestersByHourForSubmit',
      isShow:false,
    },
    {
      label: 'Top 10 Requester By Day And Hour  For Submit',
      key: 'top10RequestersByDayAndHourForSubmit',
      isShow:false,
    },
    {
      label: 'Top 100 Requester By Wage Rate',
      key: 'top100RequestersByWageRate',
      isShow:true,
    },
    {
      label: 'Top 100 Requester By Reactions',
      key: 'top100RequestersByDayReactions',
      isShow:true,
    },
  ];
  filters:any[]=[
    {
      id:'requesters-presence',
      name:'By Requester presence'
    },
    {
      id:'requesters-wage',
      name:'By Requesterswage'
    },
    {
      id:'requesters-reaction',
      name:'By Requesters reaction'
    },
  ]
  requesterType='accept';
  selectedFilter=this.filters[0].id

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
      this.requesterList = data;
    });
  }
}



//TODO Add tables for reactions and wage rates. Sample data in reacts.json and reqs.json in assets folder. This data will be queried from firebase fron endpoints /reacts and /reqs. Name will also be mapped
