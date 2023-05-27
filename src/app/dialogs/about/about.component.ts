import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [
    MatIconModule,
    MatButtonModule
  ],
  standalone: true
})
export class AboutComponent implements OnInit {

    constructor(public dialog: MatDialogRef<any>) { }

    ngOnInit() {
    }

}
