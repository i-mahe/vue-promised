import { assert } from './util'

export default {
  name: 'Promised',
  props: {
    promise: Promise,
    promises: Array,
  },

  data: () => ({
    resolved: false,
    data: null,
    error: null,
  }),

  render (h) {
    if (this.error instanceof Error || (this.error && this.error.length)) {
      assert(
        this.$scopedSlots && this.$scopedSlots.catch,
        'Provide exactly one scoped slot named "catch" for the rejected promise'
      )
      return this.$scopedSlots.catch(this.error)
    } else if (this.resolved) {
      const slot = this.$scopedSlots.default || this.$scopedSlots.then
      assert(
        this.$scopedSlots && slot,
        'Provide exactly one default/then scoped slot for the resolved promise'
      )
      return slot.call(this, this.data)
    } else {
      assert(
        (this.$slots.default && this.$slots.default.length === 1) ||
        (this.$slots.pending && this.$slots.pending.length === 1),
        'Provide exactly one default/pending slot with no `slot-scope` for the pending promise'
      )
      return this.$slots.default ? this.$slots.default[0] : this.$slots.pending[0]
    }
  },

  watch: {
    promise: {
      handler (promise) {
        if (!promise) return
        this.resolved = false
        this.error = null
        promise
          .then(data => {
            if (this.promise === promise) {
              this.resolved = true
              this.data = data
            }
          })
          .catch(err => {
            if (this.promise === promise) this.error = err
          })
      },
      immediate: true,
    },

    promises: {
      handler (promises) {
        if (!promises) return
        this.resolved = false
        this.error = []
        this.data = []
        promises.forEach(p => {
          p
            .then(data => {
              if (this.promises === promises) {
                this.resolved = true
                this.data.push(data)
              }
            })
            .catch(err => {
              if (this.promises === promises) this.error.push(err)
            })
        })
      },
      immediate: true,
    },
  },
}
