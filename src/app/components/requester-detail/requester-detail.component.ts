import { Component, Input, OnInit } from '@angular/core';
import { ChartService } from '../../services/chart.service';
import { Chart } from '../base/base.component';
import { ChartConstant } from '../../constant';

@Component({
  selector: 'app-requester-detail',
  templateUrl: './requester-detail.component.html',
  styleUrls: ['./requester-detail.component.scss'],
})
export class RequesterDetailComponent implements OnInit {
  @Input() key = '';
  @Input() label = '';
  chartsList: Chart[] = [
    {
      label: 'Top 10 Requester By Day',
      key: 'top10RequestersByDay',
    },
    {
      label: 'Top 10 Requester By Hour',
      key: 'top10RequestersByHour',
    },
    {
      label: 'Top 10 Requester By Day And Hour',
      key: 'top10RequestersByDayAndHour',
    },
  ];
  @Input() chartDetail: any = {};
  dayList: any[] = ChartConstant.dayList;
  hoursList: any[] = ChartConstant.hoursList;
  chartType = ChartConstant.chartType;
  hourCount: number[] = ChartConstant.hourCount;
  selectedHour = this.hoursList[0].value;
  selectedDay = this.dayList[0].id;
  chartLegend = true;
  barChartPlugins = [];
  hourChartLabels: string[] = ChartConstant.hourChartLabels;
  chartData: any[] = [
    {
      data: [],
      label: '',
      backgroundColor: this.chartService.customizeColors([]),
    },
  ];
  dayChartLabels: string[] = ChartConstant.dayChartLabels;
  chartOptions = ChartConstant.chartOptions;
  @Input() filterKey = '';
  dayCount = ChartConstant.dayCount;
  constructor(private chartService: ChartService) {}

  ngOnInit(): void {
    const currentDate = new Date();
    currentDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
    const numericDayOfWeekInLosAngeles = currentDate.getDay();
    const numericHourInLosAngeles = currentDate.getHours();
    const day = this.dayList.find((item) => item.id === numericDayOfWeekInLosAngeles).id;
    this.selectedDay = day;
    const hour = this.hoursList.find(
      (item) => String(item.value) === String(numericHourInLosAngeles)
    ).value;
    this.selectedHour = hour;
    this.prepareChartData();
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
    this.chartData = [
      {
        data: [],
        label: ' Hour Wise Percentage',
        backgroundColor: [],
      },
    ];
    const array: any[] = [];
    if (Array.isArray(this.chartDetail.LosAngeles.byHour)) {
      this.hourCount.forEach((item: any, index) => {
        array.push(this.chartDetail.LosAngeles.byHour[index] || 0);
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

      this.chartData[0].data = newArray;
      this.chartData[0].label = 'Hour Wise percentage';
      this.chartData[0].backgroundColor = '#1074f6';
    }
  }

  prepareChartData() {
    this.chartData = [
      {
        data: [],
        label: this.getMainChartLabel(),
        backgroundColor: [],
      },
    ];
    let array: any[] = [];
    const newArray: number[] = [];
    switch (this.filterKey) {
      case 'top10RequestersByDay':
        if (this.chartDetail && this.chartDetail.LosAngeles.byDay) {
          this.dayCount.forEach((_, index) => {
            array.push(this.chartDetail.LosAngeles.byDay[index] || 0);
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
          this.chartData[0].label = 'Day Wise percentage';
          this.chartData[0].backgroundColor = '#1074f6';
        }
        break;
      case 'top10RequestersByHour':
        if (this.chartDetail && this.chartDetail.LosAngeles.byHour) {
          this.hourCount.forEach((_, index) => {
            array.push(this.chartDetail.LosAngeles.byHour[index] || 0);
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
          this.chartData[0].label = 'Hour Wise percentage';
          this.chartData[0].backgroundColor = '#1074f6';
        }

        break;
      case 'top10RequestersByDayAndHour':
        this.chartData[0].data = [];
        array = [];
        this.dayCount.forEach((day) => {
          if (
            this.chartDetail &&
            this.chartDetail.LosAngeles.byDayAndHour[day] &&
            day === this.selectedDay
          ) {
            let sum: any = 0;
            let selectedDay = this.chartDetail.LosAngeles.byDayAndHour[day];
            if (Array.isArray(selectedDay)) {
              sum = selectedDay.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
              );
            } else {
              sum = Object.values(selectedDay).reduce(
                (accumulator: number, currentValue: number) =>
                  accumulator + currentValue
              );
              selectedDay = Array.from(
                { length: 24 },
                (_, index) => selectedDay[index] || 0
              );
            }
            array = selectedDay.map((number) =>
              Number((number / sum) * 100).toFixed(2)
            );
          } else {
            array.push(0);
          }
        });
        this.chartData[0].data = array;
        this.chartData[0].backgroundColor = '#1074f6';
        break;
    }
  }
}

