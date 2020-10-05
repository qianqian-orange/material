class EventEmitter {
  constructor() {
    this.events = {}
  }

  on(type, fn) {
    if (!this.events[type]) this.events[type] = []
    this.events[type].push(fn)
  }

  off(type, fn) {
    const fns = this.events[type]
    if (!fns) return
    for (let i = 0; i < fns.length; i += 1) {
      if (fns[i] === fn) {
        fns.splice(i, 1)
        return
      }
    }
  }

  emit(type, data) {
    const fns = this.events[type]
    if (!fns) return
    for (let i = 0; i < fns.length; i += 1) {
      fns[i](data)
    }
  }
}

export default EventEmitter
