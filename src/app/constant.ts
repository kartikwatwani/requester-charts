import { ChartType, ChartOptions } from 'chart.js';

export class ChartConstant {
  static chartData: any[] = [
    {
      data: [],
      label: '',
      backgroundColor: [],
    },
  ];
  static reactionsList: any[] = [
      {
      name: 'Thumbs Down',
      id: 'thumbs_down',
    },
    {
      name: 'Thumbs Up',
      id: 'thumbs_up',
    },
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

  ];
  static hourChartLabels: string[] = [
    '12AM-1AM',
    '1AM-2AM',
    '2AM-3AM',
    '3AM-4AM',
    '4AM-5AM',
    '5AM-6AM',
    '6AM-7AM',
    '7AM-8AM',
    '8AM-9AM',
    '9AM-10AM',
    '10AM-11AM',
    '11AM-12PM',
    '12PM-1PM',
    '1PM-2PM',
    '2PM-3PM',
    '3PM-4PM',
    '4PM-5PM',
    '5PM-6PM',
    '6PM-7PM',
    '7PM-8PM',
    '8PM-9PM',
    '9PM-10PM',
    '10PM-11PM',
    '11PM-12AM',
  ];
  static dayChartLabels: any[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Staturday',

  ];
  static dayList: any[] = [
    { name: 'Sunday', id: 0 },
    { name: 'Monday', id: 1 },
    { name: 'Tuesday', id: 2 },
    { name: 'Wednesday', id: 3 },
    { name: 'Thursday', id: 4 },
    { name: 'Friday', id: 5 },
    { name: 'Staturday', id: 6 },

  ];
  static hoursList: any[] = [
    { name: '12AM-1AM', value: '0' },
    { name: '1AM-2AM', value: '1' },
    { name: '2AM-3AM', value: '2' },
    { name: '3AM-4AM', value: '3' },
    { name: '4AM-5AM', value: '4' },
    { name: '5AM-6AM', value: '5' },
    { name: '6AM-7AM', value: '6' },
    { name: '7AM-8AM', value: '7' },
    { name: '8AM-9AM', value: '8' },
    { name: '9AM-10AM', value: '9' },
    { name: '10AM-11AM', value: '10' },
    { name: '11AM-12AM', value: '11' },
    { name: '12PM-1PM', value: '12' },
    { name: '1PM-2PM', value: '13' },
    { name: '2PM-3PM', value: '14' },
    { name: '3PM-4PM', value: '15' },
    { name: '4PM-5PM', value: '16' },
    { name: '6PM-7PM', value: '17' },
    { name: '7PM-8PM', value: '18' },
    { name: '8PM-9PM', value: '19' },
    { name: '9PM-10PM', value: '20' },
    { name: '10PM-11PM', value: '21' },
    { name: '11PM-12PM', value: '22' },
    { name: '11AM-12AM', value: '23' },
  ];
  static barChartType: ChartType = 'bar';
  static hourCount = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23,
  ];
  static chartOptions: ChartOptions = {
    responsive: true,
  };

  static tableTypes={
    accept:'accept',
    submit:"submit"
  }
  
  static dayCount = [0, 1, 2, 3, 4, 5, 6];
  static filterType={
    topRequestersByDay:'topRequestersByDay',
    topRequestersByHour:'topRequestersByHour',
    topRequestersByDayAndHour:'topRequestersByDayAndHour',
    topRequestersByDayForSubmit:'topRequestersByDayForSubmit',
    topRequestersByHourForSubmit:'topRequestersByHourForSubmit',
    topRequestersByDayAndHourForSubmit:'topRequestersByDayAndHourForSubmit',
    byDayAndHourForAllRequesters:'byDayAndHourForAllRequesters'
  }
  static filters:any[]=[
    {
      id: 'by-presence',
      name: 'By Presence',
    },
    {
      id: 'by-wage-rate',
      name: 'By Wage Rate',
    },
    {
      id: 'by-reaction',
      name: 'By Reaction',
    },
  ];
}
