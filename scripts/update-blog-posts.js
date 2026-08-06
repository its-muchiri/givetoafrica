import fs from 'fs'
import path from 'path'

const __dirname = path.dirname(path.join(__dirname, '..'))

const blogPostsPath = path.join(__dirname, 'src/data/blogPosts.json')
const generatedPostsPath = path.join(__dirname, 'dist/blogs/generated_posts.json')

// Read the files
const currentPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf-8'))
const generatedPosts = JSON.parse(fs.readFileSync(generatedPostsPath, 'utf-8'))

// Create a map of generated posts for easy lookup
const postMap = {}
for (let i = 0; i < generatedPosts.length; i++) {
  const post = generatedPosts[i]
  // Normalize the focusKeyword for matching
  const key = post.focusKeyword.toLowerCase()
  if (!postMap[key]) {
    postMap[key] = post
  }
}

// Update currentPosts with generated content
let updatedCount = 0
let wordCountAdded = 0

for (let i = 0; i < currentPosts.length; i++) {
  const currentPost = currentPosts[i]
  
  // If the post has a sourceKeyword, try to match it
  if (currentPost.sourceKeyword) {
    const key = currentPost.sourceKeyword.toLowerCase()
    const generatedPost = postMap[key]
    
    if (generatedPost) {
      // Replace the current post with generated content
      currentPosts[i] = {
        ...generatedPost,
        // Keep ctaMidArticle from original (it has the copy text)
        ctaMidArticle: currentPost.ctaMidArticle || {
          categorySlug: generatedPost.categorySlug,
          categoryName: generatedPost.categoryName,
          copy: `Every gift helps ${generatedPost.categoryName} — support ${generatedPost.categoryName} today.`
        },
        // Keep ctaEndOfArticle from original (it has the copy text)
        ctaEndOfArticle: currentPost.ctaEndOfArticle || {
          categorySlug: generatedPost.categorySlug,
          categoryName: generatedPost.categoryName,
          copy: `Now that you have seen the need, help us meet it. Your support brings ${generatedPost.categoryName} to ${generatedPost.country} communities.`
        },
        // Keep featuredImage from original (it has the image)
        featuredImage: currentPost.featuredImage || {
          src: `/blogs/african_causes/${generatedPost.categorySlug.replace(/[^a-z0-9-]/g, '_')}/01_default_image.jpg`,
          alt: `Image illustrating ${generatedPost.categoryName} programmes in ${generatedPost.country}`
        },
        // Keep secondaryImage from original if it exists
        secondaryImage: currentPost.secondaryImage,
        // Keep tags from original if they exist
        tags: currentPost.tags || [generatedPost.categoryName.toLowerCase().replace(' ', '-')],
        // Keep original metadata
        publishedAt: currentPost.publishedAt,
        needsImageReview: currentPost.needsImageReview,
        needsFactCheck: currentPost.needsFactCheck,
        source: currentPost.source,
        country: currentPost.country,
        // Update the word count to reflect the new length
        wordCount: generatedPost.wordCount
      }
      updatedCount++
      wordCountAdded += generatedPost.wordCount
    }
  }
}

// Write the updated file
fs.writeFileSync(blogPostsPath, JSON.stringify(currentPosts, null, 2), 'utf-8')

console.log(`Updated ${updatedCount} articles from generated posts to meet 2500+ word requirement`)
console.log(`Total word count added: ${wordCountAdded}`)
console.log(`Total articles in blogPosts.json: ${currentPosts.length}`)
console.log(`Average word count: ${Math.round(currentPosts.reduce((sum, post) => sum + (post.wordCount || 0), 0) / currentPosts.length)} words`)
console.log(`Number of articles >2500 words: ${currentPosts.filter(p => p.wordCount > 2500).length}`)
console.log(`Number of articles ≤2500 words: ${currentPosts.filter(p => p.wordCount <= 2500).length}`)
