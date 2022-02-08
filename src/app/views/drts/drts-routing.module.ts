import { DrtsComponent } from './drts.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DrtsMissionComponent } from './drts-mission/drts-mission.component';
import { DrtsBulletinComponent } from './drts-bulletin/drts-bulletin.component';
import { DrtsHistoryComponent } from './drts-history/drts-history.component';
import { DrtsStatisticsComponent } from './drts-statistics/drts-statistics.component';
import { DrtsReportComponent } from './drts-report/drts-report.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DrtsComponent,
        data: {
          title: 'DRTS'
        }
      },
      {
        path: 'bulletin',
        component: DrtsBulletinComponent,
        data: {
          title: 'DRTS Bulletin'
        }
      },
      {
        path: 'mission',
        component: DrtsMissionComponent,
        data: {
          title: 'DRTS Mission'
        }
      },
      {
        path: 'history',
        component: DrtsHistoryComponent,
        data: {
          title: 'DRTS History'
        }
      },
      {
        path: 'statistics',
        component: DrtsStatisticsComponent,
        data: {
          title: 'DRTS History'
        }
      },
      {
        path: 'report',
        component: DrtsReportComponent,
        data: {
          title: 'DRTS Report'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DrtsRoutingModule { }
