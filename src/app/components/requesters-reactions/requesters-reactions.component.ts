import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';
import { ChartConstant } from 'src/app/constant';
import { ChartService } from 'src/app/services/chart.service';

@Component({
  selector: 'app-requesters-reactions',
  templateUrl: './requesters-reactions.component.html',
  styleUrls: ['./requesters-reactions.component.scss'],
})
export class RequestersReactionsComponent {
  data: any[] = [];
  databasePath = '';
  @Input() label;
  requesterList = [];
  reactionList = ChartConstant.reactionList;
  selectedReaction = this.reactionList[0].id;
  @Input() employeersList: any[] = [];
  constructor(private chartService: ChartService, private router: Router) {}
  async ngOnInit() {
    this.data = await firstValueFrom(
      this.chartService
        .getOthersEmployeeData('reacts/requester')
        .snapshotChanges()
        .pipe(
          map((changes) =>
            changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
          )
        )
    );
    this.prepareDataForRequesterReaction();
  }
  prepareDataForRequesterReaction() {
    this.requesterList = this.data
      .sort(
        (a, b) =>
          b.summary[this.selectedReaction] - a.summary[this.selectedReaction]
      )
      .filter((item) => item.summary[this.selectedReaction] !== 0);
    this.mappedNameForEmployer('key');
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

  getRequesterDetail(item, key = 'name', query = 'requestersName') {
    this.router.navigate([`/requester-analysis/${item[key]}`], {
      queryParams: { name: item[query] },
    });
  }
}

//Rename employeersList to requestersIDToNameMapping. Rename requesterList to requestersReactionsList.