import { Subscription } from 'rxjs';
import { HttpService } from './../../../_service/http.service';
import { Router } from '@angular/router';
import { DRTSShift, DRTSShiftActionType, DRTSStop, DRTSOrder, DRTSPayType, DRTSCardType, ReportDRTSIssueRequest, ReportDRTSMaintRequest } from './../../../_interface/drts-interface';
import { ManagerService } from './../../../_service/manager.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MissionType } from '../../../_interface/interface';
import { first } from 'rxjs/operators';
import { FileUpload } from 'primeng/fileupload';

interface SelectItem {
  value: any;
}

const maxPassenger = 8; // 最大乘客數

@Component({
  selector: 'app-drts-mission',
  templateUrl: './drts-mission.component.html',
  styleUrls: ['./drts-mission.component.scss'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({opacity: 0}),
        animate(200)
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(400, style({opacity: 0})))
    ])
  ]
})

export class DrtsMissionComponent implements OnInit {
  @ViewChild('confirmModal') public confirmModal: ModalDirective;
  @ViewChild('orderConfirmModal') public orderConfirmModal: ModalDirective;
  @ViewChild('reportModal') public reportModal: ModalDirective;
  @ViewChild('reportFU') reportFU: FileUpload;
  drtsShift: DRTSShift;
  currentSequence: number;
  nowStop: DRTSStop;
  nextStop: DRTSStop;
  drtsOrderList: DRTSOrder[]; // 車上乘客訂單List
  departTime: Date; // 抵達時間
  distance: number; // 下一站距離
  showStopPage: boolean = false; // 顯示靠站畫面
  orderConfirmAction: string = ''; // 再次確認 完成或刪除乘客訂單 動作:{'完成', 刪除}
  confirmOrder: DRTSOrder; // 被確認的訂單
  reportIssueRequest: ReportDRTSIssueRequest = new ReportDRTSIssueRequest();
  payTypeSub: Subscription;
  isMapReady: boolean = false;
  currentPassengerCount: number; // 目前車上乘客數
  reservationPassengerCount: number; // 預約乘客數
  pickupPassengerCount: number = 0; // 本站需要載的乘客數
  dropPassengerCount: number = 0; // 本站需要下車的乘客數
  canMsg: SelectItem; // 罐頭訊息
  canMsgOptions: SelectItem[] = []; // 罐頭訊息選項

  // 上車人數按鈕
  maleCountOptions: SelectItem[] = [{value: 0}];
  femaleCountOptions: SelectItem[] = [{value: 0}];
  selectedMaleCount: SelectItem = {value: 0};
  selectedFemaleCount: SelectItem = {value: 0};

  payTypeList: DRTSPayType[];
  selectedPayTypeList: DRTSPayType[] = []; // 選擇的付款方式
  selectedCardTypeList: DRTSCardType[] = []; // 選擇的卡片種類
  selectedAmountList: SelectItem[] = []; // 選擇的金額
  amountOptionsList: SelectItem[][] = []; // 金額的選項
  undonePayType: string[] = []; // 存下未完成的付款資訊

  constructor(private managerService: ManagerService, private router: Router,
    private httpService: HttpService) {

    this.managerService.ShowSpinner();

    // 檢查目前是否有任務
    if (this.managerService.dontCallmyDRTSShiftList) {
      // 自動路由執行
      this.managerService.getDRTSShiftList().pipe(first()).subscribe(
        data => {
          this.managerService.HideSpinner();
          if (data.IsSuccess) {
            this.checkHasMission(data.ShiftList, 'mission getDRTSShiftList');
          } else {
            this.managerService.ErrorToast(data.Reason);
          }
        },
        err => {
          this.managerService.HideSpinner();
          this.managerService.ErrorToast(err);
        }
      );
    } else {
      // 手動按下執行
      this.managerService.myDRTSShiftList().then(
        resolve => {
          this.managerService.HideSpinner();
          this.checkHasMission(resolve.ShiftList, 'mission myDRTSShiftList');
        },
        reject => {
          this.managerService.HideSpinner();
          this.managerService.ErrorToast(reject);
        }
      );
    }

  }

  ngOnInit(): void {
  }

  // 檢查目前是否有執行中任務, 沒有就回到主頁
  checkHasMission(data: DRTSShift[], caller: string) {
    for (const shift of data) {
      if (shift.Status === '執行中' || !this.managerService.dontCallmyDRTSShiftList) {
        this.getDRTSShiftInfo();
        return;
      }
    }
    console.log(caller + '回到主頁');
    this.managerService.missionMode = MissionType.NULL;
    this.router.navigate(['/drts/dashboard'], {replaceUrl: true});
  }

  // 從 managerService 取得 執行中的 DRTSShift
  getDRTSShiftInfo() {
    this.managerService.getExecuteDRTSShift().subscribe(
      data => {
        if (data) {
          this.drtsShift = data.Shift;
          this.currentSequence = this.drtsShift.CurrentSequence;
          this.drtsOrderList = this.drtsShift.OrderList;
          this.updateLeftPassengerCount(-1);
          this.updateStopInfo();
          if (this.drtsShift.VehicleStatus == '準備發車' || this.drtsShift.VehicleStatus == '到站') {
            this.showStopPage = true;
          }
          this.payTypeList = data.PayTypeList;
          this.canMsgOptions = [];
          for (const canMsg of data.IssueCanMsgList) {
            this.canMsgOptions.push({value: canMsg});
          }
        }
      },
      err => {
        this.managerService.ErrorToast(err);
        console.log(err);
      }
    );
  }

  // 更新暫存 Stop 資訊
  updateStopInfo() {
    this.nowStop = this.drtsShift.StopList[this.currentSequence - 1];
    this.nextStop = this.drtsShift.StopList[this.currentSequence];
    this.departTime = new Date(this.drtsShift.DepartTime);
    for (let i = 1; i < this.currentSequence; i++) {
      this.departTime.setMinutes(
        this.departTime.getMinutes() + this.drtsShift.StopList[i - 1].MinToNext);
    }

    // 檢查本站預約乘客
    this.pickupPassengerCount = 0;
    this.dropPassengerCount = 0;
    for (const order of this.drtsOrderList) {
      if (order.OrderType == '預約' && order.PickupStopSequence == this.currentSequence && order.PickupTime == '') {
        this.pickupPassengerCount++;
      }
      if (order.OrderType == '預約' && order.DropStopSequence == this.currentSequence) {
        this.dropPassengerCount++;
      }
    }


    // 檢查是否有定位
    const currentPos = {lat: 0, lng: 0};
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        currentPos.lat = position.coords.latitude;
        currentPos.lng = position.coords.longitude;
        // console.log('this.currentPos: ' + JSON.stringify(currentPos));

        this.checkGoogleInit(currentPos);
      });
    } else {
      setTimeout(() => {
        this.managerService.CustomToast('定位未允許', '錯誤', 'error', 4000, true);
      }, 500);
      console.log('Geolocation is not supported by this browser.');
    }
  }

  // 更新剩餘乘客數
  updateLeftPassengerCount(index: number) {
    // 移除各種 List 項目
    if (index > -1) {
      this.drtsOrderList.splice(index, 1);
      this.selectedPayTypeList.splice(index, 1);
      this.selectedAmountList.splice(index, 1);
      this.selectedCardTypeList.splice(index, 1);
      this.amountOptionsList.splice(index, 1);
    }

    // 計算乘客數
    this.currentPassengerCount = 0;
    this.reservationPassengerCount = 0;
    for (const order of this.drtsOrderList) {
      if (order.OrderType == '即時') {
        this.currentPassengerCount++;
      } else {
        this.reservationPassengerCount++;
        if (order.PickupTime) {
          this.currentPassengerCount++;
        }
      }
    }

    // 重新設定上車人數最大選項, 最大乘客數(maxPassenger) - 目前訂單數(drtsOrderList)
    this.maleCountOptions = [];
    this.femaleCountOptions = [];
    for (let i = 0 ; i <= Math.min(maxPassenger - this.drtsOrderList.length, 5); i++) {
      const option = {value: i};
      this.maleCountOptions.push(option);
      this.femaleCountOptions.push(option);
    }
    this.selectedMaleCount = {value: 0};
    this.selectedFemaleCount = {value: 0};

    // console.log('this.drtsOrderList: ' + JSON.stringify(this.drtsOrderList));
  }

  // 選擇男女上車人數後, 動態修正另一個上車人數, 防止上車人數超過最大乘客數
  pickupCountChange(isMale: boolean) {
    const nowCount = isMale ?
    this.drtsOrderList.length + this.selectedMaleCount.value :
    this.drtsOrderList.length + this.selectedFemaleCount.value;

    if (isMale) {
      this.femaleCountOptions = [];
    } else {
      this.maleCountOptions = [];
    }

    for (let i = 0 ; i <= Math.min(maxPassenger - nowCount, 5); i++) {
      const option = {value: i};
      if (isMale) {
        this.femaleCountOptions.push(option);
      } else {
        this.maleCountOptions.push(option);
      }
    }
  }

  // 等待 google 直到非 undefined
  checkGoogleInit (currentPos) {
    if (this.isMapReady) {
      if (this.currentSequence > 1) {
        const decodePath = google?.maps.geometry?.encoding.decodePath(this.drtsShift.StopList[this.currentSequence - 2].OverviewPolyline);
        // console.log('decodePath[0].lat: ' + decodePath[0]?.lat() + 'decodePath[0].lng: ' + decodePath[0]?.lng());
        // console.log('currentPos.lat: ' + currentPos.lat + 'currentPos.lng: ' + currentPos.lng);

        if (decodePath.length > 0) {
          this.distance = this.managerService.calcDistByLatLng(currentPos.lat, currentPos.lng, decodePath[0].lat(), decodePath[0].lng());
          for (let i = 1; i < decodePath.length; i++) {
            const diff = this.managerService.
              calcDistByLatLng(decodePath[i - 1].lat(), decodePath[i - 1].lng(), decodePath[i].lat(), decodePath[i].lng());
            this.distance += diff;
          }
        }
      } else {
        const decodePath = google?.maps.geometry?.encoding.decodePath(this.nowStop.OverviewPolyline);
        this.distance = this.managerService.calcDistByLatLng(currentPos.lat, currentPos.lng, decodePath[0].lat(), decodePath[0].lng());
      }
    } else {
      setTimeout(() => {
        this.checkGoogleInit(currentPos);
        // console.log('retry checkGoogleInit');
      }, 100);
    }
  }

  onMapReady(map) {
    console.log('map ready!!');
    this.isMapReady = true;
  }

  // 前往下一站畫面 跳到 靠站畫面
  arriveStop() {
    this.reportDRTSShiftAction(DRTSShiftActionType.ARRIVED);
  }

  // 靠站畫面 跳到 前往下一站畫面
  leaveStop() {
    let actionType = null;
    // 開始任務 離站 完成任務
    if (this.currentSequence === this.drtsShift.DepartSequence) {
      actionType = DRTSShiftActionType.START;
    } else if (this.currentSequence === this.drtsShift.LastSequence) {
      actionType = DRTSShiftActionType.COMPLETE;
    } else {
      actionType = DRTSShiftActionType.LEAVE;
    }
    this.reportDRTSShiftAction(actionType);
  }


  // {開始 完成 到站 離站} 動作
  reportDRTSShiftAction(actionType: DRTSShiftActionType) {
    this.confirmModal.hide();
    this.managerService.ShowSpinner();
    this.httpService.reportDRTSShiftAction(this.drtsShift.ID, actionType, this.nowStop).subscribe(
      data => {
        this.managerService.HideSpinner();
        this.httpService.devModeLog('reportDRTSShiftAction', data, false);
        if (data.IsSuccess) {
          // 清除所有選擇的付款方式
          this.selectedPayTypeList = [];
          this.selectedAmountList = [];
          this.selectedCardTypeList = [];
          this.amountOptionsList = [];
          if (actionType === DRTSShiftActionType.ARRIVED) {
            this.showStopPage = true;
          } else {
            // 更新站序與站點資訊
            if (this.currentSequence < this.drtsShift.LastSequence) {
              this.showStopPage = false;
              this.currentSequence++;
              this.updateStopInfo();
            } else {
              console.log('回到 DRTS 主頁面');
              this.managerService.missionMode = MissionType.NULL; // 清除任務模式 狀態
              this.managerService.showToast = 'DRTS 趟次完成 !'; // 回到DRTS主頁面跳出 Toast 的內容
              this.router.navigate(['/drts/dashboard'], {replaceUrl: true});
            }
          }
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

  // 新增即時乘客訂單
  createOrder() {
    this.managerService.ShowSpinner();
    this.httpService.createDRTSOrder(this.drtsShift.ID, this.selectedMaleCount.value,
      this.selectedFemaleCount.value, this.nowStop).subscribe(
      data => {
        this.managerService.HideSpinner();
        this.httpService.devModeLog('createDRTSOrder', data, false);
        if (data.IsSuccess) {
          this.managerService.SuccessToast('已新增訂單');
          this.drtsOrderList = this.drtsOrderList.concat(data.OrderList);
          this.updateLeftPassengerCount(-1);
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

  // 完成即時乘客訂單
  closeOrder(drtsOrder: DRTSOrder) {
    this.orderConfirmModal.hide();
    this.managerService.ShowSpinner();
    const index = this.drtsOrderList.indexOf(drtsOrder);
    drtsOrder.PayType = this.selectedPayTypeList[index] ? this.selectedPayTypeList[index].Name : '';
    drtsOrder.Amount = this.selectedAmountList[index] ? this.selectedAmountList[index].value : 0;
    drtsOrder.CardType = this.selectedCardTypeList[index] ? this.selectedCardTypeList[index].Name : '';

    this.httpService.closeDRTSOrder(this.drtsShift.ID, drtsOrder.ID, drtsOrder.PayType,
      drtsOrder.Amount, drtsOrder.CardType, this.nowStop).subscribe(
      data => {
        this.managerService.HideSpinner();
        this.httpService.devModeLog('closeDRTSOrder', data, false);
        if (data.IsSuccess) {
          this.managerService.SuccessToast('已完成訂單');
          this.updateLeftPassengerCount(index);

          // 減少預約乘客數
          if (drtsOrder.OrderType == '預約') {
            this.dropPassengerCount--;
          }
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

  // 刪除即時乘客訂單
  deleteOrder(drtsOrder: DRTSOrder) {
    this.orderConfirmModal.hide();
    this.managerService.ShowSpinner();
    this.httpService.deleteDRTSOrder(drtsOrder.ID).subscribe(
      data => {
        this.managerService.HideSpinner();
        this.httpService.devModeLog('deleteDRTSOrder', data, false);
        if (data.IsSuccess) {
          this.managerService.SuccessToast('已刪除訂單');
          const index = this.drtsOrderList.indexOf(drtsOrder);
          this.updateLeftPassengerCount(index);
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

  // 預約乘客上車
  rsvDRTSOrderPickup(drtsOrder: DRTSOrder) {
    this.orderConfirmModal.hide();
    this.managerService.ShowSpinner();
    this.httpService.rsvDRTSOrderPickup(drtsOrder.ID, this.nowStop).subscribe(
      data => {
        this.managerService.HideSpinner();
        this.httpService.devModeLog('rsvDRTSOrderPickup', data, false);
        if (data.IsSuccess) {
          this.managerService.SuccessToast('乘客上車!');
          this.currentPassengerCount++;
          this.pickupPassengerCount--;
          const index = this.drtsOrderList.indexOf(drtsOrder);
          // update order
          if (index > -1) {
            this.drtsOrderList[index].RsvStatus = data.RsvStatus;
            this.drtsOrderList[index].PickupTime = data.PickupTime;
          }
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

  // 預約乘客未到
  rsvDRTSOrderNoShow(drtsOrder: DRTSOrder) {
    this.orderConfirmModal.hide();
    this.managerService.ShowSpinner();
    this.httpService.rsvDRTSOrderNoShow(drtsOrder.ID, this.nowStop).subscribe(
      data => {
        this.managerService.HideSpinner();
        this.httpService.devModeLog('rsvDRTSOrderNoShow', data, false);
        if (data.IsSuccess) {
          this.managerService.SuccessToast('已刪除訂單');
          this.pickupPassengerCount--;
          const index = this.drtsOrderList.indexOf(drtsOrder);
          this.updateLeftPassengerCount(index);
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

  // 完成或刪除乘客訂單 再次確認
  orderConfrim(drtsOrder: DRTSOrder, action: string) {
    this.confirmOrder = drtsOrder;
    this.orderConfirmAction = action;
    this.undonePayType = [];
    if (action === '完成') {
      const index = this.drtsOrderList.indexOf(drtsOrder);
      if (!this.selectedPayTypeList[index]) {
        this.undonePayType.push('付款方式');
      }
      if (this.selectedPayTypeList[index]?.Name !== '現金' && !this.selectedCardTypeList[index]) {
        this.undonePayType.push('卡片種類');
      }
      if (!this.selectedAmountList[index]) {
        this.undonePayType.push('金額');
      }
    }
    // console.log('undonePayType: ' + JSON.stringify(this.undonePayType));
    this.orderConfirmModal.show();
  }

  private showAllList() {
    console.log('selectedPayTypeList: ' + JSON.stringify(this.selectedPayTypeList));
    console.log('selectedCardTypeList: ' + JSON.stringify(this.selectedCardTypeList));
    console.log('selectedAmountList: ' + JSON.stringify(this.selectedAmountList));
    console.log('amountOptionsList: ' + JSON.stringify(this.amountOptionsList));
  }

  // 選擇付款種類
  selectPayType(i: number) {
    // 清除選擇的卡種、金額、金額選項
    this.selectedCardTypeList[i] = null;
    this.selectedAmountList[i] = null;
    this.amountOptionsList[i] = [];
    // 重新設定金額選項
    const amountList = this.payTypeList[this.payTypeList.indexOf(this.selectedPayTypeList[i])].AmountList;
    if (amountList.length > 0) {
      for (const amount of amountList) {
        const option = {value: amount};
        this.amountOptionsList[i].push(option);
      }
    }
    // 只有單一金額選項時自動帶入
    if (this.amountOptionsList[i].length == 1) {
      this.selectedAmountList[i] = this.amountOptionsList[i][0];
    }
  }


  // 選擇卡片種類
  selectCardType(i: number) {
    // 清除選擇的金額、金額選項
    this.selectedAmountList[i] = null;
    this.amountOptionsList[i] = [];
    // 重新設定金額選項
    const payType = this.payTypeList[this.payTypeList.indexOf(this.selectedPayTypeList[i])];
    const amountList = payType.CardTypeList[payType.CardTypeList.indexOf(this.selectedCardTypeList[i])].AmountList;
    if (amountList.length > 0) {
      for (const amount of amountList) {
        const option = {value: amount};
        this.amountOptionsList[i].push(option);
      }
    }
    // 只有單一金額選項時自動帶入
    if (this.amountOptionsList[i].length == 1) {
      this.selectedAmountList[i] = this.amountOptionsList[i][0];
    }
  }


  // 回報問題
  reportDRTSIssue() {
    this.reportIssueRequest.RouteName = this.drtsShift.RouteName;
    this.reportIssueRequest.RouteType = this.drtsShift.RouteType;
    this.reportIssueRequest.StopName = this.nowStop.Name;
    this.reportIssueRequest.NextStopName = this.nextStop.Name;
    this.reportIssueRequest.RID = this.drtsShift.RID;
    this.reportIssueRequest.SID = this.drtsShift.ID;
    this.httpService.reportDRTSIssue(this.reportIssueRequest).subscribe(
      data => {
        this.httpService.devModeLog('reportDRTSIssue', data, false);
        this.managerService.HideSpinner();
        if (data.IsSuccess) {
          this.managerService.SuccessToast(data.Reason);
          this.reportModal.hide();
        } else {
          this.managerService.ErrorToast(data.Reason);
        }
      },
      err => {
        this.managerService.HideSpinner();
        this.managerService.ErrorToast(JSON.stringify(err));
      }
    );
  }

  // 關閉 ReportModal
  closeReportModal() {
    this.reportIssueRequest = new ReportDRTSIssueRequest();
    this.reportFU.clear();
    this.reportModal.hide();
  }

  //#region report uploader
  reportClear() {
    this.reportIssueRequest.Base64PhotoList = [];
  }

  reportChange() {
    this.reportIssueRequest.Base64PhotoList = [];
    let i = 0;
    setTimeout(() => {
      for (const file of this.reportFU.files) {
        const reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      }
    }, 10);
  }

  _handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    const base64Photo = btoa(binaryString);
    this.reportIssueRequest.Base64PhotoList.push(base64Photo);
  }
  //#endregion


  setCanMsg($event: SelectItem) {
    this.reportIssueRequest.Description += $event.value;
  }

}
