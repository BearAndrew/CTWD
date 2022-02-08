import { Component, Input, OnInit } from '@angular/core';
import { IOrder } from '../../_interface/interface';
import { ManagerService } from '../../_service/manager.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  @Input() parent: String;
  @Input() selectedOrder: IOrder;
  collapsed: boolean = false;

  constructor(private managerService: ManagerService) { }

  ngOnInit(): void {
  }

}
