import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { ChartService } from '../../services/chart.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChartConstant } from 'src/app/constant';

export interface Chart {
  label: string;
  key: string;
  isShow?: boolean;
  xAxisLabels?: string[];
}

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent implements OnInit {
  dayChartLabels: string[] = ChartConstant.dayChartLabels;
  hourChartLabels: string[] = ChartConstant.hourChartLabels;
  requesterList: any[] = [];
  chartsList: Chart[] = [
    {
      label: 'Day Wise',
      key: 'byDay',
      isShow: true,
      xAxisLabels: this.dayChartLabels,
    },
    {
      label: 'Hour Wise',
      key: 'byHour',
      isShow: true,
      xAxisLabels: this.hourChartLabels,
    },
    {
      label: 'Hour Comparison Across All Days',
      key: 'byDayAndHour',
      isShow: true,
      xAxisLabels: this.dayChartLabels,
    },
    {
      label: 'By Day And Hour',
      key: 'byDayAndHourForAllRequesters',
      isShow: true,
      xAxisLabels: this.hourChartLabels,
    },
    {
      label: 'Top Requesters By Day',
      key: 'topRequestersByDay',
      isShow: true,
    },
    {
      label: 'Top Requesters By Hour',
      key: 'topRequestersByHour',
      isShow: true,
    },
    {
      label: 'Top Requesters By Day And Hour',
      key: 'topRequestersByDayAndHour',
      isShow: true,
    }
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

  constructor(private chartService: ChartService, private location: Location,private route:ActivatedRoute) {}
  ngOnInit() {
    this.getEmployeeName();
    console.log(this.route.snapshot.fragment);

    this.selectedFilter = this.route.snapshot.fragment!=='null' &&this.route.snapshot.fragment!==null?this.route.snapshot.fragment:this.filters[0].id;

    this.addFragmentToUrl()
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

//TODO: Rename Base component to RequestersPresence component with files named as follows: requesters-presence.component.ts and so on for html , scss files.