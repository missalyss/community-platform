export type availableGlyphs =
  | 'download'
  | 'download-cloud'
  | 'upload'
  | 'add'
  | 'check'
  | 'arrow-back'
  | 'arrow-full-down'
  | 'arrow-full-up'
  | 'arrow-forward'
  | 'arrow-down'
  | 'mail-outline'
  | 'notifications'
  | 'account-circle'
  | 'lock'
  | 'close'
  | 'delete'
  | 'more-vert'
  | 'comment'
  | 'turned-in'
  | 'edit'
  | 'time'
  | 'step'
  | 'difficulty'
  | 'image'
  | 'pdf'
  | 'loading'
  | 'location-on'
  | 'external-link'
  | 'facebook'
  | 'instagram'
  | 'slack'
  | 'email'
  | 'chevron-left'
  | 'chevron-right'
  | 'star'
  | 'star-active'
  | 'thunderbolt'
  | 'external-url'
  | 'verified'

export type IGlyphs = { [k in availableGlyphs]: JSX.Element }
