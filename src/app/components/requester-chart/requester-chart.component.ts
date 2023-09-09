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
    { name: '0', value: '0' },
    { name: '1', value: '1' },
    { name: '2', value: '2' },
    { name: '3', value: '3' },
    { name: '4', value: '4' },
    { name: '5', value: '5' },
    { name: '6', value: '6' },
    { name: '7', value: '7' },
    { name: '8', value: '8' },
    { name: '9', value: '9' },
    { name: '10', value: '10' },
    { name: '11', value: '11' },
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
  hourChartLabels: string[] = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
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
