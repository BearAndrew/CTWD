import { OrderModule } from './../../_component/order/order.module';
import { HistoryComponent } from './history.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { HistoryRoutingModule } from './history-routing.module';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [HistoryComponent],
  imports: [
    CommonModule,
    HistoryRoutingModule,
    NgxPaginationModule,
    TooltipModule,
    FilterPipeModule,
    FormsModule,
    DropdownModule,
    CollapseModule,
    ModalModule.forRoot(),
    OrderModule,
    NgxSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HistoryModule { }
