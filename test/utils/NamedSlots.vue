<template>
  <Promised v-bind="$props">
    <h1 slot="pending">loading</h1>
    <!-- The default scoped slots will be used as the result -->
    <h1 slot="then" slot-scope="data">{{ data | text }}</h1>
    <!-- The 'error' named scoped slots will be used if there is an error -->
    <h1 slot="catch" slot-scope="error">{{ error | errorText }}</h1>
  </Promised>
</template>

<script>
import common from './common'

export default {
  mixins: [common],
}
</script>
