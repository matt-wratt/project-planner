import Reflux from 'reflux'
import ProjectActions from '../actions/project'

export default Reflux.createStore({

  listenables: [ProjectActions],

  init() {
    this.projects = JSON.parse(window.localStorage.getItem('projects') || '[]')
    this.selected = JSON.parse(window.localStorage.getItem('activeProject') || 'null')
    this.loadStories()
  },

  current() {
    return {
      projects: this.projects,
      selected: this.selected,
      stories: this.stories
    }
  },

  getInitialState() {
    return this.current()
  },

  loadStories() {
    if (this.selected) {
      this.stories = JSON.parse(window.localStorage.getItem(this.storyKey()) || '[]')
    } else {
      this.stories = []
    }
    this.stories.forEach(story => story.history = story.history || [{type: 'create', message: 'History added', timestamp: timestamp()}])
    window.localStorage.setItem('backup-stories', JSON.stringify(this.stories))
  },

  findStory(story) {
    return this.stories[this.stories.indexOf(story)]
  },

  storyKey() {
    if (!this.selected) throw 'Must select a project before loading stories'
    return `${this.selected.id}-stories`
  },

  save() {
    window.localStorage.setItem('activeProject', JSON.stringify(this.selected))
    window.localStorage.setItem('projects', JSON.stringify(this.projects))
    if (this.selected) {
      window.localStorage.setItem(this.storyKey(), JSON.stringify(this.stories))
    }
  },

  onNewProject(project) {
    project.id = idFromName(project.name)
    this.projects.push(project)
    this.onSelectProject(project)
  },

  onUpdateProject(project) {
    this.projects.splice(this.projects.indexOf(project), 1)
    project.id = idFromName(project.name)
    this.projects.push(project)
    this.update()
  },

  onRemoveProject(project) {
    this.projects.splice(this.projects.indexOf(project), 1)
    if (this.selected == project) {
      this.onSelectProject(null)
    } else {
      this.update()
    }
  },

  onSelectProject(project) {
    this.selected = project
    this.loadStories()
    this.update()
  },

  onNewStory(story) {
    story.id = nextId()
    story.order = this.stories.push(story)
    story.history = [{type: 'create', message: 'Story created', timestamp: timestamp() }]
    this.update()
  },

  onUpdateStory(story) {
    story.history.push({type: 'update', message: 'Story updated', timestamp: timestamp() })
    this.stories.splice(this.stories.indexOf(story), 1)
    this.stories.push(story)
    this.update()
  },

  onStartMove(id) {
    const find = id => this.stories.filter(story => story.id === id)[0]
    this.movingFrom = find(id).order
  },

  onMoveStory(id, afterId) {
    const find = id => this.stories.filter(story => story.id === id)[0]
    const story = find(id)
    const after = find(afterId)
    const storyIndex = this.stories.indexOf(story)
    const afterIndex = this.stories.indexOf(after)
    this.stories.splice(storyIndex, 1)
    this.stories.splice(afterIndex, 0, story)
    this.stories = this.stories.filter(story => !!story)
    this.stories.forEach((story, i) => story.order = i)
    this.update()
  },

  onFinishMove(id) {
    const find = id => this.stories.filter(story => story.id === id)[0]
    const story = find(id)
    const from = this.movingFrom
    const to = story.order
    const direction = to < from ? 'up' : to > from ? 'down' : null 
    delete this.movingFrom
    if (direction) {
      story.history.push({type: 'update', message: `Story moved ${direction}`, timestamp: timestamp() })
      this.update()
    }
  },

  onRemoveStory(story) {
    story.history.push({type: 'destroy', message: 'Story removed', timestamp: timestamp() })
    this.stories.splice(this.stories.indexOf(story), 1)
    this.update()
  },

  onRestoreStories() {
    this.stories = JSON.parse(window.localStorage.getItem('backup-stories') || '[]')
    this.update()
  },

  changeState(story, to) {
    story = this.findStory(story)
    story.history.push({type: 'state', from: story.state, to, message: `Story ${to}`, timestamp: timestamp() })
    story.state = to
    this.update()
  },

  onStartStory(story) {
    this.changeState(story, 'started')
  },

  onFinishStory(story) {
    this.changeState(story, 'finished')
  },

  onAcceptStory(story) {
    this.changeState(story, 'accepted')
  },

  onRejectStory(story) {
    this.changeState(story, 'rejected')
  },

  onNewComment(story, comment) {
    story = this.findStory(story)
    story.history.push({type: 'comment', message: comment, timestamp: timestamp() })
    story.comments = story.comments || []
    comment = {
      text: comment,
      timestamp: timestamp()
    }
    story.comments.push(comment)
    this.update()
  },

  onUpdateComment(story, oldComment, newComment) {
    story = this.findStory(story)
    story.history.push({type: 'comment', old: oldComment, message: comment, timestamp: timestamp() })
    const index = story.comments.indexOf(oldComment)
    if (!!~index) {
      story.comments.splice(index, 1, newComment)
      this.update()
    } else {
      throw 'Unable to find comment'
    }
  },

  onRemoveComment(story, comment) {
    story = this.findStory(story)
    story.history.push({type: 'comment', old: comment, message: 'Comment removed', timestamp: timestamp() })
    const index = story.comments.indexOf(comment)
    if (!!~index) {
      story.comments.splice(index, 1)
      this.update()
    } else {
      throw 'Unable to find comment'
    }
  },

  update() {
    this.save()
    this.trigger(this.current())
  }

})

function nextId () {
  const id = JSON.parse(window.localStorage.getItem('next-id') || '0')
  window.localStorage.setItem('next-id', JSON.stringify(id + 1))
  return id
}

function idFromName (name) {
  return name
          .split(/[^a-z0-9]/i)
          .map(word => word.toLowerCase())
          .join('-')
}

function timestamp () {
  return (new Date).valueOf()
}

window.restoreStories = function() {
  ProjectActions.restoreStories()
}
