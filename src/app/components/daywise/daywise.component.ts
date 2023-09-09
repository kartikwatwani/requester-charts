import { Component } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { map } from 'rxjs/operators';
import { ChartService } from '../../services/chart.service';
import 'chart.js';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-daywise',
  templateUrl: './daywise.component.html',
  styleUrls: ['./daywise.component.scss'],
})
export class DaywiseComponent {
  chartOptions: ChartOptions = {
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
  key = 'byDay';
  databasePath = '';
  selectedHour = this.hoursList[0].value;
  selectedDay = this.dayList[0].id;
  chartType: ChartType = 'bar';

  data: any = [];
  chartData: any[] = [
    {
      data: [45, 37, 60, 70, 46, 33, 3],
      label: 'Day wise percentage',
      chartType: 'bar',
    },
  ];

  constructor(private chartService: ChartService) {}

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
      console.log('data', this.data);
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
  }

  onDayChange() {
    this.calculateTop10Requesters();
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
