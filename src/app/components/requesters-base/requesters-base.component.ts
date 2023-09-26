import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from '../base/base.component';
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
  submitData:any={};
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
  ];
  constructor(
    private router: Router,
    private chartService: ChartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.requestersName = this.route.snapshot.queryParams['name'];
    this.key = this.route.snapshot.url[1].path;
    this.getData();
  }

  ngOnDestroy() {}

  async getData() {
    this.chartData = {};
  const acceptData=await firstValueFrom( this.chartService
      .getAll(`byRequesterID/${this.key}`,true)
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      ))
      console.log(acceptData);

      if(acceptData.length>0){
        this.chartData=acceptData[0];
      }

    const data = await firstValueFrom(
      this.chartService
        .getAllSubmitCount(`byRequesterID/${this.key}`,true)
        .snapshotChanges()
        .pipe(
          map((changes) =>
            changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
          )
        )
    );
    if(data.length>0){
      this.submitData=data[0];

    }
  }
}
