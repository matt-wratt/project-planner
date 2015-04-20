import Test from './test'

const storyState = objectise('accepted', 'finished', 'started', 'rejected', 'pending')
const storyType = objectise('story', 'bug', 'task')

function objectise (...states) {
  return states.reduce((obj, state) => {
    obj[state.toUpperCase()] = state
    return obj
  }, { values: states })
}

function storyTypeStyle (type) {
  switch(type) {
    case storyType.STORY: return 'success'
    case storyType.BUG: return 'danger'
    case storyType.TASK: return 'info'
  }
}

function startOfSprint (duration, cycleDate, date) {
  duration = Number(duration)
  var startDate = cycleDate
  while (!(startDate <= date && startDate + duration > date)) {
    if (date > startDate) {
      startDate += duration
    } else {
      startDate -= duration
    }
  }
  return startDate
}

function finishedDate (story) {
  const finishHistory = story.history.filter(history => history.type === 'state' && history.to === storyState.FINISHED)
  return (finishHistory.length ? finishHistory : story.history)
    .sort(byTimestamp)
    .reverse()[0]
    .timestamp
}

function splitStories (stories, velocity, duration, cycleDate) {
  var completed = {}
  var current = {}
  var backlog = {}
  var points = 0
  const date = new Date().valueOf()
  const currentSprint = startOfSprint(duration, cycleDate, date)
  const addTo = (col, sprint, story) => (col[sprint] = col[sprint] || []).push(story)

  stories.sort((a, b) => byState(a, b) || byOrder(a, b)).forEach(story => {
    switch(story.state) {
      case storyState.ACCEPTED:
      case storyState.FINISHED:
        var sprint = startOfSprint(duration, cycleDate, finishedDate(story))
        if (sprint === currentSprint) {
          addTo(current, sprint, story)
          points += story.estimate || 0
        } else {
          addTo(completed, sprint, story)
        }
        break
      case storyState.STARTED:
      case storyState.REJECTED:
        addTo(current, currentSprint, story)
        points += story.estimate || 0
        break
      case storyState.PENDING:
      default:
        points += story.estimate || 0
        if (points > velocity) {
          const sprint = currentSprint + duration * Math.floor(points / velocity)
          addTo(backlog, sprint, story)
        } else {
          addTo(current, currentSprint, story)
        }
        break
    }
  })

  return { completed, current, backlog }
}

function byOrder (a, b) {
  a = a.order
  b = b.order
  return a > b ? 1 : a < b ? -1 : 0
}

function byState (a, b) {
  a = scoreState(a)
  b = scoreState(b)
  return a > b ? 1 : a < b ? -1 : 0
}

function byTimestamp(a, b) {
  a = a.timestamp
  b = b.timestamp
  return a > b ? 1 : a < b ? -1 : 0
}

function scoreState ({ state }) {
  return ['accepted', 'finished', 'started', 'rejected', 'pending', undefined].indexOf(state)
}

export { storyState, storyType, storyTypeStyle, splitStories }

Test.describe('startOfSprint', it => {
  const oneDay = 1000 * 60 * 60 * 24
  const cycle = new Date().valueOf() - 2 * oneDay
  const duration = oneDay * 7

  it('finds the current sprint', expect => {
    const date = new Date().valueOf()
    expect(startOfSprint(duration, cycle, date)).toEq(cycle)
  })

  it('finds the last sprint', expect => {
    const date = new Date().valueOf() - 5 * oneDay
    expect(startOfSprint(duration, cycle, date)).toEq(cycle - duration)
  })

  it('finds the next sprint', expect => {
    const date = new Date().valueOf() + 9 * oneDay
    expect(startOfSprint(duration, cycle, date)).toEq(cycle + duration)
  })
})
