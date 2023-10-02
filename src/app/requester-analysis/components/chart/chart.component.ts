import { Component, Input } from '@angular/core';
import 'chart.js';
import { ChartConstant } from '../../../constant';
import { ChartService } from '../../../services/chart.service';

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
  @Input() metric = 'byDay';
  @Input() presenceType = 'accept';
  @Input() selectedFilter: string = '';
  @Input() width = '';

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

  constructor(private chartService: ChartService) {}

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
        this.chartService.requesterList.next(topList);
        break;
    }
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
