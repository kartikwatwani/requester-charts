import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from '../requesters-presence/requesters-presence';
import { ChartService } from '../../services/chart.service';
import { firstValueFrom, map } from 'rxjs';

@Component({
  selector: 'app-requesters-base',
  templateUrl: './requesters-base.component.html',
  styleUrls: ['./requesters-base.component.scss'],
})
export class RequestersBaseComponent implements OnInit, OnDestroy {
  key: string = '';
  chartData: any = {};
  submitData: any = {};
  reactionsData: any = {};
  wageData:any={};
  filterKey: string = '';
  requestersName: string = '';
  chartsList: Chart[] = [
    {
      label: 'By Day',
      key: 'topRequestersByDay',
    },
    {
      label: 'By Hour',
      key: 'topRequestersByHour',
    },
    {
      label: 'By Day And Hour',
      key: 'topRequestersByDayAndHour',
    },
    {
      label: 'Requesters Detail',
      key: 'requestersDetail',
    },
  ];
  constructor(
    private router: Router,
    private chartService: ChartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.requestersName = this.route.snapshot.queryParams['name'];
    this.key = this.route.snapshot.url[1].path;
    console.log(this.key);

    this.getData();
  }

  ngOnDestroy() {}

  async getData() {
    this.chartData = {};
    const acceptData = await firstValueFrom(
      this.chartService
        .getAll(`byRequesterID/${this.key}`, true)
        .snapshotChanges()
        .pipe(
          map((changes) =>
            changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
          )
        )
    );
    if (acceptData.length > 0) {
      this.chartData = acceptData[0];
    }

    const data = await firstValueFrom(
      this.chartService
        .getAllSubmitCount(`byRequesterID/${this.key}`, true)
        .snapshotChanges()
        .pipe(
          map((changes) =>
            changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
          )
        )
    );
    const requestersReaction = await firstValueFrom(
      this.chartService
        .getOthersEmployeeData(`reacts/requester/${this.key}`)
        .snapshotChanges()
        .pipe(
          map((changes) =>
            changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
          )
        )
    );
    if (requestersReaction.length > 0) {
      this.reactionsData = requestersReaction[0];
    }
    if (data.length > 0) {
      this.submitData = data[0];
    }
    const wageData = await firstValueFrom(
      this.chartService
        .getOthersEmployeeData(`reqs`)
        .snapshotChanges()
        .pipe(
          map((changes) => {
            return changes
              .map((c) => ({ key: c.payload.key, ...c.payload.val() }))
              .filter((item) => item.key === this.key)[0];
          })
        )
    );
    this.wageData=wageData
    console.log(this.wageData);
  }
}

// TODO: When viewing a particular requester data, add a card to show details about requesters average, min and max wage rate. Also, add data about reactions.
