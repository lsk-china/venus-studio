<template>
  <div>
    <canvas class="canvas" ref="canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'particleBackground',
  data () {
    return {
      dots: [],
      canvas: null,
      dIdx: 0,
      mouseState: true,
      timer: null
    }
  },
  props: {
    dotColor: String
  },
  methods: {
    sizeCanvas: function () {
      console.log(document.documentElement.clientHeight)
      this.canvas.width = document.body.clientWidth
      this.canvas.height = document.documentElement.clientHeight
    },
    createDots: function () {
      for (var i = 0; i < 160; i++) {
        this.dots.push({
          ox: this.getRandom(0, this.canvas.width),
          oy: this.getRandom(0, this.canvas.height),
          xs: this.getRandom(-2, 2),
          ys: this.getRandom(-2, 2)
        })
      }
    },
    getRandom: function (min, max) {
      return Math.random() * (max - min + 1) + min
    },
    getDistance: function (x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
    },
    startBlinking: function () {
      let ctx = this.canvas.getContext('2d')
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.dots.forEach(function (dot, idx) {
        dot.ox += dot.xs
        dot.oy += dot.ys
        dot.xs *= (dot.ox > this.canvas.width || dot.ox < 0) ? -1 : 1
        dot.ys *= (dot.oy > this.canvas.height || dot.oy < 0) ? -1 : 1
        this.drawLineBetweenTwoDots(ctx, dot)
        // this.drawLinesBetweenMouseAndDots(ctx, dot)
        this.drawDots(ctx, dot)
      }, this)
      window.requestAnimationFrame(this.startBlinking.bind(this))
    },
    drawLineBetweenTwoDots: function (ctx, dot) {
      for (var i = 0; i < this.dots.length; i++) {
        let dotCx = this.dots[i].ox
        let dotCy = this.dots[i].oy
        let cDist = this.getDistance(dot.ox, dot.oy, dotCx, dotCy)
        if (this.dots[i] !== dot && cDist < 100) {
          let strokeStyle = 'rgba(25, 250, 250,' + ((100 - cDist) * 0.01).toString() + ')'
          this.drawLines(ctx, strokeStyle, dot.ox, dot.oy, dotCx, dotCy)
        }
      }
    },
    drawLines: function (ctx, strokeStyle, x1, y1, x2, y2) {
      ctx.beginPath()
      ctx.lineWidth = 1
      ctx.strokeStyle = strokeStyle
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    },
    drawLinesBetweenMouseAndDots: function (ctx, dot) {
      let dotOx = this.dots[this.dIdx].ox
      let dotOy = this.dots[this.dIdx].oy
      let oDist = this.getDistance(dot.ox, dot.oy, dotOx, dotOy)
      if (this.mouseState && oDist <= 150) {
        if (oDist > (150 * 0.8)) {
          dot.ox -= (dot.ox - dotOx) * 0.038
          dot.oy -= (dot.oy - dotOy) * 0.038
        }
        this.drawLines(ctx, '#F00', dot.ox, dot.oy, dotOx, dotOy)
      }
    },
    drawDots: function (ctx, dot) {
      ctx.beginPath()
      ctx.fillStyle = this.dotColor
      ctx.arc(dot.ox, dot.oy, 3, 0, Math.PI * 2, true)
      ctx.fill()
    },
    setMouseHover: function () {
      this.canvas.onmousemove = event => {
        var temp = [0, 0]
        let mouseX = event.offsetX
        let mouseY = event.offsetY
        temp[0] = this.getDistance(mouseX, mouseY, this.dots[0].ox, this.dots[0].oy)
        for (var i = 0; i < this.dots.length; i++) {
          let dist = this.getDistance(mouseX, mouseY, this.dots[i].ox, this.dots[i].oy)
          if (dist < temp[0]) {
            temp[0] = dist
            temp[1] = i
          }
        }
        this.dots[temp[1]].ox = event.offsetX
        this.dots[temp[1]].oy = event.offsetY
        this.dIdx = temp[1]
        this.mouseState = !0
        clearTimeout(this.timer)
        this.timer = setTimeout((e) => {
          this.mouseState = !1
        }, 100)
      }
    },
    start: function () {
      window.onresize = () => {
        this.sizeCanvas()
      }
      this.sizeCanvas()
      this.createDots()
      this.startBlinking()
      // this.setMouseHover()
    }
  },
  created () {
    this.$nextTick(() => {
      this.canvas = this.$refs.canvas
      window.onresize = () => {
        this.sizeCanvas()
      }
      this.start()
    })
  }
}
</script>

<style scoped>
  /*div{*/
  /*  background-image: url("../assets/index/headimg.jpg");*/
  /*  background-repeat: no-repeat;*/
  /*  background-size: cover;*/
  /*  background-attachment: local;*/
  /*}*/
</style>
