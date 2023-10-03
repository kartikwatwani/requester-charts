import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChartService } from '../../services/chart.service';

@Component({
  selector: 'app-requesters-wage-rate',
  templateUrl: './requesters-wage-rate.component.html',
  styleUrls: ['./requesters-wage-rate.component.scss'],
})
export class RequestersWageRateComponent {
  data: any[] = [];
  requesterList = [];
  constructor(private chartService: ChartService, private router: Router) {}

  async ngOnInit() {
    this.data = await this.chartService.getLimitedData('reqs', 'wageRate', 100);
    this.prepareDataForEmployeeWages();
  }

  prepareDataForEmployeeWages() {
    this.requesterList = this.data
      .sort((a, b) => b.wageRate - a.wageRate)
      .slice(0, 100);
  }

  getRequesterDetail(item, key = 'name', query = 'requestersName') {
    this.router.navigate([`/requester-analysis/${item[key]}`], {
      queryParams: { name: item[query] },
    });
  }
}
