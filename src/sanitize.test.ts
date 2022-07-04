import {sanitize} from './sanitize'

describe('sanitize', () => {
  it('should remove potentially unsafe symbols', () => {
    const string = `safe<script>unsafe</script>"unsafe"`
    expect(sanitize(string)).toEqual(
      'safe&lt;script&gt;unsafe&lt;/script&gt;&quot;unsafe&quot;'
    )
  })
})
