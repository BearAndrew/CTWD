import { DRTSOrder } from './../../../_interface/drts-interface';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DRTSShiftRecord } from '../../../_interface/drts-interface';
import { HttpService } from '../../../_service/http.service';
import { ManagerService } from '../../../_service/manager.service';

interface ShiftAmount {
  date: string;
  cash: number;
  easycard: number;
  ipass: number;
  departTime: string;
  routeName: string;
  orderList: DRTSOrder[];
}
interface DailyAmount extends ShiftAmount {
  shiftInfoList: ShiftAmount[];
}

@Component({
  selector: 'app-drts-statistics',
  templateUrl: './drts-statistics.component.html',
  styleUrls: ['./drts-statistics.component.css']
})
export class DrtsStatisticsComponent implements OnInit {
  @ViewChild('detailModal') public detailModal: ModalDirective;
  recordList: DRTSShiftRecord[];
  selectedDailyAmount: DailyAmount;
  dailyAmountList: DailyAmount[] = [];

  constructor(private httpService: HttpService, private managerService: ManagerService
    , private datepipe: DatePipe) {
    this.loadDRTSShiftRecord(true);
  }

  ngOnInit(): void {
  }

  pageChange() {
    window.scroll(0, 0);
  }

  showDetail(dailyAmount: DailyAmount) {
    this.selectedDailyAmount = dailyAmount;
    this.detailModal.show();
  }

  loadDRTSShiftRecord(beforeToday: boolean) {
    this.managerService.ShowSpinner();
    this.httpService.loadDRTSShiftRecord(beforeToday).subscribe(
      data => {
        this.managerService.HideSpinner();
        this.httpService.devModeLog('LoadDRTSShiftRecord', data, false);
        if (data.IsSuccess) {
          this.recordList = data.RecordList;
          this.calcShiftAmount();
          // console.log(JSON.stringify(this.recordList[0]));
        } else {
          this.managerService.ErrorToast(data.Reason);
        }
      },
      err => {
        this.managerService.HideSpinner();
        this.managerService.ErrorToast(err);
      }
    );
  }


  // 計算每日金額
  calcShiftAmount() {
    const shiftAmountList: ShiftAmount[] = [];
    for(let i = 0; i < this.recordList.length; i++) {
      const shiftAmount: ShiftAmount = {
        date: this.recordList[i].Shift.DatePart,
        cash: 0, easycard: 0, ipass: 0,
        departTime: this.recordList[i].Shift.DepartTime,
        routeName: this.recordList[i].Shift.RouteName + '-' + this.recordList[i].Shift.RouteType,
        orderList: this.recordList[i].OrderList
      };
      for (const order of this.recordList[i].OrderList) {
        if (order.PayType == '現金') {
          shiftAmount.cash += order.Amount;
        } else if (order.PayType == '悠遊卡') {
            shiftAmount.easycard += order.Amount;
        } else if (order.PayType == '一卡通') {
            shiftAmount.ipass += order.Amount;
        }
      }
      shiftAmountList.push(shiftAmount);
    }


    for (const shiftAmount of shiftAmountList) {
      console.log(JSON.stringify(shiftAmount));
      let hasDate: boolean = false;
      // 檢查 dailyAmountList 中是否有同日期的 element
      for (const dailyAmount of this.dailyAmountList) {
        if (shiftAmount.date == dailyAmount.date) {
          hasDate = true;
          dailyAmount.cash += shiftAmount.cash;
          dailyAmount.easycard += shiftAmount.easycard;
          dailyAmount.ipass += shiftAmount.ipass;
          dailyAmount.shiftInfoList.push(shiftAmount);
          break;
        }
      }

      // 若沒有在 dailyAmountList 中新增日期
      if (!hasDate) {
        const newDailyAmount:DailyAmount = {
          date: shiftAmount.date,
          cash: shiftAmount.cash,
          easycard: shiftAmount.easycard,
          ipass: shiftAmount.ipass,
          shiftInfoList: [
            shiftAmount
          ],
          orderList: shiftAmount.orderList,
          departTime: '',
          routeName: ''
        };
        this.dailyAmountList.push(newDailyAmount);
      }
    }

    console.log(JSON.stringify(shiftAmountList));
    console.log(JSON.stringify(this.dailyAmountList));
  }


  // calcDate() {
  //   const dateList: string[] = [];
  //   for(let i = 0; i < 90; i++) {
  //     const timeStamp = new Date().setDate(new Date().getDate() - i);
  //     const dateString = this.datepipe.transform(new Date(timeStamp), 'yyyy/MM/dd');
  //     dateList.push(dateString);
  //   }
  // }

}
