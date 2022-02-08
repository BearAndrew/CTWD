import { ManagerService } from './../../../_service/manager.service';
import { HttpService } from './../../../_service/http.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DRTSShiftRecord } from '../../../_interface/drts-interface';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MenuItem } from 'primeng/api';

interface ShiftAmount {
  cash: number;
  easycard: number;
  ipass: number;
}

@Component({
  selector: 'app-drts-history',
  templateUrl: './drts-history.component.html',
  styleUrls: ['./drts-history.component.scss']
})
export class DrtsHistoryComponent implements OnInit {

  @ViewChild('detailModal') public detailModal: ModalDirective;
  recordList: DRTSShiftRecord[];
  selectedRecord: DRTSShiftRecord;
  shiftAmountList: ShiftAmount[] = [];

  menuItems: MenuItem[] = []; // 司機回報, 回報查詢 分頁
  activeItem: MenuItem;
  menuIndex: number = 0;
  pageNum: number = 0; // 回報查詢 table 目前頁碼

  activeState: boolean[] = [false, false, false]; // 控制 accordion 開關

  constructor(private httpService: HttpService, private managerService: ManagerService) {
    this.loadDRTSShiftRecord(true);
  }

  ngOnInit(): void {
    this.menuItems.push({
      label: '歷史記錄', icon: 'fa fa-book pi-fw', command: (event) => {
        this.menuItemChanged(0);
        this.loadDRTSShiftRecord(true);
      }
    });
    this.menuItems.push({
      label: '未來班次', icon: 'fa fa-clock-o pi-fw', command: (event) => {
        this.menuItemChanged(1);
        this.loadDRTSShiftRecord(false);
      }
    });
    this.activeItem = this.menuItems[0];

  }

  pageChange() {
    window.scroll(0, 0);
  }

  showDetail(record: DRTSShiftRecord) {
    this.selectedRecord = record;
    this.detailModal.show();
  }
  hideDetail() {
    this.activeState = [false, false, false];
    this.detailModal.hide();
  }

  // 切換回報與查詢分頁
  menuItemChanged(index: number) {
    this.menuIndex = index;
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


  // 計算每趟金額
  calcShiftAmount() {
    for(let i = 0; i < this.recordList.length; i++) {
      const shiftAmount: ShiftAmount = {cash: 0, easycard: 0, ipass: 0};
      for (const order of this.recordList[i].OrderList) {
        if (order.PayType == '現金') {
          shiftAmount.cash += order.Amount;
        } else if (order.PayType == '悠遊卡') {
          shiftAmount.easycard += order.Amount;
        } else if (order.PayType == '一卡通') {
          shiftAmount.ipass += order.Amount;
        }
      }
      this.shiftAmountList.push(shiftAmount);
    }
  }

}
