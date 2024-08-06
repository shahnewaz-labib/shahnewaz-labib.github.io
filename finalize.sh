git checkout gh-pages
echo "blog.shahnewazlabib.com" > CNAME
git add CNAME
git commit -m "Finalize"
git push
git checkout main
