import { NgModule } from '@angular/core';
import { ValidateModal } from './validate-modal/validate-modal';
import { IonicPageModule } from 'ionic-angular';
import { SetDocumentComponent } from './set-document/set-document';

@NgModule({
    declarations: [ValidateModal,
    SetDocumentComponent],
    imports: [
        IonicPageModule.forChild(ValidateModal),IonicPageModule.forChild(SetDocumentComponent)
    ],
    exports: [ValidateModal,
    SetDocumentComponent]
})
export class ComponentsModule { }
