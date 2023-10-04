import { Component, OnInit } from '@angular/core';
import { ChartService } from '../../services/chart.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChartConstant } from '../../constant';

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
    this.getRequestersName();
    this.selectedFilter =
      this.route.snapshot.fragment !== 'null' &&
      this.route.snapshot.fragment !== null
        ? this.route.snapshot.fragment
        : this.filters[0].id;
    this.addFragmentToUrl();
  }

  getRequestersName() {
    this.chartService.getRequestersName().then((data) => {
      this.requesterIDToNameMapping = data;
    });
  }

  addFragmentToUrl() {
    this.location.replaceState(`${this.location.path()}#${this.selectedFilter}`);
  }
}





