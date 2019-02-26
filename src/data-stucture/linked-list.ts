import { LinkedNode } from './linked-list';
export interface LinkedNode {
  value: any;
  next: LinkedNode | null;
  prev: LinkedNode | null;
}
export class LinkedList {
  head: LinkedNode | null = null;
  tail: LinkedNode | null = null;
  constructor() {}

  node(value: any, next: LinkedNode | null, prev: LinkedNode | null) {
    return {
      value: value,
      next: next,
      prev: prev
    };
  }

  addToHead(value: any) {
    const newNode = this.node(value, this.head, null);
    if (this.head) {
      this.head.prev = newNode;
    } else {
      this.tail = newNode;
      this.head = newNode;
    }
  }

  addToTail(value: any) {
    const newNode = this.node(value, null, this.tail);
    if (this.tail) {
      this.tail.next = newNode;
    } else {
      this.head = newNode;
      this.tail = newNode;
    }
  }

  removeHead() {
    if (!this.head) {
      return null;
    }
    const value = this.head.value;
    this.head = this.head.next;
    if (this.head) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }
    return value;
  }

  removeTail() {
    if (!this.tail) {
      return null;
    }
    const value = this.tail.value;
    this.tail = this.tail.prev;
    if (this.tail) {
      this.tail.next = null;
    } else {
      this.head = null;
    }
    return value;
  }
  search(value: any) {
    let currentNode = this.head;
    while (currentNode) {
      if (currentNode.value === value) {
        return currentNode;
      }
      currentNode = currentNode.next;
    }
    return null;
  }
}
