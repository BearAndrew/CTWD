import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';
import { OrderDetailModule } from './../order-detail/order.module';


import { OrderComponent } from './order.component';


@NgModule({
  declarations: [ OrderComponent ],
  imports: [
    CommonModule,
    FilterPipeModule,
    NgxPaginationModule,
    FormsModule,
    ModalModule,
    TooltipModule,
    PanelModule,
    OrderDetailModule
  ],
  exports: [OrderComponent]
})
export class OrderModule { }
