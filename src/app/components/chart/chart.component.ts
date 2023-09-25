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
let top10RequestersByDayForSubmit = [];
let top10RequestersByHourForSubmit = [];
let top10RequestersByDayAndHourForSubmit = [];

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
  @Input() isShow=false
  @Input() employeersList: any[] = [];
  hourChartLabels: string[] = ChartConstant.hourChartLabels;
  id = '';
  @Input() requesterType = 'accept';
  @Input() selectedFilter: string = '';
  reactionList: any[] = [
    {
      name: 'Angry',
      id: 'angry',
    },
    {
      name: 'Love',
      id: 'love',
    },
    {
      name: 'Party',
      id: 'party',
    },
    {
      name: 'Sad',
      id: 'sad',
    },
    {
      name: 'Thumbs Down',
      id: 'thumbs_down',
    },
    {
      name: 'Thumbs Up',
      id: 'thumbs_up',
    },
  ];
  selectedReaction = this.reactionList[0].id;
  dayList: any[] = ChartConstant.dayList;
  hoursList: any[] = ChartConstant.hoursList;
  barChartType = ChartConstant.chartType;
  hourCount: number[] = ChartConstant.hourCount;
  @Input() key = 'byDay';
  databasePath = '';
  selectedHour = '';
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
    this.data = [];
    this.databasePath =
      this.key.indexOf('top10') > -1
        ? 'byRequesterID'
        : this.key === 'byDayAndHourForAllRequesters'
        ? `byDayAndHour/LosAngeles`
        : `${this.key}/LosAngeles`;

    if (
      this.databasePath !== 'byRequesterID' &&
      this.key !== 'top100RequestersByWageRate' &&
      this.key !== 'top10RequestersByDayReactions'
    ) {
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
    } else if (
      this.key === 'top100RequestersByWageRate' ||
      this.key === 'top100RequestersByDayReactions'
    ) {
      const databasePath =
        this.key === 'top100RequestersByWageRate' ? 'reqs' : 'reacts/requester';
      this.data = await firstValueFrom(
        this.chartService
          .getOthersEmployeeData(databasePath)
          .snapshotChanges()
          .pipe(
            map((changes) =>
              changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
            )
          )
      );
    }
    switch (this.key) {
      case 'byDay':
      case 'byHour':
      case 'byDayAndHour':
      case 'byDayAndHourForAllRequesters':
        this.prepareChart();
        break;
      case 'top100RequestersByWageRate':
      case 'top100RequestersByDayReactions':
        this.prepareDataForTop100Requesters();
        break;
      case 'top10RequestersByDay':
      case 'top10RequestersByHour':
      case 'top10RequestersByDayAndHour':
        setTimeout(() => {
          this.prepareTop10Requester();
        }, 3000);

        break;

      case ChartConstant.filterType.top10RequestersByDayForSubmit:
      case ChartConstant.filterType.top10RequestersByHourForSubmit:
      case ChartConstant.filterType.top10RequestersByDayAndHourForSubmit:
        setTimeout(() => {
          this.prepareTop10RequesterForSubmit();
        }, 3000);

        break;
    }
    this.id = this.route.snapshot.params['id'];
  }

  onTypeChange() {
    console.log(this.key);
    const type = this.key.includes('ByDayAndHour')
      ? 'byDayAndHour'
      : this.key.includes('ByHour')
      ? 'hour'
      : 'day';
    if (type === 'day' && this.requesterType === 'submit') {
      this.key = 'top10RequestersByDayForSubmit';
      this.prepareTop10RequesterForSubmit();
    } else if (type === 'day' && this.requesterType === 'accept') {
      this.key = 'top10RequestersByDay';
      this.prepareTop10Requester();
    } else if (type === 'hour' && this.requesterType === 'submit') {
      this.key = 'top10RequestersByHourForSubmit';
      this.prepareTop10RequesterForSubmit();
    } else if (type === 'hour' && this.requesterType === 'accept') {
      this.key = 'top10RequestersByHour';
      this.prepareTop10Requester();
    }
    else if (type === 'byDayAndHour' && this.requesterType === 'submit') {
      this.key = 'top10RequestersByDayAndHourForSubmit';
      this.prepareTop10RequesterForSubmit();
    }
    else if (type === 'byDayAndHour' && this.requesterType === 'accept') {
      this.key = 'top10RequestersByDayAndHour';
      this.prepareTop10Requester();
    }
    if(this.requesterType==='submit'){
    this.label = this.label.replace('Submit',this.requesterType.toUpperCase());
    }else{
      this.label = this.label.replace('Accept',this.requesterType.toUpperCase());
    }

  }
  prepareDataForTop100Requesters() {
    if (this.key === 'top100RequestersByWageRate') {
      this.requesterList = this.data
        .sort((a, b) => b.wageRate - a.wageRate)
        .slice(0, 100);
    } else {
      this.requesterList = this.data
        .sort(
          (a, b) =>
            b.summary[this.selectedReaction] - a.summary[this.selectedReaction]
        )
        .filter((item) => item.summary[this.selectedReaction] !== 0);
      this.mappedNameForEmployer('key');
    }
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

  prepareTop10RequesterForSubmit() {
    this.requesterList = [];
    let data = [];
    const requestersResult = [];
    if (this.key === ChartConstant.filterType.top10RequestersByDayForSubmit) {
      data = top10RequestersByDayForSubmit[this.selectedDay];
    } else if (
      this.key === ChartConstant.filterType.top10RequestersByHourForSubmit
    ) {
      data = top10RequestersByHourForSubmit[this.selectedHour];
    } else if (
      this.key === ChartConstant.filterType.top10RequestersByDayAndHourForSubmit
    ) {
      data =
        top10RequestersByDayAndHourForSubmit[this.selectedDay] &&
        top10RequestersByDayAndHourForSubmit[this.selectedDay][
          this.selectedHour
        ]
          ? top10RequestersByDayAndHourForSubmit[this.selectedDay][
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
      case ChartConstant.filterType.top10RequestersByDay:
      case ChartConstant.filterType.top10RequestersByHour:
      case ChartConstant.filterType.top10RequestersByDayAndHour:
        this.prepareTop10Requester();
        break;

      case ChartConstant.filterType.top10RequestersByDayForSubmit:
      case ChartConstant.filterType.top10RequestersByHourForSubmit:
      case ChartConstant.filterType.top10RequestersByDayAndHourForSubmit:
        this.prepareTop10RequesterForSubmit();
        break;
      case ChartConstant.filterType.byDayAndHourForAllRequesters:
        this.prepareChart();
        break;
    }
  }

  getRequesterDetail(item, key = 'name', query = 'requestersName') {
    console.log(item);
    this.router.navigate([`/requester-analysis/${item[key]}`], {
      queryParams: { name: item[query] },
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
      case ChartConstant.filterType.top10RequestersByDayForSubmit:
      case ChartConstant.filterType.top10RequestersByHourForSubmit:
      case ChartConstant.filterType.top10RequestersByDayAndHourForSubmit:
        this.prepareTop10RequesterForSubmit();
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

    this.chartData[0].data = this.prepareDataForChart(this.data, 'Accept');
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
          top10RequestersByDayAndHour = data;
        } else {
          top10RequestersByDayAndHourForSubmit = data;
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
    data: any = this.data,
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
      top10RequestersByDay = dayWiseRequesterCounts;
    }
    if (this.key === 'byDay' && filterkey === 'Submit') {
      top10RequestersByDayForSubmit = dayWiseRequesterCounts;
    } else if (this.key === 'byHour' && filterkey === 'Accept') {
      top10RequestersByHour = hoursWiseRequestersCounts;
    } else {
      top10RequestersByHourForSubmit = hoursWiseRequestersCounts;
    }
    return array;
  }
}

//TODO: Modify tables to incorporate data for both accept and submit time. The data for submit time will be queried from 'req_pre_by_submit_time' endpoint on firebase. The sample data for submit time is available in the assets folder. Use percentages instead of count in the table.
