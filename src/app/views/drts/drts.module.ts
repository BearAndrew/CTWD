import { environment } from './../../../environments/environment';
import { ToastModule } from 'primeng/toast';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CalendarModule } from 'primeng/calendar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderModule } from '../../_component/order/order.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from 'primeng/accordion';
import { FileUploadModule } from 'primeng/fileupload';
import { TabMenuModule } from 'primeng/tabmenu';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CarouselModule } from 'primeng/carousel';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { AgmCoreModule } from '@agm/core';

import { DrtsRoutingModule } from './drts-routing.module';
import { DrtsComponent } from './drts.component';
import { DrtsMissionComponent } from './drts-mission/drts-mission.component';
import { DrtsBulletinComponent } from './drts-bulletin/drts-bulletin.component';
import { DrtsHistoryComponent } from './drts-history/drts-history.component';
import { DrtsReportComponent } from './drts-report/drts-report.component';
import { DrtsStatisticsComponent } from './drts-statistics/drts-statistics.component';



@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    DrtsRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    CalendarModule,
    ModalModule.forRoot(),
    NgxPaginationModule,
    OrderModule,
    ToastModule,
    TableModule,
    PanelModule,
    AccordionModule,
    FileUploadModule,
    TabMenuModule,
    DropdownModule,
    InputTextareaModule,
    CarouselModule,
    NgxSpinnerModule,
    SelectButtonModule,
    FilterPipeModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapApiKey,
      libraries: ['geometry']
    }),
  ],
  declarations: [ DrtsComponent, DrtsMissionComponent, DrtsBulletinComponent, DrtsHistoryComponent, DrtsReportComponent, DrtsStatisticsComponent ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DrtsModule { }
