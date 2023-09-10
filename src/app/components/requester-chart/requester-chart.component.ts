import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ChartService } from 'src/app/services/chart.service';
import { ChartOptions, ChartType } from 'chart.js';
import { Chart } from '../base/base.component';

@Component({
  selector: 'app-requester-chart',
  templateUrl: './requester-chart.component.html',
  styleUrls: ['./requester-chart.component.scss'],
})
export class RequesterChartComponent implements OnInit {
 @Input() key = '';
  chartsList:Chart[] = [
    {
      label: 'Top 10 Requester By Day',
      key: 'top10RequestersByDay',
    },
    {
      label: 'Top 10 Requester By Hour',
      key: 'top10RequestersByHour',
    },
    {
      label: 'Top 10 Requester By Day And Hour',
      key: 'top10RequestersByDayAndHour',
    },
  ];
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
    { name: '12AM-1AM', value: '0' },
    { name: '1AM-2AM', value: '1' },
    { name: '2AM-3AM', value: '2' },
    { name: '3AM-4AM', value: '3' },
    { name: '4AM-5AM', value: '4' },
    { name: '5AM-6AM', value: '5' },
    { name: '6AM-7AM', value: '6' },
    { name: '7AM-8AM', value: '7' },
    { name: '8AM-9AM', value: '8' },
    { name: '9AM-10AM', value: '9' },
    { name: '10AM-11AM', value: '10' },
    { name: '11AM-12AM', value: '11' },
    { name: '12PM-1PM', value: '12' },
    { name: '1PM-2PM', value: '13' },
    { name: '2PM-3PM', value: '14' },
    { name: '3PM-4PM', value: '15' },
    { name: '4PM-5PM', value: '16' },
    { name: '6PM-7PM', value: '17' },
    { name: '7PM-8PM', value: '18' },
    { name: '8PM-9PM', value: '19' },
    { name: '9PM-10PM', value: '20' },
    { name: '10PM-11PM', value: '21' },
    { name: '11PM-12PM', value: '22' },
    { name: '11AM-12AM', value: '23' },
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
    '12AM-1AM',
    '1AM-2AM',
    '2AM-3AM',
    '3AM-4AM',
    '4AM-5AM',
    '5AM-6AM',
    '6AM-7AM',
    '7AM-8AM',
    '8AM-9AM',
    '9AM-10AM',
    '10AM-11AM',
    '11AM-12PM',
    '12PM-1PM',
    '1PM-2PM',
    '2PM-3PM',
    '3PM-4PM',
    '4PM-5PM',
    '5PM-6PM',
    '6PM-7PM',
    '7PM-8PM',
    '8PM-9PM',
    '9PM-10PM',
    '10PM-11PM',
    '11PM-12AM',
  ];
  barChartData: any[] = [
    {
      data: [],
      label: '',
      backgroundColor: this.chartService.customizeColors([]),
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
 @Input() filterKey = '';
  dayCount = [0, 1, 2, 3, 4, 5, 6];
  constructor(
    private chartService: ChartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
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
        this.prepareChartData();
      });
  }
  getMainChartLabel() {
    switch (this.filterKey) {
      case 'top10RequestersByDay':
        return 'Day Wise Percentage';
      case 'top10RequestersByHour':
        return 'Hour Wise Percentage';
      case 'top10RequestersByDayAndHour':
        return 'Day and Hour Wise Percentage';
    }
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
      this.barChartData[0].backgroundColor = '#1074f6';
    }
  }

  prepareChartData() {
    this.barChartData = [
      {
        data: [],
        label: this.getMainChartLabel(),
        backgroundColor: [],
      },
    ];
    const array: any[] = [];
    const newArray: number[] = [];
    switch (this.filterKey) {
      case 'top10RequestersByDay':
        if (this.chartData.LosAngeles.byDay) {
          this.dayCount.forEach((_, index) => {
            array.push(this.chartData.LosAngeles.byDay[index] || 0);
          });
          const total = array.reduce(
            (accumulator: number, currentValue: number) =>
              accumulator + currentValue,
            0
          );
          array.forEach((element: number) => {
            element = Math.round((element / total) * 100);
            newArray.push(element);
          });
          this.barChartData[0].data = newArray;
          this.barChartData[0].label = 'Day Wise percentage count';
          this.barChartData[0].backgroundColor = '#1074f6';
        }
        break;
      case 'top10RequestersByHour':
        this.dayCount.forEach((day) => {
          if (this.chartData.LosAngeles.byDayAndHour[day]) {
            for (const key in this.chartData.LosAngeles.byDayAndHour[day]) {
              if (key === this.selectedHour) {
                let totalValue = 0;
                const currentHourTotal =
                  this.chartData.LosAngeles.byDayAndHour[day][key];
                Object.keys(this.chartData.LosAngeles.byDayAndHour).forEach(
                  (currentDay) => {
                    if (
                      String(day) !== String(currentDay) &&
                      Number.isFinite(
                        this.chartData.LosAngeles.byDayAndHour[currentDay][
                          this.selectedHour
                        ]
                      )
                    ) {
                      totalValue +=
                        this.chartData.LosAngeles.byDayAndHour[currentDay][
                          this.selectedHour
                        ];
                    }
                  }
                );
                if (totalValue !== 0) {
                  const percentageValue = Math.round(
                    (currentHourTotal / totalValue) * 100
                  );
                  array.push(percentageValue);
                } else {
                  array.push(currentHourTotal);
                }
              } else {
                array.push(0);
              }
            }
          } else {
            array.push(0);
          }
       });
        this.barChartData[0].data = array;
        this.barChartData[0].backgroundColor = '#1074f6';
        break;
      case 'top10RequestersByDayAndHour':
        let count = 0;
        this.barChartData[0].data = [];
        this.dayCount.forEach((day) => {
          if (this.chartData.LosAngeles.byDayAndHour[day]) {
            for (const key in this.chartData.LosAngeles.byDayAndHour[day]) {
              if (key === this.selectedHour) {
                let totalValue = 0;
                const currentHourTotal =
                  this.chartData.LosAngeles.byDayAndHour[day][key];
                Object.keys(this.chartData.LosAngeles.byDayAndHour).forEach(
                  (currentDay) => {
                    if (
                      String(day) !== String(currentDay) &&
                      Number.isFinite(
                        this.chartData.LosAngeles.byDayAndHour[currentDay][
                          this.selectedHour
                        ]
                      )
                    ) {
                      totalValue +=
                        this.chartData.LosAngeles.byDayAndHour[currentDay][
                          this.selectedHour
                        ];
                    }
                  }
                );
                if (totalValue !== 0) {
                  const percentageValue = Math.round(
                    (currentHourTotal / totalValue) * 100
                  );
                  array.push(percentageValue);
                } else {
                  array.push(currentHourTotal);
                }
              } else {
                array.push(0);
              }
            }
          } else {
            array.push(0);
          }
        });
        this.barChartData[0].data = array;
        this.barChartData[0].backgroundColor = '#1074f6';
    }
  }
}
