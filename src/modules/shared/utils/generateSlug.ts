import slugify from 'slugify'

const generateSlug = (text: string) => {
 return slugify(text, {
    replacement: '-',
    lower: true
  })
}

export default generateSlug