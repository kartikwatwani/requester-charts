import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ChartService } from '../../services/chart.service';
import { Chart } from '../base/base.component';
import { ChartConstant } from '../../constant';

//TODO: In the older versions of ng-chart property binding [chartType] is mandatory in html file other wise chart doesn't show up. But in the latest version it is not mandatory. So, add [chartType]="chartType" in html file for canvas tag now and future charts that you create.

@Component({
  selector: 'app-requester-chart',
  templateUrl: './requester-chart.component.html',
  styleUrls: ['./requester-chart.component.scss'],
})
export class RequesterChartComponent implements OnInit {
  @Input() key = '';
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
    const day = this.dayList.find((item) => item.id === new Date().getDay()).id;
    this.selectedDay = day;
    const hour = this.hoursList.find(
      (item) => String(item.value) === String(new Date().getHours())
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
    //TODO: No "Count" at end in label key below only for Hour Wise Percentage. Change this for others also.
    this.chartData = [
      {
        data: [],
        label: ' Hour Wise Percentage Count',
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
      this.chartData[0].label = 'Hour Wise percentage count';
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
    const array: any[] = [];
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
          this.chartData[0].label = 'Day Wise percentage count';
          this.chartData[0].backgroundColor = '#1074f6';
        }
        break;
      case 'top10RequestersByHour':
        console.log( this.chartDetail.LosAngeles.byDayAndHour);

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
          this.chartData[0].label = 'Hour Wise percentage count';
          this.chartData[0].backgroundColor = '#1074f6';
        }

        break;
      case 'top10RequestersByDayAndHour':
        let count = 0;
        this.chartData[0].data = [];
        this.dayCount.forEach((day) => {
          if (
            this.chartDetail &&
            this.chartDetail.LosAngeles.byDayAndHour[day]
          ) {
            for (const key in this.chartDetail.LosAngeles.byDayAndHour[day]) {
              if (key === this.selectedHour) {
                let totalValue = 0;
                const currentHourTotal =
                  this.chartDetail.LosAngeles.byDayAndHour[day][key];
                Object.keys(this.chartDetail.LosAngeles.byDayAndHour).forEach(
                  (currentDay) => {
                    if (
                      String(day) !== String(currentDay) &&
                      this.chartDetail.LosAngeles.byDayAndHour[currentDay] &&
                      Number.isFinite(
                        this.chartDetail.LosAngeles.byDayAndHour[currentDay][
                          this.selectedHour
                        ]
                      )
                    ) {
                      totalValue +=
                        this.chartDetail.LosAngeles.byDayAndHour[currentDay][
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
    }
  }
}

//TODO: Rename this component to RequesterDetailComponent and change <app-requester-chart> to <app-requester-detail> for usage purposes.

//TODO The h2 heading for each chart is not visible.

//FIXME : By Day and Hour logic is wrong for particular requester chart. It is not showing the correct data on the chart.
