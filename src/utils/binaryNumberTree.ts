export type BinaryString = '0' | '1';
/**
 * Tree holding a binary number, not a binary tree though!
 * Instead of the typical this.left and this.right for a binary tree I just use this.zero
 * and this.one respectively.
 * While somewhat redundant child nodes named zero will have a key of '0' and one a key of '1'
 */
export class BinaryNumberTreeNode {
  value: BinaryString; // This
  quantity: number;
  zero: BinaryNumberTreeNode;
  one: BinaryNumberTreeNode;

  constructor(val?: BinaryString) {
    this.value = val;
    this.quantity = 0;
    this.zero = null;
    this.one = null;
  }

  getValueString() {
    return this.value ?? '';
  }

  hasChild() {
    return this.zero != null || this.one != null;
  }

  depth() {
    const leftDepth = this.zero?.depth() ?? 0;
    const rightDepth = this.one?.depth() ?? 0;
    return 1 + Math.max(0, leftDepth, rightDepth);
  }

  /**
   *
   * @param val String of length 1
   * @returns
   */
  addChild(val: BinaryString) {
    if (val === '1') {
      if (this.one == null) this.one = new BinaryNumberTreeNode(val);
      this.one.quantity += 1;
      return this.one;
    } else if (val === '0') {
      if (this.zero == null) this.zero = new BinaryNumberTreeNode(val);
      this.zero.quantity += 1;
      return this.zero;
    }
  }
  /**
   *
   * @param val String of any length
   */
  addChildren(val: BinaryString[]) {
    if (val.length === 0) {
      return;
    }
    const node = this.addChild(val[0]);
    node.addChildren(val.slice(1));
  }

  /**
   * Ties to the right
   * @returns
   */
  getPathMostTravelled<T>() {
    const oneMoreFrequent = this.one?.quantity >= this.zero?.quantity;
    const isOneDeadEnd = this.one?.depth() < this.zero?.depth();

    const oneWins = oneMoreFrequent && !isOneDeadEnd;
    const childValues = (oneWins ? this.one?.getPathMostTravelled() : this.zero?.getPathMostTravelled()) ?? '';
    return this.getValueString() + childValues;
  }
  /**
   * Ties to the left
   * @returns
   */
  getPathLeastTravelled<T>() {
    const zeroLessFrequent = this.zero?.quantity <= this.one?.quantity;
    const isZeroDeadEnd = this.zero?.depth() < this.one?.depth();

    const zeroWins = (zeroLessFrequent && !isZeroDeadEnd) || this.one == null;
    const childValues = (zeroWins ? this.zero?.getPathLeastTravelled() : this.one?.getPathLeastTravelled()) ?? '';
    return this.getValueString() + childValues;
  }

  build(values) {
    values.forEach((value) => {
      this.addChildren(value);
    });
    return this;
  }
}
