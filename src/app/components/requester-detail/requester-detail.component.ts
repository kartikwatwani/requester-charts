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
      key: 'topRequestersByDay',
    },
    {
      label: 'Top 10 Requester By Hour',
      key: 'topRequestersByHour',
    },
    {
      label: 'Top 10 Requester By Day And Hour',
      key: 'topRequestersByDayAndHour',
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
  @Input() submitData: any = {};
  dayCount = ChartConstant.dayCount;
  constructor(private chartService: ChartService) {}

  ngOnInit(): void {
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
    this.prepareData();
  }

  prepareData() {
    this.chartData = [
      {
        data: this.prepareChartData(this.chartDetail),
        label: 'By Accept',
        backgroundColor: '#1074f6',
      },
      {
        data: this.prepareChartData(this.submitData),
        label: 'By Submit',
        backgroundColor: 'orange',
      },
    ];
  }

  getMainChartLabel() {
    switch (this.filterKey) {
      case 'topRequestersByDay':
        return 'Day Wise Percentage';
      case 'topRequestersByHour':
        return 'Hour Wise Percentage';
      case 'topRequestersByDayAndHour':
        return 'Day and Hour Wise Percentage';
    }
  }

  prepareChartData(chartDetail) {
    let array: any[] = [];
    const newArray: number[] = [];
    switch (this.filterKey) {
      case 'topRequestersByDay':
        if (chartDetail && chartDetail.LosAngeles.byDay) {
          this.dayCount.forEach((_, index) => {
            array.push(chartDetail.LosAngeles.byDay[index] || 0);
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
        }
        return array;
      case 'topRequestersByHour':
        if (chartDetail && chartDetail.LosAngeles.byHour) {
          this.hourCount.forEach((_, index) => {
            array.push(chartDetail.LosAngeles.byHour[index] || 0);
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
        }
        return array;
      case 'topRequestersByDayAndHour':
        this.chartData[0].data = [];
        array = [];
        this.dayCount.forEach((day) => {
          if (
            chartDetail &&
            chartDetail.LosAngeles.byDayAndHour[day] &&
            day === this.selectedDay
          ) {
            let sum: any = 0;
            let selectedDay = chartDetail.LosAngeles.byDayAndHour[day];
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
        return array;
    }
  }
}
