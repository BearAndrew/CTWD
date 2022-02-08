import { IOrder, Search, SearchYearMonth } from './../../_interface/interface';
import { ManagerService } from './../../_service/manager.service';
import { HttpService } from '../../_service/http.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {

  orderList: IOrder[];

  p: number;
  itemsPerPage: number;

  isSearchCollapse: boolean = true;
  seacrh: Search = new Search();
  dateList: SearchYearMonth[];

  constructor(private httpService: HttpService, public managerService: ManagerService) {
    this.managerService.ShowSpinner();

    this.httpService.dROrderHistoryRecord().subscribe(
      (data) => {
        this.httpService.devModeLog('dROrderHistoryRecord', data, false);
        this.managerService.HideSpinner();
        if (data.IsSuccess) {
          this.orderList = this.managerService.PassROrderList(data.ROrderList);

        } else {
          console.log(data);
        }
      },
      (error) => {
        this.managerService.HideSpinner();
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.onResize();
    this.searchTimeInit();
  }


  pageChanged($event) {
    this.p = $event;
    window.scroll(0, 0);
  }


  onResize() {
    const md = 768;
    const lg = 992;
    const xl = 1200;
    if (window.innerWidth < md) {
      this.itemsPerPage = 10;
    } else if (window.innerWidth >= md && window.innerWidth < lg) {
      this.itemsPerPage = 6;
    } else if (window.innerWidth >= lg && window.innerWidth < xl) {
      this.itemsPerPage = 9;
    } else if (window.innerWidth >= xl) {
      this.itemsPerPage = 12;
    }
    // console.log('window.innerWidth: ' + window.innerWidth + ', this.itemsPerPage: ' + this.itemsPerPage);
  }


  searchTimeInit() {
    this.dateList = [];
    for (let year = 0; year < 10; year++) {
      for (let month = 1; month <= 12; month++) {
        const time = { value: (year + new Date().getFullYear()).toString() + '/' + month.toLocaleString('en-US', {
          minimumIntegerDigits: 2})};
        this.dateList.push(time);
      }
    }
  }


  // 查詢內容更改時，跳到第一頁
  searchChanged() {
    this.p = 1;
  }

}
