import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';
import { ChartService } from 'src/app/services/chart.service';

@Component({
  selector: 'app-requesters-wage-rate',
  templateUrl: './requesters-wage-rate.component.html',
  styleUrls: ['./requesters-wage-rate.component.scss'],
})
export class RequestersWageRateComponent {
  data: any[] = [];
  @Input() label;
  requesterList = [];
  @Input() employeersList: any[] = [];
  constructor(private chartService: ChartService, private router: Router) {}
  async ngOnInit() {
    this.data = await firstValueFrom(
      this.chartService
        .getOthersEmployeeData('reqs')
        .snapshotChanges()
        .pipe(
          map((changes) =>
            changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
          )
        )
    );
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

//FIXME: When clicking "Requesters Details" button from from the table of this component the charts are not showing up on the requester-detail component.