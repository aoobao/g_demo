<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="testajax">测试</button>
  </div>
</template>

<script>
import axios from '../assets/js/axios.js'
export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    testajax() {
      const url =
        'http://flowadmin.yjuji.com/api/landmarkMarks?landmarkMap_id=1'
      const data = {
        json:
          '[{"id":19,"landmark_id":1,"landmarkMark_type":1,"coordinate":"{"latitude":30.275524183056834,"longitude":120.0608253479004}","iconSize":"{"width":80,"height":60,"opacity":1}","landmarkIcon_id":2,"landmarkMark_id":null,"landmarkMap_id":1,"minzoom":1,"maxzoom":8,"zoom":"{"min":1,"max":8}"},{"id":1535168673146,"landmark_id":1,"landmarkMark_type":1,"coordinate":"{"latitude":30.304132001763683,"longitude":120.01773834228517}","iconSize":"{"width":80,"height":60,"opacity":1}","landmarkIcon_id":1,"landmarkMark_id":"HZYSHD","landmarkMap_id":1,"minzoom":1,"maxzoom":25,"zoom":"{"min":1,"max":25}"},{"id":1535168674249,"landmark_id":1,"landmarkMark_type":1,"coordinate":"{"latitude":30.30250172855797,"longitude":120.11489868164064}","iconSize":"{"width":80,"height":60,"opacity":1}","landmarkIcon_id":1,"landmarkMark_id":"HZYSHD","landmarkMap_id":1,"minzoom":1,"maxzoom":25,"zoom":"{"min":1,"max":25}"},{"id":1535168676856,"landmark_id":1,"landmarkMark_type":3,"coordinate":"{"latitude":30.271966150894535,"longitude":120.02271652221681}","iconSize":"{"width":80,"height":60,"opacity":1}","landmarkIcon_id":5,"landmarkMark_id":"HZYSHD","landmarkMap_id":1,"minzoom":1,"maxzoom":25,"zoom":"{"min":1,"max":25}"},{"id":1535168678239,"landmark_id":1,"landmarkMark_type":3,"coordinate":"{"latitude":30.26440490432903,"longitude":120.09996414184572}","iconSize":"{"width":80,"height":60,"opacity":1}","landmarkIcon_id":5,"landmarkMark_id":"HZYSHD","landmarkMap_id":1,"minzoom":1,"maxzoom":25,"zoom":"{"min":1,"max":25}"}]'
      }
      axios
        .postAsync('', url, data, {
          'aasa': 'bbb'
        })
        .then(rst => {
          console.log(rst)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
