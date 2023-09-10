//TODO: In every .ts file of the app, all imports should be relative to the current file location. For example, if you are importing a file from the same directory, use import ... from './file-name' instead of import ... from 'src/app/file-name'. If you are importing a file from a parent or child directory, use import ... from '../file-name' or import ... from '../parent-directory/file-name' instead of import ... from 'src/app/parent-directory/file-name'.

import { Component, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { ChartService } from '../../services/chart.service';
import 'chart.js';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConstant } from 'src/app/constant';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent {
  chartOptions = ChartConstant.chartOptions;
  barChartData: any = {};
  dayCount = ChartConstant.dayCount;
  dayChartLabels: string[] = ChartConstant.dayChartLabels;
  requesterList: any[] = [];
  @Input() label: string = '';
  hourChartLabels: string[] = ChartConstant.hourChartLabels;
  id = '';
  dayList: any[] = ChartConstant.dayList;
  hoursList: any[] = ChartConstant.hoursList;
  barChartType = ChartConstant.chartType;
  hourCount: number[] = ChartConstant.hourCount;
  @Input() key = 'byDay';
  databasePath = '';
  selectedHour = this.hoursList[0].value;
  selectedDay = this.dayList[0].id;
  data: any = [];
  chartType = ChartConstant.chartType;
  chartData: any[] = [
    {
      data: [45, 37, 60, 70, 46, 33, 3],
      label: 'Day wise percentage',
      chartType: 'bar',
    },
  ];

  constructor(
    private chartService: ChartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.data = [];
    this.databasePath =
      this.key.indexOf('top10') > -1
        ? 'byRequesterID'
        : `${this.key}/LosAngeles`;

    firstValueFrom(
      this.chartService
        .getAll(this.databasePath)
        .snapshotChanges()
        .pipe(
          map((changes) =>
            changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
          )
        )
    ).then((data) => {
      this.data = data;
      this.requesterList = [];
      switch (this.key) {
        case 'byDay':
        case 'byHour':
        case 'byDayAndHour':
          this.prepareChart();
          break;
        case 'top10RequestersByDay':
        case 'top10RequestersByHour':
        case 'top10RequestersByDayAndHour':
          this.calculateTop10Requesters();
          break;
      }
    });
    this.id = this.route.snapshot.params['id'];
  }

  onDayChange() {
    this.calculateTop10Requesters();
  }

  getRequesterDetail(item) {
    const requester = this.data.find((ele) => ele.key == item.name);
    const obj={
      ...requester.counts,
      key:requester.key
    }
    localStorage.setItem('requesters-detail', JSON.stringify(obj));
    // TODO: use wild card for navigation to specific requester chart page and change path to requester-analysis/:id
    this.router.navigate([`/requester-base/${item.name}`]);
  }
  onHourChange() {
    switch (this.key) {
      case 'byDayAndHour':
        this.prepareChart();
        break;
      case 'top10RequestersByDayAndHour':
      case 'top10RequestersByHour':
        this.calculateTop10Requesters();
    }
  }

  calculateTop10Requesters() {
    let array: any = [];
    let value;
    const metric = this.key.replace('top10RequestersBy', 'by');
    Object.keys(this.data).forEach((key) => {
      const counts = this.data[key].counts.LosAngeles;
      let selectedValue =
        metric === 'byDay' ? this.selectedDay : this.selectedHour;
      switch (metric) {
        case 'byDay':
        case 'byHour':
          value = counts[metric][selectedValue + ''] || 0;
          if (value !== 0) {
            array.push({ name: this.data[key].key, value });
          }
          break;
        case 'byDayAndHour':
          value =
            counts.byDayAndHour && counts.byDayAndHour[this.selectedDay]
              ? counts.byDayAndHour[String(this.selectedDay)][
                  String(this.selectedHour)
                ]
              : 0 || 0;
          if (value && value !== 0) {
            array.push({ name: this.data[key].key, value: value });
          }
      }
    });

    array = array.sort((a: any, b: any) => b.value - a.value);
    this.requesterList = array.slice(0, 10);
  }

  prepareChart() {
    this.chartData = [
      {
        data: [],
        label: this.getMainChartLabel(),
        backgroundColor: [],
        chartType: this.chartType,
      },
    ];

    this.chartData[0].data = this.prepareDataForChart();
    this.chartData[0].backgroundColor = '#1074f6';
  }

  getMainChartLabel() {
    switch (this.key) {
      case 'byDay':
        return 'Day Wise Percentage';
      case 'byHour':
        return 'Hour Wise Percentage';
      case 'byDayAndHour':
        return 'Day and Hour Wise Percentage';
    }
  }

  prepareDataForChart() {
//TODO: Calculate top 10 requesters from the data of /byDay, /byHour, /byDayAndHour data only, no need to fetch all requesters data from /byRequesterID endpoint.
    const newArray = [];
    switch (this.key) {
      
      case 'byDay': 
      case 'byHour':
        const totalTasksForEachPeriod =
          this.calculateTotalTasksPerPeriodForRequesters();
        const totalTasksAcrossAllPeriods = totalTasksForEachPeriod.reduce(
          (accumulator: number, currentValue: number) =>
            accumulator + currentValue,
          0
        );
        const percentageOfTotalTasksPerPeriod: number[] = [];
        totalTasksForEachPeriod.map((element: number) => {
          element = Math.round((element / totalTasksAcrossAllPeriods) * 100);
          percentageOfTotalTasksPerPeriod.push(element);
        });
        return percentageOfTotalTasksPerPeriod;
      case 'byDayAndHour':
        const array: number[] = [];
        const selectedHourCounts: number[] = [];
        const otherDaysCounts: number[] = [];
        this.dayCount.forEach((day) => {
          const index = this.data.findIndex(
            (item: any) => item.key === String(day)
          );

          if (index > -1) {
            const selectedHourData: any = this.data[index][this.selectedHour];
            if (selectedHourData) {
              const selectedHourTotal: any = Object.values(
                selectedHourData.counts
              ).reduce(
                (acc: number, currentValue: number) => acc + currentValue,
                0
              );
              selectedHourCounts.push(selectedHourTotal);

              const otherDays = this.data.filter(
                (item: any) => String(item.key) !== String(day)
              );
              if (otherDays.length > 0) {
                let otherDaysTotal = 0;
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
                    otherDaysTotal += total;
                  }
                });
                otherDaysCounts.push(otherDaysTotal);
              }
            } else {
              selectedHourCounts.push(0);
              otherDaysCounts.push(0);
            }
          } else {
            selectedHourCounts.push(0);
            otherDaysCounts.push(0);
          }
        });

        const totalSelectedHour = selectedHourCounts.reduce(
          (acc, currentValue) => acc + currentValue,
          0
        );
        const totalOtherDays = otherDaysCounts.reduce(
          (acc, currentValue) => acc + currentValue,
          0
        );

        return this.dayCount.map((day, index) => {
          if (selectedHourCounts[index] === 0) {
            return 0;
          }
          const percentageValue = Math.round(
            (selectedHourCounts[index] / (totalSelectedHour + totalOtherDays)) *
              100
          );
          array.push(percentageValue);
          return percentageValue;
        });
      case 'top10RequestersByDay':
        if (this.barChartData.LosAngeles.byDay) {
          this.dayCount.forEach((_, index) => {
            array.push(this.barChartData.LosAngeles.byDay[index] || 0);
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
          this.chartData[0].data = newArray;
          this.chartData[0].label = 'Day Wise percentage count';
          this.chartData[0].backgroundColor = '#1074f6';
        }
        break;
      case 'top10RequestersByHour':
        this.dayCount.forEach((day) => {
          if (this.barChartData.LosAngeles.byDayAndHour[day]) {
            for (const key in this.barChartData.LosAngeles.byDayAndHour[day]) {
              if (key === this.selectedHour) {
                let totalValue = 0;
                const currentHourTotal =
                  this.barChartData.LosAngeles.byDayAndHour[day][key];
                Object.keys(this.barChartData.LosAngeles.byDayAndHour).forEach(
                  (currentDay) => {
                    if (
                      String(day) !== String(currentDay) &&
                      Number.isFinite(
                        this.barChartData.LosAngeles.byDayAndHour[currentDay][
                          this.selectedHour
                        ]
                      )
                    ) {
                      totalValue +=
                        this.barChartData.LosAngeles.byDayAndHour[currentDay][
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
        this.chartData[0].data = array;
        this.chartData[0].backgroundColor = '#1074f6';
        break;
      case 'top10RequestersByDayAndHour':
    }
  }

  calculateTotalTasksPerPeriodForRequesters(data: any = this.data) {
    const array: any = [];
    const periodList = this.key === 'byDay' ? this.dayCount : this.hourCount;
    periodList.forEach((period) => {
      const index = data.findIndex((item: any) => item.key === String(period));
      if (index > -1) {
        let total = 0;
        const countsData = data[index].counts;
        for (const requesterID in countsData) {
          if (countsData.hasOwnProperty(requesterID)) {
            total += countsData[requesterID];
          }
        }
        array.push(total);
      } else {
        array.push(0);
      }
    });
    return array;
  }
}

//FIXME: Can't bind to 'queryParams' since it isn't a known property of 'a'. Look into chart.component.html file.



