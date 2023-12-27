import { Component, HostListener, ViewChild, ViewEncapsulation } from '@angular/core';
import { Fetch } from 'src/app/services/fetch.service';
import { environment } from 'src/environment';
import { KeyboardService } from './services/keyboard.service';
import { WallpaperService } from './services/wallpaper.service';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { AboutComponent } from './dialogs/about/about.component';
import { UpdateService } from 'src/app/services/update.service';

const desktopWidth = 1126;


@Component({
    selector: 'app-root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss']
})
export class RootComponent {
    @ViewChild("drawer") drawer: MatDrawer;
    environment = environment;

    taskbarPosition: "top" | "right" | "bottom" | "left" = "left";

    readonly headLinks = [
        { url: "https://dingusland.biz", label: "dingusland.biz (Official site)" },
        { url: "https://www.youtube.com/c/DankPods", label: "YouTube" },
        { url: "https://www.patreon.com/dankpods", label: "Patreon" },
        { url: "https://www.floatplane.com/channel/GarbageTime/home", label: "Floatplane" },
        { url: "https://www.instagram.com/biteyfrank", label: "Frank" },
        { url: "https://discord.gg/BrssHgh6jP", label: "Discord" },
        { url: "https://www.youtube.com/channel/UCHdpnvKJDijKNe2caIasnww", label: "Garbage Time" },
        { url: "https://www.youtube.com/@HelloImGaming", label: "Hello, I'm Gaming." },
        { url: "https://www.youtube.com/@thedrumthing4665", label: "The Drum Thing" },
        { url: "https://www.youtube.com/channel/UCfITAHFPUbFwCbMYrhMJJCw", label: "Dankmus" },
        { url: "https://www.youtube.com/@Games_for_James", label: "James"},
        { url: "https://dankpods-dankstore-3.creator-spring.com", label: "Shop"},
    ];

    tabIndex = 0;

    constructor(
        private fetch: Fetch,
        private keyboard: KeyboardService,
        public wallpaper: WallpaperService,
        private dialog: MatDialog,
        private update: UpdateService
    ) {
        this.onResize();
    }

    openInfo() {
        this.dialog.open(AboutComponent, {
            maxHeight: "90vh",
            maxWidth: "min(90vw, 960px)"
        });
    }


    isDesktop = true;
    @HostListener("window:resize", ["$event"])
    onResize() {
        if (window.innerWidth >= desktopWidth)
            this.isDesktop = true;
        else
            this.isDesktop = false;

        // Close the drawer if a resize expands to show desktop buttons
        if (this.isDesktop)
            this.drawer?.close()
    }
}
