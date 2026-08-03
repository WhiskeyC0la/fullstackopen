import { create } from 'zustand'

const useFeedbackCounterStore = create(set => ({
  counters: {
    good: 0,
    neutral: 0,
    bad: 0
  },
  increment: (feedbackType) => set(state => ({
    counters: {
      ...state.counters,
      [feedbackType]: state.counters[feedbackType] +1
    }
  }))
}))

export const useFeedbackCounters = (feedbackType) => useFeedbackCounterStore(state => state.counters[feedbackType])
export const useFeedbackActions = () => useFeedbackCounterStore(state => state.increment)