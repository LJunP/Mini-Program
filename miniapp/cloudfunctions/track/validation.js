function sanitizeEvent(evt) {
  if (!evt || typeof evt !== 'object' || Array.isArray(evt)) return null
  if (typeof evt.event_name !== 'string' ||
      evt.event_name.length < 1 ||
      evt.event_name.length > 64) {
    return null
  }

  let eventParams = {}
  if (evt.event_params && typeof evt.event_params === 'object' && !Array.isArray(evt.event_params)) {
    try {
      const serialized = JSON.stringify(evt.event_params)
      if (Buffer.byteLength(serialized, 'utf8') <= 4096) {
        eventParams = JSON.parse(serialized)
      }
    } catch (e) {}
  }

  const textOrNull = (value, maxLength) => (
    typeof value === 'string' && value.length <= maxLength ? value : null
  )

  return {
    event_name: evt.event_name,
    event_params: eventParams,
    target_domain: textOrNull(evt.target_domain, 30),
    target_ref_id: textOrNull(evt.target_ref_id, 100),
    page_path: textOrNull(evt.page_path, 200) || '',
    scene: typeof evt.scene === 'number'
      ? evt.scene
      : textOrNull(evt.scene, 32),
    timestamp: Number.isFinite(evt.timestamp) ? evt.timestamp : Date.now()
  }
}

module.exports = {
  sanitizeEvent
}
