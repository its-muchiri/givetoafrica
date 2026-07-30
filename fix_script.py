import re

with open('scripts/generate-seo-blog-posts.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix kwClean line to add .trim() at the end
old_kw = "const kwClean = keyword.replace(/^(how to )?donate to africa to /i, '').replace(/^donate to africa to /i, '').replace(/^fund /i, '').replace(/^sponsor /i, '').replace(/^how to /i, '')"
new_kw = "const kwClean = keyword.replace(/^(how to )?donate to africa to /i, '').replace(/^donate to africa to /i, '').replace(/^fund /i, '').replace(/^sponsor /i, '').replace(/^how to /i, '').trim()"

if old_kw in content:
    content = content.replace(old_kw, new_kw)
    print('Replaced kwClean line')
else:
    print('Could not find exact kwClean line - searching variants...')
    for i, line in enumerate(content.split('\n')):
        if 'kwClean' in line or ('const kw' in line and 'keyword' in line):
            print(f'  Line {i+1}: {line.strip()[:200]}')

with open('scripts/generate-seo-blog-posts.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')
