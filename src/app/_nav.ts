import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: '主控台',
    url: '/dashboard',
    icon: 'icon-home',
    linkProps: {
      replaceUrl: true
    }
  },
  {
    name: '預約承接',
    url: '/reservation',
    icon: 'icon-pencil',
    linkProps: {
      replaceUrl: true
    }
  },
  {
    name: '歷史查詢',
    url: '/history',
    icon: 'icon-notebook',
    linkProps: {
      replaceUrl: true
    }
  },
  {
    name: '預約共乘',
    url: '/sbir',
    icon: 'icon-user-follow',
    linkProps: {
      replaceUrl: true
    }
  },
  {
    name: 'DRTS',
    icon: 'fa fa-bus',
    children: [
      {
        name: '司機公告',
        url: '/drts/bulletin',
        icon: 'icon-star',
        class: 'nav-child drts-bulletin',
        linkProps: {
          replaceUrl: true
        }
      },
      {
        name: '班次執行',
        url: '/drts/dashboard',
        icon: 'icon-star',
        class: 'nav-child drts',
        linkProps: {
          replaceUrl: true
        }
      },
      {
        name: '班次查詢',
        url: '/drts/history',
        icon: 'icon-star',
        class: 'nav-child',
        linkProps: {
          replaceUrl: true
        }
      },
      {
        name: '班次統計',
        url: '/drts/statistics',
        icon: 'icon-star',
        class: 'nav-child',
        linkProps: {
          replaceUrl: true
        }
      },
      {
        name: '司機回報',
        url: '/drts/report',
        icon: 'icon-star',
        class: 'nav-child',
        linkProps: {
          replaceUrl: true
        }
      },
    ],
  },
  {
    name: '偏好設定',
    url: '/preference',
    icon: 'icon-settings',
    linkProps: {
      replaceUrl: true
    }
  },
];
