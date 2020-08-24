let colors = [
    "#FFB400",
    "#F9EB00",
    "#FF7800",
    "#00B9BD",
    "#178FFF",
    "#17A7FF",
    "#17D5FF"
]
/**
 * 获取min至max之间的随机数
 * @param {*} min 
 * @param {*} max
 */
export function getRandom(min, max) {
    return Math.floor(Math.random()*(max - min) + min)
}

export default function getRandomColor() {
    return colors[getRandom(0, colors.length - 1)]
}