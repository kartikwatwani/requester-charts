import { Component, Input } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { map } from 'rxjs/operators';
import { ChartService } from '../../services/chart.service';
import 'chart.js';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent {
  chartOptions: ChartOptions = {
    responsive: true,
  };
  barChartData:any={}
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
  @Input() label:string=''
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
  id=''

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
  @Input()key = 'byDay';
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

  constructor(private chartService: ChartService,    private route: ActivatedRoute) {}

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
    this.id=this.route.snapshot.params['id']
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
    const newArray=[];
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
