
// USERGROUPS

/*
1. SUPER_ADMIN
2.ICT_ADMINISTRATOR
3.GENERAL_MANAGER & MD
4.ICT_MANAGER
6.VOMIS_MANAGER
6.COMPLIANCE_MANAGER
7.ACCOUNTS_MANAGER
8.DATA_ENTRY_MANAGER
9.INVESTMENT_MANAGER
10.ICT_OFFICER
11.VOMIS_OFFICER
12.COMPLIANCE_OFFICER
13.ACCOUNTS_OFFICER
14.DATA_ENTRY_OFFICER
15.INVESTMENT_OFFICER
16.AUDITOR
17.UNKNOWN
*/


// 2.ICT_ADMINISTRATOR & 4.ICT_MANAGER & 10.ICT_OFFICER
// 3.GENERAL_MANAGER & MD
// 6.VOMIS_MANAGER & 11.VOMIS_OFFICER
// 6.COMPLIANCE_MANAGER && 12.COMPLIANCE_OFFICER
// 7.ACCOUNTS_MANAGER & 13.ACCOUNTS_OFFICER
// 8.DATA_ENTRY_MANAGER && 14.DATA_ENTRY_OFFICER
// 9.INVESTMENT_MANAGER & 15.INVESTMENT_OFFICER
// 16.AUDITOR
// 17.UNKNOWN


// 1. SUPER_ADMIN
export const SUPER_ADMINNavigation = [
  {
    text: 'Home',
    path: 'home',
    icon: 'home'
  },
  {
    text: 'My Account',
    icon: 'fa fa-user-circle',
    items: [{
        text: 'My profile',
        path: 'profile'
        }]
  },
  {
    text: 'Bill Management',
    icon: 'activefolder',
    items: [
      {
        text: 'Create Bill',
        path: 'bill-create'
      }
    ]
  },
  {
    text: 'System Administration',
    icon: 'fa fa-shield',
    items: [
      {
        text: 'System Settings',
        path: 'system-settings'
      },
      {
        text: 'System Users',
        path: 'system-users'
      },
      {
        text: 'User Groups',
        path: 'system-roles'
      },
      {
        text: 'User Privileges',
        path: 'system-privileges'
      }
    ]
  },
  {
        icon: 'fa fa-file-text',
        text: 'Invoices',
        items: [
          {
            text: 'Payments Invoice',
            path: 'payment-invoices'
          },
          {
            text: 'Published Invoices',
            path: 'published-invoices'
          },
          {
            text: 'Customers Invoice',
            path: 'customers-invoice'
          }
        ]
  },
  {
    icon: 'fa fa-user-secret',
    text: 'Compliance',
    items: [
      {
        text: 'Contribution Allotment',
        path: 'bill/payments/summary'
      },
      {
        text: 'Allotment Management',
        path: 'employers/allotment/settings'
      },
      {
        text: 'Compliance Report',
        path: 'compliance/report'
      }
    ]
  },
  {
    icon: 'fa fa-users',
    text: 'Customers',
    items: [
      {
        text: 'Employers',
        path: 'customers/employers'
      },
      {
        text: 'Customer Complaints',
        path: 'feedback-management'
      }
    ]
  },
  {
    text: 'Voluntary Scheme',
    icon: 'fa fa-vimeo',
    items: [
         {
           text: 'Validation Requests',
           path: 'vomis-vd-req'
         },
         {
           text: 'Validation Responses',
           path: 'vomis-vd-res'
         },
         {
           text: 'Post Request',
           path: 'vomis-ps-req'
         },
         {
           text: 'Post Responses',
           path: 'vomis-ps-res'
         },
         {
           text: 'Received Contributions',
           path: 'vomis-api-summary'
         },
         {
           text: 'Voluntary Scheme Push',
           path: 'vomis-push'
         }
    ]
  },
  {
    icon: 'fa fa-file-pdf-o',
    text: 'Reports',
    items: [
      {
        text: 'Employers Registration',
        path: 'emp-reg-report'
      },
      {
        text: 'Main Scheme Summary',
        path: 'invoice-summary'
      },
      {
        text: 'PSP Payments',
        path: 'payment-invoices'
      },
      {
        text: 'Reconciliation',
        path: 'psp-reconciliation'
      },
      {
        text: 'Audit Trail',
        path: 'audit-trail'
      }
    ]
  }
];

// 2.ICT_ADMINISTRATOR & 4.ICT_MANAGER & 10.ICT_OFFICER
export const ICT_ADMINISTRATORNavigation = [
  {
    text: 'Home',
    path: 'home',
    icon: 'home'
  },
  {
    text: 'My Account',
    icon: 'fa fa-user-circle',
    items: [{
        text: 'My profile',
        path: 'profile'
        },
       {
        text: 'Security Manager',
        path: 'security-manager'
       }]
  },
  {
    text: 'System Administration',
    icon: 'fa fa-shield',
    items: [
      {
        text: 'System Settings',
        path: 'system-settings'
      },
      {
        text: 'System Users',
        path: 'system-users'
      },
      {
        text: 'User Groups',
        path: 'system-roles'
      },
      {
        text: 'User Privileges',
        path: 'system-privileges'
      }
    ]
  },
  {
        icon: 'fa fa-file-text',
        text: 'Invoices',
        items: [
          {
            text: 'Payments Invoice',
            path: 'payment-invoices'
          },
          {
            text: 'Published Invoices',
            path: 'published-invoices'
          }
        ]
  },
  {
    icon: 'fa fa-users',
    text: 'Customers',
    items: [
      {
        text: 'Customer Complaints',
        path: 'feedback-management'
      }
    ]
  },
  {
    icon: 'fa fa-file-pdf-o',
    text: 'Reports',
    items: [
      {
        text: 'Employers Registration',
        path: 'emp-reg-report'
      }
    ]
  }
];

// 3.GENERAL_MANAGER & MD
export const GENERAL_MANAGERNavigation = [
  {
    text: 'Home',
    path: 'home',
    icon: 'home'
  },
  {
    text: 'My Account',
    icon: 'fa fa-user-circle',
    items: [{
        text: 'My profile',
        path: 'profile'
        },
       {
        text: 'Security Manager',
        path: 'security-manager'
       }]
  },

  {
        icon: 'fa fa-file-text',
        text: 'Invoices',
        items: [
          {
            text: 'Payments Invoice',
            path: 'payment-invoices'
          },
          {
            text: 'Published Invoices',
            path: 'published-invoices'
          }
        ]
  },
  {
    icon: 'fa fa-users',
    text: 'Customers',
    items: [
      {
        text: 'Customer Complaints',
        path: 'feedback-management'
      }
    ]
  },
  {
    text: 'Voluntary Scheme',
    icon: 'fa fa-vimeo',
    items: [
         {
           text: 'Received Contributions',
           path: 'vomis-api-summary'
         },
         {
           text: 'Voluntary Scheme Push',
           path: 'vomis-push'
         }
    ]
  },
  {
    icon: 'fa fa-file-pdf-o',
    text: 'Reports',
    items: [
      {
        text: 'Employers Registration',
        path: 'emp-reg-report'
      },
      {
        text: 'Main Scheme Summary',
        path: 'invoice-summary'
      },
      {
        text: 'PSP Payments',
        path: 'payment-invoices'
      },
      {
        text: 'Reconciliation',
        path: 'psp-reconciliation'
      },
      {
        text: 'Audit Trail',
        path: 'audit-trail'
      }
    ]
  }
];

// 6.VOMIS_MANAGER & 11.VOMIS_OFFICER
export const VOMIS_MANAGERNavigation = [
  {
    text: 'Home',
    path: 'home',
    icon: 'home'
  },
  {
    text: 'My Account',
    icon: 'fa fa-user-circle',
    items: [{
        text: 'My profile',
        path: 'profile'
        },
       {
        text: 'Security Manager',
        path: 'security-manager'
       }]
  },
  {
    text: 'Voluntary Scheme',
    icon: 'fa fa-vimeo',
    items: [
         {
           text: 'Validation Requests',
           path: 'vomis-vd-req'
         },
         {
           text: 'Validation Responses',
           path: 'vomis-vd-res'
         },
         {
           text: 'Post Request',
           path: 'vomis-ps-req'
         },
         {
           text: 'Post Responses',
           path: 'vomis-ps-res'
         },
         {
           text: 'Received Contributions',
           path: 'vomis-api-summary'
         },
         {
           text: 'Voluntary Scheme Push',
           path: 'vomis-push'
         }
    ]
  }
];

// 6.COMPLIANCE_MANAGER && 12.COMPLIANCE_OFFICER
export const COMPLIANCE_MANAGERNavigation = [
  {
    text: 'Home',
    path: 'home',
    icon: 'home'
  },
  {
    text: 'My Account',
    icon: 'fa fa-user-circle',
    items: [{
        text: 'My profile',
        path: 'profile'
        }]
  },
  {
        icon: 'fa fa-file-text',
        text: 'Invoices',
        items: [
          {
            text: 'Payments Invoice',
            path: 'payment-invoices'
          },
          {
            text: 'Published Invoices',
            path: 'published-invoices'
          },
          {
            text: 'Customers Invoice',
            path: 'customers-invoice'
          }
        ]
  },
  {
    icon: 'fa fa-user-secret',
    text: 'Compliance',
    items: [
      {
        text: 'Contributions Allotment',
        path: 'bill/payments/summary'
      },
      {
        text: 'Allotment Management',
        path: 'employers/allotment/settings'
      },
      {
        text: 'Compliance Report',
        path: 'compliance/report'
      }
    ]
  },
  {
    icon: 'fa fa-file-pdf-o',
    text: 'Reports',
    items: [
      {
        text: 'Main Scheme Summary',
        path: 'invoice-summary'
      },
      {
        text: 'PSP Payments',
        path: 'payment-invoices'
      },
      {
        text: 'Reconciliation',
        path: 'psp-reconciliation'
      }
    ]
  }
];

// 7.ACCOUNTS_MANAGER & 13.ACCOUNTS_OFFICER
export const ACCOUNTS_MANAGERNavigation = [
  {
    text: 'Home',
    path: 'home',
    icon: 'home'
  },
  {
    text: 'My Account',
    icon: 'fa fa-user-circle',
    items: [{
        text: 'My profile',
        path: 'profile'
        }]
  },
  {
    text: 'Bill Management',
    icon: 'activefolder',
    items: [
      {
        text: 'Create Bill',
        path: 'bill-create'
      }
    ]
  },
  {
        icon: 'fa fa-file-text',
        text: 'Invoices',
        items: [
          {
            text: 'Payments Invoice',
            path: 'payment-invoices'
          },
          {
            text: 'Published Invoices',
            path: 'published-invoices'
          },
          {
            text: 'Customers Invoice',
            path: 'customers-invoice'
          }
        ]
  },
  {
    icon: 'fa fa-users',
    text: 'Customers',
    items: [
      {
        text: 'Employers',
        path: 'customers/employers'
      }
    ]
  },
  {
    text: 'Voluntary Scheme',
    icon: 'fa fa-vimeo',
    items: [
         {
           text: 'Received Contributions',
           path: 'vomis-api-summary'
         },
         {
           text: 'Voluntary Scheme Push',
           path: 'vomis-push'
         }
    ]
  },
  {
    icon: 'fa fa-file-pdf-o',
    text: 'Reports',
    items: [
      {
        text: 'Main Scheme Summary',
        path: 'invoice-summary'
      },
      {
        text: 'PSP Payments',
        path: 'payment-invoices'
      },
      {
        text: 'Reconciliation',
        path: 'psp-reconciliation'
      }
    ]
  }
];

// 8.DATA_ENTRY_MANAGER && 14.DATA_ENTRY_OFFICER
export const DATA_ENTRY_MANAGERNavigation = [
  {
    text: 'Home',
    path: 'home',
    icon: 'home'
  },
  {
    text: 'My Account',
    icon: 'fa fa-user-circle',
    items: [{
        text: 'My profile',
        path: 'profile'
        }]
  },
  {
    icon: 'fa fa-file-pdf-o',
    text: 'Reports',
    items: [
      {
        text: 'Employers Registration',
        path: 'emp-reg-report'
      },
      {
        text: 'Main Scheme Summary',
        path: 'invoice-summary'
      }
    ]
  }
];

// 9.INVESTMENT_MANAGER & 15.INVESTMENT_OFFICER
export const INVESTMENT_MANAGERNavigation = [
  {
    text: 'Home',
    path: 'home',
    icon: 'home'
  },
  {
    text: 'My Account',
    icon: 'fa fa-user-circle',
    items: [{
        text: 'My profile',
        path: 'profile'
        }]
  },
  {
        icon: 'fa fa-file-text',
        text: 'Invoices',
        items: [
          {
            text: 'Customers Invoice',
            path: 'customers-invoice'
          }
        ]
  }
];

// 16.AUDITOR
export const AUDITORNavigation = [
  {
    text: 'Home',
    path: 'home',
    icon: 'home'
  },
  {
    text: 'My Account',
    icon: 'fa fa-user-circle',
    items: [{
        text: 'My profile',
        path: 'profile'
        }]
  },
  {
    icon: 'fa fa-file-pdf-o',
    text: 'Reports',
    items: [
      {
        text: 'Employers Registration',
        path: 'emp-reg-report'
      },
      {
        text: 'Main Scheme Summary',
        path: 'invoice-summary'
      },
      {
        text: 'PSP Payments',
        path: 'payment-invoices'
      },
      {
        text: 'Reconciliation',
        path: 'psp-reconciliation'
      },
      {
        text: 'Audit Trail',
        path: 'audit-trail'
      }
    ]
  }
];

// 17.UNKNOWN
export const UNKNOWNNavigation = [
  {
    text: 'Home',
    path: 'home',
    icon: 'home'
  },
  {
    text: 'My Account',
    icon: 'fa fa-user-circle',
    items: [{
        text: 'My profile',
        path: 'profile'
        }]
  }
];


