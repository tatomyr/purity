import {afterEach, beforeEach, describe, expect, it, vi} from "vitest"

import {sanitize} from "./sanitize.js"

describe("sanitize", () => {
  it("should remove potentially unsafe symbols", () => {
    const string = `safe<script>unsafe</script>"unsafe"`
    expect(sanitize(string)).toEqual(
      "safe&lt;script&gt;unsafe&lt;/script&gt;&quot;unsafe&quot;"
    )
  })
})
