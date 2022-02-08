import { Subscription } from 'rxjs';
import { IOrder } from './../../_interface/interface';
import { ManagerService } from './../../_service/manager.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy {

  myOrderList: IOrder[];
  date: string = '2021/04/30';
  intervalList: object[] = []; // 時間區間 list (顯示時間占用條)

  getMyOrderListSub: Subscription;

  constructor(public managerService: ManagerService) {
    this.getMyOrderListSub = this.managerService.getMyOrderList().subscribe((data) => {
      this.myOrderList = data;
      console.log('timeline myOrderList: ' + JSON.stringify(this.myOrderList));
      this.setSchedule();
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.getMyOrderListSub?.unsubscribe();
  }


  setSchedule() {
    for (const order of this.myOrderList) {
      if (order.ReservationTimeString.includes(this.date)) {
        this.calcPercent(order.ReservationTime, order.EstDuration);
      }
    }
  }



  calcPercent(startDate: Date, duration: number) {
    const startAt: string = this.timeStartPercent(startDate);
    const length: string = duration * 100 / (60 * 60 * 24) + '%';
    console.log('startAt: ' + startAt + ', length: ' + length);
    this.intervalList.push({ width: length, left: startAt });
  }



  // 計算時間起始百分比
  timeStartPercent(startDate: Date) {
    const dayStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const dayEnd = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1);

    const percent = ((startDate.getTime() - dayStart.getTime()) / (dayEnd.getTime() - dayStart.getTime())) * 100 + '%';
    console.log('startDate: ' + startDate + ', percent: ' + percent);
    return percent;
  }

}
