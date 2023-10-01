import { Component, Input } from '@angular/core';

import { ChartService } from '../../services/chart.service';
import 'chart.js';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConstant } from '../../constant';

let topList = {
  byDay: {
    accept: [],
    submit: [],
  },
  byHour: {
    accept: [],
    submit: [],
  },
  byDayAndHour: {
    accept: [],
    submit: [],
  },
};
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent {
  chartOptions = ChartConstant.chartOptions;
  dayCount = ChartConstant.dayCount;
  dayList: any[] = ChartConstant.dayList;
  hoursList: any[] = ChartConstant.hoursList;
  hourCount: number[] = ChartConstant.hourCount;
  reactionList: any[] = ChartConstant.reactionsList;
  chartType = ChartConstant.barChartType;

  @Input() title: string = '';
  @Input() xAxisLabels: string[] = [];
  @Input() requesterIDToNameMapping: any = {};
  @Input() metric = 'byDay';
  @Input() presenceType = 'accept';
  @Input() selectedFilter: string = '';
  @Input() width = '';

  topRequestersList: any[] = [];
  selectedHour = '';
  selectedDay = '';
  acceptData: any = [];
  submitData: any[] = [];
  chartData: any[] = [
    {
      data: [],
      label: 'Day wise percentage',
      chartType: 'bar',
    },
  ];

  constructor(
    private chartService: ChartService,
    private router: Router
  ) {}

  ngOnInit() {
    const currentDate = new Date();
    currentDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
    const losAngelesTime = new Date().toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
    });
    const numericDayOfWeekInLosAngeles = currentDate.getDay();
    const numericHourInLosAngeles = new Date(losAngelesTime).getHours();
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
    this.acceptData = [];

    if (this.metric.indexOf('top') === -1) {
      this.acceptData = await this.chartService.getAcceptCounts(this.metric);
      this.submitData = await this.chartService.getSubmitCounts(this.metric);
    }
    switch (this.metric) {
      case 'byDay':
      case 'byHour':
      case 'byDayAndHour':
      case 'byDayAndHourForAllRequesters':
        this.prepareChart();
        break;
      case 'topRequestersByDay':
      case 'topRequestersByHour':
      case 'topRequestersByDayAndHour':
        setTimeout(() => {
          this.prepareTopRequesters();
        }, 3000);

        break;

      case ChartConstant.filterType.topRequestersByDayForSubmit:
      case ChartConstant.filterType.topRequestersByHourForSubmit:
      case ChartConstant.filterType.topRequestersByDayAndHourForSubmit:
        setTimeout(() => {
          this.prepareTopRequesters();
        }, 3000);

        break;
    }

  }

  onTypeChange() {
    const type = this.metric.includes('ByDayAndHour')
      ? 'byDayAndHour'
      : this.metric.includes('ByHour')
      ? 'hour'
      : 'day';
    if (
      type === 'day' &&
      this.presenceType === ChartConstant.tableTypes.submit
    ) {
      this.metric = 'topRequestersByDayForSubmit';
      this.prepareTopRequesters();
    } else if (
      type === 'day' &&
      this.presenceType === ChartConstant.tableTypes.accept
    ) {
      this.metric = 'topRequestersByDay';
      this.prepareTopRequesters();
    } else if (
      type === 'hour' &&
      this.presenceType === ChartConstant.tableTypes.submit
    ) {
      this.metric = 'topRequestersByHourForSubmit';
      this.prepareTopRequesters();
    } else if (
      type === 'hour' &&
      this.presenceType === ChartConstant.tableTypes.accept
    ) {
      this.metric = 'topRequestersByHour';
      this.prepareTopRequesters();
    } else if (
      type === 'byDayAndHour' &&
      this.presenceType === ChartConstant.tableTypes.submit
    ) {
      this.metric = 'topRequestersByDayAndHourForSubmit';
      this.prepareTopRequesters();
    } else if (
      type === 'byDayAndHour' &&
      this.presenceType === ChartConstant.tableTypes.accept
    ) {
      this.metric = 'topRequestersByDayAndHour';
      this.prepareTopRequesters();
    }
    if (this.presenceType === ChartConstant.tableTypes.submit) {
      this.title = this.title.replace(
        'Submit',
        this.presenceType.toUpperCase()
      );
    } else {
      this.title = this.title.replace(
        'Accept',
        this.presenceType.toUpperCase()
      );
    }
  }

  prepareTopRequesters() {
    this.topRequestersList = [];
    let data = [];
    const requestersResult = [];
    if (this.presenceType === ChartConstant.tableTypes.accept) {
      if (this.metric === ChartConstant.filterType.topRequestersByDay) {
        data = topList.byDay.accept[this.selectedDay];
      } else if (this.metric === ChartConstant.filterType.topRequestersByHour) {
        data = topList.byHour.accept[this.selectedHour];
      } else if (
        this.metric === ChartConstant.filterType.topRequestersByDayAndHour
      ) {
        data =
          topList.byDayAndHour.accept[this.selectedDay] &&
          topList.byDayAndHour.accept[this.selectedDay][this.selectedHour]
            ? topList.byDayAndHour.accept[this.selectedDay][this.selectedHour]
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
      this.topRequestersList = requestersResult.slice(0, 100);
      if (this.topRequestersList.length > 0) {
        const totalRequestersCount = this.topRequestersList
          .map((item) => item.value)
          .reduce((a, b) => a + b);
        this.topRequestersList.forEach((item) => {
          item.acceptPercentage =
            Number((item.value / totalRequestersCount) * 100).toFixed(2) + '%';
        });
      }
    } else {
      if (this.metric === ChartConstant.filterType.topRequestersByDayForSubmit) {
        data = topList.byDay.submit[this.selectedDay];
      } else if (
        this.metric === ChartConstant.filterType.topRequestersByHourForSubmit
      ) {
        data = topList.byHour.submit[this.selectedHour];
      } else if (
        this.metric === ChartConstant.filterType.topRequestersByDayAndHourForSubmit
      ) {
        data =
          topList.byDayAndHour.submit[this.selectedDay] &&
          topList.byDayAndHour.submit[this.selectedDay][this.selectedHour]
            ? topList.byDayAndHour.submit[this.selectedDay][this.selectedHour]
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
      this.topRequestersList = requestersResult.slice(0, 100);
      if (this.topRequestersList.length > 0) {
        const totalRequestersCount = this.topRequestersList
          .map((item) => item.value)
          .reduce((a, b) => a + b);
        this.topRequestersList.forEach((item) => {
          item.acceptPercentage =
            Number((item.value / totalRequestersCount) * 100).toFixed(2) + '%';
        });
      }
    }
    this.mappedNameForRequesters();
  }

  mappedNameForRequesters() {
    this.topRequestersList.forEach((requester) => {
      requester.requestersName = this.requesterIDToNameMapping[requester.name];
    });
  }

  onDayChange() {
    switch (this.metric) {
      case ChartConstant.filterType.topRequestersByDay:
      case ChartConstant.filterType.topRequestersByHour:
      case ChartConstant.filterType.topRequestersByDayAndHour:
        this.prepareTopRequesters();
        break;

      case ChartConstant.filterType.topRequestersByDayForSubmit:
      case ChartConstant.filterType.topRequestersByHourForSubmit:
      case ChartConstant.filterType.topRequestersByDayAndHourForSubmit:
        this.prepareTopRequesters();
        break;
      case ChartConstant.filterType.byDayAndHourForAllRequesters:
        this.prepareChart();
        break;
    }
  }

  getRequesterDetail(item, key = 'name', query = 'requestersName') {
    this.router.navigate([`/requester-analysis/${item[key]}`], {
      queryParams: { name: item[query] },
    });
  }

  onHourChange() {
    switch (this.metric) {
      case 'byDayAndHour':
        this.prepareChart();
        break;
      case ChartConstant.filterType.topRequestersByDay:
      case ChartConstant.filterType.topRequestersByHour:
      case ChartConstant.filterType.topRequestersByDayAndHour:
        this.prepareTopRequesters();
        break;
      case ChartConstant.filterType.topRequestersByDayForSubmit:
      case ChartConstant.filterType.topRequestersByHourForSubmit:
      case ChartConstant.filterType.topRequestersByDayAndHourForSubmit:
        this.prepareTopRequesters();
        break;
    }
  }

  calculateTopRequesters() {
    let array: any = [];
    let value;
    const metric = this.metric.replace('topRequestersBy', 'by');
    Object.keys(this.acceptData).forEach((key) => {
      const counts = this.acceptData[key].counts.LosAngeles;
      let selectedValue =
        metric === 'byDay' ? this.selectedDay : this.selectedHour;
      switch (metric) {
        case 'byDay':
        case 'byHour':
          value = counts[metric][selectedValue + ''] || 0;
          if (value !== 0) {
            array.push({ name: this.acceptData[key].key, value });
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
            array.push({ name: this.acceptData[key].key, value: value });
          }
      }
    });

    array = array.sort((a: any, b: any) => b.value - a.value);
    this.topRequestersList = array.slice(0, 10);
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

    this.chartData[0].data = this.prepareDataForChart(
      this.acceptData,
      'Accept'
    );
    this.chartData[0].backgroundColor = '#1074f6';
    this.chartData[1].data = this.prepareDataForChart(
      this.submitData,
      'Submit'
    );
    this.chartData[1].backgroundColor = 'orange';
  }

  getMainChartLabel(value = 'By Accept') {
    switch (this.metric) {
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

  prepareDataForChart(data?, filterKey?) {
    switch (this.metric) {
      case 'byDay':
      case 'byHour':
        const totalTasksForEachPeriod =
          this.calculateTotalTasksPerPeriodForRequesters(data, filterKey);
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
        if (filterKey === 'Accept') {
          topList.byDayAndHour.accept = data;
        } else {
          topList.byDayAndHour.submit = data;
        }
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

  calculateTotalTasksPerPeriodForRequesters(
    data: any = this.acceptData,
    filterkey = 'Accept'
  ) {
    const array: any = [];
    const dayWiseRequesterCounts: any[] = [];
    const hoursWiseRequestersCounts: any[] = [];
    const periodList = this.metric === 'byDay' ? this.dayCount : this.hourCount;
    periodList.forEach((period) => {
      const index = data.findIndex((item: any) => item.key === String(period));
      if (index > -1) {
        let total = 0;
        if (this.metric === 'byDay') {
          dayWiseRequesterCounts.push(data[index].counts);
        } else {
          hoursWiseRequestersCounts.push(data[index].counts);
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
    if (this.metric === 'byDay' && filterkey === 'Accept') {
      topList.byDay.accept = dayWiseRequesterCounts;
    }
    if (this.metric === 'byDay' && filterkey === 'Submit') {
      topList.byDay.submit = dayWiseRequesterCounts;
    } else if (this.metric === 'byHour' && filterkey === 'Accept') {
      topList.byHour.accept = hoursWiseRequestersCounts;
    } else {
      topList.byHour.submit = hoursWiseRequestersCounts;
    }
    return array;
  }
}

//TODO: Separate Chart and table component.