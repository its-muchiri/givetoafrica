import json

with open('src/data/blogPosts.json', 'r') as f:
    posts = json.load(f)

print(f'Total posts: {len(posts)}')

# Show a few posts from each category
categories = {}
for p in posts:
    cat = p['categorySlug']
    if cat not in categories:
        categories[cat] = []
    categories[cat].append(p)

# Show sample from each category
for cat in sorted(categories.keys()):
    posts_list = categories[cat]
    print(f'\n=== {cat} ({len(posts_list)} posts) ===')
    for p in posts_list[:2]:
        print(f'  Title: {p["title"][:80]}')
        print(f'  Slug: {p["slug"][:60]}')
        print(f'  Country: {p["country"]}')
        print(f'  Image src: {p["featuredImage"]["src"][:80]}')
        print(f'  LSI: {p["lsiKeywords"]}')
        word_est = len(p["bodyHtml"]) // 5
        print(f'  Body size: {word_est} words approx')
        print()
