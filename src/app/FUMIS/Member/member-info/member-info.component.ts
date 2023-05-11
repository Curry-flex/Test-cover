import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-info',
  templateUrl: './member-info.component.html',
  styleUrls: ['./member-info.component.scss']
})
export class MemberInfoComponent implements OnInit {
  memberInfo: any = [];

  constructor() { }

  ngOnInit() {
    this.memberInfo =JSON.parse(sessionStorage.getItem("singleMemberData"))
  }

}
