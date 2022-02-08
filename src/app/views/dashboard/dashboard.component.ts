import { interval, Subscription, timer } from 'rxjs';
import { ManagerService } from './../../_service/manager.service';
import { HttpService } from '../../_service/http.service';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { IOrder, MissionType } from '../../_interface/interface';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  @ViewChild('myModal') public myModal: ModalDirective;
  p: number = 1;
  itemsPerPage: number;
  orderList: IOrder[];
  lat: number;
  lng: number;


  constructor(private httpService: HttpService, private router: Router, public managerService: ManagerService) {
    this.managerService.ShowSpinner();
    this.managerService.getDashboardInfo();
    this.managerService.getMyOrderList().subscribe(
      data => {
        this.managerService.HideSpinner();
        this.orderList = data;
      },
      error => {
        console.log('dashboard get orderlist error: ' + error);
      }
    );

    // 顯示任務完成提示
    if (this.managerService.showToast !== '') {
      setTimeout(() => {
        this.managerService.SuccessToast(this.managerService.showToast);
        this.managerService.showToast = '';
      }, 500);
    }

  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(position => {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      // const dist = this.managerService.calcDistByLatLng(this.lat, this.lng, this.orderList[0].PULat, this.orderList[0].PULng);
      // console.log('現在: ' + 'lat: ' + this.lat + ', lng: ' + this.lng);
      // console.log('目標: ' + 'lat: ' + this.orderList[0].PULat + ', lng: ' + this.orderList[0].PULng);
      // console.log('距離: ' + dist);
    });
  }

  // 執行訂單
  executeOrder(pickOrder: IOrder) {
    // StatusCode = 1 (執行訂單), TaxiFee useless
    this.httpService.reportROrderStatus(pickOrder.ID, 1, 0, this.lat, this.lng).subscribe(
      (data) => {
        this.httpService.devModeLog('reportROrderStatus', data, false);
        if (data.IsSuccess) {
          pickOrder.StatusCode = 1;
          this.router.navigate(['/mission'], { replaceUrl: true });
          this.managerService.missionMode = MissionType.CWTD;
        } else {
          this.managerService.ErrorToast(data.Reason);
          console.log(data);
        }
      },
      (error) => {
        this.managerService.ErrorToast(error);
        console.log(error);
      }
    );
  }


  pageChanged($event) {
    this.p = $event;
    window.scroll(0, 0);
  }

  refresh() {
    this.managerService.ShowSpinner();
    this.managerService.getDashboardInfo();
  }

}
