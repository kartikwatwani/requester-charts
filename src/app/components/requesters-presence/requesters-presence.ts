import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { ChartService } from '../../services/chart.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChartConstant } from 'src/app/constant';

export interface Chart {
  label: string;
  key: string;
  width?: string;
  isShow?: boolean;
  xAxisLabels?: string[];
}

@Component({
  selector: 'app-base',
  templateUrl: './requesters-presence.html',
  styleUrls: ['./requesters-presence.scss'],
})
export class RequestersPresenceComponent implements OnInit {
  dayChartLabels: string[] = ChartConstant.dayChartLabels;
  hourChartLabels: string[] = ChartConstant.hourChartLabels;
  requesterList: any[] = [];
  chartsList: Chart[] = [
    {
      label: 'Day Wise',
      key: 'byDay',
      width: '450px',
      isShow: true,
      xAxisLabels: this.dayChartLabels,
    },
    {
      label: 'Hour Wise',
      key: 'byHour',
      width: '650px',
      isShow: true,
      xAxisLabels: this.hourChartLabels,
    },
    {
      label: 'Hour Comparison Across All Days',
      key: 'byDayAndHour',
      width: '550px',
      isShow: true,
      xAxisLabels: this.dayChartLabels,
    },
    {
      label: 'By Day And Hour',
      key: 'byDayAndHourForAllRequesters',
      isShow: true,
      width: '650px',
      xAxisLabels: this.hourChartLabels,
    },
    {
      label: 'Top Requesters By Day',
      key: 'topRequestersByDay',
      width: '550px',
      isShow: true,
    },
    {
      label: 'Top Requesters By Hour',
      key: 'topRequestersByHour',
      width: '550px',
      isShow: true,
    },
    {
      label: 'Top Requesters By Day And Hour',
      key: 'topRequestersByDayAndHour',
      width: '650px',
      isShow: true,
    },
  ];
  filters: any[] = [
    {
      id: 'by-presence',
      name: 'By Presence',
    },
    {
      id: 'by-wage-rate',
      name: 'By Wage Rate',
    },
    {
      id: 'by-reaction',
      name: 'By Reaction',
    },
  ];
  presenceType = 'accept';
  selectedFilter = this.filters[0].id;

  constructor(
    private chartService: ChartService,
    private location: Location,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.getEmployeeName();
    this.selectedFilter =
      this.route.snapshot.fragment !== 'null' &&
      this.route.snapshot.fragment !== null
        ? this.route.snapshot.fragment
        : this.filters[0].id;
    this.addFragmentToUrl();
  }

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
  addFragmentToUrl() {
    const currentUrl = this.location.path();
    const updatedUrl = `${currentUrl}#${this.selectedFilter}`;

    // Replace the current URL without triggering a route change
    this.location.replaceState(updatedUrl);
  }
}

//TODO: Rename this function to RequestersAnalysis function with file name as requesters-analysis and create a separate requesters-presence component to make the template have <app-requesters-presence></app-requesters-presence> and move html code from line 15 to 38 from this component to the new component.


//TODO: Remove unwanted variables in all components.