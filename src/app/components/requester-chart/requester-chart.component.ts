import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ChartService } from 'src/app/services/chart.service';
import { ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-requester-chart',
  templateUrl: './requester-chart.component.html',
  styleUrls: ['./requester-chart.component.scss'],
})
export class RequesterChartComponent implements OnInit {
  key = '';

  chartData: any = {};
  dayList: any[] = [
    { name: 'Monday', id: 1 },
    { name: 'Tuesday', id: 2 },
    { name: 'Wednesday', id: 3 },
    { name: 'Thursday', id: 4 },
    { name: 'Friday', id: 5 },
    { name: 'Staturday', id: 6 },
    { name: 'Sunday', id: 7 },
  ];
  hoursList: any[] = [
    { name: '00:00-01:00', value: '0' },
    { name: '01:00-02:00', value: '1' },
    { name: '02:00-03:00', value: '2' },
    { name: '03:00-04:00', value: '3' },
    { name: '04:00-05:00', value: '4' },
    { name: '05:00-06:00', value: '5' },
    { name: '06:00-07:00', value: '6' },
    { name: '07:00-08:00', value: '7' },
    { name: '08:00-09:00', value: '8' },
    { name: '09:00-10:00', value: '9' },
    { name: '10:00-11:00', value: '10' },
    { name: '11:00-12:00', value: '11' },
    { name: '12:00-13:00', value: '12' },
    { name: '13:00-14:00', value: '13' },
    { name: '14:00-15:00', value: '14' },
    { name: '15:00-16:00', value: '15' },
    { name: '16:00-17:00', value: '16' },
    { name: '17:00-18:00', value: '17' },
    { name: '18:00-19:00', value: '18' },
    { name: '19:00-20:00', value: '19' },
    { name: '20:00-21:00', value: '20' },
    { name: '21:00-22:00', value: '21' },
    { name: '22:00-23:00', value: '22' },
    { name: '23:00-24:00', value: '23' },
  ];
  barChartType: ChartType = 'bar';
  hourCount = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ];
  selectedHour = this.hoursList[0].value;
  selectedDay = this.dayList[0].id;
  barChartLegend = true;
  barChartPlugins = [];
  hourChartLabels: any[] = [
    '00:00-01:00',
    '01:00-02:00',
    '02:00-03:00',
    '03:00-04:00',
    '04:00-05:00',
    '05:00-06:00',
    '06:00-07:00',
    '07:00-08:00',
    '08:00-09:00',
    '09:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '12:00-13:00',
    '13:00-14:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00',
    '17:00-18:00',
    '18:00-19:00',
    '19:00-20:00',
    '20:00-21:00',
    '21:00-22:00',
    '22:00-23:00',
    '23:00-24:00',
  ];
  barChartData: any[] = [
    {
      data: [45, 37, 60, 70, 46, 33, 3],
      label: '',
      backgroundColor: this.chartService.customizeColors([10, 20, 30, 40, 50]),
    },
  ];
  dayChartLabels: any[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Staturday',
    'Sunday',
  ];
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  filterKey = '';
  dayCount = [0, 1, 2, 3, 4, 5, 6];
  constructor(
    private chartService: ChartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.key = this.route.snapshot.params['id'];
    this.filterKey = this.route.snapshot.queryParams['key'];
    this.getData();
  }

  getData() {
    this.chartData = {};
    this.chartService
      .getAll(`byRequesterID/${this.key}`)
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe((data) => {
        this.chartData = data[0];
        if (this.filterKey === 'by10Day') {
          this.prepareDataForDay();
        } else if (this.filterKey === 'by10DayHour') {
          this.prepareDataForHour();
        } else {
          this.prepareDataForDayAndHour();
        }
      });
  }

  prepareDataForHour() {
    this.barChartData = [
      {
        data: [],
        label: ' Hour Wise Percentage Count',
        backgroundColor: [],
      },
    ];
    const array: any[] = [];
    if (Array.isArray(this.chartData.LosAngeles.byHour)) {
      this.hourCount.forEach((item: any, index) => {
        array.push(this.chartData.LosAngeles.byHour[index] || 0);
      });
      const total = array.reduce(
        (accumulator: number, currentValue: number) =>
          accumulator + currentValue,
        0
      );
      const newArray: number[] = [];
      array.forEach((element: number) => {
        element = Math.round((element / total) * 100);
        newArray.push(element);
      });

      this.barChartData[0].data = newArray;
      this.barChartData[0].label = 'Hour Wise percentage count';
      this.barChartData[0].backgroundColor =
        this.chartService.customizeColors(newArray);
    }
  }

  prepareDataForDay() {
    this.barChartData = [
      {
        data: [],
        label: ' Day Wise Percentage Count',
        backgroundColor: [],
      },
    ];
    const array: any[] = [];
    if (Array.isArray(this.chartData.LosAngeles.byDay)) {
      this.dayCount.forEach((_, index) => {
        array.push(this.chartData.LosAngeles.byDay[index] || 0);
      });
      const total = array.reduce(
        (accumulator: number, currentValue: number) =>
          accumulator + currentValue,
        0
      );
      const newArray: number[] = [];
      array.forEach((element: number) => {
        element = Math.round((element / total) * 100);
        newArray.push(element);
      });
      this.barChartData[0].data = newArray;
      this.barChartData[0].label = 'Day Wise percentage count';
      this.barChartData[0].backgroundColor =
        this.chartService.customizeColors(newArray);
    }
  }

  prepareDataForDayAndHour() {
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
      const hasIndex = this.chartData.findIndex(
        (item: any) => item.key === String(day)
      );

      if (hasIndex > -1) {
        for (const key in this.chartData[hasIndex]) {
          if (key === this.selectedHour) {
            let totalValue = 0;
            const value = Object.values(this.chartData[hasIndex][key].counts);
            const currentHourTotal: any = value.reduce(
              (acc: any, currentValue: any) => acc + currentValue,
              0
            );
            const otherDays = this.chartData.filter(
              (item: any) =>
                String(item.key) !== String(this.chartData[hasIndex].key)
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
