#Tab implementation
This branch focus on the implementaion of tabs. For now, this means rewriting large parts of `urlBar.js` as well as redesigning `index.html`. The first approach was having a new mainWindow.html that contained the tablogic and webviews. These webviews contained one instance of index.html each, one for every tab. But due to a limitation within electron this wasn't possible. Therefore we need to rewrite the original code.

The new solution is to integrate the tabs directly to index.html, and have multiple webviews, one for each tab, that contains just the webpage. The interface is therefore not split up in several pages and do not need nested webviews.
