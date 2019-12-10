import cx from 'classnames';
import TsxComponent, { createProps } from 'components/tsx-component';
import { LayoutProps } from './Default';
import { Component } from 'vue-property-decorator';
import ResizeBar from 'components/shared/ResizeBar.vue';
import styles from './Layouts.m.less';

const RESIZE_MINS = {
  bar1: { absolute: 16, reasonable: 150 },
  bar2: { absolute: 16, reasonable: 150 },
};

@Component({ props: createProps(LayoutProps) })
export default class Triplets extends TsxComponent<LayoutProps> {
  mounted() {
    this.props.reconcileSizeWithinContraints(RESIZE_MINS);
    window.addEventListener('resize', this.windowResizeHandler);
  }
  destroyed() {
    window.removeEventListener('resize', this.windowResizeHandler);
  }

  windowResizeHandler() {
    this.props.reconcileSizeWithinContraints(RESIZE_MINS);
  }

  get bar1() {
    return this.props.resizes.bar1;
  }
  set bar1(size: number) {
    if (size === 0) return;
    this.props.setBarResize('bar1', size);
    this.props.reconcileSizeWithinContraints(RESIZE_MINS);
  }

  get bar2() {
    return this.props.resizes.bar2;
  }
  set bar2(size: number) {
    this.props.setBarResize('bar2', size);
    this.props.reconcileSizeWithinContraints(RESIZE_MINS, true);
  }

  render() {
    return (
      <div class={cx(styles.columns, styles.sidePadded)}>
        <div class={styles.stacked} style={{ width: `calc(100% - ${this.bar1 + this.bar2}px)` }}>
          <div class={styles.cell}>{this.$slots['1']}</div>
          <div class={styles.cell}>{this.$slots['4']}</div>
        </div>
        <ResizeBar
          position="right"
          vModel={this.bar1}
          onResizestart={() => this.props.resizeStartHandler()}
          onResizestop={() => this.props.resizeStopHandler()}
          max={this.props.max - this.bar2}
          min={RESIZE_MINS.bar1.absolute}
          reverse={true}
        />
        <div class={styles.stacked} style={{ width: `${this.bar1}px` }}>
          <div class={styles.cell}>{this.$slots['2']}</div>
          <div class={styles.cell}>{this.$slots['5']}</div>
        </div>
        <ResizeBar
          position="left"
          vModel={this.bar2}
          onResizestart={() => this.props.resizeStartHandler()}
          onResizestop={() => this.props.resizeStopHandler()}
          max={this.props.max}
          min={RESIZE_MINS.bar2.absolute}
          reverse={true}
        />
        <div class={styles.stacked} style={{ width: `${this.bar2}px` }}>
          <div class={styles.cell}>{this.$slots['3']}</div>
          <div class={styles.cell}>{this.$slots['6']}</div>
        </div>
      </div>
    );
  }
}
