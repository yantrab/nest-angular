import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'p-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  update(e) {
    e.stopPropagation();
  }
}
