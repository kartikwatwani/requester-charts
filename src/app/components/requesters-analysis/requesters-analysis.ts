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
  xAxisLabels?: string[];
}

@Component({
  selector: 'requesters-analysis',
  templateUrl: './requesters-analysis.html',
  styleUrls: ['./requesters-analysis.scss'],
})
export class RequestersAnalysisComponent implements OnInit {
  requesterIDToNameMapping: any = {};
  filters: any[] = ChartConstant.filters;
  selectedFilter = this.filters[0].id;
  constructor(
    private chartService: ChartService,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.setRequesterIDToNameMapping();
    this.selectedFilter =
      this.route.snapshot.fragment !== 'null' &&
      this.route.snapshot.fragment !== null
        ? this.route.snapshot.fragment
        : this.filters[0].id;
    this.addFragmentToUrl();
  }

  setRequesterIDToNameMapping() {
    this.chartService.getRequestersName().then((data) => {
      this.requesterIDToNameMapping = data;
    });
  }

  addFragmentToUrl() {
    this.location.replaceState(`${this.location.path()}#${this.selectedFilter}`);
  }
}
