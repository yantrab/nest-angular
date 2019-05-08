import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
interface Node {
    name: string;
    children?: Node[];
}
@Component({
    selector: 'p-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss'],
})
export class TreeComponent {
    treeControl = new NestedTreeControl<Node>(node => node.children);
    @Input() set data(data) {
        this.dataSource.data = data;
    }

    @Output() select = new EventEmitter();
    dataSource = new MatTreeNestedDataSource<Node>();

    hasChild = (_: number, node: Node) => !!node.children && node.children.length > 0;

    updateNode(node, selected) {
        node.selected = selected;
        if (node.children) {
            node.children.forEach(c => this.updateNode(c, selected));
        }
    }

    nodeSelected(node) {
        this.updateNode(node, !node.selected);
        this.select.emit({ selected: node.selected, value: node.value });
    }
}
