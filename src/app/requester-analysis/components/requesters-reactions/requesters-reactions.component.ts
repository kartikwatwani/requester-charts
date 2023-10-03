import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ChartConstant } from '../../../constant';
import { ChartService } from '../../services/chart.service';

@Component({
  selector: 'app-requesters-reactions',
  templateUrl: './requesters-reactions.component.html',
  styleUrls: ['./requesters-reactions.component.scss'],
})
export class RequestersReactionsComponent {
  employeerList = [];
  reactionList = ChartConstant.reactionsList;
  selectedReaction = this.reactionList[0].id;
  @Input() requesterIDToNameMapping: any = {};

  constructor(private chartService: ChartService, private router: Router) {}

  async ngOnInit() {
    this.employeerList = await this.chartService.getDataAtPathAsList(
      'reacts/requester'
    );
    this.prepareDataForRequesterReaction();
  }

  prepareDataForRequesterReaction() {
    this.employeerList = this.employeerList
      .sort(
        (a, b) =>
          b.summary[this.selectedReaction] - a.summary[this.selectedReaction]
      )
      .filter((item) => item.summary[this.selectedReaction] !== 0);
    this.mappedNameForEmployer();
  }

  mappedNameForEmployer() {
    this.employeerList.forEach((requester) => {
      requester.requestersName =
        this.requesterIDToNameMapping[requester.key] || requester.key;
    });
  }

  getRequesterDetail(item, key = 'name', query = 'requestersName') {
    this.router.navigate([`/requester-analysis/${item[key]}`], {
      queryParams: { name: item[query] },
    });
  }
}
