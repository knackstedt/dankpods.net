// @ts-nocheck
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TemplateComponent } from './filetemplate.component';
import { AppLibModule } from 'src/app/app-lib.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
    declarations: [
        TemplateComponent
    ],
    imports: [
        CommonModule,
        AppLibModule,
        MaterialModule,
        RouterModule.forChild([{ path: '', component: TemplateComponent }])
    ]
})
export class TemplateModule { }
