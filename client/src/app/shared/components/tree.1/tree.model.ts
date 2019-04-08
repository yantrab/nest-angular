
import { EventEmitter } from '@angular/core';
export class TreeNode2 {
    text: string;
    child: Array<TreeNode2> = [];
    pid: number;
    id: number;
    item: any;
}
export class TreeNode {
    get nodes() {
        return this.children.filter(c => c.children && c.children.length > 0);
    }
    get leafs() {
        return this.children.filter(c => !c.children || !c.children.length);
    }
    focus = new EventEmitter<boolean>();
    name: string;
    children: Array<TreeNode> = [];
    parent: TreeNode;
    index: number;
    id: string;

    expanded = false;
    checked = false;
    setFocus() {
        this.focus.emit(true);
    }
    setFocusRecDown() {
        if (!this.expanded) { this.setFocus(); } else { this.children[this.children.length - 1].setFocusRecDown(); }
    }
    setFocusKeyDown() {
        if (!this.parent.parent) { return; }
        if (this.parent.parent.children[this.parent.index + 1]) {
            this.parent.parent.children[this.parent.index + 1].setFocus();
        } else {
            this.parent.setFocusKeyDown();
        }
    }

    setFocusRecDownFirst() {
        if (this.parent.children[this.index + 1]) {
            this.parent.children[this.index + 1].setFocus();
        } else { this.parent.setFocusRecDownFirst(); }
    }

    toggle() {
        this.expanded = !this.expanded;
    }
    check() {
        const newState = !this.checked;
        this.checked = newState;
        this.checkRecursive(newState);
    }
    checkRecursive(state) {
        this.children.forEach(d => {
            d.checked = state;
            d.checkRecursive(state);
        });
    }
}
