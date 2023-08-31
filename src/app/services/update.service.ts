import { Injectable } from '@angular/core';

import { SwUpdate } from '@angular/service-worker';

@Injectable({
    providedIn: 'root'
})
export class UpdateService {
    constructor(private swUpdate: SwUpdate) {
        this.swUpdate.versionUpdates.subscribe((evt) => {
            // Catch installation errors that are not hash mismatches
            if (evt.type == "VERSION_INSTALLATION_FAILED" && !evt.error.includes("Hash mismatch")) {
                console.error(evt);
                window['dtrum']?.reportError(evt.error);
            }

            // If the new version is ready for reload
            if (evt.type == "VERSION_READY") {
                // const snack = this.snackbar.open('Update Available', 'Reload');

                // snack
                //     .onAction()
                //     .subscribe(() => {
                //         window.location.reload();
                //     });

                // setTimeout(() => {
                //     snack.dismiss();
                // }, 6000);
            }
        });

        if (this.swUpdate.isEnabled)
            this.swUpdate.checkForUpdate();
    }
}
