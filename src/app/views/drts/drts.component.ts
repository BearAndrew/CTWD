import { DRTSShift } from './../../_interface/drts-interface';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../_service/http.service';
import { ManagerService } from '../../_service/manager.service';
import { interval, Subscription } from 'rxjs';

interface IHourMin {
  hour: number;
  min: number;
}

@Component({
  selector: 'app-drts',
  templateUrl: './drts.component.html',
  styleUrls: ['./drts.component.scss']
})
export class DrtsComponent implements OnInit {

  p: number = 1;
  itemsPerPage: number;

  completeCount: number;
  unfinishedCount: number;
  drtsShiftList: ((DRTSShift & {RestTime: IHourMin}) | DRTSShift)[] = [];
  executedDrtsShift: DRTSShift;

  timerSub: Subscription;

  constructor(private httpService: HttpService, private router: Router, private route: ActivatedRoute,
      public managerService: ManagerService) {

    this.managerService.ShowSpinner();

    // dontCallmyDRTSShiftList 用來防止第一次進入頁面呼叫兩次
    if (this.managerService.dontCallmyDRTSShiftList) {
      this.managerService.getDRTSShiftList().subscribe(
        data => {
          this.managerService.HideSpinner();
          if (data.IsSuccess) {
            this.unfinishedCount = data.UnfinishedCount;
            this.completeCount = data.CompleteCount;
            this.drtsShiftList = data.ShiftList;
            this.getRestTime()
            this.timerOfCalcRestTime();
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
      this.myDRTSShiftList();
    }

    // 完成 DRTS 任務時顯示提示
    if (this.managerService.showToast !== '') {
      setTimeout(() => {
        this.managerService.SuccessToast(this.managerService.showToast);
        this.managerService.showToast = '';
      }, 500);
    }
  }

  ngOnInit(): void {
    this.onResize();
  }

  ngOnDestroy(): void {
    if (this.timerSub) { this.timerSub.unsubscribe(); }
  }


  onResize() {
    const md = 768;
    const lg = 992;
    const xl = 1200;
    if (window.innerWidth < md) {
      this.itemsPerPage = 8;
    } else if (window.innerWidth >= md && window.innerWidth < lg) {
      this.itemsPerPage = 6;
    } else if (window.innerWidth >= lg && window.innerWidth < xl) {
      this.itemsPerPage = 6;
    } else if (window.innerWidth >= xl) {
      this.itemsPerPage = 9;
    }
  }

  pageChanged($event) {
    this.p = $event;
    window.scroll(0, 0);
  }


  showDetail(drtsShift: DRTSShift) {
    this.executedDrtsShift = drtsShift;
  }


  myDRTSShiftList() {
    this.managerService.myDRTSShiftList().then(
      resolve => {
        this.managerService.HideSpinner();
        this.unfinishedCount = resolve.UnfinishedCount;
        this.completeCount = resolve.CompleteCount;
        this.drtsShiftList = resolve.ShiftList;
        this.getRestTime();
        this.timerOfCalcRestTime();
      },
      reject => {
        this.managerService.HideSpinner();
        this.managerService.ErrorToast(reject);
      }
    );
  }



  timerOfCalcRestTime() {
    if (this.timerSub == null)
    this.timerSub = interval(10000).subscribe(
      ()=>  {
        this.getRestTime();
    });
  }



  // 執行 DRTS 訂單
  executeDRTSShift(sid: number) {
    this.managerService.ShowSpinner();
    this.managerService.executeDRTSShift(sid);
  }


  calcRestTime(reservationTimeString: string): IHourMin {
    let reservationTime = new Date(reservationTimeString);
    let diff = (reservationTime.getTime() - Date.now()) / 1000;
    const hours = Math.floor(diff / 60 / 60);
    diff -= hours * 60 * 60;
    const minutes = Math.floor(diff / 60);
    const restTime = {hour: hours, min: minutes};
    return restTime;
  }

  getRestTime() {
    for (let i = 0; i < this.drtsShiftList.length; i++) {
      const restTime = this.calcRestTime(this.drtsShiftList[i].DepartTime);
      this.drtsShiftList[i] = Object.assign(this.drtsShiftList[i], {RestTime: restTime});
    }
  }
}
