<template>
  <div class="timeline-item" :class="[activeOption.class]">
    <div class="result">
      <span>{{ activeOption.text }}</span>
    </div>
    <i></i>
    <section>
      <slot></slot>
    </section>
  </div>
</template>

<script>
export default {
  name: 'TimelineItem',
  props: {
    status: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      options: {
        0: {
          text: '待审核',
          class: 'pending'
        },
        1: {
          text: '通过',
          class: 'resolve'
        },
        2: {
          text: '驳回',
          class: 'reject'
        },
        3: {
          text: '',
          class: 'reject'
        }
      }
    }
  },
  computed: {
    activeOption() {
      return this.options[this.status] || {}
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
@resolveColor: #3296fa;
@rejectColor: #ef3939;
.timeline-item {
  display: flex;
  align-items: center;
  justify-content: stretch;
  position: relative;
  padding: 50px 30px 50px 28px;
  .result {
    height: 100%;
    border-right: 3px solid #ccc;
    padding-right: 30px;
    width: 16px;
    font-size: 14px;
    top: 0;
    bottom: 0;
    left: 0;
    position: absolute;
    display: flex;
    align-items: center;
  }
  &.resolve {
    .result {
      border-color: @resolveColor;
    }
  }
  &.reject {
    .result {
      border-color: @rejectColor;
    }
  }
  > i {
    width: 10px;
    padding: 20px 0;
    margin-right: 15px;
    background-color: #fff;
    z-index: 1;
    position: relative;
    &:before {
      position: absolute;
      content: '';
      top: 15px;
      left: -1.5px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #ccc;
    }
    &:after {
      position: absolute;
      top: 12px;
      left: -4.5px;
      display: block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 1px solid #ccc;
      content: '';
      z-index: 2;
    }
  }
  &.resolve {
    > i {
      &:before {
        background-color: @resolveColor;
      }
      &:after {
        border-color: @resolveColor;
      }
    }
  }
  &.reject {
    > i {
      &:before {
        background-color: @rejectColor;
      }
      &:after {
        border-color: @rejectColor;
      }
    }
  }
  > section {
    width: 240px;
    border-radius: 10px;
    padding: 10px 15px;
    position: relative;
    background-color: #f4f4f4;
    &:before {
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: -10px;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 8px 10px 8px 0;
      border-color: transparent #f4f4f4 transparent transparent;
    }
    h4 {
      position: absolute;
      top: -40px;
      left: 0;
      font-size: 18px;
    }
    p {
      font-size: 14px;
      display: flex;
      justify-content: space-between;
      line-height: 2;
    }
  }
}
</style>
