import { HttpService } from './http.service';
import { DRTSShift, ExecuteDRTSShiftResponse, MyDRTSShiftListResponse } from './../_interface/drts-interface';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { DDashboardInfoResponse, IOrder, IROrder, MissionType } from './../_interface/interface';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { DRTSPayType } from '../_interface/drts-interface';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  public missionMode: MissionType = MissionType.NULL; // 是否正在進行任務 CTWD. DRTS. SBIR
  public IsAuthExpired: boolean = false;
  public showToast: string = ''; // 跳頁面顯示 Toast 訊息
  public userName: string = '';
  public UnreadMessagesCount: number = 0; // 未讀訊息數量
  public maxQueryDay: number; // 最多搜尋預約天數
  public dontCallmyDRTSShiftList: boolean = true; // 防止第一次進入畫面呼叫兩次

  private myOrderListSubject: ReplaySubject<IOrder[]> = new ReplaySubject<IOrder[]>();
  private drtsShiftListSubject: ReplaySubject<MyDRTSShiftListResponse> = new ReplaySubject<MyDRTSShiftListResponse>();
  private executeDRTSShiftSubject: ReplaySubject<ExecuteDRTSShiftResponse> = new ReplaySubject<ExecuteDRTSShiftResponse>();

  constructor(
    private router: Router,
    private messageService: MessageService,
    private httpService: HttpService,
    private datepipe: DatePipe,
    private spinner: NgxSpinnerService) {
  }

  // 根據訂單狀態顯示對應顏色
  StatusStyle(status: string): object {
    let bgColor = '#6c757d';

    switch (status) {
      case '已發佈':
        bgColor = '#6f42c1';
        break;
      case '即將過期':
        bgColor = '#f86c6b';
        break;
      case '待執行':
        bgColor = '#ffc107';
        break;
      case '前往中':
        bgColor = '#63c2de';
        break;
      case '已到達':
        bgColor = '#20a8d8';
        break;
      case '旅程中':
        bgColor = '#007bff';
        break;
      case '已完成':
        bgColor = '#28a745';
        break;
      case '已取消':
        bgColor = '#dc3545';
        break;
      case '已過期':
        bgColor = '#dc3545';
        break;
      default:
    }
    return { color: 'white', backgroundColor: bgColor, fontSize: '100%' };
  }

  //#region Toast
  // 成功提示
  SuccessToast(detail: string, summary: string = '成功') {
    this.CustomToast(detail, summary, 'success');
  }

  // 一般提示
  InfoToast(detail: string, summary: string = '提示') {
    this.CustomToast(detail, summary, 'info', 3000);
  }

  // 錯誤提示
  ErrorToast(detail: string, summary: string = '錯誤') {
    this.CustomToast(detail, summary, 'error', 8000);
  }

  // 警告提示
  WarningToast(detail: string, summary: string = '提示') {
    this.CustomToast(detail, summary, 'warn');
  }

  // 自定義提示
  CustomToast(detail: string, summary: string, severity: string = 'info', life: number = 5000, sticky: boolean = false) {
    // Severity level of the message, valid values are 'success', 'info', 'warn' and 'error'.
    this.messageService.add({ key: 'toast', detail: detail, summary: summary, severity: severity, life: life, sticky: sticky });
  }

  // 清除所有提示
  ClearToast() {
    this.messageService.clear();
  }
  //#endregion

  // ROrder 轉換成 Order
  PassROrderList(rOrderList: IROrder[]): IOrder[] {
    const orderList = rOrderList as IOrder[];
    for (const order of orderList) {
      order.ReservationTime = new Date(Math.floor(Number(order.ReserveTime.match(/\d/g).join('')) / 1e4));
      order.ReservationTimeString = this.datepipe.transform(order.ReservationTime, 'yyyy/MM/dd HH:mm');
      order.DemandObject = JSON.parse(order.Demand);
      order.pick = false;
    }
    return orderList;
  }

  StringToDate(timeString: string) {
    return new Date(Math.floor(Number(timeString.match(/\d/g).join('')) / 1e4));
  }


  //#region spinner
  ShowSpinner() {
    this.spinner.show();
  }

  HideSpinner() {
    this.spinner.hide();
  }
  //#endregion



  calcDistByLatLng(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371; // km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lng2 - lng1);
    const lat1Rad = this.toRad(lat1);
    const lat2Rad = this.toRad(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }

  // Converts numeric degrees to radians
  toRad(Value: number) {
    return Value * Math.PI / 180;
  }


  // 取得 dashboard 資訊
  getDashboardInfo(): Promise<DDashboardInfoResponse> {
    return new Promise((resolve, reject) => {
      this.httpService.dDashboardInfo().subscribe(
        data => {
          // this.httpService.devModeLog('dDashboardInfo', data, false);
          if (data.IsSuccess) {
            resolve(data);
            const myOrderList = this.PassROrderList(data.ROrderList);
            this.setMyOrderList(myOrderList);
            this.UnreadMessagesCount = data.UnreadMessagesCount;

            // 檢查目前是否有執行中的任務
            for (const o of myOrderList) {
              if ((o.Status === '前往中' ||
                  o.Status === '已到達' ||
                  o.Status === '旅程中')
              ) {
                this.router.navigate(['/mission'], {replaceUrl: true});
                this.missionMode = MissionType.CWTD;
              }
            }
          } else {
            reject(data.Reason);
            this.ErrorToast(data.Reason);
            console.log(data);
          }
        },
        err => {
          reject(err);
          this.ErrorToast(err);
          console.log('dDashboardInfo error: ' + err);
        }
      );
    });
  }
  // 取得.設定 CWTD OrderList
  getMyOrderList(): Observable<IOrder[]> {
    return this.myOrderListSubject.asObservable();
  }
  setMyOrderList(orderList: IOrder[]) {
    this.myOrderListSubject.next(orderList);
  }



  // myDRTSShiftList request
  myDRTSShiftList(): Promise<MyDRTSShiftListResponse> {
    this.ShowSpinner();
    const dateTime = new Date();
    const dateTimeString = this.datepipe.transform(dateTime, 'yyyy/MM/dd');
    return new Promise((resolve, reject) => {
      this.httpService.myDRTSShiftList(dateTimeString).toPromise().then(
        data => {
          this.HideSpinner();
          this.httpService.devModeLog('myDRTSShiftList', data, false);
          this.drtsShiftListSubject.next(data);
          if (data.IsSuccess) {
            resolve(data);
            for (const shift of data.ShiftList) {
              if (shift.Status === '執行中') {
                this.executeDRTSShift(shift.ID);
                break;
              }
            }
          } else {
            this.ErrorToast(data.Reason);
            console.log(data.Reason);
            reject(data.Reason);
          }
        },
        err => {
          this.HideSpinner();
          this.ErrorToast(err);
          console.log('myDRTSShiftList error: ' + err);
          reject(err);
        }
      );
    });
  }
  // 取得執行中 DRTS Shift 詳細資料, 並路由至 drts/mission
  executeDRTSShift(sid: number) {
    this.ShowSpinner();
    this.httpService.executeDRTSShift(sid).subscribe(
      data => {
        this.httpService.devModeLog('executeDRTSShift', data, false);
        if (data.IsSuccess) {
          this.missionMode = MissionType.DRTS;
          this.executeDRTSShiftSubject.next(data);
          this.router.navigate(['drts/mission'], {replaceUrl: true});
        } else {
          this.HideSpinner();
          this.ErrorToast(data.Reason);
        }
      },
      err => {
        this.HideSpinner();
        this.ErrorToast(err);
        console.log('executeDRTSShift err: ' + err);
      }
    );
  }
  getDRTSShiftList(): Observable<MyDRTSShiftListResponse> {
    return this.drtsShiftListSubject.asObservable();
  }
  getExecuteDRTSShift(): Observable<ExecuteDRTSShiftResponse> {
    return this.executeDRTSShiftSubject.asObservable();
  }


  // 檢查Email格式
  ValidateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}
