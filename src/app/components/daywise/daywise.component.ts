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
  hourCount = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
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
  requesterList: any[] = [];
  dayList: any[] = [
    { name: 'Monday', id: 1 },
    { name: 'Tuesday', id: 2 },
    { name: 'Wednesday', id: 3 },
    { name: 'Thursday', id: 4 },
    { name: 'Friday', id: 5 },
    { name: 'Staturday', id: 6 },
    { name: 'Sunday', id: 7 },
  ];
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
  key = 'byDay';
  newKey = '';
  selectedHour = this.hoursList[0].value;
  selectedDay = this.dayList[0].id;
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

  onDayChange() {
    if (this.key === 'by10Day') {
      this.calculateTop10byDay();
    } else {
      this.calculateTop10byDayHour();
    }
  }

  getData() {
    this.data = [];
    this.newKey =
      this.key === 'by10Day' ||
      this.key === 'by10Hour' ||
      this.key === 'by10DayHour'
        ? 'byRequesterID'
        : `${this.key}/LosAngeles`;
    this.chartService
      .getAll(this.newKey)
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
      .subscribe((data) => {
        this.data = data;
        this.requesterList = [];
        if (this.key === 'byDay') {
          this.prepareDayChart();
        } else if (this.key === 'byHour') {
          this.prepareHourChart();
        } else if (this.key === 'byDayAndHour') {
          this.prepareByDayandHourChart();
        } else if (this.key === 'by10Day') {
          this.calculateTop10byDay();
        } else if (this.key === 'by10Hour') {
          this.calculateTop10byHour();
        } else if (this.key === 'by10DayHour') {
          this.calculateTop10byDayHour();
        }
      });
  }

  calculateTop10byDay() {
    let array: any = [];
    Object.keys(this.data).forEach((key) => {
      const value =
        this.data[key].counts.LosAngeles.byDay[this.selectedDay] || 0;
      if (value !== 0) {
        array.push({ name: this.data[key].key, value });
      }
    });
    array = array.sort((a: any, b: any) => b.value - a.value);
    this.requesterList = array.slice(0, 10);
  }

  onHourChange() {
    if (this.key === 'byDayAndHour') {
      this.prepareByDayandHourChart();
    } else if (this.key === 'by10Hour') {
      this.calculateTop10byHour();
    } else {
      this.calculateTop10byDayHour();
    }
  }

  calculateTop10byHour() {
    let array: any = [];
    Object.keys(this.data).forEach((key) => {
      const value =
        this.data[key].counts.LosAngeles.byHour[String(this.selectedHour)] || 0;
      if (value !== 0) {
        array.push({ name: this.data[key].key, value });
      }
    });
    array = array.sort((a: any, b: any) => b.value - a.value);
    this.requesterList = array.slice(0, 10);
  }

  calculateTop10byDayHour() {
    let array: any = [];
    Object.keys(this.data).forEach((key) => {
      const value =
        this.data[key].counts.LosAngeles.byDayAndHour &&
        this.data[key].counts.LosAngeles.byDayAndHour[this.selectedDay]
          ? this.data[key].counts.LosAngeles.byDayAndHour[
              String(this.selectedDay)
            ][String(this.selectedHour)]
          : 0 || 0;
      if (value && value !== 0) {
        array.push({ name: this.data[key].key, value: value });
      }
    });
    array = array.sort((a: any, b: any) => b.value - a.value);
    this.requesterList = array.slice(0, 10);
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
