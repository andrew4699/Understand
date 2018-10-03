# Understand
Chrome extension for PDF optical character recognition

[![Known Vulnerabilities](https://snyk.io/test/github/andrew4699/understand/badge.svg?targetFile=src%2Fserver%2Fpackage.json)](https://snyk.io/test/github/andrew4699/understand?targetFile=src%2Fserver%2Fpackage.json)

# TODO
## Features
* Offer to load normally (especially if there was an error)
* Stitch all images into 1 to reduce # of API requests
* PDF download progress
* Loading indicators (when scaling & OCR-ing images)
* Fix "All images processed indicator"
* Improve highlight positioning
* Understand local files (file://....) - ask user to select file using <input type="file">, alternative: native app (these 2 are necessary if they don't have "allow file URLs" checked for the extension)

## Developer Tooling
* SCSS pre-processing
* Use a UI library (React?)
* TypeScript on the server
* Unit tests
* Integration tests
* Continuous integration
* Docker

## Other
* Code cleanup

# Design Decisions
### See [this document](/DESIGN_DECISIONS.md) for a list of critical design decisions.