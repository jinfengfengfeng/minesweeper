// gameFlag 为 true 表示游戏结束
let gameFlag = false

const shuffle = (input) => {
    for (let i = input.length - 1; i > 0; i--) {
        const k = Math.floor(Math.random() * (i + 1));
        const element = input[k];
        input[k] = input[i];
        input[i] = element;
    }
    return input;
}

// templateCell 函数, 参数为数组 line 和变量 x
// line 是每一行的数组
// 比如第一行就是 [9, 1, 0, 0, 0, 1, 1, 1, 0]
// x 表示第几行
// 这个函数返回 line.length 个 cell 拼接的字符串
const templateCell = (line, x) => {
    let r = ''
    for (let i = 0; i < line.length; i++) {
        if (line[i] === 9) {
            r += `<div class="cell" data-number=${line[i]} data-x=${x} data-y=${i}>💣</div>`
        } else {
            r += `<div class="cell" data-number=${line[i]} data-x=${x} data-y=${i}>${line[i]}</div>`
        }
    }
    let container = e('#id-div-mine')
    appendHtml(container, r)
}

// square 是二维数组, 用来表示雷相关的数据
// 用 square 生成 9 * 9 的格子, 然后插入到页面中
const makeSquare = (square) => {
    for (let i = 0; i < square.length; i++) {
        let line = square[i]
        // log('makeSquare line', line)
        // let line1 = shuffle(line)
        // log('makeSquare line1', line1)
        templateCell(line, i)
    }
}

// 如果下标符合范围, 则继续
// 因为 open1 这个函数的作用是展开格子, 所以如果已经展开过, 那么就不展开格子（cell）
// 根据 x 和 y 还有属性选择器选择出格子
// 选择格子之后根据情况来判断
// 如果没有展开过, 继续判断下列情况
// 如果碰到的是 0, 展开, 并且递归调用 openAround 函数
// 如果碰到的是其他元素, 展开
const open1 = (square, x, y) => {
    let l1 = square.length
    let l2 = square[0].length
    // log('l1 l2', l1, l2)
    if (x >= 0 && x < l1 && y >= 0 && y < l2) {
        let cell = e(`[data-x="${x}"][data-y="${y}"]`)
        // log('cell', cell)
        if (!cell.classList.contains('opened')) {
            if (cell.dataset.number === '0') {
                cell.classList.add('opened')
                openAround(square, x, y)
            } else {
                cell.classList.add('opened')
            }
        }
    }
}
// openAround 翻开 cell 周围的 8 个 cell,
// x 和 y 分别是下标
// 翻开周围的 cell 通过调用 open1 来解决
// 依然把逻辑放在下一层来处理
const openAround = (square, x, y) => {
    // 展开左边 3 个
    open1(square, x - 1, y - 1)
    open1(square, x, y - 1)
    open1(square, x + 1, y - 1)

    // 展开中间 2 个
    open1(square, x - 1, y)
    open1(square, x + 1, y)

    // 展开右边 3 个
    open1(square, x - 1, y + 1)
    open1(square, x, y + 1)
    open1(square, x + 1, y + 1)
}

const gameOver = () => {
    let container = e('#id-div-mine')
    // 遍历所有格子，获取格子的数据，如果是 9 就翻开
    for (let i = 0; i < container.children.length; i++) {
        // log('container.children.length', container.children.length)
        let cell = container.children[i]
        let data = cell.dataset.number
        if (data === '9') {
            cell.classList.add('opened')
        }
    }
    // 笑脸变成伤心脸
    let smile = e('#id-div-smile')
    smile.classList.add('hide')
    let sad = e('#id-div-fail')
    sad.classList.remove('hide')
    // 显示文字: 失败
    let f = e('#id-div-youFail')
    f.classList.remove('hide')
    // 点到雷, 计时停止
    // 清除定时器
    let timerDiv = e('#id-div-timer')
    let c = Number(timerDiv.dataset.cid)
    clearInterval(c)
}
// processCell 是点击格子后执行的函数, 把扫雷的逻辑写在这个函数中
// 初始情况不显示数字，用 font-size: 0; 来隐藏文字
// 点击的时候根据情况用 font-size: 16px; 的方式显示文字
// 这一步用 class 来完成, 比如 opened class 里面写 font-size: 16px;
// 点击的时候根据 class 来执行具体逻辑
// 如果已经显示过(也就是 class 包含 opened), 则不做任何处理
// 如果没有显示过(也就是 class 不包含 opened), 判断下列情况
// 1. 如果点击的是数字 9, 展开, 游戏结束
// 2. 如果点击的是数字 0
// 此时需要展开 0 周围的一片, 通过调用 openAround 函数来完成
// 把逻辑写在下一层函数 openAround 中
// 3. 如果点击的是其他数字, 展开
const processCell = (square, cell) => {
    // log('test2 cell', cell)
    // 拿到格子里的数据
    let data = cell.dataset.number
    // let data = cell.innerText
    // log('test3', data)
    if (data === '9') {
        // 翻开所有的 9,
        // 点击的这个 9 有红色背景
        // 点任一格子都无动作
        log('点到了 9 游戏结束')
        cell.classList.add('blast')
        gameFlag = true
        gameOver()
        // let s = '失败'
        // alert(s)
    } else if (data === '0') {
        // x y 是这个 cell 的坐标
        let x = Number(cell.dataset.x)
        let y = Number(cell.dataset.y)
        log('点到了 0')
        log('x y', x, y)
        openAround(square, x, y)
    } else {
        log('点到', data)
    }
}

const countOpenedCell = () => {
    let counter = 0
    let container = e('#id-div-mine')
    for (let i = 0; i < container.children.length; i++) {
        let n = container.children[i]
        if (n.classList.contains('opened')) {
            log('这是一个 opened 元素')
            counter += 1
        }
    }
    log('countOpenedCell counter', counter)
    return counter
}

// 用事件委托的形式在 .cell 的父元素上面绑定 click 事件, 只处理格子
// 如果点击的是 .cell 元素, 那么调用 processCell 函数
// 在 openCell 里面不处理具体的逻辑, 只调用函数
// 具体逻辑放在 processCell 函数里面实现
const openCell = (square) => {
    let container = e('#id-div-mine')
    container.addEventListener('click', function(event) {
        // log('点到了')
        let clickNumber = Number(container.dataset.number)
        clickNumber += 1
        container.dataset.number = String(clickNumber)
        // log('clickNumber', clickNumber)
        if (clickNumber === 1) {
            log('test1')
            timer()
        }
        let self = event.target
        if (self.classList.contains('cell') && gameFlag === false) {
            // log('test1 self', self)
            processCell(square, self)
            self.classList.add('opened')
            let n = countOpenedCell()
            if (n === 71) {
                log('win')
                // let s = '胜利'
                // alert(s)
                // 显示文字: 胜利
                let w = e('#id-div-youWin')
                w.classList.remove('hide')
                let smile = e('#id-div-smile')
                smile.classList.add('hide')
                let win = e('#id-div-win')
                win.classList.remove('hide')
                gameFlag = true
                // 胜利了, 计时停止
                // 清除定时器
                let timerDiv = e('#id-div-timer')
                let c = Number(timerDiv.dataset.cid)
                clearInterval(c)
            }
        }
    })
}

const templateCell2 = (line, x) => {
    let r = ''
    for (let i = 0; i < line.length; i++) {
        r += `<div class="cell" data-number=${line[i]} data-x=${x} data-y=${i}>${line[i]}</div>`
    }
    let container = e('#id-div-mine2')
    appendHtml(container, r)
}

const makeSquare2 = (square) => {
    log('makeSquare2 square', square)
    for (let i = 0; i < square.length; i++) {
        let line = square[i]
        templateCell2(line, i)
    }
}

const makeRandomData = (rawData) => {
    let r = []
    for (let i = 0; i < rawData.length; i++) {
        let n = rawData[i]
        let m = shuffle(n)
        r.push(m)
    }
    return r
}

const clonedArray = function(array) {
    return array.slice(0)
}

const clonedSquare = function(array) {
    let r = []
    for (let i = 0; i < array.length; i++) {
        let n = clonedArray(array[i])
        r.push(n)
    }
    return r
}

const plus1 = function(square, i, j) {
    let l = square.length
    if ((i >= 0 && i < l) && (j >= 0 && j < l)) {
        if (square[i][j] !== 9) {
            square[i][j] += 1
        }
    }
}

const markAround = function(square, i, j) {
    // 左边 3 个元素+1
    plus1(square, i - 1, j - 1)
    plus1(square, i, j - 1)
    plus1(square, i + 1, j - 1)

    // 中间 2 个元素+1
    plus1(square, i - 1, j)
    plus1(square, i + 1, j)

    // 右边 3 个元素+1
    plus1(square, i - 1, j + 1)
    plus1(square, i, j + 1)
    plus1(square, i + 1, j + 1)
}


const markedSquare = function(array) {
    let square = clonedSquare(array)
    for (let i = 0; i < square.length; i++) {
        let line = square[i]
        for (let j = 0; j < line.length; j++) {
            if (square[i][j] === 9) {
                markAround(square, i, j)
            }
        }
    }
    return square
}

const hideSOF = () => {
    let w = e('#id-div-youWin')
    w.classList.add('hide')
    let f = e('#id-div-youFail')
    f.classList.add('hide')
}

const startGame = () => {
    let button = e('.control')
    button.addEventListener('click', function(event) {
        let self = event.target
        // log('点到了开始游戏按钮')
        let container = e('#id-div-mine')
        for (let i = 0; i < container.children.length; i++) {
            let n = container.children[i]
            if (n.classList.contains('opened')) {
                // log('这是一个 opened 元素')
                n.classList.remove('opened')
            }
            if (n.classList.contains('blast')) {
                // log('这是一个 opened 元素')
                n.classList.remove('blast')
            }
        }
        // 切换回笑脸
        self.classList.add('hide')
        let smile = e('#id-div-smile')
        smile.classList.remove('hide')
        gameFlag = false
        log('gameFlag', gameFlag)
        let w = e('#id-div-youWin')
        w.classList.add('hide')
        // 计时归 0
        container.dataset.number = '0'
        updateTime(0)
        // 隐藏胜负文字提示
        hideSOF()
    })
}

const updateTime = (t) => {
    let timerDiv = e("#id-div-timer")
    timerDiv.innerHTML = `计时 ${t}`
}
const timer = () => {
    // log('timer in')
    let t = 0
    let clockId = setInterval(function() {
        // log('timer')
        updateTime(t)
        t += 1
    }, 1000)
    // 把 clockId 存在 #id-div-timer 元素的自定义属性上
    let timerDiv = e('#id-div-timer')
    let c = String(clockId)
    timerDiv.dataset.cid = c
}

const __main = () => {
    let s = '[[9,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,9,0,0],[0,0,0,0,0,9,0,0,0],' +
        '[0,9,0,0,0,0,0,0,0],[0,0,9,0,0,0,0,0,0],[0,0,0,0,0,0,0,9,0],' +
        '[9,0,0,0,0,0,9,0,0],[0,0,0,0,0,9,0,0,0],[0,0,9,0,0,0,0,0,0]]'
    let square = JSON.parse(s)
    let raw = makeRandomData(square)
    let square1 = markedSquare(raw)
    log('square1', square1)
    makeSquare(square1)
    // makeSquare2(square1)
    startGame()
    openCell(square1)
}

__main()