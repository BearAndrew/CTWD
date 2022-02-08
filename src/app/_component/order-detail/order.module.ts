import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'primeng/tooltip';
import { PanelModule } from 'primeng/panel';

import { OrderDetailComponent } from '../order-detail/order-detail.component';


@NgModule({
  declarations: [ OrderDetailComponent ],
  imports: [
    CommonModule,
    FilterPipeModule,
    NgxPaginationModule,
    FormsModule,
    ModalModule,
    TooltipModule,
    PanelModule
  ],
  exports: [OrderDetailComponent]
})
export class OrderDetailModule { }
