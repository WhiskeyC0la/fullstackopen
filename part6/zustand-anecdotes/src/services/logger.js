const logger = (config) => (set, get) => config(
  (...args) => {
    console.log('previos state', get())
    set(...args)
    console.log('next state', get())
  },
  get
)

export default logger