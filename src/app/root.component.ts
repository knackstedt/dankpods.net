import { Component, ViewEncapsulation } from '@angular/core';
import { Fetch } from 'src/app/services/fetch.service';

import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environment';
import { KeyboardService } from './services/keyboard.service';
import { WallpaperService } from './services/wallpaper.service';


@Component({
    selector: 'app-root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RootComponent {
    environment = environment;

    taskbarPosition: "top" | "right" | "bottom" | "left" = "left";

    constructor(
        private fetch: Fetch,
        public dialog: MatDialog,
        private keyboard: KeyboardService,
        public wallpaper: WallpaperService
    ) {

    }
}
