addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */

async function handleRequest(request) {
  
  const NAME = 'experiment-0'
  const TEST_RESPONSE = new Response('Hello worker1!', {
      headers: { 'content-type': 'text/plain' },
    })
  const CONTROL_RESPONSE = new Response('Hello worker2!', {
      headers: { 'content-type': 'text/plain' },
    })
  const cookie = request.headers.get('cookie')
  if (cookie && cookie.includes(`${NAME}=control`)) {
    return CONTROL_RESPONSE
  } 
  else if (cookie && cookie.includes(`${NAME}=test`)) {
    return TEST_RESPONSE
  } 
  else {
    let group = Math.random() < 0.5 ? 'test' : 'control' 
    let response = group === 'control' ? CONTROL_RESPONSE : TEST_RESPONSE
    response.headers.append('Set-Cookie', `${NAME}=${group}; path=/`)
    return response
  }
  
}