import { Inject, Injectable, NgZone, Optional, TemplateRef } from '@angular/core';
import { DialogPosition, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { Subject } from 'rxjs';
const diractionMap = { left: 'left', right: 'left', top: 'top', bottom: 'top' };
const multyMap = { left: 1, right: -1, top: 1, bottom: -1 };
interface MyMatDialogConfig extends MatDialogConfig {
    title?: string;
    slideAnimation?: {
        to: 'aside' | 'top' | 'bottom' | 'left' | 'right';
        incomingOption?: KeyframeAnimationOptions;
        outgoingOption?: KeyframeAnimationOptions;
    };
    position?: DialogPosition & { rowStart?: string; rowEnd?: string };
}

@Injectable()
export class DialogService {
    constructor(
        private dialog: MatDialog,
        private ngZone: NgZone,
        @Optional() @Inject('INCOMING_OPTION') private incomingOption?: KeyframeAnimationOptions,
        @Optional() @Inject('OUTGOING_OPTION') private outgoingOption?: KeyframeAnimationOptions,
    ) {}
    open<T, D = any, R = any>(
        componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
        config?: MyMatDialogConfig,
    ): MatDialogRef<T, R> {
        const dir: 'ltr' | 'rtl' = config.direction || (document.querySelectorAll('[dir="rtl"]').length ? 'rtl' : 'ltr');
        config.direction = config.direction || dir;
        if (config.slideAnimation) {
            if (config.slideAnimation.to === 'aside') {
                config.slideAnimation.to = dir === 'rtl' ? 'left' : 'right';
            }

            if (config.position.rowEnd) {
                if (dir === 'rtl') {
                    config.position.right = config.position.rowEnd;
                } else {
                    config.position.left = config.position.rowEnd;
                }
            }

            if (config.position.rowStart) {
                if (dir === 'rtl') {
                    config.position.left = config.position.rowEnd;
                } else {
                    config.position.right = config.position.rowEnd;
                }
            }
        }
        const ref = this.dialog.open(componentOrTemplateRef, config);
        const container = document.getElementsByTagName('mat-dialog-container')[0] as HTMLElement;
        if (config.title) {
            const el = document.createElement('span');
            el.textContent = config.title;
            el.className = 'dialogTitle';
            container.prepend(el);
        }
        if (config.slideAnimation) {
            const incomingOption = config.slideAnimation.incomingOption ||
                this.incomingOption || { duration: 600, easing: 'ease-in' };
            const outgoingOption = config.slideAnimation.outgoingOption ||
                this.outgoingOption || { duration: 600, easing: 'ease-out' };

            const to = diractionMap[config.slideAnimation.to];
            const wrapper = document.getElementsByClassName('cdk-global-overlay-wrapper')[0];

            const animate = (keyframes, options) => {
                return wrapper.animate(keyframes, options);
            };
            const _afterClosed = new Subject();
            ref.afterClosed = () => {
                return _afterClosed.asObservable();
            };
            const closeFunction = ref.close;
            const keyFrame100 = {};
            const keyFrame0 = {};
            keyFrame0[to] = 0;
            keyFrame100[to] =
                to === 'top' || to === 'bottom'
                    ? container.clientHeight * multyMap[config.slideAnimation.to] + 'px'
                    : container.clientWidth * multyMap[config.slideAnimation.to] + 'px';

            animate([keyFrame100, keyFrame0], incomingOption);
            const closeHandler = (dialogResult?: R) => {
                _afterClosed.next();
                const animation = animate([keyFrame0, keyFrame100], outgoingOption);
                animation.onfinish = () => {
                    (wrapper as HTMLElement).style.display = 'none';
                    this.ngZone.run(() => ref.close(dialogResult));
                };
                ref.close = closeFunction;
            };
            ref.close = (dialogResult?: R) => closeHandler(dialogResult);
        }

        return ref;
    }
}
