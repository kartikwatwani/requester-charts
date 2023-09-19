import { Component, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { ChartService } from '../../services/chart.service';
import 'chart.js';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConstant } from '../../constant';
let top10RequestersByDay = [];
let top10RequestersByHour = [];
let top10RequestersByDayAndHour = [];

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
  @Input() employeersList: any[] = [];
  hourChartLabels: string[] = ChartConstant.hourChartLabels;
  id = '';
  dayList: any[] = ChartConstant.dayList;
  hoursList: any[] = ChartConstant.hoursList;
  barChartType = ChartConstant.chartType;
  hourCount: number[] = ChartConstant.hourCount;
  @Input() key = 'byDay';
  databasePath = '';
  selectedHour = '';
  // selectedHour = this.hoursList.find(item=>item.id===new Date().getDate).id;
  selectedDay = '';
  data: any = [];
  submitData: any[] = [];
  dayWiseRequesterCounts: any = [];
  hoursWiseRequestersCounts: any = [];
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
    const currentDate = new Date();
    currentDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
    const numericDayOfWeekInLosAngeles = currentDate.getDay();
    const numericHourInLosAngeles = currentDate.getHours();
    const day = this.dayList.find(
      (item) => item.id === numericDayOfWeekInLosAngeles
    ).id;
    this.selectedDay = day;
    const hour = this.hoursList.find(
      (item) => String(item.value) === String(numericHourInLosAngeles)
    ).value;
    this.selectedHour = hour;
    this.getData();
  }

  async getData() {
    this.data = [];
    this.databasePath =
      this.key.indexOf('top10') > -1
        ? 'byRequesterID'
        : this.key === 'byDayAndHourForAllRequesters'
        ? `byDayAndHour/LosAngeles`
        : `${this.key}/LosAngeles`;
    if (this.databasePath !== 'byRequesterID') {
      this.data = await firstValueFrom(
        this.chartService
          .getAll(this.databasePath)
          .snapshotChanges()
          .pipe(
            map((changes) =>
              changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
            )
          )
      );
      this.submitData = await firstValueFrom(
        this.chartService
          .getAllSubmitCount(this.databasePath)
          .snapshotChanges()
          .pipe(
            map((changes) =>
              changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
            )
          )
      );
      console.log(this.submitData);
      console.log(this.data);
    }
    switch (this.key) {
      case 'byDay':
      case 'byHour':
      case 'byDayAndHour':
      case 'byDayAndHourForAllRequesters':
        this.prepareChart();
        break;
      case 'top10RequestersByDay':
      case 'top10RequestersByHour':
      case 'top10RequestersByDayAndHour':
        setTimeout(() => {
          this.prepareTop10Requester();
        }, 2500);

        break;
    }
    this.id = this.route.snapshot.params['id'];
  }

  prepareTop10Requester() {
    this.requesterList = [];
    let data = [];
    const requestersResult = [];
    if (this.key === ChartConstant.filterType.top10RequestersByDay) {
      data = top10RequestersByDay[this.selectedDay];
    } else if (this.key === ChartConstant.filterType.top10RequestersByHour) {
      data = top10RequestersByHour[this.selectedHour];
    } else if (
      this.key === ChartConstant.filterType.top10RequestersByDayAndHour
    ) {
      data =
        top10RequestersByDayAndHour[this.selectedDay] &&
        top10RequestersByDayAndHour[this.selectedDay][this.selectedHour]
          ? top10RequestersByDayAndHour[this.selectedDay][this.selectedHour]
              .counts
          : {};
    }
    if (data) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          requestersResult.push({ name: key, value: data[key] });
        }
      }
    }
    requestersResult.sort((a, b) => b.value - a.value);
    this.requesterList = requestersResult;
    this.mappedNameForEmployer();
  }

  mappedNameForEmployer() {
    this.requesterList.forEach((requester) => {
      const index = this.employeersList.findIndex(
        (item) => item.key === requester.name
      );
      if (index > -1) {
        const obj = { ...this.employeersList[index] };
        delete obj.key;
        const values = Object.values(obj);
        let concatenatedString = values.join('').replace(/ +/g, ' ');
        if (concatenatedString.charAt(0) === ' ') {
          concatenatedString = concatenatedString.slice(1);
        }
        requester.requestersName = concatenatedString;
      }
    });
  }

  onDayChange() {
    switch (this.key) {
      case ChartConstant.filterType.top10RequestersByDay:
      case ChartConstant.filterType.top10RequestersByHour:
      case ChartConstant.filterType.top10RequestersByDayAndHour:
        this.prepareTop10Requester();
        break;
      case ChartConstant.filterType.byDayAndHourForAllRequesters:
        this.prepareChart();
        break;
    }
  }

  getRequesterDetail(item) {
    this.router.navigate([`/requester-analysis/${item.name}`], {
      queryParams: { name: item.requestersName },
    });
  }
  onHourChange() {
    switch (this.key) {
      case 'byDayAndHour':
        this.prepareChart();
        break;
      case ChartConstant.filterType.top10RequestersByDay:
      case ChartConstant.filterType.top10RequestersByHour:
      case ChartConstant.filterType.top10RequestersByDayAndHour:
        this.prepareTop10Requester();
        break;
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
        label: this.getMainChartLabel('By Accept'),
        backgroundColor: [],
        chartType: this.chartType,
      },
      {
        data: [],
        label: this.getMainChartLabel('By Submit'),
        backgroundColor: [],
        chartType: this.chartType,
      },
    ];

    this.chartData[0].data = this.prepareDataForChart(this.data);
    this.chartData[0].backgroundColor = '#1074f6';
    this.chartData[1].data = this.prepareDataForChart(this.submitData);
    this.chartData[1].backgroundColor = 'orange';
  }

  getMainChartLabel(value = 'By Accept') {
    switch (this.key) {
      case 'byDay':
        return value;
      case 'byHour':
        return value;
      case 'byDayAndHour':
        return value;
      case 'byDayAndHourForAllRequesters':
        return value;
    }
  }

  prepareDataForChart(data?) {
    switch (this.key) {
      case 'byDay':
      case 'byHour':
        const totalTasksForEachPeriod =
          this.calculateTotalTasksPerPeriodForRequesters(data);
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
        const totalHourCounts = data
          .map((item) => {
            return item[this.selectedHour].counts;
          })
          .reduce((total, currentObject) => {
            for (const key in currentObject) {
              if (currentObject.hasOwnProperty(key)) {
                total += currentObject[key];
              }
            }
            return total;
          }, 0);
        top10RequestersByDayAndHour = this.data;
        this.dayCount.forEach((day) => {
          const index = data.findIndex((item: any) => item.key === String(day));
          if (index > -1) {
            const selectedHourData: any = data[index][this.selectedHour];
            if (selectedHourData) {
              const selectedHourTotal: any = Object.values(
                selectedHourData.counts
              ).reduce(
                (acc: number, currentValue: number) => acc + currentValue
              );
              const percentageValue: any = Number(
                (selectedHourTotal / totalHourCounts) * 100
              ).toFixed(2);
              array.push(percentageValue);
            } else {
              array.push(0);
            }
          } else {
            array.push(0);
          }
        });
        return array;
      case 'byDayAndHourForAllRequesters':
        const newArray: number[] = [];
        const chartData = data[this.selectedDay];
        const totalCountOfHour = Object.values(chartData)
          .map((item: any) => {
            return item.counts;
          })
          .reduce((total, currentObject) => {
            for (const key in currentObject) {
              if (currentObject.hasOwnProperty(key)) {
                total += currentObject[key];
              }
            }
            return total;
          }, 0);
        Object.keys(chartData).forEach((key: any) => {
          const hourCount = chartData[key].counts;
          if (hourCount) {
            const selectedHourTotal: any = Object.values(hourCount).reduce(
              (acc: number, currentValue: number) => acc + currentValue,
              0
            );
            const percentageValue: any = Number(
              (selectedHourTotal / totalCountOfHour) * 100
            ).toFixed(2);
            newArray.push(percentageValue);
          }
        });
        return newArray;
    }
  }

  calculateTotalTasksPerPeriodForRequesters(data: any = this.data) {
    const array: any = [];

    const periodList = this.key === 'byDay' ? this.dayCount : this.hourCount;
    periodList.forEach((period) => {
      const index = data.findIndex((item: any) => item.key === String(period));
      if (index > -1) {
        let total = 0;
        if (this.key === 'byDay') {
          this.dayWiseRequesterCounts.push(data[index].counts);
        } else {
          this.hoursWiseRequestersCounts.push(data[index].counts);
        }
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
    if (this.key === 'byDay') {
      top10RequestersByDay = this.dayWiseRequesterCounts;
    } else if (this.key === 'byHour') {
      top10RequestersByHour = this.hoursWiseRequestersCounts;
    }
    return array;
  }
}

//TODO: Currently ID of the requester e.g. TPU3OO8KUVWDSZPV is visible in the top 10 table we need to replace it with the requester name. This data will be fetched from /req_id_to_name_mapping endpoint on firebase. sample data is availble in the assets folder.

//FIXME: For the select options of day and hour we need to use timezone of LosAngeles for current selection. that is,  when the app loads we want by default the select options to be current day and hour of Los Angeles Time Zone not Indian Time zone.

//TODO: Add all charts and tables for submit time like we have for accept time. The data will be queried from 'req_pre_by_submit_time' from firebase. The sample data for this is available in the assets folder. First try to incorpate the charts for byDay, byHour and byDayAndHour in the same chart for accept time by adding a bar for submit time. If it is not possible, then add charts and tables for submit time at the end of existing charts and tables by giving a heading "Requesters Analysis by Submit Time".
