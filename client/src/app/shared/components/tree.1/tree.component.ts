import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeNode } from './tree.model';

@Component({
  selector: 'p-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {
  @Input() nodes;
  @Input() options;
  @Input() node;
  @Output() select = new EventEmitter<string[]>();
  selectedNodes = {};

  ngOnInit() {
    if (this.node) { return; }
    const idProp = this.options && this.options.idProp ? this.options.idProp : 'id';
    const nameProp = this.options && this.options.nameProp ? this.options.nameProp : 'name';
    const childrenProp = this.options && this.options.childrenProp ? this.options.childrenProp : 'children';
    this.node = new TreeNode();

    this.nodes.forEach((n, index) => {
      const tree = this.buildTree(n, idProp, nameProp, childrenProp);
      tree.parent = this.node;
      tree.index = index;
      this.node.expanded = true;
      this.node.children.push(tree);
    });
  }

  private buildTree(root, idProp, nameProp, childrenProp) {
    const tree = new TreeNode();
    tree.name = root[nameProp];
    tree.id = root[idProp];
    if (root[childrenProp]) {
      root[childrenProp].forEach((child, index) => {
        const childToAdd = this.buildTree(child, idProp, nameProp, childrenProp);
        childToAdd.parent = tree;
        childToAdd.index = index;
        tree.children.push(childToAdd);
      });
    }
    return tree;
  }

  onLeft($event, node: TreeNode, isLeaf) {
    node.expanded = true;
  }
  onRight($event, node: TreeNode, isLeaf) {
    if (isLeaf || !node.expanded) { node.parent.setFocus(); } else { node.expanded = false; }
  }
  onUp($event, node: TreeNode, isLeaf) {
    if (isLeaf) {
      if (node.index > 0) { node.parent.children[node.index - 1].setFocus(); } else { (node.parent.focus.emit(true)); }
    } else {
      if (node.index > 0) {
        node.parent.children[node.index - 1].setFocusRecDown();
      } else { node.parent.setFocus(); }

    }
  }
  onDown($event, node: TreeNode, isLeaf) {
    if (isLeaf) {
      if (node.index < node.parent.children.length - 1) {
        node.parent.children[node.index + 1].setFocus();
      } else { node.parent.setFocusRecDownFirst(); }
    } else {
      if (node.expanded) { this.node.children[0].setFocus(); } else { node.setFocusRecDownFirst(); }
    }
  }
  onSelect(node: TreeNode) {
    const id = node.id;// typeof event === 'string' ? event : node.id
    if (this.selectedNodes[id]) {
      delete this.selectedNodes[id];
    } else {
      this.selectedNodes[id] = true;
    }
    this.select.emit(Object.keys(this.selectedNodes));
  }
}
