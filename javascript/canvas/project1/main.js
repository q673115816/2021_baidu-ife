
Vue.createApp({
    data() {
        return {
            lineWidth: 10,
            strokeStyle: '#000000',
            bgcolor: '#ffffff',
            ctxend: null,
            ctxfront: null,
            drowFlag: false,
            screen: {

            },
            paths: []
        }
    },
    methods: {
        initDocument() {
            window.addEventListener('resize', ({ target }) => {
                const { innerWidth, innerHeight } = target
                this.screen.width = innerWidth
                this.screen.height = innerHeight
                this.resizecanvas()
            })
        },
        initcanvas() {
            const { end, front } = this.$refs
            this.ctxend = end.getContext('2d')
            this.ctxfront = front.getContext('2d')
        },

        resizecanvas() {
            console.log('resizecanvas');
            const { end, front } = this.$refs
            const rect = front.getBoundingClientRect()
            const {width, height} = rect
            for (const key in rect) this.screen[key] = rect[key]
            end.width = width
            end.height = height
            front.width = width
            front.height = height
        },

        clear() {
            this.ctxend.clearRect(0, 0, this.screen.width, this.screen.height)
            this.ctxfront.clearRect(0, 0, this.screen.width, this.screen.height)
            this.paths = []
        },

        save() {
            const canvas = document.createElement('canvas')
            canvas.width = this.screen.width
            canvas.height = this.screen.height
            const ctx = canvas.getContext('2d')
            const { end, front } = this.$refs
            ctx.drawImage(end, 0, 0)
            ctx.drawImage(front, 0, 0)
            const url = canvas.toDataURL({ format: 'image/png'})
            var oA = document.createElement("a");
            oA.download = '';// 设置下载的文件名，默认是'下载'
            oA.href = url;
            document.body.appendChild(oA);
            oA.click();
            oA.remove(); // 下载之后把创建的元素删除
        },

        repeat() {
            this.ctxfront.clearRect(0, 0, this.screen.width, this.screen.height)
            for(const path of this.paths) {
                this.ctxfront.lineWidth = path.lineWidth
                this.ctxfront.strokeStyle = path.strokeStyle
                const g = loop(path.path)

            }

            function* loop(path) {
                for(let i = 0;i < path.length;i++) {
                    yield
                }
            }
        },

        mousedown(e) {
            this.drowFlag = true
            console.log(e);
            const { layerX: x, layerY: y } = e
            this.ctxfront.beginPath()
            this.ctxfront.lineWidth = this.lineWidth
            this.ctxfront.strokeStyle = this.strokeStyle
            this.ctxfront.moveTo(x, y)
            const path = {
                lineWidth: this.lineWidth,
                strokeStyle: this.strokeStyle,
                path: [[x, y, Date.now()]]
            }
            this.paths.push(path)
        },
        mousemove(e) {
            if (!this.drowFlag) return
            const length = this.paths.length
            const path = this.paths[length - 1]
            const { layerX: x, layerY: y } = e
            this.ctxfront.lineTo(x, y)
            this.ctxfront.stroke();
            path.path.push([x, y, Date.now()])
        },
        mouseup(e) {
            this.drowFlag = false
        },
    },
    mounted() {
        this.initDocument()
        this.initcanvas()
        this.$nextTick(() => {
            this.resizecanvas()
        })
    },
    watch: {
        bgcolor: {
            handler(fillStyle) {
                this.ctxend.fillStyle = fillStyle
                this.ctxend.fillRect(0, 0, this.screen.width, this.screen.height)
            }
        },
    }
}).mount('#root')
