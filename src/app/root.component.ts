import { Component, HostListener, ViewChild, ViewEncapsulation } from '@angular/core';
import { Fetch } from 'src/app/services/fetch.service';
import { environment } from 'src/environment';
import { KeyboardService } from './services/keyboard.service';
import { WallpaperService } from './services/wallpaper.service';

// import Swiper core and required modules
import SwiperCore, { Lazy, Pagination, Navigation, Virtual, Keyboard,  } from "swiper";
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { AboutComponent } from './dialogs/about/about.component';

// install Swiper modules
SwiperCore.use([Lazy, Pagination, Navigation, Virtual, Keyboard]);

const desktopWidth = 1126;


@Component({
    selector: 'app-root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RootComponent {
    @ViewChild("drawer") drawer: MatDrawer;
    environment = environment;

    taskbarPosition: "top" | "right" | "bottom" | "left" = "left";

    readonly headLinks = [
        { url: "https://www.youtube.com/c/DankPods", label: "YouTube" },
        { url: "https://www.patreon.com/dankpods", label: "Patreon" },
        { url: "https://www.floatplane.com/channel/GarbageTime/home", label: "Floatplane" },
        { url: "https://www.instagram.com/biteyfrank", label: "Frank" },
        { url: "https://discord.gg/BrssHgh6jP", label: "Discord" },
        { url: "https://www.youtube.com/channel/UCHdpnvKJDijKNe2caIasnww", label: "Garbage Time" },
        { url: "https://www.youtube.com/@thedrumthing4665", label: "The Drum Thing" },
        { url: "https://www.youtube.com/channel/UCfITAHFPUbFwCbMYrhMJJCw", label: "Dankmus" },
        { url: "https://dankpods-dankstore-3.creator-spring.com", label: "Merch"}
    ]

    constructor(
        private fetch: Fetch,
        private keyboard: KeyboardService,
        public wallpaper: WallpaperService,
        private dialog: MatDialog
    ) {
        this.onResize();
    }

    onButtonClick(link) {
        window.location.href = link.url;
    }

    openInfo() {
        this.dialog.open(AboutComponent);
    }


    isDesktop = true;
    @HostListener("window:resize", ["$event"])
    onResize() {
        if (window.innerWidth >= desktopWidth)
            this.isDesktop = true;
        else
            this.isDesktop = false;

        if (this.isDesktop)
            this.drawer?.close()
    }
}
