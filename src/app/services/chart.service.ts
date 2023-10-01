import { Injectable } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { BehaviorSubject, Subject, firstValueFrom, map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ChartService {
  employeerData: Subject<any> = new BehaviorSubject({});
  constructor(private db: AngularFireDatabase) {}

  getAcceptCounts(key: string, singleRequester = false): Promise<any[]> {
    const newKey = this.getFilterCondition(key);
    let path;
    if (!singleRequester) {
      path = `${newKey}`;
    } else {
      path = key;
    }
    return firstValueFrom(
      this.db
        .list(`/req_pre/${path}`)
        .snapshotChanges()
        .pipe(
          map((changes: any[]) =>
            changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
          )
        )
    );
  }

  getFilterCondition(key) {
    return key.indexOf('top10') > -1
      ? 'byRequesterID'
      : key === 'byDayAndHourForAllRequesters'
      ? `byDayAndHour/LosAngeles`
      : `${key}/LosAngeles`;
  }

  getSubmitCounts(key: string, singleRequester = false): Promise<any[]> {
    const newKey = this.getFilterCondition(key);
    let path;
    if (!singleRequester) {
      path = `${newKey}`;
    } else {
      path = key;
    }
    return firstValueFrom(
      this.db
        .list(`/req_pre_by_submit_time/${path}`)
        .snapshotChanges()
        .pipe(
          map((changes: any[]) =>
            changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
          )
        )
    );
  }

  getRequestersName(): any {
    return firstValueFrom(
      this.db
        .object(`/req_id_to_name_mapping`)
        .snapshotChanges()
        .pipe(
          map((changes: any) => {
            return { key: changes.key, ...changes.payload.val() };
          })
        )
    );
  }

  getDataAtPath(key: string): any {
    return firstValueFrom(
      this.db
        .list(`/${key}`)
        .snapshotChanges()
        .pipe(
          map((changes: any) =>
            changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
          )
        )
    );
  }

  getLimitedData(
    key: string,
    orderBy: string,
    limit: number
  ): AngularFireList<any> {
    return this.db.list(`/${key}`, (ref) =>
      ref.orderByChild(orderBy).limitToLast(limit)
    );
  }
}

