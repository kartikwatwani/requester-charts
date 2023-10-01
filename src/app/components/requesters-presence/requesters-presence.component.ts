import { Component, Input, OnInit } from '@angular/core';
import { ChartConstant } from 'src/app/constant';
import { Chart } from '../requesters-analysis/requesters-analysis';

@Component({
  selector: 'app-requesters-presence',
  templateUrl: './requesters-presence.component.html',
  styleUrls: ['./requesters-presence.component.scss'],
})
export class RequestersPresenceComponent implements OnInit {
  @Input() requesterIDToNameMapping = '';
  presenceType = ChartConstant.tableTypes.accept;
  chartsList: Chart[] = ChartConstant.chartList;
  constructor(){}

  ngOnInit() {

  }
}
