import { ManagerService } from './../../_service/manager.service';
import { IOrder, Search } from './../../_interface/interface';
import { Component, ElementRef, Input, OnInit, Output, EventEmitter, ViewChild, SimpleChange } from '@angular/core';
import { interval, Subscription } from 'rxjs';

interface IHourMin {
  hour: number;
  min: number;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  @Input() parent: String;
  @Input() orderList: (IOrder & { RestTime: IHourMin } | IOrder) [];
  @Input() search?: Search;
  @Input() p: number;
  @Output() execute = new EventEmitter<IOrder>();
  @Output() pickReservation = new EventEmitter<IOrder>();

  itemsPerPage: number;
  collapsed: boolean = false;
  isExecuteReady: boolean = false;
  timerSub: Subscription;

  @ViewChild('detailModal', {static: false}) detailModal: any;
  selectedOrder: IOrder;

  constructor(public managerService: ManagerService) { }

  ngOnInit(): void {
    this.onResize();
  }


  ngOnChanges(changes: SimpleChange): void {
    // console.log(changes['orderList']);
    if (changes['orderList'].currentValue && changes['orderList'].currentValue.length > 0) {
      for (const order of changes['orderList'].currentValue) {
        order.RestTime = this.calcRestTime(order.ReservationTime);
      }
      if (this.timerSub == null)
      this.timerSub = interval(10000).subscribe(
        ()=>  {
          for (let order of this.orderList) {
            const restTime = this.calcRestTime(order.ReservationTime);
            order = Object.assign(order, {RestTime: restTime});
          }
      });
    }
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

  calcRestTime(reservationTime: Date): IHourMin {
    let diff = (reservationTime.getTime() - Date.now()) / 1000;
    const hours = Math.floor(diff / 60 / 60);
    diff -= hours * 60 * 60;
    const minutes = Math.floor(diff / 60);
    const restTime = {hour: hours, min: minutes};
    // console.log(restTime);
    return restTime;
  }


  showDetail(order: IOrder, executeReady: boolean) {
    this.collapsed = false;
    this.selectedOrder = order;
    this.isExecuteReady = executeReady;
    this.detailModal.show();
  }

  executeOrder(order: IOrder) {
    this.isExecuteReady = false;
    this.execute.emit(order);
  }

  pickReservationOrder(pickOrder: IOrder) {
    this.pickReservation.emit(pickOrder);
  }
}
