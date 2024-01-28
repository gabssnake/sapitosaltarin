/*
  <link rel="stylesheet" href="lightbox.css" />

  <script type="module">
    import { Lightbox } from 'lightbox.js'
    window.addEventListener('load', Lightbox('.thumbnails img'))
  </script>
*/

export function Lightbox(selector) {
  return () => {
    for (let img of document.querySelectorAll(selector)) {
      let slug = slugify(img.src)
      wrapImageWithAnchor(img, slug)
      appendModalContainer(img, slug)
    }
  }
}

function slugify(str) {
  return str
    .split('/')
    .pop()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
}

function wrapImageWithAnchor(img, slug) {
  let anchor = document.createElement('a')
  anchor.setAttribute('href', `#${slug}`)

  img.parentNode.insertBefore(anchor, img)
  anchor.appendChild(img)
}

function appendModalContainer(img, slug) {
  let lightbox = document.createElement('a')
  let i = document.createElement('i')
  let section = img.closest('section').getAttribute('id')

  lightbox.setAttribute('id', slug)
  lightbox.setAttribute('href', `#${section}`)
  lightbox.classList.add('lightbox')
  i.setAttribute('style', `background-image: url('${img.src}'`)

  lightbox.appendChild(i)
  document.body.appendChild(lightbox)
}
