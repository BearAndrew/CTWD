import { DatePipe } from '@angular/common';
import { ManagerService } from './../../_service/manager.service';
import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { IOrder, ITakenROrder } from '../../_interface/interface';
import { HttpService } from '../../_service/http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {

  @ViewChild('resultModal') public resultModal: ModalDirective;

  cn;
  p: number = 1;
  itemsPerPage: number;
  isMobile: boolean;

  date: Date;
  minDateValue: Date;
  maxDateValue: Date;
  orderList: IOrder[];
  pickList: IOrder[] = [];
  takenList: IOrder[] = [];
  submitResponse: string;
  considerPreference: boolean = true;
  isGetOrderLoading: boolean;

  constructor(private httpService: HttpService,
    public managerService: ManagerService,
    private datepipe: DatePipe,
    private router: Router) {
  }

  ngOnInit(): void {
    this.cn = {
      today: '今天',
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '十一月', '十二月'],
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
      weekHeader: '周',
      firstDayOfWeek: 0
    };

    this.onResize();
    const today = new Date();
    const tommorrow = new Date();
    const maxDate = new Date();
    tommorrow.setDate(today.getDate() + 1);
    this.date = tommorrow;
    this.minDateValue = tommorrow;
    maxDate.setDate(today.getDate() + this.managerService.maxQueryDay);
    this.maxDateValue = maxDate;
    this.availableROrder();
  }

  isEllipsisActive(e) {
    return (e.offsetWidth < e.scrollWidth);
  }


  // 查詢預約池
  availableROrder() {
    this.isGetOrderLoading = true;
    const year = this.date.getFullYear();
    const month = this.date.getMonth() + 1;
    const day = this.date.getDate();
    const queryDate = year + '/' + month + '/' + day;
    // console.log('date: ' + this.date);
    // console.log('queryDate: ' + queryDate);

    this.managerService.ShowSpinner();
    this.pickList = [];

    this.httpService.availableROrder(this.considerPreference, queryDate).subscribe(
      (data) => {
        this.isGetOrderLoading = false;
        this.managerService.HideSpinner();
        this.httpService.devModeLog('availableROrder', data, false);
        if (data.IsSuccess) {
          this.orderList = this.managerService.PassROrderList(data.ROrderList);
          const searchDate = this.date ? this.datepipe.transform(this.date, 'yyyy/MM/dd') : '選擇日期';
          const msg = '查詢從今日到' + searchDate + '之預約';
          this.managerService.InfoToast(msg);
          // console.log(this.orderList);
        } else {
          console.log(data);
        }
      },
      (error) => {
        this.isGetOrderLoading = false;
        this.managerService.HideSpinner();
        console.log(error);
      }
    );
  }


  tryTakenROrder() {
    // const TryTakenROrders = [{ID: '1', LastEditTime: '/Date(1606725193663+0800)/'}];
    this.managerService.ShowSpinner();

    this.httpService.tryTakenROrder(this.pickList).subscribe(
      (data) => {
        this.managerService.HideSpinner();
        this.httpService.devModeLog('tryTakenROrder', data, false);
        if (data.IsSuccess) {
          this.submitResponse = data.Reason;
          for (const takenOrder of data.ConfirmTakenROrders) {
            const index = this.orderList.findIndex(obj => obj.ID === takenOrder.ID);
            if (index !== -1) {
              this.takenList.push(this.orderList[index]);
            }
          }
          this.resultModal.show();
        } else {
          this.managerService.ErrorToast(data.Reason);
          console.log(data);
        }
      },
      (error) => {
        this.managerService.HideSpinner();
        console.log(error);
      }
    );
  }


  pickOrder(order: IOrder) {
    // const pickOrder = { ID: order.ID, LastEditTime: order.LastEditTime };
    if (order.pick) {
      const index = this.pickList.findIndex(obj => obj.ID === order.ID);
      if (index !== -1) {
        this.pickList.splice(index, 1);
      }
    } else {
      this.pickList.push(order);
    }
    order.pick = !order.pick;
  }


  refreshPage() {
    this.pickList = [];
    this.takenList = [];
    this.availableROrder();
    this.resultModal.hide();
  }

  confirmResult() {
    this.router.navigate(['/dashboard'], { replaceUrl: true });
  }


  pageChanged($event) {
    this.p = $event;
    window.scroll(0, 0);
  }

  onResize() {
    const md = 768;
    const lg = 992;
    const xl = 1200;
    this.isMobile = (window.innerWidth < md) ? true : false;
  }

}
