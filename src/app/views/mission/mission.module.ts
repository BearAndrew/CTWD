import { environment } from './../../../environments/environment';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { OrderDetailModule } from './../../_component/order-detail/order.module';

import { MissionRoutingModule } from './mission-routing.module';
import { MissionComponent } from './mission.component';


@NgModule({
  declarations: [MissionComponent],
  imports: [
    CommonModule,
    MissionRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapApiKey
    }),
    AgmDirectionModule,
    ModalModule.forRoot(),
    FormsModule,
    DropdownModule,
    ToastModule,
    NgxSpinnerModule,
    OrderDetailModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MissionModule { }
