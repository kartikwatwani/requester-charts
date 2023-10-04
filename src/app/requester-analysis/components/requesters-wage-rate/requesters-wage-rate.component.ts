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
  value = 100;
  constructor(private chartService: ChartService, private router: Router) {}

  ngOnInit() {
    this.prepareDataForRequesterWages();
  }

  async prepareDataForRequesterWages() {
    this.data = await this.chartService.getQueryData('reqs', (ref) =>
      ref.orderByChild('count').startAt(this.value)
    );
    this.requesterList = this.data
      .filter((item) => item.count >= this.value)
      .sort((a, b) => b.wageRate - a.wageRate)
      .slice(0, 100);
  }

  getRequesterDetail(item, key = 'name', query = 'requestersName') {
    this.router.navigate([`/requester-analysis/${item[key]}`], {
      queryParams: { name: item[query] },
    });
  }
  onSliderChange() {
    this.prepareDataForRequesterWages();
  }
}
