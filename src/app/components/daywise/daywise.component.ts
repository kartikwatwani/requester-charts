import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { map } from 'rxjs';
import { ChartService } from 'src/app/services/chart.service';

@Component({
  selector: 'app-daywise',
  templateUrl: './daywise.component.html',
  styleUrls: ['./daywise.component.scss'],
})
export class DaywiseComponent {
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  dayCount = [0, 1, 2, 3, 4, 5, 6];
  hourCount = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  dayChartLabels: any[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Staturday',
    'Sunday',
  ];
  hourChartLabels: any[] = [
    '12-1',
    '1-2',
    '2-3',
    '3-4',
    '4-5',
    '5-6',
    '6-7',
    '7-8',
    '8-9',
    '9-10',
    '10-11',
    '11-12',
  ];

  hoursList: any[] = [
    { name: '12-1', value: '0' },
    { name: '1-2', value: '1' },
    { name: '2-3', value: '2' },
    { name: '3-4', value: '3' },
    { name: '4-5', value: '4' },
    { name: '5-6', value: '5' },
    { name: '6-7', value: '6' },
    { name: '7-8', value: '7' },
    { name: '8-9', value: '8' },
    { name: '9-10', value: '9' },
    { name: '10-11', value: '10' },
    { name: '11-12', value: '11' },
  ];
  key = 'byDay';
  selectedHour = this.hoursList[0].value;
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  data: any = [];
  barChartData: any[] = [
    {
      data: [45, 37, 60, 70, 46, 33, 3],
      label: 'Day wise percentage count',
      backgroundColor: this.chartService.customizeColors([10, 20, 30, 40, 50]),
    },
  ];

  constructor(
    private chartService: ChartService,
    private db: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.data = [];
    this.chartService
      .getAll(this.key)
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe((data) => {
        this.data = data;
        console.log(this.data);

        if (this.key === 'byDay') {
          this.prepareDayChart();
        } else if (this.key === 'byHour') {
          this.prepareHourChart();
        } else {
          this.prepareByDayandHourChart();
        }
      });
  }

  prepareDayChart() {
    const array: any = [];
    this.barChartData = [
      {
        data: [],
        label: 'Day Wise Percentage Count',
        backgroundColor: [],
      },
    ];
    this.dayCount.forEach((day) => {
      const hasIndex = this.data.findIndex(
        (item: any) => item.key === String(day)
      );
      if (hasIndex > -1) {
        let total = 0;
        for (const key in this.data[hasIndex].counts) {
          if (this.data[hasIndex].counts.hasOwnProperty(key)) {
            total += this.data[hasIndex].counts[key];
          }
        }

        array.push(total);
      } else {
        array.push(0);
      }
    });
    const total = array.reduce(
      (accumulator: number, currentValue: number) => accumulator + currentValue,
      0
    );
    const newArray: number[] = [];
    array.forEach((element: number) => {
      element = Math.round((element / total) * 100);
      newArray.push(element);
    });
    this.barChartData[0].data = newArray;
    this.barChartData[0].backgroundColor =
      this.chartService.customizeColors(newArray);
  }

  prepareHourChart() {
    const array: any = [];
    this.barChartData = [
      {
        data: [],
        label: ' Hour Wise Percentage Count',
        backgroundColor: [],
      },
    ];
    this.hourCount.forEach((day) => {
      const hasIndex = this.data.findIndex(
        (item: any) => item.key === String(day)
      );
      if (hasIndex > -1) {
        let total = 0;
        for (const key in this.data[hasIndex].counts) {
          if (this.data[hasIndex].counts.hasOwnProperty(key)) {
            total += this.data[hasIndex].counts[key];
          }
        }
        array.push(total);
        total = 0;
      } else {
        array.push(0);
      }
    });

    const total = array.reduce(
      (accumulator: number, currentValue: number) => accumulator + currentValue,
      0
    );
    const newArray: number[] = [];
    array.forEach((element: number) => {
      element = Math.round((element / total) * 100);
      newArray.push(element);
    });
    this.barChartData[0].data = newArray;
    this.barChartData[0].backgroundColor =
      this.chartService.customizeColors(newArray);
  }

  prepareByDayandHourChart() {
    const array: any = [];
    this.barChartData = [
      {
        data: [],
        label: 'Day Hour Wise Percentage Count',
        backgroundColor: [],
      },
    ];
    this.barChartData[0].data = [];
    this.dayCount.forEach((day) => {
      const hasIndex = this.data.findIndex(
        (item: any) => item.key === String(day)
      );

      if (hasIndex > -1) {
        // let total = 0;
        for (const key in this.data[hasIndex]) {
          if (key === this.selectedHour) {
            let totalValue = 0;

            const value = Object.values(this.data[hasIndex][key].counts);
            const currentHourTotal: any = value.reduce(
              (acc: any, currentValue: any) => acc + currentValue,
              0
            );
            const otherDays = this.data.filter(
              (item: any) =>
                String(item.key) !== String(this.data[hasIndex].key)
            );

            if (otherDays.length > 0) {
              otherDays.forEach((element: any) => {
                const matchKey = Object.keys(element).find(
                  (item) => String(item) === String(this.selectedHour)
                );
                if (matchKey) {
                  const value = Object.values(element[matchKey].counts);
                  const total: any = value.reduce(
                    (acc: any, currentValue: any) => acc + currentValue,
                    0
                  );
                  totalValue += total;
                }
              });
            }
            const percentageValue = Math.round(
              (currentHourTotal / totalValue) * 100
            );
            array.push(percentageValue);
          }
        }
      } else {
        array.push(0);
      }
    });
    this.barChartData[0].data = array;
    this.barChartData[0].backgroundColor =
      this.chartService.customizeColors(array);
  }
}
