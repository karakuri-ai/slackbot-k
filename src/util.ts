export function randomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max))
}
export function shuffle([...array]) {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
