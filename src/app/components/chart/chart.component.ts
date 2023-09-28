import { Component, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { ChartService } from '../../services/chart.service';
import 'chart.js';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartConstant } from '../../constant';
let topRequestersByDay = [];
let topRequestersByHour = [];
let topRequestersByDayAndHour = [];
let topRequestersByDayForSubmit = [];
let topRequestersByHourForSubmit = [];
let topRequestersByDayAndHourForSubmit = [];

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
  reactionList: any[] = ChartConstant.reactionList
  chartType = ChartConstant.barChartType;

  @Input() label: string = '';
  @Input() xAxisLabels: string[] = [];
  @Input() isShow=false
  @Input() employeersList: any[] = [];
  @Input() key = 'byDay';
  @Input() presenceType = 'accept';
  @Input() selectedFilter: string = '';

  id = '';
  requesterList: any[] = [];
  databasePath = '';
  selectedHour = '';
  selectedDay = '';
  acceptData: any = [];
  submitData: any[] = [];
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

    if (
      this.key.indexOf('top') === -1
    ) {
      this.acceptData = await this.chartService
        .getAcceptCounts(this.key);
      
      console.log(this.acceptData);

      this.submitData = await  this.chartService
          .getSubmitCounts(this.key)
    }
    switch (this.key) {
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
          this.prepareTopRequester();
        }, 3000);

        break;

      case ChartConstant.filterType.topRequestersByDayForSubmit:
      case ChartConstant.filterType.topRequestersByHourForSubmit:
      case ChartConstant.filterType.topRequestersByDayAndHourForSubmit:
        setTimeout(() => {
          this.prepareTopRequesterForSubmit();
        }, 3000);

        break;
    }
    this.id = this.route.snapshot.params['id'];
  }

  onTypeChange() {
    const type = this.key.includes('ByDayAndHour')
      ? 'byDayAndHour'
      : this.key.includes('ByHour')
      ? 'hour'
      : 'day';
    if (type === 'day' && this.presenceType === 'submit') {
      this.key = 'topRequestersByDayForSubmit';
      this.prepareTopRequesterForSubmit();
    } else if (type === 'day' && this.presenceType === 'accept') {
      this.key = 'topRequestersByDay';
      this.prepareTopRequester();
    } else if (type === 'hour' && this.presenceType === 'submit') {
      this.key = 'topRequestersByHourForSubmit';
      this.prepareTopRequesterForSubmit();
    } else if (type === 'hour' && this.presenceType === 'accept') {
      this.key = 'topRequestersByHour';
      this.prepareTopRequester();
    }
    else if (type === 'byDayAndHour' && this.presenceType === 'submit') {
      this.key = 'topRequestersByDayAndHourForSubmit';
      this.prepareTopRequesterForSubmit();
    }
    else if (type === 'byDayAndHour' && this.presenceType === 'accept') {
      this.key = 'topRequestersByDayAndHour';
      this.prepareTopRequester();
    }
    if(this.presenceType==='submit'){
    this.label = this.label.replace('Submit',this.presenceType.toUpperCase());
    }else{
      this.label = this.label.replace('Accept',this.presenceType.toUpperCase());
    }

  }

  prepareTopRequester() {
    this.requesterList = [];
    let data = [];
    const requestersResult = [];
    if (this.key === ChartConstant.filterType.topRequestersByDay) {
      data = topRequestersByDay[this.selectedDay];
    } else if (this.key === ChartConstant.filterType.topRequestersByHour) {
      data = topRequestersByHour[this.selectedHour];
    } else if (
      this.key === ChartConstant.filterType.topRequestersByDayAndHour
    ) {
      data =
        topRequestersByDayAndHour[this.selectedDay] &&
        topRequestersByDayAndHour[this.selectedDay][this.selectedHour]
          ? topRequestersByDayAndHour[this.selectedDay][this.selectedHour]
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
    if (this.requesterList.length > 0) {
      const totalRequestersCount = this.requesterList
        .map((item) => item.value)
        .reduce((a, b) => a + b);
      this.requesterList.forEach((item) => {
        item.acceptPercentage =
          Number((item.value / totalRequestersCount) * 100).toFixed(2) + '%';
      });
    }
    this.mappedNameForEmployer();
  }

  prepareTopRequesterForSubmit() {
    this.requesterList = [];
    let data = [];
    const requestersResult = [];
    if (this.key === ChartConstant.filterType.topRequestersByDayForSubmit) {
      data = topRequestersByDayForSubmit[this.selectedDay];
    } else if (
      this.key === ChartConstant.filterType.topRequestersByHourForSubmit
    ) {
      data = topRequestersByHourForSubmit[this.selectedHour];
    } else if (
      this.key === ChartConstant.filterType.topRequestersByDayAndHourForSubmit
    ) {
      data =
        topRequestersByDayAndHourForSubmit[this.selectedDay] &&
        topRequestersByDayAndHourForSubmit[this.selectedDay][
          this.selectedHour
        ]
          ? topRequestersByDayAndHourForSubmit[this.selectedDay][
              this.selectedHour
            ].counts
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
    if (this.requesterList.length > 0) {
      const totalRequestersCount = this.requesterList
        .map((item) => item.value)
        .reduce((a, b) => a + b);
      this.requesterList.forEach((item) => {
        item.acceptPercentage =
          Number((item.value / totalRequestersCount) * 100).toFixed(2) + '%';
      });
    }
    this.mappedNameForEmployer();
  }

  mappedNameForEmployer(key = 'name') {
    this.requesterList.forEach((requester) => {
      const index = this.employeersList.findIndex(
        (item) => item.key === requester[key]
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
      } else {
        requester.requestersName = requester[key];
      }
    });
  }

  onDayChange() {
    switch (this.key) {
      case ChartConstant.filterType.topRequestersByDay:
      case ChartConstant.filterType.topRequestersByHour:
      case ChartConstant.filterType.topRequestersByDayAndHour:
        this.prepareTopRequester();
        break;

      case ChartConstant.filterType.topRequestersByDayForSubmit:
      case ChartConstant.filterType.topRequestersByHourForSubmit:
      case ChartConstant.filterType.topRequestersByDayAndHourForSubmit:
        this.prepareTopRequesterForSubmit();
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
    switch (this.key) {
      case 'byDayAndHour':
        this.prepareChart();
        break;
      case ChartConstant.filterType.topRequestersByDay:
      case ChartConstant.filterType.topRequestersByHour:
      case ChartConstant.filterType.topRequestersByDayAndHour:
        this.prepareTopRequester();
        break;
      case ChartConstant.filterType.topRequestersByDayForSubmit:
      case ChartConstant.filterType.topRequestersByHourForSubmit:
      case ChartConstant.filterType.topRequestersByDayAndHourForSubmit:
        this.prepareTopRequesterForSubmit();
        break;
    }
  }

  calculateTopRequesters() {
    let array: any = [];
    let value;
    const metric = this.key.replace('topRequestersBy', 'by');
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

    this.chartData[0].data = this.prepareDataForChart(this.acceptData, 'Accept');
    this.chartData[0].backgroundColor = '#1074f6';
    this.chartData[1].data = this.prepareDataForChart(
      this.submitData,
      'Submit'
    );
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

  prepareDataForChart(data?, filterKey?) {
    switch (this.key) {
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
          topRequestersByDayAndHour = data;
        } else {
          topRequestersByDayAndHourForSubmit = data;
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
    const periodList = this.key === 'byDay' ? this.dayCount : this.hourCount;
    periodList.forEach((period) => {
      const index = data.findIndex((item: any) => item.key === String(period));
      if (index > -1) {
        let total = 0;
        if (this.key === 'byDay') {
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
    if (this.key === 'byDay' && filterkey === 'Accept') {
      topRequestersByDay = dayWiseRequesterCounts;
    }
    if (this.key === 'byDay' && filterkey === 'Submit') {
      topRequestersByDayForSubmit = dayWiseRequesterCounts;
    } else if (this.key === 'byHour' && filterkey === 'Accept') {
      topRequestersByHour = hoursWiseRequestersCounts;
    } else {
      topRequestersByHourForSubmit = hoursWiseRequestersCounts;
    }
    return array;
  }
}


// TODO: In "ByPresence" view, For the "Top Requesters By Day & Hour" table, there are three select options. Increase the width of the table to match the width of the total width of 3 select options. Also, experiment If other tables need to be increased in width to improve the UI or only increasing the width of "Top Requesters By Day & Hour" table keeps the aesthetics of the whole base component good.

//TODO: Set min-width:480px instead of width for the table to avoid the table from shrinking too much when multiple tables are shown on the same row.

//TODO: Show only top 100 requesters on the table for byDay, byHour and byDayAndHour charts.

//TODO: Replace View Chart button with "Requester Detail" button.
