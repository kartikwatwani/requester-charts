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
  sampleJson: any = {
    byDay: {
      GMT: {
        '3': {
          counts: {
            A101B0C6MV4Y9I: 10,
            A10GXSJ3DPMBGA: 3,
            A11DTAEYG1VP79: 100,
            A12DWLY5TD1002: 39,
            A13RN3XLOTM8EM: 19,
            A13SK78JYOSPLL: 3,
            A13T6KCHP5NDKS: 1,
            A151B2PYXEA86N: 9,
            A1598ZG7SWSL5G: 10,
            A15HTJTGHH26A2: 14,
            A15ZSKX8TUCGEU: 27,
          },
        },
        '4': {
          counts: {
            A12DWLY5TD1002: 22,
            A13T6KCHP5NDKS: 3,
            A14FZ4S2PW81BQ: 23,
            A1A71EIXJG91V3: 27,
            A1CBVFPPK9AH2N: 4,
            A1ED7GXQK2R21B: 1,
            A1G1PATDFBA7E5: 1,
            A1IIEOAC5SOGYS: 2,
            A1J8ZUKMLBWJF8: 2,
          },
        },
      },
      LosAngeles: {
        '3': {
          counts: {
            A101B0C6MV4Y9I: 10,
            A10GXSJ3DPMBGA: 3,
            A11DTAEYG1VP79: 100,
            A12DWLY5TD1002: 61,
            A13RN3XLOTM8EM: 19,
            A13SK78JYOSPLL: 3,
            A13T6KCHP5NDKS: 4,
            A14FZ4S2PW81BQ: 23,
            A151B2PYXEA86N: 9,
          },
        },
        '4': {
          counts: {
            A101B0C6MV4Y9I: 5,
            A10GXSJ3DPMBGA: 3,
            A11DTAEYG1VP79: 100,
            A12DWLY5TD1002: 61,
            A13RN3XLOTM8EM: 19,
            A13SK78JYOSPLL: 3,
            A13T6KCHP5NDKS: 4,
            A14FZ4S2PW81BQ: 23,
            A151B2PYXEA86N: 9,
          },
        },
        '5': {
          counts: {
            A101B0C6MV4Y9I: 400,
            A10GXSJ3DPMBGA: 3,
            A11DTAEYG1VP79: 100,
            A12DWLY5TD1002: 61,
            A13RN3XLOTM8EM: 19,
            A13SK78JYOSPLL: 3,
            A13T6KCHP5NDKS: 4,
            A14FZ4S2PW81BQ: 23,
            A151B2PYXEA86N: 9,
          },
        },
      },
    },
    byDayAndHour: {
      GMT: {
        '3': [
          {
            counts: {
              A1CB6QXJP3GKKR: 3,
              A1GFR8HDSRKCK1: 1,
              A1J3PC4E2FMY60: 1,
              A1LBWICXYG4SXB: 2,
              A1LWCCSJWAGBW: 1,
              A1OIK8JUWHMHM6: 3,
            },
          },
          {
            counts: {
              A17FIOY9QQNALT: 1,
              A1AXFX5EKNTGDN: 1,
              A1C4995LKMVH4C: 1,
              A1LP9FAGR1MR0K: 2,
              A1OIK8JUWHMHM6: 1,
            },
          },
          {
            counts: {
              A13RN3XLOTM8EM: 1,
              A13T6KCHP5NDKS: 1,
              A17FIOY9QQNALT: 1,
              A1AXFX5EKNTGDN: 10,
              A1IUTKN8GTYIE: 1,
            },
          },
        ],
        '4': [
          {
            counts: {
              A13T6KCHP5NDKS: 1,
              A1CBVFPPK9AH2N: 1,
              A1IIEOAC5SOGYS: 2,
              A1J8ZUKMLBWJF8: 1,
              A1PE5ADGG8M3GY: 2,
              A24O80XUSN0NBB: 1,
              A2C2WVMLSQ8G3K: 1,
              A2DPU6JE37X0YV: 1,
              A2GQ2XOMONHNL9: 2,
              A2S5YBSFGWXLY1: 1,
              A2TY6C5M54HWEC: 4,
              A35WJSVFUL1MRU: 23,
              A364WMN0XT1D3N: 13,
              A3AYV6BR7VCGW0: 1,
              A3GBLNH1WC0XRI: 1,
              A3IVETY27YPN3F: 3,
              A3K5D5S00LCHBB: 4,
              A3OO8KUVWDSZPV: 1,
              AUGULQLS8X8HW: 1,
              AUOM0RKPICL6X: 2,
            },
          },
          {
            counts: {
              A3DL93QTPE513P: 1,
              A3K5D5S00LCHBB: 1,
              ADBWUV0BYY98D: 5,
              AYFNM1S79IH0N: 1,
              AZCSVCDYVXHLO: 2,
            },
          },
        ],
      },
      LosAngeles: {
        '3': [
          {
            counts: {
              A1CB6QXJP3GKKR: 3,
              A1GFR8HDSRKCK1: 1,
              A1J3PC4E2FMY60: 1,
              A1LBWICXYG4SXB: 2,
              A1LWCCSJWAGBW: 1,
              A1OIK8JUWHMHM6: 3,
              A1ZEEGMU3YMZ6: 1,
              A1ZU7XUT6YX66L: 49,
            },
          },
          {
            counts: {
              A17FIOY9QQNALT: 1,
              A1AXFX5EKNTGDN: 1,
              A1C4995LKMVH4C: 1,
              A1LP9FAGR1MR0K: 2,
              A1OIK8JUWHMHM6: 1,
              A1ZEEGMU3YMZ6: 2,
              A210GEVDVU8V7E: 1,
              A24AXWEJPR1M2E: 1,
              A279VKP16SWF7B: 1,
              A29C1XYH77RQYM: 24,
            },
          },
          {
            counts: {
              A13RN3XLOTM8EM: 1,
              A13T6KCHP5NDKS: 1,
              A17FIOY9QQNALT: 1,
              A1AXFX5EKNTGDN: 10,
              A1IUTKN8GTYIE: 1,
              A1J08AVASY85P: 3,
              A1LP9FAGR1MR0K: 1,
            },
          },
        ],
      },
    },
    byHour: {
      GMT: [
        {
          counts: {
            A1A71EIXJG91V3: 27,
            A1CBVFPPK9AH2N: 3,
            A1ED7GXQK2R21B: 1,
            A1VTAWD72YN1KU: 3,
          },
        },
        {
          counts: {
            A12DWLY5TD1002: 22,
            A1G1PATDFBA7E5: 1,
            A1J8ZUKMLBWJF8: 1,
            A1JV9QF113U7ZM: 1,
            A1LBWICXYG4SXB: 3,
          },
        },
        {
          counts: {
            A13T6KCHP5NDKS: 2,
            A14FZ4S2PW81BQ: 23,
            A1JYVA650F5ZG0: 1,
            A1LWCCSJWAGBW: 2,
          },
        },
      ],
      LosAngeles: [
        {
          counts: {
            A1CB6QXJP3GKKR: 3,
            A1GFR8HDSRKCK1: 1,
            A1J3PC4E2FMY60: 1,
            A1LBWICXYG4SXB: 2,
            A1LWCCSJWAGBW: 1,
          },
        },
        {
          counts: {
            A17FIOY9QQNALT: 1,
            A1AXFX5EKNTGDN: 1,
            A1C4995LKMVH4C: 1,
            A1LP9FAGR1MR0K: 2,
            A1OIK8JUWHMHM6: 1,
            A1ZEEGMU3YMZ6: 2,
            A210GEVDVU8V7E: 1,
            A24AXWEJPR1M2E: 1,
            A279VKP16SWF7B: 1,
            A29C1XYH77RQYM: 24,
            A29YQT3EEC0ZEC: 2,
            A2GQ2XOMONHNL9: 2,
            A2SAUCU1B6BDTS: 18,
            A364WMN0XT1D3N: 14,
            A38QSR3OTZ3PEY: 3,
            A3DL93QTPE513P: 3,
            A3JCN70475C10R: 5,
            A3K5D5S00LCHBB: 11,
            A3OKC5SI2SMS8S: 16,
            A3OO8KUVWDSZPV: 1,
            A3VE7C7MEKE8VQ: 1,
            A3VTXG9MRA65HP: 1,
            A5ONRIBW2H3VT: 1,
            ADG95V0I0CEY3: 2,
            AIV3GUVR66SYY: 15,
            AUOM0RKPICL6X: 2,
          },
        },
        {
          counts: {
            A13RN3XLOTM8EM: 1,
            A13T6KCHP5NDKS: 1,
            A17FIOY9QQNALT: 1,
            A1AXFX5EKNTGDN: 10,
            A1IUTKN8GTYIE: 1,
            A1J08AVASY85P: 3,
            A1LP9FAGR1MR0K: 1,
            A1OIK8JUWHMHM6: 2,
          },
        },
      ],
    },
    byRequesterID: {
      A101B0C6MV4Y9I: {
        counts: {
          GMT: {
            byDay: {
              '3': 10,
            },
            byDayAndHour: {
              '3': {
                '13': 10,
              },
            },
            byHour: {
              '13': 10,
            },
          },
          LosAngeles: {
            byDay: {
              '3': 10,
            },
            byDayAndHour: {
              '3': {
                '6': 10,
              },
            },
            byHour: {
              '6': 10,
            },
          },
        },
        rawTimestamps: {
          '-Nd5XmiTUAQ36J6tOpA-': 1693400640424,
          '-Nd5Xmk_K5KXsgXo0O1X': 1693400640559,
          '-Nd5XmwdNFBphZwAoqDe': 1693400641334,
          '-Nd5Xn-5MD4ExBLhtH6C': 1693400641568,
          '-Nd5Xn3RnW_oAHToz-Uu': 1693400641885,
          '-Nd5XnIW8eNhD0cYWN5r': 1693400642991,
          '-Nd5XovkeOu9RdVthG6x': 1693400649467,
          '-Nd5XsyTIlygpkI8GNNm': 1693400666026,
          '-Nd5XtnZ7fZqvi7URELh': 1693400669424,
          '-Nd5XuRuw6xZ3Z7YTMgO': 1693400672070,
        },
      },
      A10GXSJ3DPMBGA: {
        counts: {
          GMT: {
            byDay: {
              '3': 3,
            },
            byDayAndHour: {
              '3': {
                '13': 1,
                '16': 1,
                '17': 1,
              },
            },
            byHour: {
              '13': 1,
              '16': 1,
              '17': 1,
            },
          },
          LosAngeles: {
            byDay: {
              '3': 3,
            },
            byDayAndHour: {
              '3': {
                '6': 1,
                '9': 1,
                '10': 1,
              },
            },
            byHour: {
              '6': 1,
              '9': 1,
              '10': 1,
            },
          },
        },
        rawTimestamps: {
          '-Nd5_FCXnIKjlTeMkrxx': 1693401285489,
          '-Nd6DB1jLImJ1FMOLzdd': 1693412016314,
          '-Nd6SPPbzH-vYI_zh7L7': 1693416007421,
        },
      },
      A11DTAEYG1VP79: {
        counts: {
          GMT: {
            byDay: {
              '3': 100,
            },
            byDayAndHour: {
              '3': {
                '14': 100,
              },
            },
            byHour: {
              '14': 100,
            },
          },
          LosAngeles: {
            byDay: {
              '3': 100,
            },
            byDayAndHour: {
              '3': {
                '7': 100,
              },
            },
            byHour: {
              '7': 100,
            },
          },
        },
        rawTimestamps: {
          '-Nd5m9qjgSiqy-XC0MC8': 1693404673414,
          '-Nd5m9unzCXLirYqvZgp': 1693404673713,
          '-Nd5mA1OdnY4BtfnYy2H': 1693404674197,
          '-Nd5mA7VpE-tHJQLmtZj': 1693404672558,
          '-Nd5mAG6Mx1dHEVwocoF': 1693404673134,
          '-Nd5mAIbneR2NzsRflwa': 1693404673281,
          '-Nd5mAJ7lwDp1IN-2k4W': 1693404673318,
          '-Nd5mALetkHcJgNUY1dG': 1693404673477,
          '-Nd5mAMeaRdjcEYpwbEu': 1693404673557,
          '-Nd5mANztGzE_6rwxFIK': 1693404673679,
          '-Nd5mAPd8vJn_GC2yRYB': 1693404673788,
          '-Nd5mAPeXoFspdDsLGUg': 1693404673797,
          '-Nd5mAPp-sUI6vZ9qAur': 1693404673788,
          '-Nd5mAQBb7uZOFNCQmA-': 1693404673849,
          '-Nd5mAQVqjll7n76kpWV': 1693404673850,
          '-Nd5mAQXgmNlhlT2D0eh': 1693404673851,
          '-Nd5mARjp6TxCE27kSaz': 1693404673969,
          '-Nd5mARnloJeQhjhh17f': 1693404673969,
          '-Nd5mARtQDhISkN3EFqV': 1693404673970,
          '-Nd5mASCPxfMzKxTrJle': 1693404673970,
          '-Nd5mATKvGiox-VbjqKq': 1693404674185,
          '-Nd5mATaUohwMT2UZuWB': 1693404674194,
          '-Nd5mATgjSjK9mvW09Pb': 1693404674185,
          '-Nd5mAYyUf_wDbkYMtW4': 1693404674513,
          '-Nd5mAZ0jiDeEaDhMzJc': 1693404674513,
          '-Nd5mAZVqxJnFsCmoGhI': 1693404674534,
          '-Nd5mA_1uKXsrxmkn_Gx': 1693404674535,
          '-Nd5mA_4QuAJW1cxgvg_': 1693404674535,
          '-Nd5mAb8owqsjei6h5Ph': 1693404674871,
          '-Nd5mAli-RoTOBJVtruO': 1693404675608,
          '-Nd5mAlrfkHzt7bn8VDI': 1693404675609,
          '-Nd5mAuR4o-RcujdS-lH': 1693404675756,
          '-Nd5mCcDqaXIz9d_KGeP': 1693404684786,
          '-Nd5mCfThtAvJZ8dltPw': 1693404684985,
          '-Nd5mCk6gEddAxpokgtA': 1693404685352,
          '-Nd5mCzM0PL8UuI01cR8': 1693404685167,
          '-Nd5mD0xpqMrGX-gy_IW': 1693404684423,
          '-Nd5mD1MvPbJvzzMLrHW': 1693404684457,
          '-Nd5mD2dArjsNfrIR46b': 1693404684551,
          '-Nd5mD3JModdokm4nOky': 1693404684576,
          '-Nd5mD6COmpAkC8RM0D0': 1693404684785,
          '-Nd5mD79kAc7DKwrF-G4': 1693404684850,
          '-Nd5mD8Rm_3tUIPYyzU_': 1693404684931,
          '-Nd5mD9AilFNqeBgCoJB': 1693404684957,
          '-Nd5mD9TzYXxcKrdV4hl': 1693404684994,
          '-Nd5mDB42TSVOBtgdxIa': 1693404685081,
          '-Nd5mDBjtbeQ9084bZjh': 1693404685193,
          '-Nd5mDC99l8x1-Do3TZP': 1693404685184,
          '-Nd5mDCkmXMsePqR4BaS': 1693404685340,
          '-Nd5mDDXmVT3o6l5JpaZ': 1693404685338,
          '-Nd5mDEN-d9rJ-Xm0pRh': 1693404685350,
          '-Nd5mDEWH5820eCofAl_': 1693404685353,
          '-Nd5mDEdWXwBoH8_4efq': 1693404685354,
          '-Nd5mDEdq6Pqqtd25lWA': 1693404685353,
          '-Nd5mDEsBm0FA86T40T2': 1693404685449,
          '-Nd5mDGhNa4ERVP4sV4X': 1693404685577,
          '-Nd5mDH71AlotrxF1D7n': 1693404685586,
          '-Nd5mDHAIRdTqipWnlnh': 1693404685578,
          '-Nd5mDHx9qYMs-5ZRG1x': 1693404685596,
          '-Nd5mDKhLP-TOavXkkoS': 1693404685777,
          '-Nd5mDLEesPGTJ9kDdaf': 1693404686289,
          '-Nd5mDLKjR4VsdfPKrmK': 1693404686289,
          '-Nd5mDMWoD-9CVpzSt2i': 1693404686259,
          '-Nd5mDN-n1z61PxMXqhC': 1693404686259,
          '-Nd5mDPA8M7hzvFtorkx': 1693404686400,
          '-Nd5mDT8tRzGCYynTtwC': 1693404686399,
          '-Nd5mDWrE7BmFJjtGkJT': 1693404686633,
          '-Nd5mFqODzkvyCrdkw-Z': 1693404696831,
          '-Nd5mG-g25tPlqm__3ww': 1693404696702,
          '-Nd5mG-irawBQXC2cMaS': 1693404696703,
          '-Nd5mG-s0zuj7uGiqTjH': 1693404696702,
          '-Nd5mG-t2xmEuVwkX2oX': 1693404696704,
          '-Nd5mG0k6lDSAHjgZcIX': 1693404696734,
          '-Nd5mG15fwfcObJcp56k': 1693404696833,
          '-Nd5mG1C-m9kI3Ip0NRG': 1693404696832,
          '-Nd5mG2wQvFFmb7wDNd5': 1693404696961,
          '-Nd5mG36N6vgikG3gQnG': 1693404696959,
          '-Nd5mG4fkuqmUMmsYXx2': 1693404696962,
          '-Nd5mG8e-QTOG8_KxkDQ': 1693404697233,
          '-Nd5mGBXdCJKy-BR836K': 1693404697478,
          '-Nd5mGEJkmE8gHjXbR9J': 1693404697641,
          '-Nd5nNsLnU4wJHzmLYpx': 1693404992802,
          '-Nd5nNx1saECCk0y2GvB': 1693404993102,
          '-Nd5nNy2pEwdaXT_ZQWD': 1693404993167,
          '-Nd5nO0C7Uztru2EY0Nr': 1693404993369,
          '-Nd5nOQCuE_IVff86DeB': 1693404993248,
          '-Nd5nQvKu7EVu7ax0fhi': 1693405003497,
          '-Nd5nSye8qduW0DN6trM': 1693405013687,
          '-Nd5nTp-wGsjuA-sGr-h': 1693405015442,
          '-Nd5nTqlxgC7l2OnIK1a': 1693405015555,
          '-Nd5nTroWTWKY4qtgkHN': 1693405015616,
          '-Nd5nU-sZtSm-FhFQV1z': 1693405017926,
          '-Nd5o5CnBzieUjPcAwZc': 1693405178494,
          '-Nd5oWLPjp48iD7W_m43': 1693405289637,
          '-Nd5ooArx4dyQz4Nw9CZ': 1693405366787,
          '-Nd5oqqg6r21Ji-AkjMN': 1693405376580,
          '-Nd5oymhlGgecqgz6CzO': 1693405410233,
          '-Nd5pGZVEgov0Jb02qqR': 1693405487147,
          '-Nd5pGq-VVi_KvaqgE63': 1693405488267,
          '-Nd5ps4oSB4hjljKK8PN': 1693405644929,
        },
      },
    },
  };

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

  getEmployeeName(): AngularFireList<any> {
    //TODO Use this.db.object() instead of this.db.list() and save the data as object instead of list.
    return this.db.list(`/req_id_to_name_mapping`);
  }

  getOthersEmployeeData(key: string): any {
    return firstValueFrom(this.db
      .list(`/${key}`)
      .snapshotChanges()
      .pipe(
        map((changes: any) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      ));
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
