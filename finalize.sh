git pull
git checkout gh-pages
echo "blog.shahnewazlabib.com" > CNAME
git add .
git commit -m "Finalize"
git push
git checkout master
