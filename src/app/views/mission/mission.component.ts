import { ManagerService } from './../../_service/manager.service';
import { Router } from '@angular/router';
import { HttpService } from '../../_service/http.service';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { timer, Subscription } from 'rxjs';
import { IOrder, MissionType } from '../../_interface/interface';
import { ModalDirective } from 'ngx-bootstrap/modal';

interface IIssue {
  name: string;
}

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.scss']
})
export class MissionComponent implements OnInit , OnDestroy {

  @ViewChild('infoPanel') infoPanel: ElementRef;
  @ViewChild('checkDistModal') checkDistModal: ModalDirective;

  orderList: IOrder[];
  order: IOrder;
  taxiFee: number;
  issueType: IIssue;
  issueTypeList: IIssue[] = [
    {name: '未見乘客'},
    {name: '車輛故障'},
    {name: '延後到達'},
    {name: '乘客問題'}
  ];
  memo: string;

  // map
  mapHeight: number;
  fitBounds: boolean = true;
  current = {
    pos: {
      lat: 0,
      lng: 0
    },
    icon: {
      url: './assets/img/current-location.png',
      scaledSize: {width: 25, height: 25},
    }
  };
  puLabelOptions = {
    color: 'black',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    text: '上車點'
  };
  dpLabelOptions = {
    color: 'black',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    text: '下車點'
  };

  // direction
  dirDst: google.maps.LatLngLiteral;
  renderOptions = {
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: 'rgba(50, 100, 200, 1)',
      strokeWeight: 5,
    }
  };
  markerOptions = {
  };


  isStartTimer: boolean = false;
  timerSub: Subscription = new Subscription();

  constructor(private httpService: HttpService, private router: Router, private managerService: ManagerService) {
    this.managerService.ShowSpinner();
  }

  ngOnInit(): void {
    this.getDashboardInfo();
  }


  ngOnDestroy() {
    console.log('stop timer');
    this.timerSub.unsubscribe();
  }

  getDashboardInfo() {
    this.managerService.ShowSpinner();
    this.httpService.dDashboardInfo().subscribe(
      (data) => {
        // this.httpService.devModeLog('dDashboardInfo', data, false);
        this.managerService.HideSpinner();
        if (data.IsSuccess) {
          this.orderList = this.managerService.PassROrderList(data.ROrderList);

          // 檢查目前是否有執行中的任務
          for (const o of this.orderList) {
            if (o.Status === '前往中') {
              this.order = o;
              this.order.StatusCode = 1;
            } else if (o.Status === '已到達') {
              this.order = o;
              this.order.StatusCode = 2;
            } else if (o.Status === '旅程中') {
              this.order = o;
              this.order.StatusCode = 3;
            }
          }
          // 若沒有執行中的任務，跳回主控台
          if (!this.order) {
            this.router.navigate(['/dashboard'], { replaceUrl: true });
          }
          this.checkGeolocation();

        } else {
          this.managerService.ErrorToast(data.Reason);
          console.log(data);
        }
      },
      (error) => {
        this.managerService.HideSpinner();
        this.managerService.ErrorToast(error);
        console.log(error);
      }
    );
  }


  // 檢查是否有定位
  checkGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.current.pos.lat = position.coords.latitude;
        this.current.pos.lng = position.coords.longitude;
        console.log('this.currentPos: ' + JSON.stringify(this.current.pos));
      });
      this.countdownTimer();
      // this.setTimeoutTimer();
    } else {
      setTimeout(() => {
        this.managerService.CustomToast('定位未允許', '錯誤', 'error', 4000, true);
      }, 500);
      console.log('Geolocation is not supported by this browser.');
    }
  }


  mapResize() {
    this.mapHeight = window.innerHeight - this.infoPanel.nativeElement.offsetHeight - 105;
    console.log('window.innerHeight: ' + window.innerHeight + ', this.mapHeight: ' + this.mapHeight);
  }


  onMapReady(map) {
    console.log('map ready!!');
    this.mapResize();

    // map.controls[google.maps.ControlPosition.TOP_CENTER].push(document.getElementById('info-panel'));
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(document.getElementById('btn-panel'));

    this.showInstructions();
    let isMapAllComplete = false;
    map.addListener('idle', () => {
      if (!isMapAllComplete) {
        isMapAllComplete = true;
        this.managerService.HideSpinner();
      }
    });
  }


  drawDirection() {
    this.dirDst = (this.order.StatusCode <= 2) ?
      { lat: this.order.PULat, lng: this.order.PULng} :
      { lat: this.order.DPLat, lng: this.order.DPLng};
  }


  // 上方顯示提示訊息
  showInstructions() {
    let text = '';
    if (this.order.StatusCode === 1) {
      text = '前往上車地點';
    } else if (this.order.StatusCode === 2) {
      text = '等待乘客上車';
    } else if (this.order.StatusCode === 3) {
      text = '前往下車地點';
    }
    // console.log('this.order.StatusCode: ' + this.order.StatusCode);
    this.managerService.ClearToast();
    this.managerService.CustomToast(text, '提示', 'info', 4000, true);
  }


  // 計時器，定時回報軌跡
  countdownTimer() {
    console.log('start timer');
    if (!this.isStartTimer) {
      this.isStartTimer = true;
      this.timerSub = timer(5000, 5000).subscribe(() => {
        this.reportTrack();
      });
    }
  }

  // setTimeout計時器
  setTimeoutTimer() {
    setTimeout(() => {
      this.reportTrack();
    }, 5000);
  }


  // 回報軌跡
  reportTrack() {
    navigator.geolocation.getCurrentPosition(position => {
      const track = {
        Acc: position.coords.accuracy,
        Hdg: position.coords.heading,
        Lat: position.coords.latitude,
        Lng: position.coords.longitude,
        Spd: position.coords.speed,
        Tim: position.timestamp,
      };

      this.current.pos.lat = position.coords.latitude;
      this.current.pos.lng = position.coords.longitude;
      console.log('this.currentPos: ' + JSON.stringify(this.current.pos));

      if (!this.order) { return; }
      this.httpService.reportROrderTrack(this.order.ID, track).subscribe(
        (data) => {
          this.fitBounds = false;
          this.httpService.devModeLog('reportROrderTrack', data, false);
          // this.setTimeoutTimer();
          // 若已取消，返回主控台
          if (data.IsCancel) {
            this.returnToDashboard(data.Reason);
          }
        },
        (error) => { console.log(error); }
      );
    });
  }


  // 改變狀態
  changeStatusCode() {
    this.managerService.ShowSpinner();
    // status code 1(執行)=>2(抵達) , 2(抵達)=>3(上車), 3(上車)=>0(完成)
    this.order.StatusCode = (this.order.StatusCode === 3) ? 0 : this.order.StatusCode + 1;

    this.httpService.reportROrderStatus(this.order.ID, this.order.StatusCode, this.taxiFee, this.current.pos.lat, this.current.pos.lng)
    .subscribe(
      (data) => {
        this.httpService.devModeLog('reportROrderStatus', data, false);
        if (data.IsSuccess) {
          this.mapResize();
          this.managerService.HideSpinner();
          // 若已取消，返回主控台
          if (data.IsCancel) {
            this.returnToDashboard(data.Reason);
          }
          this.drawDirection(); // 重劃路線
          // 修改暫存
          if (this.order.StatusCode === 0) { // 任務完成
            this.returnToDashboard(data.Reason);
          } else {
            this.showInstructions();
            // this.managerService.SuccessToast(data.Reason);
            localStorage.setItem('order', JSON.stringify(this.order));
          }
        } else {
          this.managerService.ErrorToast(data.Reason);
          console.log(data);
        }
      },
      (error) => {
        this.managerService.HideSpinner();
        this.managerService.ErrorToast(JSON.stringify(error));
        console.log(error);
      }
    );
  }


  // 確認目前位置與乘客上下車位置距離
  checkDist() {
    // status code 1(執行)=>2(抵達) , 2(抵達)=>3(上車), 3(上車)=>0(完成)
    let dist = 0;
    // 抵達和上車時，檢查距離上車地點距離
    if (this.order.StatusCode === 1 || this.order.StatusCode === 2) {
      dist = this.managerService.calcDistByLatLng(this.current.pos.lat, this.current.pos.lng, this.order.PULat, this.order.PULng);
    // 下車時，檢查距離下車地點距離
    } else if (this.order.StatusCode === 3) {
      dist = this.managerService.calcDistByLatLng(this.current.pos.lat, this.current.pos.lng, this.order.DPLat, this.order.DPLng);
    }

    // 若距離大於300公尺，跳出提示框；小於則正常執行
    if (dist > 0.3) {
      this.checkDistModal.show();
    } else {
      this.changeStatusCode();
    }
  }



  returnToDashboard(msg: string) {
    this.managerService.missionMode = MissionType.NULL; // 清除任務模式 狀態
    this.managerService.showToast = msg; // 回到主頁面跳出 Toast 的內容
    localStorage.removeItem('order');
    this.router.navigate(['/dashboard'], {replaceUrl: true});
  }


  reportIssue() {
    this.managerService.ShowSpinner();
    this.httpService.issueReport(this.issueType.name, this.memo, this.order.ID).subscribe(
      (data) => {
        this.managerService.HideSpinner();
        this.httpService.devModeLog('issueReport', data, false);
        if (data.IsSuccess) {
          this.managerService.SuccessToast(data.Reason);
          this.issueType = null;
          this.memo = '';
        } else {
          this.managerService.ErrorToast(data.Reason);
        }
      },
      (error) => {
        this.managerService.HideSpinner();
        console.log(error);
      }
    );
  }

}
