#!/bin/sh

npm run webpack -- --mode=development --watch --colors --display-error-details&

HUGO_VERSION=0.68.3 hugo --buildDrafts --buildFuture --watch