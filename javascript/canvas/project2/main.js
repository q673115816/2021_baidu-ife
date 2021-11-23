Vue.createApp({
    data() {
        return {
            imgcanvas: null,
            zoomcanvas: null,
            imgctx: null,
            zoomctx: null,
            width: 800,
            height: 800,
            list: []
        }
    },
    methods: {
        change(e) {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = (e) => {
                this.draw(e.target.result)
            }
        },

        draw(base64) {
            this.imgctx.clearRect(0, 0, this.width, this.height)
            const img = new Image()
            img.src = base64
            img.onload = (e) => {
                this.imgctx.drawImage(img, 0, 0)
            }
        },
        initCanvas() {
            const { img, zoom } = this.$refs
            this.imgcanvas = img
            this.zoomcanvas = zoom
            this.imgctx = img.getContext('2d')
            this.zoomctx = zoom.getContext('2d')
        },

        mousemove(e) {
            const {layerX: x, layerY: y} = e
            this.zoomctx.drawImage(this.imgcanvas, Math.abs(x - 5), Math.abs(y - 5), 10, 10, 0, 0, 100, 100)
        },

        click(e) {
            const { layerX: x, layerY: y } = e
            const pixel = this.imgctx.getImageData(x, y, 1, 1)
            const data = pixel.data
            const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
            this.list.push(rgba)
            console.log(this.list);
        }
    }
    ,
    mounted() {
        this.initCanvas()
    }
}).mount('#root')