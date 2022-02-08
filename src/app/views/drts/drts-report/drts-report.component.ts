import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { MenuItem } from 'primeng/api/menuitem';
import { FileUpload } from 'primeng/fileupload';
import { DRTSReportRecord, LoadDRTSPhotoType, MaintRequest, PhysExamRequest } from '../../../_interface/drts-interface';
import { HttpService } from '../../../_service/http.service';
import { ManagerService } from '../../../_service/manager.service';

@Component({
  selector: 'app-drts-report',
  templateUrl: './drts-report.component.html',
  styleUrls: ['./drts-report.component.scss']
})
export class DrtsReportComponent implements OnInit {

  @ViewChild('maintFU') maintFU: FileUpload;
  @ViewChild('physFU') physFU: FileUpload;
  @ViewChild('detailModal') public detailModal: ModalDirective;
  @ViewChild('photoModal') public photoModal: ModalDirective;
  menuItems: MenuItem[] = []; // 司機回報, 回報查詢 分頁
  activeItem: MenuItem;
  menuIndex: number = 0;
  pageNum: number = 0; // 回報查詢 table 目前頁碼
  reportType: any;
  reportTypeOption = [{value: '汽車維修'}, {value: '體檢'}];
  isMobile: boolean;
  maintRequest: MaintRequest = new MaintRequest();
  physExamRequest: PhysExamRequest = new PhysExamRequest();
  physDate: Date;
  searchType: any;
  searchTypeOption = [{value: '汽車維修'}, {value: '體檢'}, {value: '狀況回報'},];
  reportRecordList: DRTSReportRecord[];
  selectedRecord: DRTSReportRecord;
  showPhotoList: string[];

  constructor(private httpService: HttpService, private managerService: ManagerService) {
  }

  ngOnInit(): void {
    this.menuItems.push({
      label: '司機回報', icon: 'fa fa-paper-plane-o pi-fw', command: (event) => {
        this.menuItemChanged(0);
      }
    });
    this.menuItems.push({
      label: '回報記錄', icon: 'fa fa-book pi-fw', command: (event) => {
        this.menuItemChanged(1);
        this.loadReportRecord();
      }
    });
    this.activeItem = this.menuItems[0];

    this.onResize();
  }


  onResize() {
    const md = 768;
    const lg = 992;
    const xl = 1200;
    this.isMobile = (window.innerWidth < md) ? true : false;
  }

  // table 回到第一頁
  pageReset() {
    this.pageNum = 0;
  }

  // table 換頁回到頂部
  pageChange() {
    window.scroll(0, 0);
  }

  // 顯示詳細資訊
  showDetail(record: DRTSReportRecord) {
    this.selectedRecord = record;
    this.detailModal.show();
  }

  hideDetail() {
    this.detailModal.hide();
  }


  // 汽車維修
  reportDRTSMaint() {
    this.managerService.ShowSpinner();
    this.httpService.reportDRTSMaint(this.maintRequest.Base64PhotoList,
      this.maintRequest.MaintDate, this.maintRequest.Memo).subscribe(
        data => {
          this.httpService.devModeLog('reportDRTSMaint', data, false);
          this.managerService.HideSpinner();
          if (data.IsSuccess) {
            this.managerService.SuccessToast(data.Reason);
            this.reportType = null;
            this.maintRequest = new MaintRequest();
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


  // 體檢
  reportDRTSPhysExam() {
    this.managerService.ShowSpinner();
    this.httpService.reportDRTSPhysExam(this.physExamRequest.Base64PhotoList,
      this.physExamRequest.Year, this.physExamRequest.Memo).subscribe(
        data => {
          this.httpService.devModeLog('reportDRTSPhysExam', data, false);
          this.managerService.HideSpinner();
          if (data.IsSuccess) {
            this.managerService.SuccessToast(data.Reason);
            this.reportType = null;
            this.physExamRequest = new PhysExamRequest();
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


  // 載入回報記錄
  loadReportRecord() {
    this.httpService.loadReportRecord().subscribe(
      data => {
        this.httpService.devModeLog('loadReportRecord', data, false);
        this.managerService.HideSpinner();
        if (data.IsSuccess) {
          this.managerService.SuccessToast(data.Reason);
          this.reportRecordList = data.ReportRecordList;
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


  // 載入照片
  loadDDRTSPhoto(id: number, type: LoadDRTSPhotoType) {
    this.managerService.ShowSpinner();
    this.httpService.loadDDRTSPhoto(id ,type).subscribe(
      data => {
        this.httpService.devModeLog('loadDDRTSPhoto', data, false);
        this.managerService.HideSpinner();
        if (data.IsSuccess) {
          this.showPhotoList = data.Base64PhotoList;
          this.photoModal.show();
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



  // 體檢日期取年份
  dateChange() {
    this.physExamRequest.Year = this.physDate.getFullYear();
  }

  // 切換回報與查詢分頁
  menuItemChanged(index: number) {
    this.menuIndex = index;
  }



  //#region Upload
  maintClear() {
    this.maintRequest.Base64PhotoList = [];
  }

  maintChange(event) {
    this.maintRequest.Base64PhotoList = [];
    let i = 0;
    setTimeout(() => {
      for (const file of this.maintFU.files) {
        const reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      }
    }, 10);
  }

  _handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    const base64Photo = btoa(binaryString);
    this.maintRequest.Base64PhotoList.push(base64Photo);
  }


  physClear() {
    this.physExamRequest.Base64PhotoList = [];
  }

  physChange(event) {
    this.physExamRequest.Base64PhotoList = [];
    setTimeout(() => {
      for (const file of this.physFU.files) {
        const reader = new FileReader();
        reader.onload = this._handleReaderLoaded2.bind(this);
        reader.readAsBinaryString(file);
      }
    }, 10);
  }

  _handleReaderLoaded2(readerEvt) {
    const binaryString = readerEvt.target.result;
    const base64Photo = btoa(binaryString);
    this.physExamRequest.Base64PhotoList.push(base64Photo);
  }
  //#endregion

}
