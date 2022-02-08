import { ManagerService } from './../../_service/manager.service';
import { IMessage, IOrder, MissionType } from './../../_interface/interface';
import { HttpService } from '../../_service/http.service';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { navItems } from '../../_nav';
import { AuthenticationService } from '../../_service/authentication.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;

  messages: IMessage[];
  isMessagesLoading: boolean;
  private isAsideMenuShow = false;
  private isSidebarShow = false;

  myOrderList: IOrder[];
  isStartTimer: boolean = false;
  timerSub: Subscription;

  constructor(private authenticationService: AuthenticationService,
    public managerService: ManagerService,
    private httpService: HttpService,
    private router: Router,
    private datepipe: DatePipe) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // 正在進行任務時，轉跳到任務頁面
        if (managerService.missionMode !== MissionType.NULL) {
          if (event.url !== '/mission' && managerService.missionMode === MissionType.CWTD) {
            this.router.navigate(['/mission'], {replaceUrl: true});
          } else if (event.url !== '/drts/mission' && managerService.missionMode === MissionType.DRTS) {
            this.router.navigate(['drts/mission'], {replaceUrl: true});
          }
        }
        console.log('event.url: + ' + event.url);
        this.callEveryRoute();
    }});

    this.getDRTSShiftList();

  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit(): void {
    // 監控AsideMenu開啟
    const body = document.getElementsByTagName('body')[0];
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const asideToggleState = body.classList.contains('aside-menu-lg-show') && body.classList.contains('aside-menu-show');
          // 現在有顯示Aside Menu了
          if (asideToggleState) {
            if (this.isAsideMenuShow === false) {
              // 載入訊息列表
              this.loadMessages();
              body.classList.remove('sidebar-show');
            }
          } else {
            if (this.isAsideMenuShow === true) {
              const idx = this.messages.findIndex(m => m.IsNew === true);
              if (idx > -1) {
                // 回報訊息已讀取
                this.readMessages();
              }
            }
          }
          this.isAsideMenuShow = asideToggleState;
          // console.log('asideToggleState: ' + asideToggleState, ', this.isAsideMenuShow: ' + this.isAsideMenuShow);


          // sidebar 狀態
          const sidebarToggleState = body.classList.contains('sidebar-show');
          if (sidebarToggleState && !this.isSidebarShow) {
            this.callEveryRoute();
            body.classList.remove('aside-menu-show');
            body.classList.remove('aside-menu-lg-show');
          }
          this.isSidebarShow = sidebarToggleState;


          // 手機版 sidebar 和 aside-menu 開啟時, 鎖定 body scroll
          const mobileState = body.classList.contains('sidebar-show') || body.classList.contains('aside-menu-show');
          if (mobileState && !body.classList.contains('overflow-hidden')) {
            body.classList.add('overflow-hidden');
          }

          // 關閉 sidebar 和 aside-menu 時, 取消鎖定 body scroll
          if (body.classList.contains('overflow-hidden') && !body.classList.contains('sidebar-show')
          && !body.classList.contains('aside-menu-show')) {
            body.classList.remove('overflow-hidden');
          }


        }
      });
    });
    observer.observe(body, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['class']
    });

    // 手機版點擊 main, 關閉 sidebar 和 (aside-menu並回報已讀), 取消 body 鎖定 scroll
    const main = document.querySelector('main');
    main.addEventListener('click', (e) => {
      if (body.classList.contains('aside-menu-show')) {
        body.classList.remove('aside-menu-show');
        body.classList.remove('aside-menu-lg-show');
        const idx = this.messages.findIndex(m => m.IsNew === true);
        if (idx > -1) {
          // 回報訊息已讀取
          this.readMessages();
        }
      } else if (body.classList.contains('sidebar-show')) {
        body.classList.remove('sidebar-show');
      }
    });
  }


  // 每次路由都呼叫
  callEveryRoute() {
    // this.managerService.getDashboardInfo();
    // 在 sidebar 中顯示 DRTS 班次數量
    this.httpService.myDRTSShiftCount().subscribe(
      (res) => {
        if (res.Count > 0 && document.getElementsByClassName('drts').length > 0) {
          if (!document.getElementById('drts-count')) {
            document.getElementsByClassName('drts')[0].insertAdjacentHTML('beforeend',
            '<div class="badge badge-danger" id="drts-count" style="position: absolute;top: 18px;right: -185px; z-index: 1000">'
            + res.Count
            + '</div>');
          } else {
            document.getElementById('drts-count').innerHTML = res.Count.toString();
          }
        } else if (res.Count === 0 && document.getElementById('drts-count')) {
          console.log(document.getElementById('drts-count'));
          document.getElementById('drts-count').outerHTML = '';
        }
      }
    );
  }

  // 載入訊息
  loadMessages() {
    this.isMessagesLoading = true;
    this.httpService.dMessages().subscribe(
      (data) => {
        this.isMessagesLoading = false;
        this.httpService.devModeLog('dMessages', data, false);
        if (data.IsSuccess) {
          this.messages = data.Messages;
        }
      },
      (error) => {
        console.log(error);
        this.isMessagesLoading = false;
      }
    );
  }

  // 回報訊息已讀取
  readMessages() {
    this.httpService.dMessageReaded().subscribe(
      (data) => {
        this.httpService.devModeLog('dMessageReaded', data, false);
        if (data.IsSuccess) {
          this.managerService.UnreadMessagesCount = 0;
        }
      },
      (error) => { console.log(error); }
    );
  }

  // 顯示Aside Menu
  showAsideMenu() {
    const body = document.getElementsByTagName('body')[0];
    if (body.classList.contains('aside-menu-show')) {
      body.classList.remove('aside-menu-show');
      body.classList.remove('aside-menu-lg-show');
    } else {
      body.classList.add('aside-menu-show');
      body.classList.add('aside-menu-lg-show');
    }
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  // 開啟連結
  openLink(message: IMessage) {
    if (message.LinkOpenNewWindow) {
      const win = window.open(message.LinkUrl, '_blank');
      win.focus();
    } else {
      window.open(message.LinkUrl, '_self', null);
    }
  }



// 取得 DRTS ShiftList 資訊
  getDRTSShiftList() {
    this.managerService.myDRTSShiftList().then(
      () => {
        setTimeout(() => {
          this.managerService.dontCallmyDRTSShiftList = false;
        }, 200);
      }
    );
  }




  // 登出
  logout() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('aside-menu-show');
    body.classList.remove('aside-menu-lg-show');
    this.authenticationService.logout();
  }


}
