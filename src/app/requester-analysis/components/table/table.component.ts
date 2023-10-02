import { Component, Input } from '@angular/core';
import { ChartConstant } from '../../../constant';
import { Router } from '@angular/router';
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
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() topRequestersList: any[] = [];
  @Input() requesterIDToNameMapping: any = {};
  @Input() metric = '';
  @Input() title = '';
  @Input() presenceType = '';
  selectedHour = '';
  selectedDay = '';
  dayList: any[] = ChartConstant.dayList;
  hoursList: any[] = ChartConstant.hoursList;

  constructor(private chartService: ChartService, private router: Router) {}

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
    this.chartService.requesterList.subscribe((res) => {
      topList = res;
      if (Object.keys(topList).length > 0) {
        this.prepareTopRequesters();
      }
    });
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
    } else if (
      type === 'day' &&
      this.presenceType === ChartConstant.tableTypes.accept
    ) {
      this.metric = 'topRequestersByDay';
    } else if (
      type === 'hour' &&
      this.presenceType === ChartConstant.tableTypes.submit
    ) {
      this.metric = 'topRequestersByHourForSubmit';
    } else if (
      type === 'hour' &&
      this.presenceType === ChartConstant.tableTypes.accept
    ) {
      this.metric = 'topRequestersByHour';
    } else if (
      type === 'byDayAndHour' &&
      this.presenceType === ChartConstant.tableTypes.submit
    ) {
      this.metric = 'topRequestersByDayAndHourForSubmit';
    } else if (
      type === 'byDayAndHour' &&
      this.presenceType === ChartConstant.tableTypes.accept
    ) {
      this.metric = 'topRequestersByDayAndHour';
    }
    this.prepareTopRequesters();
  }

  getRequesterDetail(item, key = 'name', query = 'requestersName') {
    this.router.navigate([`/requester-analysis/${item[key]}`], {
      queryParams: { name: item[query] },
    });
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
      if (
        this.metric === ChartConstant.filterType.topRequestersByDayForSubmit
      ) {
        data = topList.byDay.submit[this.selectedDay];
      } else if (
        this.metric === ChartConstant.filterType.topRequestersByHourForSubmit
      ) {
        data = topList.byHour.submit[this.selectedHour];
      } else if (
        this.metric ===
        ChartConstant.filterType.topRequestersByDayAndHourForSubmit
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
}
