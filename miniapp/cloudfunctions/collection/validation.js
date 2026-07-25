function validateNote(note) {
  if (note === undefined) return null
  if (typeof note !== 'string' || note.length > 500) return '备注过长'
  return null
}

module.exports = {
  validateNote
}
