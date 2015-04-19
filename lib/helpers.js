function storyTypeStyle (type) {
  switch(type) {
    case 'story': return 'success'
    case 'bug': return 'danger'
    case 'task': return 'info'
  }
}

export { storyTypeStyle }
