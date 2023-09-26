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
      key: 'topRequestersByDay',
      isShow:true,
    },
    {
      label: 'Top 10 Requester By Hour  For Accept',
      key: 'topRequestersByHour',
      isShow:true,
    },
    {
      label: 'Top 10 Requester By Day And Hour  For Accept',
      key: 'topRequestersByDayAndHour',
      isShow:true,
    },
    {
      label: 'Top 10 Requester By Day For Submit',
      key: 'topRequestersByDayForSubmit',
      isShow:false,
    },
    {
      label: 'Top 10 Requester By Hour  For Submit',
      key: 'topRequestersByHourForSubmit',
      isShow:false,
    },
    {
      label: 'Top 10 Requester By Day And Hour  For Submit',
      key: 'topRequestersByDayAndHourForSubmit',
      isShow:false,
    },
    {
      label: 'Top 100 Requester By Wage Rate',
      key: 'top100RequestersByWageRate',
      isShow:true,
    },
    {
      label: 'Top 100 Requester By Reactions',
      key: 'topRequestersByReactions',
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




// TODO: Rename select options to "By Presence", "By Wage Rate", "By Reaction".

// TODO: Move logic and template of wage rate table and reaction table to their own components. The components for it have already been created with name "requesters-reactions","requesters-wage-rate". You need to move the logic and template to their respective components and make appropriate change in base component to show them when the select option is clicked.

// TODO: Make the data fetch for each of the "By Presence", "By Wage Rate", "By Reaction" option only when it is shown for the first time. Don't load data for all three in one go.

// EXPERIMENT: Improve the visibility of the main select option. You can try centering it and see If it looks good. You can try different things and see what looks best.


// TODO: Update path from /base to /requester-analysis.

// TODO: When "by Presence" is selected, the path should by "/requester-analysis/by-presence", similary for "by Wage Rate" -> "requester-analysis/by-wage-rate" and "by Reaction" -> "requester-analysis/by-reaction".

