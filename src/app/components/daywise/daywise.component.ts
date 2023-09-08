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
      console.log('key', this.key);
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
    console.log('metric', metric);
    Object.keys(this.data).forEach((key) => {
      let selectedValue =
        metric === 'byDay' ? this.selectedDay : this.selectedHour;
      switch (metric) {
        case 'byDay':
        case 'byHour':
          value =
            this.data[key].counts.LosAngeles[metric][selectedValue + ''] || 0;
          if (value !== 0) {
            array.push({ name: this.data[key].key, value });
          }
          break;
        case 'byDayAndHour':
          value =
            this.data[key].counts.LosAngeles.byDayAndHour &&
            this.data[key].counts.LosAngeles.byDayAndHour[this.selectedDay]
              ? this.data[key].counts.LosAngeles.byDayAndHour[
                  String(this.selectedDay)
                ][String(this.selectedHour)]
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
