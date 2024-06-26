import test from 'ava'
import nodefetch from 'node-fetch'
import assert from 'assert'
import fetchVCR from '../lib/index'

function createLongParams (num) {
  return 'abcdefghijklmnopqrstuvwxyz'.split('').map(letter => `${letter}=${num}`).join('&')
}

test.before(t => {
  fetchVCR.configure({
    mode: 'playback',
    fixturePath: __dirname + '/_fixtures',
    ignoreUrls: [/.+ignore=true($|.+)/i]
  })
})

test('ignores urls in ignoreUrls', t => {
  return fetchVCR('https://askfora.com/msg?message=about&ignore=true')
    .then(response => {
      return response.text()
        .then(text => t.pass())
    }).catch(e => console.error(e));
})

test('fetches from the fixture', t => {
  // fetchVCR.configure({mode: 'record'})
  return fetchVCR('https://cnx.org?') // the `?` is to make sure the fixture filename is escaped properly
    .then(response => {
      return response.text()
        .then(text => t.pass())
    })
})

test('caches a 404 page', t => {
  // fetchVCR.configure({mode: 'record'})
  return fetchVCR('https://google.com/404')
    .then(response => {
      return response.text()
        .then(text => t.pass())
    })
})

test('saves JSON properly', t => {
  // fetchVCR.configure({mode: 'record'})
  // return fetchVCR('https://api.github.com/search/repositories?q=octokat')
  return fetchVCR('https://archive.cnx.org/contents/9a1df55a-b167-4736-b5ad-15d996704270%403.2.json')
    .then(response => {
      return response.json()
        .then(text => t.pass())
    })
})

test('can recover from invalid JSON', t => {
  return fetchVCR('https://example.com/invalid-because-of-extra.json')
    .then(response => {
      return response.json()
        .then(text => t.pass())
    })
})

test('caches fixture with long name', async t => {
  const TEST_URL = `https://openstax.org?${createLongParams(1)}&${createLongParams(2)}`
  // Verify that the fixture does not yet exist
  fetchVCR.configure({mode: 'playback'})
  try {
    await fetchVCR(TEST_URL)
    t.fail(`This URL Should not initially be in the fixtures directory ${TEST_URL}`)
  } catch (e) {
    assert(e)
  }
  // Save the response into the fixtures directory
  fetchVCR.configure({mode: 'cache'})
  const origResp = await fetchVCR(TEST_URL)
  const originalText = await origResp.text()

  // Verify that it was saved into the fixtures directory
  fetchVCR.configure({mode: 'playback'})
  const newResp = await fetchVCR(TEST_URL)
  const newText = await newResp.text()

  assert.equal(originalText, newText)
  t.pass()
})

test.cb('runs in jsdom', t => {
  const fs = require('fs')
  const jsdom = require('jsdom')
  const JSDOM = jsdom.JSDOM

  const virtualConsole = new jsdom.VirtualConsole()
  virtualConsole.on('debug', () => {
    t.end()
  })

  const dom = new JSDOM(fs.readFileSync(__dirname + '/jsdom-example.html'), {
    virtualConsole: virtualConsole,
    runScripts: 'dangerously',
    beforeParse: (window) => {
      window.fetch = fetchVCR
    }
  })
})

test('can use node-fetch.Request', t => {
  return fetchVCR(new nodefetch.Request('https://archive.cnx.org/contents/9a1df55a-b167-4736-b5ad-15d996704270%403.2.json'))
    .then(response => {
      return response.json()
        .then(text => t.pass())
    })
})
