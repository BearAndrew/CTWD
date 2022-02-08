import { TimelineModule } from './../../_component/timeline/timeline.module';
import { ToastModule } from 'primeng/toast';
import { NgxSpinnerModule } from 'ngx-spinner';
import { OrderModule } from './../../_component/order/order.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { TooltipModule } from 'primeng/tooltip';
import { ReservationRoutingModule } from './reservation-routing.module';

import { ReservationComponent } from './reservation.component';


@NgModule({
  declarations: [ ReservationComponent ],
  imports: [
    CommonModule,
    FormsModule,
    ReservationRoutingModule,
    CalendarModule,
    ModalModule.forRoot(),
    NgxPaginationModule,
    TooltipModule,
    OrderModule,
    NgxSpinnerModule,
    ToastModule,
    TimelineModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReservationModule { }
