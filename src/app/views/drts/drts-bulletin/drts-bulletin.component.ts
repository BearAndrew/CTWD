import { ManagerService } from './../../../_service/manager.service';
import { HttpService } from './../../../_service/http.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DRTSDBulletin, LoadDRTSPhotoType } from '../../../_interface/drts-interface';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-drts-bulletin',
  templateUrl: './drts-bulletin.component.html',
  styleUrls: ['./drts-bulletin.component.scss']
})
export class DrtsBulletinComponent implements OnInit {

  @ViewChild('photoModal') public photoModal: ModalDirective;
  p: number = 1;
  itemsPerPage: number;

  bulletinList: DRTSDBulletin[];
  showPhotoList: string[];

  constructor(private httpService: HttpService, private managerService: ManagerService) {
    this.managerService.ShowSpinner();
    this.httpService.loadDRTSDBulletin().subscribe(
      data => {
        this.managerService.HideSpinner();
        this.httpService.devModeLog('LoadDRTSDBulletin', data, false);
        if (data.IsSuccess) {
          this.bulletinList = data.BulletinList;
        } else {
          this.managerService.ErrorToast(data.Reason);
        }
      },
      err => {
        this.managerService.HideSpinner();
        this.managerService.ErrorToast(err);
      }
    );
  }

  ngOnInit(): void {
    this.onResize();
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


  loadDDRTSPhoto(id: number) {
    this.managerService.ShowSpinner();
    this.httpService.loadDDRTSPhoto(id , LoadDRTSPhotoType.BULLETIN).subscribe(
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

}
