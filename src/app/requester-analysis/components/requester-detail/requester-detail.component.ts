import { Component, Input, OnInit } from '@angular/core';
import { ChartConstant } from '../../../constant';
import { ChartService } from '../../../services/chart.service';
let mostActiveDay = '';
let mostActiveHour = '';

@Component({
  selector: 'app-requester-detail',
  templateUrl: './requester-detail.component.html',
  styleUrls: ['./requester-detail.component.scss'],
})
export class RequesterDetailComponent implements OnInit {
  dayList: any[] = ChartConstant.dayList;
  hoursList: any[] = ChartConstant.hoursList;
  chartType = ChartConstant.barChartType;
  hourCount: number[] = ChartConstant.hourCount;
  dayCount = ChartConstant.dayCount;
  chartOptions = ChartConstant.chartOptions;

  @Input() title = '';
  @Input() metric = '';
  @Input() submitData: any = {};
  @Input() acceptData: any = {};
  @Input() xAxisLabels: any[];
  @Input() wageRateData: any = {};
  @Input() reactionsData: any = {};

  selectedHour = this.hoursList[0].value;
  selectedDay = this.dayList[0].id;
  chartLegend = true;
  mostActiveDay = '';
  mostActiveHour = '';
  chartData: any[] = [
    {
      data: [],
      label: '',
      backgroundColor: [],
    },
  ];

  constructor(private chartService: ChartService) {}

  ngOnInit(): void {
    this.chartService.employeerData.subscribe((res) => {
      setTimeout(() => {
        this.mostActiveDay = res.mostActiveDay;
        this.mostActiveHour = res.mostActiveHour;
      }, 100);
    });
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
        data: this.prepareChartData(this.acceptData),
        label: 'By Accept',
        backgroundColor: '#1074f6',
      },
      {
        data: this.prepareChartData(this.submitData),
        label: 'By Submit',
        backgroundColor: 'orange',
      },
    ];

    if (this.metric === 'byDay' || this.metric === 'byHour') {
      const array = this.chartData.map((item) => item.data);
      if (array.length > 0) {
        const array1 = array[0];
        const array2 = array[1];
        const resultArray = [];
        if (array1.length > 0 && array2.length > 0) {
          for (let i = 0; i < array1.length; i++) {
            resultArray.push(array1[i] + array2[i]);
          }
        }
        const maxValue = Math.max(...resultArray);
        const indexOfMaxValue = resultArray.indexOf(maxValue);
        if (this.metric === 'byDay') {
          mostActiveDay = this.dayList[indexOfMaxValue].name;
        } else {
          mostActiveHour = this.hoursList[indexOfMaxValue].name;
        }
        this.chartService.employeerData.next({ mostActiveDay, mostActiveHour });
      }
    }
  }

  getMainChartLabel() {
    switch (this.metric) {
      case 'byDay':
        return 'Day Wise Percentage';
      case 'byHour':
        return 'Hour Wise Percentage';
      case 'byDayAndHour':
        return 'Day and Hour Wise Percentage';
    }
  }

  prepareChartData(chartDetail) {
    let array: any[] = [];
    const newArray: number[] = [];
    switch (this.metric) {
      case 'byDay':
        if (chartDetail?.LosAngeles?.byDay) {
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
        return newArray;
      case 'byHour':
        if (chartDetail?.LosAngeles?.byHour) {
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
        return newArray;
      case 'byDayAndHour':
        this.chartData[0].data = [];
        array = [];
        this.dayCount.forEach((day) => {
          if (
            chartDetail?.LosAngeles?.byDayAndHour[day] &&
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
